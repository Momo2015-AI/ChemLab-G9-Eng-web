#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
const questionPath = path.join(root, 'content/questions/question-bank.json');
const report = { errors: [], warnings: [], stats: {} };

function load(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const graph = load(graphPath);
const bank = load(questionPath);

// Content reset state: the legacy 320-question bank was intentionally removed.
// The future canonical bank belongs under content/questions/ and is optional
// until new source documents are supplied, reviewed, and generated into a bank.
if (!bank) {
  report.stats.sourceQuestions = 0;
  report.stats.sourceReady = 0;
  report.stats.sourceQuestionIds = 0;
  report.stats.effectiveQuestions = 0;
  report.stats.effectiveQuestionIds = 0;
  report.stats.overrides = 0;
  report.stats.questionBankState = 'RESET_PENDING_SOURCE_DOCUMENTS';
} else if (!Array.isArray(bank.questions)) {
  report.errors.push('content/questions/question-bank.json exists but questions[] is missing');
} else {
  const ids = new Set();
  const validTypes = new Set(['choice','multi-choice','fill','short-answer','true-false','experiment','calculation']);
  const validDifficulty = new Set(['easy','medium','hard']);
  const validBloom = new Set(['remember','understand','apply','analyze','evaluate','create']);
  let ready = 0;
  for (const q of bank.questions) {
    if (!q?.id) report.errors.push('Question without id');
    if (ids.has(q.id)) report.errors.push(`Duplicate question id: ${q.id}`);
    ids.add(q.id);
    if (!q.type || !validTypes.has(q.type)) report.errors.push(`${q.id}: invalid type`);
    if (!q.prompt?.trim()) report.errors.push(`${q.id}: empty prompt`);
    if (q.answer === undefined || q.answer === null || q.answer === '') report.errors.push(`${q.id}: missing answer`);
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
  report.stats.sourceQuestions = bank.questions.length;
  report.stats.sourceReady = ready;
  report.stats.sourceQuestionIds = ids.size;
  report.stats.effectiveQuestions = bank.questions.length;
  report.stats.effectiveQuestionIds = ids.size;
  report.stats.overrides = 0;
  if (Number.isInteger(bank.total) && bank.total !== bank.questions.length) {
    report.errors.push(`question-bank total=${bank.total} but actual=${bank.questions.length}`);
  }
}

if (graph?.nodes) {
  report.stats.graphNodes = graph.nodes.length;
  if (bank?.questions) {
    const ids = new Set(bank.questions.map(q => q?.id).filter(Boolean));
    let missing = 0;
    for (const node of graph.nodes) {
      for (const qid of (node.questions ?? [])) {
        if (!ids.has(qid)) {
          missing++;
          report.errors.push(`Knowledge graph references missing question: ${node.id} -> ${qid}`);
        }
      }
    }
    report.stats.graphMissingQuestions = missing;
  } else {
    report.stats.graphQuestionReferences = 'DEFERRED_UNTIL_NEW_BANK';
  }
}

const out = [
  '# ChemLab-G9-Eng V1.9 Content Integrity Report', '',
  `Generated: ${new Date().toISOString()}`, '',
  '## Statistics',
  ...Object.entries(report.stats).map(([k, v]) => `- ${k}: ${v}`), '',
  '## Errors',
  ...(report.errors.length ? report.errors.map(x => `- ${x}`) : ['- None']), '',
  '## Warnings',
  ...(report.warnings.length ? report.warnings.map(x => `- ${x}`) : ['- None']), ''
].join('\n');

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/content-integrity-v19.md'), out);
console.log(out);
if (report.errors.length) process.exitCode = 1;
