'use client';

/* 화면 한가운데 떠 있는 유리 검색창. 누르면 그 자리에서 그대로 자라 채팅창이 됩니다 —
   새 창도, 페이지 이동도 없습니다. 형태는 GPU 파티클 수만 개가 만드는 막이 잡고,
   DOM은 같은 형태로 clip-path만 바뀝니다.

   답은 위키가 하고, 브라우저 안의 소형 모델이 올라오면 그쪽으로 넘어갑니다(brain.js). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useOracleBrain from './brain';
import Markdown from './Markdown';
import { polish, suggest } from '@/lib/answer';
import type { MorphField } from './morph';

type Brain = ReturnType<typeof useOracleBrain>;

/** 로그 한 줄. pending은 답이 아직 흐르는 중이라는 표시입니다.
    tips는 이 답 아래에 붙는 다음 질문거리 — 답이 끝난 뒤에 한 번만 정합니다. */
type Turn = { role: 'you' | 'aing'; text: string; id: string; pending?: boolean; tips?: string[] };

const PROMPTS = [
  'iron은 어떤 개발자예요?',
  '프론트엔드에서 뭘 만들었어요?',
  '권한은 어떻게 정리했어요?',
  '테스트가 들쭉날쭉했을 텐데 어떻게 잡았어요?',
  '쿠폰은 왜 새로 만들었어요?',
  '어떤 걸로 개발해요?',
];

const engineLabel = (brain: Brain) => {
  const name = brain.model.label;
  if (brain.status === 'loading') return `${name} 내려받는 중 ${Math.round(brain.progress * 100)}%`;
  if (brain.status === 'error') return `${name}를 못 띄웠습니다 · 위키로 답할게요`;
  if (brain.engine === 'ollama') return 'Ollama · 이 컴퓨터에서';
  if (brain.engine === 'local') return `${name} · 브라우저 안에서`;
  return '위키에서 그대로 옮겨 옵니다';
};

/* 신기루: 글자가 하나씩 흐려지며 맺혔다가 다시 하나씩 증발합니다.
   한 스팬에 in/out 애니메이션을 이어 붙여 레이어를 겹치지 않습니다. */
function Mirage({ text }: { text: string }) {
  return (
    <span className="mirage" key={text} aria-hidden="true">
      {/* --i는 CSS 변수라 CSSProperties에 이름이 없습니다 — 글자마다 애니메이션을 미는 값입니다. */}
      {[...text].map((ch, i) => (
        <span className="mirage__c" style={{ '--i': i } as React.CSSProperties} key={i}>{ch === ' ' ? ' ' : ch}</span>
      ))}
    </span>
  );
}

