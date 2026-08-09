export function getExperimentHistory(records = []) {
  return records
    .filter(item => item.experiment)
    .map(item => ({
      experiment: item.experiment,
      status: item.status,
      score: item.score || 0,
      time: item.timestamp || null
    }));
}
