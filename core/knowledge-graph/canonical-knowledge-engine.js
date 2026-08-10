/** Canonical V1.7 knowledge graph engine. */
export class KnowledgeEngine {
  constructor(graph = {}) {
    this.nodes = new Map();
    this.relations = [];
    for (const node of graph.nodes || []) this.addNode(node);
    for (const relation of graph.relations || []) this.addRelation(relation);
  }
  addNode(node) { if (!node?.id) throw new TypeError('Knowledge node requires an id'); this.nodes.set(node.id, node); return node; }
  addRelation(relation) { if (!relation?.source || !relation?.target) throw new TypeError('Knowledge relation requires source and target'); this.relations.push(relation); return relation; }
  register(node) { return this.addNode(node); }
  get(id) { return this.nodes.get(id) || null; }
  getNode(id) { return this.get(id); }
  findRelations(id, type) { return this.relations.filter(item => (item.source === id || item.target === id) && (!type || item.type === type)); }
  related(id, type = 'related') {
    const explicit = this.findRelations(id, type).map(r => this.get(r.source === id ? r.target : r.source)).filter(Boolean);
    if (explicit.length) return explicit;
    const node = this.get(id);
    return (node?.relations?.[type] || []).map(ref => this.get(ref) || ref);
  }
  prerequisites(id) { return this.related(id, 'prerequisite'); }
  experiments(id) { return this.related(id, 'experiment'); }
  questions(id) { return this.related(id, 'question'); }
  commonMistakes(id) { return this.related(id, 'commonMistake'); }
}
