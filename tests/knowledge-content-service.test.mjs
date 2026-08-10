import test from 'node:test';
import assert from 'node:assert/strict';
import ContentService from '../app/content-service.js';

function createLoader() {
  return {
    async loadAll() {
      return {
        questions: [],
        questionById: new Map(),
        knowledgeGraph: {
          nodes: [
            { id: 'atom' },
            { id: 'matter' },
          ],
          relations: [
            { source: 'matter', target: 'atom', type: 'prerequisite' },
          ],
        },
        manifest: {},
        topics: [],
        days: [],
        dayById: new Map(),
      };
    },
    async loadExperiment() { return null; },
    async loadKnowledgeContent() { return null; },
  };
}

test('ContentService initializes and owns the canonical knowledge engine', async () => {
  const service = new ContentService(createLoader());
  const engine = await service.getKnowledgeEngine();

  assert.equal(engine.getNode('matter').id, 'matter');
  assert.equal(engine.prerequisites('matter')[0].id, 'atom');
});

test('ContentService exposes graph queries without leaking traversal to callers', async () => {
  const service = new ContentService(createLoader());

  assert.equal((await service.getPrerequisites('matter'))[0].id, 'atom');
  assert.equal(await service.getKnowledge('atom').then(node => node.id), 'atom');
});
