export const ExperimentSchema = {
  id: '',
  title: '',
  day: '',
  category: '',
  objective: [],
  materials: [],
  instruments: [],
  steps: [],
  observations: [],
  conclusion: '',
  safety: [],
  assessment: {
    operation: 0,
    observation: 0,
    conclusion: 0
  }
};

export function createExperiment(data = {}) {
  return {
    ...ExperimentSchema,
    ...data,
    assessment: {
      ...ExperimentSchema.assessment,
      ...(data.assessment || {})
    }
  };
}
