import { REPOS } from '@/lib/content';

/* 저장소 발자국. 모든 수치는 커밋 분석에서 나왔고, 막대 길이가 곧 점유율입니다.
   차오르는 연출은 CSS 스크롤 타임라인이 하므로 이 섹션에는 JS가 한 줄도 없습니다. */
export default function Footprint() {
  return (
    <section className="slab" id="footprint" data-stage="footprint">
      <div className="slab__head">
        <h2 className="slab__title">웹, 어드민, 백엔드 — 세 영역 모두를 관통하며 만들었습니다</h2>
      </div>
      <ul className="repos">
        {REPOS.map((r) => (
          <li className="repo" key={r.name}>
            <div className="repo__id">
              <h3 className="repo__name">{r.name}</h3>
              <p className="repo__stack">{r.stack}</p>
            </div>
            <div className="repo__meter">
              <div className="repo__fill" style={{ '--share': `${r.share}%` }} />
              <span className="repo__share">{r.shareLabel}</span>
            </div>
            <div className="repo__say">
              <p className="repo__role">{r.role}</p>
              <p className="repo__note">{r.commits} · {r.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
