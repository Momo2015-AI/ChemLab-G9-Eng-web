// Knowledge Graph Engine

export class KnowledgeEngine {
  constructor() {
    this.nodes = new Map();
    this.relations = [];
  }

  addNode(node) {
    this.nodes.set(node.id, node);
  }

  addRelation(relation) {
    this.relations.push(relation);
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  findRelations(id) {
    return this.relations.filter(
      item => item.source === id || item.target === id
    );
  }
}
