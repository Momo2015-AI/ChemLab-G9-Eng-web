/**
 * V1.7 Learning Controller
 * Coordinates lesson selection, progress and remediation without owning UI rendering.
 */
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
    return this.state.progress?.completed?.[dayId] || false;
  }

  markComplete(dayId) {
    this.state.progress.completed ||= {};
    this.state.progress.completed[dayId] = true;
    this.state.save?.();
  }

  getRemediationPlan(diagnosis) {
    const plan = createRemediationPlan(diagnosis, { catalog: this.remediationCatalog });
    this.state.learning ||= {};
    this.state.learning.remediation = plan;
    this.state.save?.();
    return plan;
  }
}
