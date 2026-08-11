import { useEffect, useState } from 'react';

/* Which part of the page is the reader actually looking at? 화면 한복판을 덮고 있는
   [data-stage] 블록입니다. 픽셀 여정의 다섯 씬도 이제 문서 흐름에 있는 섹션이라
   — 영상 스크럽 시절과 달리 — 같은 규칙으로 잡힙니다. 중첩된 씬이 바깥의 world보다
   뒤에 오므로 아래 루프에서 자연히 이깁니다. */
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

    let ticking = false;
    const read = () => {
      ticking = false;
      // `world` is a marker, not a stage — 씬 경계 밖(첫 씬 직전)에서만 나옵니다.
      const plain = readPlain();
      const next = plain === 'world' ? 'genesis' : plain;
      if (next) setStage((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read); }
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return stage;
}
