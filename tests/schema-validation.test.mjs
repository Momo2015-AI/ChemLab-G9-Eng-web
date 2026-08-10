import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/lesson.schema.json'), 'utf8'));

test('lesson schema declares the core lesson contract', () => {
  assert.equal(schema.type, 'object');
  assert.ok(schema.properties.id);
  assert.ok(schema.properties.title);
  assert.ok(schema.properties.knowledgePoints);
  assert.ok(schema.properties.questions);
  assert.ok(schema.properties.experiments);
});

test('lesson schema enforces required educational identity fields', () => {
  assert.ok(Array.isArray(schema.required), 'schema.required must exist');
  assert.ok(schema.required.includes('id'));
  assert.ok(schema.required.includes('title'));
});
