// CSS 커스텀 프로퍼티는 React.CSSProperties에 없습니다. 이 사이트는 값을 JS에서 정하고
// 연출은 CSS가 하는 구조라(--px-scroll, --px-accent, --share) style에 변수를 실어 보냅니다.
// 쓰는 자리마다 캐스팅하는 대신 여기 한 곳에서 넓힙니다.
export {};   // 이 파일을 모듈로 만들어야 아래가 react 타입을 "덮지" 않고 "넓힙니다"

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
