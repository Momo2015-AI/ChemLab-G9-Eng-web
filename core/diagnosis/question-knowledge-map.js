// Question Knowledge Map
// Maps questions to chemistry knowledge nodes

const questionMap = {};

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
