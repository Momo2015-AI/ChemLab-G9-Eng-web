/**
 * ChemLab-G9 V1.6 Content Loader
 * Loads all structured learning data from modules/
 */

function detectBase() {
  if (typeof document !== 'undefined') {
    const baseEl = document.querySelector('base');
    if (baseEl) {
      const href = baseEl.getAttribute('href');
      if (href && href !== '/') return href.endsWith('/') ? href.slice(0, -1) : href;
    }
    const path = window.location.pathname;
    const match = path.match(/^(\/.*)\/(engine|index)/);
    if (match) return match[1];
  }
  return '';
}

const BASE = detectBase();

const ENDPOINTS = {
  questionBank: `${BASE}/modules/questions/question-bank.json`,
  knowledgeGraph: `${BASE}/modules/questions/taxonomy/knowledge-graph.json`,
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

  async loadAll() {
    const [qb, kg, manifest, topics, days] = await Promise.all([
      this.fetchJSON(ENDPOINTS.questionBank),
      this.fetchJSON(ENDPOINTS.knowledgeGraph),
      this.fetchJSON(ENDPOINTS.manifest),
      this.fetchJSON(ENDPOINTS.topicBank).catch(() => ({ topics: [] })),
      this.loadAllDays(),
    ]);

    return {
      questions: qb.questions,
      questionById: new Map(qb.questions.map(q => [q.id, q])),
      knowledgeGraph: kg,
      manifest: manifest,
      topics: topics.topics,
      days: days,
      dayById: new Map(days.map(d => [d.day, d])),
    };
  }

  async loadAllDays() {
    const results = await Promise.all(
      Array.from({ length: 36 }, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        return this.fetchJSON(`${BASE}/modules/lessons/day-${day}.json`)
          .catch(() => null);
      })
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
    const qb = this.cache.get(ENDPOINTS.questionBank);
    if (!qb) return [];
    return qb.questions.filter(q => (q.knowledge || []).includes(knowledgeId));
  }
}

export const contentLoader = new ContentLoader();
export default ContentLoader;
