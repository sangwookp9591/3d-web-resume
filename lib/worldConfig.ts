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
    label: '처음',
    bg: BG(1),
    props: [PROP(1, 1), PROP(1, 2)],
    accent: '#5BB8E8',
    scroll: 1.5,
    eyebrow: '글로벌 웹 · 0 to 1',
    title: '앱 설치의 벽을 없애고 웹으로 먼저 검증했습니다',
    body: '외국인 환자와 여행객에게 앱 설치는 큰 진입장벽이었습니다. 검색으로 바로 들어와 매장 QR을 찍고 결제까지 단번에 이어지도록 14개 언어를 지원하는 웹을 혼자 구축해 9개월간 운영했습니다.',
    tags: ['14개 언어 지원', '1,947 커밋 (점유율 98%)', 'QR 간편 주문·결제']
  },
  {
    id: 'immunity',
    label: '이탈 방지',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: '결제 UX · 실패 경로 설계',
    title: '어긋난 결제도 원래 자리로 되돌려놓았습니다',
    body: '결제 도중 뒤로가기를 누르거나, 다른 브라우저로 넘어가거나, 매장이 주문 불가 상태일 때 유저가 겪는 이탈을 없앴습니다. 실패하더라도 에러 화면 대신 장바구니와 주문 상태를 안전하게 복구해 결제 흐름을 지켰습니다.',
    tags: ['취소·0원·주문불가 방어', '로그인 후 원래 화면 복귀', '장바구니 복구']
  },
  {
    id: 'gatehouse',
    label: '협업 인프라',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: '어드민 인프라 · 15명 협업',
    title: '사람이 늘어도 코드가 흔들리지 않게 기준을 세웠습니다',
    body: '어드민을 함께 만드는 사람이 15명으로 늘자 권한 체크가 누락되고 공통 UI가 제각각 움직이기 시작했습니다. 전부 다시 만들기보다 단일 권한 훅과 전역 에러 계층으로 묶어, 새로 만드는 화면이 같은 실수를 하지 않게 했습니다.',
    tags: ['15명 규모 협업', '하이브리드 권한 체계', '공통 코어 인프라 713커밋']
  },
  {
    id: 'observatory',
    label: '장애 격리',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: '백엔드 회복탄력성 · OpenSearch',
    title: '외부 서비스가 멈춰도 우리 서비스는 멈추지 않게 했습니다',
    body: '숙소 재고가 대량으로 바뀌며 검색이 느려지거나, 외부 번역 AI가 멈췄을 때 전체 파이프라인이 중단되는 위험이 있었습니다. 대량 재색인은 묶어서 처리하고 43개 지점에 서킷브레이커와 대체 모델을 붙여 장애를 격리했습니다.',
    tags: ['검색 대량 일괄 처리', '멀티 LLM 장애 격리', '서킷브레이커 43개 지점']
  },
  {
    id: 'vault',
    label: '데이터 무결성',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: '쿠폰 도메인 · DDD / Hexagonal',
    title: '단 1원의 유실과 중복도 없는 쿠폰 시스템을 새로 지었습니다',
    body: '돈과 직결된 쿠폰은 실패하면 사라지거나 다시 시도할 때 중복 지급되기 쉬웠습니다. 기존 코드에 덧붙이지 않고, 발급 기록을 남긴 뒤 안전하게 다시 시도하는 Outbox 패턴과 멱등 설계를 적용해 101건의 테스트로 무결성을 검증했습니다.',
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
