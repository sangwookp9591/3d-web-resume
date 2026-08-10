/* Biomorphic morph field — 검색창이 채팅창으로 "자라는" 물리.
   파티클 수만 개가 rounded-rect 둘레를 목표로 모여 막을 만들고, DOM 패널은 같은
   형태로 clip-path만 바뀝니다(리플로 0). 위치·속도 계산은 전부 WebGPU 컴퓨트 셰이더가 합니다.

   원리는 사용자가 준 biomorphic-chat 데모에서 가져왔고, 앵커를 우하단에서 화면 중앙으로,
   색을 이 사이트의 하늘 팔레트로 바꿨습니다. WebGL2 GPGPU 폴백은 들어내고 CSS 폴백만 둡니다. */

const CFG = {
  collapsed: { hx: 360, hy: 50, r: 28 },    // 검색창 (반폭/반높이/코너R)
  expanded:  { hx: 412, hy: 286, r: 28 },   // 채팅창
  edgeRatio: 0.58,                          // 외곽선 파티클 비율
  count: { webgpu: 16000, reduced: 3000 },
  cell: 18,                                 // 밀도 그리드 셀 (CSS px)
};

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
const smoothRange = (v, a, b) => smooth((v - a) / (b - a || 1e-6));
const mix = (a, b, t) => a + (b - a) * t;

/* ── 형태 ────────────────────────────────────────────────────────────────
   morph m∈[0,1] → 현재 반폭/반높이/코너R. 폭이 먼저 벌어지고 높이가 뒤따르며,
   중간에 살짝 부풀어서(bulge) 상자가 늘어나는 게 아니라 자라는 것처럼 보입니다. */
const Shape = {
  collapsed: { ...CFG.collapsed },
  expanded: { ...CFG.expanded },
  anchor: { x: 0, y: 0 },   // 도형 중심 (화면 좌표, y-down)

  dims(m) {
    const C = Shape.collapsed, E = Shape.expanded;
    const ew = smoothRange(m, 0.0, 0.78);
    const eh = smoothRange(m, 0.16, 1.0);
    return {
      hx: mix(C.hx, E.hx, ew + 0.075 * Math.sin(Math.PI * ew)),
      hy: mix(C.hy, E.hy, eh + 0.055 * Math.sin(Math.PI * eh)),
      r: mix(C.r, E.r, eh),
    };
  },

  resize(w, h) {
    const mg = w < 560 ? 14 : 28;
    const maxHx = (w - mg * 2) / 2;
    Shape.collapsed.hx = Math.min(CFG.collapsed.hx, maxHx);
    Shape.collapsed.hy = CFG.collapsed.hy;
    Shape.expanded.hx = Math.min(CFG.expanded.hx, maxHx);
    Shape.expanded.hy = Math.min(CFG.expanded.hy, (h - mg * 2 - 12) / 2);
    Shape.anchor.x = w / 2;
    Shape.anchor.y = h / 2;
  },
};

const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 시뮬레이션 상태 ─────────────────────────────────────────────────────
   React state와 분리된 가변 객체입니다. 매 프레임 리렌더를 유발하지 않습니다. */
