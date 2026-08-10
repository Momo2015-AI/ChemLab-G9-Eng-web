import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRemediation } from '../views/remediation-view.js';

test('remediation view renders plan steps and escapes dynamic values', () => {
  const root = { innerHTML: '' };
  renderRemediation({
    root,
    plan: {
      status: 'needs-remediation',
      steps: [
        { type: 'review', resourceId: '<lesson>', reason: '<reason>' },
        { type: 'recheck', reason: 'verify' },
      ],
    },
  });

  assert.match(root.innerHTML, /Your next learning steps/);
  assert.match(root.innerHTML, /&lt;lesson&gt;/);
  assert.doesNotMatch(root.innerHTML, /<lesson>/);
});
