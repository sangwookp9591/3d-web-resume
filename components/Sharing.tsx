import { SHARES, SHARES_LEAD, isoDate } from '@/lib/content';

/* 공유 로그. 저장소 발자국이 "무엇을 만들었나"라면 이쪽은 "무엇을 남겼나"입니다.
   앞 섹션들과 마찬가지로 글은 전부 서버가 그리고, JS는 한 줄도 없습니다. */
export default function Sharing() {
  return (
    <section className="slab share" id="sharing" data-stage="sharing">
      <div className="slab__head">
        <h2 className="slab__title">새로 배운 건 혼자 두지 않고, 팀의 도구로 만들었습니다</h2>
        <p className="share__lead">{SHARES_LEAD}</p>
      </div>

      <ol className="share__log">
        {SHARES.map((s) => (
          <li className="share__row" key={s.date + s.title}>
            <div className="share__meta">
              <time className="share__date" dateTime={isoDate(s.date)}>{s.date}</time>
              <span className="share__kind">{s.kind}</span>
            </div>
            <div>
              <h3 className="share__title">{s.title}</h3>
              <p className="share__note">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 목록과 같은 폭의 상자 안에서 왼쪽을 맞춥니다. 문단 자신에 max-width를 주면
          그 폭이 이겨서 auto 마진이 가운데로 밀고, 위 목록보다 안쪽에서 시작합니다. */}
      <div className="share__foot">
        <p className="share__close">
          동료가 OCR 연동 테스트로 막혀 있을 때 바로 실행할 수 있는 웹 테스트 환경과 가이드를 만들어 올렸습니다.
          새로운 기술이나 도구가 나오면 나 혼자 쓰는 데 그치지 않고,
          <strong> 팀 전체가 오늘 바로 써 볼 수 있는 수준까지 만들어 두는 편</strong>입니다.
        </p>
      </div>
    </section>
  );
}
