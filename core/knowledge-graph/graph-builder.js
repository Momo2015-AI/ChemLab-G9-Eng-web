// Knowledge Graph Builder
// Builds relations between knowledge, experiments and questions.

export class GraphBuilder {
  constructor(engine) {
    this.engine = engine;
  }

  buildRelations(items = []) {
    items.forEach(item => {
      if (item.relations) {
        item.relations.forEach(relation => {
          this.engine.addRelation(relation);
        });
      }
    });
  }
}
