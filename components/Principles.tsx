import { PRINCIPLES } from '@/lib/content';

export default function Principles() {
  return (
    <section className="creed" id="principles" data-stage="principles">
      {/* 이 섹션에는 원래 제목이 없고 영문 라벨 "Principles"만 있었습니다. 라벨을 걷어내면
          제목이 필요합니다 — h2 없이 h3 셋만 있는 섹션은 개요에서 갈 곳이 없어집니다. */}
      <h2 className="creed__title">하다 보니 이렇게 일하고 있습니다</h2>
      <ol className="creed__list">
        {PRINCIPLES.map(([head, sub], i) => (
          <li className="creed__item" key={head}>
            <span className="creed__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="creed__head">{head}</h3>
            <p className="creed__sub">{sub}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