const Sim = {
  w: 0, h: 0, dpr: 1, time: 0,
  morph: 0, morphVel: 0, morphTarget: 0,
  morphBody: 0,   // DOM 상자가 파티클보다 앞서 튀어나오지 않게 지연 추종
  pointer: { x: -9999, y: -9999, active: 0, strength: 760 },
  wave: { x: 0, y: 0, t: 99, amp: 0 },
  agitation: 0, agitationTarget: 0,
  reduced: 0,

  step(dt) {
    this.time += dt;
    // 스프링. 목표가 도중에 뒤집혀도 현재 진행률에서 자연스럽게 방향을 틉니다.
    const k = this.reduced ? 150 : 40;
    const c = 2 * Math.sqrt(k);
    // 저프레임에서 c*dt > 1이면 명시적 오일러가 발산하므로 고정 서브스텝으로 나눕니다.
    const sub = Math.min(8, Math.max(1, Math.ceil(dt / 0.008)));
    const h = dt / sub;
    for (let i = 0; i < sub; i++) {
      this.morphVel = (this.morphVel + (this.morphTarget - this.morph) * k * h) / (1 + c * h);
      this.morph += this.morphVel * h;
    }
    if (Math.abs(this.morphTarget - this.morph) < 4e-4 && Math.abs(this.morphVel) < 4e-3) {
      this.morph = this.morphTarget; this.morphVel = 0;
    }
    this.morph = clamp(this.morph, -0.04, 1.04);

    // 열 때는 파티클이 도착할 시간을 벌고, 닫을 때는 경계가 먼저 무너지게.
    const tau = this.reduced ? 0.02 : (this.morphTarget > 0.5 ? 0.17 : 0.085);
    this.morphBody += (this.morph - this.morphBody) * Math.min(1, dt / tau);

    this.wave.t += dt;
    this.wave.amp *= Math.pow(0.02, dt);
    if (this.wave.amp < 1) this.wave.amp = 0;
    this.agitation += (this.agitationTarget - this.agitation) * Math.min(1, dt * 4.5);
  },

  emitWave(x, y, amp = 2400) {
    this.wave.x = x; this.wave.y = y; this.wave.t = 0; this.wave.amp = amp;
  },
};

/* ── 파티클 초기 데이터: [pos.xy, vel.xy, u, s, seed, edge] ─────────────── */
const PHI_INV = 0.6180339887498949;

function makeParticles(n, cx, cy) {
  const a = new Float32Array(n * 8);
  for (let i = 0; i < n; i++) {
    const o = i * 8;
    // 품질 저하 시 앞에서 N개만 그리므로, 어떤 prefix를 잘라도 둘레 분포가 고르도록
    // 순차 분할이 아니라 황금비 수열을 씁니다.
    a[o + 0] = cx + (Math.random() - 0.5) * 260;
    a[o + 1] = cy + (Math.random() - 0.5) * 60;
    a[o + 4] = (i * PHI_INV) % 1;                 // u: 둘레 파라미터
    a[o + 5] = Math.pow(Math.random(), 0.34);     // s: 외곽 쪽으로 편향된 내부 반경
    a[o + 6] = Math.random();                     // seed
    a[o + 7] = (i % 100) < CFG.edgeRatio * 100 ? 1 : 0;
  }
  return a;
}

