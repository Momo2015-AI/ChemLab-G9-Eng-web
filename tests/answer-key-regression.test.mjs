import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

function findQuestion(file, id) {
  const data = readJson(file);
  const pools = [data.questions, data.diagnosticQuestions, data.mastery?.questions];
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    const q = pool.find((item) => item?.id === id);
    if (q) return q;
  }
  return null;
}

test('answer-key regression: L30-P06 correct answer is option 0 (18g)', () => {
  const q = findQuestion('content/lessons/lesson-18-stoichiometry-calculation-practice.json', 'L30-P06');
  assert.ok(q, 'L30-P06 should exist');
  assert.equal(q.answer, 0, '2gH2+16gO2 fully react to produce 18g water, which is option index 0');
  assert.equal(q.options[0], '18g');
});

test('answer-key regression: L12-P08 option D is the wrong operation (试管口向上倾斜)', () => {
  const q = findQuestion('content/lessons/lesson-07-oxygen-preparation-comprehensive-practice.json', 'L12-P08');
  assert.ok(q, 'L12-P08 should exist');
  assert.equal(q.answer, 3, 'question asks for the WRONG operation, so option D must be the wrong one');
  assert.equal(q.options[3], '试管口向上倾斜');
  assert.equal(q.options[0], '试管口略向下倾斜');
});

test('answer-key regression: L05-Q03 option D is the false statement (氧气易溶于水)', () => {
  const q = findQuestion('content/lessons/lesson-05-oxygen.json', 'L05-Q03');
  assert.ok(q, 'L05-Q03 should exist');
  assert.equal(q.answer, 3, 'question asks for the FALSE description, so option D must be false');
  assert.equal(q.options[3], '氧气易溶于水');
  assert.equal(q.options[1], '氧气不易溶于水');
});
