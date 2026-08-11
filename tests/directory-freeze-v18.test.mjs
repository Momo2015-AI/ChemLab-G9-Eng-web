import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const forbiddenPaths = [
  'engine/app.js',
  'engine/app.js.bak',
  'engine/router.js',
  'engine/task-engine.js',
  'engine/recommendation-engine.js',
  'engine/progress-manager.js',
  'views/constants.js',
  'views/registry.js',
  'lab/experiment-player.js',
  'lab/experiment-renderer.js',
  'lab/equipment-registry.js',
  'lab/state.js',
  'lab/diagnosis.js',
];

const productionRoots = ['app', 'controllers', 'core', 'services', 'views'];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

test('V1.8 directory freeze removes obsolete runtime files', () => {
  const remaining = forbiddenPaths.filter(relative => fs.existsSync(path.join(root, relative)));
  assert.deepEqual(remaining, []);
});

test('V1.8 production import graph does not reference removed legacy runtime modules', () => {
  const forbiddenTokens = [
    "engine/app.js",
    "engine/router.js",
    "engine/task-engine.js",
    "engine/recommendation-engine.js",
    "engine/progress-manager.js",
    "lab/experiment-player.js",
    "lab/experiment-renderer.js",
    "lab/equipment-registry.js",
    "lab/state.js",
    "lab/diagnosis.js",
    "views/constants.js",
    "views/registry.js",
  ];

  const hits = [];
  for (const relativeRoot of productionRoots) {
    for (const file of walk(path.join(root, relativeRoot))) {
      if (!/\.(?:m?js|html)$/.test(file)) continue;
      const source = fs.readFileSync(file, 'utf8');
      for (const token of forbiddenTokens) {
        if (source.includes(token)) hits.push(`${path.relative(root, file)} -> ${token}`);
      }
    }
  }

  assert.deepEqual(hits, []);
});

test('V1.8 production entry uses the canonical bootstrap only', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(index, /app\/bootstrap\.js/);
  assert.doesNotMatch(index, /engine\/app\.js/);
});

test('V1.8 single repository Pages workflow is present', () => {
  const workflow = path.join(root, '.github/workflows/pages.yml');
  assert.equal(fs.existsSync(workflow), true);
  const source = fs.readFileSync(workflow, 'utf8');
  assert.match(source, /actions\/upload-pages-artifact@v3/);
  assert.match(source, /actions\/deploy-pages@v4/);
});
