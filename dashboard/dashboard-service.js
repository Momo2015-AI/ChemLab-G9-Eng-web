// Dashboard Service
// Aggregates learning progress, mastery report and experiment history

import { getLearningProgress } from './learning-progress.js';
import { getMasteryReport } from './mastery-report.js';
import { getExperimentHistory } from './experiment-history.js';

export function getDashboardData(user = 'local') {
  return {
    user,
    progress: getLearningProgress(user),
    mastery: getMasteryReport(user),
    experiments: getExperimentHistory(user)
  };
}

export default {
  getDashboardData
};
