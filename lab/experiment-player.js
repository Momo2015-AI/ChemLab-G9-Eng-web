// ChemLab LAB Engine V1.6
// Interactive experiment player foundation

import { createExperimentState, updateStep, ExperimentState } from './experiment-state.js';

export function startExperiment(experiment) {
  return createExperimentState(experiment);
}

export function nextStep(state, totalSteps) {
  const next = Math.min(state.currentStep + 1, totalSteps - 1);
  const updated = updateStep(state, next);

  if (next === totalSteps - 1) {
    updated.status = ExperimentState.COMPLETED;
  } else {
    updated.status = ExperimentState.RUNNING;
  }

  return updated;
}

export function reportError(state, error) {
  return {
    ...state,
    status: ExperimentState.ERROR,
    errors: [...state.errors, error]
  };
}
