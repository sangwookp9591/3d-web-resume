import { SITE_URL, PERSON } from './site';
import { sections } from './worldConfig';
import { REPOS, SHARES, isoDate } from './content';

/* 구조화 데이터. 규칙 하나만 지킵니다 — 여기 적는 것은 전부 페이지에 실제로 보이는 글이어야
   합니다. 위키(lib/wiki.js)는 화면에 없으므로 FAQ로 올리지 않고 마크다운 레이어(/iron.md,
   /llms-full.txt)로 냅니다. 반대로 아래 다섯 장면과 저장소 수치는 이제 서버가 그리므로
   그대로 근거가 됩니다. */

const abs = (p: string) => new URL(p, SITE_URL).href;

/** ItemList 껍데기. 목록이 셋이 되면서 position 매기기와 개수 세기가 세 번 반복됐습니다. */
const itemList = <T,>(id: string, name: string, items: T[], item: (v: T) => object) => ({
  '@type': 'ItemList',
  '@id': abs(`/#${id}`),
  name,
  numberOfItems: items.length,
  itemListElement: items.map((v, i) => ({ '@type': 'ListItem', position: i + 1, item: item(v) })),
});

const person = {
  '@type': 'Person',
  '@id': abs('/#person'),
  name: PERSON.name,
  alternateName: PERSON.alternateName,
  jobTitle: PERSON.jobTitle,
  description: PERSON.summary,
  email: `mailto:${PERSON.email}`,
  url: SITE_URL,
  sameAs: [PERSON.github, PERSON.youtube],
  knowsAbout: PERSON.skills,
  worksFor: { '@type': 'Organization', name: PERSON.employer },
  knowsLanguage: [
    { '@type': 'Language', name: 'Korean', alternateName: 'ko' },
  ],
};

// 다섯 장면 = 다섯 기여 사례. 제목·본문 모두 World가 서버에서 그리는 그 글입니다.
const contributions = itemList('contributions', '기여 사례', sections, (s) => ({
  '@type': 'CreativeWork',
  name: s.title,
  description: s.body,
  about: s.eyebrow,
  keywords: s.tags?.join(', '),
  url: abs(`/#${s.id}`),
  author: { '@id': abs('/#person') },
}));

// 저장소 점유율. Footprint가 화면에 그리는 그 수치 그대로입니다.
const repositories = itemList('repositories', '저장소 기여도', REPOS, (r) => ({
  '@type': 'SoftwareSourceCode',
  name: r.name,
  description: `${r.role} — ${r.commits} (${r.shareLabel}) · ${r.note}`,
  programmingLanguage: r.stack,
  contributor: { '@id': abs('/#person') },
}));

// 공유 기록. Sharing이 화면에 그리는 그 목록 그대로입니다.
const shares = itemList('sharing-log', '팀에 공유한 것들', SHARES, (s) => ({
  '@type': 'CreativeWork',
  name: s.title,
  description: s.note,
  about: s.kind,
  datePublished: isoDate(s.date),
  url: abs('/#sharing'),
  author: { '@id': abs('/#person') },
}));

/* FAQ는 답이 페이지에 실제로 보이는 것만 올립니다 — 이게 Schema.org FAQPage의 조건이고,
   보이지 않는 답을 올리는 건 그냥 스팸입니다. 아래 넷의 답은 전부 World/Footprint가
   서버에서 그리는 문장 그대로입니다. */
const faq = {
  '@type': 'FAQPage',
  '@id': abs('/#faq'),
  mainEntity: [
    ...sections.map((s) => ({
      '@type': 'Question',
      name: `「${s.title}」 — 구체적으로 어떤 일이었나요?`,
      acceptedAnswer: { '@type': 'Answer', text: s.body },
    })),
    {
      '@type': 'Question',
      name: '세 저장소에서 각각 어떤 역할이었나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: REPOS.map((r) => `${r.name}(${r.stack}): ${r.role}. ${r.commits}, ${r.shareLabel}. ${r.note}.`).join(' '),
      },
    },
  ],
};

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': abs('/'),
        url: SITE_URL,
        name: `${PERSON.name} (iron) — ${PERSON.headline}`,
        description: PERSON.summary,
        inLanguage: 'ko-KR',
        mainEntity: { '@id': abs('/#person') },
        about: { '@id': abs('/#person') },
      },
      person,
      contributions,
      repositories,
      shares,
      faq,
    ],
  };
}
