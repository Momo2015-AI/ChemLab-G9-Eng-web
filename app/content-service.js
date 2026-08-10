/**
 * ChemLab-G9 V1.7 Content Service
 * Stable application-facing boundary over the legacy content loader.
 */

import ContentLoader from '../engine/content-loader.js';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';

class ContentService {
  constructor(loader = new ContentLoader()) {
    this.loader = loader;
    this.data = null;
    this._engine = null;
  }

  async load() {
    if (!this.data) this.data = await this.loader.loadAll();
    return this.data;
  }

  _buildEngine() {
    if (!this._engine) {
      const kg = this.data?.knowledgeGraph || {};
      // Canonical engine accepts both edges (from/to) and relations (source/target)
      const graph = {
        nodes: kg.nodes || [],
        relations: (kg.relations || kg.edges || []).map(e => ({
          source: e.from || e.source,
          target: e.to || e.target,
          type: e.type,
        })),
      };
      this._engine = new KnowledgeEngine(graph);
    }
    return this._engine;
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

  getKnowledgeEngine() {
    return this._buildEngine();
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
