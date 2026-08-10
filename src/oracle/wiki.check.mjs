// node src/oracle/wiki.check.mjs — 검색이 엉뚱한 조각을 1순위로 올리면 실패합니다.
import assert from 'node:assert/strict';
import { retrieve, lookup } from './wiki.js';

const CASES = [
  ['iron은 누구야?', 'who'], ['프론트엔드 경험 알려줘', 'front'],
  ['권한 시스템 어떻게 만들었어?', 'admin'], ['쿠폰은 왜 새로 설계했어', 'coupon'],
  ['테스트 플레이크', 'test'], ['연락처가 뭐야', 'contact'],
  ['백엔드에서 뭐 했어?', 'back'], ['어떤 기술 스택 쓰세요', 'stack'],
  ['일하는 방식이 궁금해', 'principles'], ['이 사이트 어떻게 만들었어', 'site'],
  ['상욱씨 강점이 뭔가요', 'who'],
  // 커밋 수는 소개 조각과 프론트 조각 양쪽에 있다 — 어느 쪽이 1등이어도 답은 맞다
  ['아이언 커밋 몇 개', ['who', 'front']],
  // 이름은 어느 질문에나 붙는다 — 주제어가 있으면 주제 조각이 이겨야 한다
  ['iron이 백엔드에서 한 일 중 가장 중요한 게 뭐야?', 'back'],
  ['박상욱 어드민에서 뭐 했어', 'admin'],
  ['iron의 결제 테스트 이야기', 'test'],
];

for (const [q, want] of CASES) {
  const got = retrieve(q).map((w) => w.id);
  const ok = Array.isArray(want) ? want.includes(got[0]) : got[0] === want;
  assert.ok(ok, `"${q}" → ${got.join(',')} (기대: ${want})`);
}
assert.equal(retrieve('짜장면 맛집').length, 0, '관련 없는 질문은 비어야 합니다');
assert.match(lookup('짜장면 맛집'), /위키에 없네요/);
assert.match(lookup('iron 누구'), /박상욱/);
console.log(`wiki: ${CASES.length + 3} checks pass`);
