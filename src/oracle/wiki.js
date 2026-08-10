/* iron(박상욱)에 대한 지식 베이스.
   커밋 분석과 실제 이력에서만 옮겼습니다 — 지어낸 수치는 한 줄도 없습니다.
   LLM에는 이 글이 그대로 근거 문단으로 들어가고, 모델이 없을 때는 그대로 답이 됩니다. */

export const WIKI = [
  {
    id: 'who',
    title: '박상욱 (iron)',
    tags: '누구 소개 이름 아이언 iron 박상욱 상욱 개발자 프로필 자기소개 경력',
    text: `박상욱(iron, 아이언)은 제품을 만들고 팀의 작업 방식을 설계하는 개발자입니다.
의료관광 플랫폼 ZIVO에서 2025년 10월부터 2026년 7월까지 9개월간 웹 프론트엔드를 단독 구축하고,
어드민의 공통 인프라와 권한 시스템을 리드했으며, 백엔드에서는 검색·AI·쿠폰·통계 도메인을 주도했습니다.
세 저장소를 합쳐 5,240여 커밋, 머지한 Pull Request 440건. 연락처는 sangwookp9591@gmail.com.`,
  },
  {
    id: 'front',
    title: 'ZIVO_FRONT — 웹 프론트엔드 단독 구축',
    tags: '프론트 프론트엔드 front next nextjs react 웹 단독 14개언어 다국어 qr 결제 주문 커밋 98%',
    text: `Next.js 16 · React 19. 1,947 커밋으로 저장소의 98%를 차지했고 PR 440건을 머지했습니다.
앱 설치 없이 검색으로 들어와 매장에서 QR을 찍고 결제까지 끊김 없이 끝나는 웹을,
14개 언어로 혼자 만들고 운영했습니다. 0에서 1까지 전 구간을 단독으로 책임진 프로젝트입니다.`,
  },
  {
    id: 'admin',
    title: 'ZIVO_ADMIN — 공통 인프라와 권한 리드',
    tags: '어드민 admin 관리자 stylex fsd 권한 rbac gbac abac 공통 shared 리드 아키텍처 codemod archunit',
    text: `React 19 · StyleX. 1,781 커밋(저장소의 68%), 그중 shared 공통 레이어에만 713 커밋.
15명이 밟고 서는 공통 기반을 리뷰어의 기억이 아니라 도구로 집행했습니다 — ArchUnit으로 의존 방향을,
codemod로 디자인 토큰을 강제했습니다. 페이지마다 흩어져 있던 권한 체크는 훅 하나로 수렴시켜
RBAC + GBAC + ABAC 하이브리드 권한을 빠뜨릴 수 없는 구조로 만들었습니다. FSD 전환을 리드했습니다.`,
  },
  {
    id: 'back',
    title: 'ZIVO_BACK — 검색·AI·쿠폰·통계 주도',
    tags: '백엔드 back spring springboot java 자바 검색 opensearch 재색인 llm ai 쿠폰 통계 ddd hexagonal 최다기여',
    text: `Spring Boot 3.5 · Java. 1,512 커밋으로 저장소 최다 기여자(33%)였습니다.
OpenSearch 재색인 비용을 문서 수가 아니라 chunk 수에 비례하도록 Bulk API 기반으로 바꿨고,
LLM은 프로바이더 하나가 죽어도 fallback 체인으로 이어지게 했습니다(CircuitBreaker 43지점).
호텔 도메인에만 227 커밋. 쿠폰은 레거시 위에 얹지 않고 DDD/Hexagonal 바운디드 컨텍스트로 신설했습니다.`,
  },
  {
    id: 'test',
    title: '결제 E2E 하네스 — 플레이크 0',
    tags: '테스트 e2e playwright 플레이크 flaky 하이드레이션 mock stomp 품질 ci burnin 검증',
    text: `결제 전 구간의 E2E를 실서버가 아니라 의존성 0의 Node mock 서버와 STOMP 스텁 위에 세웠습니다.
하이드레이션 레이스는 sleep으로 덮지 않고 전용 유틸로 없앴고, --repeat-each=10 burn-in으로 굳혀
플레이크를 0으로 만들었습니다. 방법론은 팀 문서로 남겼습니다.`,
  },
  {
    id: 'coupon',
    title: '쿠폰 — 유실을 먼저 설계한 도메인',
    tags: '쿠폰 coupon outbox shedlock 정합성 유실 중복 트랜잭션 돈 결제 ddd hexagonal 테스트101',
    text: `돈이 걸린 곳은 성공 경로보다 실패 경로를 먼저 설계했습니다.
쿠폰을 DDD/Hexagonal로 신설하고, 트리거 발급의 유실과 중복은 ShedLock을 건 Outbox 패턴이
구조에서 막도록 했습니다. 테스트 101건으로 경계를 고정했습니다.`,
  },
  {
    id: 'principles',
    title: '일하는 방식 세 가지',
    tags: '원칙 철학 방식 신념 principles 가치관 일하는 스타일 태도',
    text: `1. 좋은 구조는 문서가 아니라 도구가 지킨다. ArchUnit·codemod·단일 훅으로 강제했습니다.
리뷰어의 기억력에 기대는 규칙은 규칙이 아닙니다.
2. 실패 비용이 큰 곳일수록 실패 경로를 먼저 설계한다. 결제의 이탈 흐름, LLM의 fallback 체인,
쿠폰의 Outbox — 성공 케이스는 누구나 만듭니다. 차이는 무너지는 방식에서 납니다.
3. 버그는 고치는 것이 아니라 재발이 불가능한 구조로 만드는 것. 이중 토스트는 전역 onError 규약으로,
E2E 플레이크는 하이드레이션 유틸과 burn-in으로 계층에서 차단했습니다.`,
  },
  {
    id: 'stack',
    title: '스택',
    tags: '스택 기술 언어 프레임워크 tech stack 무엇을 사용 도구 라이브러리',
    text: `프론트: Next.js 16, React 19, StyleX, Vite, Playwright, TypeScript.
백엔드: Spring Boot 3.5, Java, JPA, OpenSearch, Redis, ShedLock, Resilience4j, ArchUnit.
그 외: WebGPU/WGSL, three.js, 온디바이스 LLM(transformers.js), 이미지·영상 생성 파이프라인.`,
  },
  {
    id: 'site',
    title: '이 사이트',
    tags: '사이트 포트폴리오 이력서 만든 webgpu 스크롤 아잉 aing 마스코트 캐릭터 three 성능 라이트하우스',
    text: `이 이력서 사이트는 스크롤이 카메라를 움직이는 하늘 위 세계입니다. 미리 렌더한 카메라 비행 영상을
스크롤 위치로 스크럽해 다섯 개의 섬(기원·검증·규율·지능·정합성) 안으로 날아 들어갑니다.
마스코트 Ai-ng(아잉)는 재사용 가능한 에셋 킷 — 표정 16종, 액션 16종, 모션 6종, GLB 3D 모델입니다.
초기 번들 74KB gzip, 3D 원본 54MB를 1.19MB로, Lighthouse 접근성·베스트프랙티스·SEO 100점.
지금 이 검색창은 WebGPU 컴퓨트 셰이더(Gray-Scott 반응·확산)와 브라우저에서 도는 Gemma 4로 만들었습니다.`,
  },
  {
    id: 'contact',
    title: '연락',
    tags: '연락 메일 이메일 email contact 채용 문의 연락처 깃허브 github',
    text: `메일: sangwookp9591@gmail.com. GitHub: sangwookp9591.
ZIVO Medical Tourism Platform, 2025.10 – 2026.07.`,
  },
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9가-힣]+/g, ' ').trim();

