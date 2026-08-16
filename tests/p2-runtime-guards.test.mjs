import test from 'node:test';
import assert from 'node:assert/strict';
import assessmentEngine from '../engine/assessment-engine.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { LearningController } from '../controllers/learning-controller.js';
import { getLessonReleaseState } from '../content/release-policy.js';
import { renderQuiz, renderQuizResult } from '../views/quiz-view.js';

function createRoot() {
  return { innerHTML: '', querySelector() { return null; }, querySelectorAll() { return []; } };
}

function createHarness({ answers = {} } = {}) {
  const state = {
    progress: { mastery: {} },
    learning: {},
    save() {},
  };
  const learningController = new LearningController({ contentService: {}, state });
  const controller = new AssessmentRuntimeController({
    assessment: assessmentEngine,
    contentService: {},
    state,
    learningController,
  });
  return { state, controller, learningController };
}

test('assessment engine evaluates constructed answers through rubric keywords', () => {
  const question = {
    id: 'c1',
    type: 'constructed',
    rubric: { keywords: ['新物质', '生成'] },
  };
  const passed = assessmentEngine.checkAnswer(question, '要看是否生成了新物质');
  const failed = assessmentEngine.checkAnswer(question, '发光发热就是变化');
  assert.equal(passed, true);
  assert.equal(failed, false);
  const result = assessmentEngine.evaluate(question, '生成了新物质，所以是化学变化');
  assert.equal(result.rubricPassed, true);
  assert.equal(result.correct, true);
});

test('assessment engine treats empty constructed answer as incorrect', () => {
  const question = { id: 'c2', type: 'constructed', rubric: { keywords: ['新物质'] } };
  assert.equal(assessmentEngine.checkAnswer(question, ''), false);
  assert.equal(assessmentEngine.checkAnswer(question, '   '), false);
});

test('assessment engine falls back to model answer presence when rubric has no keywords', () => {
  const question = { id: 'c3', type: 'constructed', rubric: { modelAnswer: '某种参考解答' } };
  assert.equal(assessmentEngine.checkAnswer(question, '完整的回答内容'), true);
  assert.equal(assessmentEngine.checkAnswer(question, '嗯'), false);
});

test('startPractice rejects an empty question pool', async () => {
  const { controller } = createHarness();
  controller.contentService = {
    async getLesson() { return { id: 'l1', knowledgePoints: [] }; },
    async load() { return { questionById: new Map() }; },
    async getPractice() { return []; },
  };
  const session = await controller.startPractice('l1');
  assert.equal(session, null);
  assert.equal(controller.session, null);
});

test('startPractice resolves questions from lesson question ids', async () => {
  const { controller } = createHarness();
  const question = { id: 'q1', type: 'choice', options: ['A', 'B'], answer: 0, knowledgeIds: ['k1'] };
  controller.contentService = {
    async getLesson() { return { id: 'l1', questions: ['q1'], knowledgePoints: ['k1'] }; },
    async load() { return { questionById: new Map([['q1', question]]) }; },
    async getPractice() { return ['q1']; },
  };
  const session = await controller.startPractice('l1');
  assert.ok(session);
  assert.equal(session.mode, 'practice');
  assert.equal(session.questions.length, 1);
  assert.equal(session.questions[0].type, 'choice');
});

test('runtime controller records rubricPassed for constructed answers', () => {
  const { controller } = createHarness();
  const question = { id: 'c4', type: 'constructed', rubric: { keywords: ['新物质', '生成'] } };
  controller.startAttempt('l1', [controller.normalizeQuestion(question)], 'mastery');
  const result = controller.answer('要看是否生成了新物质');
  assert.equal(result.rubricPassed, true);
  const record = controller.session.answers[0];
  assert.equal(record.rubricPassed, true);
  assert.equal(record.correct, true);
});

test('prerequisites gate practice stage until prerequisite lessons are mastered', () => {
  const { learningController } = createHarness();
  const lesson = { id: 'l2', releaseStatus: 'ready', prerequisites: ['l1'], questions: ['q1'], experiments: [], knowledgePoints: ['k2'] };
  const guided = { steps: [{ id: 's1' }] };
  learningController.updateLessonState('l2', { guided: { completed: true }, practice: { completedAt: new Date().toISOString() } });
  const blocked = learningController.getStageAvailability(lesson, guided);
  assert.equal(blocked.prerequisitesMet, false);
  assert.deepEqual(blocked.prerequisitesMissing, ['l1']);
  assert.equal(blocked.practice, false);

  learningController.updateLessonState('l1', { mastery: { status: 'passed' } });
  const open = learningController.getStageAvailability(lesson, guided);
  assert.equal(open.prerequisitesMet, true);
  assert.equal(open.practice, true);
});

