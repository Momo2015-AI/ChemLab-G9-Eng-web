import test from 'node:test';
import assert from 'node:assert/strict';
import { MasteryService } from '../app/mastery-service.js';

class FakeMasteryEngine {
  constructor() { this.values = new Map(); }
  update(id, score, weight) {
    this.values.set(id, { score, weight });
    return this.values.get(id);
  }
  getMastery(id) { return this.values.get(id)?.score ?? 0; }
  getAll() { return Object.fromEntries(this.values); }
}

test('MasteryService delegates evidence updates to MasteryEngine', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('acid', 0.8, 0.5);
  assert.equal(service.getMastery('acid'), 0.8);
});

test('MasteryService exposes engine state without recalculating mastery', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('metal', 0.6);
  assert.deepEqual(service.getState(), { metal: { score: 0.6, weight: 1 } });
});
