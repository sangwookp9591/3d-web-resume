import { SHARES, SHARES_LEAD, isoDate } from '@/lib/content';

/* 공유 로그. 저장소 발자국이 "무엇을 만들었나"라면 이쪽은 "무엇을 남겼나"입니다.
   앞 섹션들과 마찬가지로 글은 전부 서버가 그리고, JS는 한 줄도 없습니다. */
export default function Sharing() {
  return (
    <section className="slab share" id="sharing" data-stage="sharing">
      <div className="slab__head">
        <h2 className="slab__title">좋은 걸 찾으면 혼자 안 씁니다</h2>
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
          OCR 테스트가 필요하다길래 웹 버전을 만들어 브랜치에 올렸습니다. API 키 받는 법과
          README 설정, 숨김 파일 보는 법까지 적어 뒀고요. 정리하자면
          <strong> 새로 나온 걸 팀이 오늘 바로 쓸 수 있는 형태까지 만들어 두는 편</strong>입니다.
        </p>
      </div>
    </section>
  );
}
