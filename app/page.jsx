import Cover from '@/components/Cover';
import World from '@/components/World';
import Footprint from '@/components/Footprint';
import Principles from '@/components/Principles';
import CharacterKit from '@/components/CharacterKit';
import Colophon from '@/components/Colophon';
import Guide from '@/components/Guide';
import { buildJsonLd } from '@/lib/jsonld';

/* 이 페이지에서 클라이언트로 넘어가는 것은 다섯 조각뿐입니다:
   CoverParallax(포인터) · WorldMount(스크럽 엔진) · Oracle(WebGPU+워커) ·
   Live3D(GLB) · Guide(스크롤 위치). 나머지 글자는 전부 서버에서 나옵니다. */
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD는 스크립트 태그 안의 텍스트여야 하므로 이 경로만 dangerously가 필요합니다.
        // 값은 전부 저장소 안의 상수라 주입 걱정은 없지만, 파서는 출처를 안 봅니다 —
        // 본문에 "<" 하나만 들어가도(예: "p95 <200ms") HTML 파서가 스크립트를 일찍 닫아
        // 구조화 데이터와 그 뒤 마크업이 같이 깨집니다. 그래서 "<"를 이스케이프합니다.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c'),
        }}
      />
      <div className="sky" aria-hidden="true" />
      <Cover />
      <main>
        <World />
        <Footprint />
        <Principles />
        <CharacterKit />
      </main>
      <Colophon />
      <Guide />
    </>
  );
}
