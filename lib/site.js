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

   로컬 `npm run build`에서까지 울리면 금방 무뎌지므로 CI에서만 경고합니다 — 배포로
   이어지는 빌드는 거기서 납니다. */
if (!resolved && process.env.CI) {
  console.warn(
    '\n[site] NEXT_PUBLIC_SITE_URL도 VERCEL_PROJECT_PRODUCTION_URL도 없습니다.\n' +
    '       canonical·sitemap·JSON-LD가 localhost로 굳은 채 빌드됩니다.\n' +
    '       Vercel 밖에서 배포한다면 NEXT_PUBLIC_SITE_URL을 지정하세요.\n'
  );
}

export const SITE_URL = resolved || 'http://localhost:3000';

export const PERSON = {
  name: '박상욱',
  alternateName: ['iron', '아이언', 'Sangwook Park'],
  email: 'sangwookp9591@gmail.com',
  github: 'https://github.com/sangwookp9591',
  jobTitle: '풀스택 개발자',
  headline: '제품을 만들고, 팀의 작업 방식을 설계하는 개발자',
  summary:
    '의료관광 플랫폼 ZIVO의 웹(단독)·어드민(리드)·백엔드(최다 기여) 3개 저장소에서 9개월간 5,240여 커밋. ' +
    '아키텍처 규율을 도구로 집행하고, 실패 경로를 먼저 설계합니다.',
  employer: 'ZIVO Medical Tourism Platform',
  period: { start: '2025-10', end: '2026-07' },
  skills: [
    'Next.js', 'React', 'TypeScript', 'vanilla-extract', 'StyleX', 'Playwright',
    'Spring Boot', 'Java', 'JPA', 'OpenSearch', 'Redis', 'Resilience4j', 'ArchUnit',
    'DDD', 'Hexagonal Architecture', 'FSD', 'WebGPU', 'three.js',
  ],
};
