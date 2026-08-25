#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import lessonManifest from '../content/curriculum/lesson-manifest.js';

const root = process.cwd();
const lessonsDir = path.join(root, 'content/lessons');
const reportDir = path.join(root, 'reports');
const questionBankPath = path.join(root, 'content/questions/question-bank.json');
const questionBankExists = fs.existsSync(questionBankPath);
const files = fs.existsSync(lessonsDir)
  ? fs.readdirSync(lessonsDir).filter((name) => /^lesson-.*\.json$/.test(name) && !name.endsWith('-guided-learning.json') && !name.endsWith('-experiment.json') && !name.endsWith('-practice.json') && !name.endsWith('-diagnostic.json') && !name.endsWith('-mastery.json') && !name.endsWith('-transfer.json')).sort()
  : [];

const SUB_RESOURCES = ['-practice.json', '-diagnostic.json', '-mastery.json', '-transfer.json'];

function loadJson(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) return null;
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch {
    return null;
  }
}

function countRuntimeQuestions(file) {
  const base = file.replace(/\.json$/, '');
  const lesson = loadJson(`content/lessons/${file}`);
  const counts = {};
  if (Array.isArray(lesson?.questions)) counts.lesson = lesson.questions.filter(q => q && q.id).length;
  for (const suffix of SUB_RESOURCES) {
    const resource = loadJson(`content/lessons/${base}${suffix}`);
    if (!resource) continue;
    const suffixKey = suffix.replace(/^\-/, '').replace(/\.json$/, '');
    const questions = suffixKey === 'diagnostic'
      ? (Array.isArray(resource.diagnostics) ? resource.diagnostics : (Array.isArray(resource.questions) ? resource.questions : []))
      : suffixKey === 'mastery'
        ? (Array.isArray(resource.mastery?.questions) ? resource.mastery.questions : (Array.isArray(resource.questions) ? resource.questions : []))
        : (Array.isArray(resource.questions) ? resource.questions : (Array.isArray(resource) ? resource : []));
    if (Array.isArray(questions)) counts[suffixKey] = questions.filter(q => q && q.id).length;
  }
  return counts;
}

const placeholderPatterns = [
  /掌握.+的核心概念与性质。/,
  /通过观察、实验和讨论，理解.+的化学原理。/,
  /结合典型例题，掌握.+的应用方法。/,
  /完成5道随堂练习，检测学习效果。/
];
const requiredArrays = ['knowledgePoints', 'experiments', 'questions', 'sections'];
const requiredSectionTitles = [];
const reviewStates = new Set(['review', 'in-review', 'ready-for-review']);
const releasedStates = new Set(['ready', 'released', 'published']);

const report = {
  scanned: 0,
  template: 0,
  realContent: 0,
  ready: 0,
  needsRewrite: 0,
  duplicateLegacy: fs.existsSync(path.join(lessonsDir, 'day01.json')),
  questionBankState: questionBankExists ? 'SOURCE_BANK_PRESENT' : 'CANONICAL_RUNTIME_SOURCE',
  issues: [],
  lessons: []
};

const manifestByCanonical = new Map(
  (Array.isArray(lessonManifest.lessons) ? lessonManifest.lessons : [])
    .map(lesson => [lesson.canonicalId, lesson])
);

