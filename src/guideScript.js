// What Ai-ng says, stage by stage. She points at what is actually on screen —
// every number she quotes is from the commit analysis, not invented.

export const STAGES = [
  'cover', 'genesis', 'immunity', 'gatehouse', 'observatory', 'vault',
  'footprint', 'principles', 'colophon',
];

export const SCRIPT = {
  cover: {
    pose: 'hello',
    text: '안녕! 나는 아잉이야. 아래로 내려가면 iron이 9개월 동안 지은 세계가 나와. 같이 날아가 볼래?',
  },
  genesis: {
    pose: 'wow',
    text: '가운데 씨앗에서 리본이 열네 갈래로 뻗었지? 저게 언어 14개야. 이 웹, 커밋의 98%를 iron 혼자 찍었대!',
  },
  immunity: {
    pose: 'check',
    text: '여긴 밀폐된 방이야. 캡슐이 트랙을 계속 도는 거 보여? 결제 전 구간을 CI가 열 번씩 돌려. 그래서 플레이크가 0이야.',
  },
  gatehouse: {
    pose: 'key',
    text: '문이 다섯 개인데 구멍 모양이 다 달라. 맞는 애만 통과하고 나머진 옆 트레이로 빠져. 권한 체크를 여기 한 곳에 모아둔 거야.',
  },
  observatory: {
    pose: 'inspect',
    text: '위에 뇌가 셋 떠 있는데 왼쪽 하나가 꺼졌어. 그래도 빛줄기가 돌아서 이어지지? LLM 하나가 죽어도 안 멈추는 이유야.',
  },
  vault: {
    pose: 'coin',
    text: '금고에서 나온 동전이 밸브를 하나씩 지나가. 뒤에서 딸깍 닫히니까 한 개도 안 새. 돈이 걸린 건 이렇게 만드는 거래.',
  },
  footprint: {
    pose: 'guide',
    text: '저장소 세 곳에서 역할이 다 달랐어. 막대 길이는 내가 늘린 게 아니라 진짜 커밋 점유율이야.',
  },
  principles: {
    pose: 'glass',
    text: 'iron이 일하는 방식 세 가지야. 난 첫 번째가 제일 좋아 — 규칙은 사람 기억이 아니라 도구가 지키는 거래.',
  },
  colophon: {
    pose: 'bow',
    text: '여기까지 같이 와줘서 고마워! 연락은 아래 메일로 하면 돼.',
  },
};

// The world's five scenes, in the order the camera flies them.
export const WORLD_STAGES = ['genesis', 'immunity', 'gatehouse', 'observatory', 'vault'];
