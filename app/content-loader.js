/**
 * ChemLab-G9 V1.9 content loader.
 *
 * Infrastructure adapter owned by the application content boundary.
 * ContentService is the public application-facing API; this module owns
 * manifest-driven JSON loading and browser deployment-base resolution.
 *
 * Day 01 diagnostic questions are deliberately kept in a separate JS content
 * module while review is in progress. They are merged at the application
 * boundary so diagnosis can resolve them without pretending they are already
 * part of the published 320-question bank.
 */

import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';

const BASE = (() => {
  if (typeof document === 'undefined') return '';
  const baseEl = document.querySelector('base');
  if (!baseEl) return '';
  const href = baseEl.getAttribute('href') || '';
  return href.endsWith('/') ? href.slice(0, -1) : href;
})();

const ENDPOINTS = {
  questionBank: `${BASE}/modules/questions/question-bank.json`,
  knowledgeGraph: `${BASE}/content/knowledge/knowledge-graph.json`,
  legacyKnowledgeGraph: `${BASE}/modules/questions/taxonomy/knowledge-graph.json`,
  manifest: `${BASE}/modules/lessons/manifest.json`,
  topicBank: `${BASE}/modules/questions/bank/questions-by-topic.json`,
};

class ContentLoader {
  constructor() {
    this.cache = new Map();
  }

  async fetchJSON(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load: ${url} (${res.status})`);
    const data = await res.json();
    this.cache.set(url, data);
    return data;
  }

  async loadKnowledgeGraph() {
    try {
      return await this.fetchJSON(ENDPOINTS.knowledgeGraph);
    } catch (error) {
      return this.fetchJSON(ENDPOINTS.legacyKnowledgeGraph).catch(() => {
        throw error;
      });
    }
  }

  async loadAll() {
    const manifest = await this.fetchJSON(ENDPOINTS.manifest);
    const [qb, kg, topics, days] = await Promise.all([
      this.fetchJSON(ENDPOINTS.questionBank),
      this.loadKnowledgeGraph(),
      this.fetchJSON(ENDPOINTS.topicBank).catch(() => ({ topics: [] })),
      this.loadAllDays(manifest),
    ]);

    const productionQuestions = Array.isArray(qb.questions) ? qb.questions : [];
    const diagnostics = day01DiagnosticQuestions.filter(q => q.status !== 'archived');
    const questions = [...productionQuestions, ...diagnostics];

    return {
      questions,
      questionById: new Map(questions.map(q => [q.id, q])),
      knowledgeGraph: kg,
      manifest,
      topics: topics.topics,
      days,
      dayById: new Map(days.map(d => [d.day, d])),
    };
  }

  async loadAllDays(manifest = {}) {
    const dayIds = Array.isArray(manifest.days)
      ? manifest.days.map(entry => entry?.day).filter(Boolean)
      : [];

    const results = await Promise.all(
      dayIds.map(day =>
        this.fetchJSON(`${BASE}/modules/lessons/day-${String(day).padStart(2, '0')}.json`)
          .catch(() => null)
      )
    );
    return results.filter(Boolean);
  }

  async loadExperiment(id) {
    const url = `${BASE}/content/experiments/${id}.json`;
    return this.fetchJSON(url).catch(() => null);
  }

  async loadKnowledgeContent(id) {
    const url = `${BASE}/content/knowledge/${id}.json`;
    return this.fetchJSON(url).catch(() => null);
  }

  getQuestionsByKnowledge(knowledgeId) {
    const data = this.cache.get(ENDPOINTS.questionBank);
    if (!data) return [];
    return [...data.questions, ...day01DiagnosticQuestions]
      .filter(q => (q.knowledge || []).includes(knowledgeId));
  }
}

export const contentLoader = new ContentLoader();
export default ContentLoader;
