import { existsSync } from 'node:fs';
import { MEDIA_LEAD, MEDIA_SHOTS, MEDIA_WORK, PIPELINE } from '@/lib/content';

/* 영상·오디오 이력. 여정(ZIVO 아홉 달)과 축이 달라 그 밖에 따로 세워 둔 섹션입니다.
   목록 모양은 Sharing과 같은 CSS를 물려받고, 여기서만 파이프라인과 앱 화면이 붙습니다.
   글은 전부 서버가 그리고 JS는 한 줄도 없습니다. */

/* 화면 두 장은 저장소에 아직 없을 수 있습니다(포트폴리오 PDF에서 뽑아 넣는 자산입니다).
   없는 걸 그대로 <img>로 내보내면 404 깨진 아이콘이 남으므로, 빌드 시점에 있는 것만 겁니다.
   public/assets/yeogigage/에 파일을 넣으면 다음 빌드에서 그대로 살아납니다. */
const SHOTS = MEDIA_SHOTS.filter((s) => existsSync(`public${s.src}`));

export default function Media() {
  return (
    <section className="slab media" id="media" data-stage="media">
      <div className="slab__head">
        <h2 className="slab__title">ZIVO 전의 일도, 같은 문제를 다뤘습니다</h2>
        <p className="media__lead">{MEDIA_LEAD}</p>
      </div>

      <div className="media__stage">
        {SHOTS.length > 0 && (
          <div className="media__frames">
            {SHOTS.map((s) => (
              /* 두 장의 높이를 맞추는 건 flex-grow입니다. 높이가 같으려면 폭이 가로세로비에
                 비례해야 하므로 비율 자체를 grow로 줍니다(CSS가 flex-basis:0을 깔아 둡니다). */
              <figure className="media__frame" key={s.src} style={{ flexGrow: s.w / s.h }}>
                <img
                  className="media__shot"
                  src={s.src} alt={s.alt}
                  width={s.w} height={s.h}
                  loading="lazy" decoding="async"
                />
                <figcaption className="media__cap">{s.cap}</figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* 순서가 뜻을 가지므로 ol입니다 — 촬영에서 재생까지 한 방향으로만 흐릅니다. */}
        <ol className="media__flow">
          {PIPELINE.map((step) => (
            <li className="media__step" key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <ol className="media__log">
        {MEDIA_WORK.map((w) => (
          <li className="media__row" key={w.title}>
            <div className="media__meta">
              <span className="media__when">{w.when}</span>
              <span className="media__where">{w.where}</span>
            </div>
            <div>
              <h3 className="media__title">{w.title}</h3>
              <p className="media__note">{w.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
