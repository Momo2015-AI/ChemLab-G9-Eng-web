import fs from 'node:fs/promises';

const file = process.argv[2] || 'modules/questions/question-bank.json';
const data = JSON.parse(await fs.readFile(file, 'utf8'));
const questions = data.questions;
if (!Array.isArray(questions)) throw new Error('question-bank.questions must be an array');

const ids = new Set();
const errors = [];
for (const [index, q] of questions.entries()) {
  if (!q || typeof q !== 'object') { errors.push(`questions[${index}] is not an object`); continue; }
  if (!q.id) errors.push(`questions[${index}] missing id`);
  if (q.id && ids.has(q.id)) errors.push(`duplicate question id: ${q.id}`);
  if (q.id) ids.add(q.id);
  if (!q.question && !q.stem) errors.push(`${q.id || index}: missing question/stem`);
  if (!Array.isArray(q.options) && !Array.isArray(q.choices)) errors.push(`${q.id || index}: missing options/choices`);
}

console.log(`Validated ${questions.length} questions, ${ids.size} unique IDs`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