const WGSL_SIM = /* wgsl */ `
const PI : f32 = 3.14159265359;
struct Particle { pos: vec2f, vel: vec2f, uv: vec2f, aux: vec2f };
struct Params {
  res: vec4f, shape: vec4f, anchor: vec4f, pointer: vec4f,
  wave: vec4f, misc: vec4f, grid: vec4f,
};
@group(0) @binding(0) var<uniform> P : Params;
@group(0) @binding(1) var<storage, read_write> parts : array<Particle>;
@group(0) @binding(2) var<storage, read_write> grid  : array<atomic<u32>>;

fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 = p3 + dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
fn vnoise(p: vec2f) -> f32 {
  let i = floor(p); let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2f(1.0, 0.0)), u.x),
             mix(hash21(i + vec2f(0.0, 1.0)), hash21(i + vec2f(1.0, 1.0)), u.x), u.y);
}
fn fbm(p: vec2f) -> f32 {
  var v = 0.0; var amp = 0.5; var q = p;
  for (var i = 0; i < 3; i++) { v = v + amp * vnoise(q); q = q * 2.03 + vec2f(11.7, 3.1); amp = amp * 0.5; }
  return v;
}
/* 발산 0인 curl 필드 → 유체 같은 흐름 */
fn curl2(p: vec2f, t: f32) -> vec2f {
  let e = 0.35;
  let q = p + vec2f(t * 0.055, -t * 0.042);
  return vec2f((fbm(q + vec2f(0.0, e)) - fbm(q - vec2f(0.0, e))) / (2.0 * e),
              -(fbm(q + vec2f(e, 0.0)) - fbm(q - vec2f(e, 0.0))) / (2.0 * e));
}

/* rounded-rect 둘레를 u∈[0,1)로 파라미터화 — 검색창과 채팅창이 연속으로 대응됩니다 */
fn shapePoint(uIn: f32, hx: f32, hy: f32, r: f32) -> vec2f {
  let ax = max(hx - r, 0.0);
  let ay = max(hy - r, 0.0);
  let Lv = 2.0 * ay; let Lh = 2.0 * ax; let La = 0.5 * PI * r;
  let rr = max(r, 1e-5);
  var d = fract(uIn) * (2.0 * Lv + 2.0 * Lh + 4.0 * La);
  if (d < Lv) { return vec2f(hx, -ay + d); }
  d = d - Lv;
  if (d < La) { let a = d / rr;            return vec2f( ax + rr * cos(a),  ay + rr * sin(a)); }
  d = d - La;
  if (d < Lh) { return vec2f(ax - d, hy); }
  d = d - Lh;
  if (d < La) { let a = 0.5 * PI + d / rr; return vec2f(-ax + rr * cos(a),  ay + rr * sin(a)); }
  d = d - La;
  if (d < Lv) { return vec2f(-hx, ay - d); }
  d = d - Lv;
  if (d < La) { let a = PI + d / rr;       return vec2f(-ax + rr * cos(a), -ay + rr * sin(a)); }
  d = d - La;
  if (d < Lh) { return vec2f(-ax + d, -hy); }
  d = d - Lh;
  let a = 1.5 * PI + d / rr;
  return vec2f(ax + rr * cos(a), -ay + rr * sin(a));
}

fn targetOf(p: Particle, t: f32) -> vec2f {
  let hx = P.shape.x; let hy = P.shape.y; let r = P.shape.z; let m = P.shape.w;
  let seed = p.aux.x; let edge = p.aux.y;
  let s  = select(p.uv.y, 1.0, edge > 0.5);
  let ph = seed * 6.2831853;
  // 둘레 위치가 미세하게 표류 → 고정된 도형이 아니라 살아있는 막
  let bp = shapePoint(p.uv.x + 0.016 * sin(t * 0.27 + ph * 4.0) * mix(1.0, 0.4, m), hx, hy, r);
  let breathe = 1.0 + 0.042 * sin(t * 1.15 + ph * 3.0) * mix(1.0, 0.30, m);
  let local = bp * s * breathe;                    // 앵커가 도형 중심입니다
  return vec2f(P.anchor.x + local.x, P.anchor.y - local.y);
}

@compute @workgroup_size(64)
fn scatterMain(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= u32(P.misc.x)) { return; }
  let p = parts[i];
  let gw = i32(P.grid.x); let gh = i32(P.grid.y); let cs = P.grid.z;
  let cx = clamp(i32(floor(p.pos.x / cs)), 0, gw - 1);
  let cy = clamp(i32(floor(p.pos.y / cs)), 0, gh - 1);
  atomicAdd(&grid[cy * gw + cx], 1u);
}

@compute @workgroup_size(64)
fn simMain(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= u32(P.misc.x)) { return; }
  var p = parts[i];

  let dt = clamp(P.anchor.w, 0.0005, 0.033);
  let t  = P.res.w;
  let m  = P.shape.w;
  let seed = p.aux.x;
  let reduced = P.misc.z;
  let agit = P.misc.w;

  let tgt = targetOf(p, t);
  let dvec = tgt - p.pos;
  let dist = length(dvec) + 1e-4;
  let dir  = dvec / dist;

  // (a) 목표를 향한 인력 — 개체마다 강성이 달라 도착 타이밍이 흩어집니다
  let kAtt = mix(62.0, 86.0, m) * (0.72 + 0.62 * hash21(vec2f(seed * 91.3, 17.7)))
           * (1.0 + reduced * 1.6);
  var acc = dir * min(dist, 420.0) * kAtt;

  // (b) 도착 감속: 가까울수록 감쇠를 키웁니다 (관성은 남깁니다)
  let damp = 5.2 + 10.0 * (1.0 - smoothstep(0.0, 160.0, dist));

  // (c) curl noise — 전이 중에는 격렬, 정착 후에는 잔잔
  let flowAmp = mix(34.0 + 300.0 * abs(P.anchor.z) + 150.0 * agit, 14.0, reduced) * mix(1.0, 0.42, m);
  acc = acc + curl2(p.pos * 0.011, t) * flowAmp;

  // (d) 파티클 간 응집/반발 — 저해상도 밀도 그리드의 기울기로 O(N) 근사
  let gw = i32(P.grid.x); let gh = i32(P.grid.y); let cs = P.grid.z;
  let gx = i32(floor(p.pos.x / cs)); let gy = i32(floor(p.pos.y / cs));
  var g = vec2f(0.0); var den = 0.0;
  for (var oy = -1; oy <= 1; oy++) {
    for (var ox = -1; ox <= 1; ox++) {
      let cx = clamp(gx + ox, 0, gw - 1);
      let cy = clamp(gy + oy, 0, gh - 1);
      let v = f32(atomicLoad(&grid[cy * gw + cx]));
      den = den + v;
      g = g + vec2f(f32(ox), f32(oy)) * v;
    }
  }
  let glen = length(g);
  if (glen > 1.0) {
    let n = g / glen;
    acc = acc + n * (30.0 * smoothstep(110.0, 8.0, den) - P.grid.w * min(den, 1200.0));
  }

  // (e) 포인터 — 접혀 있으면 호기심(끌림)+소용돌이, 펼쳐지면 부드러운 회피
  if (P.pointer.z > 0.5) {
    let pd = p.pos - P.pointer.xy;
    let pl = length(pd) + 1e-4;
    let infl = exp(-(pl * pl) / (2.0 * 120.0 * 120.0));
    acc = acc + (pd / pl) * mix(-1.0, 0.5, m) * infl * P.pointer.w;
    acc = acc + vec2f(-pd.y, pd.x) / pl * infl * 130.0 * (1.0 - m);
  }

  // (f) 클릭 충격파
  if (P.wave.w > 0.5) {
    let wd = p.pos - P.wave.xy;
    let wl = length(wd) + 1e-4;
    let z = (wl - P.wave.z * 780.0) / 52.0;   // pow(음수,2)는 WGSL에서 미정의 — 직접 제곱
    acc = acc + (wd / wl) * exp(-z * z) * P.wave.w;
  }

  acc = acc - p.vel * damp;
  p.vel = p.vel + acc * dt;
  let sp = length(p.vel);
  if (sp > 1700.0) { p.vel = p.vel / sp * 1700.0; }
  p.pos = p.pos + p.vel * dt;

  let pad = 40.0;
  if (p.pos.x < -pad) { p.pos.x = -pad; p.vel.x = abs(p.vel.x) * 0.35; }
  if (p.pos.y < -pad) { p.pos.y = -pad; p.vel.y = abs(p.vel.y) * 0.35; }
  if (p.pos.x > P.res.x + pad) { p.pos.x = P.res.x + pad; p.vel.x = -abs(p.vel.x) * 0.35; }
  if (p.pos.y > P.res.y + pad) { p.pos.y = P.res.y + pad; p.vel.y = -abs(p.vel.y) * 0.35; }

  parts[i] = p;
}
`;

