import test from 'node:test';
import assert from 'node:assert/strict';
import { renderRemediation } from '../views/remediation-view.js';

function createRoot() {
  return {
    innerHTML: '',
    querySelector() { return null; },
    querySelectorAll() { return []; },
  };
}

test('remediation view renders plan steps and escapes dynamic values', () => {
  const root = createRoot();

  renderRemediation({
    root,
    plan: {
      status: 'needs-remediation',
      steps: [
        { type: 'practice', resourceId: '<lesson>', reason: '<reason>' },
        { type: 'recheck', reason: 'verify' },
      ],
    },
  });

  assert.match(root.innerHTML, /你的下一步学习计划/);
  assert.match(root.innerHTML, /针对性练习/);
  assert.match(root.innerHTML, /&lt;lesson&gt;/);
  assert.doesNotMatch(root.innerHTML, /<lesson>/);
  assert.match(root.innerHTML, /data-recheck/);
});

test('remediation review steps link to guided learning cards for the knowledge point', () => {
  const root = createRoot();

  renderRemediation({
    root,
    lessonId: 'lesson-01-material-changes-properties',
    guidedLearning: {
      steps: [
        { id: 'L01-S05', title: '认识物理性质', knowledgePoints: ['physical-property'] },
      ],
    },
    plan: {
      status: 'needs-remediation',
      steps: [
        { type: 'review', knowledgeId: 'physical-property', reason: 'knowledge-gap' },
        { type: 'recheck', reason: 'verify-remediation' },
      ],
    },
  });

  assert.match(root.innerHTML, /回到「认识物理性质」复习/);
  assert.match(root.innerHTML, /data-review="physical-property"/);
});

test('remediation view offers transfer action when ready for transfer', () => {
  const root = createRoot();
  renderRemediation({ root, plan: { status: 'ready-for-transfer', steps: [{ type: 'transfer' }] } });
  assert.match(root.innerHTML, /可以进入迁移任务/);
  assert.match(root.innerHTML, /data-transfer/);
});
