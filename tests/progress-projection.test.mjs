import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressProjection, getMasteryScore, isLessonCompleted } from '../app/progress-projection.js';

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

test('isLessonCompleted reads both array and object completed shapes', () => {
  assert.equal(isLessonCompleted(['day-01', 'day-03'], 'day-01'), true);
  assert.equal(isLessonCompleted(['day-01'], 'day-03'), false);
  assert.equal(isLessonCompleted({ 'day-01': true, 'day-02': false }, 'day-01'), true);
  assert.equal(isLessonCompleted({ 'day-01': true }, 'day-02'), false);
  assert.equal(isLessonCompleted(undefined, 'day-01'), false);
});

test('projection questions counts answered totals, falling back to round count', () => {
  const withTotals = createProgressProjection({ history: [{ total: 20 }, { total: 10 }] });
  assert.equal(withTotals.questions, 30);
  const legacy = createProgressProjection({ history: [{ activity: 'q1' }] });
  assert.equal(legacy.questions, 1);
});
