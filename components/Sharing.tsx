import { SHARES } from '@/lib/content';

/* 공유 로그. 저장소 발자국이 "무엇을 만들었나"라면 이쪽은 "무엇을 남겼나"입니다.
   앞 섹션들과 마찬가지로 글은 전부 서버가 그리고, JS는 한 줄도 없습니다. */
export default function Sharing() {
  return (
    <section className="slab share" id="sharing" data-stage="sharing">
      <div className="slab__head">
        <p className="eyebrow">Sharing Log</p>
        <h2 className="slab__title">좋은 걸 찾으면 혼자 안 씁니다</h2>
        <p className="share__lead">
          새 모델이 나오면 요약해서, 도구가 필요하면 만들어서, 비용이 걸리면 아끼는 법까지 붙여서
          팀 채널에 올렸습니다. 아래는 실제로 올린 글들입니다.
        </p>
      </div>

      <ol className="share__log">
        {SHARES.map((s) => (
          <li className="share__row" key={s.date + s.title}>
            <div className="share__meta">
              <time className="share__date" dateTime={s.date.replace(/\./g, '-')}>{s.date}</time>
              <span className="share__kind">{s.kind}</span>
            </div>
            <div className="share__say">
              <h3 className="share__title">{s.title}</h3>
              <p className="share__note">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="share__close">
        OCR 테스트가 필요하다길래 웹 버전을 만들어 브랜치에 올리고, API 키와 README 설정법,
        숨김 파일 보는 법까지 적어 뒀습니다. 그래서 어떤 개발자냐고 물으면 —
        <strong> 새로 나온 것을 팀이 오늘 바로 쓸 수 있는 형태로 바꿔 놓는 사람</strong>입니다.
      </p>
    </section>
  );
}
