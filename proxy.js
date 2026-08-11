import { NextResponse } from 'next/server';

/* 콘텐츠 협상. 에이전트가 `Accept: text/markdown`으로 홈을 요청하면 3D 세계와 번들 대신
   같은 내용의 마크다운을 돌려줍니다. URL은 그대로라(리다이렉트가 아니라 rewrite) 에이전트가
   기억하고 인용하는 주소가 사람이 여는 주소와 같습니다.

   Next 16에서 middleware는 proxy로 이름이 바뀌었습니다 — 파일명·export·config 전부. */
export function proxy(request) {
  const accept = request.headers.get('accept') ?? '';

  // text/markdown을 명시적으로 요구할 때만입니다. 브라우저의 Accept에는 */*가 늘 들어 있어서
  // 와일드카드까지 받아 주면 사람에게도 마크다운을 던지게 됩니다.
  if (!/\btext\/markdown\b/.test(accept)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/iron.md';
  const res = NextResponse.rewrite(url);
  // 같은 URL이 Accept에 따라 두 가지 몸을 내므로 캐시에 그 사실을 알립니다.
  res.headers.set('Vary', 'Accept');
  return res;
}

/* 파일명과 함수명은 Next 16에서 proxy로 바뀌었지만 설정 export는 여전히 `config`입니다.
   `proxyConfig`로 두면 조용히 무시되어 matcher가 사라지고, 프록시가 모든 요청에 걸립니다 —
   /llms.txt를 Accept: text/markdown으로 부르면 이력서 전문이 돌아오는 식으로. */
export const config = {
  matcher: ['/'],
};
