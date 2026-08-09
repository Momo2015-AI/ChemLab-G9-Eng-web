// Diagnosis Engine
// V1.7 Phase 6 foundation

import { getQuestionKnowledge } from './question-knowledge-map.js';

export function diagnose(questionId, answerResult) {
  const question = getQuestionKnowledge(questionId);

  if (!question) {
    return {
      status: 'unknown',
      message: 'Question mapping not found'
    };
  }

  if (answerResult.correct) {
    return {
      status: 'correct',
      recommendation: 'continue'
    };
  }

  return {
    status: 'incorrect',
    knowledge: question.knowledge,
    possibleErrors: question.errors,
    recommendation: 'review-and-practice'
  };
}
