import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppState, STATE_SCHEMA_VERSION } from '../app/state.js';
import { LearningController } from '../controllers/learning-controller.js';
import { canCompleteLesson, getLessonReleaseState } from '../content/release-policy.js';

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('state migration scopes legacy learning records by lesson', () => {
  const progressService = { load: () => ({ learning: { diagnosis: { lessonId: 'lesson-a', status: 'incorrect' } } }), save() {} };
  const state = createAppState({ progressService });
  assert.equal(state.progress.schemaVersion, STATE_SCHEMA_VERSION);
  assert.equal(state.learning.lessons['lesson-a'].diagnosis.status, 'incorrect');
});

test('guided checks persist per-lesson evidence and advance the phase', () => {
  const state = { progress: {}, learning: {}, save() {} };
  const controller = new LearningController({ contentService: {}, state });
  controller.recordGuidedCheck('lesson-a', 'step-1', { correct: true, stepCount: 1 });
  assert.equal(state.learning.lessons['lesson-a'].guided.steps['step-1'].correct, true);
  assert.equal(state.learning.lessons['lesson-a'].phase, 'EXPERIMENT');
});

test('release policy distinguishes preview from unavailable lessons', () => {
  assert.equal(getLessonReleaseState({ status: 'review' }).key, 'review');
  assert.equal(canCompleteLesson({ status: 'review' }), false);
  assert.equal(getLessonReleaseState({ status: 'in-review' }).available, true);
  assert.equal(getLessonReleaseState({ status: 'blocked' }).available, false);
});

test('lesson completion requires mastery and remains lesson-scoped', () => {
  const state = { progress: { completed: {} }, learning: { lessons: { 'lesson-a': { phase: 'MASTERED', mastery: { status: 'passed' } } } }, save() {} };
  const controller = new LearningController({ contentService: {}, state });
  assert.equal(controller.markComplete('lesson-a'), true);
  assert.equal(state.progress.completed['lesson-a'], true);
  assert.equal(state.learning.lessons['lesson-a'].phase, 'COMPLETED');
});