const WGSL_DRAW = /* wgsl */ `
struct Particle { pos: vec2f, vel: vec2f, uv: vec2f, aux: vec2f };
struct Params { res: vec4f, shape: vec4f, anchor: vec4f, pointer: vec4f, wave: vec4f, misc: vec4f, grid: vec4f };
@group(0) @binding(0) var<uniform> P : Params;
@group(0) @binding(1) var<storage, read> parts : array<Particle>;
struct VSOut { @builtin(position) pos: vec4f, @location(0) quad: vec2f, @location(1) col: vec4f };

@vertex
fn vsMain(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VSOut {
  var Q = array<vec2f, 6>(
    vec2f(-1.0,-1.0), vec2f(1.0,-1.0), vec2f(-1.0,1.0),
    vec2f(-1.0, 1.0), vec2f(1.0,-1.0), vec2f( 1.0,1.0));
  let c = Q[vi];
  let p = parts[ii];
  let m = P.shape.w;
  let sp = length(p.vel);

  var size = mix(4.6, 3.9, m) * (0.62 + 0.62 * p.aux.x);
  if (p.aux.y < 0.5) { size = size * 0.85; }
  size = size * mix(1.0, 1.5, clamp(sp / 700.0, 0.0, 1.0));

  let px = p.pos + c * size;
  let ndc = vec2f(px.x / P.res.x * 2.0 - 1.0, 1.0 - px.y / P.res.y * 2.0);

  // 하늘 팔레트: 잔잔하면 얼음빛, 빠르게 움직이면 라벤더로
  let hot = clamp(sp / 640.0, 0.0, 1.0);
  let base = mix(vec3f(0.42, 0.76, 0.92), vec3f(0.60, 0.52, 0.90), hot);

  var a = mix(0.20, 0.34, m);
  if (p.aux.y < 0.5) { a = a * mix(0.75, 0.10, m); }   // 펼쳐지면 내부 파티클은 사라져 글이 읽힙니다

  var o : VSOut;
  o.pos = vec4f(ndc, 0.0, 1.0);
  o.quad = c;
  o.col = vec4f(base, a);
  return o;
}

@fragment
fn fsMain(in: VSOut) -> @location(0) vec4f {
  let d = dot(in.quad, in.quad);
  if (d > 1.0) { discard; }
  let e = (exp(-d * 9.0) + exp(-d * 2.0) * 0.20) * in.col.a;
  return vec4f(in.col.rgb * e, e);
}
`;

