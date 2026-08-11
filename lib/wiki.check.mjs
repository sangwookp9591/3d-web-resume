// node src/oracle/wiki.check.mjs — 검색이 엉뚱한 조각을 1순위로 올리면 실패합니다.
import assert from 'node:assert/strict';
import { WIKI, retrieve, lookup } from './wiki.js';

const CASES = [
  // 개요
  ['iron은 누구야?', 'who'],
  ['어떤 개발자인가요', 'who'],
  ['상욱씨 강점', 'who'],
  ['커밋 몇 개나 했어', 'repos'],
  ['저장소별 기여도', 'repos'],
  // 프론트
  ['프론트엔드 경험', 'front'],
  ['14개 언어', 'front'],
  ['vanilla-extract 왜 썼어', 'front'],
  ['결제는 어떻게 처리했어', 'payment'],
  ['결제 실패하면 어떻게 돼', 'payment'],
  ['E2E 테스트 플레이크', 'test'],
  ['플레이크를 어떻게 0으로 만들었나요', 'test'],
  // 어드민
  ['권한 시스템 어떻게 설계했나요', 'perm'],
  ['공통 인프라랑 팀 규약', 'infra'],
  ['FSD 전환', 'infra'],
  // 백엔드
  ['iron이 백엔드에서 한 일', 'back'],
  ['검색 성능 개선', 'search'],
  ['OpenSearch', 'search'],
  ['LLM 장애 대응', 'ai'],
  ['서킷브레이커 몇 군데', 'ai'],
  ['Outbox 패턴', 'coupon'],
  ['ArchUnit 어디에 썼어', 'coupon'],
  // 그 외
  ['일하는 방식', 'principles'],
  ['기술 스택', 'stack'],
  ['이 사이트 어떻게 만들었어', 'site'],
  ['연락처', 'contact'],
  ['RAG 해봤어?', 'caution'],
  ['쿠폰 왜 새로 만들었어', 'coupon'],
  // 서술어("설계했어")가 주제어("쿠폰")를 이기면 안 된다
  ['쿠폰은 왜 새로 설계했어?', 'coupon'],
  ['권한은 어떻게 설계했어', 'perm'],
  ['결제 실패 설계', 'payment'],
  // 개요는 세부가 있으면 양보하되, 개요 자체를 물으면 개요가 나와야 한다
  ['백엔드에서 뭐 했어', 'back'],
  ['백엔드 경험 알려줘', 'back'],
  // 기술명을 한글로 물어도 걸려야 한다
  ['스프링부트 써봤어', 'back'],
  ['리액트 쓸 줄 알아', 'stack'],
];

for (const [q, want] of CASES) {
  const got = retrieve(q).map((w) => w.id);
  const ok = Array.isArray(want) ? want.includes(got[0]) : got[0] === want;
  assert.ok(ok, `"${q}" → ${got.join(',')} (기대: ${want})`);
}

// 세부 조각이 상위 3개 안에는 반드시 들어와야 합니다 — LLM이 받는 근거가 그 3개입니다.
for (const [q, want] of [['쿠폰 정합성', 'coupon'], ['재색인 느려', 'search'], ['권한 누락', 'perm']]) {
  assert.ok(retrieve(q, 3).some((w) => w.id === want), `"${q}"의 근거에 ${want}가 없습니다`);
}

assert.equal(retrieve('짜장면 맛집').length, 0, '관련 없는 질문은 비어야 합니다');
assert.match(lookup('짜장면 맛집'), /위키에 없네요/);
assert.match(lookup('iron 누구'), /박상욱/);

// 지어내면 안 되는 것들이 위키에 명시돼 있어야 합니다.
const caution = WIKI.find((w) => w.id === 'caution').text;
for (const must of ['RAG', 'pgvector', 'nicepay']) {
  assert.ok(caution.includes(must), `사실 정확성 조각에 ${must} 언급이 없습니다`);
}

console.log(`wiki: ${WIKI.length} chunks, ${CASES.length + 9} checks pass`);
