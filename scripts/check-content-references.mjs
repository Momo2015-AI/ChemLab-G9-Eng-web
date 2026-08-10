import fs from 'node:fs/promises';

const questionFile = process.argv[2] || 'modules/questions/question-bank.json';
const graphFile = process.argv[3] || 'modules/questions/taxonomy/knowledge-graph.json';

const questionsData = JSON.parse(await fs.readFile(questionFile, 'utf8'));
const graphData = JSON.parse(await fs.readFile(graphFile, 'utf8'));
const nodes = new Set((graphData.nodes || []).map(n => n.id));
const errors = [];
const questions = questionsData.questions || [];

function refsOf(question) {
  const values = [question.knowledgeId, question.knowledgePointId, question.knowledge, question.knowledgeIds, question.knowledgePoints];
  return values.flatMap(value => Array.isArray(value) ? value : value ? [value] : []);
}

for (const question of questions) {
  for (const id of refsOf(question)) {
    if (typeof id === 'string' && !nodes.has(id)) {
      errors.push(`${question.id || '<unknown-question>'} -> missing knowledge node: ${id}`);
    }
  }
}

console.log(`Checked ${questions.length} questions against ${nodes.size} knowledge nodes`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
