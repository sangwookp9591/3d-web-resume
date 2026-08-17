// 5 scenes of the pixel journey. Every number here comes from the resume — no invented metrics.
// Scene art: 16-bit side-scrolling pixel art (docs/pixel-journey.md), camera: walk + parallax.
//
// 다섯 장면의 body는 각자 완결된 카드가 아니라 이어지는 한 편입니다. 그래서 문단 끝마다
// 다음 장면이 왜 필요했는지를 한 줄로 남깁니다 — 혼자 만들었으니 검증이 필요했고, 사람이
// 늘었으니 규율이 필요했고, 안 멈추게 만들었으니 안 새게 만들 차례였다는 순서입니다.
// 이 한 줄이 없으면 방문자는 아무 장면에서나 스크롤을 멈춰도 아쉽지 않게 됩니다.

const BG = (n: number) => `/pixel/bg-${n}.webp`;
const PROP = (s: number, n: number) => `/pixel/prop-${s}-${n}.webp`;

export const sections = [
  {
    id: 'genesis',
    label: '기원',
    bg: BG(1),
    props: [PROP(1, 1), PROP(1, 2)],
    accent: '#5BB8E8',
    scroll: 1.5,
    eyebrow: 'FRONT · 0 → 1',
    title: '언어 14개를 혼자 띄웠다',
    body: '앱을 깔지 않고 검색으로 들어와, 매장에서 QR을 찍고, 결제까지 웹에서 끝납니다. 9개월 동안 저장소 커밋의 98%를 찍으며 혼자 만들고 운영했습니다. 혼자 만든다는 건, 잘못돼도 말해 줄 사람이 없다는 뜻이기도 했습니다.',
    tags: ['Next.js 16 · React 19', '1,947 커밋 / 98%', 'PR 440'],
  },
  {
    id: 'immunity',
    label: '검증',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: 'FRONT · QUALITY',
    title: '플레이크 0으로 굳혔다',
    body: '그래서 확인을 사람이 아니라 기계에 맡겼습니다. 실서버를 붙이는 대신 의존성 0의 Node mock 서버와 STOMP 스텁을 직접 짰고, 하이드레이션 레이스는 sleep으로 덮지 않고 유틸로 없앴습니다. 혼자일 때 통하던 방식은, 밟고 서는 사람이 열다섯으로 늘면서 다시 시험대에 올랐습니다.',
    tags: ['--repeat-each=10 burn-in', '외부 의존 0', '방법론 문서화'],
  },
  {
    id: 'gatehouse',
    label: '규율',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: 'ADMIN · BACK',
    title: '권한을 빠뜨릴 수 없는 구조로',
    body: '페이지마다 흩어져 있던 권한 체크를 훅 하나로 모았습니다. 한 곳이라도 빠뜨리면 그게 곧 데이터 유출이라, 사람 기억이 아니라 구조가 막아야 했습니다. 공통 기반도 같은 원칙으로 — 리뷰가 아니라 도구가 집행합니다. 그다음 문제는 사람이 아니라 트래픽 쪽에서 왔습니다.',
    tags: ['RBAC + GBAC + ABAC', 'shared 코어 713커밋', 'ArchUnit · codemod'],
  },
  {
    id: 'observatory',
    label: '지능',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: 'BACK · PERF · AI',
    title: '느려지는 곳과 멈추는 곳을 같이 막았다',
    body: '재색인 비용을 문서 수가 아니라 chunk 수에 비례하게 바꿨습니다. LLM은 프로바이더 하나가 죽어도 fallback 체인으로 이어지게 했고요. 안 멈추게 만들고 나니, 남은 건 안 새게 만드는 일이었습니다.',
    tags: ['OpenSearch Bulk API', 'CircuitBreaker 43지점', '호텔 도메인 227커밋'],
  },
  {
    id: 'vault',
    label: '정합성',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: 'BACK · ADMIN',
    title: '돈이 걸린 곳은 유실을 먼저 설계한다',
    body: '쿠폰은 레거시 위에 얹지 않고 Hexagonal 바운디드 컨텍스트로 새로 세웠습니다. 트리거 발급의 유실과 중복은 ShedLock Outbox가 구조에서 막습니다. 여기까지가 9개월입니다. 나머지가 궁금하면 메일을 주세요.',
    tags: ['DDD / Hexagonal', 'Outbox + ShedLock', '테스트 101건'],
    cta: {
      primary: { label: '메일 보내기', href: 'mailto:sangwookp9591@gmail.com' },
      secondary: { label: '저장소 기여도 보기', href: '#footprint' },
    },
  },
];

// 아잉 스프라이트와 공용 타일. 씬에 묶이지 않고 여정 내내 쓰입니다.
export const AING_POSES = ['idle', 'walk-1', 'walk-2'];
export const AING = (pose: string) => `/pixel/aing-${pose}.webp`;
export const CLOUDS = ['/pixel/cloud-1.webp', '/pixel/cloud-2.webp'];
export const GROUND = '/pixel/ground.webp';
