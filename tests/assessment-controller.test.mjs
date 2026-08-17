import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';

function createController() {
  const question = {
    id: 'q1',
    type: 'choice',
    options: ['选项一', '选项二'],
    answer: 'A',
    knowledgeIds: ['atom'],
    masteryWeight: 0.5,
  };
  const contentService = {
    async getLesson(dayId) {
      return dayId === 'day-01' ? { id: dayId, questions: [question] } : null;
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
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
    getRemediationPlan(diagnosis) { return { status: diagnosis.status === 'incorrect' ? 'needs-remediation' : 'correct', steps: [] }; },
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
  const controller = new AssessmentRuntimeController({ assessment, contentService, state, masteryService, learningController });
  return { controller, state, masteryService, learningController };
}

test('assessment controller starts a lesson quiz and persists answers', async () => {
  const { controller, state } = createController();
  const session = await controller.startPractice('day-01');
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
  await controller.startPractice('day-01');
  controller.answer(1);
  assert.deepEqual(masteryService.hydrated, {});
  assert.deepEqual(masteryService.getState(), { atom: { score: 0, weight: 0.5 } });
});

test('assessment controller starts a lesson-scoped recheck and feeds new evidence into mastery', async () => {
  const { controller, state, masteryService } = createController();
  const session = await controller.startRecheck('day-01', ['atom'], 5);

  assert.equal(session.lessonId, 'day-01');
  assert.equal(session.mode, 'recheck');
  assert.equal(session.questions.length, 1);
  assert.deepEqual(state.learning.lessons['day-01'].recheck, { lessonId: 'day-01', knowledgeIds: ['atom'], status: 'in-progress', questionCount: 1 });

  const result = controller.answer(0);
  assert.equal(result.correct, true);
  assert.deepEqual(masteryService.getState(), { atom: { score: 1, weight: 0.5 } });
  assert.deepEqual(state.progress.mastery, masteryService.getState());
  assert.equal(state.saved, true);
  assert.equal(state.learning.lessons['day-01'].recheck.status, 'passed');
  assert.deepEqual(state.learning.lessons['day-01'].recheck.knowledgeIds, ['atom']);
});

test('assessment controller ignores answers without an active session', () => {
  const { controller } = createController();
  assert.equal(controller.answer(0), null);
});

test('reset clears the finished session so a failed attempt can be retried', async () => {
  const { controller } = createController();
  await controller.startPractice('day-01');
  controller.answer(1);
  assert.equal(controller.session.completed, true);
  controller.reset();
  assert.equal(controller.hasSession('day-01', 'practice'), false);
  const session = await controller.startPractice('day-01');
  assert.equal(session.completed, false);
  assert.equal(session.index, 0);
});
