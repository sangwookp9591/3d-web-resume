/* ============================================================================
   pixel-journey — 스크롤이 곧 아잉의 이동인 2D 픽셀 여정 엔진
   ----------------------------------------------------------------------------
   계약은 docs/pixel-journey.md입니다. 규격(1024×512 배경, 지평선 38%, 128×64 지면
   타일, 96×96 스프라이트)과 레이어 속도는 거기서 그대로 가져옵니다.

   이 파일이 하는 일은 하나뿐입니다: 스크롤 위치를 카메라 좌표로 바꾸고 레이어 넷을
   서로 다른 속도로 미는 것. 씬의 글은 서버가 그리고(components/World.jsx) CSS가
   붙잡습니다(app/globals.css의 position:sticky) — 그래서 이 청크가 안 올라와도,
   모션을 줄여 달라고 해도, 다섯 장의 글은 그대로 읽힙니다. 캔버스는 쓰지 않습니다.
   ========================================================================== */

import { sections, AING, AING_POSES, CLOUDS, GROUND } from './worldConfig';

const BG_W = 1024, BG_H = 512;     // 배경 파노라마 원본 규격
const TILE_W = 128, TILE_H = 64;   // ground.webp — 가로 seamless 타일
const HORIZON = 0.38;              // 화면 하단에서 지평선까지. 배경 속 지평선과 같은 값
const SPEED = { sky: 0.2, bg: 0.6, ground: 1, prop: 1.15 };
const WALK_FPS = 8;
const IDLE_MS = 140;               // 이 시간 동안 카메라가 안 움직이면 아잉은 멈춘다
const CLOUD_AT = [0.04, 0.19, 0.31, 0.46, 0.58, 0.73, 0.89];  // 하늘 폭에서의 자리
const CLOUD_UP = [0.62, 0.18, 0.84, 0.35, 0.05, 0.71, 0.28];  // 지평선 위 높이

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mod = (a: number, n: number) => ((a % n) + n) % n;

function el(tag: string, cls: string) { const n = document.createElement(tag); n.className = cls; return n; }

/* 에셋 한 장이 404여도 그 자리만 비고 여정은 이어집니다 — 조용한 빈 화면 대신. */
function pixel(src: string, cls: string) {
  const n = new Image();
  n.alt = ''; n.decoding = 'async'; n.className = cls;
  n.addEventListener('error', () => n.remove());
  n.src = src;
  return n;
}