export default function Oracle() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);   // 막이 다 맺혀서 안을 만질 수 있는 상태
  const [q, setQ] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pi, setPi] = useState(0);
  const [away, setAway] = useState(false);     // 커버를 벗어나면 비켜섭니다
  const [busy, setBusy] = useState(false);
  const [fieldUp, setFieldUp] = useState(false);
  const [broken, setBroken] = useState(false); // 파티클 장을 못 불러온 경우
  const [mounted, setMounted] = useState(false);
  const brain = useOracleBrain();

  useEffect(() => setMounted(true), []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MorphField | null>(null);   // morph 핸들
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLButtonElement>(null);

  /* 파티클 장은 한 번만 붙입니다. 검색창이 이미 그 장의 일부이기 때문에
     WebGPU 초기화는 페이지 진입 직후, 첫 상호작용 전에 끝나 있어야 합니다. */
  /* mounted를 기다립니다. 판은 portal이라 mounted 전에는 canvas도 panel도 DOM에 없고,
     그때 morph 청크가 먼저 도착하면 두 ref가 null이라 조용히 빠져나갑니다 — broken도
     안 세우고 deps가 []라 재시도도 없으니, 정확히 이 플래그가 막으려던 "눌러도 아무 일도
     안 일어나는 검색창"이 됩니다. 지금은 청크 왕복 덕에 우연히 안 걸릴 뿐입니다. */
  useEffect(() => {
    if (!mounted) return;
    let dead = false;
    let field: MorphField | undefined;
    import('./morph').then(async ({ default: mount }) => {
      if (dead || !canvasRef.current || !panelRef.current) return;
      field = await mount(canvasRef.current, panelRef.current, { onReveal: setReady });
      if (dead) { field.destroy(); return; }
      fieldRef.current = field;
      setFieldUp(true);   // 아래 이펙트가 그동안 정해진 상태를 이제야 물려줍니다
    }).catch((err) => {
      // 청크가 안 올라오면 판은 CSS 초기값에 굳은 채 열려서, 눌러도 아무 일도 안 일어난
      // 것처럼 보입니다. 조용히 실패하느니 검색창을 감춥니다.
      console.error('[oracle] 파티클 장을 불러오지 못했습니다:', err);
      setBroken(true);
    });
    return () => { dead = true; field?.destroy(); fieldRef.current = null; };
  }, [mounted]);

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

  // 모델은 방문자가 물어볼 뜻을 보인 다음에 받습니다(brain.warm). 창을 여는 것과
  // 입력칸에 손을 대는 것이 그 신호입니다 — 스크롤만 하다 나가는 사람은 아무것도 안 받습니다.
  const warm = brain.warm;

  const grow = useCallback(() => {
    warm();
    setOpen(true);
    scrollTo({ top: 0, behavior: 'smooth' });   // 창은 화면 중앙에 있으니 세계도 처음으로
  }, [warm]);

  const shrink = useCallback(() => {
    setOpen(false);
    setReady(false);
  }, []);

  /* 막에게 상태를 물려주는 곳은 여기 하나뿐입니다. fieldUp을 deps에 넣어야
     장이 늦게 붙어도 그 사이에 정해진 상태(스크롤 복원 등)가 반영됩니다. */
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (open) field.open(); else field.close();
    field.setPaused(away && !open);
  }, [open, away, fieldUp]);

  /* 어디에서든 / 또는 Cmd+K로 부르고, Esc로 접습니다. */
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement).tagName);
      if (!open && !typing && (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault(); grow();
      } else if (open && e.key === 'Escape') shrink();
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  }, [open, grow, shrink]);

  // 막이 다 맺힌 다음에 포커스를 옮깁니다 — 그 전에는 입력칸이 아직 잘려 있습니다.
  useEffect(() => { if (open && ready) inputRef.current?.focus(); }, [open, ready]);

  /* 열려 있는 동안 판 뒤의 페이지는 탭으로도 스크린리더로도 들어갈 수 없어야 하고,
     스크롤도 멈춰야 합니다. 판은 portal로 body에 있으므로 #root만 재우면 됩니다. */
  useEffect(() => {
    if (!open) return;
    const root = document.getElementById('root')!;
    const prev = document.body.style.overflow;
    root.inert = true;
    document.body.style.overflow = 'hidden';
    return () => { root.inert = false; document.body.style.overflow = prev; };
  }, [open]);

  /* 토큰 하나마다 turns가 새 배열이 되므로, 여기서 매번 smooth 스크롤을 걸면
     애니메이션이 끝나기 전에 다시 시작돼 로그가 글을 따라가는 대신 떨립니다.
     답이 흐르는 동안에는 즉시 붙이고, 다 끝났을 때만 부드럽게 맞춥니다. */
  const streaming = turns[turns.length - 1]?.pending;
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: streaming ? 'auto' : 'smooth' });
  }, [turns, streaming]);

  // 접을 때 포커스를 검색창으로 돌려놓습니다. 핸들러에서 바로 focus()하면 그 버튼이
  // 아직 열림 상태의 aria-hidden/tabIndex=-1을 달고 있어서, 포커스와 접근성 트리가 어긋납니다.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) barRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  /* 질문은 입력칸에서도 오고 추천 칩에서도 옵니다. 칩 쪽에 setQ→submit을 태우면
     한 렌더 늦게 읽혀 빈 질문이 나가므로, 문자열을 그대로 받습니다. */
  const ask = async (raw?: string) => {
    const text = (raw ?? q).trim();
    if (!text || busy) return;
    setQ('');
    setBusy(true);
    fieldRef.current?.stir(1);                 // 생각하는 동안 막이 술렁입니다

    /* 다음 질문거리. 위키가 내주는 화제가 먼저입니다 — 실제로 답이 있는 화제라
       눌렀을 때 빈손이 되지 않습니다. 검색이 조각 하나만 물어 온 질문("상욱은요?")에는
       내줄 화제가 없으므로, 그때만 첫 화면의 예시 질문 중 아직 안 물어본 것을 씁니다. */
    const asked = [...turns.filter((t) => t.role === 'you').map((t) => t.text), text];
    const nextTips = (qq: string) => {
      const found = suggest(qq, asked);
      return found.length ? found : PROMPTS.filter((p) => !asked.includes(p)).slice(0, 3);
    };

    const id = String(Date.now());
    const patch = (fn: (v: Turn) => Partial<Turn>) => setTurns((t) => t.map((v) => (v.id === id ? { ...v, ...fn(v) } : v)));
    setTurns((t) => [...t, { role: 'you', text, id: `${id}q` }, { role: 'aing', text: '', id, pending: true }]);

    try {
      const full = await brain.ask(text, (piece) => patch((v) => ({ text: v.text + piece })));
      // 반환값이 언제나 최종본입니다. 스트리밍 도중 엔진이 죽으면 brain이 위키 답을 돌려주는데,
      // 그때 이미 흘러온 반토막을 남겨두면 잘린 문장이 완성된 답처럼 보입니다.
      patch(() => ({ text: full, pending: false, tips: nextTips(text) }));
    } catch (err) {
      patch(() => ({ text: `답을 만들지 못했습니다: ${(err as Error).message}`, pending: false, tips: nextTips(text) }));
    } finally {
      setBusy(false);
      fieldRef.current?.stir(0);
    }
  };

  const panel = (
    <>
      <canvas className="orc__fx" ref={canvasRef} aria-hidden="true" />
      {open && <button type="button" className="orc__scrim" onClick={shrink} aria-label="닫기" />}

      <div
        className={`orc__panel${open ? ' is-open' : ''}${(away && !open) || broken ? ' is-away' : ''}`}
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
            <span className={`orc__orb${busy ? ' is-busy' : ''}`} aria-hidden="true" />
            <span className="orc__id">
              <p className="orc__title">iron wiki</p>
              <p className="orc__engine">{engineLabel(brain)}</p>
            </span>
            {/* 헤더에 남는 버튼은 실패했을 때의 재시도 하나뿐입니다. 390px 화면에서 버튼을
                하나 더 두면 헤더가 58px에서 106px로 부풀어 판의 절반을 먹습니다. */}
            {brain.status === 'error' && (
              <button type="button" className="orc__opt" onClick={brain.retryModel} tabIndex={open ? 0 : -1}>
                다시 시도
              </button>
            )}
            <button type="button" className="orc__x" onClick={shrink} tabIndex={open ? 0 : -1} aria-label="닫기">✕</button>
          </header>

          {/* aria-busy: 답이 흐르는 동안에는 스크린리더가 매 토큰마다 처음부터
              다시 읽지 않고, 끝난 뒤에 한 번 읽습니다. */}
          <div className="orc__log" ref={logRef} role="log" aria-live="polite" aria-busy={!!streaming}>
            {turns.length === 0
              ? <p className="orc__hint">이력이든 저장소든 쓰는 도구든, 편하게 물어보세요. 아는 데까지 답합니다.</p>
              : turns.map((t, i) => {
                  if (t.role === 'you') {
                    return <p className="orc__turn orc__turn--you" key={t.id ?? i}>{t.text}</p>;
                  }
                  /* 흐르는 중에만 다듬습니다. 모델이 사고 과정이나 "### 요약"을 먼저 뱉는
                     순간 그게 그대로 화면에 흐르므로 실시간으로 걷어내야 하지만, 끝난 답은
                     brain.say()가 이미 다듬어 저장한 것이라 다시 통과시켜도 같은 글자입니다.
                     로그 전체를 토큰마다 다시 다듬을 이유가 없습니다. */
                  const body = t.pending ? polish(t.text) : t.text;
                  /* 추천은 마지막 답 아래에만 답니다. 모든 답마다 달면 로그가 칩 밭이 되고,
                     지난 답 밑의 칩은 이미 지나간 갈림길이라 누를 이유도 없습니다. */
                  const tips = i === turns.length - 1 && !t.pending ? t.tips : undefined;
                  return (
                    <div key={t.id ?? i}>
                      <div className={`orc__turn orc__turn--aing${body ? '' : ' is-empty'}`}>
                        {body
                          ? <Markdown text={body} />
                          : <span className="orc__dots" aria-label="생각 중"><i /><i /><i /></span>}
                      </div>
                      {tips && tips.length > 0 && (
                        <div className="orc__tips">
                          <p className="orc__tips__lead">이런 것도 궁금하실 것 같은데요</p>
                          <ul>
                            {tips.map((tip) => (
                              <li key={tip}>
                                <button type="button" className="orc__tip" disabled={busy}
                                  onClick={() => void ask(tip)} tabIndex={open ? 0 : -1}>
                                  {tip}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>

          <form className="orc__form" onSubmit={(e) => { e.preventDefault(); void ask(); }}>
            <input
              ref={inputRef}
              className="orc__input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={warm}
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
      {/* 서버에는 document가 없으므로 마운트 뒤에 붙입니다. 판 안에는 크롤러가 읽어야 할
          글이 없고(WebGPU 검색창), 자리는 위 oracle-slot이 미리 잡아 둡니다. */}
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
