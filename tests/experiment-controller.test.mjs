import test from 'node:test';
import assert from 'node:assert/strict';
import { ExperimentController } from '../controllers/experiment-controller.js';

function createController(withMastery = false, learningController = null) {
  const experiments = {
    acid: {
      id: 'acid',
      title: 'Acid observation',
      lessonId: 'L1',
      knowledgeId: 'acid-reaction',
      steps: [
        { id: 's1', observation: 'solution changes color' },
        { id: 's2', observation: 'gas appears' },
      ],
    },
  };
  const engine = new (class {
    constructor() { this.delegate = experiments; }
    get(id) { return this.delegate[id] || null; }
    start(id) {
      const exp = this.get(id);
      return exp ? { id: exp.id, title: exp.title, lessonId: exp.lessonId, knowledgeId: exp.knowledgeId, currentStep: 0, steps: exp.steps, observations: [], completed: false } : null;
    }
    next(session) { return { ...session, currentStep: Math.min(session.currentStep + 1, session.steps.length - 1) }; }
    validateStep(session, text) {
      const expected = session.steps[session.currentStep]?.observation;
      return { valid: String(text).trim() === expected };
    }
    recordObservation(session, text) {
      return { ...session, observations: [...session.observations, { step: session.currentStep, observation: String(text) }] };
    }
    complete(session) { return { ...session, completed: true }; }
  })();
  const masteryService = withMastery ? {
    evidence: [],
    recordEvidence(...args) { this.evidence.push(args); },
  } : null;
  return {
    controller: new ExperimentController({ experimentEngine: engine, state: { progress: {} }, masteryService, learningController }),
    masteryService,
  };
}

function learningMock() {
  const lessons = {};
  return {
    lessons,
    getLessonState(id) { return lessons[id] || {}; },
    updateLessonState(id, patch) { lessons[id] = { ...(lessons[id] || {}), ...patch }; },
  };
}

test('experiment controller starts a valid session', () => {
  const { controller } = createController();
  const result = controller.start('acid');
  assert.equal(result.experiment.id, 'acid');
  assert.equal(result.session.currentStep, 0);
  assert.equal(result.session.completed, false);
});

test('experiment controller advances and records observations', () => {
  const { controller } = createController();
  controller.start('acid');
  controller.observe('solution changes color');
  controller.next();
  controller.observe('gas appears');

  assert.equal(controller.session.currentStep, 1);
  assert.equal(controller.session.observations.length, 2);
  assert.equal(controller.session.observations[1].step, 1);
  assert.equal(controller.session.lastValidation.valid, true);
});

test('experiment observations produce mastery evidence', () => {
  const { controller, masteryService } = createController(true);
  controller.start('acid');
  controller.observe('solution changes color');
  assert.deepEqual(masteryService.evidence, [['acid-reaction', 1, 0.2]]);
});

test('experiment controller completes and resets safely', () => {
  const { controller } = createController();
  controller.start('acid');
  const completed = controller.complete();
  assert.equal(completed.completed, true);
  assert.equal(controller.complete().completed, true);
  controller.reset();
  assert.equal(controller.session, null);
  assert.equal(controller.next(), null);
  assert.equal(controller.observe('anything'), null);
});

test('too-short observation neither latches invalid state nor produces evidence', () => {
  const { controller, masteryService } = createController(true);
  controller.start('acid');
  controller.observe('水');
  assert.equal(controller.session.hadInvalidObservation, undefined);
  assert.equal(controller.session.observations.length, 1);
  assert.equal(masteryService.evidence.length, 0);
});

test('short observation completes into PRACTICE, not REMEDIATION', () => {
  const learning = learningMock();
  const { controller } = createController(false, learning);
  controller.start('acid');
  controller.observe('水');
  controller.complete();
  assert.equal(learning.lessons.L1.phase, 'PRACTICE');
});

test('substantive-but-invalid observation completes into REMEDIATION', () => {
  const learning = learningMock();
  const { controller } = createController(false, learning);
  controller.start('acid');
  controller.observe('color');
  controller.complete();
  assert.equal(learning.lessons.L1.phase, 'REMEDIATION');
});

test('experiment observation does not overwrite existing practice diagnosis', () => {
  const learning = learningMock();
  learning.lessons.L1 = {
    diagnosis: { lessonId: 'L1', errors: [{ questionId: 'Q1' }], weakPoints: ['acid-reaction'] },
  };
  const { controller } = createController(false, learning);
  controller.start('acid');
  controller.observe('solution changes color');
  assert.equal(learning.lessons.L1.diagnosis.errors.length, 1);
  assert.deepEqual(learning.lessons.L1.diagnosis.weakPoints, ['acid-reaction']);
});

test('experiment observation records diagnosis when no practice diagnosis exists', () => {
  const learning = learningMock();
  const { controller } = createController(false, learning);
  controller.start('acid');
  controller.observe('solution changes color');
  assert.ok(learning.lessons.L1.diagnosis);
  assert.equal(learning.lessons.L1.diagnosis.lessonId, 'L1');
});
