'use client';

import { useEffect, useRef } from 'react';
import { sections, connectors } from '@/lib/worldConfig';

/* 바닐라 엔진이 이 노드 아래를 소유합니다. React는 노드와 서버가 그려 둔 카피만 넘기고
   빠집니다 — 이 컴포넌트에는 상태가 없어서 다시 렌더될 일이 없고, 그래서 엔진이 DOM을
   주무르는 동안 React와 부딪히지 않습니다. */
export default function WorldMount({ children }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // 엔진(+엔진이 주입하는 CSS 문자열)은 커버 아래에 있는 세계에만 쓰입니다. 정적으로
    // 물면 첫 화면 번들에 그대로 실리므로 마운트 시점에 받습니다. 재진입 가드는 엔진 안에.
    /* catch는 import에만 겁니다. 체인 전체에 걸면 mountScrollWorld 안에서 난 예외까지
       "엔진을 못 받았다"로 처리되는데, 그때는 이미 재진입 가드(swMounted)가 서고 하늘·
       상단바·라우트가 fixed로 붙은 뒤라, 반쯤 지어진 세계 위에 카피가 문서 흐름으로
       쏟아집니다. 게다가 swMounted가 안 풀려 재시도도 막힙니다. */
    import('@/lib/scrub-engine')
      .catch((err) => {
        // 엔진이 안 오면 그 CSS도 안 옵니다. 그러면 카피 레이어는 globals.css의
        // fixed/opacity:0에 굳은 채 남아, 이력서에서 제일 할 말이 많은 다섯 장이 화면에서
        // 통째로 사라집니다. 조용히 비우느니 문서 흐름에 얹습니다 — 영상은 없어도 글은 읽힙니다.
        console.error('[world] 스크럽 엔진을 불러오지 못했습니다:', err);
        el.dataset.swFailed = '1';
        return null;
      })
      .then((mod) => {
        if (!mod || !host.current) return;
        try {
          mod.default(el, {
            brand: { name: 'iron · 之印', href: '#top' },
            hint: '스크롤로 날아갑니다',
            nav: true,
            atmosphere: true,
            diveScroll: 1.4,
            connScroll: 0.95,
            sections,
            connectors,
          });
        } catch (err) {
          // 마운트 도중 죽은 경우. 하늘·상단바는 이미 붙었으므로 카피를 문서 흐름으로
          // 쏟지 않습니다(반쯤 지어진 세계 위에 글이 겹칩니다). 재진입 가드만 풀어
          // 다시 마운트할 길은 남겨 둡니다.
          console.error('[world] 엔진 마운트가 실패했습니다:', err);
          delete el.dataset.swMounted;
        }
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
