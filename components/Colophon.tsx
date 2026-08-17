import { PERSON } from '@/lib/site';

export default function Colophon() {
  return (
    <footer className="colophon" data-stage="colophon">
      <a className="colophon__mail" href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
      <p className="colophon__links">
        <a href={PERSON.github} target="_blank" rel="me noreferrer">GitHub</a>
        <a href={PERSON.youtube} target="_blank" rel="me noreferrer">YouTube — Ai-ng</a>
      </p>
      <p className="colophon__meta">
        {PERSON.name} (iron) · {PERSON.employer} · 2025.10 – 2026.07
      </p>
    </footer>
  );
}
