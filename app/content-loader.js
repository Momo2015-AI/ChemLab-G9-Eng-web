/**
 * ChemLab-G9 V1.7 content loader.
 *
 * Infrastructure adapter owned by the application content boundary.
 * ContentService is the public application-facing API; this module owns
 * manifest-driven JSON loading and browser deployment-base resolution.
 */

const BASE = (() => {
  if (typeof document === 'undefined') return '';
  const baseEl = document.querySelector('base');
  if (!baseEl) return '';
  const href = baseEl.getAttribute('href') || '';
  return href.endsWith('/') ? href.slice(0, -1) : href;
})();

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
    const manifest = await this.fetchJSON(ENDPOINTS.manifest);
    const [qb, kg, topics, days] = await Promise.all([
      this.fetchJSON(ENDPOINTS.questionBank),
      this.fetchJSON(ENDPOINTS.knowledgeGraph),
      this.fetchJSON(ENDPOINTS.topicBank).catch(() => ({ topics: [] })),
      this.loadAllDays(manifest),
    ]);

    return {
      questions: qb.questions,
      questionById: new Map(qb.questions.map(q => [q.id, q])),
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
    const qb = this.cache.get(ENDPOINTS.questionBank);
    if (!qb) return [];
    return qb.questions.filter(q => (q.knowledge || []).includes(knowledgeId));
  }
}

export const contentLoader = new ContentLoader();
export default ContentLoader;
