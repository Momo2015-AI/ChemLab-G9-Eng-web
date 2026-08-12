#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { day01ProductionOverrides, day01ProductionOverrideIds } from '../content/questions/day01-production-overrides.js';

const root = process.cwd();
const questionPath = path.join(root, 'modules/questions/question-bank.json');
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
const questionTaxonomyPath = path.join(root, 'modules/questions/taxonomy/question-bank.json');

function load(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const normalizeQuestion = question => {
  if (!question || typeof question !== 'object') return question;
  if (question.answer !== undefined || question.ans === undefined) return question;
  return { ...question, answer: question.ans };
};

const report = { errors: [], warnings: [], stats: {} };
const bank = load(questionPath);
const graph = load(graphPath);
const taxonomy = load(questionTaxonomyPath);

if (!bank?.questions || !Array.isArray(bank.questions)) {
  report.errors.push('question-bank.json: missing questions[]');
} else {
  const questions = bank.questions.map(normalizeQuestion);
  const ids = new Set();
  const validTypes = new Set(['choice','multi-choice','fill','short-answer','true-false','experiment','calculation']);
  const validDifficulty = new Set(['easy','medium','hard']);
  const validBloom = new Set(['remember','understand','apply','analyze','evaluate','create']);
  let ready = 0;
  for (const q of questions) {
    if (!q.id) report.errors.push('Question without id');
    if (ids.has(q.id)) report.errors.push(`Duplicate question id: ${q.id}`);
    ids.add(q.id);
    if (!q.type || !validTypes.has(q.type)) report.errors.push(`${q.id}: invalid type`);
    if (!q.prompt?.trim()) report.errors.push(`${q.id}: empty prompt`);
    if (!q.answer && q.answer !== 0) report.errors.push(`${q.id}: missing answer`);
    if (!q.explanation?.trim()) report.errors.push(`${q.id}: missing explanation`);
    if (!Array.isArray(q.knowledge) || q.knowledge.length === 0) report.errors.push(`${q.id}: missing knowledge links`);
    if (!validDifficulty.has(q.difficulty)) report.errors.push(`${q.id}: invalid difficulty ${q.difficulty}`);
    if (!validBloom.has(q.bloomLevel)) report.errors.push(`${q.id}: invalid bloomLevel ${q.bloomLevel}`);
    if (q.type === 'choice') {
      if (!Array.isArray(q.options) || q.options.length < 2) report.errors.push(`${q.id}: choice requires >=2 options`);
      const labels = (q.options ?? []).map(x => String(x).trim().charAt(0).toUpperCase());
      if (typeof q.answer === 'string' && q.answer.length === 1 && !labels.includes(q.answer.toUpperCase())) report.errors.push(`${q.id}: answer ${q.answer} not found in options`);
    }
    if (q.status === 'ready') ready++;
  }
  report.stats.sourceQuestions = questions.length;
  report.stats.sourceReady = ready;
  report.stats.sourceQuestionIds = ids.size;

  if (Number.isInteger(bank.total) && bank.total !== questions.length) {
    report.errors.push(`question-bank total=${bank.total} but actual=${questions.length}`);
  }

  if (graph?.nodes) {
    const missing = [];
    for (const node of graph.nodes) {
      for (const qid of (node.questions ?? [])) if (!ids.has(qid)) missing.push(`${node.id} -> ${qid}`);
    }
    for (const item of missing) report.errors.push(`Knowledge graph references missing question: ${item}`);
    report.stats.graphNodes = graph.nodes.length;
    report.stats.graphMissingQuestions = missing.length;
  }
}

// Effective runtime question set: known Day 01 legacy defects are quarantined
// by ID and replaced by isolated JS records. This avoids rewriting the large
// 320-question JSON through a connector that cannot safely perform partial JSON edits.
const effectiveQuestions = [
  ...(bank?.questions ?? [])
    .map(normalizeQuestion)
    .filter(q => !day01ProductionOverrideIds.has(q.id)),
  ...day01ProductionOverrides,
];
const effectiveIds = new Set();
for (const q of effectiveQuestions) {
  if (effectiveIds.has(q.id)) report.errors.push(`Effective question duplicate id: ${q.id}`);
  effectiveIds.add(q.id);
  if (!q.prompt?.trim()) report.errors.push(`${q.id}: effective prompt is empty`);
  if (!q.explanation?.trim()) report.errors.push(`${q.id}: effective explanation is empty`);
  if (!Array.isArray(q.knowledge) || q.knowledge.length === 0) report.errors.push(`${q.id}: effective knowledge link missing`);
}
report.stats.effectiveQuestions = effectiveQuestions.length;
report.stats.effectiveQuestionIds = effectiveIds.size;
report.stats.overrides = day01ProductionOverrides.length;

if (Number.isInteger(bank?.total) && bank.total !== effectiveQuestions.length) {
  report.errors.push(`effective question total=${effectiveQuestions.length} does not preserve bank.total=${bank.total}`);
}

// Human-review flags apply to the effective runtime records, not quarantined legacy records.
const humanReviewFlags = {
  'q-acid-005': 'Review uniqueness of the correct answer; current wording may admit more than one option.',
  'q-acid-012': 'Review pressure-change premise and apparatus/conditions; current explanation conflicts with the legacy stem.'
};
for (const [id, message] of Object.entries(humanReviewFlags)) {
  const q = effectiveQuestions.find(item => item.id === id);
  if (q?.status === 'ready') report.errors.push(`${id}: ${message}`);
}

const out = [
  '# ChemLab-G9-Eng V1.9 Content Integrity Report', '',
  `Generated: ${new Date().toISOString()}`, '',
  '## Statistics',
  ...Object.entries(report.stats).map(([k,v]) => `- ${k}: ${v}`), '',
  '## Errors',
  ...(report.errors.length ? report.errors.map(x => `- ${x}`) : ['- None']), '',
  '## Warnings',
  ...(report.warnings.length ? report.warnings.map(x => `- ${x}`) : ['- None']), ''
].join('\n');

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/content-integrity-v19.md'), out);
console.log(out);
if (report.errors.length) process.exitCode = 1;
