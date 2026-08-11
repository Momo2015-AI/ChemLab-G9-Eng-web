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
