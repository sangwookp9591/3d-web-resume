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
    text: '여기는 iron이 맡았던 문제를 따라가는 복도야. 화면에서 시작해 서버까지, 어디서 흐름이 끊겼고 어떻게 다시 이었는지 차례로 보여줄게.',
  },
  genesis: {
    motion: 'jump', pose: 'jump',
    text: '첫 번째는 앱 없이 시작하는 웹이야. 검색으로 들어온 해외 환자가 14개 언어로 QR 주문과 결제까지 끝낼 수 있게 혼자 만들었어.',
  },
  immunity: {
    motion: 'idle', pose: 'thumbsup',
    text: '결제 중에 뒤로 가거나 외부 창에서 돌아와도 장바구니가 사라지지 않아. 성공 화면뿐 아니라 실패한 다음 돌아올 자리까지 만든 거야.',
  },
  gatehouse: {
    motion: 'think', pose: 'point_side',
    text: '15명이 각자 권한과 오류를 처리하면 기준도 15개가 돼. 모두가 같은 길을 지나도록 공통 계층 하나로 모았어.',
  },
  observatory: {
    motion: 'think', pose: 'think',
    text: '외부 AI 하나가 멈춰도 전체 작업은 계속 가야 해. 문제가 난 연동만 차단하고 다른 모델로 이어지게 만들었어.',
  },
  vault: {
    motion: 'idle', pose: 'carry',
    text: '쿠폰은 재시도할 때 두 번 나가지 않아야 하고, 실패했다고 사라져서도 안 돼. 두 경우를 101개 테스트로 확인했어.',
  },
  footprint: {
    motion: 'idle', pose: 'point_down',
    text: '화면 하나만 고쳐서는 끝나지 않는 문제가 많았어. 아래 막대는 웹, 어드민, 백엔드에서 실제로 남긴 커밋 점유율이야.',
  },
  media: {
    motion: 'idle', pose: 'coding',
    text: '이전에도 숏폼 맛집 앱과 실시간 AI 통역에서 복잡한 영상·음성 파이프라인 문제를 풀어왔대.',
  },
  sharing: {
    motion: 'type', pose: 'present',
    text: '새 도구는 먼저 직접 써 보고, 막힌 부분까지 적어서 공유했어. 링크가 아니라 오늘 바로 실행할 수 있는 형태로 말이야.',
  },
  principles: {
    motion: 'idle', pose: 'read',
    text: '세 기준은 모두 같은 방향을 봐. 사람이 기억해서 막는 대신, 같은 문제가 다시 생길 자리를 코드와 도구로 없애는 거야.',
  },
  kit: {
    motion: 'celebrate', pose: 'celebrate',
    text: '나도 이 페이지에서만 쓰고 끝나지 않아. 표정, 동작, 3D 모델과 사용 정보까지 묶여 있어서 다른 프로젝트로 데려갈 수 있어.',
  },
  colophon: {
    motion: 'wave', pose: 'bow',
    text: '복도는 여기까지야. 더 확인하고 싶은 문제나 같이 풀고 싶은 일이 있다면 메일이나 GitHub로 이야기해 줘.',
  },
};
