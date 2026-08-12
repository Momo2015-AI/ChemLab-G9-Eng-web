/**
 * ChemLab-G9 V1.9 content loader.
 *
 * Infrastructure adapter owned by the application content boundary.
 * ContentService is the public application-facing API; this module owns
 * manifest-driven JSON loading and browser deployment-base resolution.
 *
 * Asset URLs are resolved from this module's own URL rather than document
 * <base>. This makes the same build work at localhost root and under the
 * GitHub Pages project path without relying on environment-specific HTML.
 *
 * Day 01 review content is deliberately kept in separate JS modules while
 * review is in progress. The production overrides replace known defective
 * legacy IDs without reconstructing the large 320-question JSON file.
 */

import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import {
  day01ProductionOverrides,
  day01ProductionOverrideIds,
} from '../content/questions/day01-production-overrides.js';

const APP_ROOT = new URL('../', import.meta.url);
const assetUrl = path => new URL(path, APP_ROOT).href;

const ENDPOINTS = {
  questionBank: assetUrl('modules/questions/question-bank.json'),
  knowledgeGraph: assetUrl('content/knowledge/knowledge-graph.json'),
  legacyKnowledgeGraph: assetUrl('modules/questions/taxonomy/knowledge-graph.json'),
  manifest: assetUrl('modules/lessons/manifest.json'),
  topicBank: assetUrl('modules/questions/bank/questions-by-topic.json'),
};

const normalizeQuestion = question => {
  if (!question || typeof question !== 'object') return question;
  if (question.answer !== undefined || question.ans === undefined) return question;
  return { ...question, answer: question.ans };
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

    const productionQuestions = Array.isArray(qb.questions)
      ? qb.questions.map(normalizeQuestion)
      : [];
    const sanitizedProductionQuestions = productionQuestions.filter(
      question => !day01ProductionOverrideIds.has(question.id)
    );
    const productionQuestionsWithOverrides = [
      ...sanitizedProductionQuestions,
      ...day01ProductionOverrides,
    ];
    const diagnostics = day01DiagnosticQuestions.filter(q => q.status !== 'archived');
    const questions = [...productionQuestionsWithOverrides, ...diagnostics];

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
        this.fetchJSON(assetUrl(`modules/lessons/day-${String(day).padStart(2, '0')}.json`))
          .catch(() => null)
      )
    );
    return results.filter(Boolean);
  }

  async loadExperiment(id) {
    return this.fetchJSON(assetUrl(`content/experiments/${id}.json`)).catch(() => null);
  }

  async loadKnowledgeContent(id) {
    return this.fetchJSON(assetUrl(`content/knowledge/${id}.json`)).catch(() => null);
  }

  getQuestionsByKnowledge(knowledgeId) {
    const data = this.cache.get(ENDPOINTS.questionBank);
    if (!data) return [];
    return [
      ...data.questions
        .map(normalizeQuestion)
        .filter(q => !day01ProductionOverrideIds.has(q.id)),
      ...day01ProductionOverrides,
      ...day01DiagnosticQuestions,
    ].filter(q => (q.knowledge || []).includes(knowledgeId));
  }
}

export const contentLoader = new ContentLoader();
export default ContentLoader;
