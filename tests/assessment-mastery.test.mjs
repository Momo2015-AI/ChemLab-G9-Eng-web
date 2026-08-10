import test from 'node:test';
import assert from 'node:assert/strict';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { MasteryService } from '../app/mastery-service.js';

function createAssessment() {
  return {
    start(questions) {
      this.questions = questions;
      this.index = 0;
      this.answers = [];
      return { questions, index: 0, answers: this.answers };
    },
    evaluate(question, answer) {
      return question.answer === answer;
    },
  };
}

test('assessment answer updates canonical mastery state', () => {
  const masteryService = new MasteryService();
  const state = { progress: { mastery: {} } };
  const contentService = {
    getQuestion() {
      return null;
    },
  };
  const assessment = createAssessment();
  const controller = new AssessmentController({ assessment, contentService, state, masteryService });

  controller.start([
    { id: 'q1', knowledgeId: 'oxygen-properties', answer: 'A' },
  ]);

  const result = controller.answer('A');

  assert.equal(result.correct, true);
  assert.ok(result.mastery);
  assert.equal(result.mastery.knowledgeId, 'oxygen-properties');
  assert.equal(result.mastery.score, 1);
  assert.equal(result.mastery.mastery, 0.25);
  assert.equal(state.progress.mastery['oxygen-properties'], 0.25);
});

test('incorrect assessment evidence reaches mastery engine', () => {
  const masteryService = new MasteryService();
  const state = { progress: { mastery: { 'oxygen-properties': 1 } } };
  masteryService.hydrate(state.progress.mastery);

  const assessment = createAssessment();
  const controller = new AssessmentController({
    assessment,
    contentService: {},
    state,
    masteryService,
  });

  controller.start([
    { id: 'q1', knowledgeId: 'oxygen-properties', answer: 'A' },
  ]);

  const result = controller.answer('B');

  assert.equal(result.correct, false);
  assert.equal(result.mastery.knowledgeId, 'oxygen-properties');
  assert.equal(result.mastery.mastery, 0.75);
  assert.equal(state.progress.mastery['oxygen-properties'], 0.75);
});
