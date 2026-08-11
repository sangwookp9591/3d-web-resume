export const PRINCIPLES = [
  ['좋은 구조는 문서가 아니라 도구가 지킨다.',
   'ArchUnit으로 의존 방향을, codemod로 디자인 토큰을, 단일 훅으로 권한을 강제했습니다. 리뷰어의 기억력에 기대는 규칙은 규칙이 아닙니다.'],
  ['실패 비용이 큰 곳일수록, 실패 경로를 먼저 설계한다.',
   '결제의 취소·이탈 흐름, LLM의 fallback 체인, 쿠폰의 Outbox — 성공 케이스는 누구나 만듭니다. 차이는 무너지는 방식에서 납니다.'],
  ['버그는 고치는 것이 아니라, 재발이 불가능한 구조로 만드는 것.',
   '이중 토스트는 전역 onError 규약으로, E2E 플레이크는 하이드레이션 유틸과 burn-in으로 — 같은 문제를 두 번 만나지 않도록 계층에서 차단했습니다.'],
];

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
