// 5 scenes of the glass world. Every number here comes from the resume — no invented metrics.
// Scene art: frosted-glass isometric dioramas (Higgsfield gpt_image_2), camera: dive + aerial connector.

const A = (n) => `./assets/scene-${n}.webp`;
const V = (n) => `./assets/vid/dive-${n}.mp4`;

export const sections = [
  {
    id: 'genesis',
    label: '기원',
    still: A(1),
    clip: V(1),
    accent: '#5BB8E8',
    scroll: 1.5,
    linger: 0.42,
    eyebrow: 'FRONT · 0 → 1',
    title: '언어 14개를 혼자 띄웠다',
    body: '앱 설치 없이 검색으로 들어와, 매장에서 QR을 찍고, 결제까지 끊김 없이 끝나는 웹. 9개월간 저장소의 98%를 커밋하며 단독으로 만들고 운영했습니다.',
    tags: ['Next.js 16 · React 19', '1,947 커밋 / 98%', 'PR 440'],
  },
  {
    id: 'immunity',
    label: '검증',
    still: A(2),
    clip: V(2),
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: 'FRONT · QUALITY',
    title: '플레이크 0으로 굳혔다',
    body: '실서버 대신 의존성 0의 Node mock 서버와 STOMP 스텁을 직접 짰습니다. 하이드레이션 레이스는 sleep으로 덮지 않고 유틸로 없앴습니다.',
    tags: ['--repeat-each=10 burn-in', '외부 의존 0', '방법론 문서화'],
  },
  {
    id: 'gatehouse',
    label: '규율',
    still: A(3),
    clip: V(3),
    accent: '#9B8FE0',
    scroll: 1.45,
    linger: 0.35,
    eyebrow: 'ADMIN · BACK',
    title: '권한을 빠뜨릴 수 없는 구조로',
    body: '페이지마다 흩어진 체크를 훅 하나로 수렴시켰습니다. 그리고 15명이 밟고 서는 공통 기반을 리뷰가 아니라 도구로 집행했습니다.',
    tags: ['RBAC + GBAC + ABAC', 'shared 코어 713커밋', 'ArchUnit · codemod'],
  },
  {
    id: 'observatory',
    label: '지능',
    still: A(4),
    clip: V(4),
    accent: '#6FA8DC',
    scroll: 1.45,
    linger: 0.35,
    eyebrow: 'BACK · PERF · AI',
    title: '느려지는 곳과 멈추는 곳을 같이 막았다',
    body: '재색인 비용을 문서 수가 아니라 chunk 수에 비례하게 바꾸고, LLM은 프로바이더 하나가 죽어도 fallback 체인으로 이어지게 했습니다.',
    tags: ['OpenSearch Bulk API', 'CircuitBreaker 43지점', '호텔 도메인 227커밋'],
  },
  {
    id: 'vault',
    label: '정합성',
    still: A(5),
    clip: V(5),
    accent: '#8E86D8',
    scroll: 1.7,
    linger: 0.5,
    eyebrow: 'BACK · ADMIN',
    title: '돈이 걸린 곳은 유실을 먼저 설계한다',
    body: '쿠폰을 레거시 위에 얹지 않고 Hexagonal 바운디드 컨텍스트로 신설했습니다. 트리거 발급의 유실과 중복은 ShedLock Outbox가 구조에서 막습니다.',
    tags: ['DDD / Hexagonal', 'Outbox + ShedLock', '테스트 101건'],
    cta: {
      primary: { label: '메일 보내기', href: 'mailto:sangwookp9591@gmail.com' },
      secondary: { label: '저장소 기여도 보기', href: '#footprint' },
    },
  },
];

export const connectors = [
  './assets/vid/conn-1.mp4',
  './assets/vid/conn-2.mp4',
  './assets/vid/conn-3.mp4',
  './assets/vid/conn-4.mp4',
];
