import test from 'node:test';
import assert from 'node:assert/strict';
import { ExperimentController } from '../controllers/experiment-controller.js';

function createController() {
  const experiment = {
    id: 'acid',
    title: 'Acid observation',
    knowledgeId: 'acid-reaction',
    steps: [{ id: 's1', observation: 'solution changes color' }],
  };
  const engine = {
    get: id => id === experiment.id ? experiment : null,
    start: () => ({ id: experiment.id, knowledgeId: experiment.knowledgeId, currentStep: 0, steps: experiment.steps, observations: [], completed: false }),
    next: session => session,
    recordObservation: (session, observation) => ({ ...session, observations: [...session.observations, { step: session.currentStep, observation }] }),
    validateStep: (_session, observation) => ({ valid: observation === 'solution changes color', message: 'validated' }),
    complete: session => ({ ...session, completed: true }),
  };
  const evidence = [];
  const masteryService = { recordEvidence: (...args) => evidence.push(args) };
  const controller = new ExperimentController({ experimentEngine: engine, state: { progress: {} }, masteryService });
  return { controller, evidence };
}

test('correct observation records positive learning evidence', () => {
  const { controller, evidence } = createController();
  controller.start('acid');
  const session = controller.observe('solution changes color');
  assert.equal(session.lastValidation.valid, true);
  assert.deepEqual(evidence, [['acid-reaction', 1, 0.2]]);
});

test('incorrect observation records negative learning evidence', () => {
  const { controller, evidence } = createController();
  controller.start('acid');
  const session = controller.observe('nothing happened');
  assert.equal(session.lastValidation.valid, false);
  assert.deepEqual(evidence, [['acid-reaction', 0, 0.2]]);
});

test('blank observation is normalized but records no mastery evidence', () => {
  const { controller, evidence } = createController();
  controller.start('acid');
  const session = controller.observe('   ');
  assert.equal(session.observations[0].observation, '');
  assert.equal(session.lastValidation.valid, false);
  // An empty submission means "not recorded yet" — it must not be scored as
  // wrong evidence, and it must not hijack the lesson phase.
  assert.deepEqual(evidence, []);
});
