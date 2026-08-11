'use client';

import { useEffect, useState } from 'react';
import { SCRIPT } from '@/lib/guideScript';
import useStage from './useStage';

/* Ai-ng, the guide. Agentic UX, small scale: 누를 것이 없습니다. 지금 어디를 보고 있는지
   읽고 화면에 실제로 있는 것을 설명합니다. 스크롤을 따라가야 하므로 클라이언트입니다. */
const BASE = '/mascot/';

export default function Guide() {
  const stage = useStage();
  const line = SCRIPT[stage] ?? SCRIPT.cover;
  const [open, setOpen] = useState(true);

  /* 애니메이션 WebP는 멈출 수 없으므로, 모션을 줄여 달라고 한 방문자에게는 요청하지도
     않은 루프 대신 정지 포즈를 보여줍니다.

     서버에는 matchMedia가 없어 한쪽을 골라야 하는데, 기본을 "정지"로 둡니다. 반대로 두면
     reduced-motion 사용자가 하이드레이션 전에 루프를 내려받고 보게 됩니다 — 약속을 첫
     페인트에서 이미 어기는 셈입니다. 정지 포즈는 원래 루프가 디코딩되는 동안의 포스터라,
     나머지 방문자에게는 한 박자 뒤 모션으로 바뀔 뿐 손해가 없습니다. */
  const [still, setStill] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setStill(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const src = still || !line.motion
    ? `${BASE}pose/${line.pose}.webp`
    : `${BASE}motion/${line.motion}.webp`;

  return (
    <aside className={`aing${open ? '' : ' aing--tucked'}`} data-stage-of={stage}>
      <button
        type="button"
        className="aing__cat"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? '아잉 설명 접기' : '아잉 설명 펼치기'}
      >
        {/* src를 key로 둬서 장면이 바뀌면 루프가 0프레임부터 다시 돕니다 — 반응하는 것처럼 읽힙니다 */}
        <img src={src} alt="" width="120" height="120" key={src} />
      </button>
      <p className="aing__say" role="status" aria-live="polite">
        <span key={stage}>{line.text}</span>
      </p>
    </aside>
  );
}
