/* Hallmark · pre-emit critique: P5 H4 E4 S5 R4 V5 */
import { useEffect, useRef, useState } from 'react';
import mountScrollWorld from './scrub-engine.js';
import { sections, connectors } from './worldConfig.js';
import { SCRIPT } from './guideScript.js';
import useStage from './useStage.js';
import CharacterKit from './CharacterKit.jsx';

/* ── Cover ────────────────────────────────────────────────────────────────
   Spatial UI: planes at different depths. The pointer moves the camera, not
   the panels — so the parallax reads as one room, not three loose cards. */
function Cover() {
  const stage = useRef(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--px', (e.clientX / window.innerWidth - 0.5).toFixed(4));
        el.style.setProperty('--py', (e.clientY / window.innerHeight - 0.5).toFixed(4));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className="cover" id="top" data-stage="cover" ref={stage}>
      <p className="cover__seal" aria-hidden="true">之印</p>

      <div className="cover__stage">
        <div className="plate plate--name">
          <p className="plate__kicker">박상욱 · iron</p>
          <h1 className="plate__title">
            제품을 만들고,<br />
            <span className="plate__title-mark">팀의 작업 방식</span>을<br />
            설계하는 개발자.
          </h1>
          <p className="plate__body">
            9개월간 의료관광 플랫폼의 웹 프론트엔드(단독) · 어드민(리드) · 백엔드(최다 기여)
            3개 저장소를 관통했습니다. 기능을 구현하는 데서 멈추지 않고 — 아키텍처 규율을 도구로
            자동 집행하고, 실패 경로를 먼저 설계하고, 반복되는 버그를 규약으로 차단했습니다.
          </p>
        </div>

        <dl className="plate plate--stats">
          {[
            ['5,240+', '커밋 · 9개월'],
            ['3 / 3', '저장소 핵심 기여자'],
            ['98%', '웹 프론트 커밋 점유'],
            ['440', '머지한 Pull Request'],
          ].map(([n, l]) => (
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
    </header>
  );
}

/* ── The world ────────────────────────────────────────────────────────────
   The vanilla engine owns this subtree; React only hands it a node and the
   theme tokens (which have to sit on .sw-root — the engine declares its own
   defaults there, and a declaration on the element beats inheritance). */
function World() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    mountScrollWorld(el, {
      brand: { name: 'iron · 之印', href: '#top' },
      hint: '스크롤로 날아갑니다',
      nav: true,
      atmosphere: true,
      diveScroll: 1.4,
      connScroll: 0.95,
      sections,
      connectors,
    });

    // The engine's chrome and sky are position:fixed — they'd sit on top of the
    // cover and the closing sections. Only show them while the world is in view.
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute('data-inview', e.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div id="world" data-stage="world" ref={host} />;
}

/* ── Ai-ng, the guide ─────────────────────────────────────────────────────
   Agentic UX, small scale: nothing to click. She reads where you are and
   explains what is actually on screen. */
function Guide() {
  const stage = useStage();
  const line = SCRIPT[stage] ?? SCRIPT.cover;
  const [open, setOpen] = useState(true);

  return (
    <aside className={`aing${open ? '' : ' aing--tucked'}`} data-stage-of={stage}>
      <button
        type="button"
        className="aing__cat"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? '아잉 설명 접기' : '아잉 설명 펼치기'}
      >
        {/* the pose swap is the animation — no crossfade needed, she just reacts */}
        <img src={`./mascot-${line.pose}.webp`} alt="" width="120" height="120" key={line.pose} />
      </button>
      <p className="aing__say" role="status" aria-live="polite">
        <span key={stage}>{line.text}</span>
      </p>
    </aside>
  );
}

/* ── Repository footprint ─────────────────────────────────────────────────
   Every figure is from the commit analysis; the bar length IS the share. */
const REPOS = [
  { name: 'ZIVO_FRONT', stack: 'Next.js 16 · React 19', share: 98, shareLabel: '98%',
    commits: '1,947 커밋', role: '웹 서비스 단독 구축', note: '14개 언어 · QR 주문·결제' },
  { name: 'ZIVO_ADMIN', stack: 'React 19 · StyleX', share: 68, shareLabel: '68%',
    commits: '1,781 커밋', role: '공통 인프라 · 권한 · FSD 리드', note: 'shared 레이어 713커밋' },
  { name: 'ZIVO_BACK', stack: 'Spring Boot 3.5 · Java', share: 33, shareLabel: '1위 · 33%',
    commits: '1,512 커밋', role: '검색 · AI · 쿠폰 · 통계 주도', note: 'DDD/Hexagonal 신규 설계' },
];

function Footprint() {
  const [lit, setLit] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLit(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="slab" id="footprint" data-stage="footprint" ref={ref}>
      <div className="slab__head">
        <p className="eyebrow">Repository Footprint</p>
        <h2 className="slab__title">세 저장소에서 역할은 각각 달랐습니다</h2>
      </div>
      <ul className="repos">
        {REPOS.map((r) => (
          <li className="repo" key={r.name}>
            <div className="repo__id">
              <h3 className="repo__name">{r.name}</h3>
              <p className="repo__stack">{r.stack}</p>
            </div>
            <div className="repo__meter">
              <div className="repo__fill" style={{ '--share': lit ? `${r.share}%` : '0%' }} />
              <span className="repo__share">{r.shareLabel}</span>
            </div>
            <div className="repo__say">
              <p className="repo__role">{r.role}</p>
              <p className="repo__note">{r.commits} · {r.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Principles ───────────────────────────────────────────────────────────*/
const PRINCIPLES = [
  ['좋은 구조는 문서가 아니라 도구가 지킨다.',
   'ArchUnit으로 의존 방향을, codemod로 디자인 토큰을, 단일 훅으로 권한을 강제했습니다. 리뷰어의 기억력에 기대는 규칙은 규칙이 아닙니다.'],
  ['실패 비용이 큰 곳일수록, 실패 경로를 먼저 설계한다.',
   '결제의 취소·이탈 흐름, LLM의 fallback 체인, 쿠폰의 Outbox — 성공 케이스는 누구나 만듭니다. 차이는 무너지는 방식에서 납니다.'],
  ['버그는 고치는 것이 아니라, 재발이 불가능한 구조로 만드는 것.',
   '이중 토스트는 전역 onError 규약으로, E2E 플레이크는 하이드레이션 유틸과 burn-in으로 — 같은 문제를 두 번 만나지 않도록 계층에서 차단했습니다.'],
];

function Principles() {
  return (
    <section className="creed" id="principles" data-stage="principles">
      <p className="eyebrow eyebrow--center">Principles</p>
      <ol className="creed__list">
        {PRINCIPLES.map(([head, sub], i) => (
          <li className="creed__item" key={head}>
            <span className="creed__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="creed__head">{head}</h3>
            <p className="creed__sub">{sub}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Colophon ─────────────────────────────────────────────────────────────*/
function Colophon() {
  return (
    <footer className="colophon" data-stage="colophon">
      <a className="colophon__mail" href="mailto:sangwookp9591@gmail.com">sangwookp9591@gmail.com</a>
      <p className="colophon__meta">
        박상욱 (iron) · ZIVO Medical Tourism Platform · 2025.10 – 2026.07
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <Cover />
      <World />
      <Footprint />
      <Principles />
      <CharacterKit />
      <Colophon />
      <Guide />
    </>
  );
}
