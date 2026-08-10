import { MasteryEngine } from '../engine/mastery-engine.js';

/**
 * Application-facing mastery boundary.
 * UI code consumes mastery state but never calculates it.
 */
export class MasteryService {
  constructor({ engine = new MasteryEngine() } = {}) {
    this.engine = engine;
  }

  hydrate(state = {}) {
    const mastery = state && typeof state === 'object' ? state : {};
    for (const [knowledgeId, value] of Object.entries(mastery)) {
      if (Number.isFinite(value)) {
        this.engine.mastery.set(knowledgeId, Math.max(0, Math.min(1, value)));
      }
    }
    return this.getState();
  }

  recordEvidence(knowledgeId, score, weight = 0.25) {
    if (!knowledgeId) return null;
    return this.engine.update(knowledgeId, { score, weight });
  }

  getMastery(knowledgeId) {
    return this.engine.get(knowledgeId);
  }

  getState() {
    return Object.fromEntries(this.engine.mastery.entries());
  }
}