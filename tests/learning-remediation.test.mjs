import test from 'node:test';
import assert from 'node:assert/strict';
import { LearningController } from '../controllers/learning-controller.js';

test('learning controller persists actionable remediation plan', () => {
  const state = { progress: {}, saveCalls: 0, save() { this.saveCalls += 1; } };
  const controller = new LearningController({
    contentService: {},
    state,
    remediationCatalog: {
      'acid-base': { reviewId: 'lesson-acid', practiceId: 'practice-acid' },
    },
  });

  const plan = controller.getRemediationPlan({
    lessonId: 'lesson-acid',
    status: 'incorrect',
    knowledge: ['acid-base'],
    possibleErrors: ['indicator confusion'],
  });

  assert.equal(plan.status, 'needs-remediation');
  assert.deepEqual(plan.steps.map(step => step.type), ['review', 'practice', 'recheck']);
  assert.equal(state.learning.lessons['lesson-acid'].remediation, plan);
  assert.equal(state.saveCalls, 1);
});

test('learning controller does not invent remediation for unknown diagnosis', () => {
  const state = { progress: {}, save() {} };
  const controller = new LearningController({ contentService: {}, state });
  assert.deepEqual(controller.getRemediationPlan({ status: 'unknown' }), {
    status: 'unavailable',
    steps: [],
  });
});
