/**
 * Experiment Engine
 * Drives structured chemistry experiments.
 */

export class ExperimentEngine {
  loadExperiment(data) {
    return {
      id: data.id,
      name: data.name,
      instruments: data.instruments || [],
      materials: data.materials || [],
      steps: data.steps || []
    };
  }

  getStep(experiment, index) {
    return experiment.steps[index];
  }
}
