/** ChemLab-G9 application state. Runtime learning state is persisted with progress. */
import { ProgressService } from './progress-service.js';

const STORAGE_KEY = 'chemlab_v16';
const STATE_SCHEMA_VERSION = 2;

const DEFAULT_STATE = Object.freeze({
  currentRoute: 'home',
  currentDay: null,
  currentQuiz: null,
  quizIndex: 0,
  quizAnswers: {},
  currentExperiment: null,
  currentExperimentSession: null,
  progress: {},
  learning: {},
});

function cloneDefaultState() {
  return { ...DEFAULT_STATE, quizAnswers: {}, progress: {}, learning: {} };
}

export function createAppState({ progressService = new ProgressService({ key: STORAGE_KEY }) } = {}) {
  const state = cloneDefaultState();
  state.progress = migrateProgress(progressService.load());
  state.learning = state.progress.learning;
  state.save = () => progressService.save({
    ...state.progress,
    learning: state.learning,
  });
  state.progressService = progressService;
  return state;
}

export function saveProgress(state) {
  state.save?.();
  return state;
}

export function updateRoute(state, route, params = {}) {
  state.currentRoute = route?.page || route || 'home';
  state.routeParams = route?.params || params;
  return state;
}

export function resetSession(state) {
  state.currentDay = null;
  state.currentQuiz = null;
  state.quizIndex = 0;
  state.quizAnswers = {};
  state.currentExperiment = null;
  state.currentExperimentSession = null;
  return state;
}

export { STORAGE_KEY };
export { STATE_SCHEMA_VERSION };

function migrateProgress(progress = {}) {
  const source = progress && typeof progress === 'object' ? progress : {};
  const legacyLearning = source.learning && typeof source.learning === 'object' ? source.learning : {};
  const lessons = { ...(legacyLearning.lessons || {}) };
  for (const field of ['guided', 'experiment', 'practice', 'diagnosis', 'remediation', 'recheck', 'mastery']) {
    const value = legacyLearning[field];
    const lessonId = value?.lessonId;
    if (lessonId && !lessons[lessonId]?.[field]) lessons[lessonId] = { ...(lessons[lessonId] || {}), [field]: value };
  }
  return {
    ...source,
    schemaVersion: STATE_SCHEMA_VERSION,
    learning: { ...legacyLearning, lessons },
  };
}
