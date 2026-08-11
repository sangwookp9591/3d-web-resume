import kit from '@/public/mascot/aing-kit.json';
import Live3D from './Live3D';

/* 마스코트는 페이지 장식이 아니라 실제 에셋이라, 페이지가 킷 전체를 펼쳐 놓고 넘겨 줍니다.

   Vite판은 매니페스트를 브라우저에서 fetch해 그렸습니다 — 표정 16종·액션 16종·모션 6종이
   전부 하이드레이션 뒤에야 DOM에 생겼다는 뜻이고, 크롤러에게는 빈 섹션이었습니다.
   매니페스트는 저장소에 있는 정적 파일이므로 빌드 타임에 그냥 import합니다. 폭포도, fetch도,
   빈 상태도 없어집니다. */

function Row({ title, note, items, big }: {
  title: string;
  note: string;
  items: { name: string; file: string }[];
  big?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <div className="kit__row">
      <div className="kit__rowhead">
        <h3 className="kit__rowtitle">{title}</h3>
        <p className="kit__rownote">{note}</p>
      </div>
      <ul className={`kit__grid${big ? ' kit__grid--big' : ''}`}>
        {items.map((it) => (
          <li className="kit__cell" key={it.name}>
            {/* 이미 1:1로 최적화된 동일 출처 WebP이고 CSS의 aspect-ratio:1이 CLS를 잡습니다.
                next/image를 끼우면 얻는 것 없이 변환 한 단계만 늘어납니다. */}
            <img src={`/mascot/${it.file}`} alt={it.name} loading="lazy" decoding="async" />
            <span className="kit__name">{it.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const setItems = (name: keyof typeof kit.sets) =>
  (kit.sets?.[name]?.frames || []).map((n) => ({ name: n, file: `${name}/${n}.webp` }));

export default function CharacterKit() {
  const motions = (kit.motion || []).map((m) => ({ name: m.name, file: m.webp }));
  const expr = setItems('expr');
  const pose = setItems('pose');
  // 페이지 안의 뷰어는 미리보기라 lite(205kB)면 충분합니다. 1.22MB 풀 모델은
  // 킷 다운로드로 가져가는 물건이지, 이력서를 스크롤하다가 받을 물건이 아닙니다.
  const glb = kit.model3d?.['aing-lite'] ?? kit.model3d?.aing
    ?? (kit.model3d ? Object.values(kit.model3d)[0] : null);

  return (
    <section className="kit" id="aing" data-stage="kit">
      <div className="kit__head">
        <p className="eyebrow">Ai-ng · 캐릭터 킷</p>
        <h2 className="kit__title">여기까지 안내한 고양이는, 쓸 수 있는 에셋입니다</h2>
        <p className="kit__lead">
          표정과 액션을 시트로 뽑고, 모션은 알파 애니메이션으로, 형태는 3D 모델로 만들었습니다.
          웹은 물론 three.js·WebGPU·Unity에서 바로 쓸 수 있게 아틀라스와 매니페스트를 함께 냅니다.
        </p>
      </div>

      {glb && <Live3D src={`/mascot/${glb}`} />}

      <Row title="모션" note="알파 애니메이션 WebP · PNG 시퀀스 동봉" items={motions} big />
      <Row title="표정" note={`${expr.length}종 · 알파 컷아웃`} items={expr} />
      <Row title="액션" note={`${pose.length}종 · 알파 컷아웃`} items={pose} />

      {kit.download && (
        <a className="kit__dl" href={`/mascot/${kit.download}`} download>
          킷 내려받기 · 표정·액션·모션·아틀라스·GLB
        </a>
      )}

      <ul className="kit__use">
        {Object.entries(kit.usage || {}).map(([k, v]) => (
          <li className="kit__usecell" key={k}>
            <code>{k}</code>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
