import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('production loader points to canonical knowledge graph content', () => {
  const loader = read('app/content-loader.js');
  assert.match(loader, /content\/knowledge\/knowledge-graph\.json/);
  assert.ok(fs.existsSync(new URL('../content/knowledge/knowledge-graph.json', import.meta.url)));
});

test('canonical knowledge graph relations expose source and target', () => {
  const graph = JSON.parse(read('content/knowledge/knowledge-graph.json'));
  const relations = graph.relations || graph.edges || [];
  assert.ok(relations.length > 0);
  for (const relation of relations) {
    assert.equal(typeof relation.source, 'string');
    assert.equal(typeof relation.target, 'string');
  }
});

test('canonical experiment content uses the schema-supported title and knowledge fields', () => {
  const schema = JSON.parse(read('schemas/experiment.schema.json'));
  const experiment = JSON.parse(read('content/experiments/exp-hcl-fe.json'));

  assert.equal(schema.properties.title.type, 'string');
  assert.equal(schema.properties.knowledge.type, 'array');
  assert.equal(typeof experiment.title, 'string');
  assert.ok(Array.isArray(experiment.knowledge));
  assert.ok(experiment.knowledge.length > 1);
});

test('canonical first-lesson experiment is discoverable through lesson content', () => {
  const lesson = JSON.parse(read('content/lessons/lesson-01-material-changes-properties.json'));
  const resource = JSON.parse(read('content/lessons/lesson-01-material-changes-properties-experiment.json'));
  const experiment = resource.experiments.find(item => item.id === 'L01-E01');
  assert.ok(experiment);
  assert.deepEqual(experiment.linkedGuidedSteps, ['L01-S01', 'L01-S03', 'L01-S04']);
  assert.equal(lesson.experiments[0].resourceRef, 'content/lessons/lesson-01-material-changes-properties-experiment.json');
});

test('canonical lessons expose an explicit release state', () => {
  const manifest = JSON.parse(read('content/lessons/lesson-01-material-changes-properties.json'));
  assert.equal(manifest.releaseStatus, 'ready');
  assert.equal(manifest.status, 'ready');
});
