/** @type {import('next').NextConfig} */

/* 브라우저에 내려보내는 정책. 이 사이트는 정적 프리렌더라 서버에서 할 수 있는 방어가
   헤더밖에 없습니다. 그래서 여기 있는 것이 방어의 전부입니다.

   ── script-src에 'unsafe-inline'이 남아 있는 이유 ─────────────────────────────
   App Router는 RSC 페이로드를 인라인 <script>로 흘려보냅니다(이 페이지에 3개). 내용이
   빌드마다 바뀌므로 해시로 못 묶고, nonce는 요청마다 달라야 해서 정적 프리렌더를 포기해야
   합니다. 대신 'unsafe-inline'만 두고 해시·nonce는 두지 않습니다 — 섞으면 브라우저가
   'unsafe-inline'을 무시해서 페이지가 통째로 죽습니다.
   이 상태에서도 **다른 출처의 스크립트 로드**는 막힙니다(CDN 탈취, <script src> 주입).
   막지 못하는 것은 인라인 주입인데, 이 사이트에는 사용자 입력을 HTML로 넣는 경로가
   없습니다 — 채팅 답도 innerHTML이 아니라 React 엘리먼트로 짓습니다(Markdown.tsx).

   'wasm-unsafe-eval'은 빼면 안 됩니다. 브라우저 모델을 돌리는 onnxruntime-web이 WebGPU
   경로에서도 WASM을 컴파일합니다. connect-src의 hf.co 계열도 같은 이유입니다 — 좁히면
   모델 내려받기가 조용히 실패하고 방문자는 위키 답만 받게 됩니다. */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  // 인라인 style 속성(--share 같은 CSS 변수)을 쓰므로 스타일 쪽은 열어 둡니다.
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' https://cdn.jsdelivr.net",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "worker-src 'self' blob:",
  // 모델 가중치(huggingface.co → hf.co CDN 리다이렉트)와 로컬 Ollama.
  "connect-src 'self' https://huggingface.co https://*.huggingface.co https://*.hf.co http://localhost:11434",
].join('; ');

/* 나중에 무언가를 붙일 때 여기를 먼저 보세요. Vercel Analytics·Speed Insights처럼 스크립트를
   싣고 자기 도메인으로 보내는 것을 추가하면, script-src와 connect-src에 그 출처를 적기 전까지
   조용히 막힙니다 — 콘솔에만 남고 화면은 멀쩡해 보입니다. */
const security = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // 쓰지 않는 장치는 잠급니다. WebGPU는 Permissions-Policy 대상이 아니라 영향 없습니다.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig = {
  // transformers.js는 서버에서만 쓰는 onnxruntime-node 바이너리를 함께 싣습니다.
  // 여기서는 모델이 브라우저 워커에서 도므로 서버 번들에서 통째로 뺍니다.
  serverExternalPackages: ['@huggingface/transformers'],

  // 어떤 서버인지 광고할 이유가 없습니다.
  poweredByHeader: false,

  async headers() {
    return [
      { source: '/:path*', headers: security },
      {
        /* public/의 파일은 파일명에 해시가 없어서 Next이 max-age=0으로 냅니다. 그대로 두면
           재방문자가 픽셀 26장과 마스코트 40여 장을 매번 조건부 요청으로 다시 물어봅니다 —
           본문이 안 내려와도 왕복은 그대로 듭니다. 이 그림들은 내용이 바뀌면 사실상 새 파일이
           되므로 길게 잡습니다. */
        source: '/:dir(pixel|mascot|assets)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
    ];
  },
};

export default nextConfig;
