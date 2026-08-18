import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';

function makeHarness({ practice = [], diagnostic = [], globalPool = [], diagnosisErrors = [] } = {}) {
  const state = { progress: {}, learning: {}, saveCalls: 0, save() { this.saveCalls += 1; } };
  state.learning.lessons = {
    'lesson-03-acid-intro': { diagnosis: { errors: diagnosisErrors } },
  };
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
  };
  const contentService = {
    async load() { return { questions: globalPool }; },
    async getPractice() { return practice; },
    async getDiagnostic() { return diagnostic; },
    async getMastery() { return { questions: [] }; },
  };
  const controller = new AssessmentRuntimeController({
    assessment: { evaluate() { return { correct: true }; } },
    contentService,
    state,
    learningController,
  });
  return { controller, state };
}

test('targeted recheck selects questions matching diagnosed knowledge from lesson pools', async () => {
  const { controller, state } = makeHarness({
    practice: [
      { id: 'L03-P1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-base'] },
      { id: 'L03-P2', type: 'choice', options: ['a', 'b'], answer: 1, knowledgeIds: ['acid-base', 'indicator'] },
    ],
    globalPool: [
      { id: 'foreign-q1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-base'] },
    ],
  });

  const session = await controller.startRecheck('lesson-03-acid-intro', ['acid-base'], 5);
  assert.deepEqual([...session.questions.map(q => q.id)].sort(), ['L03-P1', 'L03-P2']);
  assert.equal(session.lessonId, 'lesson-03-acid-intro');
  assert.equal(state.learning.lessons['lesson-03-acid-intro'].recheck.questionCount, 2);
});

test('recheck never mixes foreign-lesson questions that share a knowledge tag', async () => {
  // Regression for the day01 contamination bug: legacy bank items tagged with
  // the same knowledge id as the current lesson must not leak into a recheck.
  const { controller } = makeHarness({
    practice: [
      { id: 'L03-P1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-intro'] },
    ],
    diagnostic: [
      { id: 'L03-D1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-intro'] },
    ],
    globalPool: [
      { id: 'q-acid-001', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-intro'] },
      { id: 'q-acid-002', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-intro'] },
    ],
  });

  const session = await controller.startRecheck('lesson-03-acid-intro', ['acid-intro'], 5);
  assert.deepEqual([...session.questions.map(q => q.id)].sort(), ['L03-D1', 'L03-P1']);
});

test('recheck puts previously failed questions first', async () => {
  const { controller } = makeHarness({
    practice: [
      { id: 'L03-P1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-base'] },
      { id: 'L03-P2', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-base'] },
      { id: 'L03-P3', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['acid-base'] },
    ],
    diagnosisErrors: [
      { questionId: 'L03-P3', knowledgeIds: ['acid-base'] },
      { questionId: 'L03-P2', knowledgeIds: ['acid-base'] },
    ],
  });

  const session = await controller.startRecheck('lesson-03-acid-intro', ['acid-base'], 2);
  // Failed questions come first (stable within pool order), so the two
  // missed items P2/P3 are served before the correctly answered P1.
  assert.deepEqual(session.questions.map(q => q.id), ['L03-P2', 'L03-P3']);
});

test('targeted recheck returns null when no matching questions exist', async () => {
  const { controller } = makeHarness({
    practice: [{ id: 'L03-P1', type: 'choice', options: ['a', 'b'], answer: 0, knowledgeIds: ['metal'] }],
  });
  assert.equal(await controller.startRecheck('lesson-03-acid-intro', ['acid-base']), null);
});
