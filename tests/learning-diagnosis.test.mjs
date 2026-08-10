import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnoseAssessment, diagnoseExperiment } from '../core/diagnosis/learning-diagnosis.js';
import { registerQuestion } from '../core/diagnosis/question-knowledge-map.js';

registerQuestion('q-acid', {
  knowledge: ['acid-base'],
  errors: ['confuses indicator color change'],
});

test('assessment evidence enters the diagnosis engine', () => {
  assert.deepEqual(diagnoseAssessment('q-acid', { correct: true }), {
    status: 'correct',
    recommendation: 'continue',
  });

  const result = diagnoseAssessment('q-acid', { correct: false });
  assert.equal(result.status, 'incorrect');
  assert.deepEqual(result.knowledge, ['acid-base']);
});

test('experiment validation uses the same diagnosis contract', () => {
  assert.deepEqual(diagnoseExperiment({
    knowledgeId: 'acid-base',
    validation: { valid: true },
  }), {
    status: 'correct',
    knowledge: ['acid-base'],
    recommendation: 'continue',
    source: 'experiment',
  });

  const result = diagnoseExperiment({
    knowledgeId: 'acid-base',
    validation: { valid: false, errors: 'wrong observation' },
  });
  assert.equal(result.status, 'incorrect');
  assert.deepEqual(result.knowledge, ['acid-base']);
  assert.deepEqual(result.possibleErrors, ['wrong observation']);
});
