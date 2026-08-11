import { resumeMarkdown } from '@/lib/markdown';

export const dynamic = 'force-static';

/* llms.txt 규약의 전문 판. 내용은 /iron.md와 같고 Content-Type만 평문입니다 —
   마크다운을 못 다루는 수집기도 그냥 읽을 수 있게. */
export function GET() {
  return new Response(resumeMarkdown(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
