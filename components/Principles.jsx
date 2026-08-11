import { PRINCIPLES } from '@/lib/content';

export default function Principles() {
  return (
    <section className="creed" id="principles" data-stage="principles">
      <p className="eyebrow eyebrow--center">Principles</p>
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
