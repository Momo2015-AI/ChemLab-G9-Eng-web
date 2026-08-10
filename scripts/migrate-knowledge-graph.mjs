import fs from 'node:fs/promises';
import path from 'node:path';

const input = process.argv[2] || 'modules/questions/taxonomy/knowledge-graph.json';
const output = process.argv[3] || 'content/knowledge/knowledge-graph.json';

const raw = await fs.readFile(input, 'utf8');
const source = JSON.parse(raw);
const nodes = Array.isArray(source.nodes) ? source.nodes : [];
const relations = Array.isArray(source.relations) ? [...source.relations] : [];
const seen = new Set(relations.map(r => `${r.source}|${r.type}|${r.target}`));

for (const node of nodes) {
  for (const [type, targets] of Object.entries(node.relations || {})) {
    if (!Array.isArray(targets)) continue;
    for (const target of targets) {
      const relation = { source: node.id, target, type };
      const key = `${relation.source}|${relation.type}|${relation.target}`;
      if (!seen.has(key)) {
        relations.push(relation);
        seen.add(key);
      }
    }
  }
}

const migrated = {
  version: '1.7.0',
  source: path.normalize(input).replaceAll('\\', '/'),
  nodes: nodes.map(({ relations: _relations, ...node }) => node),
  relations
};

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(migrated, null, 2)}\n`);
console.log(`Migrated ${nodes.length} nodes and ${relations.length} relations to ${output}`);
