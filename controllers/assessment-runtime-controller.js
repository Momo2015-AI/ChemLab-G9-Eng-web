import { diagnoseAssessment } from '../core/diagnosis/diagnosis-engine.js';

export class AssessmentRuntimeController {
  constructor({ assessment, contentService, state, masteryService = null, learningController = null }) {
    this.assessment = assessment;
    this.contentService = contentService;
    this.state = state;
    this.masteryService = masteryService;
    this.learningController = learningController;
    this.session = null;
    masteryService?.hydrate?.(state.progress?.mastery || {});
  }

  async startPractice(lessonId) {
    const lesson = await this.contentService.getLesson(lessonId);
    const data = await this.contentService.load();
    if (!lesson) return null;
    const questions = (lesson.questions || [])
      .map(item => data.questionById.get(item) || (typeof item === 'object' ? item : null))
      .filter(Boolean)
      .map(question => this.normalizeQuestion(question));
    return this.startAttempt(lessonId, questions, 'practice');
  }

  async startMastery(lessonId) {
    const data = await this.contentService.getMastery(lessonId);
    const questions = (data?.questions || []).map(question => this.normalizeQuestion(question));
    if (!questions.length) return null;
    this.state.learning ||= {};
    this.state.learning.mastery ||= {};
    this.state.learning.mastery[lessonId] = {
      ...(this.state.learning.mastery[lessonId] || {}),
      lessonId,
      status: 'in-progress',
      questionCount: questions.length,
      threshold: Number(data.threshold || .95),
    };
    this.state.save?.();
    return this.startAttempt(lessonId, questions, 'mastery');
  }

  async startRecheck(lessonId, knowledgeIds, limit = 5) {
    const ids = Array.isArray(knowledgeIds) ? knowledgeIds.filter(Boolean) : [knowledgeIds].filter(Boolean);
    if (!ids.length) return null;
    const data = await this.contentService.load();
    const wanted = new Set(ids);
    const questions = data.questions
      .filter(question => this.knowledge(question).some(id => wanted.has(id)))
      .slice(0, limit)
      .map(question => this.normalizeQuestion(question));
    if (!questions.length) return null;
    this.state.learning ||= {};
    this.state.learning.recheck = {
      lessonId,
      knowledgeIds: ids,
      status: 'in-progress',
      questionCount: questions.length,
    };
    this.state.save?.();
    return this.startAttempt(lessonId, questions, 'recheck');
  }

  startAttempt(lessonId, questions, mode) {
    const attemptId = `${lessonId}:${mode}:${Date.now()}`;
    this.session = {
      attemptId,
      lessonId,
      dayId: lessonId,
      mode,
      questions,
      index: 0,
      answers: [],
      completed: questions.length === 0,
      startedAt: new Date().toISOString(),
    };
    this.state.currentQuiz = attemptId;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
    return this.session;
  }

  hasSession(lessonId, mode) {
    return Boolean(this.session && this.session.lessonId === lessonId && this.session.mode === mode);
  }

  answer(value) {
    if (!this.session || this.session.completed) return null;
    const question = this.session.questions[this.session.index];
    if (!question) return null;

    const answer = this.toDomainAnswer(question, value);
    const evaluationQuestion = this.withNormalizedAnswerKey(question);
    const evaluated = this.assessment.evaluate(evaluationQuestion, answer);
    const diagnosis = diagnoseAssessment(question.id, evaluated);
    const knowledgeIds = this.knowledge(question);

    this.session.answers.push({
      questionId: question.id,
      selectedIndex: typeof value === 'number' ? value : null,
      answer,
      correct: evaluated.correct,
      score: evaluated.score,
      explanation: evaluated.explanation,
      diagnosis,
      question,
    });
    this.recordEvidence(knowledgeIds, evaluated, question);
    this.state.quizAnswers[question.id] = answer;
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    this.state.quizIndex = this.session.index;
    if (this.session.completed) this.finish();
    else this.state.save?.();
    return evaluated;
  }

  recordEvidence(knowledgeIds, result, question = {}) {
    if (!this.masteryService) return null;
    const score = result?.correct ? 1 : 0;
    const weight = Number.isFinite(question?.masteryWeight) ? question.masteryWeight : 0.25;
    for (const knowledgeId of knowledgeIds) {
      this.masteryService.recordEvidence(knowledgeId, score, weight);
    }
    this.state.progress ||= {};
    this.state.progress.mastery = this.masteryService.getState();
    return this.state.progress.mastery;
  }

  finish() {
    const correct = this.session.answers.filter(answer => answer.correct).length;
    const total = this.session.answers.length;
    const score = total ? correct / total : 0;
    this.state.progress ||= {};
    this.state.progress.history ||= [];
    this.state.progress.history.push({
      attemptId: this.session.attemptId,
      lessonId: this.session.lessonId,
      mode: this.session.mode,
      score,
      correct,
      total,
      completedAt: new Date().toISOString(),
    });
    if (this.session.mode === 'practice') this.finishPractice(correct, total, score);
    if (this.session.mode === 'recheck') this.finishRecheck(correct, total, score);
    if (this.session.mode === 'mastery') this.finishMastery(correct, total, score);
    this.state.save?.();
  }

