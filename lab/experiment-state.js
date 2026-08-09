// ChemLab LAB Engine V1.6
// Experiment state management foundation

export const ExperimentState = {
  READY: 'ready',
  RUNNING: 'running',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export function createExperimentState(experiment) {
  return {
    id: experiment.id || '',
    status: ExperimentState.READY,
    currentStep: 0,
    completedSteps: [],
    errors: []
  };
}

export function updateStep(state, stepIndex) {
  return {
    ...state,
    currentStep: stepIndex,
    completedSteps: [...new Set([...state.completedSteps, stepIndex])]
  };
}
