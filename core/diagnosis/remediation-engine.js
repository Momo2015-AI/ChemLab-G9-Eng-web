/**
 * Converts diagnosis results into an actionable, deterministic remediation plan.
 * This layer contains learning-policy decisions, not UI rendering.
 */

const DEFAULT_REVIEW = { type: 'review', reason: 'diagnosis-review' };

export function createRemediationPlan(diagnosis, { catalog = {} } = {}) {
  if (!diagnosis || diagnosis.status === 'unknown') {
    return { status: 'unavailable', steps: [] };
  }

  if (diagnosis.status === 'correct') {
    return {
      status: 'ready-for-transfer',
      steps: [{ type: 'transfer', reason: 'demonstrated-understanding' }],
    };
  }

  const knowledge = Array.isArray(diagnosis.knowledge) ? diagnosis.knowledge : [];
  const errors = Array.isArray(diagnosis.possibleErrors) ? diagnosis.possibleErrors : [];
  const steps = [];

  for (const knowledgeId of knowledge) {
    const item = catalog[knowledgeId] || {};
    steps.push({
      type: 'review',
      knowledgeId,
      resourceId: item.reviewId || null,
      reason: errors[0] || 'knowledge-gap',
    });

    if (item.practiceId) {
      steps.push({
        type: 'practice',
        knowledgeId,
        resourceId: item.practiceId,
        reason: 'targeted-retrieval',
      });
    }
  }

  if (steps.length === 0) steps.push(DEFAULT_REVIEW);

  steps.push({ type: 'recheck', reason: 'verify-remediation' });

  return {
    status: 'needs-remediation',
    steps,
  };
}
