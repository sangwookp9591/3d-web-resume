import { resumeMarkdown } from '@/lib/markdown';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/* llms.txt 규약의 전문 판. 내용은 /iron.md와 바이트까지 같고 Content-Type만 평문입니다 —
   마크다운을 못 다루는 수집기도 그냥 읽을 수 있게.

   같은 글이 두 URL에 있으므로 어느 쪽이 정본인지 밝힙니다. 안 밝히면 llms.txt의 링크를
   따라온 크롤러가 사이트맵에도 없는 이력서 사본을 하나 더 발견하게 되고, 단일 소스로
   만든 AEO 레이어가 바로 그 자리에서 중복 콘텐츠로 갈라집니다. */
export function GET() {
  return new Response(resumeMarkdown(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      Link: `<${SITE_URL}/iron.md>; rel="canonical"`,
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
