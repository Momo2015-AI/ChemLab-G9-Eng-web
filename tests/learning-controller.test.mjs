import test from 'node:test';
import assert from 'node:assert/strict';
import { LearningController } from '../controllers/learning-controller.js';

function makeState() {
  return {
    progress: { completed: {} },
    learning: {},
    saves: 0,
    save() { this.saves += 1; }
  };
}

test('LearningController delegates lesson loading', async () => {
  const lesson = { id: 'day-01', title: 'Matter' };
  const contentService = {
    async getLesson(dayId) {
      assert.equal(dayId, 'day-01');
      return lesson;
    }
  };
  const controller = new LearningController({ contentService, state: makeState() });
  assert.deepEqual(await controller.getLesson('day-01'), lesson);
});

test('LearningController marks completion and persists state', () => {
  const state = makeState();
  state.learning.mastery = { 'day-03': { status: 'passed', score: 1, threshold: 0.95 } };
  const controller = new LearningController({ contentService: {}, state });

  assert.equal(controller.markComplete('day-03'), true);

  assert.equal(controller.getProgress('day-03'), true);
  assert.equal(state.progress.completed['day-03'], true);
  assert.equal(state.saves, 1);
});

test('LearningController creates and persists remediation plan', () => {
  const state = makeState();
  const catalog = {
    'matter-structure': { lessonId: 'day-02' }
  };
  const controller = new LearningController({
    contentService: {},
    state,
    remediationCatalog: catalog
  });

  const plan = controller.getRemediationPlan({ knowledgeId: 'matter-structure' });

  assert.ok(plan);
  assert.deepEqual(state.learning.remediation, plan);
  assert.equal(state.saves, 1);
});
