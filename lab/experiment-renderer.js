// ChemLab LAB Engine V1
// Experiment renderer foundation

export function renderExperiment(experiment) {
  return {
    title: experiment.title,
    objective: experiment.objective,
    equipment: experiment.equipment || [],
    steps: experiment.steps || [],
    observation: experiment.observation || [],
    equation: experiment.equation || '',
    safety: experiment.safety || []
  };
}

export function createSection(title, content) {
  return {
    title,
    content
  };
}
