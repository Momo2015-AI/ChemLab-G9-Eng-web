import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';

test('canonical graph resolves explicit relations', () => {
  const graph = new KnowledgeEngine({
    nodes: [{ id: 'atom' }, { id: 'element' }, { id: 'lab-1' }],
    relations: [
      { source: 'atom', target: 'element', type: 'prerequisite' },
      { source: 'element', target: 'lab-1', type: 'experiment' }
    ]
  });
  assert.equal(graph.getNode('atom').id, 'atom');
  assert.deepEqual(graph.prerequisites('element').map(n => n.id), ['atom']);
  assert.deepEqual(graph.experiments('element').map(n => n.id), ['lab-1']);
});

test('canonical graph supports legacy embedded relations', () => {
  const graph = new KnowledgeEngine({ nodes: [
    { id: 'reaction', relations: { prerequisite: ['atom'] } },
    { id: 'atom' }
  ]});
  assert.deepEqual(graph.prerequisites('reaction').map(n => n.id), ['atom']);
});

test('prerequisiteEntries exposes relation attributes for path ranking', () => {
  const graph = new KnowledgeEngine({
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    relations: [
      { source: 'a', target: 'c', type: 'prerequisite', weight: 0.9 },
      { source: 'b', target: 'c', type: 'prerequisite', required: false },
    ],
  });
  const entries = graph.prerequisiteEntries('c');
  assert.equal(entries.length, 2);
  assert.equal(entries.find(e => e.node.id === 'a').relation.weight, 0.9);
  assert.equal(entries.find(e => e.node.id === 'b').relation.required, false);
});

test('sortedLearningPath orders required-first then weight-desc, self last', () => {
  const graph = new KnowledgeEngine({
    nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
    relations: [
      { source: 'a', target: 'd', type: 'prerequisite', weight: 0.4 },
      { source: 'b', target: 'd', type: 'prerequisite', required: false },
      { source: 'c', target: 'd', type: 'prerequisite', weight: 0.9 },
    ],
  });
  const path = graph.sortedLearningPath('d').map(n => n.id);
  assert.deepEqual(path, ['c', 'a', 'b', 'd']);
});

test('question relations carry difficulty for adaptive selection', () => {
  const graph = new KnowledgeEngine({
    nodes: [{ id: 'node-1' }],
    relations: [
      { source: 'node-1', target: 'L01-Q01', type: 'question', difficulty: 'basic' },
      { source: 'node-1', target: 'L01-P08', type: 'question', difficulty: 'hard' },
    ],
  });
  assert.deepEqual(graph.questions('node-1'), ['L01-Q01', 'L01-P08']);
  const relation = graph.relations.find(r => r.target === 'L01-P08');
  assert.equal(relation.difficulty, 'hard');
});
