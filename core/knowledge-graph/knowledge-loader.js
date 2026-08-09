// Knowledge Graph Loader
// Loads chemistry knowledge nodes into the graph engine.

export class KnowledgeLoader {
  constructor(engine) {
    this.engine = engine;
  }

  load(nodes = []) {
    nodes.forEach(node => {
      this.engine.addNode(node);
    });

    return nodes.length;
  }
}