const WGSL_POST = /* wgsl */ `
@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var tex  : texture_2d<f32>;
struct PO { @builtin(position) pos: vec4f, @location(0) uv: vec2f };

@vertex
fn vsPost(@builtin(vertex_index) vi: u32) -> PO {
  var V = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
  let c = V[vi];
  var o : PO;
  o.pos = vec4f(c, 0.0, 1.0);
  o.uv = vec2f((c.x + 1.0) * 0.5, 1.0 - (c.y + 1.0) * 0.5);
  return o;
}

/* 메타볼 임계: 밀집한 파티클이 연속된 막으로 결합해 보이게 합니다.
   원본은 어두운 배경 위 발광이었는데, 이 사이트는 밝은 하늘이라 막을 진하게 깔고
   가장자리만 희게 남겨야 형태가 보입니다. */
@fragment
fn fsPost(in: PO) -> @location(0) vec4f {
  let c = textureSample(tex, samp, in.uv);
  let f = c.a;
  let hue = c.rgb / max(f, 1e-4);
  let g = 1.0 - exp(-f * 1.6);
  let rim      = smoothstep(0.10, 0.46, g) * (1.0 - smoothstep(0.56, 0.99, g));
  let membrane = smoothstep(0.44, 0.97, g);

  let INK = vec3f(0.18, 0.16, 0.42);
  var col = mix(hue * 0.92, INK, membrane * 0.55);
  col = col + vec3f(1.0, 1.0, 1.0) * rim * 0.42;
  let a = clamp(g * 0.92, 0.0, 0.86);
  return vec4f(col * a, a);
}
`;

