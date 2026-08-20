/** ChemLab content service: stable application-facing boundary over content loader. */
import ContentLoader from './content-loader.js';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';
import { registerQuestion, knowledgeIdsOf } from '../core/diagnosis/question-knowledge-map.js';
function isRuntimeQuestion(question) { return Boolean(question && typeof question === 'object' && question.id) && String(question.status || '').toLowerCase() !== 'draft'; }
function normalizeKnowledgeGraph(graph = {}) { const relations = (graph.relations || graph.edges || []).map(relation => ({ ...relation, source: relation.source || relation.from, target: relation.target || relation.to })); return { ...graph, relations }; }
class ContentService {
  constructor(loader = new ContentLoader(), knowledgeEngineFactory = graph => new KnowledgeEngine(graph)) { this.loader = loader; this.knowledgeEngineFactory = knowledgeEngineFactory; this.data = null; this.knowledgeEngine = null; }
  async load() { if (!this.data) { this.data = await this.loader.loadAll(); this.data.knowledgeGraph = normalizeKnowledgeGraph(this.data.knowledgeGraph); this.data.questionById = new Map(this.data.questions.map(q => [q.id, q])); for (const question of this.data.questions) { const knowledge = knowledgeIdsOf(question); const commonMistake = question.commonMistake || question.mistake || null; const misconceptionIds = Array.isArray(question.misconceptionIds) ? question.misconceptionIds : []; const legacyErrors = Array.isArray(question.errors) ? question.errors : commonMistake ? [commonMistake] : []; registerQuestion(question.id, { knowledge, errors: [...new Set([...legacyErrors, ...misconceptionIds])] }); } this.knowledgeEngine = this.knowledgeEngineFactory(this.data.knowledgeGraph); } return this.data; }
  async getLesson(dayId) {
    const data = await this.load();
    const lesson = await this.loader.loadLesson(dayId).catch(() => null);
    if (lesson) {
      data.dayById.set(dayId, lesson);
      const index = data.days.findIndex(day => day.day === dayId || day.canonicalId === dayId);
      const manifestEntry = index >= 0 ? data.days[index] : null;
      if (index >= 0) data.days[index] = { ...manifestEntry, ...lesson, canonicalId: manifestEntry.canonicalId || lesson.id, id: lesson.id };
      this.registerLessonQuestions(data, lesson);
      if (manifestEntry?.displayOrder != null) lesson.displayOrder = manifestEntry.displayOrder;
    }
    return lesson || data.dayById.get(dayId) || null;
  }
  async getGuidedLearning(lessonId) { return this.loader.loadGuidedLearning(lessonId).catch(() => null); }
  async getMastery(lessonId) {
    const mastery = await this.loader.loadMastery(lessonId).catch(() => null);
    if (mastery?.questions) this.registerQuestions(this.data || await this.load(), mastery.questions);
    return mastery;
  }
  async getPractice(lessonId) {
    const questions = await this.loader.loadPractice(lessonId).catch(() => null);
    if (Array.isArray(questions) && questions.length) this.registerQuestions(this.data || await this.load(), questions);
    return questions;
  }
  async getDiagnostic(lessonId) {
    const questions = await this.loader.loadDiagnostic(lessonId).catch(() => null);
    if (Array.isArray(questions) && questions.length) this.registerQuestions(this.data || await this.load(), questions);
    return questions;
  }
  async getTransfer(lessonId) {
    const questions = await this.loader.loadTransfer(lessonId).catch(() => null);
    if (Array.isArray(questions) && questions.length) this.registerQuestions(this.data || await this.load(), questions);
    return questions;
  }
  async getQuestion(questionId) { const data = await this.load(); return data.questionById.get(questionId) || null; }
  async getLessons({ semester = null } = {}) {
    const data = await this.load();
    return data.days.filter(lesson => !semester || lesson.semester === semester);
  }
  async getQuestionsByKnowledge(knowledgeId) { const data = await this.load(); return data.questions.filter(q => knowledgeIdsOf(q).includes(knowledgeId)); }
  async getKnowledgeGraph() { const data = await this.load(); return data.knowledgeGraph; }
  async getKnowledgeGraphViewModel() { const engine = await this.getKnowledgeEngine(); return { nodes: Array.from(engine.nodes.values()), relations: [...engine.relations] }; }
  async getKnowledgeEngine() { await this.load(); return this.knowledgeEngine; }
  async getKnowledge(id) { const engine = await this.getKnowledgeEngine(); return engine.getNode(id); }
  async getPrerequisites(id) { const engine = await this.getKnowledgeEngine(); return engine.prerequisites(id); }
  async getExperimentsByKnowledge(id) { const engine = await this.getKnowledgeEngine(); return engine.experiments(id); }
  async getQuestionsByKnowledgeGraph(id) { const engine = await this.getKnowledgeEngine(); return engine.questions(id); }
  async getCommonMistakes(id) { const engine = await this.getKnowledgeEngine(); return engine.commonMistakes(id); }
  async getExperiment(id) { return this.loader.loadExperiment(id); }
  async getInstruments() { return this.loader.loadInstruments(); }
  async getExperimentCatalog({ semester = null } = {}) {
    const lessons = await this.getLessons({ semester });
    const experiments = [];
    for (const entry of lessons.filter(day => day?.canonicalId)) {
      const lesson = await this.loader.loadLesson(entry.canonicalId).catch(() => null);
      for (const item of lesson?.experiments || []) {
        const experiment = await this.getExperiment(item.id);
        if (experiment) experiments.push({ ...experiment, lessonId: lesson.id, lessonTitle: lesson.title, lessonStatus: lesson.status });
      }
    }
    return experiments;
  }

  registerLessonQuestions(data, lesson) {
    const questions = Array.isArray(lesson?.questions) ? lesson.questions : [];
    this.registerQuestions(data, questions, lesson.knowledgePoints || []);
  }

  registerQuestions(data, questions, fallbackKnowledge = []) {
    for (const rawQuestion of questions) {
      if (!isRuntimeQuestion(rawQuestion)) continue;
      if (!rawQuestion.id) continue;
      const question = {
        ...rawQuestion,
        knowledgeIds: knowledgeIdsOf(rawQuestion).length ? knowledgeIdsOf(rawQuestion) : fallbackKnowledge,
      };
      data.questionById.set(question.id, question);
      if (!data.questions.some(item => item.id === question.id)) data.questions.push(question);
      const commonMistake = question.commonMistake || question.mistake || null;
      const misconceptionIds = Array.isArray(question.misconceptionIds) ? question.misconceptionIds : [];
      const legacyErrors = Array.isArray(question.errors) ? question.errors : commonMistake ? [commonMistake] : [];
      registerQuestion(question.id, { knowledge: question.knowledgeIds, errors: [...new Set([...legacyErrors, ...misconceptionIds])] });
    }
  }
}
export const contentService = new ContentService();
export default ContentService;
