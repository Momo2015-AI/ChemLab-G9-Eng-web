/**
 * V1.7 Learning Diagnosis adapter.
 * Normalizes learning evidence from assessments and experiments into the
 * existing diagnosis engine without coupling the engine to UI controllers.
 */
import { diagnose } from './diagnosis-engine.js';

export function diagnoseAssessment(questionId, result) {
  return diagnose(questionId, {
    correct: Boolean(result?.correct),
    source: 'assessment',
  });
}

export function diagnoseExperiment({ knowledgeId, validation }) {
  if (!knowledgeId) {
    return { status: 'unknown', message: 'Knowledge mapping not found' };
  }

  if (validation?.valid) {
    return { status: 'correct', knowledge: [knowledgeId], recommendation: 'continue', source: 'experiment' };
  }

  return {
    status: 'incorrect',
    knowledge: [knowledgeId],
    possibleErrors: validation?.errors || validation?.message ? [validation.errors || validation.message] : [],
    recommendation: 'review-and-practice',
    source: 'experiment',
  };
}