class Backend {
  static async create(canvas) {
    if (!navigator.gpu) throw new Error('WebGPU 미지원');
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('GPUAdapter 없음');
    const device = await adapter.requestDevice();
    // 셰이더·파이프라인 생성은 예외를 던지지 않으므로 error scope로 명시적으로 검증합니다.
    device.pushErrorScope('validation');
    const be = new Backend(canvas, device);
    const err = await device.popErrorScope();
    if (err) { device.destroy(); throw new Error('WGSL: ' + err.message.split('\n')[0]); }
    return be;
  }

  constructor(canvas, device) {
    this.canvas = canvas;
    this.device = device;
    this.ctx = canvas.getContext('webgpu');
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.ctx.configure({ device, format: this.format, alphaMode: 'premultiplied' });

    this.count = Sim.reduced ? CFG.count.reduced : CFG.count.webgpu;
    this.uni = new Float32Array(28);
    this.uniBuf = device.createBuffer({ size: 28 * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    const d = device;
    const simMod = d.createShaderModule({ code: WGSL_SIM });
    const drawMod = d.createShaderModule({ code: WGSL_DRAW });
    const postMod = d.createShaderModule({ code: WGSL_POST });

    this.simLayout = d.createBindGroupLayout({ entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
    ] });
    const simPL = d.createPipelineLayout({ bindGroupLayouts: [this.simLayout] });
    this.scatterPipe = d.createComputePipeline({ layout: simPL, compute: { module: simMod, entryPoint: 'scatterMain' } });
    this.simPipe = d.createComputePipeline({ layout: simPL, compute: { module: simMod, entryPoint: 'simMain' } });

    this.drawLayout = d.createBindGroupLayout({ entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
    ] });
    this.drawPipe = d.createRenderPipeline({
      layout: d.createPipelineLayout({ bindGroupLayouts: [this.drawLayout] }),
      vertex: { module: drawMod, entryPoint: 'vsMain' },
      fragment: { module: drawMod, entryPoint: 'fsMain', targets: [{
        format: 'rgba16float',
        blend: {
          color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        },
      }] },
      primitive: { topology: 'triangle-list' },
    });

    this.postLayout = d.createBindGroupLayout({ entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
    ] });
    this.postPipe = d.createRenderPipeline({
      layout: d.createPipelineLayout({ bindGroupLayouts: [this.postLayout] }),
      vertex: { module: postMod, entryPoint: 'vsPost' },
      fragment: { module: postMod, entryPoint: 'fsPost', targets: [{ format: this.format }] },
      primitive: { topology: 'triangle-list' },
    });
    this.sampler = d.createSampler({ magFilter: 'linear', minFilter: 'linear' });

