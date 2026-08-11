import { Instrument_Serif } from 'next/font/google';
import { SITE_URL, PERSON } from '@/lib/site';
import './globals.css';

// 표제용 라틴 한 벌만 self-host합니다. 본문 한글은 Pretendard의 동적 서브셋(아래 link)이
// 실제로 쓰인 글자만 내려받으므로, 가변 폰트 원본(2MB+)을 self-host하는 쪽이 더 느립니다.
const instrument = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PERSON.name} (iron) — ${PERSON.headline}`,
    template: `%s · ${PERSON.name} (iron)`,
  },
  description: PERSON.summary,
  applicationName: 'iron — Engineering Story',
  authors: [{ name: PERSON.name, url: PERSON.github }],
  creator: PERSON.name,
  keywords: [
    '박상욱', 'iron', '풀스택 개발자', '프론트엔드', '백엔드',
    'Next.js', 'React', 'Spring Boot', 'DDD', 'FSD', '이력서', '포트폴리오',
  ],
  alternates: {
    canonical: '/',
    types: {
      'text/markdown': '/iron.md',
      'text/plain': '/llms.txt',
    },
  },
  openGraph: {
    type: 'profile',
    locale: 'ko_KR',
    url: '/',
    siteName: 'iron — Engineering Story',
    title: `${PERSON.name} (iron) — Engineering Story`,
    description:
      '기능 구현을 넘어 FSD/DDD 아키텍처 규율, ArchUnit·codemod 기반 자동 집행, 팀 규약 문서화로 팀의 개발 방식을 설계합니다.',
    images: [{ url: '/assets/scene-5.webp', width: 1536, height: 1024, alt: '정합성 — 금고와 수로' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PERSON.name} (iron) — Engineering Story`,
    description: PERSON.summary,
    images: ['/assets/scene-5.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#95c5e7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={instrument.variable}>
      <head>
        {/* 본문 한글. 동적 서브셋이라 실제로 쓰인 글자의 woff2만 내려옵니다 — 가변 폰트
            원본(2MB+)을 self-host하는 것보다 이쪽이 빠릅니다.

            media="print"로 받으면 렌더를 막지 않습니다. Vite판은 문자열 onload로 media를
            되돌렸는데 RSC에서는 그 핸들러를 못 쓰므로, body 끝의 인라인 스크립트가 대신
            뒤집습니다 — 그때는 이미 첫 페인트가 시스템 폰트로 끝나 있고, @font-face의
            font-display:swap이 나머지를 갈아 끼웁니다. 그냥 stylesheet로 두면 모든 방문자의
            FCP가 서드파티 CDN 왕복 하나에 묶입니다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          id="pretendard"
          rel="stylesheet"
          media="print"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          />
        </noscript>
      </head>
      {/* #root는 장식이 아닙니다. 오라클이 열리면 판만 남기고 그 뒤 페이지를 통째로
          inert로 재워야 하는데(탭·스크린리더 차단), 판은 portal로 body에 붙으므로
          "판을 뺀 나머지"를 가리킬 노드가 하나 필요합니다. */}
      <body>
        <div id="root">{children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.getElementById('pretendard').media='all'",
          }}
        />
      </body>
    </html>
  );
}
