/**
 * Build a dashboard mastery report from evidence.
 * Completion and mastery are deliberately kept as separate measures.
 */
export function generateMasteryReport(records = [], { masteryEngine } = {}) {
  const total = records.length;
  const completed = records.filter(item => item.status === 'completed').length;
  const knowledgeIds = [...new Set(records.map(item => item.knowledgeId).filter(Boolean))];
  const masteryValues = knowledgeIds.map(id => masteryEngine?.get(id) ?? null).filter(value => value !== null);
  const mastery = masteryValues.length
    ? masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length
    : null;
  const weakPoints = knowledgeIds
    .filter(id => masteryEngine && masteryEngine.get(id) < 0.6)
    .map(id => ({ id, mastery: masteryEngine.get(id) }));
  return { total, completed, completionRate: total ? completed / total : 0, mastery, weakPoints };
}