// ponytail: 형태소 분석기 대신 2-gram + 토큰 매칭. 한국어 조사("iron은", "권한을")가 붙어도
// 2-gram이 뚫고 들어갑니다. 청크가 10개뿐이라 전체 스캔이 인덱스보다 쌉니다.
const words = (s) => new Set(norm(s).split(' ').filter((w) => w.length > 1));

const grams = (s) => {
  const out = words(s);
  // 2-gram은 제목·태그에만. 본문까지 넣으면 긴 청크가 우연한 음절 겹침으로 이기고,
  // "어떻게" 같은 기능어가 주제어와 같은 무게를 갖습니다.
  for (const w of [...out]) for (let i = 0; i < w.length - 1; i++) out.add(w.slice(i, i + 2));
  return out;
};

const HAY = WIKI.map((w) => {
  const tagHay = grams(`${w.title} ${w.tags}`);
  return { ...w, hay: new Set([...tagHay, ...words(w.text)]), tagHay };
});

// 문서 빈도. "iron", "커밋"처럼 거의 모든 조각에 나오는 말은 주제를 가르지 못하므로
// 가중치를 나눠 떨어뜨립니다 — 안 하면 이름만 들어가도 소개 조각이 1등을 합니다.
const DF = new Map();
for (const w of HAY) for (const g of w.hay) DF.set(g, (DF.get(g) ?? 0) + 1);

// 이 위키는 통째로 한 사람에 대한 글이라, 이름은 어느 질문에 붙어도 주제를 못 가릅니다.
// 이름을 뺀 질문으로 먼저 찾고, 그러고도 남는 게 없을 때만 이름으로 찾습니다.
const NAME = /(iron|아이언|박상욱|상욱)/gi;

/** 질문과 관련 있는 위키 조각을 점수순으로. 매칭이 하나도 없으면 빈 배열. */
export function retrieve(query, k = 3) {
  const stripped = query.replace(NAME, ' ').trim();
  return rank(stripped, k) ?? rank(query, k) ?? [];
}

function rank(query, k) {
  const q = grams(query);
  if (!q.size) return null;
  const out = HAY.map((w) => {
    let s = 0;
    for (const g of q) if (w.hay.has(g)) s += (w.tagHay.has(g) ? 3 : 1) / DF.get(g);
    return { w, s };
  })
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((r) => r.w);
  return out.length ? out : null;
}

/** 모델 없이도 답이 되는 폴백: 가장 가까운 조각을 그대로 인용합니다. */
export function lookup(query) {
  const hits = retrieve(query, 2);
  if (!hits.length) {
    return '그 질문은 이 위키에 없네요. 이력·저장소·기술 스택·일하는 방식에 대해 물어보시면 답할 수 있습니다.';
  }
  return hits.map((h) => `【${h.title}】\n${h.text}`).join('\n\n');
}
