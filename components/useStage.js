import { useEffect, useState } from 'react';
import { WORLD_STAGES } from '@/lib/guideScript';

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
      const all = blocks();
      // At the very bottom the viewport midpoint still sits in the section above,
      // so the short closing block would never win on its own.
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atEnd) return all[all.length - 1]?.dataset.stage ?? null;

      const mid = window.innerHeight / 2;
      let best = null;
      for (const el of all) {
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

    /* 엔진은 프로그램적 점프(라우트 dot, 내비)에서 스크롤 이벤트 없이 .is-active만 뒤집습니다.
       예전에는 rAF 한 번 뒤에 `.sw-route`를 찾아 붙였는데, 엔진이 동적 import가 되면서
       그 레일은 청크를 받아 오기 전까지 존재하지 않습니다 — 콜드 로드에서는 네트워크 왕복이
       한 프레임을 이길 수 없으므로 옵저버가 영영 안 붙고, 아잉의 설명이 조용히 어긋납니다.
       #world는 서버가 그려 언제나 있으므로 그쪽을 봅니다. 레일을 기다릴 필요도, 경합도 없습니다. */
    const mo = new MutationObserver(onScroll);
    const world = document.getElementById('world');
    if (world) mo.observe(world, { attributes: true, subtree: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mo.disconnect();
    };
  }, []);

  return stage;
}
