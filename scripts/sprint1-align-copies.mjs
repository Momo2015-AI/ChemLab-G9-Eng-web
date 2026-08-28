#!/usr/bin/env node
/**
 * Sprint 1 S3 alignment: for every divergent duplicate id, the split file is
 * treated as the canonical source. The main lesson file's copy of the same
 * question (in diagnosticQuestions[]) is replaced with the split version,
 * preserving existing key order where possible.
 *
 * Idempotent: re-running after the first patch reports zero drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { collectQuestions, findDivergentDuplicates } from './content-semantic-audit.mjs';

const lessonsDir = path.join(process.cwd(), 'content/lessons');
const collected = collectQuestions();
const { divergent } = findDivergentDuplicates(collected);

let touchedMainFiles = 0, alignedQuestions = 0, removedMainFields = 0;
for (const { id, files } of divergent) {
  const splitFile = files.find(f => f.endsWith('-diagnostic.json') || f.endsWith('-practice.json') || f.endsWith('-mastery.json') || f.endsWith('-transfer.json'));
  const mainFile = files.find(f => !f.endsWith('-diagnostic.json') && !f.endsWith('-practice.json') && !f.endsWith('-mastery.json') && !f.endsWith('-transfer.json'));
  if (!splitFile || !mainFile) {
    console.warn(`  ! ${id}: cannot identify split/main files (${files.join(', ')})`);
    continue;
  }
  const splitData = JSON.parse(fs.readFileSync(path.join(lessonsDir, splitFile), 'utf8'));
  const splitArr = Array.isArray(splitData?.diagnostics) ? splitData.diagnostics
    : Array.isArray(splitData?.questions) ? splitData.questions
    : Array.isArray(splitData?.mastery?.questions) ? splitData.mastery.questions
    : (Array.isArray(splitData) ? splitData : []);
  const canonical = splitArr.find(q => q?.id === id);
  if (!canonical) {
    console.warn(`  ! ${id}: not found in ${splitFile} (skip)`);
    continue;
  }
  const mainData = JSON.parse(fs.readFileSync(path.join(lessonsDir, mainFile), 'utf8'));
  const mainArr = Array.isArray(mainData?.diagnosticQuestions) ? mainData.diagnosticQuestions
    : Array.isArray(mainData?.questions) ? mainData.questions
    : (Array.isArray(mainData?.mastery?.questions) ? mainData.mastery.questions : []);
  const idx = mainArr.findIndex(q => q?.id === id);
  if (idx < 0) {
    console.warn(`  ! ${id}: not found in main file ${mainFile} (skip)`);
    continue;
  }
  const before = mainArr[idx];
  // Drop fields the canonical doesn't have, then merge canonical over remaining.
  const merged = { ...before, ...canonical };
  for (const key of Object.keys(merged)) {
    if (!(key in canonical) && !(key in before)) delete merged[key];
    if (key in canonical && canonical[key] === undefined) delete merged[key];
  }
  mainArr[idx] = merged;
  fs.writeFileSync(path.join(lessonsDir, mainFile), JSON.stringify(mainData, null, 2) + '\n');
  touchedMainFiles += 1;
  alignedQuestions += 1;
  console.log(`  aligned ${id}: ${mainFile} ← ${splitFile}`);
}
console.log(`Aligned ${alignedQuestions} question(s) across ${touchedMainFiles} main file(s).`);
