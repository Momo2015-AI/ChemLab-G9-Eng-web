/**
 * V1.7 Assessment Controller
 * Owns quiz session state and delegates answer evaluation to the domain engine.
 */
import { diagnoseAssessment } from '../core/diagnosis/diagnosis-engine.js';

export class AssessmentController {
  constructor({ assessment, contentService, state, masteryService = null, learningController = null }) {
    this.assessment = assessment;
    this.contentService = contentService;
    this.state = state;
    this.masteryService = masteryService;
    this.learningController = learningController;
    this.session = null;

    if (this.masteryService) {
      this.masteryService.hydrate(this.state.progress?.mastery || {});
    }
  }

  async start(dayId) {
    const day = await this.contentService.getLesson(dayId);
    if (!day) return null;
    const data = await this.contentService.load();
    const questions = (day.questions || []).map(id => data.questionById.get(id) || null).filter(Boolean);
    return this.createSession(dayId, questions);
  }

  async startTargeted(knowledgeIds, limit = 5) {
    const ids = Array.isArray(knowledgeIds) ? knowledgeIds.filter(Boolean) : [knowledgeIds].filter(Boolean);
    if (!ids.length) return null;
    const data = await this.contentService.load();
    const wanted = new Set(ids);
    const questions = data.questions.filter(question => {
      const points = question.knowledgeIds || question.knowledgePoints || question.knowledgeId || question.knowledge || [];
      const values = Array.isArray(points) ? points : [points];
      return values.some(id => wanted.has(id));
    }).slice(0, limit);
    if (!questions.length) return null;
    this.state.learning ||= {};
    this.state.learning.recheck = { knowledgeIds: ids, questionCount: questions.length };
    this.state.save?.();
    return this.createSession('remediation-recheck', questions);
  }

  createSession(dayId, questions) {
    this.session = { dayId, questions, index: 0, answers: [], completed: questions.length === 0 };
    this.state.currentQuiz = dayId;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
    return this.session;
  }

  answer(optionIndex) {
    if (!this.session || this.session.completed) return null;
    const question = this.session.questions[this.session.index];
    if (!question) return null;
    const answer = this.toDomainAnswer(question, optionIndex);
    const result = this.assessment.evaluate(question, answer);
    const diagnosis = diagnoseAssessment(question.id, result);

    this.session.answers.push({ questionId: question.id, selected: optionIndex, answer, ...result, diagnosis });
    this.recordMasteryEvidence(question, result);
    this.recordDiagnosisEvidence(diagnosis);

    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    this.state.quizIndex = this.session.index;
    this.state.quizAnswers[question.id] = answer;

    if (this.session.completed) {
      this.state.save?.();
    }
    return result;
  }

  recordDiagnosisEvidence(diagnosis) {
    this.state.learning ||= {};
    this.state.learning.diagnosis = diagnosis;

    if (diagnosis?.status === 'incorrect' && this.learningController) {
      this.learningController.getRemediationPlan(diagnosis);
    } else if (diagnosis?.status === 'correct') {
      this.state.learning.remediation = null;
    }

    this.state.save?.();
    return diagnosis;
  }

  recordMasteryEvidence(question, result) {
    if (!this.masteryService) return null;
    const knowledgeIds = this.getKnowledgeIds(question);
    const score = result?.correct ? 1 : 0;
    const weight = Number.isFinite(question?.masteryWeight) ? question.masteryWeight : 0.25;
    for (const knowledgeId of knowledgeIds) this.masteryService.recordEvidence(knowledgeId, score, weight);
    this.state.progress.mastery = this.masteryService.getState();
    return this.state.progress.mastery;
  }

  getKnowledgeIds(question) {
    const ids = question?.knowledgeIds || question?.knowledgePoints || question?.knowledgeId || question?.knowledge;
    if (Array.isArray(ids)) return ids.filter(Boolean);
    if (ids) return [ids];
    return [];
  }

  toDomainAnswer(question, optionIndex) {
    if (question.type !== 'choice') return optionIndex;
    return String.fromCharCode(65 + Number(optionIndex));
  }

  getScore() {
    const answers = this.session?.answers || [];
    if (!answers.length) return 0;
    return Math.round(answers.filter(a => a.correct).length / answers.length * 100);
  }

  reset() {
    this.session = null;
    this.state.currentQuiz = null;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
  }
}
