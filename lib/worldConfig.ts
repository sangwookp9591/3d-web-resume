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
    label: '출시 순서',
    bg: BG(1),
    props: [PROP(1, 1), PROP(1, 2)],
    accent: '#5BB8E8',
    scroll: 1.5,
    eyebrow: 'ZIVO 웹 · 제품 0 → 1',
    title: '앱보다 웹을 먼저 냈다',
    body: '해외 환자와 여행객이 검색으로 들어오고, 매장에서는 QR을 찍어 주문과 결제까지 끝내야 했습니다. 시장을 확인하기 전에 앱부터 만들면 배포와 설치가 제품 검증보다 앞서게 됩니다. 그래서 먼저 웹을 제품으로 만들고 9개월 동안 혼자 운영했습니다. 14개 언어는 그 판단의 결과이지, 시작점은 아니었습니다.',
    tags: ['Next.js 16 · React 19', 'URL locale 14개', '1,947 커밋 / 98%'],
  },
  {
    id: 'immunity',
    label: '결제 복구',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: '결제 · 장바구니 · E2E',
    title: '결제창에서 돌아온 사람을 놓치지 않기',
    body: '뒤로가기로 결제를 취소한 사람, 0원 결제, 주문을 받을 수 없는 매장, 인앱 브라우저에서 로그인하다가 바깥 브라우저로 넘어간 사람까지 모두 다른 실패였습니다. 세션에 복귀 위치를 맡기면 브라우저가 바뀌는 순간 잃어버리므로 redirect를 state에 담았습니다. 장바구니도 화면이 정하지 않고 서버 reconcile을 정본으로 삼았습니다.',
    tags: ['stateless OAuth 복귀', '서버 확정 reconcile', '에러코드별 재시도'],
  },
  {
    id: 'gatehouse',
    label: '팀의 바닥',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: '어드민 · 15명 협업',
    title: '사람이 늘자 공통 코드부터 흔들렸다',
    body: '관리자·스태프·파트너가 함께 쓰는 어드민에서 권한 체크가 화면마다 달랐습니다. 한 군데를 빠뜨리면 다른 사람의 데이터가 보이고, 공통 에러 처리나 디자인 토큰이 흔들리면 15명의 작업이 같이 흔들렸습니다. 기존 데이터를 전부 갈아엎지 않고 역할별로 필요한 권한만 세분화한 뒤, 단일 권한 훅과 ArchUnit·codemod·CI 규칙으로 누락과 반복 버그를 계층에서 막았습니다.',
    tags: ['RBAC + GBAC + ABAC', '10개 테이블 마이그레이션', 'shared 코어 713커밋'],
  },
  {
    id: 'observatory',
    label: '장애 격리',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: '백엔드 · 검색 · AI',
    title: '검색과 번역이 서로 끌어내리지 않게',
    body: '외부 webhook이 올 때마다 숙소를 한 건씩 다시 색인하면 변경이 몰리는 순간 검색까지 느려졌습니다. 변경을 chunk로 묶고 요청 경로에서 미리 계산할 수 있는 일을 걷어냈습니다. 번역과 콘텐츠 생성은 Gemini·Claude·OpenAI 중 한 곳이 멈춰도 다음으로 넘어가게 했습니다. 재시도만 늘리면 죽은 업체 앞에 대기열만 쌓이기 때문에 CircuitBreaker와 fallback을 같이 두었습니다.',
    tags: ['OpenSearch Bulk chunk', 'CircuitBreaker 43지점', 'LLM 3개 provider'],
  },
  {
    id: 'vault',
    label: '돈이 걸린 곳',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: '쿠폰 · 백엔드 멀티모듈',
    title: '쿠폰은 발급보다 안 나가는 경우가 더 어려웠다',
    body: '첫 로그인이나 첫 채팅처럼 행동을 보고 쿠폰을 발급하는 기능은 실패하면 쿠폰이 사라지고, 재시도하면 두 번 나갈 수 있습니다. 레거시 서비스에 규칙을 더하지 않고 쿠폰을 별도 바운디드 컨텍스트로 세웠습니다. 같은 트랜잭션에 Outbox를 남기고 워커가 재시도하게 해 유실과 중복을 구조에서 다뤘고, 이 도메인을 기준으로 백엔드 멀티모듈 전환을 시작했습니다.',
    tags: ['DDD · Hexagonal', 'Outbox + ShedLock', '테스트 101건 / 118커밋'],
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
