/**
 * ChemLab Learning Engine V1.5
 * Content Loader
 *
 * Responsible for loading structured learning modules.
 */

export class ContentLoader {
  constructor(basePath = './modules') {
    this.basePath = basePath;
  }

  async loadLesson(id) {
    const response = await fetch(`${this.basePath}/lessons/${id}.json`);
    if (!response.ok) {
      throw new Error(`Lesson not found: ${id}`);
    }
    return response.json();
  }
}
