/* 화면 한가운데 떠 있는 유리 검색창. 누르면 그 자리에서 그대로 자라 채팅창이 됩니다 —
   새 창도, 페이지 이동도 없습니다. 형태는 GPU 파티클 수만 개가 만드는 막이 잡고,
   DOM은 같은 형태로 clip-path만 바뀝니다.

   답은 위키가 하고, 다음 단계에서 브라우저 안의 Gemma 4로 넘어갑니다. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lookup } from './wiki.js';

const PROMPTS = [
  'iron은 어떤 개발자인가요?',
  '프론트엔드에서 무엇을 만들었나요?',
  '권한 시스템은 어떻게 설계했나요?',
  '테스트 플레이크를 어떻게 0으로 만들었나요?',
  '쿠폰 도메인을 왜 새로 설계했나요?',
  '어떤 기술 스택을 쓰나요?',
];

/* 신기루: 글자가 하나씩 흐려지며 맺혔다가 다시 하나씩 증발합니다.
   한 스팬에 in/out 애니메이션을 이어 붙여 레이어를 겹치지 않습니다. */
function Mirage({ text }) {
  return (
    <span className="mirage" key={text} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span className="mirage__c" style={{ '--i': i }} key={i}>{ch === ' ' ? ' ' : ch}</span>
      ))}
    </span>
  );
}

export default function Oracle() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);   // 막이 다 맺혀서 안을 만질 수 있는 상태
  const [q, setQ] = useState('');
  const [turns, setTurns] = useState([]);
  const [pi, setPi] = useState(0);
  const [away, setAway] = useState(false);     // 커버를 벗어나면 비켜섭니다

  const canvasRef = useRef(null);
  const panelRef = useRef(null);
  const fieldRef = useRef(null);               // morph 핸들
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const barRef = useRef(null);

  /* 파티클 장은 한 번만 붙입니다. 검색창이 이미 그 장의 일부이기 때문에
     WebGPU 초기화는 페이지 진입 직후, 첫 상호작용 전에 끝나 있어야 합니다. */
  useEffect(() => {
    let dead = false;
    let field;
    import('./morph.js').then(async ({ default: mount }) => {
      if (dead || !canvasRef.current || !panelRef.current) return;
      field = await mount(canvasRef.current, panelRef.current, { onReveal: setReady });
      if (dead) { field.destroy(); return; }
      fieldRef.current = field;
    });
    return () => { dead = true; field?.destroy(); fieldRef.current = null; };
  }, []);

  useEffect(() => {
    if (open) return;
    const id = setInterval(() => setPi((i) => (i + 1) % PROMPTS.length), 4200);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    const on = () => setAway(scrollY > innerHeight * 0.72);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  const grow = useCallback(() => {
    setOpen(true);
    fieldRef.current?.open();
    scrollTo({ top: 0, behavior: 'smooth' });   // 창은 화면 중앙에 있으니 세계도 처음으로
  }, []);

  const shrink = useCallback(() => {
    setOpen(false);
    setReady(false);
    fieldRef.current?.close();
    barRef.current?.focus();
  }, []);

  /* 어디에서든 / 또는 Cmd+K로 부르고, Esc로 접습니다. */
  useEffect(() => {
    const on = (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
      if (!open && !typing && (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault(); grow();
      } else if (open && e.key === 'Escape') shrink();
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  }, [open, grow, shrink]);

  // 막이 다 맺힌 다음에 포커스를 옮깁니다 — 그 전에는 입력칸이 아직 잘려 있습니다.
  useEffect(() => { if (open && ready) inputRef.current?.focus(); }, [open, ready]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  const ask = (e) => {
    e?.preventDefault();
    const text = q.trim();
    if (!text) return;
    setQ('');
    fieldRef.current?.stir(1);                 // 답하는 동안 막이 술렁입니다
    setTurns((t) => [...t, { role: 'you', text }, { role: 'aing', text: lookup(text) }]);
    setTimeout(() => fieldRef.current?.stir(0), 900);
  };

  const panel = (
    <>
      <canvas className="orc__fx" ref={canvasRef} aria-hidden="true" />
      {open && <button type="button" className="orc__scrim" onClick={shrink} aria-label="닫기" />}

      <div
        className={`orc__panel${open ? ' is-open' : ''}${away && !open ? ' is-away' : ''}`}
        ref={panelRef}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? 'true' : undefined}
        aria-label={open ? 'iron 위키' : undefined}
      >
        {/* 접힌 모습: 검색창 그 자체 */}
        <button
          type="button"
          className="orc__bar"
          ref={barRef}
          onClick={grow}
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
          aria-label="iron에 대해 물어보기"
        >
          <span className="orc__glyph" aria-hidden="true" />
          <span className="orc__slot"><Mirage text={PROMPTS[pi]} /></span>
          <kbd className="orc__kbd" aria-hidden="true">/</kbd>
        </button>

        {/* 펼친 모습: 같은 판 안에서 자라난 채팅 */}
        <div className="orc__chat" aria-hidden={!open || undefined}>
          <header className="orc__head">
            <span className="orc__orb" aria-hidden="true" />
            <p className="orc__title">iron wiki</p>
            <button type="button" className="orc__x" onClick={shrink} tabIndex={open ? 0 : -1} aria-label="닫기">✕</button>
          </header>

          <div className="orc__log" ref={logRef} role="log" aria-live="polite">
            {turns.length === 0
              ? <p className="orc__hint">이력 · 저장소 · 기술 스택 · 일하는 방식에 대해 물어보세요.</p>
              : turns.map((t, i) => (
                  <p className={`orc__turn orc__turn--${t.role}`} key={i}>{t.text}</p>
                ))}
          </div>

          <form className="orc__form" onSubmit={ask}>
            <input
              ref={inputRef}
              className="orc__input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="무엇이 궁금한가요?"
              aria-label="질문"
              tabIndex={open ? 0 : -1}
            />
            <button type="submit" className="orc__send" disabled={!q.trim()} tabIndex={open ? 0 : -1}>보내기</button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 판은 화면 중앙에 fixed로 떠 있으므로, 커버 레이아웃에는 그만한 자리만 남깁니다. */}
      <div className="oracle-slot" aria-hidden="true" />
      {createPortal(panel, document.body)}
    </>
  );
}
