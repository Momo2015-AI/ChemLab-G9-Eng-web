import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentController } from '../controllers/assessment-controller.js';

test('targeted recheck selects questions matching diagnosed knowledge', async () => {
  const state = { progress: {}, learning: {}, saveCalls: 0, save() { this.saveCalls += 1; } };
  const questions = [
    { id: 'q1', knowledgeIds: ['acid-base'] },
    { id: 'q2', knowledge: ['metal'] },
    { id: 'q3', knowledgeIds: ['acid-base', 'indicator'] },
  ];
  const controller = new AssessmentController({
    assessment: { evaluate() { return { correct: true }; } },
    contentService: { async load() { return { questions }; } },
    state,
  });

  const session = await controller.startTargeted(['acid-base'], 5);
  assert.deepEqual(session.questions.map(q => q.id), ['q1', 'q3']);
  assert.equal(session.dayId, 'remediation-recheck');
  assert.equal(state.learning.recheck.questionCount, 2);
  assert.equal(state.saveCalls, 1);
});

test('targeted recheck returns null when no matching questions exist', async () => {
  const state = { progress: {}, learning: {}, save() {} };
  const controller = new AssessmentController({
    assessment: {},
    contentService: { async load() { return { questions: [{ id: 'q1', knowledge: ['metal'] }] }; } },
    state,
  });
  assert.equal(await controller.startTargeted(['acid-base']), null);
});
