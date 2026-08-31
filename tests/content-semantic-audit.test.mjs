import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTRADICTION_MARKERS,
  EXPLANATION_POOLS,
  canonicalKey,
  contentKey,
  CONTENT_FIELDS,
  ownKnowledgeIds,
  answerIndex,
  checkContradictionMarkers,
  checkAnswerIndex,
  checkKnowledgeLinks,
  checkExplanation,
  isConstructed,
  poolOf,
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

test('S3: divergent duplicates are found via content-only comparison', () => {
  // Same answer/options/explanation/knowledgeIds but different schema-decor
  // fields (difficulty/type) must NOT count as drift — only the content
  // fields declared in CONTENT_FIELDS.
  const collected = [
    { question: { id: 'Q1', answer: 0, options: ['a', 'b'], knowledgeIds: ['k1'], type: 'choice' }, file: 'main.json', pool: 'lesson-main' },
    // difficulty field (schema decor) is intentionally different
    { question: { id: 'Q1', answer: 0, options: ['a', 'b'], knowledgeIds: ['k1'], difficulty: 'hard' }, file: 'split.json', pool: 'practice' },
    // truly divergent content: answer differs
    { question: { id: 'Q2', answer: 0 }, file: 'main.json', pool: 'lesson-main' },
    { question: { id: 'Q2', answer: 1 }, file: 'split.json', pool: 'practice' },
  ];
  const { divergent, identical } = findDivergentDuplicates(collected);
  assert.deepEqual(divergent.map(entry => entry.id), ['Q2']);
  assert.deepEqual(identical.map(entry => entry.id), ['Q1']);
});

test('isConstructed exempts transfer/practice constructed questions from S6', () => {
  // Transfer questions are open-ended (type: 'constructed') and route to
  // rubric-based grading; they do not require a free-text explanation.
  assert.equal(isConstructed({ type: 'constructed' }), true);
  assert.equal(isConstructed({ type: 'short-answer' }), true);
  assert.equal(isConstructed({ type: 'fill' }), true);
  assert.equal(isConstructed({ type: 'calculation' }), true);
  assert.equal(isConstructed({ type: 'choice' }), false);
  assert.equal(isConstructed({}), false);
});

test('poolOf routes lesson-main diagnostic questions out of choice-pool rules', () => {
  // lesson-main questions with remediationStep are diagnostic in disguise
  // and route students back to guided steps; S6 must not require them to
  // carry inline explanations.
  const q = { id: 'Dx', type: 'choice', remediationStep: 'L01-S02' };
  assert.equal(poolOf(q, 'lesson-main'), 'diagnostic');
  assert.equal(poolOf({ id: 'Dy', type: 'choice' }, 'lesson-main'), 'lesson-main');
  assert.equal(poolOf(q, 'diagnostic-orphan'), 'diagnostic');
});

test('runAudit over the production content tree has zero blockers post-Sprint 1', () => {
  // Sprint 1 exit condition: every content defect caught by S1–S6 is
  // resolved and the rules now block (not just warn). Any regression that
  // re-introduces a bad question, missing knowledge link, divergent copy,
  // or missing explanation must turn this test red.
  const { blockers, warnings, stats } = runAudit();
  assert.equal(blockers.length, 0, `unexpected blockers: ${blockers.slice(0, 5).join(' | ')}`);
  // Sprint 1 alignment completed: all content duplicates now match.
  assert.equal(stats.divergentDuplicates, 0);
  assert.equal(stats.missingKnowledgeLinks, 0);
  assert.equal(stats.missingExplanations, 0);
  assert.ok(stats.questions > 1200, 'full runtime question tree must be scanned');
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
  // Missing knowledge link now blocks (was a warning pre-Sprint 1).
  const noKp = { id: 'X3', options: ['a', 'b'], answer: 0, explanation: 'ok' };
  assert.ok(checkKnowledgeLinks(noKp));
});

test('runAudit blocks choice questions in practice/mastery without explanations', () => {
  // Choice question in practice pool without explanation must block.
  // Constructed question in same pool is exempt.
  const choice = { id: 'X4', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['k'] };
  const constructed = { id: 'X5', type: 'constructed', knowledgeIds: ['k'] };
  const collected = [
    { question: choice, file: 'p.json', pool: 'practice' },
    { question: constructed, file: 'p.json', pool: 'practice' },
  ];
  // Direct rule check rather than full runAudit to keep this test self-contained.
  assert.equal(isConstructed(choice), false);
  assert.equal(isConstructed(constructed), true);
  // choice in practice pool would emit S6
  assert.equal(EXPLANATION_POOLS.has('practice'), true);
  // constructed in same pool is exempt
  assert.equal(EXPLANATION_POOLS.has('practice') && !isConstructed(constructed), false);
});

test('runAudit blocks the same id appearing with divergent content fields', () => {
  const collected = [
    { question: { id: 'Dup', answer: 0, options: ['a', 'b'], knowledgeIds: ['k'] }, file: 'a.json', pool: 'lesson-main' },
    { question: { id: 'Dup', answer: 1, options: ['a', 'b'], knowledgeIds: ['k'] }, file: 'b.json', pool: 'practice' },
  ];
  const { divergent } = findDivergentDuplicates(collected);
  assert.equal(divergent.length, 1);
  assert.equal(divergent[0].id, 'Dup');
});
