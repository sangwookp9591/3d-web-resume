import { sections } from '@/lib/worldConfig';
import WorldMount from './WorldMount';

/* 유리 세계. 카메라는 클라이언트가 움직이지만, 다섯 장면의 글은 여기서 서버가 그립니다.

   Vite판에서는 이 다섯 장 — 이력서에서 가장 할 말이 많은 부분 — 이 엔진의 innerHTML로만
   존재해서, JS를 돌리지 않는 크롤러와 AI 에이전트에게는 페이지가 통째로 비어 있었습니다.
   엔진은 이제 여기 있는 마크업을 그대로 집어 씁니다(lib/scrub-engine.js). */

const pad = (n) => String(n).padStart(2, '0');

export default function World() {
  return (
    <WorldMount>
      <div className="sw-copylayer">
        {sections.map((s, i) => (
          <article className="sw-copy" key={s.id} style={{ '--sw-accent': s.accent }}>
            <span className="sw-copy__num">{pad(i + 1)} / {pad(sections.length)}</span>
            {s.eyebrow && <span className="sw-copy__eyebrow">{s.eyebrow}</span>}
            {s.title && <h2 className="sw-copy__title">{s.title}</h2>}
            {s.body && <p className="sw-copy__body">{s.body}</p>}
            {s.tags?.length > 0 && (
              <ul className="sw-copy__tags">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            )}
            {s.cta && (
              <div className="sw-copy__cta">
                {s.cta.primary && (
                  <a className="sw-btn sw-btn--primary" href={s.cta.primary.href || '#'}>
                    {s.cta.primary.label}
                  </a>
                )}
                {s.cta.secondary && (
                  <a className="sw-btn sw-btn--ghost" href={s.cta.secondary.href || '#'}>
                    {s.cta.secondary.label}
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </WorldMount>
  );
}
