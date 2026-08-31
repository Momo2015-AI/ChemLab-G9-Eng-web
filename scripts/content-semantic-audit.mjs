#!/usr/bin/env node
/**
 * Semantic content audit (Sprint 0, INTEGRATED-REPAIR-PLAN-V1.1).
 *
 * The existing integrity/lesson audits validate structure (manifest contract,
 * template placeholders, dangling references). This script validates *meaning*:
 *
 *   S1  contradiction markers inside explanations        (BLOCKER)
 *   S2  answer key resolves to a valid option index      (BLOCKER)
 *   S3  same question id must not diverge in content     (BLOCKER post-Sprint 1)
 *   S4  every runtime question carries own knowledge     (BLOCKER post-Sprint 1)
 *   S5  duplicate id registry (informational)
 *   S6  choice questions in practice/mastery need explanation (BLOCKER post-Sprint 1)
 *   S7  every knowledgeId must resolve to a graph node   (BLOCKER post-Sprint 2.5)
 *   S8  graph node.questions[] must equal the question-side aggregation (BLOCKER post-Sprint 2.5)
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

/**
 * Knowledge graph loader + alias map. Aliases mirror the misconception
 * vocabulary pattern (content/misconceptions/canonical-misconceptions.js
 * ALIAS_MAP) so that question knowledgeIds authored before a graph-node
 * rename can still be resolved by the runtime. Adding an entry here is a
 * one-line fix for legacy data and is logged at module load time.
 */
function loadKnowledgeGraph() {
  if (typeof process === 'undefined') return { nodes: [], relations: [] };
  const cwd = process.cwd();
  const file = `${cwd}/content/knowledge/knowledge-graph.json`;
  if (!fs.existsSync(file)) return { nodes: [], relations: [] };
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return { nodes: [], relations: [] }; }
}
export const KNOWLEDGE_GRAPH = loadKnowledgeGraph();
export const KNOWLEDGE_NODE_IDS = new Set((KNOWLEDGE_GRAPH.nodes || []).map(n => n.id));
// Sprint 2.5 KG-2: alias map for legacy knowledgeIds that have been merged
// into a canonical node. Format: 'legacy-id' -> 'canonical-id'. Keep entries
// in the order they were applied. New merges must be added before the
// canonical run that retires the legacy id.
export const KNOWLEDGE_ALIASES = Object.freeze({
  'law-conservation': 'law-of-mass-conservation',
});
const RESOLVED_ALIASES = new Map();
for (const [legacy, canonical] of Object.entries(KNOWLEDGE_ALIASES)) {
  if (!KNOWLEDGE_NODE_IDS.has(canonical)) {
    // Misconfiguration: alias points to a non-existent node. Surface loudly.
    console.warn(`[semantic-audit] knowledge alias '${legacy}' -> '${canonical}' but target is not in the graph`);
  } else {
    RESOLVED_ALIASES.set(legacy, canonical);
  }
}
/** Resolve a knowledge id through the alias map. */
export function resolveKnowledgeId(id) {
  if (KNOWLEDGE_NODE_IDS.has(id)) return id;
  if (RESOLVED_ALIASES.has(id)) return RESOLVED_ALIASES.get(id);
  return null;
}
/** Knowledge ids that resolve to a real graph node (after aliasing). */
export function knownKnowledgeIds(question = {}) {
  return ownKnowledgeIds(question).map(resolveKnowledgeId).filter(Boolean);
}
/** Per-pool overrides applied after collection: lesson-main questions that
 * carry a remediationStep are diagnostic questions embedded in the main
 * lesson file; they route students back to guided steps and are exempt
 * from S6. */
export function poolOf(question, rawPool) {
  if (rawPool === 'lesson-main' && question && question.remediationStep) return 'diagnostic';
  if (rawPool === 'diagnostic-orphan' && question && question.remediationStep) return 'diagnostic';
  return rawPool;
}
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

/** Fields that determine runtime correctness; only drifts on these are
 * treated as real copy divergence. Schema-decor fields (difficulty, type,
 * knowledgePoints vs knowledgeIds, etc.) are intentionally excluded so that
 * legacy schema mismatches between main and split files do not block CI. */
export const CONTENT_FIELDS = [
  'question', 'options', 'answer', 'explanation', 'knowledgeIds',
  'knowledgePoint', 'errorType', 'remediationStep', 'misconceptionIds',
];
export function contentKey(question) {
  if (!question || typeof question !== 'object') return canonicalKey(question);
  const filtered = {};
  for (const field of CONTENT_FIELDS) {
    if (field in question) filtered[field] = question[field];
  }
  return canonicalKey(filtered);
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

const CONSTRUCTED_TYPES = new Set(['constructed', 'short-answer', 'fill', 'calculation']);
export function isConstructed(question) {
  return CONSTRUCTED_TYPES.has(String(question?.type || '').toLowerCase());
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
 * duplicate registry (S5). Drift is measured on content-only fields via
 * contentKey so legacy schema mismatches (difficulty/type) do not block. */
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
    const keys = new Set(entries.map(entry => contentKey(entry.question)));
    if (keys.size > 1) divergent.push({ id, files: entries.map(entry => entry.file) });
    else identical.push({ id, files: entries.map(entry => entry.file) });
  }
  return { divergent, identical };
}

