/**
 * V1.7 Assessment Controller
 * Owns quiz session state and delegates answer evaluation to the domain engine.
 */
export class AssessmentController {
  constructor({ assessment, contentService, state }) {
    this.assessment = assessment;
    this.contentService = contentService;
    this.state = state;
    this.session = null;
  }

  async start(dayId) {
    const day = await this.contentService.getLesson(dayId);
    if (!day) return null;
    const data = await this.contentService.load();
    const questions = (day.questions || [])
      .map(id => data.questionById.get(id) || null)
      .filter(Boolean);
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
    const result = this.assessment.evaluate(question, optionIndex);
    this.session.answers.push({ questionId: question.id, selected: optionIndex, ...result });
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    this.state.quizIndex = this.session.index;
    this.state.quizAnswers[question.id] = optionIndex;
    if (this.session.completed) this.state.save?.();
    return result;
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
