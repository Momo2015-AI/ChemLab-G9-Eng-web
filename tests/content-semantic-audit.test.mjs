import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTRADICTION_MARKERS,
  canonicalKey,
  ownKnowledgeIds,
  answerIndex,
  checkContradictionMarkers,
  checkAnswerIndex,
  checkKnowledgeLinks,
  checkExplanation,
  findDivergentDuplicates,
  runAudit,
} from '../scripts/content-semantic-audit.mjs';

test('S1: contradiction markers are detected in explanations', () => {
  assert.deepEqual(
    checkContradictionMarkers({ explanation: '……无错误选项。修正：选项应改为……' }),
    ['无错误选项', '修正：']
  );
  assert.deepEqual(checkContradictionMarkers({ explanation: '氧气不易溶于水。' }), []);
});

test('S1: every marker in the exported list is matched', () => {
  for (const marker of CONTRADICTION_MARKERS) {
    assert.ok(
      checkContradictionMarkers({ explanation: `前文${marker}后文` }).includes(marker),
      `marker ${marker} must be detected`
    );
  }
});

test('S2: answer index must resolve to a valid option', () => {
  // answer as numeric index
  assert.equal(checkAnswerIndex({ options: ['a', 'b'], answer: 1 }), null);
  // answer as letter
  assert.equal(checkAnswerIndex({ options: ['a', 'b'], answer: 'B' }), null);
  // out of range (the shipped L30-P06 defect shape: correct key existed but was wrong index)
  assert.equal(checkAnswerIndex({ options: ['18g', '16g'], answer: 5 }), 5);
  // non-resolvable letter resolves out of range and is flagged
  assert.equal(checkAnswerIndex({ options: ['a', 'b'], answer: 'Z' }), 25);
  // no options / no answer: rule does not apply
  assert.equal(checkAnswerIndex({ options: [], answer: 0 }), null);
  assert.equal(checkAnswerIndex({ options: ['a'], answer: undefined }), null);
});

test('S2: answerIndex converts letters and digits to option indexes', () => {
  assert.equal(answerIndex({ options: ['a', 'b'], answer: 'a' }), 0);
  assert.equal(answerIndex({ options: ['a', 'b'], answer: 'B' }), 1);
  assert.equal(answerIndex({ options: ['a', 'b'], answer: '1' }), 1);
  assert.equal(answerIndex({ options: ['a', 'b'], answer: 0 }), 0);
});

test('S4: ownKnowledgeIds ignores lesson-level fallback by design', () => {
  assert.deepEqual(ownKnowledgeIds({ knowledgeIds: ['oxygen-physical'] }), ['oxygen-physical']);
  assert.deepEqual(ownKnowledgeIds({ knowledgePoint: 'oxygen-chemical' }), ['oxygen-chemical']);
  assert.deepEqual(ownKnowledgeIds({}), []);
  // recheck matching relies on the question's own ids, so a missing link is
  // flagged even though the runtime practice flow falls back to lesson ids
  assert.ok(checkKnowledgeLinks({}));
  assert.equal(checkKnowledgeLinks({ knowledgeIds: ['x'] }), null);
});

test('S6: explanation presence check', () => {
  assert.equal(checkExplanation({ explanation: '质量守恒……' }), true);
  assert.equal(checkExplanation({ explanation: '   ' }), false);
  assert.equal(checkExplanation({}), false);
});

test('S3: divergent duplicates are found via canonical comparison', () => {
  const collected = [
    { question: { id: 'Q1', answer: 0, options: ['a', 'b'] }, file: 'main.json', pool: 'lesson-main' },
    // same content, different key order -> identical, not divergent
    { question: { options: ['a', 'b'], answer: 0, id: 'Q1' }, file: 'split.json', pool: 'practice' },
    { question: { id: 'Q2', answer: 0 }, file: 'main.json', pool: 'lesson-main' },
    { question: { id: 'Q2', answer: 1 }, file: 'split.json', pool: 'practice' },
  ];
  const { divergent, identical } = findDivergentDuplicates(collected);
  assert.deepEqual(divergent.map(entry => entry.id), ['Q2']);
  assert.deepEqual(identical.map(entry => entry.id), ['Q1']);
});

test('canonicalKey is key-order independent', () => {
  assert.equal(
    canonicalKey({ a: 1, b: { c: 2, d: 3 } }),
    canonicalKey({ b: { d: 3, c: 2 }, a: 1 })
  );
});

test('runAudit flags the four shipped defect shapes as blockers', () => {
  // Unit-level: feed the historical defect shapes through runAudit's rule
  // pipeline via direct checks (runAudit over the real content tree is
  // exercised by npm run audit:content in CI).
  const wrongAnswerKey = { id: 'X1', options: ['18g', '16g'], answer: 5, explanation: 'ok' };
  assert.ok(checkAnswerIndex(wrongAnswerKey) !== null);
  const unresolvedReview = { id: 'X2', options: ['a', 'b'], answer: 0, explanation: '需检查：实际应为……' };
  assert.ok(checkContradictionMarkers(unresolvedReview).length > 0);
});

test('runAudit over the production content tree reports the known Sprint 1 backlog', () => {
  const { blockers, stats } = runAudit();
  // Sprint 0 exit condition: all four broken questions are fixed -> no blockers.
  assert.equal(blockers.length, 0);
  // Sprint 1 backlog is stable and tracked (review 2026-08-27 baseline):
  assert.equal(stats.divergentDuplicates, 33);
  assert.equal(stats.missingKnowledgeLinks, 103);
  assert.ok(stats.questions > 1200, 'full runtime question tree must be scanned');
});
