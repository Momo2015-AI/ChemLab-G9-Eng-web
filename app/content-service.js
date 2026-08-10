/**
 * ChemLab-G9 V1.7 Content Service
 * Stable application-facing boundary over the legacy content loader.
 */

import ContentLoader from '../engine/content-loader.js';

class ContentService {
  constructor(loader = new ContentLoader()) {
    this.loader = loader;
    this.data = null;
  }

  async load() {
    if (!this.data) this.data = await this.loader.loadAll();
    return this.data;
  }

  async getLesson(dayId) {
    const data = await this.load();
    return data.dayById.get(dayId) || null;
  }

  async getQuestion(questionId) {
    const data = await this.load();
    return data.questionById.get(questionId) || null;
  }

  async getQuestionsByKnowledge(knowledgeId) {
    const data = await this.load();
    return data.questions.filter(q => (q.knowledge || []).includes(knowledgeId));
  }

  async getKnowledgeGraph() {
    const data = await this.load();
    return data.knowledgeGraph;
  }

  async getExperiment(id) {
    return this.loader.loadExperiment(id);
  }

  async getKnowledgeContent(id) {
    return this.loader.loadKnowledgeContent(id);
  }
}

export const contentService = new ContentService();
export default ContentService;
