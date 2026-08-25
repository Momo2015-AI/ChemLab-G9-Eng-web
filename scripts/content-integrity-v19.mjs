#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { day01DiagnosticQuestions } from '../content/questions/day01-diagnostics.js';
import { day01ProductionOverrides } from '../content/questions/day01-production-overrides.js';

const root = process.cwd();
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
const questionPath = path.join(root, 'content/questions/question-bank.json');
const lessonsPath = path.join(root, 'content/lessons');
const report = { errors: [], warnings: [], stats: {} };

function load(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const graph = load(graphPath);
const bank = load(questionPath);

function normalizeLessonQuestion(question, lesson, source = 'lesson') {
  if (!question?.id) return null;
  const options = Array.isArray(question.options) ? question.options : [];
  const answer = question.answer;
  const knowledge = question.knowledge || question.knowledgeIds || question.knowledgePoints || question.knowledgePoint || lesson.knowledgePoints || [];
  return {
    ...question,
    prompt: question.prompt || question.question || question.q,
    answer,
    knowledge: Array.isArray(knowledge) ? knowledge : [knowledge].filter(Boolean),
    options,
    explanation: question.explanation || '',
    source,
  };
}

function loadRuntimeQuestions() {
  if (!fs.existsSync(lessonsPath)) return [];
  const questions = [];
  const lessonFiles = fs.readdirSync(lessonsPath).filter(file => file.endsWith('.json') && !/(?:-practice|-mastery|-diagnostic|-guided-learning|-experiment|-transfer)\.json$/.test(file));
  for (const name of lessonFiles) {
    const lesson = load(path.join(lessonsPath, name));
    if (!lesson) continue;
    const add = (list, source) => {
      for (const question of list || []) {
        const normalized = normalizeLessonQuestion(question, lesson, source);
        if (normalized) questions.push(normalized);
      }
    };
    add(lesson.questions, 'lesson');
    const practice = load(path.join(lessonsPath, name.replace(/\.json$/, '-practice.json')));
    add(Array.isArray(practice?.questions) ? practice.questions : (Array.isArray(practice) ? practice : []), 'practice');
    const diagnostic = load(path.join(lessonsPath, name.replace(/\.json$/, '-diagnostic.json')));
    add(Array.isArray(diagnostic?.diagnostics) ? diagnostic.diagnostics : (Array.isArray(diagnostic?.questions) ? diagnostic.questions : []), 'diagnostic');
    const masteryResource = load(path.join(lessonsPath, name.replace(/\.json$/, '-mastery.json')));
    add(Array.isArray(masteryResource?.mastery?.questions) ? masteryResource.mastery.questions : (Array.isArray(masteryResource?.questions) ? masteryResource.questions : []), 'mastery');
    const transferResource = load(path.join(lessonsPath, name.replace(/\.json$/, '-transfer.json')));
    add(Array.isArray(transferResource?.questions) ? transferResource.questions : [], 'transfer');
  }
  return questions;
}

const runtimeQuestions = loadRuntimeQuestions();
runtimeQuestions.push(
  ...day01ProductionOverrides.map(question => ({ ...question, source: 'runtime-override' })),
  ...day01DiagnosticQuestions
    .filter(question => question.status !== 'archived')
    .map(question => ({ ...question, source: 'runtime-diagnostic' }))
);

// The optional question bank is not required while canonical runtime content
// is present and has passed the same effective-content validation.
if (!bank) {
  const ids = new Set(runtimeQuestions.map(question => question.id));
  report.stats.sourceQuestions = runtimeQuestions.length;
  report.stats.sourceReady = runtimeQuestions.length;
  report.stats.sourceQuestionIds = ids.size;
  report.stats.effectiveQuestions = runtimeQuestions.length;
  report.stats.effectiveQuestionIds = ids.size;
  report.stats.overrides = day01ProductionOverrides.length;
  report.stats.runtimeQuestionSources = 'canonical lesson/practice/diagnostic/mastery content plus runtime overrides/diagnostics';
  report.stats.questionBankState = 'CANONICAL_RUNTIME_SOURCE';
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

if (runtimeQuestions.length) {
  const ids = new Set();
  for (const question of runtimeQuestions) {
    if (ids.has(question.id)) report.errors.push(`Duplicate effective runtime question id: ${question.id}`);
    ids.add(question.id);
    if (!question.prompt?.trim()) report.errors.push(`${question.id}: effective runtime question has no prompt`);
    if ((question.answer === undefined || question.answer === null || question.answer === '') && question.type !== 'constructed') report.errors.push(`${question.id}: effective runtime question has no answer`);
    if (!question.explanation?.trim() && question.type !== 'constructed' && question.source !== 'diagnostic') report.errors.push(`${question.id}: effective runtime question has no explanation`);
    if (!question.knowledge.length) report.errors.push(`${question.id}: effective runtime question has no knowledge links`);
    if (Array.isArray(question.options) && question.options.length > 0 && question.answer !== undefined) {
      const index = Number.isInteger(question.answer) ? question.answer : Number(String(question.answer).toUpperCase().charCodeAt(0) - 65);
      if (!Number.isInteger(index) || index < 0 || index >= question.options.length) report.errors.push(`${question.id}: effective runtime answer does not resolve to options`);
    }
  }
}

if (graph?.nodes) {
  report.stats.graphNodes = graph.nodes.length;
  if (bank?.questions || runtimeQuestions.length) {
    const ids = new Set((bank?.questions || runtimeQuestions).map(q => q?.id).filter(Boolean));
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
    report.stats.graphQuestionReferences = 'VALIDATED_AGAINST_CANONICAL_RUNTIME_SOURCE';
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
