import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('production loader points to canonical knowledge graph content', () => {
  const loader = read('app/content-loader.js');
  assert.match(loader, /content\/knowledge\/knowledge-graph\.json/);
  assert.ok(fs.existsSync(new URL('../content/knowledge/knowledge-graph.json', import.meta.url)));
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
