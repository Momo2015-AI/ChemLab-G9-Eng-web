import { diagnoseAssessment } from '../core/diagnosis/diagnosis-engine.js';
import { evaluateMastery } from '../core/assessment/mastery-policy.js';
import { knowledgeIdsOf } from '../core/diagnosis/question-knowledge-map.js';

export class AssessmentRuntimeController {
  constructor({ assessment, contentService, state, masteryService = null, learningController = null, rng = Math.random }) {
    this.assessment = assessment;
    this.contentService = contentService;
    this.state = state;
    this.masteryService = masteryService;
    this.learningController = learningController;
    this.rng = typeof rng === 'function' ? rng : Math.random;
    this.session = null;
    masteryService?.hydrate?.(state.progress?.mastery || {});
  }

  shuffleQuestions(questions) {
    const copy = [...questions];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  async startPractice(lessonId) {
    const lesson = await this.contentService.getLesson(lessonId);
    const data = await this.contentService.load();
    if (!lesson) return null;
    const fallbackKnowledge = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
    const practiceQuestions = typeof this.contentService.getPractice === 'function'
      ? await this.contentService.getPractice(lessonId).catch(() => null)
      : null;
    const source = (Array.isArray(practiceQuestions) && practiceQuestions.length ? practiceQuestions : lesson.questions || [])
      .map(item => data.questionById.get(typeof item === 'object' ? item.id : item) || (typeof item === 'object' ? item : null))
      .filter(Boolean)
      .map(question => this.normalizeQuestion(question, fallbackKnowledge));
    if (!source.length) return null;
    return this.startAttempt(lessonId, this.shuffleQuestions(source), 'practice');
  }

  async startMastery(lessonId) {
    const data = await this.contentService.getMastery(lessonId);
    const lesson = typeof this.contentService.getLesson === 'function' ? await this.contentService.getLesson(lessonId).catch(() => null) : null;
    const questions = this.shuffleQuestions((data?.questions || []).map(question => this.normalizeQuestion(question)));
    if (!questions.length) return null;
    const requiredKnowledgeIds = data.requiredKnowledgeIds || data.knowledgeIds || lesson?.knowledgePoints || [...new Set(questions.flatMap(question => this.knowledge(question)))];
    const criteria = {
      requiredKnowledgeIds: Array.isArray(requiredKnowledgeIds) ? requiredKnowledgeIds : [requiredKnowledgeIds].filter(Boolean),
      criticalMisconceptions: data.criticalMisconceptions || lesson?.mastery?.criticalMisconceptions || [],
      requireConstructed: Boolean(data.requireConstructed || lesson?.mastery?.requireConstructed),
    };
    const mastery = {
      lessonId,
      status: 'in-progress',
      questionCount: questions.length,
      threshold: Number(data.threshold || .95),
      criteria,
    };
    this.learningController?.updateLessonState?.(lessonId, { mastery, phase: 'MASTERY' });
    return this.startAttempt(lessonId, questions, 'mastery');
  }

  async startRecheck(lessonId, knowledgeIds, limit = 5) {
    const ids = Array.isArray(knowledgeIds) ? knowledgeIds.filter(Boolean) : [knowledgeIds].filter(Boolean);
    if (!ids.length) return null;
    // Recheck draws only from this lesson's own pools (embedded questions,
    // practice, diagnostic, mastery): mixing the global bank previously
    // served questions from unrelated lessons (e.g. legacy day01 acid items
    // inside a lesson-03 recheck).
    const data = await this.contentService.load();
    const [lesson, practice, diagnostic, mastery] = await Promise.all([
      this.contentService.getLesson?.(lessonId).catch(() => null),
      this.contentService.getPractice?.(lessonId).catch(() => null),
      this.contentService.getDiagnostic?.(lessonId).catch(() => null),
      this.contentService.getMastery?.(lessonId).catch(() => null),
    ]);
    const pool = [];
    const seen = new Set();
    const push = question => {
      const resolved = typeof question === 'object' ? question : data.questionById?.get(question);
      if (resolved?.id && !seen.has(resolved.id)) { seen.add(resolved.id); pool.push(resolved); }
    };
    for (const question of [...(practice || []), ...(diagnostic || []), ...(mastery?.questions || []), ...(Array.isArray(lesson?.questions) ? lesson.questions : [])]) push(question);
    const wanted = new Set(ids);
    const matches = pool.filter(question => this.knowledge(question).some(id => wanted.has(id)));
    if (!matches.length) return null;
    // Questions the student actually got wrong come first, so a recheck
    // re-tests the failure rather than easy items that share a knowledge tag.
    const failedIds = new Set((this.learningController?.getLessonState?.(lessonId)?.diagnosis?.errors || [])
      .map(error => error.questionId).filter(Boolean));
    const failed = matches.filter(question => failedIds.has(question.id));
    const rest = matches.filter(question => !failedIds.has(question.id));
    // Failed items keep their stable order (they are the priority re-test
    // targets); only the correctly-answered tail is shuffled so the full
    // recheck run does not become a memorizable sequence.
    const ordered = [...failed, ...this.shuffleQuestions(rest)];
    const questions = ordered.slice(0, limit).map(question => this.normalizeQuestion(question));
    this.learningController?.updateLessonState?.(lessonId, {
      recheck: { lessonId, knowledgeIds: ids, status: 'in-progress', questionCount: questions.length },
      phase: 'RECHECK',
    });
    return this.startAttempt(lessonId, questions, 'recheck');
  }

  async startTransfer(lessonId, limit = 5) {
    const data = typeof this.contentService.getTransfer === 'function'
      ? await this.contentService.getTransfer(lessonId).catch(() => null)
      : null;
    const pool = Array.isArray(data?.questions) && data.questions.length
      ? data.questions
      : (Array.isArray(data) ? data : []);
    if (!pool.length) return null;
    const questions = pool
      .slice(0, limit)
      .map(question => this.normalizeQuestion(question));
    if (!questions.length) return null;
    this.learningController?.updateLessonState?.(lessonId, {
      transfer: { lessonId, status: 'in-progress', questionCount: questions.length },
      phase: 'TRANSFER',
    });
    return this.startAttempt(lessonId, questions, 'transfer');
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
    this.learningController?.updateLessonState?.(lessonId, { phase: mode === 'mastery' ? 'MASTERY' : mode === 'recheck' ? 'RECHECK' : mode === 'transfer' ? 'TRANSFER' : 'PRACTICE', activeAttemptId: attemptId });
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
      rubricPassed: evaluated.rubricPassed,
      score: evaluated.score,
      explanation: evaluated.explanation,
      diagnosis,
      question,
    });
    this.recordEvidence(knowledgeIds, evaluated, question);
    this.session.index += 1;
    this.session.completed = this.session.index >= this.session.questions.length;
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
    if (this.session.mode === 'transfer') this.finishTransfer(correct, total, score);
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
    const practice = { lessonId: this.session.lessonId, attemptId: this.session.attemptId, correct, total, score, completedAt: diagnosis.completedAt };
    this.learningController?.updateLessonState?.(this.session.lessonId, { practice, diagnosis, phase: errors.length ? 'REMEDIATION' : 'MASTERY' });
    if (errors.length) {
      this.learningController?.getRemediationPlan({ ...diagnosis, lessonId: this.session.lessonId, status: 'incorrect', knowledge: weakPoints, possibleErrors, source: 'practice-attempt' });
    } else {
      this.learningController?.updateLessonState?.(this.session.lessonId, { remediation: null });
    }
  }

  finishRecheck(correct, total, score) {
    const passed = total > 0 && correct === total;
    const existing = this.learningController?.getLessonState?.(this.session.lessonId)?.recheck || {};
    const recheck = {
      ...existing,
      lessonId: this.session.lessonId,
      attemptId: this.session.attemptId,
      status: passed ? 'passed' : 'failed',
      correct,
      total,
      score,
      completedAt: new Date().toISOString(),
    };
    this.learningController?.updateLessonState?.(this.session.lessonId, { recheck, phase: passed ? 'MASTERY' : 'REMEDIATION' });
  }

  finishMastery(correct, total, score) {
    const lessonId = this.session.lessonId;
    const existing = this.learningController?.getLessonState?.(lessonId).mastery
      || this.state.learning?.mastery?.[lessonId]
      || {};
    const threshold = Number(existing.threshold || .95);
    const decision = evaluateMastery({
      questions: this.session.questions,
      answers: this.session.answers,
      threshold,
      requiredKnowledgeIds: existing.criteria?.requiredKnowledgeIds || [],
      criticalMisconceptions: existing.criteria?.criticalMisconceptions || [],
      requireConstructed: existing.criteria?.requireConstructed,
    });
    const passed = decision.passed;
    const mastery = {
      ...existing,
      lessonId,
      attemptId: this.session.attemptId,
      status: passed ? 'passed' : 'needs-remediation',
      correct,
      total,
      score,
      threshold,
      criteria: decision,
      completedAt: new Date().toISOString(),
    };
    this.learningController?.updateLessonState?.(lessonId, { mastery, phase: passed ? 'MASTERED' : 'REMEDIATION' });
    this.state.progress.lessonMastery ||= {};
    this.state.progress.lessonMastery[lessonId] = passed;
  }

  finishTransfer(correct, total, score) {
    const lessonId = this.session.lessonId;
    const transfer = {
      lessonId,
      attemptId: this.session.attemptId,
      status: total > 0 && score >= 0.8 ? 'passed' : 'completed',
      correct,
      total,
      score,
      completedAt: new Date().toISOString(),
    };
    this.learningController?.updateLessonState?.(lessonId, { transfer, phase: 'TRANSFER' });
    this.state.save?.();
  }

  knowledge(question) {
    return knowledgeIdsOf(question);
  }

  normalizeQuestion(question = {}, fallbackKnowledge = []) {
    const options = question.options || question.o || [];
    const rawAnswer = question.correctIndex ?? question.answer ?? question.correctAnswer ?? question.correctOption ?? question.correct ?? question.a;
    const isChoice = Array.isArray(options) && options.length > 0 && question.type !== 'constructed';
    const knowledgeIds = knowledgeIdsOf(question, fallbackKnowledge);
    if (isChoice) {
      return {
        ...question,
        type: 'choice',
        // Some legacy items bake "A. " into the option text; the view already
        // renders its own letter badge, so strip the duplicated prefix.
        options: options.map(option => {
          const text = typeof option === 'object' ? option.text ?? option.label ?? '' : String(option);
          return text.replace(/^\s*[A-Ha-h][.、．)）:：]\s*/, '').trim() || text;
        }),
        correctIndex: this.toIndex(rawAnswer),
        answer: this.toLetter(this.toIndex(rawAnswer)),
        knowledgeIds,
      };
    }
    return { ...question, type: question.type || 'short-answer', answer: rawAnswer, knowledgeIds };
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
    if (question.type === 'constructed' || question.type === 'short-answer') return String(value ?? '').trim();
    return question.type === 'choice' ? this.toLetter(value) : value;
  }

  getScore() {
    const answers = this.session?.answers || [];
    return answers.length ? Math.round(answers.filter(answer => answer.correct).length / answers.length * 100) : 0;
  }

  reset() {
    this.session = null;
  }
}
