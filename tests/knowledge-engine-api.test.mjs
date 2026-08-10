import test from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';

function createEngine() {
  return new KnowledgeEngine({
    nodes: [
      { id: 'matter' },
      { id: 'atom' },
      { id: 'oxygen' },
      { id: 'combustion' },
    ],
    relations: [
      { source: 'atom', target: 'matter', type: 'prerequisite' },
      { source: 'matter', target: 'oxygen', type: 'prerequisite' },
      { source: 'oxygen', target: 'combustion', type: 'prerequisite' },
    ],
  });
}

test('canonical engine supports node and relation queries', () => {
  const engine = createEngine();
  assert.equal(engine.hasNode('oxygen'), true);
  assert.equal(engine.getNode('oxygen').id, 'oxygen');
  assert.deepEqual(engine.prerequisites('oxygen').map(node => node.id), ['matter']);
  assert.deepEqual(engine.dependents('oxygen').map(node => node.id), ['combustion']);
});

test('canonical engine computes ancestors and descendants without cycles', () => {
  const engine = createEngine();
  assert.deepEqual(engine.ancestors('combustion').map(node => node.id), ['oxygen', 'matter', 'atom']);
  assert.deepEqual(engine.descendants('atom').map(node => node.id), ['matter', 'oxygen', 'combustion']);
});

test('learningPath returns prerequisite chain followed by target', () => {
  const engine = createEngine();
  assert.deepEqual(engine.learningPath('combustion').map(node => node.id), [
    'oxygen', 'matter', 'atom', 'combustion',
  ]);
});

test('canonical engine accepts legacy edges field during migration', () => {
  const engine = new KnowledgeEngine({
    nodes: [{ id: 'a' }, { id: 'b' }],
    edges: [{ source: 'a', target: 'b', type: 'prerequisite' }],
  });
  assert.deepEqual(engine.prerequisites('b').map(node => node.id), ['a']);
});
