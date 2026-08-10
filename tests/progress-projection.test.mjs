import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressProjection, getMasteryScore } from '../app/progress-projection.js';

test('progress projection exposes a stable read model', () => {
  const progress = {
    mastery: { oxygen: 0.75 },
    completed: ['day-01'],
    history: [{ activity: 'q1' }],
  };
  const projection = createProgressProjection(progress);

  assert.deepEqual(projection.mastery, { oxygen: 0.75 });
  assert.deepEqual(projection.completed, ['day-01']);
  assert.equal(projection.masteryScore, 0.75);
  assert.deepEqual(projection.weakPoints, []);
  assert.equal(projection.questions, 1);
  assert.deepEqual(projection.completed, ['day-01']);
  assert.equal(getMasteryScore(projection, 'oxygen'), 0.75);
  assert.equal(getMasteryScore(projection, 'missing'), 0);

  assert.notEqual(projection.mastery, progress.mastery);
  assert.notEqual(projection.completed, progress.completed);
});

test('projection normalizes legacy completed object shape', () => {
  const projection = createProgressProjection({
    mastery: { oxygen: 0.25, water: 0.8 },
    completed: { 'day-01': true, 'day-02': false, 'day-03': 1 },
    history: [],
  });

  assert.deepEqual(projection.completed, ['day-01', 'day-03']);
  assert.equal(projection.masteryScore, 0.525);
  assert.deepEqual(projection.weakPoints, [{ id: 'oxygen', mastery: 0.25 }]);
});

test('projection remains unchanged when source progress mutates', () => {
  const progress = { mastery: { oxygen: 0.5 }, completed: [] };
  const projection = createProgressProjection(progress);
  progress.mastery.oxygen = 1;
  progress.completed.push('day-01');

  assert.equal(projection.mastery.oxygen, 0.5);
  assert.deepEqual(projection.completed, []);
});
