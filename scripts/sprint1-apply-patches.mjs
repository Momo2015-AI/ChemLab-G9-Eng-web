#!/usr/bin/env node
/**
 * Sprint 1 batch patcher: add knowledgeIds + rewrite explanations for the
 * 103 S4-defective questions and the 60 S6 transfer/practice/mastery gaps
 * caught by content-semantic-audit. Idempotent: re-running over a fixed
 * file is a no-op once every question already has knowledgeIds and a
 * non-empty explanation.
 *
 * Each entry: { id, knowledgeIds, explanation? }
 *   - knowledgeIds: required (this is what S4 enforces)
 *   - explanation: optional; only set when the current explanation is
 *     missing, clearly truncated, or contradicts the answer
 */
import fs from 'node:fs';
import path from 'node:path';

const lessonsDir = path.join(process.cwd(), 'content/lessons');
const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts/sprint1-patches.json'), 'utf8'));
const patches = [];
for (const [file, list] of Object.entries(raw)) {
  if (file.startsWith('_')) continue;
  if (!Array.isArray(list)) continue;
  for (const p of list) patches.push({ ...p, file });
}

const splitPools = [
  ['-practice.json', 'practice', d => d?.questions || (Array.isArray(d) ? d : [])],
  ['-diagnostic.json', 'diagnostic', d => d?.diagnostics || d?.questions || (Array.isArray(d) ? d : [])],
  ['-mastery.json', 'mastery', d => d?.mastery?.questions || d?.questions || []],
  ['-transfer.json', 'transfer', d => d?.questions || []],
];
const mainFilePools = [
  ['questions', d => d?.questions || []],
  ['diagnosticQuestions', d => d?.diagnosticQuestions || []],
  ['mastery', d => d?.mastery?.questions || []],
];

const byFile = new Map();
for (const p of patches) {
  if (!byFile.has(p.file)) byFile.set(p.file, new Map());
  byFile.get(p.file).set(p.id, p);
}

let touchedFiles = 0, touchedQuestions = 0;
for (const [file, idMap] of byFile) {
  const filePath = path.join(lessonsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ! ${file}: missing on disk (skip)`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const split = splitPools.find(([suffix]) => file.endsWith(suffix));
  const isSplit = Boolean(split);
  const candidates = isSplit
    ? split[2](data)
    : [...mainFilePools.flatMap(([field, get]) => get(data))];
  let changed = false;
  for (const q of candidates) {
    if (!q?.id) continue;
    const patch = idMap.get(q.id);
    if (!patch) continue;
    if (!Array.isArray(q.knowledgeIds) || q.knowledgeIds.length === 0) {
      q.knowledgeIds = [...patch.knowledgeIds];
      if (patch.knowledgePoint && !q.knowledgePoint) q.knowledgePoint = patch.knowledgePoint;
      if (patch.knowledgePoint && !q.knowledgePoints) q.knowledgePoints = [patch.knowledgePoint];
      changed = true;
    }
    if (patch.explanation && (!q.explanation || !String(q.explanation).trim())) {
      q.explanation = patch.explanation;
      changed = true;
    }
    if (changed) touchedQuestions += 1;
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    touchedFiles += 1;
  }
}
console.log(`Patched ${touchedQuestions} question(s) across ${touchedFiles} file(s).`);
