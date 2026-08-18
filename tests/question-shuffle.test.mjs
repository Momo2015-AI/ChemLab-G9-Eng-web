import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';

const stableRng = () => 0.5;

function makeController(rng = stableRng) {
  const state = { progress: {}, learning: {}, save() {} };
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
  };
  const assessment = { evaluate(question, answer) { return { correct: question.answer === answer }; } };
  const contentService = {
    async getLesson() { return { id: 'l1', questions: ['p1', 'p2', 'p3', 'p4'], knowledgePoints: ['k1'] }; },
    async load() {
      const questionById = new Map();
      for (let i = 1; i <= 4; i++) questionById.set(`p${i}`, { id: `p${i}`, type: 'choice', options: ['x', 'y'], answer: i % 2, knowledgeIds: ['k1'] });
      return { questionById, questions: [...questionById.values()] };
    },
    async getPractice() { return ['p1', 'p2', 'p3', 'p4']; },
    async getMastery() { return { questions: [], requiredKnowledgeIds: ['k1'], criticalMisconceptions: [], requireConstructed: false }; },
  };
  const controller = new AssessmentRuntimeController({ assessment, contentService, state, learningController, rng });
  return { controller, state, learningController };
}

test('shuffleQuestions returns a reordered copy without mutating the source', () => {
  const { controller } = makeController();
  const source = ['a', 'b', 'c', 'd'];
  const shuffled = controller.shuffleQuestions(source);
  assert.notDeepEqual(shuffled, source, 'order must change with a deterministic rng');
  assert.deepEqual([...shuffled].sort(), source, 'same items must be preserved');
  assert.deepEqual(source, ['a', 'b', 'c', 'd'], 'source array must not be mutated');
});

test('startPractice shuffles session order but keeps the full pool', async () => {
  const { controller } = makeController();
  const session = await controller.startPractice('l1');
  const ids = session.questions.map(q => q.id);
  assert.deepEqual([...ids].sort(), ['p1', 'p2', 'p3', 'p4']);
  assert.notDeepEqual(ids, ['p1', 'p2', 'p3', 'p4'], 'presentation order must be shuffled');
});

test('startMastery shuffles session order but keeps the full pool', async () => {
  const { controller } = makeController();
  const questions = [];
  for (let i = 1; i <= 4; i++) questions.push({ id: `m${i}`, type: 'choice', options: ['x', 'y'], answer: i % 2, knowledgeIds: ['k1'] });
  controller.contentService.getMastery = async () => ({ questions, requiredKnowledgeIds: ['k1'], criticalMisconceptions: [], requireConstructed: false });
  const session = await controller.startMastery('l1');
  const ids = session.questions.map(q => q.id);
  assert.deepEqual([...ids].sort(), ['m1', 'm2', 'm3', 'm4']);
  assert.notDeepEqual(ids, ['m1', 'm2', 'm3', 'm4'], 'presentation order must be shuffled');
});

test('recheck keeps failed items first and shuffles only the correct tail', async () => {
  const { controller, state } = makeController();
  state.learning.lessons ||= {};
  state.learning.lessons.l1 = {
    lessonId: 'l1',
    diagnosis: { errors: [{ questionId: 'p1' }, { questionId: 'p2' }] },
  };
  const session = await controller.startRecheck('l1', ['k1'], 6);
  const ids = session.questions.map(q => q.id);
  assert.deepEqual(ids.slice(0, 2), ['p1', 'p2'], 'failed items must come first in stable order');
  assert.deepEqual([...ids].sort(), ['p1', 'p2', 'p3', 'p4'], 'full recheck pool must be preserved');
});

test('transfer pool preserves its authored order', async () => {
  const { controller } = makeController();
  controller.contentService.getTransfer = async () => [
    { id: 't1', type: 'choice', options: ['x', 'y'], answer: 0, knowledgeIds: ['k1'] },
    { id: 't2', type: 'choice', options: ['x', 'y'], answer: 1, knowledgeIds: ['k1'] },
  ];
  const session = await controller.startTransfer('l1', 2);
  assert.deepEqual(session.questions.map(q => q.id), ['t1', 't2']);
});
