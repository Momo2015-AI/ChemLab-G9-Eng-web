// ChemLab-G9 V1.6
// Experiment Loader

import { experimentMap } from './learning-link/lesson-experiment-map.js';

export function getExperimentIdsByDay(dayId) {
  return experimentMap[dayId]?.experiments || [];
}

export function loadExperiment(dayId, experimentId, experiments = {}) {
  const ids = getExperimentIdsByDay(dayId);

  if (!ids.includes(experimentId)) {
    return null;
  }

  return experiments[experimentId] || null;
}

export function listExperiments(dayId) {
  return getExperimentIdsByDay(dayId);
}