for (const file of files) {
  const fullPath = path.join(lessonsDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    report.issues.push(`${file}: invalid JSON (${error.message})`);
    continue;
  }

  report.scanned++;
  const sectionBodies = Array.isArray(data.sections)
    ? data.sections.flatMap((section) => Array.isArray(section.body) ? section.body : [])
    : [];
  const text = sectionBodies.join('\n');
  const templateHits = placeholderPatterns.filter((pattern) => pattern.test(text)).length;
  const missing = [];

  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) missing.push(`${key}[]`);
  }
  if (!data.title?.trim()) missing.push('title');
  if (!Array.isArray(data.sections) || data.sections.length === 0) missing.push('sections');
  for (const title of requiredSectionTitles) {
    if (!data.sections?.some((section) => section?.title === title)) missing.push(`section:${title}`);
  }

  const releaseStatus = String(data.releaseStatus || data.status || data.provenance?.status || '').toLowerCase();
  const status = templateHits > 0 ? 'template' : (missing.length ? 'incomplete' : (releasedStates.has(releaseStatus) ? 'released' : reviewStates.has(releaseStatus) ? 'review' : 'unavailable'));
  if (status === 'template') {
    report.template++;
    report.needsRewrite++;
  } else if (status === 'released' || status === 'review') {
    report.realContent++;
    if (status === 'released') report.ready++;
  } else {
    report.needsRewrite++;
  }

  if (templateHits > 0) report.issues.push(`${file}: template placeholders detected (${templateHits}/4 core sections)`);
  if (missing.length) report.issues.push(`${file}: missing ${missing.join(', ')}`);

  const lessonId = data.id || data.canonicalId || file.replace(/\.json$/, '');
  const manifestEntry = manifestByCanonical.get(lessonId);
  const runtimeQuestionCounts = countRuntimeQuestions(file);
  const totalRuntimeQuestions = Object.values(runtimeQuestionCounts).reduce((sum, count) => sum + count, 0);
  const contractErrors = [];

  if (status === 'released' || status === 'review') {
    if (totalRuntimeQuestions === 0) {
      contractErrors.push(`released/review lesson '${lessonId}' has no runtime question pool (lesson[]/practice/diagnostic/mastery all empty)`);
    }
    if (!runtimeQuestionCounts.transfer) {
      contractErrors.push(`released/review lesson '${lessonId}' must ship a dedicated transfer pool (${file.replace(/\.json$/, '-transfer.json')})`);
    }
    if (!manifestEntry) {
      contractErrors.push(`lesson '${lessonId}' is not registered in the canonical lesson manifest`);
    }
  }

  if (manifestEntry && lessonId) {
    const releaseStates = new Set(['ready', 'released', 'published']);
    const manifestRelease = String(manifestEntry.releaseStatus || manifestEntry.status || '').toLowerCase();
    const manifestReleased = releaseStates.has(manifestRelease);
    const fileReleased = releaseStates.has(String(data.releaseStatus || data.status || '').toLowerCase());
    if (manifestReleased !== fileReleased) {
      contractErrors.push(`release status mismatch: manifest='${manifestRelease}' but lesson='${String(data.releaseStatus || data.status || '').toLowerCase()}'`);
    }
    if (manifestEntry.semester && data.semester && manifestEntry.semester !== data.semester) {
      contractErrors.push(`semester mismatch: manifest='${manifestEntry.semester}' but lesson='${data.semester}'`);
    }
    if (manifestEntry.unitId && data.unitId && manifestEntry.unitId !== data.unitId) {
      contractErrors.push(`unitId mismatch: manifest='${manifestEntry.unitId}' but lesson='${data.unitId}'`);
    }
  }

  if (contractErrors.length) report.issues.push(`${file}: ${contractErrors.join('; ')}`);

  report.lessons.push({
    file,
    day: data.day ?? null,
    title: data.title ?? null,
    status,
    releaseStatus: releaseStatus || null,
    templateHits,
    missing,
    runtimeQuestions: runtimeQuestionCounts,
    contractErrors
  });
}

// A reset state is valid only when no canonical lesson has real released content.
// Once canonical lessons exist, template/incomplete lessons are a blocking gate.
const resetPending = !questionBankExists && report.realContent === 0;
const contractViolations = report.lessons.some((item) => item.contractErrors.length > 0);
const gateBlocked = !resetPending && (report.template > 0 || report.needsRewrite > 0 || report.duplicateLegacy || contractViolations);

const lines = [
  '# V1.9 Lesson Content Readiness Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Baseline',
  `- Lessons scanned: ${report.scanned}`,
  `- Template lessons: ${report.template}`,
  `- Real-content candidates: ${report.realContent}`,
  `- Ready by automated scan: ${report.ready}`,
  `- Lessons requiring rewrite/incompletion work: ${report.needsRewrite}`,
  `- Question bank state: ${report.questionBankState}`,
  `- Legacy duplicate day01.json present: ${report.duplicateLegacy ? 'YES' : 'NO'}`,
  `- Manifest contract violations: ${report.lessons.reduce((sum, item) => sum + item.contractErrors.length, 0)}`,
  '',
  '## Lesson matrix',
  '| File | Day | Title | Status | Release status | Template hits | Missing | Runtime questions | Manifest contract |',
  '|---|---:|---|---|---|---:|---|---|---|',
  ...report.lessons.map((item) => `| ${item.file} | ${item.day ?? '-'} | ${item.title ?? '-'} | ${item.status} | ${item.releaseStatus ?? '-'} | ${item.templateHits} | ${item.missing.join(', ') || '-'} | ${Object.values(item.runtimeQuestions).join('+') || '-'} | ${item.contractErrors.join('; ') || '-'} |`),
  '',
  '## Issues',
  ...(report.issues.length ? report.issues.map((item) => `- ${item}`) : ['- None']),
  '',
  '## Gate',
  resetPending
    ? '- RESET: source-driven content rebuild is pending. Templates are recorded as incomplete evidence and do not block engineering validation or deployment readiness.'
    : (gateBlocked
      ? '- BLOCKED: template/incomplete lessons or release contract violations remain. No lesson may be promoted to ready by this scanner.'
      : '- PASS: no template/incomplete lessons and no release contract violations detected.')
];

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'lesson-content-readiness-v19.md'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(reportDir, 'lesson-content-readiness-v19.json'), JSON.stringify(report, null, 2) + '\n');
console.log(lines.join('\n'));

if (gateBlocked) process.exitCode = 1;
