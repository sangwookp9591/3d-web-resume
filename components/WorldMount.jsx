'use client';

import { useEffect, useRef } from 'react';
import mountScrollWorld from '@/lib/scrub-engine';
import { sections, connectors } from '@/lib/worldConfig';

/* 바닐라 엔진이 이 노드 아래를 소유합니다. React는 노드와 서버가 그려 둔 카피만 넘기고
   빠집니다 — 이 컴포넌트에는 상태가 없어서 다시 렌더될 일이 없고, 그래서 엔진이 DOM을
   주무르는 동안 React와 부딪히지 않습니다. */
export default function WorldMount({ children }) {
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

    // 엔진의 크롬과 하늘은 position:fixed라서 커버와 마무리 섹션 위에 올라앉습니다.
    // 세계가 화면에 있는 동안에만 보입니다.
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute('data-inview', e.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id="world" className="sw-root" data-stage="world" ref={host}>
      {children}
    </div>
  );
}
