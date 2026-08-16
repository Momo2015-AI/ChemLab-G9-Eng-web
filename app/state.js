/** ChemLab-G9 application state. Runtime learning state is persisted with progress. */
import { ProgressService, STORAGE_KEY } from './progress-service.js';

const STATE_SCHEMA_VERSION = 2;
const HISTORY_LIMIT = 100;

const DEFAULT_STATE = Object.freeze({
  currentRoute: 'home',
  currentDay: null,
  currentExperiment: null,
  currentExperimentSession: null,
  progress: {},
  learning: {},
});

function cloneDefaultState() {
  return { ...DEFAULT_STATE, progress: {}, learning: {} };
}

function capHistory(progress) {
  if (Array.isArray(progress.history) && progress.history.length > HISTORY_LIMIT) {
    progress.history = progress.history.slice(-HISTORY_LIMIT);
  }
  return progress;
}

export function createAppState({ progressService = new ProgressService({ key: STORAGE_KEY }) } = {}) {
  const state = cloneDefaultState();
  state.progress = migrateProgress(progressService.load());
  state.learning = state.progress.learning;
  state.save = () => capHistory(state.progress) && progressService.save({
    ...state.progress,
    learning: state.learning,
  });
  state.progressService = progressService;
  return state;
}

export { STORAGE_KEY };
export { STATE_SCHEMA_VERSION };

function migrateProgress(progress = {}) {
  const source = progress && typeof progress === 'object' ? progress : {};
  const legacyLearning = source.learning && typeof source.learning === 'object' ? source.learning : {};
  const lessons = { ...(legacyLearning.lessons || {}) };
  const writeField = (lessonId, field, value) => {
    if (lessonId && value && !lessons[lessonId]?.[field]) {
      lessons[lessonId] = { ...(lessons[lessonId] || {}), [field]: value };
    }
  };
  for (const field of ['guided', 'experiment', 'practice', 'diagnosis', 'remediation', 'recheck', 'transfer']) {
    const value = legacyLearning[field];
    writeField(value?.lessonId, field, value);
  }
  // mastery can be either a single legacy record (with lessonId) or a
  // lessonId -> record map produced by earlier runtime versions; both must
  // land in the per-lesson state.
  const legacyMastery = legacyLearning.mastery;
  if (legacyMastery && typeof legacyMastery === 'object') {
    if (legacyMastery.lessonId) {
      writeField(legacyMastery.lessonId, 'mastery', legacyMastery);
    } else {
      for (const [lessonId, record] of Object.entries(legacyMastery)) {
        writeField(lessonId, 'mastery', record);
      }
    }
  }
  return {
    ...source,
    schemaVersion: STATE_SCHEMA_VERSION,
    learning: { ...legacyLearning, lessons },
  };
}
