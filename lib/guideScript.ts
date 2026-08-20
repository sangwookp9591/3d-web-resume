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
    text: '안녕! 나는 이 여정을 함께할 가이드 아잉이야. 개발자 iron이 복잡한 문제들을 어떻게 풀어왔는지 하나씩 보여줄게. 같이 걸어볼래?',
  },
  genesis: {
    motion: 'jump', pose: 'jump',
    text: '오두막까지 길에 등불이 늘어서 있지? 14개 언어를 나타내. 앱 설치 없이 검색과 QR로 바로 결제되게 웹을 혼자 다 구축했대!',
  },
  immunity: {
    motion: 'idle', pose: 'thumbsup',
    text: '결제하다 뒤로가기를 눌러도 장바구니가 안 날아가게 만들었어. 실패해도 당황하지 않고 원래대로 돌아오게 설계한 거래.',
  },
  gatehouse: {
    motion: 'think', pose: 'point_side',
    text: '팀원이 15명으로 늘어도 코드가 안 꼬이게, 권한 체크랑 공통 규칙을 한곳으로 깔끔하게 모았어.',
  },
  observatory: {
    motion: 'think', pose: 'think',
    text: '외부 AI나 번역 서비스가 멈춰도 우리 서비스는 안 끊겨. 문제가 생긴 곳만 쏙 격리해두거든!',
  },
  vault: {
    motion: 'idle', pose: 'carry',
    text: '돈이 걸린 쿠폰은 두 번 나가거나 사라지면 큰일이잖아? 101번의 검증을 거쳐 1원도 안 새게 새로 지었대.',
  },
  footprint: {
    motion: 'idle', pose: 'point_down',
    text: '웹, 어드민, 백엔드까지 세 영역 모두에서 핵심 역할을 맡았어. 저 막대 길이는 실제 커밋 기여도야.',
  },
  media: {
    motion: 'idle', pose: 'coding',
    text: '이전에도 숏폼 맛집 앱과 실시간 AI 통역에서 복잡한 영상·음성 파이프라인 문제를 풀어왔대.',
  },
  sharing: {
    motion: 'type', pose: 'present',
    text: '좋은 도구나 팁을 찾으면 팀 채널에 먼저 써보고 공유했어. 동료들이 오늘 바로 쓸 수 있게 말이야.',
  },
  principles: {
    motion: 'idle', pose: 'read',
    text: 'iron이 개발할 때 가장 중요하게 생각하는 3가지 기준이야. 규칙은 사람이 외우는 게 아니라 도구가 지키게 해야 한대.',
  },
  kit: {
    motion: 'celebrate', pose: 'celebrate',
    text: '나를 페이지 장식으로만 두기 아까워서 표정, 동작, 3D 모델까지 다 만들어뒀대! 어디든 데려가서 써도 돼.',
  },
  colophon: {
    motion: 'wave', pose: 'bow',
    text: '여기까지 같이 걸어와 줘서 고마워! 더 궁금한 점이 있다면 아래 메일이나 GitHub로 편하게 연락해 줘!',
  },
};
