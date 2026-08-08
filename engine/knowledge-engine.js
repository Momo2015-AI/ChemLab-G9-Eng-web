/**
 * Knowledge Engine
 * Connects lessons, knowledge points and questions.
 */

export class KnowledgeEngine {
  constructor() {
    this.knowledgeMap = new Map();
  }

  register(item) {
    this.knowledgeMap.set(item.id, item);
  }

  get(id) {
    return this.knowledgeMap.get(id);
  }

  findRelated(ids = []) {
    return ids.map(id => this.get(id)).filter(Boolean);
  }
}
