import fs from 'node:fs/promises';

const [legacyPath, canonicalPath] = process.argv.slice(2);
if (!legacyPath || !canonicalPath) {
  console.error('Usage: node scripts/verify-knowledge-graph-migration.mjs <legacy> <canonical>');
  process.exit(2);
}

const legacy = JSON.parse(await fs.readFile(legacyPath, 'utf8'));
const canonical = JSON.parse(await fs.readFile(canonicalPath, 'utf8'));

const legacyNodes = new Map((legacy.nodes || []).map(node => [node.id, node]));
const canonicalNodes = new Map((canonical.nodes || []).map(node => [node.id, node]));

const expected = new Set((legacy.relations || []).map(r => `${r.source}|${r.type}|${r.target}`));
for (const node of legacy.nodes || []) {
  for (const [type, targets] of Object.entries(node.relations || {})) {
    for (const target of targets || []) expected.add(`${node.id}|${type}|${target}`);
  }
}
const actual = new Set((canonical.relations || []).map(r => `${r.source}|${r.type}|${r.target}`));

const missingNodes = [...legacyNodes.keys()].filter(id => !canonicalNodes.has(id));
const missingRelations = [...expected].filter(key => !actual.has(key));
const orphanRelations = [...actual].filter(key => {
  const [source, , target] = key.split('|');
  return !canonicalNodes.has(source) || !canonicalNodes.has(target);
});

console.log(JSON.stringify({
  legacyNodes: legacyNodes.size,
  canonicalNodes: canonicalNodes.size,
  expectedRelations: expected.size,
  canonicalRelations: actual.size,
  missingNodes,
  missingRelations,
  orphanRelations,
  ok: missingNodes.length === 0 && missingRelations.length === 0 && orphanRelations.length === 0
}, null, 2));

if (missingNodes.length || missingRelations.length || orphanRelations.length) process.exit(1);
