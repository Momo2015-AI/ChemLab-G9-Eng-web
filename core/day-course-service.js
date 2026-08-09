// Day Course Service V1.6
// Connects lesson data with experiment and learning flow

import { getExperimentIdsByDay } from './learning-link/lesson-experiment-map.js';
import { getLearningExperiments } from './experiment-service.js';

export function getDayLearningPackage(dayId) {
  return {
    day: dayId,
    experiments: getLearningExperiments(dayId),
    experimentIds: getExperimentIdsByDay(dayId)
  };
}

export default {
  getDayLearningPackage
};
