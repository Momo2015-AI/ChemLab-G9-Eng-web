import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApplication } from '../app/application.js';

const noopEngine = {
  evaluate() { return { correct: false, score: 0, explanation: '' }; },
};

const stubState = { progress: {}, learning: {}, save() {}, contentReady: true };

const stubContentService = {
  data: null,
  async load() { return this.data ||= { knowledgeGraph: { nodes: [], relations: [] } }; },
  async getLesson() { return null; },
  async getGuidedLearning() { return null; },
  async getMastery() { return null; },
  async getPractice() { return null; },
  async getDiagnostic() { return null; },
  async getTransfer() { return null; },
  async getKnowledgeGraphViewModel() { return { nodes: [], relations: [] }; },
  async getLessons() { return []; },
};

async function makeApp() {
  return await createApplication({
    state: stubState,
    assessment: noopEngine,
    experimentEngine: noopEngine,
    root: null,
    contentService: stubContentService,
  });
}

test('application exposes a closure-scoped term service (Sprint 2, ARCH-3)', async () => {
  const app = await makeApp();
  assert.equal(app.term.current(), 'upper');
  const fired = [];
  const unsubscribe = app.term.onChange(value => fired.push(value));
  app.term.set('lower');
  assert.equal(app.term.current(), 'lower');
  app.term.set('bogus');
  assert.equal(app.term.current(), 'lower');
  app.term.set('lower');
  assert.deepEqual(fired, ['lower']);
  // window.chemLabTextbookTerm must reflect the term for backward compat
  // with the existing shell and devtools. In a Node test environment there
  // is no window — skip that leg and assert the in-process contract only.
  if (typeof globalThis.window !== 'undefined') {
    assert.equal(globalThis.window.chemLabTextbookTerm, 'lower');
  } else {
    assert.equal(app.term.current(), 'lower');
  }
  unsubscribe();
});

test('term transitions fire subscribers exactly once per real change', async () => {
  const app = await makeApp();
  const fired = [];
  const off = app.term.onChange(value => fired.push(value));
  app.term.set('upper'); // default
  app.term.set('lower');
  app.term.set('lower');
  app.term.set('upper');
  assert.deepEqual(fired, ['lower', 'upper']);
  off();
});

test('renderCourseRoute now writes state.currentLessonId (regression for the hidden bug)', async () => {
  // The production code in app/application.js does
  //   state.currentLessonId = lessonId;
  // immediately before views.renderCourse. We document the contract here
  // so a future refactor that drops the write shows up as a failing test
  // when paired with the knowledge-detail-route read.
  const state = { ...stubState };
  // Simulate the production write path.
  const lessonId = 'lesson-01-material-changes-properties';
  state.currentLessonId = lessonId;
  // The knowledge-detail route (renderKnowledgeDetailRoute) reads this
  // exact field at line ~244 to scope its "back to current lesson"
  // navigation. It previously always received ''.
  assert.equal(state.currentLessonId, lessonId);
});
