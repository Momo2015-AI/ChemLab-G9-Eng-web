import { knowledgeIdsOf } from '../diagnosis/question-knowledge-map.js';
import { resolveMisconceptionId } from '../../content/misconceptions/canonical-misconceptions.js';

const knowledgeIds = question => knowledgeIdsOf(question);

function misconceptionIds(question = {}) {
  const raw = question.misconceptionIds || question.misconception || question.errorType || [];
  return (Array.isArray(raw) ? raw : [raw])
    .filter(Boolean)
    .map(id => resolveMisconceptionId(id));
}

export function evaluateMastery({ questions = [], answers = [], threshold = 0.95, requiredKnowledgeIds = [], criticalMisconceptions = [], requireConstructed = false } = {}) {
  const passedAnswer = answer => Boolean(answer?.correct || answer?.rubricPassed);
  const correct = answers.filter(passedAnswer).length;
  const total = answers.length;
  const score = total ? correct / total : 0;
  const expectedKnowledge = new Set((requiredKnowledgeIds.length ? requiredKnowledgeIds : questions.flatMap(knowledgeIds)).filter(Boolean));
  const correctKnowledge = new Set(answers.filter(passedAnswer).flatMap(answer => knowledgeIds(answer.question)));
  const uncoveredKnowledge = [...expectedKnowledge].filter(id => !correctKnowledge.has(id));
  const critical = new Set((criticalMisconceptions || []).map(id => resolveMisconceptionId(id)));
  const unclearedMisconceptions = [...new Set(answers.filter(answer => !passedAnswer(answer)).flatMap(answer => misconceptionIds(answer.question)).filter(id => critical.has(id)))];
  const constructedQuestions = questions.filter(question => question.type === 'constructed');
  const constructedAnswers = answers.filter(answer => answer.question?.type === 'constructed');
  const constructedPassed = !requireConstructed || (constructedQuestions.length > 0 && constructedQuestions.every(question => constructedAnswers.some(answer => (answer.questionId === question.id || answer.question?.id === question.id) && (answer.rubricPassed || answer.correct))));
  const scorePassed = total > 0 && score >= Number(threshold || 0.95);
  const coveragePassed = uncoveredKnowledge.length === 0;
  const misconceptionsPassed = unclearedMisconceptions.length === 0;

  return {
    passed: scorePassed && coveragePassed && misconceptionsPassed && constructedPassed,
    score,
    correct,
    total,
    threshold: Number(threshold || 0.95),
    scorePassed,
    coveragePassed,
    coveredKnowledge: [...correctKnowledge],
    uncoveredKnowledge,
    misconceptionsPassed,
    unclearedMisconceptions,
    constructedPassed,
  };
}
