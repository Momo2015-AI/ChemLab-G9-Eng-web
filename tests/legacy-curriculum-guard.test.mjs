import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('legacy day curriculum is removed', () => {
  assert.equal(fs.existsSync(path.join(root, 'modules', 'lessons')), false);
});

test('canonical lesson directory exists', () => {
  assert.equal(fs.existsSync(path.join(root, 'content', 'lessons')), true);
  assert.equal(fs.existsSync(path.join(root, 'content', 'lessons', 'lesson-01-material-changes-properties.json')), true);
});
