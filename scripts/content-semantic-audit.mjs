#!/usr/bin/env node
/**
 * Semantic content audit (Sprint 0, INTEGRATED-REPAIR-PLAN-V1.1).
 *
 * The existing integrity/lesson audits validate structure (manifest contract,
 * template placeholders, dangling references). This script validates *meaning*:
 *
 *   S1  contradiction markers inside explanations        (BLOCKER)
 *   S2  answer key resolves to a valid option index      (BLOCKER)
 *   S3  same question id must not diverge across files   (WARN until Sprint 1
 *       copy alignment lands, then BLOCKER)
 *   S4  every runtime question carries its own knowledge (WARN until Sprint 1
 *       knowledge-link backfill, then BLOCKER — recheck matching relies on it)
 *   S5  duplicate id registry (informational, pairs with S3)
 *   S6  choice questions in practice/mastery/transfer    (WARN until Sprint 1
 *       explanation backfill, then BLOCKER)
 *
 * Diagnostic-pool questions are exempt from S6: they route students back to
 * guided-learning steps via remediationStep instead of inline explanations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import { day01ProductionOverrides } from '../content/questions/day01-production-overrides.js';

export const CONTRADICTION_MARKERS = ['需检查', '实际应为', '无错误选项', '修正：', '待确认', '待补充', '待核实', 'TODO', 'FIXME'];
export const EXPLANATION_POOLS = new Set(['practice', 'mastery', 'transfer', 'lesson-main']);
const LESSONS_DIR = 'content/lessons';

/** Canonical deep comparison key: key-sorted stable JSON. */
export function canonicalKey(value) {
  const walk = item => {
    if (Array.isArray(item)) return item.map(walk);
    if (item && typeof item === 'object') {
      const sorted = {};
      for (const key of Object.keys(item).sort()) sorted[key] = walk(item[key]);
      return sorted;
    }
    return item;
  };
  return JSON.stringify(walk(value));
}

/** Own knowledge ids only — deliberately WITHOUT the lesson-level fallback:
 * recheck question matching (assessment-runtime-controller.startRecheck) uses
 * each question's own ids, so a missing link breaks remediation even when the
 * lesson declares knowledgePoints. */
export function ownKnowledgeIds(question = {}) {
  const raw = question.knowledgeIds ?? question.knowledgePoints ?? question.knowledgePoint ?? question.knowledgeId ?? question.knowledge ?? [];
  const values = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
  return values;
}

export function answerIndex(question = {}) {
  const options = Array.isArray(question.options) ? question.options : [];
  if (!options.length || question.answer === undefined || question.answer === null) return null;
  if (Number.isInteger(question.answer)) return question.answer;
  const text = String(question.answer).trim().toUpperCase();
  if (/^[A-Z]$/.test(text)) return text.charCodeAt(0) - 65;
  if (/^\d+$/.test(text)) return Number(text);
  return -1;
}

export function checkContradictionMarkers(question) {
  const text = String(question.explanation || '');
  return CONTRADICTION_MARKERS.filter(marker => text.includes(marker));
}

export function checkAnswerIndex(question) {
  const options = Array.isArray(question.options) ? question.options : [];
  if (!options.length || question.answer === undefined || question.answer === null) return null;
  const index = answerIndex(question);
  return (Number.isInteger(index) && index >= 0 && index < options.length) ? null : index;
}

export function checkKnowledgeLinks(question) {
  const ids = ownKnowledgeIds(question);
  return ids.length ? null : [];
}

export function checkExplanation(question) {
  return Boolean(String(question.explanation || '').trim());
}

