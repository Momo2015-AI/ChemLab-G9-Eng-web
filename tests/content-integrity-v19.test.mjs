import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUESTION_BANK_PATH = 'content/questions/question-bank.json';

async function readJson(relativePath) {
  const text = await fs.readFile(path.join(ROOT, relativePath), 'utf8');
  return JSON.parse(text);
}

async function readOptionalJson(relativePath) {
  try {
    return await readJson(relativePath);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

test('runtime loader no longer references a missing global question-bank endpoint', async () => {
  // The silent question-bank.json endpoint was removed from the loader after
  // it masked a content outage for the entire global pool. This test fails if
  // anyone reintroduces the dead endpoint without shipping the file.
  const source = await fs.readFile(path.join(ROOT, 'app/content-loader.js'), 'utf8');
  assert.ok(!source.includes('question-bank.json'), 'loader must not reference question-bank.json');
  assert.ok(!source.includes('questions-by-topic.json'), 'loader must not reference the dead topic-bank endpoint');
  assert.ok(!source.includes('loadOptionalJSON'), 'silent optional-fetch fallbacks must not come back');

  const bank = await readOptionalJson(QUESTION_BANK_PATH);
  if (bank !== null) {
    // If a bank file is ever reintroduced deliberately, it must satisfy the bank contract.
    assert.ok(Array.isArray(bank.questions), 'question bank must expose questions[]');
    assert.equal(bank.questions.length, bank.total, 'declared total must match actual question count');
    const ids = bank.questions.map(question => question.id);
    assert.equal(new Set(ids).size, ids.length, 'question IDs must be unique');
  }
});

test('question bank records satisfy the runtime contract when a bank exists', async () => {
  const bank = await readOptionalJson(QUESTION_BANK_PATH);
  if (bank === null) return;

  const allowedDifficulty = new Set(['easy', 'medium', 'hard']);
  const allowedBloom = new Set(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']);

  for (const question of bank.questions) {
    const answer = question.answer ?? question.ans;

    assert.equal(typeof question.prompt, 'string', `${question.id}: prompt is required`);
    assert.ok(question.prompt.trim(), `${question.id}: prompt must not be empty`);
    assert.ok(answer !== undefined && answer !== null, `${question.id}: answer is required`);
    assert.equal(typeof question.explanation, 'string', `${question.id}: explanation is required`);
    assert.ok(question.explanation.trim(), `${question.id}: explanation must not be empty`);
    assert.ok(Array.isArray(question.knowledge) && question.knowledge.length > 0, `${question.id}: knowledge linkage is required`);
    assert.ok(allowedDifficulty.has(question.difficulty), `${question.id}: unsupported difficulty`);
    assert.ok(allowedBloom.has(question.bloomLevel), `${question.id}: unsupported bloomLevel`);

    if (question.type === 'choice') {
      assert.ok(Array.isArray(question.options) && question.options.length >= 2, `${question.id}: choice requires options`);
      assert.equal(typeof answer, 'string', `${question.id}: choice answer must be a string`);
      assert.ok(question.options.some(option => option.startsWith(`${answer}.`)), `${question.id}: answer must resolve to an option`);
    }
  }
});

test('canonical knowledge graph has unique node IDs and validates question references against runtime content', async () => {
  const graph = await readJson('content/knowledge/knowledge-graph.json');
  const bank = await readOptionalJson(QUESTION_BANK_PATH);

  assert.ok(Array.isArray(graph.nodes), 'knowledge graph must expose nodes[]');
  const nodeIds = graph.nodes.map(node => node.id);
  assert.ok(nodeIds.every(Boolean), 'every knowledge node must have an id');
  assert.equal(new Set(nodeIds).size, nodeIds.length, 'knowledge node IDs must be unique');

  // Collect the effective runtime question ids (same pools the loader serves).
  const runtimeIds = new Set();
  if (bank !== null) for (const q of bank.questions || []) runtimeIds.add(q.id);
  const { day01ProductionOverrides } = await import('../content/questions/day01-production-overrides.js');
  const { day01DiagnosticQuestions } = await import('../content/questions/day01-diagnostics.js');
  for (const q of [...day01ProductionOverrides, ...day01DiagnosticQuestions]) runtimeIds.add(q.id);
  const lessonsDir = path.join(ROOT, 'content/lessons');
  const files = (await fs.readdir(lessonsDir)).filter(file => file.endsWith('.json'));
  for (const file of files) {
    const data = await readJson(path.join('content/lessons', file));
    for (const key of ['questions', 'diagnostics']) {
      for (const q of data[key] || []) runtimeIds.add(q.id);
    }
    for (const q of data.mastery?.questions || []) runtimeIds.add(q.id);
  }

  const references = graph.nodes.flatMap(node => node.questions ?? []);
  const missing = [...new Set(references.filter(id => !runtimeIds.has(id)))];
  assert.deepEqual(missing, [], `knowledge graph contains missing question references: ${missing.join(', ')}`);

  // Every question relation must resolve to a real runtime question id.
  const relationTargets = (graph.relations || []).filter(r => r.type === 'question').map(r => r.target);
  const missingRelations = [...new Set(relationTargets.filter(id => !runtimeIds.has(id)))];
  assert.deepEqual(missingRelations, [], `knowledge graph question relations point at unknown questions: ${missingRelations.join(', ')}`);
});

test('transfer pools follow the per-lesson runtime contract', async () => {
  const lessonsDir = path.join(ROOT, 'content/lessons');
  const files = (await fs.readdir(lessonsDir)).filter(file => file.endsWith('-transfer.json'));
  assert.ok(files.length >= 2, 'lesson-01 and lesson-02 must ship dedicated transfer pools');

  for (const file of files) {
    const data = await readJson(path.join('content/lessons', file));
    assert.ok(Array.isArray(data.questions), `${file}: questions[] required`);
    assert.ok(data.questions.length >= 4, `${file}: transfer pool needs real items`);
    for (const question of data.questions) {
      assert.ok(question.id, `${file}: item id required`);
      assert.equal(question.type, 'constructed', `${question.id}: transfer items are constructed responses`);
      assert.ok(question.question?.trim(), `${question.id}: prompt required`);
      assert.ok(Array.isArray(question.rubric?.keywords) && question.rubric.keywords.length >= 2, `${question.id}: rubric keyword groups required`);
      assert.ok(question.knowledgeIds?.length, `${question.id}: knowledge linkage required`);
    }
  }
});
