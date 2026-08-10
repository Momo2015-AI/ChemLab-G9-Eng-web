import test from 'node:test';
import assert from 'node:assert/strict';
import { createRemediationPlan } from '../core/diagnosis/remediation-engine.js';

test('correct diagnosis moves learner to transfer', () => {
  const plan = createRemediationPlan({ status: 'correct' });
  assert.equal(plan.status, 'ready-for-transfer');
  assert.equal(plan.steps[0].type, 'transfer');
});

test('incorrect diagnosis creates targeted review, practice and recheck', () => {
  const plan = createRemediationPlan(
    { status: 'incorrect', knowledge: ['acid-base'], possibleErrors: ['indicator confusion'] },
    { catalog: { 'acid-base': { reviewId: 'lesson-acid', practiceId: 'practice-acid' } } },
  );

  assert.equal(plan.status, 'needs-remediation');
  assert.deepEqual(plan.steps.map(step => step.type), ['review', 'practice', 'recheck']);
  assert.equal(plan.steps[0].resourceId, 'lesson-acid');
  assert.equal(plan.steps[1].resourceId, 'practice-acid');
  assert.equal(plan.steps[0].reason, 'indicator confusion');
});

test('unknown diagnosis does not fabricate remediation', () => {
  assert.deepEqual(createRemediationPlan({ status: 'unknown' }), { status: 'unavailable', steps: [] });
});
