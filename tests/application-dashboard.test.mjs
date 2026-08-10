import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgressProjection } from '../app/progress-projection.js';

test('dashboard data is projected from progress rather than exposing mutable state', () => {
  const state = {
    progress: {
      mastery: { oxygen: 0.8 },
      completed: ['day-01'],
      history: [],
    },
  };

  const projection = createProgressProjection(state.progress);
  assert.deepEqual(projection.mastery, { oxygen: 0.8 });
  assert.deepEqual(projection.completed, ['day-01']);

  state.progress.mastery.oxygen = 0.1;
  assert.equal(projection.mastery.oxygen, 0.8);
});
