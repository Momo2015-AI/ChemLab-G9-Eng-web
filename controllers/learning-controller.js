/** Learning Controller — lesson state, progress, remediation, and completion policy. */
import { createRemediationPlan } from '../core/diagnosis/remediation-engine.js';

export class LearningController {
  constructor({ contentService, state, remediationCatalog = {} }) {
    this.contentService = contentService;
    this.state = state;
    this.remediationCatalog = remediationCatalog;
  }

  async getLesson(dayId) {
    return this.contentService.getLesson(dayId);
  }

  getProgress(dayId) {
    return Boolean(this.state.progress?.completed?.[dayId]);
  }

  getLessonMastery(dayId) {
    return this.state.learning?.mastery?.[dayId]
      || (this.state.progress?.lessonMastery?.[dayId]
        ? { status: 'passed', score: 1, threshold: 0.95 }
        : null);
  }

  getLessonPhase(dayId) {
    if (this.getProgress(dayId)) return 'COMPLETED';
    const mastery = this.getLessonMastery(dayId);
    if (mastery?.status === 'passed') return 'MASTERED';
    if (this.state.learning?.recheck?.lessonId === dayId) return 'RECHECK';
    if (this.state.learning?.remediation?.status === 'needs-remediation') return 'REMEDIATION';
    if (this.state.learning?.diagnosis?.lessonId === dayId) return 'DIAGNOSIS';
    if (this.state.learning?.practice?.lessonId === dayId) return 'PRACTICE';
    return 'LEARNING';
  }

  markPracticeComplete(dayId, result = {}) {
    this.state.learning ||= {};
    this.state.learning.practice = {
      lessonId: dayId,
      score: Number(result.score || 0),
      correct: Number(result.correct || 0),
      total: Number(result.total || 0),
      completedAt: new Date().toISOString(),
    };
    this.state.save?.();
  }

  markComplete(dayId) {
    const mastery = this.getLessonMastery(dayId);
    if (mastery?.status !== 'passed') return false;
    this.state.progress.completed ||= {};
    this.state.progress.completed[dayId] = true;
    this.state.learning ||= {};
    this.state.learning.lessonPhase ||= {};
    this.state.learning.lessonPhase[dayId] = 'COMPLETED';
    this.state.save?.();
    return true;
  }

  getRemediationPlan(diagnosis) {
    const plan = createRemediationPlan(diagnosis, { catalog: this.remediationCatalog });
    this.state.learning ||= {};
    this.state.learning.remediation = plan;
    this.state.save?.();
    return plan;
  }
}
