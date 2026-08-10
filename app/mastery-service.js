import { MasteryEngine } from '../engine/mastery-engine.js';

/**
 * Application-facing mastery boundary.
 * The UI may consume mastery state, but must not calculate it itself.
 */
export class MasteryService {
  constructor({ engine = new MasteryEngine(), state } = {}) {
    this.engine = engine;
    this.state = state;
  }

  recordEvidence(nodeId, score, weight = 1) {
    return this.engine.update(nodeId, score, weight);
  }

  getMastery(nodeId) {
    return this.engine.getMastery(nodeId);
  }

  getState() {
    return this.engine.getAll();
  }
}
