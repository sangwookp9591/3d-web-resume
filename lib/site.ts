/* 사이트 한 곳의 진실. metadata·robots·sitemap·JSON-LD·llms.txt가 전부 여기를 봅니다.
   URL을 하드코딩하지 않는 이유는, 프리뷰 배포마다 도메인이 달라서 sitemap과 canonical이
   서로 다른 곳을 가리키면 크롤러가 프리뷰를 정본으로 오해하기 때문입니다. */

const resolved =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  null;

/* 홈은 정적 프리렌더라 이 값이 빌드 타임에 굳습니다. 못 찾은 채로 프로덕션 빌드를 내면
   canonical·og:url·sitemap의 <loc>·robots의 Sitemap·JSON-LD의 @id가 전부 localhost로
   박힌 채 배포됩니다 — 스스로를 색인에서 지우는 사이트가 됩니다. 조용히 넘기지 않습니다.
   (Vercel은 VERCEL_PROJECT_PRODUCTION_URL을 빌드에 넣어 주므로 그냥 배포하면 맞습니다.)

   로컬 `npm run build`은 그냥 통과시킵니다 — 거기서까지 막으면 개발이 안 됩니다.
   CI 빌드는 배포로 이어지므로 경고가 아니라 세웁니다. 초록색 로그를 스쳐 지나가는
   경고는 가드가 아닙니다. */
if (!resolved && process.env.CI) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL도 VERCEL_PROJECT_PRODUCTION_URL도 없습니다. ' +
    'canonical·og:url·sitemap의 <loc>·robots의 Sitemap·JSON-LD의 @id가 전부 ' +
    'localhost로 굳은 채 배포되어 사이트가 스스로를 색인에서 지웁니다. ' +
    'Vercel 밖에서 배포한다면 NEXT_PUBLIC_SITE_URL을 지정하세요.'
  );
}

export const SITE_URL = resolved || 'http://localhost:3000';

/* 계정 이름은 한 번만 적습니다. URL과 로그인/핸들을 따로 들고 있으면 계정을 옮길 때
   한쪽만 고쳐지고, 그때 푸터의 제목 링크와 그 아래 목록이 서로 다른 계정을 가리킵니다 —
   API는 404를 주고 화면은 "저장소가 없는 사람"처럼 보입니다. */
const GH = 'sangwookp9591';
const YT = '@ai-ng-tech';

export const PERSON = {
  name: '박상욱',
  alternateName: ['iron', '아이언', 'Sangwook Park'],
  email: 'sangwookp9591@gmail.com',
  github: `https://github.com/${GH}`,
  githubLogin: GH,
  youtube: `https://www.youtube.com/${YT}`,
  youtubeHandle: YT,
  /* RSS 피드는 핸들이 아니라 채널 ID만 받습니다(/feeds/videos.xml?channel_id=…).
     @핸들로는 404가 나므로 채널 페이지에서 한 번 꺼내 여기 적어 둡니다. */
  youtubeChannelId: 'UCuzvnXas0mUqueHOqtoOPeQ',
  jobTitle: '풀스택 개발자',
  headline: '복잡한 문제를 단순하게 풀고, 실패할 경로를 먼저 없애는 풀스택 개발자',
  summary:
    '글로벌 의료관광 플랫폼 ZIVO에서 웹 서비스 단독 구축부터 15인 규모 어드민 인프라, 백엔드 코어(쿠폰·검색·AI)까지 주도했습니다. ' +
    '유저의 이탈을 막는 실패 경로 설계와 팀의 실수를 줄이는 도구화에 강점이 있습니다.',
  employer: 'ZIVO (글로벌 의료관광 플랫폼)',
  period: { start: '2025-10', end: '2026-07' },
  skills: [
    'Next.js', 'React', 'TypeScript', 'vanilla-extract', 'StyleX', 'Playwright',
    'Spring Boot', 'Java', 'JPA', 'OpenSearch', 'Redis', 'Resilience4j', 'ArchUnit',
    'DDD', 'Hexagonal Architecture', 'FSD', 'WebGPU', 'three.js',
  ],
};
