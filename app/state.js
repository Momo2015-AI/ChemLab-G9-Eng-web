/**
 * ChemLab-G9 V1.7 Application State
 * Owns in-memory application state; persistence is delegated to ProgressService.
 */

import { ProgressService } from './progress-service.js';

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

export function createAppState({ progressService = new ProgressService({ key: STORAGE_KEY }) } = {}) {
  const state = cloneDefaultState();
  state.progress = progressService.load();
  state.save = () => progressService.save(state.progress);
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