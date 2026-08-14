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
const masteryUrl = id => assetUrl(`content/lessons/${id}-mastery.json`);
const practiceUrl = id => assetUrl(`content/lessons/${id}-practice.json`);
const diagnosticUrl = id => assetUrl(`content/lessons/${id}-diagnostic.json`);
const ENDPOINTS = { questionBank: assetUrl('content/questions/question-bank.json'), knowledgeGraph: assetUrl('content/knowledge/knowledge-graph.json'), legacyKnowledgeGraph: assetUrl('modules/questions/taxonomy/knowledge-graph.json'), topicBank: assetUrl('modules/questions/bank/questions-by-topic.json') };
const DEFAULT_TIMEOUT_MS = 12000;
const normalizeQuestion = question => { if (!question || typeof question !== 'object') return question; if (question.answer !== undefined || question.ans === undefined) return question; return { ...question, answer: question.ans }; };
class ContentLoader {
  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) { this.cache = new Map(); this.timeoutMs = timeoutMs; }
  async fetchJSON(url) { if (this.cache.has(url)) return this.cache.get(url); const promise = (async () => { const controller = typeof AbortController !== 'undefined' ? new AbortController() : null; const timer = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null; try { const res = await fetch(url, controller ? { signal: controller.signal } : undefined); if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`); return await res.json(); } catch (error) { if (error?.name === 'AbortError') throw new Error(`Timed out loading ${url} after ${this.timeoutMs}ms`); throw error; } finally { if (timer) clearTimeout(timer); } })(); this.cache.set(url, promise); try { return await promise; } catch (error) { this.cache.delete(url); throw error; } }
  async loadKnowledgeGraph() { try { return await this.fetchJSON(ENDPOINTS.knowledgeGraph); } catch (error) { return this.fetchJSON(ENDPOINTS.legacyKnowledgeGraph).catch(() => { throw error; }); } }
  async loadOptionalJSON(url, fallback) { try { return await this.fetchJSON(url); } catch { return fallback; } }
  async loadAll() { const [qb, kg, topics] = await Promise.all([this.loadOptionalJSON(ENDPOINTS.questionBank, { questions: [] }), this.loadKnowledgeGraph(), this.loadOptionalJSON(ENDPOINTS.topicBank, { topics: [] })]); const productionQuestions = Array.isArray(qb.questions) ? qb.questions.map(normalizeQuestion) : []; const sanitizedProductionQuestions = productionQuestions.filter(q => !day01ProductionOverrideIds.has(q.id)); const questions = [...sanitizedProductionQuestions, ...day01ProductionOverrides, ...day01DiagnosticQuestions.filter(q => q.status !== 'archived')]; const days = Array.isArray(lessonManifest.lessons) ? lessonManifest.lessons : []; return { questions, questionById: new Map(questions.map(q => [q.id, q])), knowledgeGraph: kg, manifest: lessonManifest, topics: topics.topics, days, dayById: new Map(days.map(d => [d.day, d])) }; }
  async loadLesson(id) { if (!String(id).startsWith('lesson-')) { const manifestEntry = (await this.loadAll()).days.find(day => day.day === String(id) || day.canonicalId === String(id)); id = manifestEntry?.canonicalId || id; } if (!String(id).startsWith('lesson-')) return null; return this.fetchJSON(canonicalLessonUrl(id)); }
  async loadGuidedLearning(id) { if (!String(id).startsWith('lesson-')) return null; try { return await this.fetchJSON(guidedLearningUrl(id)); } catch { if (id === 'lesson-01-material-changes-properties') return this.fetchJSON(assetUrl('content/lessons/lesson-01-guided-learning.json')).catch(() => null); return null; } }
  async loadMastery(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(masteryUrl(id)).catch(() => null); return data?.mastery || data || null; }
  async loadPractice(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(practiceUrl(id)).catch(() => null); if (!data) return null; return Array.isArray(data.questions) ? data.questions : data; }
  async loadDiagnostic(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(diagnosticUrl(id)).catch(() => null); if (!data) return null; return Array.isArray(data.diagnostics) ? data.diagnostics : data; }
  async loadExperiment(id) {
    const direct = await this.fetchJSON(assetUrl(`content/experiments/${id}.json`)).catch(() => null);
    if (direct) return direct;
    const lessons = Array.isArray(lessonManifest.lessons) ? lessonManifest.lessons : [];
    for (const entry of lessons) {
      const lesson = await this.fetchJSON(canonicalLessonUrl(entry.canonicalId)).catch(() => null);
      const embedded = lesson?.experiments?.find(experiment => experiment?.id === id);
      if (embedded) {
        const resource = embedded.resourceRef || lesson.resourceRefs?.experiment;
        const detail = resource ? await this.fetchJSON(assetUrl(resource)).catch(() => null) : null;
        if (detail?.experiments) {
          const resolved = detail.experiments.find(experiment => experiment?.id === id) || embedded;
          return { ...resolved, lessonId: lesson.id, knowledgeIds: resolved.knowledgeIds || resolved.knowledge || lesson.knowledgePoints || [] };
        }
        return { ...(detail || embedded), lessonId: lesson.id, knowledgeIds: (detail || embedded).knowledgeIds || (detail || embedded).knowledge || lesson.knowledgePoints || [] };
      }
    }
    return null;
  }
  async loadKnowledgeContent(id) { return this.fetchJSON(assetUrl(`content/knowledge/${id}.json`)).catch(() => null); }
}
export const contentLoader = new ContentLoader();
export default ContentLoader;
