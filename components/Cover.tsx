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
      <div className="corridor" aria-hidden="true">
        <div className="corridor__camera">
          <span className="corridor__ceiling" />
          <span className="corridor__floor" />
          <span className="corridor__wall corridor__wall--left" />
          <span className="corridor__wall corridor__wall--right" />
          <span className="corridor__end" />
          <span className="corridor__frame corridor__frame--l1">WEB 0→1</span>
          <span className="corridor__frame corridor__frame--l2">PAYMENT</span>
          <span className="corridor__frame corridor__frame--r1">PLATFORM</span>
          <span className="corridor__frame corridor__frame--r2">BACKEND</span>
        </div>
      </div>

      <div className="cover__stage">
        <div className="plate plate--name">
          <p className="plate__kicker">박상욱 · 풀스택 개발자</p>
          {/* 줄바꿈은 두 번까지입니다. 세 줄이 되면 이름 판이 검색창 자리를 넘어
              화면 밖으로 밀려 올라갑니다(1440×900에서 73px이 잘렸습니다).
              두 번째 줄은 13~14자가 한계입니다 — 그보다 길면 거기서 한 번 더 접힙니다. */}
          <h1 className="plate__title">
            문제는 화면 하나에서<br />
            <span className="plate__title-mark">끝나지 않았습니다.</span>
          </h1>
          <p className="plate__body">
            해외 환자가 검색으로 들어와 결제를 끝내고, 운영자가 그 과정을 관리할 때까지.
            ZIVO의 웹과 어드민, 서버를 함께 맡으며 흐름이 끊기는 지점을 찾아 해결했습니다.
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
          <span className="cue__text">복도를 따라 다섯 가지 문제 해결로 들어가 보세요</span>
          <span className="cue__rule" aria-hidden="true" />
          <span className="cue__chev" aria-hidden="true" />
        </a>
      </div>
    </CoverParallax>
  );
}
