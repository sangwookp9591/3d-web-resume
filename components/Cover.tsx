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
          <p className="plate__kicker">풀스택 개발자 박상욱 · iron</p>
          {/* 줄바꿈은 두 번까지입니다. 세 줄이 되면 이름 판이 검색창 자리를 넘어
              화면 밖으로 밀려 올라갑니다(1440×900에서 73px이 잘렸습니다). */}
          <h1 className="plate__title">
            화면부터 서버까지,<br />
            <span className="plate__title-mark">막힐 자리를 미리 없앱니다.</span>
          </h1>
          <p className="plate__body">
            해외 환자와 병원을 잇는 의료관광 플랫폼 ZIVO에서 웹 단독 구축부터 어드민 인프라,
            백엔드 코어까지 도맡았습니다. 장애가 난 뒤 수습하기보다 실패할 경로를 먼저 찾아 지우고,
            팀이 마주한 병목을 도구로 풀어왔습니다.
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
          <span className="cue__text">스크롤을 내리면 문제 해결 과정으로 이어집니다</span>
          <span className="cue__rule" aria-hidden="true" />
          <span className="cue__chev" aria-hidden="true" />
        </a>
      </div>
    </CoverParallax>
  );
}
