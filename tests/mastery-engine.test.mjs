import test from 'node:test';
import assert from 'node:assert/strict';
import { MasteryEngine } from '../engine/mastery-engine.js';

test('mastery update moves toward evidence score by weight', () => {
  const engine = new MasteryEngine({ initial: 0 });
  assert.equal(engine.get('k1'), 0);
  assert.equal(engine.update('k1', { score: 1, weight: 0.5 }), 0.5);
  assert.equal(engine.update('k1', { score: 1, weight: 0.5 }), 0.75);
});

test('mastery evidence is bounded', () => {
  const engine = new MasteryEngine({ initial: 0 });
  assert.equal(engine.update('k1', { score: 2, weight: 1 }), 1);
  assert.equal(engine.update('k1', { score: -1, weight: 1 }), 0);
});

test('mastery state survives save round-trips via MasteryService', async () => {
  const { MasteryService } = await import('../app/mastery-service.js');
  const service = new MasteryService();
  service.hydrate({ k1: 0.4 });
  service.recordEvidence('k1', 1, 0.5);
  assert.equal(service.getState().k1, 0.7);
});
