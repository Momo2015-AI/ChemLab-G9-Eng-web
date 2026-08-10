import test from 'node:test';
import assert from 'node:assert/strict';
import { MasteryService } from '../app/mastery-service.js';

class FakeMasteryEngine {
  constructor() { this.mastery = new Map(); }
  get(id) { return this.mastery.get(id) ?? 0; }
  update(knowledgeId, evidence = {}) {
    const previous = this.get(knowledgeId);
    const score = Number.isFinite(evidence.score) ? Math.max(0, Math.min(1, evidence.score)) : previous;
    const weight = Number.isFinite(evidence.weight) ? Math.max(0, Math.min(1, evidence.weight)) : 0.25;
    const next = previous + (score - previous) * weight;
    this.mastery.set(knowledgeId, next);
    return next;
  }
  getState() { return Object.fromEntries(this.mastery.entries()); }
}

test('MasteryService delegates evidence updates to MasteryEngine', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('acid', 0.8, 0.5);
  // initial=0, score=0.8, weight=0.5: next = 0 + (0.8-0)*0.5 = 0.4
  assert.equal(service.getMastery('acid'), 0.4);
});

test('MasteryService exposes engine state without recalculating mastery', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('metal', 0.6);
  // initial=0, score=0.6, weight=0.25 (default): next = 0 + (0.6-0)*0.25 = 0.15
  assert.deepEqual(service.getState(), { metal: 0.15 });
});
