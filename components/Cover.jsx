import { COVER_STATS } from '@/lib/content';
import CoverParallax from './CoverParallax';
import Oracle from './oracle/Oracle';

/* 공간 UI: 서로 다른 깊이의 판들. 포인터는 판이 아니라 카메라를 움직이므로 시차가
   느슨한 카드 세 장이 아니라 하나의 방으로 읽힙니다.

   글자는 전부 서버에서 나옵니다. 클라이언트로 넘어가는 것은 포인터를 CSS 변수로 옮기는
   래퍼 하나뿐입니다. */

export default function Cover() {
  return (
    <CoverParallax>
      <div className="cover__stage">
        <div className="plate plate--name">
          <p className="plate__kicker">박상욱 · iron</p>
          <h1 className="plate__title">
            제품을 만들고,<br />
            <span className="plate__title-mark">팀의 작업 방식</span>을<br />
            설계하는 개발자.
          </h1>
          <p className="plate__body">
            의료관광 플랫폼의 웹(단독) · 어드민(리드) · 백엔드(최다 기여) 3개 저장소를
            9개월간 관통했습니다. 나머지는 아래 창에 물어보세요.
          </p>
        </div>

        {/* 두 판 사이, 화면 한복판. 내 문장 다음에 오는 것은 방문자의 질문입니다. */}
        <Oracle />

        <dl className="plate plate--stats">
          {COVER_STATS.map(([n, l]) => (
            <div className="stat" key={l}>
              <dt className="stat__n">{n}</dt>
              <dd className="stat__l">{l}</dd>
            </div>
          ))}
        </dl>

        <a className="cue" href="#world">
          <span className="cue__text">스크롤하면 이 이야기 안으로 들어갑니다</span>
          <span className="cue__rule" aria-hidden="true" />
          <span className="cue__chev" aria-hidden="true" />
        </a>
      </div>
    </CoverParallax>
  );
}
