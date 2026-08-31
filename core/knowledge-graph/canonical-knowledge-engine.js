/** Canonical V1.7 knowledge graph engine. */
export class KnowledgeEngine {
  constructor(graph = {}) {
    this.nodes = new Map();
    this.relations = [];
    for (const node of graph.nodes || []) this.addNode(node);
    for (const relation of graph.relations || graph.edges || []) this.addRelation(relation);
  }

  addNode(node) {
    if (!node?.id) throw new TypeError('Knowledge node requires an id');
    this.nodes.set(node.id, node);
    return node;
  }

  addRelation(relation) {
    if (!relation?.source || !relation?.target) throw new TypeError('Knowledge relation requires source and target');
    this.relations.push(relation);
    return relation;
  }

  register(node) { return this.addNode(node); }
  get(id) { return this.nodes.get(id) || null; }
  getNode(id) { return this.get(id); }
  hasNode(id) { return this.nodes.has(id); }

  findRelations(id, type) {
    return this.relations.filter(item =>
      (item.source === id || item.target === id) && (!type || item.type === type)
    );
  }

  related(id, type = 'related') {
    const explicit = this.findRelations(id, type)
      .map(r => this.get(r.source === id ? r.target : r.source))
      .filter(Boolean);
    if (explicit.length) return explicit;
    const node = this.get(id);
    return (node?.relations?.[type] || []).map(ref => this.get(ref) || ref);
  }

  prerequisites(id) {
    const explicit = this.relations
      .filter(r => r.type === 'prerequisite' && r.target === id)
      .map(r => this.get(r.source))
      .filter(Boolean);
    if (explicit.length) return explicit;
    const node = this.get(id);
    return (node?.relations?.prerequisite || []).map(ref => this.get(ref) || ref);
  }

  prerequisiteEntries(id) {
    return this.relations
      .filter(r => r.type === 'prerequisite' && r.target === id)
      .map(r => ({ node: this.get(r.source), relation: r }))
      .filter(entry => entry.node);
  }

  dependents(id) {
    return this.relations
      .filter(r => r.type === 'prerequisite' && r.source === id)
      .map(r => this.get(r.target))
      .filter(Boolean);
  }

  relatedNodes(id) { return this.related(id, 'related'); }
  experiments(id) { return this.relatedRefs(id, 'experiment'); }
  questions(id) { return this.relatedRefs(id, 'question'); }
  commonMistakes(id) { return this.relatedRefs(id, 'commonMistake'); }
  contrasts(id) { return this.related(id, 'contrast'); }

  relatedRefs(id, type) {
    return this.findRelations(id, type)
      .map(r => this.get(r.source === id ? r.target : r.source) || (r.source === id ? r.target : r.source));
  }

  traverse(id, direction, visited = new Set()) {
    if (visited.has(id)) return [];
    visited.add(id);
    const next = direction === 'up' ? this.prerequisites(id) : this.dependents(id);
    const result = [];
    for (const node of next) {
      if (!node || visited.has(node.id)) continue;
      result.push(node);
      result.push(...this.traverse(node.id, direction, visited));
    }
    return result;
  }

  ancestors(id) { return this.traverse(id, 'up'); }
  descendants(id) { return this.traverse(id, 'down'); }

  learningPath(id) {
    const prerequisites = this.ancestors(id);
    return [...prerequisites, this.get(id)].filter(Boolean);
  }

  sortedLearningPath(id) {
    const ancestors = this.traverse(id, 'up');
    const ancestorIds = new Set(ancestors.map(node => node?.id).filter(Boolean));
    const decorated = ancestors
      .filter(Boolean)
      .map(node => ({
        node,
        relation: this.relations.find(r => r.type === 'prerequisite' && r.source === node.id && (r.target === id || ancestorIds.has(r.target))) || null,
      }));
    decorated.sort((a, b) => {
      const aRequired = a.relation?.required !== false;
      const bRequired = b.relation?.required !== false;
      if (aRequired !== bRequired) return aRequired ? -1 : 1;
      const aWeight = typeof a.relation?.weight === 'number' ? a.relation.weight : 1;
      const bWeight = typeof b.relation?.weight === 'number' ? b.relation.weight : 1;
      return bWeight - aWeight;
    });
    const self = this.get(id);
    return [...decorated.map(entry => entry.node), self].filter(Boolean);
  }
}
