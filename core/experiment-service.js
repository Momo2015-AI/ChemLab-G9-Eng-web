// ChemLab-G9 V1.6
// Experiment Service

import { getExperimentIdsByDay } from './experiment-loader.js';

export function getLearningExperiments(dayId, repository = {}) {
  return getExperimentIdsByDay(dayId)
    .map(id => repository[id])
    .filter(Boolean);
}

export function completeExperiment(record, experimentId, score = 0) {
  return {
    ...record,
    experiment: experimentId,
    status: 'completed',
    score,
    completedAt: new Date().toISOString()
  };
}
