'use client';

import { useEffect, useRef } from 'react';

/* 커버에서 클라이언트로 넘어가는 유일한 조각. 포인터 위치를 --px/--py로만 옮기고,
   판의 글자는 전부 서버가 그린 children입니다. */
export default function CoverParallax({ children }: { children: React.ReactNode }) {
  const stage = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
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
      {children}
    </header>
  );
}
