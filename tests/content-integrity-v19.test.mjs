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

test('question bank is in reset state until source documents are supplied', async () => {
  const bank = await readOptionalJson(QUESTION_BANK_PATH);
  if (bank === null) return;

  assert.ok(Array.isArray(bank.questions), 'question bank must expose questions[]');
  assert.equal(bank.questions.length, bank.total, 'declared total must match actual question count');

  const ids = bank.questions.map(question => question.id);
  assert.ok(ids.every(Boolean), 'every question must have an id');
  assert.equal(new Set(ids).size, ids.length, 'question IDs must be unique');
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

test('canonical knowledge graph has unique node IDs and validates question references when a bank exists', async () => {
  const graph = await readJson('content/knowledge/knowledge-graph.json');
  const bank = await readOptionalJson(QUESTION_BANK_PATH);

  assert.ok(Array.isArray(graph.nodes), 'knowledge graph must expose nodes[]');
  const nodeIds = graph.nodes.map(node => node.id);
  assert.ok(nodeIds.every(Boolean), 'every knowledge node must have an id');
  assert.equal(new Set(nodeIds).size, nodeIds.length, 'knowledge node IDs must be unique');

  if (bank === null) return;

  const questionIds = new Set(bank.questions.map(question => question.id));
  const references = graph.nodes.flatMap(node => node.questions ?? []);
  const missing = [...new Set(references.filter(id => !questionIds.has(id)))];
  assert.deepEqual(missing, [], `knowledge graph contains missing question references: ${missing.join(', ')}`);
});
