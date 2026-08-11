/* 저장소 발자국. 모든 수치는 커밋 분석에서 나왔고, 막대 길이가 곧 점유율입니다.
   차오르는 연출은 CSS 스크롤 타임라인이 하므로 이 섹션에는 JS가 한 줄도 없습니다. */
export const REPOS = [
  {
    name: 'ZIVO_FRONT', stack: 'Next.js 16 · React 19', share: 98, shareLabel: '98%',
    commits: '1,947 커밋', role: '웹 서비스 단독 구축', note: '14개 언어 · QR 주문·결제',
  },
  {
    name: 'ZIVO_ADMIN', stack: 'React 19 · StyleX', share: 68, shareLabel: '68%',
    commits: '1,781 커밋', role: '공통 인프라 · 권한 · FSD 리드', note: 'shared 레이어 713커밋',
  },
  {
    name: 'ZIVO_BACK', stack: 'Spring Boot 3.5 · Java', share: 33, shareLabel: '1위 · 33%',
    commits: '1,512 커밋', role: '검색 · AI · 쿠폰 · 통계 주도', note: 'DDD/Hexagonal 신규 설계',
  },
];

export default function Footprint() {
  return (
    <section className="slab" id="footprint" data-stage="footprint">
      <div className="slab__head">
        <p className="eyebrow">Repository Footprint</p>
        <h2 className="slab__title">세 저장소에서 역할은 각각 달랐습니다</h2>
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