export default function mountPixelJourney(container: HTMLElement) {
  if (container.dataset.pxMounted) return;

  /* 모션을 줄여 달라고 한 방문자에게는 무대를 아예 짓지 않습니다. 씬을 세로로 쌓아
     읽히게 하는 일은 globals.css의 미디어 쿼리가 서버 렌더 단계에서 이미 끝냈고,
     여기서 더 할 일은 에셋 26장을 내려받지 않는 것뿐입니다. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 스크롤 길이와 씬 경계는 서버가 그린 섹션이 쥐고 있습니다. 없으면 붙을 데가 없습니다.
  const scenes = Array.from(container.querySelectorAll<HTMLElement>('.px-scene'));
  if (scenes.length !== sections.length) {
    // 글은 서버 마크업이라 그대로 읽힙니다. 그림만 없는 것이니 조용히 넘어가지는 않습니다.
    console.warn('[world] 씬 마크업을 찾지 못해 픽셀 무대를 짓지 않습니다:', scenes.length);
    return;
  }
  container.dataset.pxMounted = '1';

  // ---- DOM. 레이어는 무대 밑변에 찍은 0×0 기준점이고, 그림은 거기 매답니다 ----
  const stage = el('div', 'px-stage');
  stage.setAttribute('aria-hidden', 'true');       // 그림입니다. 글은 DOM이 가집니다
  const sky = el('div', 'px-layer');
  const bgLayer = el('div', 'px-layer');
  const ground = el('div', 'px-ground');
  const aing = el('div', 'px-sprite px-aing');
  const propLayer = el('div', 'px-layer');
  ground.style.backgroundImage = `url(${GROUND})`; // 없으면 CSS의 흙색만 남습니다
  stage.append(sky, bgLayer, ground, aing, propLayer, el('div', 'px-scrim'));

  const bgs = sections.map((s) => bgLayer.appendChild(pixel(s.bg, 'px-bg')));
  const frames = AING_POSES.map((p) => aing.appendChild(pixel(AING(p), '')));
  const props = sections.flatMap((s, i) =>
    (s.props || []).map((src, j) => {
      // 소품은 씬 안에서 앞쪽·뒤쪽에 하나씩. 배경의 주 사물(가운데~오른쪽)과 겹치지 않게.
      const node = el('div', 'px-sprite');
      node.appendChild(pixel(src, ''));
      propLayer.appendChild(node);
      return { node, at: i + (j ? 0.74 : 0.26) };
    }));
  const clouds = CLOUD_AT.map((_, i) => {
    const node = el('div', 'px-sprite');
    node.appendChild(pixel(CLOUDS[i % CLOUDS.length], ''));
    return sky.appendChild(node);
  });
  container.prepend(stage);

  // ---- 배치 ----
  let vh = 0, k = 1, sceneW = 0, tops: number[] = [], heights: number[] = [];

  function layout() {
    const vw = window.innerWidth;
    vh = window.innerHeight;
    // 정수배만. 픽셀 격자가 씬마다 같아야 하고, 그러려면 배경·소품·아잉이 같은 k를 씁니다.
    k = clamp(Math.ceil(vh / BG_H), 1, 4);
    const bgW = BG_W * k;
    /* 장소는 다섯이지만 띠는 하나입니다. 이웃한 장은 한 타일만큼 겹쳐 놓고, 뒤에 오는 장의
       왼쪽 끝만 마스크로 흐려 아래 장 위에서 녹습니다(아래 장은 그 구간에서 불투명하므로
       이음매가 뜨지 않습니다). 새벽에서 해질녘까지 하늘색이 다르니, 겹치지 않으면 장소가
       바뀔 때마다 세로줄이 그어집니다. */
    const fade = TILE_W * k;
    const stripW = bgW * sections.length - fade * (sections.length - 1);
    /* 여정의 처음에 첫 장의 왼쪽 끝이, 끝에 다섯째 장의 오른쪽 끝이 화면에 오도록 띠가
       (띠 - 화면 한 폭)만큼 흐르고, 그걸 다섯으로 나눈 것이 씬 하나의 거리입니다. 화면
       폭을 빼지 않으면 마지막 장이 다 지나가 버려 여정이 빈 하늘에서 끝납니다. 씬의
       스크롤 길이를 늘리면 그 장소를 천천히 걸을 뿐, 그림과 글은 그대로 붙어 있습니다. */
    sceneW = (stripW - vw) / (SPEED.bg * sections.length);
    const horizon = Math.round(HORIZON * vh);

    /* 배경 띠는 높이를 정수배로만 키우므로 화면보다 큽니다. 남는 높이를 지평선 비율대로
       위아래에 나눠 흘려서, 배경 속 지평선이 화면 하단 38% — 지면 레이어가 시작하는
       그 선 — 에 정확히 앉게 합니다. 여기가 어긋나면 씬마다 땅이 튑니다. */
    bgLayer.style.bottom = Math.round(HORIZON * (vh - BG_H * k)) + 'px';
    bgs.forEach((n, i) => {
      n.style.left = i * (bgW - fade) + 'px';
      n.style.width = bgW + 'px';
      n.style.height = BG_H * k + 'px';
      n.style.maskImage = i ? `linear-gradient(90deg, transparent, #000 ${fade}px)` : '';
    });

    /* 지면은 타일 한 칸만큼 넓게 깔아 두고 통째로 밀립니다. background-position을 매
       프레임 옮기면 그 띠 전체가 매번 다시 칠해지는데(합성이 아니라 페인트입니다),
       한 번 칠해 놓고 transform으로 미는 쪽은 공짜입니다. */
    ground.style.height = horizon + 'px';
    ground.style.width = vw + TILE_W * k + 'px';
    ground.style.backgroundSize = `${TILE_W * k}px ${TILE_H * k}px`;

    /* 아잉은 화면에 고정된 자리에 서 있고, 지면이 발밑으로 흐릅니다(둘 다 1.0 평면).
       좁은 화면에서는 카피가 아래를 다 덮으므로 지면의 먼 쪽 — 지평선 가까이 — 에 세웁니다.
       거기 서야 글에 가리지 않습니다. */
    const narrow = vw <= 860;
    aing.style.left = Math.round(vw * (narrow ? 0.5 : 0.58)) + 'px';
    aing.style.bottom = Math.round(horizon * (narrow ? 0.9 : 0.32)) + 'px';

    props.forEach((p) => {
      p.node.style.left = Math.round(SPEED.prop * p.at * sceneW) + 'px';
      p.node.style.bottom = Math.round(horizon * 0.1) + 'px';   // 더 가까우니 더 아래
      p.node.style.transform = `scale(${k})`;
    });

    const skyW = SPEED.sky * sceneW * sections.length + vw;
    clouds.forEach((c, i) => {
      c.style.left = Math.round(CLOUD_AT[i] * skyW) + 'px';
      c.style.bottom = Math.round(horizon + CLOUD_UP[i] * (vh - horizon) * 0.8) + 'px';
      c.style.transform = `scale(${k})`;
    });

    measure();
  }

  function measure() {
    const y = window.scrollY;
    tops = scenes.map((s) => s.getBoundingClientRect().top + y);
    heights = scenes.map((s) => s.offsetHeight || 1);
    // 마지막 씬은 무대가 물러나는 한 화면을 품고 있습니다(globals.css). 카메라는 그 앞에서
    // 끝나야 여정의 마지막 장면이 다 나온 채로 세계가 물러갑니다.
    heights[heights.length - 1] = Math.max(1, heights[heights.length - 1] - vh);
  }

  // ---- 프레임 ----
  let cam = 0, dir = 1, lastMove = -1e9, shown = -1, live = false, raf = 0, pose = '';

  function frame(now: number) {
    raf = live ? requestAnimationFrame(frame) : 0;
    const y = window.scrollY;
    let i = 0;
    while (i < scenes.length - 1 && y >= tops[i + 1]) i++;
    // 스크롤 진행도 → 아잉의 x. 씬 경계는 서버가 그린 섹션이 정합니다.
    const next = (i + clamp((y - tops[i]) / heights[i])) * sceneW;
    if (Math.abs(next - cam) > 0.5) { dir = next > cam ? 1 : -1; lastMove = now; }
    cam = next;

    sky.style.transform = `translate3d(${-cam * SPEED.sky}px,0,0)`;
    bgLayer.style.transform = `translate3d(${-cam * SPEED.bg}px,0,0)`;
    propLayer.style.transform = `translate3d(${-cam * SPEED.prop}px,0,0)`;
    ground.style.transform = `translate3d(${-mod(cam * SPEED.ground, TILE_W * k)}px,0,0)`;

    /* 걷기는 스크롤 속도가 아니라 시계가 굴립니다 — 휙 넘겨도 리듬은 8fps 그대로.
       멈추면 idle로 돌아갑니다. 걷기 스프라이트가 없으면 idle이 대신 섭니다. */
    const walking = now - lastMove < IDLE_MS;
    let f = walking ? 1 + (Math.floor(now * WALK_FPS / 1000) % 2) : 0;
    if (!frames[f] || !frames[f].isConnected) f = 0;
    if (f !== shown) {
      frames.forEach((n, j) => { n.style.display = j === f ? 'block' : 'none'; });
      shown = f;
    }
    const t = `scale(${k * dir},${k})`;   // 뒤로 스크롤하면 뒤로 걷습니다
    if (t !== pose) { aing.style.transform = t; pose = t; }
  }

  // 세계가 화면 근처에 없으면 프레임도 돌리지 않습니다.
  const io = new IntersectionObserver(([e]) => {
    live = e.isIntersecting;
    if (live && !raf) raf = requestAnimationFrame(frame);
  }, { rootMargin: '25% 0px' });
  io.observe(container);

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', layout);
  window.addEventListener('load', measure);
  layout();
  // 첫 프레임은 여기서 잡아 둡니다 — io가 먼저 깨어나도 루프가 두 벌 돌지 않게.
  raf = requestAnimationFrame(frame);
}
