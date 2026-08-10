import test from 'node:test';
import assert from 'node:assert/strict';
import { createRouter, parseHash, ROUTES } from '../app/router.js';

test('router accepts canonical routes and rejects unknown pages', () => {
  assert.deepEqual(parseHash('#course/day-02'), { page: 'course', params: ['day-02'] });
  assert.deepEqual(parseHash('#unknown/foo'), { page: 'home', params: ['foo'] });
  assert.equal(ROUTES.has('dashboard'), true);
});

test('router start is idempotent and stop removes lifecycle listener', () => {
  const previousWindow = globalThis.window;
  const listeners = new Map();
  globalThis.window = {
    location: { hash: '#home' },
    addEventListener(type, fn) { listeners.set(type, fn); },
    removeEventListener(type, fn) {
      if (listeners.get(type) === fn) listeners.delete(type);
    },
  };

  try {
    let rendered = 0;
    const router = createRouter({ render: () => { rendered += 1; } });
    router.start();
    router.start();
    assert.equal(rendered, 1);
    assert.equal(listeners.has('hashchange'), true);

    router.stop();
    assert.equal(listeners.has('hashchange'), false);
  } finally {
    globalThis.window = previousWindow;
  }
});
