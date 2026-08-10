import test from 'node:test';
import assert from 'node:assert/strict';
import { ProgressService } from '../app/progress-service.js';

function storage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  };
}

test('ProgressService persists and restores progress', () => {
  const service = new ProgressService({ storage: storage() });
  const progress = { mastery: { acid: { score: 0.7 } } };
  service.save(progress);
  assert.deepEqual(service.load(), progress);
});

test('ProgressService returns empty state for malformed storage', () => {
  const store = storage();
  store.setItem('chemlab_v16', '{broken');
  const service = new ProgressService({ storage: store });
  assert.deepEqual(service.load(), {});
});
