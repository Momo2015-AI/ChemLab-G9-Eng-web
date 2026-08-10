import fs from 'node:fs/promises';

const files = [
  'modules/questions/question-bank.json',
  'modules/questions/taxonomy/knowledge-graph.json',
  'modules/lessons/manifest.json',
  'content/experiments',
  'content/knowledge'
];

for (const file of files) {
  try {
    const stat = await fs.stat(file);
    console.log(`${file}: ${stat.isDirectory() ? 'directory' : 'file'} present`);
  } catch {
    console.error(`${file}: missing`);
    process.exitCode = 1;
  }
}

console.log('Content source inventory check complete.');
