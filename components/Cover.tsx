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
          {/* 이름은 아래 h1이 말하므로 여기서는 뺍니다 — 눈이 두 번 읽을 이유가 없습니다. */}
          <p className="plate__kicker">풀스택 개발자 · iron</p>
          {/* 줄바꿈은 두 번까지입니다. 세 줄이 되면 이름 판이 검색창 자리를 넘어
              화면 밖으로 밀려 올라갑니다(1440×900에서 73px이 잘렸습니다).
              두 번째 줄은 13~14자가 한계입니다 — 그보다 길면 거기서 한 번 더 접힙니다. */}
          <h1 className="plate__title">
            안녕하세요,<br />
            <span className="plate__title-mark">박상욱입니다.</span>
          </h1>
          <p className="plate__body">
            해외 환자와 병원을 잇는 의료관광 플랫폼 ZIVO에서 아홉 달 동안 일했습니다. 손님이 보는
            화면부터 그 뒤의 서버까지 만들었고, 장애가 난 뒤에 수습하기보다 막힐 자리를 먼저 찾아
            지우는 편입니다. 저에 대해 좀 더 알아보시겠어요?
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
