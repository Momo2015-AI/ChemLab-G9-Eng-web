/**
 * Stable read model for UI consumers.
 * Views consume this projection rather than the mutable progress store.
 */
export function createProgressProjection(progress = {}) {
  const mastery = { ...(progress.mastery || {}) };
  const completed = normalizeCompleted(progress.completed);
  const history = Array.isArray(progress.history) ? [...progress.history] : [];
  const masteryValues = Object.values(mastery)
    .map(value => typeof value === 'number' ? value : value?.score)
    .filter(Number.isFinite)
    .map(value => Math.max(0, Math.min(1, value)));
  const masteryScore = masteryValues.length
    ? masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length
    : 0;
  const weakPoints = Object.entries(mastery)
    .map(([id, value]) => ({ id, mastery: typeof value === 'number' ? value : value?.score }))
    .filter(item => Number.isFinite(item.mastery) && item.mastery < 0.6);

  return Object.freeze({
    mastery: Object.freeze(mastery),
    completed: Object.freeze(completed),
    history: Object.freeze(history),
    masteryScore,
    weakPoints: Object.freeze(weakPoints),
    questions: history.length,
  });
}

function normalizeCompleted(value) {
  if (Array.isArray(value)) return [...value];
  if (value && typeof value === 'object') return Object.keys(value).filter(key => value[key]);
  return [];
}

export function getMasteryScore(projection, knowledgeId) {
  return projection?.mastery?.[knowledgeId] ?? 0;
}
