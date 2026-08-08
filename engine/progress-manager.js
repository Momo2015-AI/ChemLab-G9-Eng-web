/**
 * Learning Progress Manager
 * Stores student learning status.
 */

export class ProgressManager {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.key = 'chemlab-progress';
  }

  getProgress() {
    return JSON.parse(this.storage.getItem(this.key) || '{}');
  }

  saveProgress(progress) {
    this.storage.setItem(this.key, JSON.stringify(progress));
  }

  updateLesson(id, status) {
    const progress = this.getProgress();
    progress[id] = status;
    this.saveProgress(progress);
    return progress;
  }
}
