// 5 scenes of the pixel journey. Every number here comes from the resume — no invented metrics.
//
// body는 개발자가 아닌 사람이 먼저 읽습니다. 채용 담당자가 다섯 장을 스크롤하면서 "이 사람이
// 무슨 문제를 어떻게 풀었나"를 알 수 있어야 하므로, 본문에는 도구 이름을 쓰지 않고 무슨 일이
// 있었는지만 씁니다. 도구 이름은 아래 tags 칩이 답합니다 — 개발자 리뷰어는 거기를 봅니다.
// Scene art: 16-bit side-scrolling pixel art (docs/pixel-journey.md), camera: walk + parallax.
//
// 다섯 장면의 body는 각자 완결된 카드가 아니라 이어지는 한 편입니다. 그래서 문단 끝마다
// 다음 장면이 왜 필요했는지를 한 줄로 남깁니다. 혼자 만들었으니 검증이 필요했고, 사람이
// 늘었으니 규율이 필요했고, 안 멈추게 만들었으니 안 새게 만들 차례였다는 순서입니다.
// 이 한 줄이 없으면 방문자는 아무 장면에서나 스크롤을 멈춰도 아쉽지 않게 됩니다.
//
// 다만 이 한 줄을 격언으로 쓰지 않습니다. 문단마다 잠언으로 끝나는 글은 사람이 쓴 것처럼
// 읽히지 않습니다. 다음에 무슨 일이 있었는지를 그냥 말하고 넘어갑니다.

const BG = (n: number) => `/pixel/bg-${n}.webp`;
const PROP = (s: number, n: number) => `/pixel/prop-${s}-${n}.webp`;

export const sections = [
  {
    id: 'genesis',
    label: '웹 0→1',
    bg: BG(1),
    props: [PROP(1, 1), PROP(1, 2)],
    accent: '#5BB8E8',
    scroll: 1.5,
    eyebrow: 'Next.js · 14개 언어 · QR 결제',
    title: '앱을 깔기 전에, 웹에서 결제까지 끝나야 했습니다',
    body: '해외 환자에게 앱 설치부터 요구하면 서비스를 써 보기 전에 이탈합니다. 검색으로 병원을 찾고, 매장에서 QR을 찍고, 결제까지 웹에서 끝내도록 전체 흐름을 혼자 만들었습니다. 14개 언어로 출시한 뒤 9개월 동안 직접 운영했습니다.',
    tags: ['14개 언어 지원', '1,947 커밋 (점유율 98%)', 'QR 간편 주문·결제']
  },
  {
    id: 'immunity',
    label: '결제 복구',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: '결제 UX · 실패 경로 설계',
    title: '결제는 끝났는데, 사용자는 길을 잃고 있었습니다',
    body: '뒤로가기를 누르거나 외부 결제창에서 돌아왔을 때 장바구니와 주문 상태가 어긋나는 경우가 있었습니다. 성공 화면만 손보지 않고 취소, 0원 결제, 주문 불가까지 흐름을 다시 연결했습니다. 결제가 어긋나도 사용자는 원래 자리에서 다시 시작할 수 있게 됐습니다.',
    tags: ['취소·0원·주문불가 방어', '로그인 후 원래 화면 복귀', '장바구니 복구']
  },
  {
    id: 'gatehouse',
    label: '팀의 기준',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: 'React · 권한 · 공통 인프라',
    title: '15명이 같은 화면을 만들자, 같은 규칙이 15개가 됐습니다',
    body: '어드민을 만드는 사람이 늘면서 화면마다 권한 확인과 오류 처리가 달라졌습니다. 누락된 화면을 하나씩 고치는 대신 권한은 하나의 훅으로, 오류는 전역 계층으로 모았습니다. 새 화면을 만들어도 같은 실수가 반복되지 않는 기준이 생겼습니다.',
    tags: ['15명 규모 협업', '하이브리드 권한 체계', '공통 코어 인프라 713커밋']
  },
  {
    id: 'observatory',
    label: '멈추지 않기',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: 'OpenSearch · Circuit Breaker · Multi LLM',
    title: '번역 AI 하나가 멈추면, 전체 작업이 멈췄습니다',
    body: '숙소 정보가 한꺼번에 바뀌면 검색이 느려졌고, 외부 번역 AI에 장애가 나면 뒤 작업까지 줄줄이 멈췄습니다. 재색인은 묶어서 처리하고 43개 연동 지점에는 차단 장치와 대체 모델을 붙였습니다. 문제가 생긴 서비스만 멈추고 나머지 흐름은 계속 가게 만들었습니다.',
    tags: ['검색 대량 일괄 처리', '멀티 LLM 장애 격리', '서킷브레이커 43개 지점']
  },
  {
    id: 'vault',
    label: '쿠폰 정합성',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: 'DDD · Hexagonal · Outbox',
    title: '쿠폰은 한 번 더 나가도, 한 번 덜 나가도 문제였습니다',
    body: '쿠폰 발급은 중간에 실패하면 사라질 수 있고, 다시 시도하면 두 번 지급될 수 있습니다. 기존 코드에 조건을 더하는 대신 발급 기록을 먼저 남기고 안전하게 재시도하는 구조로 새로 만들었습니다. 중복과 유실이 생기지 않는지 101개 테스트로 확인했습니다.',
    tags: ['쿠폰 0 → 1 신규 구축', '중복·유실 방지 멱등 설계', '테스트 101건 / 118커밋'],
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