    const data = makeParticles(this.count, Shape.anchor.x, Shape.anchor.y);
    this.partBuf = d.createBuffer({ size: data.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    d.queue.writeBuffer(this.partBuf, 0, data);
  }

  resize(w, h, dpr) {
    const d = this.device;
    const pw = Math.max(1, Math.floor(w * dpr));
    const ph = Math.max(1, Math.floor(h * dpr));
    this.canvas.width = pw; this.canvas.height = ph;

    // 오프스크린은 절반 해상도 — 업샘플이 곧 부드러운 블러 역할을 합니다
    this.offTex?.destroy?.();
    this.offTex = d.createTexture({
      size: [Math.max(1, pw >> 1), Math.max(1, ph >> 1)],
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.offView = this.offTex.createView();
    this.postBG = d.createBindGroup({ layout: this.postLayout, entries: [
      { binding: 0, resource: this.sampler },
      { binding: 1, resource: this.offView },
    ] });

    this.gw = Math.max(1, Math.ceil(w / CFG.cell));
    this.gh = Math.max(1, Math.ceil(h / CFG.cell));
    this.gridBuf?.destroy?.();
    this.gridBuf = d.createBuffer({ size: this.gw * this.gh * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });

    this.simBG = d.createBindGroup({ layout: this.simLayout, entries: [
      { binding: 0, resource: { buffer: this.uniBuf } },
      { binding: 1, resource: { buffer: this.partBuf } },
      { binding: 2, resource: { buffer: this.gridBuf } },
    ] });
    this.drawBG = d.createBindGroup({ layout: this.drawLayout, entries: [
      { binding: 0, resource: { buffer: this.uniBuf } },
      { binding: 1, resource: { buffer: this.partBuf } },
    ] });
  }

  frame(dt, dims) {
    const d = this.device;
    const u = this.uni;
    u[0] = Sim.w; u[1] = Sim.h; u[2] = Sim.dpr; u[3] = Sim.time;
    u[4] = dims.hx; u[5] = dims.hy; u[6] = dims.r; u[7] = Sim.morph;
    u[8] = Shape.anchor.x; u[9] = Shape.anchor.y; u[10] = Sim.morphVel; u[11] = dt;
    u[12] = Sim.pointer.x; u[13] = Sim.pointer.y; u[14] = Sim.pointer.active; u[15] = Sim.pointer.strength;
    u[16] = Sim.wave.x; u[17] = Sim.wave.y; u[18] = Sim.wave.t; u[19] = Sim.wave.amp;
    u[20] = this.count; u[21] = 0; u[22] = Sim.reduced; u[23] = Sim.agitation;
    u[24] = this.gw; u[25] = this.gh; u[26] = CFG.cell; u[27] = 0.42;
    d.queue.writeBuffer(this.uniBuf, 0, u);

    const enc = d.createCommandEncoder();
    enc.clearBuffer(this.gridBuf);
    const wg = Math.ceil(this.count / 64);
    const cpass = enc.beginComputePass();
    cpass.setPipeline(this.scatterPipe); cpass.setBindGroup(0, this.simBG); cpass.dispatchWorkgroups(wg);
    cpass.setPipeline(this.simPipe); cpass.setBindGroup(0, this.simBG); cpass.dispatchWorkgroups(wg);
    cpass.end();

    const rp = enc.beginRenderPass({ colorAttachments: [{
      view: this.offView, clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }] });
    rp.setPipeline(this.drawPipe); rp.setBindGroup(0, this.drawBG); rp.draw(6, this.count);
    rp.end();

    const pp = enc.beginRenderPass({ colorAttachments: [{
      view: this.ctx.getCurrentTexture().createView(),
      clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }] });
    pp.setPipeline(this.postPipe); pp.setBindGroup(0, this.postBG); pp.draw(3, 1);
    pp.end();

    d.queue.submit([enc.finish()]);
  }

  destroy() { this.device.destroy(); }
}

/**
 * 캔버스와 패널을 물려주면, 패널의 clip-path와 CSS 변수(--rev-*)를 매 프레임 갱신합니다.
 * @returns {{open(): void, close(): void, toggle(): void, destroy(): void, gpu: boolean}}
 */
export default async function mountMorph(canvas, panel, { onReveal } = {}) {
  Sim.reduced = prefersReduced() ? 1 : 0;
  Shape.resize(innerWidth, innerHeight);

  let backend = null;
  try {
    backend = await Backend.create(canvas);
  } catch (e) {
    // WebGPU가 없거나 셰이더가 거부되면 CSS 전환만으로 모양을 바꿉니다.
    console.warn('[morph] GPU 없이 진행합니다:', e.message);
    canvas.style.display = 'none';
  }

  const resize = () => {
    Sim.w = innerWidth; Sim.h = innerHeight;
    Sim.dpr = Math.min(devicePixelRatio || 1, 2);
    Shape.resize(Sim.w, Sim.h);
    backend?.resize(Sim.w, Sim.h, Sim.dpr);
    // CSS는 판/바의 크기를 여기서만 받습니다 — 두 곳에 같은 숫자를 적어두면 반드시 어긋납니다.
    panel.style.setProperty('--panel-w', `${Shape.expanded.hx * 2}px`);
    panel.style.setProperty('--panel-h', `${Shape.expanded.hy * 2}px`);
    panel.style.setProperty('--bar-w', `${Shape.collapsed.hx * 2}px`);
    panel.style.setProperty('--bar-h', `${Shape.collapsed.hy * 2}px`);
  };
  addEventListener('resize', resize);
  resize();

  const onMove = (e) => {
    Sim.pointer.x = e.clientX; Sim.pointer.y = e.clientY; Sim.pointer.active = 1;
  };
  const onLeave = () => { Sim.pointer.active = 0; };
  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerleave', onLeave, { passive: true });

  /* DOM에 반영. 패널은 항상 확장 크기로 두고 clip-path만 바꾸므로 레이아웃이 안 움직입니다. */
  let lastRev = -1;
  const applyDOM = () => {
    const m = clamp01(Sim.morphBody);
    const dims = Shape.dims(m);
    const EW = Shape.expanded.hx * 2, EH = Shape.expanded.hy * 2;
    const insetX = Math.max(0, (EW - dims.hx * 2) / 2);
    const insetY = Math.max(0, (EH - dims.hy * 2) / 2);
    const s = panel.style;
    s.clipPath = `inset(${insetY.toFixed(2)}px ${insetX.toFixed(2)}px round ${dims.r.toFixed(2)}px)`;

    // 몸체 알파: 중간에 옅어졌다가(=파티클로 분해) 다시 결합합니다
    s.setProperty('--panel-a', (mix(0.92, 0.96, m) * (1 - 0.55 * Math.sin(Math.PI * m))).toFixed(3));
    // 외곽이 파티클로 거의 완성된 뒤에야 내용이 등장하도록 늦은 구간에 배치
    s.setProperty('--rev-bar', (1 - smoothRange(m, 0.04, 0.26)).toFixed(3));
    s.setProperty('--rev-head', smoothRange(m, 0.72, 0.92).toFixed(3));
    s.setProperty('--rev-body', smoothRange(m, 0.84, 0.99).toFixed(3));
    s.setProperty('--rev-foot', smoothRange(m, 0.90, 1.00).toFixed(3));

    const rev = m > 0.94 ? 1 : 0;
    if (rev !== lastRev) { lastRev = rev; onReveal?.(rev === 1); }
  };

  let raf = 0, last = performance.now(), alive = true;
  let fpsAcc = 0, fpsN = 0, slow = 0;
  const loop = (now) => {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05;     // 탭 복귀 후 폭주 방지
    if (dt <= 0) return;

    Sim.step(dt);
    applyDOM();
    if (backend) {
      backend.frame(dt, Shape.dims(clamp01(Sim.morph)));
      // 적응형 품질: 계속 느리면 파티클을 줄입니다
      fpsAcc += dt; fpsN++;
      if (fpsAcc >= 0.5) {
        const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0;
        if (fps < 45 && backend.count > 4000 && ++slow >= 2) {
          backend.count = Math.floor(backend.count * 0.72); slow = 0;
        } else if (fps >= 45) slow = 0;
      }
    }
  };
  raf = requestAnimationFrame(loop);

  const setTarget = (v) => {
    Sim.morphTarget = v;
    Sim.agitationTarget = v;
    Sim.emitWave(Shape.anchor.x, Shape.anchor.y, v ? 2600 : 1800);
  };

  return {
    gpu: !!backend,
    open() { setTarget(1); },
    close() { setTarget(0); },
    toggle() { setTarget(Sim.morphTarget > 0.5 ? 0 : 1); },
    stir(amount) { Sim.agitationTarget = clamp01(amount); },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerleave', onLeave);
      backend?.destroy();
    },
  };
}
