/**
 * V1.7 canonical diagnosis engine.
 *
 * Converts learning evidence into one stable diagnosis contract. UI and
 * controllers must not implement diagnosis policy themselves.
 */
import { getQuestionKnowledge } from './question-knowledge-map.js';

export function diagnose(questionId, answerResult) {
  const question = getQuestionKnowledge(questionId);

  if (!question) {
    return {
      status: 'unknown',
      message: 'Question mapping not found',
    };
  }

  if (answerResult?.correct) {
    return {
      status: 'correct',
      recommendation: 'continue',
    };
  }

  return {
    status: 'incorrect',
    knowledge: [...question.knowledge],
    possibleErrors: [...question.errors],
    recommendation: 'review-and-practice',
  };
}

export function diagnoseAssessment(questionId, result) {
  return diagnose(questionId, {
    correct: Boolean(result?.correct),
    source: 'assessment',
  });
}

export function diagnoseExperiment({ knowledgeIds, knowledgeId, validation } = {}) {
  const ids = Array.isArray(knowledgeIds)
    ? knowledgeIds.filter(Boolean)
    : [knowledgeId].filter(Boolean);

  if (!ids.length) {
    return { status: 'unknown', message: 'Knowledge mapping not found' };
  }

  if (validation?.valid) {
    return {
      status: 'correct',
      knowledge: ids,
      recommendation: 'continue',
      source: 'experiment',
    };
  }

  const error = validation?.errors || validation?.message;
  return {
    status: 'incorrect',
    knowledge: ids,
    possibleErrors: error ? [error] : [],
    recommendation: 'review-and-practice',
    source: 'experiment',
  };
}
