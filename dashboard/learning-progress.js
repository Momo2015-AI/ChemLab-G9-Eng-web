// V1.6 Learning Dashboard - Progress Module

export function calculateProgress(records = []) {
  const total = records.length;
  if (!total) {
    return {
      completed: 0,
      total: 0,
      percentage: 0
    };
  }

  const completed = records.filter(
    record => record.status === "completed"
  ).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
}

export function buildLearningSummary(records = []) {
  return {
    progress: calculateProgress(records),
    experiments: records.map(record => ({
      id: record.experiment,
      status: record.status,
      score: record.score || 0
    }))
  };
}
