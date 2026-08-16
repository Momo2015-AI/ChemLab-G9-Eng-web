import test from 'node:test';
import assert from 'node:assert/strict';
import ContentService from '../app/content-service.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { diagnoseAssessment } from '../core/diagnosis/diagnosis-engine.js';
import { createRemediationCatalog } from '../core/diagnosis/remediation-catalog.js';
import { registerQuestion } from '../core/diagnosis/question-knowledge-map.js';

function fakeContentLoader() {
  return {
    async loadAll() {
      return {
        questions: [
          { id: 'q1', knowledge: ['k1'], commonMistake: 'concept-confusion' },
        ],
        questionById: new Map(),
        knowledgeGraph: {
          nodes: [
            { id: 'k0', name: 'Prerequisite' },
            { id: 'k1', name: 'Knowledge 1' },
          ],
          edges: [{ from: 'k0', to: 'k1', type: 'prerequisite' }],
        },
        manifest: { days: [] },
        days: [],
        dayById: new Map(),
      };
    },
  };
}

test('production content boundary normalizes legacy graph edges and registers question mappings', async () => {
  const service = new ContentService(fakeContentLoader());
  const data = await service.load();
  const engine = await service.getKnowledgeEngine();

  assert.deepEqual(data.knowledgeGraph.relations, [
    { from: 'k0', to: 'k1', type: 'prerequisite', source: 'k0', target: 'k1' },
  ]);
  assert.equal(engine.prerequisites('k1')[0].id, 'k0');
  assert.deepEqual(diagnoseAssessment('q1', { correct: false }), {
    status: 'incorrect',
    knowledge: ['k1'],
    possibleErrors: ['concept-confusion'],
    recommendation: 'review-and-practice',
  });
});

test('assessment production flow stores diagnosis and creates remediation', () => {
  const state = { progress: { mastery: {} }, learning: {}, save() {} };
  const remediation = { status: 'needs-remediation', steps: [{ type: 'review', knowledgeId: 'k1' }] };
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
    getRemediationPlan(diagnosis) {
      assert.equal(diagnosis.status, 'incorrect');
      state.learning.remediation = remediation;
      return remediation;
    },
  };
  const controller = new AssessmentRuntimeController({
    assessment: { evaluate: () => ({ correct: false }) },
    contentService: {},
    state,
    learningController,
  });

  registerQuestion('q-production', { knowledge: ['k1'], errors: ['concept-confusion'] });
  controller.startAttempt('day-01', [{ id: 'q-production', type: 'choice', options: ['x', 'y'], answer: 'A', knowledge: ['k1'] }], 'practice');
  controller.answer(0);

  assert.equal(state.learning.lessons['day-01'].diagnosis.status, 'incorrect');
  assert.equal(state.learning.remediation.status, 'needs-remediation');
});

test('experiment production flow preserves multi-knowledge evidence', () => {
  const evidence = [];
  const state = { progress: { mastery: {} }, learning: {}, save() {} };
  const masteryService = {
    recordEvidence(id, score, weight) { evidence.push({ id, score, weight }); },
    getState() { return { k1: 0.2, k2: 0.2 }; },
  };
  const experimentEngine = {
    get: () => ({ id: 'exp-1', lessonId: 'exp-1', title: 'Experiment', knowledge: ['k1', 'k2'], steps: [{ observation: 'blue' }] }),
    start: () => ({ id: 'exp-1', currentStep: 0, steps: [{ observation: 'blue' }], observations: [], completed: false }),
    validateStep: () => ({ valid: false, message: 'wrong observation' }),
    recordObservation: (session, observation) => ({ ...session, observations: [{ step: 0, observation }] }),
    next: session => session,
    complete: session => ({ ...session, completed: true }),
  };
  const learningController = {
    getLessonState() { return {}; },
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getRemediationPlan: () => ({ status: 'needs-remediation', steps: [] }),
  };
  const controller = new ExperimentController({ experimentEngine, state, masteryService, learningController });

  controller.start('exp-1');
  controller.observe('red');

  assert.deepEqual(evidence.map(item => item.id), ['k1', 'k2']);
  assert.deepEqual(state.learning.lessons['exp-1'].diagnosis.knowledge, ['k1', 'k2']);
});

test('remediation catalog is derived from canonical content rather than a second hard-coded source', () => {
  const catalog = createRemediationCatalog({
    questions: [{ id: 'q-k1', knowledge: ['k1'] }],
    knowledgeGraph: { nodes: [{ id: 'k1' }, { id: 'k2' }] },
  });

  assert.deepEqual(catalog, {
    k1: { reviewId: 'k1', practiceId: 'q-k1' },
    k2: { reviewId: 'k2', practiceId: null },
  });
});
