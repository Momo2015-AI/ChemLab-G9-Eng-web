/**
 * ChemLab-G9 V1.7 Content Service
 * Stable application-facing boundary over the content loader.
 */

import ContentLoader from './content-loader.js';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';

class ContentService {
  constructor(loader = new ContentLoader(), knowledgeEngineFactory = graph => new KnowledgeEngine(graph)) {
    this.loader = loader;
    this.knowledgeEngineFactory = knowledgeEngineFactory;
    this.data = null;
    this.knowledgeEngine = null;
  }

  async load() {
    if (!this.data) {
      this.data = await this.loader.loadAll();
      this.knowledgeEngine = this.knowledgeEngineFactory(this.data.knowledgeGraph);
    }
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

  async getKnowledgeGraphViewModel() {
    const engine = await this.getKnowledgeEngine();
    return {
      nodes: Array.from(engine.nodes.values()),
      relations: [...engine.relations],
    };
  }

  async getKnowledgeEngine() {
    await this.load();
    return this.knowledgeEngine;
  }

  async getKnowledge(id) {
    const engine = await this.getKnowledgeEngine();
    return engine.getNode(id);
  }

  async getPrerequisites(id) {
    const engine = await this.getKnowledgeEngine();
    return engine.prerequisites(id);
  }

  async getExperimentsByKnowledge(id) {
    const engine = await this.getKnowledgeEngine();
    return engine.experiments(id);
  }

  async getQuestionsByKnowledgeGraph(id) {
    const engine = await this.getKnowledgeEngine();
    return engine.questions(id);
  }

  async getCommonMistakes(id) {
    const engine = await this.getKnowledgeEngine();
    return engine.commonMistakes(id);
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
