/**
 * ChemLab content loader.
 * Canonical lesson IDs are the only production lesson source.
 */
import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import { day01ProductionOverrides } from '../content/questions/day01-production-overrides.js';
import lessonManifest from '../content/curriculum/lesson-manifest.js';

const APP_ROOT = new URL('../', import.meta.url);
const assetUrl = path => new URL(path, APP_ROOT).href;
const canonicalLessonUrl = id => assetUrl(`content/lessons/${id}.json`);
const guidedLearningUrl = id => assetUrl(`content/lessons/${id}-guided-learning.json`);
const masteryUrl = id => assetUrl(`content/lessons/${id}-mastery.json`);
const practiceUrl = id => assetUrl(`content/lessons/${id}-practice.json`);
const diagnosticUrl = id => assetUrl(`content/lessons/${id}-diagnostic.json`);
const transferUrl = id => assetUrl(`content/lessons/${id}-transfer.json`);
const ENDPOINTS = { knowledgeGraph: assetUrl('content/knowledge/knowledge-graph.json') };
const DEFAULT_TIMEOUT_MS = 12000;
const isRuntimeQuestion = question => Boolean(question && typeof question === 'object' && question.id) && String(question.status || '').toLowerCase() !== 'draft';
class ContentLoader {
  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) { this.cache = new Map(); this.timeoutMs = timeoutMs; }
  async fetchJSON(url) { if (this.cache.has(url)) return this.cache.get(url); const promise = (async () => { const controller = typeof AbortController !== 'undefined' ? new AbortController() : null; const timer = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : null; try { const res = await fetch(url, controller ? { signal: controller.signal } : undefined); if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`); return await res.json(); } catch (error) { if (error?.name === 'AbortError') throw new Error(`Timed out loading ${url} after ${this.timeoutMs}ms`); throw error; } finally { if (timer) clearTimeout(timer); } })(); this.cache.set(url, promise); try { return await promise; } catch (error) { this.cache.delete(url); throw error; } }
  async loadKnowledgeGraph() { return await this.fetchJSON(ENDPOINTS.knowledgeGraph); }
  // The runtime question pool is explicitly composed of the reviewed day01
  // replacement modules plus questions registered per lesson at runtime.
  // The implicit global question-bank file endpoint was removed: a missing
  // bank file used to be swallowed silently here, masking a content outage.
  async loadAll() { const kg = await this.loadKnowledgeGraph(); const questions = [...day01ProductionOverrides, ...day01DiagnosticQuestions.filter(q => q.status !== 'archived')]; const days = Array.isArray(lessonManifest.lessons) ? lessonManifest.lessons : []; return { questions, questionById: new Map(questions.map(q => [q.id, q])), knowledgeGraph: kg, manifest: lessonManifest, days, dayById: new Map(days.map(d => [d.day, d])) }; }
  async loadLesson(id) { if (!String(id).startsWith('lesson-')) { const manifestEntry = (await this.loadAll()).days.find(day => day.day === String(id) || day.canonicalId === String(id)); id = manifestEntry?.canonicalId || id; } if (!String(id).startsWith('lesson-')) return null; return this.fetchJSON(canonicalLessonUrl(id)); }
  async loadGuidedLearning(id) { if (!String(id).startsWith('lesson-')) return null; try { return await this.fetchJSON(guidedLearningUrl(id)); } catch { if (id === 'lesson-01-material-changes-properties') return this.fetchJSON(assetUrl('content/lessons/lesson-01-guided-learning.json')).catch(() => null); return null; } }
  async loadMastery(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(masteryUrl(id)).catch(() => null); const mastery = data?.mastery || data || null; if (mastery && Array.isArray(mastery.questions)) mastery.questions = mastery.questions.filter(isRuntimeQuestion); return mastery; }
  async loadPractice(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(practiceUrl(id)).catch(() => null); if (!data) return null; const questions = Array.isArray(data.questions) ? data.questions : data; return Array.isArray(questions) ? questions.filter(isRuntimeQuestion) : questions; }
  async loadDiagnostic(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(diagnosticUrl(id)).catch(() => null); if (!data) return null; const questions = Array.isArray(data.diagnostics) ? data.diagnostics : data; return Array.isArray(questions) ? questions.filter(isRuntimeQuestion) : questions; }
  async loadTransfer(id) { if (!String(id).startsWith('lesson-')) return null; const data = await this.fetchJSON(transferUrl(id)).catch(() => null); if (!data) return null; const questions = Array.isArray(data.questions) ? data.questions : Array.isArray(data) ? data : null; return questions ? questions.filter(isRuntimeQuestion) : null; }
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
  async loadInstruments() { const data = await this.fetchJSON(assetUrl('content/equipment/instruments.json')).catch(() => null); return Array.isArray(data?.instruments) ? data.instruments : []; }
}
export const contentLoader = new ContentLoader();
export default ContentLoader;
