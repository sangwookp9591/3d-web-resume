import { SITE_URL } from '@/lib/site';

/* 라우트는 하나뿐이지만 마크다운 표면도 같이 알립니다 — 크롤러가 링크를 따라오기 전에
   전문이 어디 있는지 알게 하는 편이 빠릅니다. */
export default function sitemap() {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/iron.md`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/llms.txt`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