export function runAudit({ lessonsDir = LESSONS_DIR, day01Modules = null, skipS8 = false } = {}) {
  const collected = collectQuestions({ lessonsDir, day01Modules });
  const blockers = [];
  const warnings = [];
  const stats = { questions: collected.length };

  for (const { question, file, pool } of collected) {
    if (question.parseError) { blockers.push(`S2 ${file}: JSON parse error — ${question.parseError}`); continue; }
    const effectivePool = poolOf(question, pool);
    const markers = checkContradictionMarkers(question);
    if (markers.length) blockers.push(`S1 ${question.id} (${file}): explanation contains unresolved review marker(s): ${markers.join(', ')}`);
    const badIndex = checkAnswerIndex(question);
    if (badIndex !== null) blockers.push(`S2 ${question.id} (${file}): answer ${JSON.stringify(question.answer)} does not resolve to a valid option index (resolved: ${badIndex})`);
    if (checkKnowledgeLinks(question)) blockers.push(`S4 ${question.id} (${file}, ${effectivePool}): no own knowledge link — recheck matching cannot attribute this question`);
    if (EXPLANATION_POOLS.has(effectivePool) && !isConstructed(question) && !checkExplanation(question)) blockers.push(`S6 ${question.id} (${file}, ${effectivePool}): choice question without explanation`);
    // S7 — every knowledgeId must resolve to a graph node (after aliasing).
    for (const id of ownKnowledgeIds(question)) {
      if (!resolveKnowledgeId(id)) {
        blockers.push(`S7 ${question.id} (${file}): knowledgeId "${id}" does not resolve to any graph node (and no alias applies)`);
      } else if (id !== resolveKnowledgeId(id)) {
        // Legacy id is routed through an alias — informational so authors
        // know to migrate, but not a blocker.
        warnings.push(`S7 ${question.id} (${file}): knowledgeId "${id}" is aliased to "${resolveKnowledgeId(id)}"; update the source file when convenient`);
      }
    }
  }

  const { divergent, identical } = findDivergentDuplicates(collected);
  for (const { id, files } of divergent) blockers.push(`S3 ${id}: divergent content fields across files: ${files.join(' vs ')}`);
  stats.divergentDuplicates = divergent.length;
  stats.identicalDuplicates = identical.length;
  stats.missingKnowledgeLinks = blockers.filter(w => w.startsWith('S4')).length;
  stats.missingExplanations = blockers.filter(w => w.startsWith('S6')).length;
  stats.unknownKnowledgeIds = blockers.filter(w => w.startsWith('S7')).length;

  // S8 — graph node.questions[] must equal the aggregation from the
  // question side. Computed by canonical-key diffing. Idempotent; the
  // generator script (gen-graph-questions.mjs) calls this function and
  // writes the result back, so the runtime audit can re-verify.
  if (!skipS8) {
    const aggregated = new Map(); // nodeId -> Set(questionId)
    for (const { question } of collected) {
      if (!question?.id) continue;
      for (const kid of ownKnowledgeIds(question)) {
        const resolved = resolveKnowledgeId(kid);
        if (!resolved) continue;
        if (!aggregated.has(resolved)) aggregated.set(resolved, new Set());
        aggregated.get(resolved).add(question.id);
      }
    }
    for (const node of KNOWLEDGE_GRAPH.nodes || []) {
      const declared = new Set(node.questions || []);
      const actual = aggregated.get(node.id) || new Set();
      for (const missing of actual) {
        if (!declared.has(missing)) blockers.push(`S8 node "${node.id}": question "${missing}" links to this node but is not listed in node.questions[]`);
      }
      for (const stale of declared) {
        if (!actual.has(stale)) blockers.push(`S8 node "${node.id}": question "${stale}" is listed in node.questions[] but the question no longer references this node`);
      }
    }
    stats.s8Drift = blockers.filter(w => w.startsWith('S8')).length;
  }

  return { blockers, warnings, stats };
}

function renderReport({ blockers, warnings, stats }) {
  return [
    '# ChemLab-G9-Eng Semantic Content Audit Report', '',
    `Generated: ${new Date().toISOString()}`, '',
    '## Rules',
    '- S1 contradiction markers in explanations — BLOCKER',
    '- S2 answer key resolves to valid option index — BLOCKER',
    '- S3 same question id must not diverge in content fields across files — BLOCKER (Sprint 1 alignment complete)',
    '- S4 every runtime question carries own knowledge link — BLOCKER (Sprint 1 backfill complete)',
    '- S5 duplicate id registry (informational)',
    '- S6 practice/mastery choice questions need explanations — BLOCKER for choice questions in those pools (transfer constructed questions are exempt; diagnostic pool exempt by remediationStep routing)', '',
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
