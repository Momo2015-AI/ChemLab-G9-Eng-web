import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { MasteryService } from '../app/mastery-service.js';

function createController(initialMastery = {}) {
  const masteryService = new MasteryService();
  const state = { progress: { mastery: initialMastery }, learning: {}, save() {} };
  masteryService.hydrate(state.progress.mastery);
  const assessment = {
    evaluate(question, answer) {
      return { correct: question.answer === answer };
    },
  };
  const controller = new AssessmentRuntimeController({
    assessment,
    contentService: {},
    state,
    masteryService,
  });

  controller.startAttempt('test-day', [
    { id: 'q1', type: 'choice', options: ['x', 'y'], answer: 'A', knowledgeIds: ['oxygen-properties'] },
  ], 'practice');

  return { controller, state };
}

test('assessment answer updates canonical mastery state', () => {
  const { controller, state } = createController();

  const result = controller.answer(0);

  assert.equal(result.correct, true);
  assert.equal(state.progress.mastery['oxygen-properties'], 0.25);
});

test('incorrect assessment evidence reaches mastery engine', () => {
  const { controller, state } = createController({ 'oxygen-properties': 1 });

  const result = controller.answer(1);

  assert.equal(result.correct, false);
  assert.equal(state.progress.mastery['oxygen-properties'], 0.75);
});
