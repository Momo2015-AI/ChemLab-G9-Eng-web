// Learning Path Engine
// Generates next learning suggestions from knowledge graph.

export class LearningPathEngine {
  constructor(engine) {
    this.engine = engine;
  }

  recommend(knowledgeId) {
    const relations = this.engine.findRelations(knowledgeId) || [];

    return relations.map(item => ({
      target: item.target,
      type: item.type
    }));
  }
}
