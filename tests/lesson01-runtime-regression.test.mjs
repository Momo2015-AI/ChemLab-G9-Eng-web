import test from 'node:test';
import assert from 'node:assert/strict';
import assessmentEngine from '../engine/assessment-engine.js';
import { AssessmentController } from '../controllers/assessment-controller.js';
import lesson01Mastery from '../content/assessment/lesson-01-unseen-mastery-items-v1.js';

function makeState() {
  return { learning: {}, progress: {}, quizAnswers: {}, save() {} };
}

function makeContentService() {
  return {
    async getMastery() {
      return { threshold: 0.95, questions: lesson01Mastery.map(q => ({ ...q, options: q.o, answer: q.a })) };
    },
    async getLesson() { return { questions: [] }; },
    async load() { return { questions: [], questionById: new Map() }; }
  };
}

test('Lesson 01 mastery answer keys evaluate correctly for all single-choice items', async () => {
  const state = makeState();
  const controller = new AssessmentController({ assessment: assessmentEngine, contentService: makeContentService(), state });
  await controller.startMastery('lesson-01-material-changes-properties');
  const session = controller.session;
  const choiceItems = session.questions.filter(q => q.type === 'single');
  for (const question of choiceItems) {
    session.index = session.questions.indexOf(question);
    const expectedIndex = String(question.a).charCodeAt(0) - 65;
    const result = controller.answer(expectedIndex);
    assert.equal(result.correct, true, `${question.id} expected ${question.a}`);
  }
});

test('switching from practice to mastery creates the requested fresh session', async () => {
  const state = makeState();
  const controller = new AssessmentController({ assessment: assessmentEngine, contentService: makeContentService(), state });
  controller.createSession('lesson-01-material-changes-properties', [{ id: 'P1', type: 'choice', answer: 'A', options: ['x'] }], 'practice');
  await controller.startMastery('lesson-01-material-changes-properties');
  assert.equal(controller.session.mode, 'mastery');
  assert.equal(controller.session.dayId, 'mastery:lesson-01-material-changes-properties');
  assert.equal(controller.session.index, 0);
});
