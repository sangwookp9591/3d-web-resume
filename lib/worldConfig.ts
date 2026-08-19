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
    label: '기원',
    bg: BG(1),
    props: [PROP(1, 1), PROP(1, 2)],
    accent: '#5BB8E8',
    scroll: 1.5,
    eyebrow: '프론트엔드 · 0 → 1',
    title: '언어 14개를 혼자 띄웠다',
    body: '해외 환자가 앱을 깔지 않고 검색으로 찾아와, 매장에서 QR을 찍고 결제까지 웹에서 끝냅니다. 이 서비스를 9개월 동안 혼자 만들고 혼자 운영했습니다. 문제는 잘못 만들어도 짚어 줄 사람이 없다는 것이었습니다.',
    tags: ['Next.js 16 · React 19', '1,947 커밋 / 98%', 'PR 440'],
  },
  {
    id: 'immunity',
    label: '검증',
    bg: BG(2),
    props: [PROP(2, 1), PROP(2, 2)],
    accent: '#7C9EE8',
    scroll: 1.25,
    eyebrow: '프론트엔드 · 품질',
    title: '테스트가 흔들리지 않게 만들었다',
    body: '봐 줄 사람이 없으니 확인하는 일을 자동 검사에 맡겼습니다. 화면을 사람 대신 클릭해 보는 검사인데, 될 때도 있고 안 될 때도 있으면 아무도 믿지 않습니다. 같은 검사를 열 번 돌려도 결과가 똑같이 나오도록 원인을 하나씩 없앴습니다. 이 방식은 사람이 열다섯으로 늘어난 어드민에서 한 번 더 시험을 받습니다.',
    tags: ['10회 반복 통과', '외부 서버 의존 0', '방법론 문서화'],
  },
  {
    id: 'gatehouse',
    label: '규율',
    bg: BG(3),
    props: [PROP(3, 1), PROP(3, 2)],
    accent: '#9B8FE0',
    scroll: 1.45,
    eyebrow: '어드민 · 백엔드',
    title: '권한을 빠뜨릴 수 없는 구조로',
    body: '누가 무엇을 볼 수 있는지 확인하는 코드가 화면마다 흩어져 있었습니다. 한 곳만 빠뜨려도 남의 데이터가 보이니 사람 기억에 맡길 일이 아니었습니다. 확인을 한 곳으로 모아, 새 화면을 만들면 자동으로 걸리게 했습니다. 다음에 걸린 건 사람이 아니라 트래픽이었습니다.',
    tags: ['권한 체계 3종 통합', '공용 코드 713커밋', '규칙 위반 자동 검출'],
  },
  {
    id: 'observatory',
    label: '지능',
    bg: BG(4),
    props: [PROP(4, 1), PROP(4, 2)],
    accent: '#6FA8DC',
    scroll: 1.45,
    eyebrow: '백엔드 · 성능 · AI',
    title: '느려지는 곳과 멈추는 곳을 같이 막았다',
    body: '검색 데이터를 한 건씩 밀어 넣던 것을 묶어서 한 번에 보내도록 바꿨습니다. AI 기능은 외부 업체 한 곳이 멈춰도 다른 곳으로 넘어가 서비스가 안 끊기게 해 뒀고요. 그다음에 맡은 게 쿠폰인데, 돈이 걸린 곳이라 지켜야 할 규칙이 훨씬 많았습니다.',
    tags: ['검색 색인 일괄 처리', '장애 차단 43지점', '호텔 도메인 227커밋'],
  },
  {
    id: 'vault',
    label: '정합성',
    bg: BG(5),
    props: [PROP(5, 1), PROP(5, 2)],
    accent: '#8E86D8',
    scroll: 1.7,
    eyebrow: '백엔드 · 어드민',
    title: '돈이 걸린 곳은 실패부터 설계했다',
    body: '쿠폰은 잘못되면 곧장 돈이 새는 기능입니다. 기존 코드에 얹으면 규칙이 여기저기 흩어질 게 뻔해서 따로 떼어 새로 만들었습니다. 서버가 여러 대로 늘어도 쿠폰이 두 번 나가거나 아예 안 나가는 일이 없게 했습니다. 여기까지가 9개월입니다. 더 궁금하면 메일 주세요.',
    tags: ['쿠폰 도메인 신규 설계', '중복·유실 방지', '테스트 101건'],
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
