/**
 * V1.8 data-driven remediation catalog.
 *
 * The catalog is derived from canonical loaded content instead of maintaining
 * a second hard-coded list of chemistry resources. Every knowledge node gets
 * a review resource id and, when available, a targeted practice question.
 */
export function createRemediationCatalog(data = {}) {
  const catalog = {};
  const questions = Array.isArray(data.questions) ? data.questions : [];
  const knowledgeNodes = Array.isArray(data.knowledgeGraph?.nodes) ? data.knowledgeGraph.nodes : [];

  for (const node of knowledgeNodes) {
    const practice = questions.find(question => {
      const ids = question.knowledgeIds
        ?? question.knowledgePoints
        ?? question.knowledgeId
        ?? question.knowledge
        ?? [];
      const values = Array.isArray(ids) ? ids : [ids];
      return values.includes(node.id);
    });

    catalog[node.id] = {
      reviewId: node.id,
      practiceId: practice?.id || null,
    };
  }

  return catalog;
}
