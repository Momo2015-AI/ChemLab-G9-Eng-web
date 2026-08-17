import test from 'node:test';
import assert from 'node:assert/strict';
import { renderKnowledgeDetail } from '../views/knowledge-detail-view.js';

function createRoot() {
  return {
    innerHTML: '',
    querySelector() { return null; },
    querySelectorAll() { return []; },
  };
}

test('renderKnowledgeDetail renders missing node with empty state', () => {
  const root = createRoot();
  renderKnowledgeDetail({ root, node: null, onBack: () => {}, onLearn: () => {} });
  assert.match(root.innerHTML, /知识点未找到/);
});

test('renderKnowledgeDetail renders node definition', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: { id: 'mc-matter-atom', name: '原子结构', domain: 'matter', definition: '原子是化学变化中的最小粒子。' },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /原子结构/);
  assert.match(root.innerHTML, /原子是化学变化中的最小粒子/);
  assert.match(root.innerHTML, /物质基础/);
});

test('renderKnowledgeDetail escapes HTML in node fields', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: { id: 'x', name: '<script>alert(1)</script>', domain: 'method', definition: '<b>bold</b>' },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /&lt;script&gt;/);
  assert.match(root.innerHTML, /&lt;b&gt;/);
  assert.doesNotMatch(root.innerHTML, /<script>/);
});

test('renderKnowledgeDetail shows misconceptions section', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: {
      id: 'mc-acid-ph',
      name: 'pH与酸碱性',
      domain: 'acid',
      definition: 'pH表示溶液酸碱度。',
      misconceptionIds: ['mc-acid-ph-confusion'],
    },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /常见误解/);
});

test('renderKnowledgeDetail shows prerequisites section', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: {
      id: 'test-node',
      name: '测试节点',
      domain: 'matter',
      definition: '测试定义。',
      prerequisiteIds: ['mc-matter-atom'],
    },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /前置知识/);
  assert.match(root.innerHTML, /mc-matter-atom/);
});

test('renderKnowledgeDetail renders remediationGoal', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: {
      id: 'test-node',
      name: '测试节点',
      domain: 'reaction',
      definition: '测试。',
      remediationGoal: '掌握化学方程式的配平方法。',
    },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /补救目标/);
  assert.match(root.innerHTML, /掌握化学方程式的配平方法/);
});

test('renderKnowledgeDetail renders bloom levels', () => {
  const root = createRoot();
  renderKnowledgeDetail({
    root,
    node: {
      id: 'test-node',
      name: '测试节点',
      domain: 'method',
      definition: '测试。',
      bloomLevels: ['分析', '评价'],
    },
    onBack: () => {},
  });
  assert.match(root.innerHTML, /认知层次/);
  assert.match(root.innerHTML, /分析/);
  assert.match(root.innerHTML, /评价/);
});
