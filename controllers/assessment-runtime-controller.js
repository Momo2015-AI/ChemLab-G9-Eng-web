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
    const questions = (lesson.questions || []).map(x => data.questionById.get(x) || (typeof x === 'object' ? x : null)).filter(Boolean);
    return this.startAttempt(lessonId, questions, 'practice');
  }

  async startMastery(lessonId) {
    const data = await this.contentService.getMastery(lessonId);
    const questions = (data?.questions || []).map(q => this.normalizeQuestion(q));
    if (!questions.length) return null;
    this.state.learning ||= {};
    this.state.learning.mastery ||= {};
    this.state.learning.mastery[lessonId] = { ...(this.state.learning.mastery[lessonId] || {}), lessonId, status: 'in-progress', questionCount: questions.length, threshold: Number(data.threshold || .95) };
    this.state.save?.();
    return this.startAttempt(lessonId, questions, 'mastery');
  }

  async startRecheck(lessonId, knowledgeIds, limit = 5) {
    const ids = Array.isArray(knowledgeIds) ? knowledgeIds.filter(Boolean) : [knowledgeIds].filter(Boolean);
    if (!ids.length) return null;
    const data = await this.contentService.load();
    const wanted = new Set(ids);
    const questions = data.questions.filter(q => {
      const raw = q.knowledgeIds || q.knowledgePoints || q.knowledgeId || q.knowledge || [];
      return (Array.isArray(raw) ? raw : [raw]).some(id => wanted.has(id));
    }).slice(0, limit).map(q => this.normalizeQuestion(q));
    if (!questions.length) return null;
    this.state.learning ||= {};
    this.state.learning.recheck = { lessonId, knowledgeIds: ids, status: 'in-progress', questionCount: questions.length };
    this.state.save?.();
    return this.startAttempt(lessonId, questions, 'recheck');
  }

  startAttempt(lessonId, questions, mode) {
    const attemptId = `${lessonId}:${mode}:${Date.now()}`;
    this.session = { attemptId, lessonId, mode, questions, index: 0, answers: [], completed: questions.length === 0, startedAt: new Date().toISOString() };
    this.state.currentQuiz = attemptId;
    this.state.quizIndex = 0;
    this.state.quizAnswers = {};
    return this.session;
  }

  hasSession(lessonId, mode) {
    return Boolean(this.session && this.session.lessonId === lessonId && this.session.mode === mode && !this.session.completed);
  }

  answer(selectedIndex) {
    if (!this.session || this.session.completed) return null;
    const q = this.session.questions[this.session.index];
    const answer = this.toLetter(selectedIndex);
    const correctIndex = this.toIndex(q.correctIndex ?? q.answer ?? q.correctAnswer ?? q.correctOption ?? q.correct);
    const evaluated = this.assessment.evaluate({ ...q, type: q.type || 'choice', answer: this.toLetter(correctIndex) }, answer);
    const diagnosis = diagnoseAssessment(q.id, evaluated);
    this.session.answers.push({ questionId: q.id, selectedIndex, answer, correct: evaluated.correct, score: evaluated.score, explanation: evaluated.explanation, diagnosis, question: q });
    this.state.quizAnswers[q.id] = selectedIndex;
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
    this.state.quizIndex = this.session.index;
    if (this.session.completed) this.finish();
    return evaluated;
  }

  finish() {
    const correct = this.session.answers.filter(a => a.correct).length;
    const total = this.session.answers.length;
    const score = total ? correct / total : 0;
    if (this.session.mode === 'practice') this.finishPractice(correct, total, score);
    if (this.session.mode === 'recheck') this.finishRecheck(correct, total, score);
    if (this.session.mode === 'mastery') this.finishMastery(correct, total, score);
    this.state.save?.();
  }

  finishPractice(correct, total, score) {
    const errors = this.session.answers.filter(a => !a.correct).map(a => ({ questionId: a.questionId, knowledgeIds: this.knowledge(a.question), selectedIndex: a.selectedIndex, explanation: a.explanation || '', possibleErrors: a.diagnosis?.possibleErrors || [] }));
    const weakPoints = [...new Set(errors.flatMap(e => e.knowledgeIds))];
    const possibleErrors = [...new Set(errors.flatMap(e => e.possibleErrors))];
    this.state.learning ||= {};
    this.state.learning.practice = { lessonId: this.session.lessonId, attemptId: this.session.attemptId, correct, total, score, completedAt: new Date().toISOString() };
    this.state.learning.diagnosis = { lessonId: this.session.lessonId, attemptId: this.session.attemptId, status: errors.length ? 'needs-remediation' : 'clear', errors, weakPoints, possibleErrors, correct, total, score, completedAt: new Date().toISOString() };
    if (errors.length) this.learningController?.getRemediationPlan({ status: 'incorrect', knowledge: weakPoints, possibleErrors, source: 'practice-attempt' });
    else this.state.learning.remediation = null;
  }

  finishRecheck(correct, total, score) {
    const passed = total > 0 && correct === total;
    this.state.learning ||= {};
    this.state.learning.recheck = { ...(this.state.learning.recheck || {}), lessonId: this.session.lessonId, attemptId: this.session.attemptId, status: passed ? 'passed' : 'failed', correct, total, score, completedAt: new Date().toISOString() };
    if (passed) this.state.learning.remediation = null;
  }

  finishMastery(correct, total, score) {
    const lessonId = this.session.lessonId;
    const existing = this.state.learning?.mastery?.[lessonId] || {};
    const threshold = Number(existing.threshold || .95);
    const passed = score >= threshold;
    this.state.learning ||= {};
    this.state.learning.mastery ||= {};
    this.state.learning.mastery[lessonId] = { ...existing, lessonId, attemptId: this.session.attemptId, status: passed ? 'passed' : 'needs-remediation', correct, total, score, threshold, completedAt: new Date().toISOString() };
    this.state.progress ||= {};
    this.state.progress.lessonMastery ||= {};
    this.state.progress.lessonMastery[lessonId] = passed;
    if (passed) this.state.learning.remediation = null;
  }

  knowledge(q) {
    const raw = q?.knowledgeIds || q?.knowledgePoints || q?.knowledgeId || q?.knowledge || [];
    return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
  }

  normalizeQuestion(q) {
    const raw = q?.correctIndex ?? q?.answer ?? q?.correctAnswer ?? q?.correctOption ?? q?.correct;
    return { ...q, type: q.type || 'choice', correctIndex: this.toIndex(raw) };
  }

  toIndex(value) {
    if (Number.isInteger(value)) return Math.max(0, value);
    const text = String(value ?? '').trim().toUpperCase();
    if (/^[A-Z]$/.test(text)) return text.charCodeAt(0) - 65;
    if (/^\d+$/.test(text)) return Number(text);
    return 0;
  }

  toLetter(index) { return String.fromCharCode(65 + Number(index)); }
  getScore() { const a = this.session?.answers || []; return a.length ? Math.round(a.filter(x => x.correct).length / a.length * 100) : 0; }
  reset() { this.session = null; this.state.currentQuiz = null; this.state.quizIndex = 0; this.state.quizAnswers = {}; }
}
