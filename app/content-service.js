/**
 * ChemLab-G9 V2.0 Content Service
 * Stable application-facing boundary over the content loader.
 */

import ContentLoader from './content-loader.js';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';
import { registerQuestion } from '../core/diagnosis/question-knowledge-map.js';

function normalizeKnowledgeIds(question) {
  const value = question?.knowledgeIds ?? question?.knowledgePoints ?? question?.knowledgeId ?? question?.knowledge ?? [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

function normalizeKnowledgeGraph(graph = {}) {
  const relations = (graph.relations || graph.edges || []).map(relation => ({
    ...relation,
    source: relation.source || relation.from,
    target: relation.target || relation.to,
  }));
  return { ...graph, relations };
}

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
      this.data.knowledgeGraph = normalizeKnowledgeGraph(this.data.knowledgeGraph);
      this.data.questionById = new Map(this.data.questions.map(q => [q.id, q]));
      for (const question of this.data.questions) {
        const knowledge = normalizeKnowledgeIds(question);
        const commonMistake = question.commonMistake || question.mistake || null;
        const misconceptionIds = Array.isArray(question.misconceptionIds) ? question.misconceptionIds : [];
        const legacyErrors = Array.isArray(question.errors) ? question.errors : commonMistake ? [commonMistake] : [];
        registerQuestion(question.id, { knowledge, errors: [...new Set([...legacyErrors, ...misconceptionIds])] });
      }
      this.knowledgeEngine = this.knowledgeEngineFactory(this.data.knowledgeGraph);
    }
    return this.data;
  }

  async getLesson(dayId) {
    const data = await this.load();
    const lesson = await this.loader.loadLesson(dayId).catch(() => null);
    if (lesson) {
      data.dayById.set(dayId, lesson);
      const index = data.days.findIndex(day => day.day === dayId || day.canonicalId === dayId);
      if (index >= 0) data.days[index] = lesson;
    }
    return lesson || data.dayById.get(dayId) || null;
  }

  async getGuidedLearning(lessonId) {
    return this.loader.loadGuidedLearning(lessonId).catch(() => null);
  }

  async getQuestion(questionId) { const data = await this.load(); return data.questionById.get(questionId) || null; }
  async getQuestionsByKnowledge(knowledgeId) { const data = await this.load(); return data.questions.filter(q => normalizeKnowledgeIds(q).includes(knowledgeId)); }
  async getKnowledgeGraph() { const data = await this.load(); return data.knowledgeGraph; }
  async getKnowledgeGraphViewModel() { const engine = await this.getKnowledgeEngine(); return { nodes: Array.from(engine.nodes.values()), relations: [...engine.relations] }; }
  async getKnowledgeEngine() { await this.load(); return this.knowledgeEngine; }
  async getKnowledge(id) { const engine = await this.getKnowledgeEngine(); return engine.getNode(id); }
  async getPrerequisites(id) { const engine = await this.getKnowledgeEngine(); return engine.prerequisites(id); }
  async getExperimentsByKnowledge(id) { const engine = await this.getKnowledgeEngine(); return engine.experiments(id); }
  async getQuestionsByKnowledgeGraph(id) { const engine = await this.getKnowledgeEngine(); return engine.questions(id); }
  async getCommonMistakes(id) { const engine = await this.getKnowledgeEngine(); return engine.commonMistakes(id); }
  async getExperiment(id) { return this.loader.loadExperiment(id); }
  async getKnowledgeContent(id) { return this.loader.loadKnowledgeContent(id); }
}

export const contentService = new ContentService();
export default ContentService;
