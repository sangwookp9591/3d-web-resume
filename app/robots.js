import { SITE_URL } from '@/lib/site';

/* 이력서를 AI가 읽는 것이 이 사이트의 목적이므로 AI 크롤러를 막지 않습니다.
   그냥 `User-agent: *`로 두지 않고 이름을 적는 이유는, 몇몇 봇이 와일드카드 Allow를
   "학습 거부 안 함"으로만 읽고 색인은 건너뛰기 때문입니다. 명시가 곧 의사 표시입니다. */
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',        // OpenAI
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',   // Anthropic
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'CCBot', 'Bytespider', 'meta-externalagent', 'cohere-ai', 'Amazonbot',
];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_AGENTS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
