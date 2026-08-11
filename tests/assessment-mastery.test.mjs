import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { MasteryService } from '../app/mastery-service.js';

function createAssessment() {
  return {
    evaluate(question, answer) {
      return { correct: question.answer === answer };
    },
  };
}

function createController(initialMastery = {}) {
  const masteryService = new MasteryService();
  const state = { progress: { mastery: initialMastery } };
  masteryService.hydrate(state.progress.mastery);
  const assessment = createAssessment();
  const controller = new AssessmentController({
    assessment,
    contentService: {},
    state,
    masteryService,
  });

  controller.createSession('test-day', [
    { id: 'q1', type: 'choice', knowledgeId: 'oxygen-properties', answer: 'A' },
  ]);

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
