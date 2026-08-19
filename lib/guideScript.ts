// What Ai-ng does and says, stage by stage. She points at what is actually on screen —
// every number she quotes is from the commit analysis, not invented.
//
// `motion` is an animated alpha WebP from the character kit (public/mascot/motion/);
// `pose` is the still from the same kit, used as the poster while the loop decodes and
// as the whole story when the visitor prefers reduced motion.

export const STAGES = [
  'cover', 'genesis', 'immunity', 'gatehouse', 'observatory', 'vault',
  'footprint', 'media', 'sharing', 'principles', 'kit', 'colophon',
];

// 키는 useStage가 DOM의 [data-stage]에서 읽어 오는 값이라 타입이 좁혀지지 않습니다.
// 없는 무대는 Guide가 cover로 되돌립니다.
export const SCRIPT: Record<string, { motion: string; pose: string; text: string }> = {
  cover: {
    motion: 'wave', pose: 'wave',
    text: '안녕! 나는 아잉이야. 여긴 iron이 9개월 동안 걸어온 길이고, 지나갈 곳이 다섯 군데야. 같이 걸을래?',
  },
  genesis: {
    motion: 'jump', pose: 'jump',
    text: '오두막까지 길에 등불이 늘어서 있지? 하나가 언어 하나야, 열넷. 이 웹은 커밋의 98%를 iron 혼자 찍었대!',
  },
  immunity: {
    motion: 'idle', pose: 'thumbsup',
    text: '물살은 저렇게 센데 다리는 안 흔들려. 옆에 똑같은 돌이 열 개 쌓여 있지? 같은 검사를 열 번씩 돌린 거야. 열 번 다 똑같이 통과했대!',
  },
  gatehouse: {
    motion: 'think', pose: 'point_side',
    text: '이 문은 열쇠구멍이 하나뿐이야. 담장에 열쇠는 잔뜩 걸려 있는데 통과하는 건 맞는 하나. 권한 체크를 여기 한 곳에 모아둔 거야.',
  },
  observatory: {
    motion: 'think', pose: 'think',
    text: '언덕 아래로 물길이 세 갈래로 갈라지지? 하나가 막혀도 나머지로 흘러. AI 업체 한 곳이 멈춰도 서비스가 안 끊기는 이유야. 망원경은 느려지는 곳을 먼저 보라고 있는 거고.',
  },
  vault: {
    motion: 'idle', pose: 'carry',
    text: '창고 자물쇠가 두 개야. 나가는 상자는 저 우편함에서 하나씩 확인하고 보내. 그래서 한 개도 안 새. 돈이 걸린 건 이렇게 만드는 거래.',
  },
  footprint: {
    motion: 'idle', pose: 'point_down',
    text: '저장소 세 곳에서 역할이 다 달랐어. 막대 길이는 내가 늘린 게 아니라 진짜 커밋 점유율이야.',
  },
  media: {
    motion: 'idle', pose: 'coding',
    text: '여긴 ZIVO 오기 전 이야기야. 영상 올리고 자르고 내보내는 걸 4년째 하고 있대. 저 앱 화면은 진짜로 만든 거고!',
  },
  sharing: {
    motion: 'type', pose: 'present',
    text: 'iron은 좋은 걸 찾으면 꼭 팀에 가져와. 링크만 던지는 게 아니라 자기가 먼저 써 보고 올려. 나도 저기서 많이 배웠어!',
  },
  principles: {
    motion: 'idle', pose: 'read',
    text: 'iron이 일하는 방식 세 가지야. 난 첫 번째가 제일 좋아. 규칙은 문서에 적어 두는 것보다 도구에 넣는 게 낫대.',
  },
  kit: {
    motion: 'celebrate', pose: 'celebrate',
    text: '어? 내 얘기다! 표정이랑 동작을 잔뜩 만들어놨어. three.js든 Unity든 가져다 써도 돼.',
  },
  colophon: {
    motion: 'wave', pose: 'bow',
    text: '여기까지 같이 걸어와 줘서 고마워! 저기 GitHub이랑 유튜브에 iron이 요즘 만드는 게 바로바로 올라와. 연락은 아래 메일로 하면 돼!',
  },
};
