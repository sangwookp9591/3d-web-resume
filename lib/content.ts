/* 화면에 나가는 이력 데이터. worldConfig.js와 같은 자리에 둡니다 — 이 값들을 읽는 쪽이
   컴포넌트만이 아니라 JSON-LD와 마크다운 레이어이기도 해서, 컴포넌트 파일에 두면
   lib이 components를 거꾸로 물게 됩니다.

   모든 수치는 세 저장소의 git 이력 분석(2026-07-02 기준)에서 나왔습니다. */

export const REPOS = [
  {
    name: 'ZIVO_FRONT', stack: 'Next.js 16 · React 19', share: 98, shareLabel: '98%',
    commits: '1,947 커밋', role: '웹 서비스 단독 구축', note: '14개 언어 · QR 주문·결제',
  },
  {
    name: 'ZIVO_ADMIN', stack: 'React 19 · StyleX', share: 68, shareLabel: '68%',
    commits: '1,781 커밋', role: '공통 인프라 · 권한 · FSD 리드', note: 'shared 레이어 713커밋',
  },
  {
    name: 'ZIVO_BACK', stack: 'Spring Boot 3.5 · Java', share: 33, shareLabel: '1위 · 33%',
    commits: '1,512 커밋', role: '검색 · AI · 쿠폰 · 통계 주도', note: 'DDD/Hexagonal 신규 설계',
  },
];

export const PRINCIPLES = [
  ['좋은 구조는 문서가 아니라 도구가 지킨다.',
   'ArchUnit으로 의존 방향을, codemod로 디자인 토큰을, 단일 훅으로 권한을 강제했습니다. 리뷰어의 기억력에 기대는 규칙은 규칙이 아닙니다.'],
  ['실패 비용이 큰 곳일수록, 실패 경로를 먼저 설계한다.',
   '결제의 취소·이탈 흐름, LLM의 fallback 체인, 쿠폰의 Outbox — 성공 케이스는 누구나 만듭니다. 차이는 무너지는 방식에서 납니다.'],
  ['버그는 고치는 것이 아니라, 재발이 불가능한 구조로 만드는 것.',
   '이중 토스트는 전역 onError 규약으로, E2E 플레이크는 하이드레이션 유틸과 burn-in으로 — 같은 문제를 두 번 만나지 않도록 계층에서 차단했습니다.'],
];

export const COVER_STATS = [
  ['5,240+', '커밋 · 9개월'],
  ['3 / 3', '저장소 핵심 기여자'],
  ['98%', '웹 프론트 커밋 점유'],
  ['440', '머지한 Pull Request'],
];
