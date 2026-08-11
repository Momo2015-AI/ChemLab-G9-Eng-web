import test from 'node:test';
import assert from 'node:assert/strict';
import { createApplication } from '../app/application.js';

const makeState = () => ({
  route: { page: 'home', params: [] },
  progress: { completed: [], masteryScore: 0, questions: 0, weakPoints: [] },
  learning: {},
});

test('application composition root exposes canonical V1.7 services and controllers', () => {
  const state = makeState();
  const assessment = {
    evaluate: () => ({ correct: true }),
  };
  const experimentEngine = {};
  const app = createApplication({ state, assessment, experimentEngine, root: null });

  assert.ok(app.contentService);
  assert.ok(app.masteryService);
  assert.ok(app.controllers.learning);
  assert.ok(app.controllers.assessment);
  assert.ok(app.controllers.experiment);
  assert.equal(typeof app.router.start, 'function');
  assert.equal(typeof app.router.stop, 'function');
});

test('application composition root is safe to construct without a browser DOM', () => {
  const app = createApplication({
    state: makeState(),
    assessment: { evaluate: () => ({ correct: true }) },
    experimentEngine: {},
    root: null,
  });

  assert.doesNotThrow(() => app.start());
  assert.doesNotThrow(() => app.stop());
});
