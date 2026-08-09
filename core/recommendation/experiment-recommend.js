// V1.6 Experiment Recommendation Engine
// Based on learning records and knowledge mastery

export function recommendExperiment(records = [], knowledge = []) {
  const incomplete = records.filter(r => r.status !== 'completed');

  if (incomplete.length > 0) {
    return {
      type: 'retry',
      reason: 'experiment_incomplete',
      experiments: incomplete.map(r => r.experiment)
    };
  }

  if (knowledge.length > 0) {
    return {
      type: 'review',
      reason: 'knowledge_reinforcement',
      knowledge
    };
  }

  return {
    type: 'continue',
    reason: 'learning_progress_good'
  };
}
