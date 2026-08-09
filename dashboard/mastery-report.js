export function generateMasteryReport(records = []) {
  const total = records.length;
  const completed = records.filter(item => item.status === 'completed').length;

  return {
    total,
    completed,
    masteryRate: total ? Math.round((completed / total) * 100) : 0,
    weakPoints: []
  };
}
