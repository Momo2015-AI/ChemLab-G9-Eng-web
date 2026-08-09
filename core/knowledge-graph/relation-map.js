// Knowledge Graph Relation Map

export const RELATION_TYPES = {
  KNOWLEDGE_EXPERIMENT: 'knowledge_to_experiment',
  KNOWLEDGE_QUESTION: 'knowledge_to_question',
  KNOWLEDGE_ERROR: 'knowledge_to_error'
};

export function createRelation(source, target, type) {
  return {
    source,
    target,
    type
  };
}
