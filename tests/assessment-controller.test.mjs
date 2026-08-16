import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentController } from '../controllers/assessment-controller.js';

function createController() {
  const question = {
    id: 'q1',
    type: 'choice',
    answer: 'A',
    knowledgeIds: ['atom'],
    masteryWeight: 0.5,
  };
  const contentService = {
    async getLesson(dayId) {
      return dayId === 'day-01' ? { id: dayId, questions: ['q1'] } : null;
    },
    async load() {
      return { questionById: new Map([['q1', question]]), questions: [question] };
    },
  };
  const state = {
    progress: { mastery: {} },
    learning: {},
    save() { this.saved = true; },
  };
  const assessment = {
    evaluate(item, answer) {
      return { correct: answer === 'A', score: answer === 'A' ? 1 : 0 };
    },
  };
  const masteryValues = new Map();
  const masteryService = {
    hydrate(value) { this.hydrated = value; },
    recordEvidence(id, score, weight) {
      masteryValues.set(id, { score, weight });
      return score;
    },
    getState() { return Object.fromEntries(masteryValues); },
  };
  return { controller: new AssessmentController({ assessment, contentService, state, masteryService }), state, masteryService };
}

test('assessment controller starts a lesson quiz and persists answers', async () => {
  const { controller, state } = createController();
  const session = await controller.start('day-01');
  assert.equal(session.questions.length, 1);
  const result = controller.answer(0);
  assert.equal(result.correct, true);
  assert.equal(controller.getScore(), 100);
  assert.equal(controller.session.answers.length, 1);
  assert.equal(controller.session.answers[0].answer, 'A');
  assert.equal(state.saved, true);
  assert.equal(controller.session.completed, true);
});

test('assessment controller records answer evidence for knowledge mastery', async () => {
  const { controller, masteryService } = createController();
  await controller.start('day-01');
  controller.answer(1);
  assert.deepEqual(masteryService.hydrated, {});
  assert.deepEqual(masteryService.getState(), { atom: { score: 0, weight: 0.5 } });
});

test('assessment controller starts a targeted recheck and feeds new evidence into mastery', async () => {
  const { controller, state, masteryService } = createController();
  const session = await controller.startTargeted(['atom'], 5);

  assert.equal(session.dayId, 'remediation-recheck');
  assert.equal(session.questions.length, 1);
  assert.deepEqual(state.learning.recheck, { lessonId: 'remediation-recheck', knowledgeIds: ['atom'], status: 'in-progress', questionCount: 1 });

  const result = controller.answer(0);
  assert.equal(result.correct, true);
  assert.deepEqual(masteryService.getState(), { atom: { score: 1, weight: 0.5 } });
  assert.deepEqual(state.progress.mastery, masteryService.getState());
  assert.equal(state.saved, true);
});

test('assessment controller ignores answers without an active session', () => {
  const { controller } = createController();
  assert.equal(controller.answer(0), null);
});
