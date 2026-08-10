/**
 * ChemLab-G9 V1.7 Application State
 * Transitional state boundary for the V1.7 refactor.
 */

const STORAGE_KEY = 'chemlab_v16';

const DEFAULT_STATE = Object.freeze({
  currentRoute: 'home',
  currentDay: null,
  currentQuiz: null,
  quizIndex: 0,
  quizAnswers: {},
  currentExperiment: null,
  currentExperimentSession: null,
  progress: {},
});

function cloneDefaultState() {
  return { ...DEFAULT_STATE, quizAnswers: {}, progress: {} };
}

function readPersistedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress ?? {}));
}

export function createAppState() {
  const state = cloneDefaultState();
  state.progress = readPersistedProgress();
  state.save = () => saveProgress(state.progress);
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