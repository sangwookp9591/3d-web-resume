import { useEffect, useState } from 'react';
import { WORLD_STAGES } from './guideScript.js';

/* Which part of the page is the reader actually looking at?
   Two signals, because the world doesn't scroll like the rest of the page:
   - plain sections  → whichever [data-stage] block covers the viewport middle
   - inside the world → the engine's own active route dot (it already does the
     scroll→scene math, so re-deriving it here would just drift from the video). */
export default function useStage() {
  const [stage, setStage] = useState('cover');

  useEffect(() => {
    const blocks = () => Array.from(document.querySelectorAll('[data-stage]'));

    const readPlain = () => {
      const mid = window.innerHeight / 2;
      let best = null;
      for (const el of blocks()) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) best = el;
      }
      return best?.dataset.stage ?? null;
    };

    const activeWorldScene = () => {
      const dots = document.querySelectorAll('.sw-route__dot');
      for (let i = 0; i < dots.length; i++) {
        if (dots[i].classList.contains('is-active')) return WORLD_STAGES[i] ?? null;
      }
      return null;
    };

    let ticking = false;
    const read = () => {
      ticking = false;
      const plain = readPlain();
      // `world` is a marker, not a stage — resolve it to the scene in view.
      const next = plain === 'world' ? (activeWorldScene() ?? 'genesis') : plain;
      if (next) setStage((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read); }
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // The engine flips .is-active without a scroll event of its own on programmatic
    // jumps (route dots, nav). Attach after paint — the rail doesn't exist until the
    // engine has mounted.
    const mo = new MutationObserver(onScroll);
    const attach = requestAnimationFrame(() => {
      const rail = document.querySelector('.sw-route');
      if (rail) mo.observe(rail, { attributes: true, subtree: true, attributeFilter: ['class'] });
      read();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(attach);
      mo.disconnect();
    };
  }, []);

  return stage;
}