/** Collect every runtime question with provenance (file + pool). */
export function collectQuestions({ lessonsDir = LESSONS_DIR, day01Modules = null } = {}) {
  const root = process.cwd();
  const dir = path.join(root, lessonsDir);
  const collected = [];
  if (!fs.existsSync(dir)) return collected;
  const splitPools = [
    ['-practice.json', 'practice', data => Array.isArray(data?.questions) ? data.questions : (Array.isArray(data) ? data : [])],
    ['-diagnostic.json', 'diagnostic', data => Array.isArray(data?.diagnostics) ? data.diagnostics : (Array.isArray(data?.questions) ? data.questions : [])],
    ['-mastery.json', 'mastery', data => Array.isArray(data?.mastery?.questions) ? data.mastery.questions : (Array.isArray(data?.questions) ? data.questions : [])],
    ['-transfer.json', 'transfer', data => Array.isArray(data?.questions) ? data.questions : []],
  ];
  const allFiles = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
  const splitFileNames = new Set(allFiles.filter(name => splitPools.some(([suffix]) => name.endsWith(suffix))));
  const consumedSplitFiles = new Set();
  const mainFiles = allFiles.filter(name => !splitFileNames.has(name));
  const readJson = name => {
    try { return JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')); } catch { return null; }
  };
  for (const name of mainFiles) {
    const lesson = readJson(name);
    if (!lesson) { collected.push({ question: { id: name, parseError: 'unreadable JSON' }, file: name, pool: 'parse-error' }); continue; }
    for (const question of (Array.isArray(lesson.questions) ? lesson.questions : [])) {
      if (question?.id) collected.push({ question, file: name, pool: 'lesson-main' });
    }
    for (const question of (Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [])) {
      if (question?.id) collected.push({ question, file: name, pool: 'lesson-main' });
    }
    for (const question of (Array.isArray(lesson.mastery?.questions) ? lesson.mastery.questions : [])) {
      if (question?.id) collected.push({ question, file: name, pool: 'lesson-main' });
    }
    for (const [suffix, pool, extract] of splitPools) {
      const splitName = name.replace(/\.json$/, suffix);
      if (!splitFileNames.has(splitName)) continue;
      consumedSplitFiles.add(splitName);
      const data = readJson(splitName);
      if (!data) continue;
      for (const question of extract(data)) {
        if (question?.id) collected.push({ question, file: splitName, pool });
      }
    }
  }
  // Split files without a main lesson file must still be audited (orphan pools).
  for (const name of splitFileNames) {
    if (consumedSplitFiles.has(name)) continue;
    const [, pool, extract] = splitPools.find(([suffix]) => name.endsWith(suffix));
    const data = readJson(name);
    if (!data) continue;
    for (const question of extract(data)) {
      if (question?.id) collected.push({ question, file: name, pool: `${pool}-orphan` });
    }
  }
  const overrides = day01Modules?.overrides ?? day01ProductionOverrides;
  const diagnostics = day01Modules?.diagnostics ?? day01DiagnosticQuestions.filter(q => q.status !== 'archived');
  for (const question of overrides) collected.push({ question, file: 'content/questions/day01-production-overrides.js', pool: 'runtime-override' });
  for (const question of diagnostics) collected.push({ question, file: 'content/questions/day01-diagnostics.js', pool: 'runtime-diagnostic' });
  return collected;
}

/** Group identical ids across files; report divergent copies (S3) and the
 * duplicate registry (S5). */
export function findDivergentDuplicates(collected) {
  const byId = new Map();
  for (const entry of collected) {
    if (!byId.has(entry.question.id)) byId.set(entry.question.id, []);
    byId.get(entry.question.id).push(entry);
  }
  const divergent = [];
  const identical = [];
  for (const [id, entries] of byId) {
    if (entries.length < 2) continue;
    const keys = new Set(entries.map(entry => canonicalKey(entry.question)));
    if (keys.size > 1) divergent.push({ id, files: entries.map(entry => entry.file) });
    else identical.push({ id, files: entries.map(entry => entry.file) });
  }
  return { divergent, identical };
}

export function runAudit({ lessonsDir = LESSONS_DIR, day01Modules = null } = {}) {
  const collected = collectQuestions({ lessonsDir, day01Modules });
  const blockers = [];
  const warnings = [];
  const stats = { questions: collected.length };

  for (const { question, file, pool } of collected) {
    if (question.parseError) { blockers.push(`S2 ${file}: JSON parse error — ${question.parseError}`); continue; }
    const markers = checkContradictionMarkers(question);
    if (markers.length) blockers.push(`S1 ${question.id} (${file}): explanation contains unresolved review marker(s): ${markers.join(', ')}`);
    const badIndex = checkAnswerIndex(question);
    if (badIndex !== null) blockers.push(`S2 ${question.id} (${file}): answer ${JSON.stringify(question.answer)} does not resolve to a valid option index (resolved: ${badIndex})`);
    if (checkKnowledgeLinks(question)) warnings.push(`S4 ${question.id} (${file}, ${pool}): no own knowledge link — recheck matching cannot attribute this question`);
    if (EXPLANATION_POOLS.has(pool) && !checkExplanation(question)) warnings.push(`S6 ${question.id} (${file}, ${pool}): choice question without explanation`);
  }

  const { divergent, identical } = findDivergentDuplicates(collected);
  for (const { id, files } of divergent) warnings.push(`S3 ${id}: divergent copies across files: ${files.join(' vs ')}`);
  stats.divergentDuplicates = divergent.length;
  stats.identicalDuplicates = identical.length;
  stats.missingKnowledgeLinks = warnings.filter(w => w.startsWith('S4')).length;
  stats.missingExplanations = warnings.filter(w => w.startsWith('S6')).length;
  return { blockers, warnings, stats };
}

function renderReport({ blockers, warnings, stats }) {
  return [
    '# ChemLab-G9-Eng Semantic Content Audit Report', '',
    `Generated: ${new Date().toISOString()}`, '',
    '## Rules',
    '- S1 contradiction markers in explanations — BLOCKER',
    '- S2 answer key resolves to valid option index — BLOCKER',
    '- S3 same question id must not diverge across files — WARN (BLOCKER after Sprint 1 copy alignment)',
    '- S4 every runtime question carries own knowledge link — WARN (BLOCKER after Sprint 1 backfill)',
    '- S5 duplicate id registry (informational)',
    '- S6 practice/mastery/transfer questions need explanations — WARN (BLOCKER after Sprint 1 backfill; diagnostic pool exempt)', '',
    '## Statistics',
    `- questions scanned: ${stats.questions}`,
    `- divergent duplicate ids (S3): ${stats.divergentDuplicates}`,
    `- identical duplicate ids (S5): ${stats.identicalDuplicates}`,
    `- questions without own knowledge links (S4): ${stats.missingKnowledgeLinks}`,
    `- practice/mastery/transfer questions without explanations (S6): ${stats.missingExplanations}`, '',
    '## Blockers',
    ...(blockers.length ? blockers.map(x => `- ${x}`) : ['- None']), '',
    '## Warnings',
    ...(warnings.length ? warnings.map(x => `- ${x}`) : ['- None']), ''
  ].join('\n');
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const result = runAudit();
  const report = renderReport(result);
  fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'reports/content-semantic-audit.md'), report);
  console.log(report);
  if (result.blockers.length) {
    console.error(`\nSemantic audit FAILED: ${result.blockers.length} blocker(s).`);
    process.exitCode = 1;
  } else {
    console.log('\nSemantic audit gate PASS (no blockers).');
  }
}