  finishPractice(correct, total, score) {
    const errors = this.session.answers
      .filter(answer => !answer.correct)
      .map(answer => ({
        questionId: answer.questionId,
        knowledgeIds: this.knowledge(answer.question),
        selectedIndex: answer.selectedIndex,
        explanation: answer.explanation || '',
        possibleErrors: answer.diagnosis?.possibleErrors || [],
      }));
    const weakPoints = [...new Set(errors.flatMap(error => error.knowledgeIds))];
    const possibleErrors = [...new Set(errors.flatMap(error => error.possibleErrors))];
    const diagnosis = {
      lessonId: this.session.lessonId,
      attemptId: this.session.attemptId,
      status: errors.length ? 'incorrect' : 'correct',
      needsRemediation: errors.length > 0,
      errors,
      weakPoints,
      possibleErrors,
      correct,
      total,
      score,
      completedAt: new Date().toISOString(),
    };
    this.state.learning ||= {};
    this.state.learning.practice = { lessonId: this.session.lessonId, attemptId: this.session.attemptId, correct, total, score, completedAt: diagnosis.completedAt };
    this.state.learning.diagnosis = diagnosis;
    if (errors.length) {
      this.learningController?.getRemediationPlan({ status: 'incorrect', knowledge: weakPoints, possibleErrors, source: 'practice-attempt' });
    } else {
      this.state.learning.remediation = null;
    }
  }

  finishRecheck(correct, total, score) {
    const passed = total > 0 && correct === total;
    this.state.learning ||= {};
    this.state.learning.recheck = {
      ...(this.state.learning.recheck || {}),
      lessonId: this.session.lessonId,
      attemptId: this.session.attemptId,
      status: passed ? 'passed' : 'failed',
      correct,
      total,
      score,
      completedAt: new Date().toISOString(),
    };
    if (passed) this.state.learning.remediation = null;
  }

  finishMastery(correct, total, score) {
    const lessonId = this.session.lessonId;
    const existing = this.state.learning?.mastery?.[lessonId] || {};
    const threshold = Number(existing.threshold || .95);
    const passed = total > 0 && score >= threshold;
    this.state.learning ||= {};
    this.state.learning.mastery ||= {};
    this.state.learning.mastery[lessonId] = {
      ...existing,
      lessonId,
      attemptId: this.session.attemptId,
      status: passed ? 'passed' : 'needs-remediation',
      correct,
      total,
      score,
      threshold,
      completedAt: new Date().toISOString(),
    };
    this.state.progress.lessonMastery ||= {};
    this.state.progress.lessonMastery[lessonId] = passed;
    if (passed) this.state.learning.remediation = null;
  }

  knowledge(question) {
    const raw = question?.knowledgeIds || question?.knowledgePoints || question?.knowledgePoint || question?.knowledgeId || question?.knowledge || [];
    return (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
  }

  normalizeQuestion(question = {}) {
    const options = question.options || question.o || [];
    const rawAnswer = question.correctIndex ?? question.answer ?? question.correctAnswer ?? question.correctOption ?? question.correct ?? question.a;
    const isChoice = Array.isArray(options) && options.length > 0 && question.type !== 'constructed';
    if (isChoice) {
      return {
        ...question,
        type: 'choice',
        options: options.map(option => typeof option === 'object' ? option.text ?? option.label ?? '' : option),
        correctIndex: this.toIndex(rawAnswer),
        answer: this.toLetter(this.toIndex(rawAnswer)),
        knowledgeIds: this.knowledge(question),
      };
    }
    return { ...question, type: question.type || 'short-answer', answer: rawAnswer, knowledgeIds: this.knowledge(question) };
  }

  withNormalizedAnswerKey(question) {
    return question.type === 'choice'
      ? { ...question, answer: this.toLetter(question.correctIndex ?? this.toIndex(question.answer)) }
      : question;
  }

  toIndex(value) {
    if (Number.isInteger(value)) return Math.max(0, value);
    const text = String(value ?? '').trim().toUpperCase();
    if (/^[A-Z]$/.test(text)) return text.charCodeAt(0) - 65;
    if (/^\d+$/.test(text)) return Number(text);
    return 0;
  }

  toLetter(index) { return String.fromCharCode(65 + Number(index)); }

  toDomainAnswer(question, value) {
    return question.type === 'choice' ? this.toLetter(value) : value;
  }

  getScore() {
    const answers = this.session?.answers || [];
    return answers.length ? Math.round(answers.filter(answer => answer.correct).length / answers.length * 100) : 0;
  }

  reset() {
    this.session = null;
    this.state.currentQuiz = null;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
  }
}
