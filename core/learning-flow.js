// V1.6 Phase 10.5
// Learning process controller

import { getExperimentsByLesson } from './learning-link/lesson-experiment-map.js';

export function createLearningFlow(dayId) {
  return {
    dayId,
    steps: [
      'lesson',
      'knowledge',
      'experiment',
      'practice',
      'evaluation'
    ],
    recommendedExperiments: getExperimentsByLesson(dayId)
  };
}

export function getNextStep(currentStep) {
  const steps = [
    'lesson',
    'knowledge',
    'experiment',
    'practice',
    'evaluation'
  ];

  const index = steps.indexOf(currentStep);
  return index >= 0 ? steps[index + 1] || null : null;
}
