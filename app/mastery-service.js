import { MasteryEngine } from '../engine/mastery-engine.js';

/**
 * Application-facing mastery boundary.
 * UI code consumes mastery state but never calculates it.
 */
export class MasteryService {
  constructor({ engine = new MasteryEngine() } = {}) {
    this.engine = engine;
  }

  recordEvidence(knowledgeId, score, weight = 0.25) {
    return this.engine.update(knowledgeId, { score, weight });
  }

  getMastery(knowledgeId) {
    return this.engine.get(knowledgeId);
  }

  getState() {
    return Object.fromEntries(this.engine.mastery.entries());
  }
}
