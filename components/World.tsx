import { sections } from '@/lib/worldConfig';
import Route from './Route';
import WorldMount from './WorldMount';

/* 픽셀 여정. 아잉은 클라이언트가 걷게 하지만, 다섯 장소의 글은 여기서 서버가 그립니다.

   Vite판에서는 이 다섯 장 — 이력서에서 가장 할 말이 많은 부분 — 이 엔진의 innerHTML로만
   존재해서, JS를 돌리지 않는 크롤러와 AI 에이전트에게는 페이지가 통째로 비어 있었습니다.
   지금은 반대입니다: 글과 스크롤 길이가 이 마크업이고, 엔진(lib/pixel-journey.js)은
   그 위에 그림만 얹습니다. 엔진이 없어도 여정은 읽힙니다. */

const pad = (n: number) => String(n).padStart(2, '0');

export default function World() {
  return (
    <WorldMount>
      <Route />

      {sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className="px-scene"
          data-stage={s.id}
          aria-labelledby={`${s.id}-title`}
          style={{ '--px-scroll': s.scroll, '--px-accent': s.accent }}
        >
          <article className="px-copy">
            <span className="px-copy__num">{pad(i + 1)} / {pad(sections.length)}</span>
            {s.eyebrow && <span className="px-copy__eyebrow">{s.eyebrow}</span>}
            <h2 className="px-copy__title" id={`${s.id}-title`}>{s.title}</h2>
            {s.body && <p className="px-copy__body">{s.body}</p>}
            {s.tags?.length > 0 && (
              <ul className="px-copy__tags">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            )}
            {s.cta && (
              <div className="px-copy__cta">
                {s.cta.primary && (
                  <a className="px-btn px-btn--solid" href={s.cta.primary.href || '#'}>
                    {s.cta.primary.label}
                  </a>
                )}
                {s.cta.secondary && (
                  <a className="px-btn" href={s.cta.secondary.href || '#'}>
                    {s.cta.secondary.label}
                  </a>
                )}
              </div>
            )}
          </article>
        </section>
      ))}
    </WorldMount>
  );
}
