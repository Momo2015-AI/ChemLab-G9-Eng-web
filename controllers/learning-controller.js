/**
 * V1.7 Learning Controller
 * Coordinates lesson selection and learning progress without owning UI rendering.
 */
export class LearningController {
  constructor({ contentService, state }) {
    this.contentService = contentService;
    this.state = state;
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
}
