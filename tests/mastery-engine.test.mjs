import test from 'node:test';
import assert from 'node:assert/strict';
import { MasteryEngine } from '../engine/mastery-engine.js';
import { generateMasteryReport } from '../dashboard/mastery-report.js';

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

test('dashboard separates completion from mastery', () => {
  const engine = new MasteryEngine();
  engine.update('k1', { score: 1, weight: 1 });
  engine.update('k2', { score: 0.2, weight: 1 });
  const report = generateMasteryReport([
    { status: 'completed', knowledgeId: 'k1' },
    { status: 'completed', knowledgeId: 'k2' },
    { status: 'started', knowledgeId: 'k2' }
  ], { masteryEngine: engine });
  assert.equal(report.completionRate, 2 / 3);
  assert.equal(report.mastery, 0.6);
  assert.deepEqual(report.weakPoints, [{ id: 'k2', mastery: 0.2 }]);
  assert.equal('masteryRate' in report, false);
});
