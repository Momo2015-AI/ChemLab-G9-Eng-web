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

    const questions = (day.questions || [])
      .map(id => this.state.questionById?.get(id) || null)
      .filter(Boolean);

    this.session = {
      dayId,
      questions,
      index: 0,
      answers: [],
      completed: false,
    };
    return this.session;
  }

  answer(optionIndex) {
    if (!this.session || this.session.completed) return null;
    const question = this.session.questions[this.session.index];
    if (!question) return null;

    const result = this.assessment.evaluate(question, optionIndex);
    this.session.answers.push({
      questionId: question.id,
      selected: optionIndex,
      ...result,
    });
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    return result;
  }

  getScore() {
    const answers = this.session?.answers || [];
    if (!answers.length) return 0;
    return Math.round(answers.filter(a => a.correct).length / answers.length * 100);
  }

  reset() {
    this.session = null;
  }
}
