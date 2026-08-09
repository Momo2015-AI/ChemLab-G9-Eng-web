/**
 * ChemLab V1.5 Knowledge Engine
 * Resolves prerequisite, related, experiment, question and mistake links.
 */
export class KnowledgeEngine {
  constructor(graph = { nodes: [] }) {
    this.nodes = new Map((graph.nodes || []).map(node => [node.id, node]));
  }

  register(item) {
    this.nodes.set(item.id, item);
    return item;
  }

  get(id) {
    return this.nodes.get(id) || null;
  }

  related(id, relation = 'related') {
    const node = this.get(id);
    return (node?.relations?.[relation] || [])
      .map(ref => this.get(ref) || ref);
  }

  prerequisites(id) { return this.related(id, 'prerequisite'); }
  experiments(id) { return this.related(id, 'experiment'); }
  questions(id) { return this.related(id, 'question'); }
  commonMistakes(id) { return this.related(id, 'commonMistake'); }
}
