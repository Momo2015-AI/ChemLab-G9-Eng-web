/**
 * ChemLab content loader.
 * Asset URLs are resolved from this module URL, never from document <base>.
 * Canonical index data loads at startup; lesson bodies load on demand.
 */
import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import { day01ProductionOverrides, day01ProductionOverrideIds } from '../content/questions/day01-production-overrides.js';

const APP_ROOT = new URL('../', import.meta.url);
const assetUrl = path => new URL(path, APP_ROOT).href;
const lessonUrl = day => assetUrl(`modules/lessons/day-${String(day).padStart(2, '0')}.json`);
const ENDPOINTS = {
  questionBank: assetUrl('modules/questions/question-bank.json'),
  knowledgeGraph: assetUrl('content/knowledge/knowledge-graph.json'),
  legacyKnowledgeGraph: assetUrl('modules/questions/taxonomy/knowledge-graph.json'),
  manifest: assetUrl('modules/lessons/manifest.json'),
  topicBank: assetUrl('modules/questions/bank/questions-by-topic.json'),
};
const DEFAULT_TIMEOUT_MS = 12000;

const normalizeQuestion = question => {
  if (!question || typeof question !== 'object') return question;
  if (question.answer !== undefined || question.ans === undefined) return question;
  return { ...question, answer: question.ans };
};

class ContentLoader {
  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    this.cache = new Map();
    this.timeoutMs = timeoutMs;
  }

  async fetchJSON(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const promise = (async () => {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null;
      try {
        const res = await fetch(url, controller ? { signal: controller.signal } : undefined);
        if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
        return await res.json();
      } catch (error) {
        if (error?.name === 'AbortError') throw new Error(`Timed out loading ${url} after ${this.timeoutMs}ms`);
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
      }
    })();
    this.cache.set(url, promise);
    try {
      return await promise;
    } catch (error) {
      this.cache.delete(url);
      throw error;
    }
  }

  async loadKnowledgeGraph() {
    try {
      return await this.fetchJSON(ENDPOINTS.knowledgeGraph);
    } catch (error) {
      return this.fetchJSON(ENDPOINTS.legacyKnowledgeGraph).catch(() => { throw error; });
    }
  }

  async loadAll() {
    const [manifest, qb, kg, topics] = await Promise.all([
      this.fetchJSON(ENDPOINTS.manifest),
      this.fetchJSON(ENDPOINTS.questionBank),
      this.loadKnowledgeGraph(),
      this.fetchJSON(ENDPOINTS.topicBank).catch(() => ({ topics: [] })),
    ]);
    const productionQuestions = Array.isArray(qb.questions) ? qb.questions.map(normalizeQuestion) : [];
    const sanitizedProductionQuestions = productionQuestions.filter(q => !day01ProductionOverrideIds.has(q.id));
    const questions = [...sanitizedProductionQuestions, ...day01ProductionOverrides, ...day01DiagnosticQuestions.filter(q => q.status !== 'archived')];
    const days = Array.isArray(manifest.days) ? manifest.days : [];
    return { questions, questionById: new Map(questions.map(q => [q.id, q])), knowledgeGraph: kg, manifest, topics: topics.topics, days, dayById: new Map(days.map(d => [d.day, d])) };
  }

  async loadLesson(day) { return this.fetchJSON(lessonUrl(day)); }
  async loadExperiment(id) { return this.fetchJSON(assetUrl(`content/experiments/${id}.json`)).catch(() => null); }
  async loadKnowledgeContent(id) { return this.fetchJSON(assetUrl(`content/knowledge/${id}.json`)).catch(() => null); }

  getQuestionsByKnowledge(knowledgeId) {
    const data = this.cache.get(ENDPOINTS.questionBank);
    if (!data) return [];
    return [...data.questions.map(normalizeQuestion).filter(q => !day01ProductionOverrideIds.has(q.id)), ...day01ProductionOverrides, ...day01DiagnosticQuestions].filter(q => (q.knowledge || []).includes(knowledgeId));
  }
}

export const contentLoader = new ContentLoader();
export default ContentLoader;
