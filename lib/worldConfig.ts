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
    eyebrow: 'ZIVO 웹 · 처음부터 만들기',
    title: '앱보다 웹이 먼저였습니다',
    body: '앱을 만들기 전에, 검색으로 들어와 QR로 주문하고 결제하는 흐름부터 확인해야 했습니다. 그래서 웹을 먼저 내고 9개월 동안 혼자 운영했습니다. 14개 언어는 그다음에 따라왔습니다.',
    tags: ['14개 언어', '1,947 커밋 / 98%', 'QR 주문·결제']
  },
  {
    id: 'immunity',
    label: '돌아오기',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: '결제 · 주문',
    title: '결제하다 돌아온 사람을 다시 데려오기',
    body: '결제를 취소하거나, 다른 브라우저로 넘어가거나, 매장이 주문을 받을 수 없는 순간이 있었습니다. 그때 처음으로 돌려보내지 않고, 원래 자리에서 다시 시작하게 만들었습니다.',
    tags: ['취소·0원·주문불가 대응', '로그인 후 원래 자리 복귀', '장바구니 복구']
  },
  {
    id: 'gatehouse',
    label: '사람이 늘 때',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: '어드민 · 15명 협업',
    title: '사람이 늘자, 공통 코드가 먼저 흔들렸습니다',
    body: '어드민을 함께 만드는 사람이 늘자 권한과 공통 화면이 제각각 움직이기 시작했습니다. 전부 다시 만들기보다, 꼭 필요한 곳부터 정리하고 새로 만드는 화면이 같은 실수를 하지 않게 했습니다.',
    tags: ['15명 협업', '권한 3종 통합', 'shared 코어 713커밋']
  },
  {
    id: 'observatory',
    label: '멈출 때',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: '검색 · 번역 · AI',
    title: '한 곳이 멈춰도, 나머지는 가야 했습니다',
    body: '숙소 정보가 한꺼번에 바뀌면 검색이 느려졌고, 번역 업체가 멈추면 작업 전체가 멈췄습니다. 한 번에 처리할 수 있는 일은 묶고, 한 곳의 문제는 그곳에서 끝나게 나눴습니다.',
    tags: ['검색 일괄 처리', 'LLM 3개 provider', 'CircuitBreaker 43지점']
  },
  {
    id: 'vault',
    label: '마지막으로',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: '쿠폰 · 백엔드',
    title: '쿠폰은 두 번 주거나, 아예 안 주거나',
    body: '쿠폰은 실패하면 사라지고, 다시 시도하면 두 번 나갈 수 있었습니다. 그래서 기존 코드에 덧붙이지 않고, 발급 기록을 남긴 뒤 안전하게 다시 시도하는 구조로 새로 만들었습니다.',
    tags: ['쿠폰 0 → 1', '중복·유실 방지', '테스트 101건 / 118커밋'],
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
