/**
 * ChemLab content loader.
 * Canonical lesson IDs are the only production lesson source.
 */
import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import { day01ProductionOverrides, day01ProductionOverrideIds } from '../content/questions/day01-production-overrides.js';
import lessonManifest from '../content/curriculum/lesson-manifest.js';

const APP_ROOT = new URL('../', import.meta.url);
const assetUrl = path => new URL(path, APP_ROOT).href;
const canonicalLessonUrl = id => assetUrl(`content/lessons/${id}.json`);
const guidedLearningUrl = id => assetUrl(`content/lessons/${id}-guided-learning.json`);
const ENDPOINTS = {
  questionBank: assetUrl('content/questions/question-bank.json'),
  knowledgeGraph: assetUrl('content/knowledge/knowledge-graph.json'),
  legacyKnowledgeGraph: assetUrl('modules/questions/taxonomy/knowledge-graph.json'),
  topicBank: assetUrl('modules/questions/bank/questions-by-topic.json'),
};
const DEFAULT_TIMEOUT_MS = 12000;

const normalizeQuestion = question => {
  if (!question || typeof question !== 'object') return question;
  if (question.answer !== undefined || question.ans === undefined) return question;
  return { ...question, answer: question.ans };
};

class ContentLoader {
  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) { this.cache = new Map(); this.timeoutMs = timeoutMs; }
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
      } finally { if (timer) clearTimeout(timer); }
    })();
    this.cache.set(url, promise);
    try { return await promise; } catch (error) { this.cache.delete(url); throw error; }
  }
  async loadKnowledgeGraph() {
    try { return await this.fetchJSON(ENDPOINTS.knowledgeGraph); }
    catch (error) { return this.fetchJSON(ENDPOINTS.legacyKnowledgeGraph).catch(() => { throw error; }); }
  }
  async loadOptionalJSON(url, fallback) { try { return await this.fetchJSON(url); } catch { return fallback; } }
  async loadAll() {
    const [qb, kg, topics] = await Promise.all([
      this.loadOptionalJSON(ENDPOINTS.questionBank, { questions: [] }),
      this.loadKnowledgeGraph(), this.loadOptionalJSON(ENDPOINTS.topicBank, { topics: [] }),
    ]);
    const productionQuestions = Array.isArray(qb.questions) ? qb.questions.map(normalizeQuestion) : [];
    const sanitizedProductionQuestions = productionQuestions.filter(q => !day01ProductionOverrideIds.has(q.id));
    const questions = [...sanitizedProductionQuestions, ...day01ProductionOverrides, ...day01DiagnosticQuestions.filter(q => q.status !== 'archived')];
    const days = Array.isArray(lessonManifest.lessons) ? lessonManifest.lessons : [];
    return { questions, questionById: new Map(questions.map(q => [q.id, q])), knowledgeGraph: kg, manifest: lessonManifest, topics: topics.topics, days, dayById: new Map(days.map(d => [d.day, d])) };
  }
  async loadLesson(id) {
    if (!String(id).startsWith('lesson-')) {
      const manifestEntry = (await this.loadAll()).days.find(day => day.day === String(id) || day.canonicalId === String(id));
      id = manifestEntry?.canonicalId || id;
    }
    if (!String(id).startsWith('lesson-')) return null;
    return this.fetchJSON(canonicalLessonUrl(id));
  }
  async loadGuidedLearning(id) {
    if (!String(id).startsWith('lesson-')) return null;
    return this.fetchJSON(guidedLearningUrl(id));
  }
  async loadExperiment(id) { return this.fetchJSON(assetUrl(`content/experiments/${id}.json`)).catch(() => null); }
  async loadKnowledgeContent(id) { return this.fetchJSON(assetUrl(`content/knowledge/${id}.json`)).catch(() => null); }
}
export const contentLoader = new ContentLoader();
export default ContentLoader;
