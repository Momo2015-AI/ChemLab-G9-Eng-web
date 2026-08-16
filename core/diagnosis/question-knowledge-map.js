// Question Knowledge Map
// Maps questions to chemistry knowledge nodes and owns the single shared
// knowledge-id extractor used across services, controllers and policies.

const questionMap = {};

/**
 * Canonical knowledge-id extraction. Questions arrive from several content
 * generations that name the field differently (knowledgeIds / knowledgePoints /
 * knowledgePoint / knowledgeId / knowledge); normalize once, here.
 */
export function knowledgeIdsOf(question, fallback = []) {
  const raw = question?.knowledgeIds
    ?? question?.knowledgePoints
    ?? question?.knowledgePoint
    ?? question?.knowledgeId
    ?? question?.knowledge
    ?? [];
  const values = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
  return values.length ? values : (Array.isArray(fallback) ? fallback : []);
}

export function registerQuestion(questionId, data) {
  questionMap[questionId] = {
    ...data,
    knowledge: data.knowledge || [],
    errors: data.errors || []
  };
}

export function getQuestionKnowledge(questionId) {
  return questionMap[questionId] || null;
}

export default questionMap;
