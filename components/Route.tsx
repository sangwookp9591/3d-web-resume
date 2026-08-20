'use client';

import { sections } from '@/lib/worldConfig';
import useStage from './useStage';

/* 씬 사이 이동. 앵커라서 JS 없이도, 키보드로도 갑니다 — 이 컴포넌트가 클라이언트인 것은
   "지금 여기"를 칠하기 위해서지 이동을 위해서가 아닙니다. 마크업은 서버에서도 그대로 나옵니다.

   "지금 여기"는 useStage가 정합니다. 픽셀 엔진도 카메라 때문에 씬 인덱스를 세고 있어서
   거기 물리는 편이 싸 보이지만, 두 가지가 어긋납니다.
   하나, 기준이 다릅니다 — 엔진은 다음 씬의 top이 화면 맨 위에 닿으면 넘어가고 useStage는
   화면 한복판을 덮은 [data-stage]를 고릅니다. 씬 하나가 125~170vh이므로 그 차이는 매 씬의
   30~40%이고, 그동안 레일과 아잉(Guide도 useStage를 씁니다)이 서로 다른 장소를 가리킵니다.
   둘, 엔진은 모션을 줄여 달라고 한 방문자에게 아예 돌지 않습니다(pixel-journey.ts). 그 사람들은
   레일은 그대로 보면서 표시만 잃습니다. 이건 장식이 아니라 정보라서 그러면 안 됩니다. */
export default function Route() {
  const stage = useStage();

  return (
    <nav className="px-route" aria-label="여정의 다섯 장소">
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            {/* 표시를 색으로만 하면 스크린리더에게는 다섯 개가 전부 똑같이 읽힙니다.
                aria-current가 붙은 자리를 CSS도 같이 씁니다 — 보이는 표시와 읽히는 표시가
                한 속성에서 나오면 둘이 갈라질 자리가 없습니다. */}
            <a href={`#${s.id}`} aria-current={s.id === stage ? 'location' : undefined}>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
