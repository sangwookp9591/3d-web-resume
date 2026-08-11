import { resumeMarkdown } from '@/lib/markdown';

export const dynamic = 'force-static';

/* 이력서 전문을 Clean Markdown으로. 페이지와 같은 상수에서 나오므로 따로 관리할 사본이
   없습니다. proxy.js가 Accept: text/markdown 요청을 여기로 보냅니다. */
export function GET() {
  return new Response(resumeMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
