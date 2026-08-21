// Enforces docs/COURSE-DEVELOPMENT-STANDARD.md Section 16
// (Namespace and ID allocation). This test exists so that ID-prefix
// collisions across parallel lesson production, and dangling
// misconceptionId/errorType references, are caught by `npm test`
// instead of silently shipping until a runtime audit script crashes —
// which is exactly what happened once already (see the 2026-08-21
// development log entry / the fix commit that repaired
// content-integrity-v19.mjs crashing on it).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { canonicalMisconceptions, ALIAS_MAP } from '../content/misconceptions/canonical-misconceptions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.join(__dirname, '../content/lessons');
const lessonFiles = readdirSync(lessonsDir).filter(f => f.endsWith('.json'));

function readJson(file) {
  return JSON.parse(readFileSync(path.join(lessonsDir, file), 'utf8'));
}

// Derive each file's "owning" canonicalId by stripping known suffixes.
const SUFFIXES = ['-diagnostic', '-experiment', '-guided-learning', '-mastery', '-practice', '-transfer'];
function ownerOf(file) {
  let base = file.replace(/\.json$/, '');
  for (const s of SUFFIXES) {
    if (base.endsWith(s)) return base.slice(0, -s.length);
  }
  return base;
}

test('no two lessons share the same question/step ID prefix (Section 16.1/16.2)', () => {
  // Map: prefix (e.g. "L07") -> Set of owning canonicalIds that used it
  const prefixOwners = new Map();
  const idPattern = /"(L\d+)-[A-Z]\d+"/g;

  for (const file of lessonFiles) {
    const text = readFileSync(path.join(lessonsDir, file), 'utf8');
    const owner = ownerOf(file);
    let match;
    while ((match = idPattern.exec(text))) {
      const prefix = match[1];
      if (!prefixOwners.has(prefix)) prefixOwners.set(prefix, new Set());
      prefixOwners.get(prefix).add(owner);
    }
  }

  const collisions = [...prefixOwners.entries()].filter(([, owners]) => owners.size > 1);
  assert.deepEqual(
    collisions,
    [],
    `ID prefix collision(s) across different lessons: ${collisions
      .map(([prefix, owners]) => `${prefix} used by [${[...owners].join(', ')}]`)
      .join('; ')}. Per Section 16.1/16.2, grep for the prefix before claiming it and pick the next free integer.`
  );
});

test('every misconceptionIds/errorType reference resolves to a canonical entry or alias (Section 16.3)', () => {
  const canonicalIds = new Set(canonicalMisconceptions.map(m => m.id));
  const aliasIds = new Set(Object.keys(ALIAS_MAP));
  const known = new Set([...canonicalIds, ...aliasIds]);

  const dangling = new Set();
  for (const file of lessonFiles) {
    const text = readFileSync(path.join(lessonsDir, file), 'utf8');
    for (const match of text.matchAll(/"(mc-[a-z0-9-]+)"/g)) {
      if (!known.has(match[1])) dangling.add(match[1]);
    }
  }

  assert.deepEqual(
    [...dangling].sort(),
    [],
    `Misconception ID(s) referenced in lesson content but not registered in canonical-misconceptions.js (Section 16.3): ${[...dangling].join(', ')}`
  );
});

test('every canonical misconception knowledgeId resolves to a live knowledge-graph node', () => {
  const graph = JSON.parse(readFileSync(path.join(__dirname, '../content/knowledge/knowledge-graph.json'), 'utf8'));
  const liveNodeIds = new Set(graph.nodes.map(n => n.id));
  const invalid = [];
  for (const mc of canonicalMisconceptions) {
    for (const kid of mc.knowledgeIds) {
      if (!liveNodeIds.has(kid)) invalid.push(`${mc.id} -> ${kid}`);
    }
  }
  assert.deepEqual(invalid, [], `Misconception(s) reference a knowledge-graph node that does not exist: ${invalid.join(', ')}`);
});