test('getStageAvailability reports unavailable stages for unreleased lessons', () => {
  const { learningController } = createHarness();
  const lesson = { id: 'unreleased', releaseStatus: 'unavailable', prerequisites: ['l1'] };
  const stages = learningController.getStageAvailability(lesson, null);
  assert.equal(stages.prerequisitesMet, false);
  assert.equal(stages.practice, false);
  assert.equal(stages.mastery, false);
});

test('release policy blocks quiz modes for review lessons', () => {
  assert.equal(getLessonReleaseState({ releaseStatus: 'review' }).key, 'review');
  assert.equal(getLessonReleaseState({ releaseStatus: 'ready' }).key, 'released');
  assert.equal(getLessonReleaseState({ releaseStatus: 'unavailable' }).key, 'unavailable');
});

test('practice diagnosis is stored per lesson, not globally', () => {
  const { controller, state } = createHarness();
  const question = { id: 'q1', type: 'choice', options: ['A', 'B'], answer: 1, knowledgeIds: ['k1'] };
  controller.startAttempt('l1', [controller.normalizeQuestion(question)], 'practice');
  controller.answer(0);
  const lessonState = state.learning.lessons['l1'];
  assert.ok(lessonState, 'per-lesson state exists');
  assert.ok(lessonState.diagnosis, 'per-lesson diagnosis exists');
  assert.equal(lessonState.diagnosis.status, 'incorrect');
  assert.deepEqual(lessonState.diagnosis.weakPoints, ['k1']);
  assert.equal(state.learning.diagnosis, undefined);
  assert.equal(state.learning.lessons['l2']?.diagnosis, undefined);
});

test('renderQuiz renders a textarea for constructed questions', () => {
  const root = createRoot();
  renderQuiz({ root, question: { type: 'constructed', question: '请说明判断依据' }, index: 0, total: 2, mode: 'mastery' });
  assert.match(root.innerHTML, /cg-constructed-input/);
  assert.match(root.innerHTML, /data-constructed-submit/);
  assert.doesNotMatch(root.innerHTML, /cg-opt/);
});

test('renderQuiz renders option buttons for choice questions', () => {
  const root = createRoot();
  renderQuiz({ root, question: { type: 'choice', options: ['甲', '乙', '丙'], question: '选择' }, index: 0, total: 2 });
  assert.match(root.innerHTML, /data-option/);
  assert.doesNotMatch(root.innerHTML, /cg-constructed-input/);
});

test('renderQuizResult surfaces unmet mastery criteria', () => {
  const root = createRoot();
  renderQuizResult({
    root,
    mode: 'mastery',
    status: 'needs-remediation',
    correct: 8,
    total: 10,
    score: 80,
    criteria: {
      scorePassed: false,
      threshold: 0.95,
      uncoveredKnowledge: ['chemical-change'],
      unclearedMisconceptions: ['physical-vs-chemical'],
      constructedPassed: false,
    },
  });
  assert.match(root.innerHTML, /本次未满足的条件/);
  assert.match(root.innerHTML, /chemical-change/);
  assert.match(root.innerHTML, /physical-vs-chemical/);
  assert.match(root.innerHTML, /主观题未通过/);
  assert.match(root.innerHTML, /答题得分未达标/);
});

test('renderQuizResult hides criteria block when all criteria pass', () => {
  const root = createRoot();
  renderQuizResult({
    root,
    mode: 'mastery',
    status: 'passed',
    correct: 10,
    total: 10,
    score: 100,
    criteria: { scorePassed: true, uncoveredKnowledge: [], unclearedMisconceptions: [], constructedPassed: true },
  });
  assert.doesNotMatch(root.innerHTML, /本次未满足的条件/);
});

test('renderQuizResult shows review notice for blocked lessons', () => {
  const root = createRoot();
  renderQuizResult({ root, mode: 'practice', status: 'review', correct: 0, total: 0, score: 0, notice: '该课程正在审核中' });
  assert.match(root.innerHTML, /该课程正在审核中/);
});
