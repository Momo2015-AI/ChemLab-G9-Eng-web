/** Learning Controller — lesson state, progress, remediation, and completion policy. */
import { createRemediationPlan } from '../core/diagnosis/remediation-engine.js';
import { canCompleteLesson, getLessonReleaseState } from '../content/release-policy.js';

export class LearningController {
  constructor({ contentService, state, remediationCatalog = {} }) {
    this.contentService = contentService;
    this.state = state;
    this.remediationCatalog = remediationCatalog;
  }

  async getLesson(dayId) {
    return this.contentService.getLesson(dayId);
  }

  getLessonState(dayId) {
    this.state.learning ||= {};
    this.state.learning.lessons ||= {};
    const state = this.state.learning.lessons[dayId] || {};
    return state;
  }

  updateLessonState(dayId, patch) {
    this.state.learning ||= {};
    this.state.learning.lessons ||= {};
    this.state.learning.lessons[dayId] = { ...this.getLessonState(dayId), ...patch, lessonId: dayId, updatedAt: new Date().toISOString() };
    this.state.save?.();
    return this.state.learning.lessons[dayId];
  }

  getProgress(dayId) {
    return Boolean(this.state.progress?.completed?.[dayId]);
  }

  getLessonMastery(dayId) {
    return this.getLessonState(dayId).mastery
      || this.state.learning?.mastery?.[dayId]
      || (this.state.progress?.lessonMastery?.[dayId]
        ? { status: 'passed', score: 1, threshold: 0.95 }
        : null);
  }

  getLessonPhase(dayId) {
    if (this.getProgress(dayId)) return 'COMPLETED';
    const lessonState = this.getLessonState(dayId);
    if (lessonState.phase) return lessonState.phase;
    const mastery = this.getLessonMastery(dayId);
    if (mastery?.status === 'passed') return 'MASTERED';
    if (lessonState.recheck?.lessonId === dayId) return 'RECHECK';
    if (lessonState.transfer?.lessonId === dayId) return 'TRANSFER';
    if (lessonState.remediation?.status === 'needs-remediation') return 'REMEDIATION';
    if (lessonState.diagnosis?.lessonId === dayId) return 'DIAGNOSIS';
    if (lessonState.practice?.lessonId === dayId) return 'PRACTICE';
    return 'LEARNING';
  }

  recordGuidedCheck(lessonId, stepId, { correct, attempts = 1, usedHint = false, stepCount = 0 } = {}) {
    const lessonState = this.getLessonState(lessonId);
    const guided = { ...(lessonState.guided || {}), steps: { ...(lessonState.guided?.steps || {}) } };
    const previous = guided.steps[stepId] || { attempts: 0 };
    guided.steps[stepId] = {
      lessonId,
      stepId,
      attempts: Number(previous.attempts || 0) + Number(attempts || 1),
      correct: Boolean(correct),
      usedHint: Boolean(previous.usedHint || usedHint),
      completedAt: correct ? new Date().toISOString() : previous.completedAt || null,
    };
    const completed = Object.values(guided.steps).filter(step => step.correct).length;
    const expectedSteps = Number(stepCount || guided.stepCount || completed);
    guided.stepCount = expectedSteps;
    guided.completed = expectedSteps > 0 && completed >= expectedSteps;
    const phase = guided.completed ? 'EXPERIMENT' : 'LEARNING';
    return this.updateLessonState(lessonId, { guided, phase });
  }

  markPracticeComplete(dayId, result = {}) {
    const practice = {
      lessonId: dayId,
      score: Number(result.score || 0),
      correct: Number(result.correct || 0),
      total: Number(result.total || 0),
      completedAt: new Date().toISOString(),
    };
    this.updateLessonState(dayId, { practice, phase: 'DIAGNOSIS' });
  }

  markComplete(dayId, lesson = null) {
    const mastery = this.getLessonMastery(dayId);
    const lessonState = this.getLessonState(dayId);
    if (mastery?.status !== 'passed' || lessonState.phase === 'UNAVAILABLE' || (lesson && !canCompleteLesson(lesson))) return false;
    this.state.progress.completed ||= {};
    this.state.progress.completed[dayId] = true;
    this.updateLessonState(dayId, { phase: 'COMPLETED', completedAt: new Date().toISOString() });
    return true;
  }

  getLessonCardState(lesson) {
    const release = getLessonReleaseState(lesson);
    if (!release.available) return { phase: 'UNAVAILABLE', label: release.label, available: false };
    const phase = this.getLessonPhase(lesson.id || lesson.canonicalId);
    return { phase, label: phaseLabel(phase), available: true, release: release.key };
  }

  canComplete(lesson) {
    return canCompleteLesson(lesson) && this.getLessonMastery(lesson.id || lesson.canonicalId)?.status === 'passed';
  }

  getStageAvailability(lesson, guidedLearning = null) {
    const lessonId = lesson.id || lesson.canonicalId;
    const release = getLessonReleaseState(lesson);
    if (!release.available) return { guided: false, experiment: false, practice: false, remediation: false, mastery: false, complete: false, prerequisites: false, prerequisitesMet: false, prerequisitesMissing: [] };
    const prerequisites = Array.isArray(lesson.prerequisites) ? lesson.prerequisites.filter(Boolean) : [];
    const prerequisitesMissing = prerequisites.filter(id => this.getLessonMastery(id)?.status !== 'passed' && !this.getProgress(id));
    const prerequisitesMet = prerequisitesMissing.length === 0;
    const current = this.getLessonState(lessonId);
    const guidedComplete = !guidedLearning?.steps?.length || Boolean(current.guided?.completed);
    const experimentComplete = !(lesson.experiments || []).length || Boolean(current.experiment?.completed);
    const practiceComplete = Boolean(current.practice?.completedAt);
    const remediationComplete = current.remediation?.status !== 'needs-remediation' || current.recheck?.status === 'passed';
    const base = {
      prerequisites,
      prerequisitesMet,
      prerequisitesMissing,
      guided: guidedComplete,
      experiment: guidedComplete,
      practice: guidedComplete && experimentComplete && prerequisitesMet,
      remediation: practiceComplete && current.remediation?.status === 'needs-remediation',
      mastery: practiceComplete && remediationComplete && prerequisitesMet,
      complete: this.canComplete(lesson),
    };
    return base;
  }

  getRemediationPlan(diagnosis) {
    const plan = createRemediationPlan(diagnosis, { catalog: this.remediationCatalog });
    const lessonId = diagnosis?.lessonId || this.state.learning?.diagnosis?.lessonId;
    if (lessonId) this.updateLessonState(lessonId, { remediation: plan, diagnosis, phase: plan.status === 'needs-remediation' ? 'REMEDIATION' : 'TRANSFER' });
    else {
      this.state.learning ||= {};
      this.state.learning.remediation = plan;
      this.state.save?.();
    }
    return plan;
  }
}

function phaseLabel(phase) {
  return {
    LEARNING: '学习中',
    EXPERIMENT: '实验待完成',
    PRACTICE: '练习待完成',
    DIAGNOSIS: '等待诊断',
    REMEDIATION: '需要补救',
    RECHECK: '等待复查',
    MASTERY: '等待掌握测试',
    MASTERED: '已掌握',
    TRANSFER: '迁移挑战',
    COMPLETED: '已完成',
  }[phase] || '学习中';
}
