import test from 'node:test';
import assert from 'node:assert/strict';
import { MasteryService } from '../app/mastery-service.js';

class FakeMasteryEngine {
  constructor() { this.mastery = new Map(); }

  update(id, evidence = {}) {
    const score = Number.isFinite(evidence.score) ? evidence.score : 0;
    this.mastery.set(id, score);
    return score;
  }

  get(id) {
    return this.mastery.get(id) ?? 0;
  }
}

test('MasteryService delegates evidence updates to MasteryEngine', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('acid', 0.8, 0.5);
  assert.equal(service.getMastery('acid'), 0.8);
});

test('MasteryService exposes engine state without recalculating mastery', () => {
  const service = new MasteryService({ engine: new FakeMasteryEngine() });
  service.recordEvidence('metal', 0.6);
  assert.deepEqual(service.getState(), { metal: 0.6 });
});
