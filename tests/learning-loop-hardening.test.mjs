import test from 'node:test';
import assert from 'node:assert/strict';
import assessmentEngine from '../engine/assessment-engine.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { ProgressService, STORAGE_KEY } from '../app/progress-service.js';
import { createAppState } from '../app/state.js';
import { knowledgeIdsOf } from '../core/diagnosis/question-knowledge-map.js';

function memoryStorage(initial = new Map()) {
  return {
    backing: initial,
    getItem(key) { return this.backing.has(key) ? this.backing.get(key) : null; },
    setItem(key, value) { this.backing.set(key, String(value)); },
    removeItem(key) { this.backing.delete(key); },
  };
}

test('constructed rubric accepts paraphrases through synonym groups', () => {
  const question = {
    id: 'q',
    type: 'constructed',
    rubric: { modelAnswer: '是否生成新物质', keywords: [['新物质'], ['生成', '产生', '形成']] },
  };
  assert.equal(assessmentEngine.checkConstructed(question, '判断依据是有新物质产生'), true);
  assert.equal(assessmentEngine.checkConstructed(question, '判断依据是新物质的形成'), true);
  assert.equal(assessmentEngine.checkConstructed(question, '我觉得蜡烛很漂亮'), false);
});

test('constructed rubric normalizes whitespace and full-width input', () => {
  const question = {
    id: 'q',
    type: 'constructed',
    rubric: { keywords: [['新物质'], ['生成']] },
  };
  assert.equal(assessmentEngine.checkConstructed(question, '有 新 物 质　生 成'), true);
});

test('choice option labels strip duplicated letter prefixes', () => {
  const controller = new AssessmentRuntimeController({ assessment: assessmentEngine, contentService: {}, state: {} });
  const normalized = controller.normalizeQuestion({
    id: 'q',
    type: 'choice',
    options: ['A. 盐酸是混合物', 'B. 纯净物', 'C、氧化物', 'D：单质'],
    answer: 0,
  });
  assert.deepEqual(normalized.options, ['盐酸是混合物', '纯净物', '氧化物', '单质']);
  assert.equal(normalized.answer, 'A');
});

test('progress save survives quota errors instead of crashing the quiz', () => {
  const storage = memoryStorage();
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  const service = new ProgressService({ storage });
  assert.equal(service.save({ any: 'payload' }), false); // must not throw
});

test('corrupt persisted progress is backed up and reset instead of wiped silently', () => {
  const storage = memoryStorage(new Map([[STORAGE_KEY, '{"history":[truncated']]));
  const service = new ProgressService({ storage });
  assert.deepEqual(service.load(), {});
  assert.ok(storage.backing.has(`${STORAGE_KEY}_corrupt`), 'corrupt payload is preserved for inspection');
});

test('history is capped so localStorage cannot grow without bound', () => {
  const state = createAppState({ progressService: new ProgressService({ storage: memoryStorage() }) });
  state.progress.history = Array.from({ length: 250 }, (_, i) => ({ attemptId: `a${i}` }));
  state.save();
  assert.equal(state.progress.history.length, 100);
  assert.equal(state.progress.history[0].attemptId, 'a150');
});

test('legacy flat learning state migrates into per-lesson records', () => {
  const storage = memoryStorage(new Map([[STORAGE_KEY, JSON.stringify({
    learning: {
      practice: { lessonId: 'lesson-01', score: 0.5 },
      mastery: { 'lesson-01': { status: 'passed' }, 'lesson-02': { status: 'needs-remediation' } },
    },
  })]]));
  const state = createAppState({ progressService: new ProgressService({ storage }) });
  const lessons = state.learning.lessons;
  assert.equal(lessons['lesson-01'].practice.score, 0.5);
  assert.equal(lessons['lesson-01'].mastery.status, 'passed');
  assert.equal(lessons['lesson-02'].mastery.status, 'needs-remediation');
});

test('knowledgeIdsOf resolves every legacy field spelling with fallback', () => {
  assert.deepEqual(knowledgeIdsOf({ knowledgeIds: ['a'] }), ['a']);
  assert.deepEqual(knowledgeIdsOf({ knowledgePoints: ['b'] }), ['b']);
  assert.deepEqual(knowledgeIdsOf({ knowledge: 'c' }), ['c']);
  assert.deepEqual(knowledgeIdsOf({}, ['fallback']), ['fallback']);
});
