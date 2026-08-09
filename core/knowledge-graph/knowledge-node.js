// Knowledge Graph Node Model

export function createKnowledgeNode({
  id,
  name,
  category = 'knowledge',
  description = '',
  level = 1
}) {
  return {
    id,
    name,
    category,
    description,
    level,
    relations: []
  };
}

export function addRelation(node, relation) {
  node.relations.push(relation);
  return node;
}
