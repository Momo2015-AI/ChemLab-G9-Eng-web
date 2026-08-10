/**
 * Stable read model for UI consumers.
 * Views should consume this projection rather than the mutable progress store.
 */
export function createProgressProjection(progress = {}) {
  const mastery = { ...(progress.mastery || {}) };
  const completed = Array.isArray(progress.completed) ? [...progress.completed] : [];
  const history = Array.isArray(progress.history) ? [...progress.history] : [];

  return Object.freeze({
    mastery: Object.freeze(mastery),
    completed: Object.freeze(completed),
    history: Object.freeze(history),
  });
}

export function getMasteryScore(projection, knowledgeId) {
  return projection?.mastery?.[knowledgeId] ?? 0;
}
