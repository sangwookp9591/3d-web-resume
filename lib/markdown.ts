import { SITE_URL, PERSON } from './site';
import { sections } from './worldConfig';
import { WIKI } from './wiki';
import { REPOS, PRINCIPLES, SHARES, SHARES_LEAD, MEDIA_LEAD, MEDIA_WORK, PIPELINE } from './content';

/* AEO 응답 레이어의 본문. 페이지와 같은 상수에서 나오므로 화면과 마크다운이 어긋날 수
   없습니다 — 여기에만 있는 문장은 한 줄도 없습니다.

   에이전트가 3D 세계도, WebGPU도, 번들도 없이 이력 전체를 한 번에 읽게 하는 것이 목적이라
   장식은 전부 뺍니다. */

const list = (items: string[]) => items.map((s) => `- ${s}`).join('\n');

/** 사람이 읽어도 되는 전체 이력서. Accept: text/markdown과 /iron.md가 이걸 냅니다. */
export function resumeMarkdown() {
  return `# ${PERSON.name} (iron) — ${PERSON.headline}

> ${PERSON.summary}

- 이메일: ${PERSON.email}
- GitHub: ${PERSON.github}
- YouTube: ${PERSON.youtube}
- 소속: ${PERSON.employer} (${PERSON.period.start} – ${PERSON.period.end})
- 원본: ${SITE_URL}

## 저장소 기여도

세 저장소에서 역할은 각각 달랐습니다. 수치는 git 이력 분석(2026-07-02 기준)에서 나왔습니다.

| 저장소 | 스택 | 커밋 | 점유율 | 역할 |
|---|---|---|---|---|
${REPOS.map((r) => `| ${r.name} | ${r.stack} | ${r.commits} | ${r.shareLabel} | ${r.role} (${r.note}) |`).join('\n')}

## 기여 사례 ${sections.length}건

${sections.map((s, i) => `### ${i + 1}. ${s.title}

**${s.eyebrow}**

${s.body}

${list(s.tags ?? [])}`).join('\n\n')}

## 영상 · 오디오 (2022 – 2026)

${MEDIA_LEAD}

업로드 파이프라인: ${PIPELINE.join(' → ')}

${MEDIA_WORK.map((w) => `- **${w.when} · ${w.where}** — ${w.title}. ${w.note}`).join('\n')}

## 팀에 공유한 것들

${SHARES_LEAD}

${SHARES.map((s) => `- **${s.date} · ${s.kind}** — ${s.title}. ${s.note}`).join('\n')}

## 일하는 방식

${PRINCIPLES.map(([head, sub], i) => `${i + 1}. **${head}**\n   ${sub}`).join('\n\n')}

## 상세 — 문답용 지식 베이스

${WIKI.map((w) => `### ${w.title}\n\n${w.text}`).join('\n\n')}

---

이 문서는 ${SITE_URL} 이 서버에서 생성합니다. 같은 내용을 HTML로도, \`Accept: text/markdown\` 요청으로도 받을 수 있습니다.
`;
}

/** llms.txt — 에이전트가 처음 만나는 색인. 짧게, 링크 위주로. */
export function llmsTxt() {
  return `# ${PERSON.name} (iron) — Engineering Story

> ${PERSON.summary}

${PERSON.employer}(${PERSON.period.start}–${PERSON.period.end})의 웹 프론트엔드를 단독 구축하고, 어드민의 공통
인프라와 권한 시스템을 리드했으며, 백엔드에서 검색·AI·쿠폰·통계 도메인을 주도한 개발자의
이력서 사이트입니다.

## 전문

- [전체 이력서 (Markdown)](${SITE_URL}/iron.md): 저장소 기여도, 기여 사례 ${sections.length}건, 일하는 방식, 지식 베이스 ${WIKI.length}조각 전부.
- [지식 베이스 전문](${SITE_URL}/llms-full.txt): 위와 같은 내용의 평문.

## 기여 요약

${REPOS.map((r) => `- [${r.name}](${SITE_URL}/#footprint): ${r.stack}. ${r.commits}(${r.shareLabel}). ${r.role} — ${r.note}.`).join('\n')}

## 기여 사례

${sections.map((s) => `- [${s.title}](${SITE_URL}/#${s.id}): ${s.eyebrow}. ${s.body}`).join('\n')}

## 영상 · 오디오

${MEDIA_WORK.map((w) => `- [${w.title}](${SITE_URL}/#media): ${w.when} · ${w.where}.`).join('\n')}

## 팀에 공유한 것들

${SHARES.map((s) => `- [${s.title}](${SITE_URL}/#sharing): ${s.date} · ${s.kind}.`).join('\n')}

## 일하는 방식

${PRINCIPLES.map(([head]) => `- [${head}](${SITE_URL}/#principles)`).join('\n')}

## 에셋

- [Ai-ng 캐릭터 킷](${SITE_URL}/#aing): 마스코트 표정 16종·액션 16종·모션 6종·GLB 3D 모델. 스프라이트 아틀라스와 매니페스트 포함, three.js/WebGPU/Unity에서 사용 가능.

## 연락

- 메일: ${PERSON.email}
- GitHub: ${PERSON.github}
- YouTube: ${PERSON.youtube}
`;
}
