import { PERSON } from '@/lib/site';
import { dotted, recentProjects, recentVideos } from '@/lib/feeds';

/* 마지막 판. 여기 두 목록만 저장소 밖(GitHub·YouTube)에서 오고, 6시간마다 다시 옵니다.
   둘을 나란히 부르는 이유는 순서가 없기 때문입니다 — 이어 붙이면 느린 쪽 뒤에
   빠른 쪽이 줄을 섭니다. 바깥이 죽어 목록이 비어도 로고와 링크는 남습니다. */

/* 로고는 파일이 아니라 path입니다. img로 두면 요청이 둘 늘고, 색을 currentColor로
   물려받지 못해 hover에서 글자만 움직입니다. 마크는 각각 GitHub(옥티콘)와
   simple-icons의 공식 형태입니다. */
const MARK = {
  github:
    'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z',
  youtube:
    'M15.665 4.124a2.01 2.01 0 0 0-1.415-1.424C13.003 2.363 8 2.363 8 2.363s-5.003 0-6.25.337A2.01 2.01 0 0 0 .335 4.124C0 5.38 0 8 0 8s0 2.62.335 3.876a2.01 2.01 0 0 0 1.415 1.424C2.997 13.637 8 13.637 8 13.637s5.003 0 6.25-.337a2.01 2.01 0 0 0 1.415-1.424C16 10.62 16 8 16 8s0-2.62-.335-3.876zM6.364 10.379V5.621L10.545 8l-4.181 2.379z',
};

function Mark({ of }: { of: keyof typeof MARK }) {
  return (
    <svg className="feed__logo" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={MARK[of]} />
    </svg>
  );
}

export default async function Colophon() {
  const [projects, videos] = await Promise.all([recentProjects(), recentVideos()]);

  return (
    <footer className="colophon" data-stage="colophon">
      <div className="feeds">
        <section className="feed">
          <h2 className="feed__head">
            <a className="feed__brand" href={PERSON.github} target="_blank" rel="me noreferrer">
              <Mark of="github" />
              GitHub
              <span className="feed__at">@{PERSON.githubLogin}</span>
            </a>
          </h2>
          {projects.length > 0 && (
            <ul className="feed__list">
              {projects.map((p) => (
                <li key={p.name}>
                  <a className="feed__item" href={p.url} target="_blank" rel="noreferrer">
                    <span className="feed__name">{p.name}</span>
                    <span className="feed__meta">
                      {[p.lang, dotted(p.pushed)].filter(Boolean).join(' · ')}
                    </span>
                    {p.desc && <span className="feed__desc">{p.desc}</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="feed">
          <h2 className="feed__head">
            <a className="feed__brand" href={PERSON.youtube} target="_blank" rel="me noreferrer">
              <Mark of="youtube" />
              YouTube
              <span className="feed__at">{PERSON.youtubeHandle}</span>
            </a>
          </h2>
          {videos.length > 0 && (
            <ul className="feed__list">
              {videos.map((v) => (
                <li key={v.id}>
                  <a
                    className="feed__item feed__item--vid"
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank" rel="noreferrer"
                  >
                    {/* 제목이 바로 옆에 글자로 있으므로 썸네일은 장식입니다(alt=""). */}
                    <img
                      className="feed__thumb" src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                      alt="" width={320} height={180} loading="lazy" decoding="async"
                    />
                    <span className="feed__vidtext">
                      <span className="feed__name">{v.title}</span>
                      <time className="feed__meta" dateTime={v.date}>{dotted(v.date)}</time>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <a className="colophon__mail" href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
      <p className="colophon__meta">
        {PERSON.name} (iron) · {PERSON.employer} · 2025.10 – 2026.07
      </p>
    </footer>
  );
}
