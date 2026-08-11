'use client';

import { useEffect, useRef } from 'react';

/* 바닐라 엔진이 이 노드 아래에 픽셀 무대를 짓습니다. React는 노드와 서버가 그려 둔 씬만
   넘기고 빠집니다 — 이 컴포넌트에는 상태가 없어서 다시 렌더될 일이 없고, 그래서 엔진이
   DOM을 주무르는 동안 React와 부딪히지 않습니다. */
export default function WorldMount({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // 엔진과 픽셀 에셋은 커버 아래에 있는 세계에만 쓰입니다. 정적으로 물면 첫 화면 번들에
    // 그대로 실리므로 마운트 시점에 받습니다. 재진입 가드는 엔진 안에.
    /* catch는 import에만 겁니다. 체인 전체에 걸면 마운트 중에 난 예외까지 "청크를 못 받았다"로
       처리되는데, 그때는 이미 반쯤 지어진 무대가 fixed로 붙은 뒤라 처방이 다릅니다. */
    import('@/lib/pixel-journey')
      .catch((err) => {
        /* 엔진이 안 와도 다섯 장의 글은 이미 문서 흐름에 있습니다 — 붙잡는 것이 JS가 아니라
           position:sticky니까요. 다만 그림 없는 스크롤 길이가 일곱 화면쯤 남으므로, 그걸
           접어서 글이 바로 이어지게 합니다. */
        console.error('[world] 픽셀 엔진을 불러오지 못했습니다:', err);
        el.dataset.pxFailed = '1';
        return null;
      })
      .then((mod) => {
        if (!mod || !host.current) return;
        try {
          mod.default(el);
        } catch (err) {
          // 마운트 도중 죽은 경우. 반쯤 지어진 무대를 남기면 씬마다 엉뚱한 그림이 붙박이므로
          // 걷어내고, 스크롤 길이도 접습니다. 글은 그대로 읽힙니다.
          console.error('[world] 픽셀 무대를 짓지 못했습니다:', err);
          el.querySelector('.px-stage')?.remove();
          el.dataset.pxFailed = '1';
        }
      });

    // 무대와 씬 이동 레일은 position:fixed라 커버와 마무리 섹션 위에 올라앉습니다.
    // 세계가 화면에 있는 동안에만 보입니다.
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute('data-inview', e.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div id="world" data-stage="world" ref={host}>
      {children}
    </div>
  );
}
