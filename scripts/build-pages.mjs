#!/usr/bin/env node
/**
 * Assembles the GitHub Pages artifact under dist/ with runtime files only.
 *
 * The deploy workflow used to upload the whole repository, which published
 * docs/, reports/, tests/ and scripts/ to the student-facing site. This
 * script copies an explicit allowlist of runtime assets instead.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const dist = path.join(root, 'dist');

const RUNTIME_DIRS = [
  'app',
  'controllers',
  'core',
  'engine',
  'views',
  'frontend',
];

// Runtime content actually fetched or imported at runtime. Deliberately
// excludes content/schema, content/review, content/sources, content/misconceptions,
// docs/, reports/, tests/, scripts/, and all of modules/ except the legacy
// knowledge-graph fallback endpoint the loader can still request.
const RUNTIME_FILES = [
  'index.html',
  'package.json',
  'content/curriculum/lesson-manifest.js',
  'content/curriculum/g9-course-map.js',
  'content/release-policy.js',
  'content/questions/day01-diagnostics.js',
  'content/questions/day01-production-overrides.js',
  'modules/questions/taxonomy/knowledge-graph.json',
];

const RUNTIME_GLOBS = [
  ['content/lessons', /\.json$/],
  ['content/knowledge', /\.json$/],
  ['content/experiments', /\.json$/],
];

function copyFile(relative) {
  const source = path.join(root, relative);
  if (!fs.existsSync(source)) {
    missing.push(relative);
    return;
  }
  const target = path.join(dist, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  copied++;
}

const missing = [];
let copied = 0;

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const dir of RUNTIME_DIRS) {
  const source = path.join(root, dir);
  if (!fs.existsSync(source)) { missing.push(`${dir}/`); continue; }
  fs.cpSync(source, path.join(dist, dir), { recursive: true });
  for (const file of fs.readdirSync(source)) {
    if (fs.statSync(path.join(source, file)).isFile()) copied++;
  }
}

for (const file of RUNTIME_FILES) copyFile(file);

for (const [dir, pattern] of RUNTIME_GLOBS) {
  const source = path.join(root, dir);
  if (!fs.existsSync(source)) { missing.push(`${dir}/`); continue; }
  for (const name of fs.readdirSync(source).filter(name => pattern.test(name))) {
    copyFile(path.join(dir, name));
  }
}

console.log(`[build-pages] copied ${copied} files to dist/`);
if (missing.length) {
  console.error(`[build-pages] MISSING runtime assets: ${missing.join(', ')}`);
  process.exit(1);
}
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('[build-pages] dist/index.html missing — aborting');
  process.exit(1);
}
