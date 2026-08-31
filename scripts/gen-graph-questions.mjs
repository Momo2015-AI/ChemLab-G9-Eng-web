#!/usr/bin/env node
/**
 * Sprint 2.5 KG-3: regenerate the knowledge graph's `node.questions[]` from
 * the question-side aggregation (the canonical source).
 *
 * The graph historically listed a small subset of questions on each node;
 * the runtime recheck / knowledge-detail / knowledge graph view code all
 * trust the graph, so a stale listing creates a false sense of "no
 * questions on this node" while the runtime happily routes the student
 * through the topic. This generator runs the same aggregation as
 * content-semantic-audit.mjs and writes the canonical list back.
 *
 * Idempotent: running it twice produces the same file. Invoked as a
 * pre-step of `npm run audit:content` so CI catches drift.
 */
import fs from 'node:fs';
import path from 'node:path';
import { collectQuestions, KNOWLEDGE_GRAPH, ownKnowledgeIds, resolveKnowledgeId } from './content-semantic-audit.mjs';

const root = process.cwd();
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
if (!fs.existsSync(graphPath)) {
  console.error(`[gen-graph-questions] missing ${graphPath}`);
  process.exitCode = 1;
} else {
  const collected = collectQuestions();
  const aggregated = new Map();
  for (const { question } of collected) {
    if (!question?.id) continue;
    for (const kid of ownKnowledgeIds(question)) {
      const resolved = resolveKnowledgeId(kid);
      if (!resolved) continue;
      if (!aggregated.has(resolved)) aggregated.set(resolved, new Set());
      aggregated.get(resolved).add(question.id);
    }
  }
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  let touched = 0, total = 0;
  for (const node of graph.nodes) {
    const declared = new Set(node.questions || []);
    const actual = aggregated.get(node.id) || new Set();
    if (declared.size !== actual.size || ![...declared].every(q => actual.has(q))) {
      node.questions = [...actual].sort();
      touched += 1;
    }
    total += actual.size;
  }
  fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2) + '\n');
  console.log(`[gen-graph-questions] regenerated node.questions[] for ${touched}/${graph.nodes.length} nodes; ${total} question references total`);
}
