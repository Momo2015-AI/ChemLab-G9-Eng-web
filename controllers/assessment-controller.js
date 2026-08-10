/**
 * V1.7 Assessment Controller
 * Owns quiz session state and delegates answer evaluation to the domain engine.
 */
export class AssessmentController {
  constructor({ assessment, contentService, state, masteryService }) {
    this.assessment = assessment;
    this.contentService = contentService;
    this.state = state;
    this.masteryService = masteryService;
    this.session = null;
  }

  async start(dayId) {
    const day = await this.contentService.getLesson(dayId);
    if (!day) return null;
    const data = await this.contentService.load();
    const questions = (day.questions || []).map(id => data.questionById.get(id) || null).filter(Boolean);
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
    this.session.answers.push({ questionId: question.id, selected: optionIndex, answer, ...result });
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    this.state.quizIndex = this.session.index;
    this.state.quizAnswers[question.id] = answer;
    // Push evidence into mastery engine so mastery score drifts toward correct answer
    for (const k of result.knowledge || []) {
      this.masteryService?.recordEvidence(k, result.score ?? (result.correct ? 1 : 0), 0.25);
    }
    if (this.session.completed) this.state.save?.();
    return result;
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

  async startByNode(nodeId) {
    const data = await this.contentService.load();
    const questions = data.questions.filter(q => (q.knowledge || q.knowledgePoints || []).includes(nodeId)).slice(0, 10);
    if (!questions.length) return null;
    this.session = { dayId: nodeId, questions, index: 0, answers: [], completed: false };
    this.state.currentQuiz = nodeId;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
    return this.session;
  }

  reset() {
    this.session = null;
    this.state.currentQuiz = null;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
  }
}
