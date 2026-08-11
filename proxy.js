import { NextResponse } from 'next/server';

/* 콘텐츠 협상. 에이전트가 `Accept: text/markdown`으로 홈을 요청하면 3D 세계와 번들 대신
   같은 내용의 마크다운을 돌려줍니다. URL은 그대로라(리다이렉트가 아니라 rewrite) 에이전트가
   기억하고 인용하는 주소가 사람이 여는 주소와 같습니다.

   Next 16에서 middleware는 proxy로 이름이 바뀌었습니다 — 파일명과 함수명만. 설정 export는
   여전히 `config`이고, `proxyConfig`로 쓰면 조용히 무시되어 matcher가 사라집니다.

   ── 캐시에 관한 한계 ──────────────────────────────────────────────────────────
   협상하는 URL은 두 갈래 모두 `Vary: Accept`를 내야 공유 캐시가 둘을 섞지 않습니다.
   마크다운 갈래(rewrite → 라우트 핸들러)에는 붙지만, HTML 갈래에는 붙일 방법이 없습니다:
   Next이 App Router 페이지 응답의 Vary를 자기 RSC 목록으로 덮어씁니다 — NextResponse.next()
   에 세워도, 같은 경로로 rewrite해도, next.config의 headers()로 걸어도(프록시를 아예 안
   태워도) 마찬가지입니다. 실측으로 셋 다 확인했습니다.

   그래서 이 협상은 편의 기능이고, 에이전트에게 약속하는 정본 경로는 따로 광고하는
   `/iron.md`입니다 — <link rel="alternate" type="text/markdown">, llms.txt, sitemap 셋 다
   그 주소를 가리킵니다. 그 URL은 몸이 하나뿐이라 어떤 캐시에서도 헷갈릴 일이 없습니다.
   (Vercel에서는 matcher가 잡은 `/`에 대해 엣지가 언제나 이 함수를 먼저 태우므로 실제로
   섞이지 않습니다. 앞단에 제3의 CDN을 두면 그때는 위 한계가 드러납니다.) */
export function proxy(request) {
  const accept = request.headers.get('accept') ?? '';

  // text/markdown을 명시적으로 요구할 때만입니다. 브라우저의 Accept에는 */*가 늘 들어 있어서
  // 와일드카드까지 받아 주면 사람에게도 마크다운을 던지게 됩니다.
  if (!/\btext\/markdown\b/.test(accept)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/iron.md';
  const res = NextResponse.rewrite(url);
  res.headers.set('Vary', 'Accept');
  return res;
}

export const config = {
  matcher: ['/'],
};
