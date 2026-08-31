#!/usr/bin/env node
/**
 * Sprint 2.5 KG-3 (revised after remote upgrade): regenerate the knowledge
 * graph's `relations[]` of type 'question' from the question-side aggregation.
 *
 * The remote Sprint A+B+C (commit 92cf2a3) established the canonical schema:
 *   - `node.questions[]` is FORBIDDEN
 *   - the only authoritative way to record "this question references this
 *     knowledge node" is a relation of type 'question' with `source=nodeId`
 *     and `target=questionId`
 *   - relations[].difficulty is optional, mirrors the question's difficulty
 *
 * This script aggregates every question's `knowledgeIds` (post-alias) and
 * writes back the question-type relations, preserving the existing
 * non-question relations and any existing question relations (we replace
 * the question subset wholesale — that subset is by definition derived).
 *
 * Idempotent: running twice with no content changes is a no-op.
 */
import fs from 'node:fs';
import path from 'node:path';
import { collectQuestions, ownKnowledgeIds, resolveKnowledgeId } from './content-semantic-audit.mjs';

const root = process.cwd();
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
if (!fs.existsSync(graphPath)) {
  console.error(`[gen-graph-questions] missing ${graphPath}`);
  process.exitCode = 1;
} else {
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  // Aggregate: nodeId -> Map<questionId, { difficulty }>
  const aggregated = new Map();
  for (const { question } of collectQuestions()) {
    if (!question?.id) continue;
    for (const kid of ownKnowledgeIds(question)) {
      const resolved = resolveKnowledgeId(kid);
      if (!resolved) continue;
      if (!aggregated.has(resolved)) aggregated.set(resolved, new Map());
      // Only sync difficulty when the source value already uses the
      // canonical enum. Legacy values (easy/application/transfer) are
      // dropped per schema.json — the schema explicitly says relations
      // leave difficulty empty when the question's difficulty is
      // missing or uses a legacy word list.
      const diff = String(question.difficulty || '').toLowerCase();
      const canonical = ['basic', 'medium', 'hard'].includes(diff) ? diff : undefined;
      aggregated.get(resolved).set(question.id, canonical ? { difficulty: canonical } : {});
    }
  }
  // Drop existing question relations, keep everything else.
  const nonQuestion = (graph.relations || []).filter(r => (r.type || r.relation) !== 'question');
  const written = [];
  for (const [nodeId, qmap] of aggregated) {
    for (const [qid, attrs] of qmap) {
      const rel = { source: nodeId, target: qid, type: 'question' };
      if (attrs.difficulty) rel.difficulty = attrs.difficulty;
      written.push(rel);
    }
  }
  // Sort question relations deterministically for stable diffs.
  written.sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
  graph.relations = [...nonQuestion, ...written];
  fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2) + '\n');
  console.log(`[gen-graph-questions] regenerated question relations: ${written.length} across ${aggregated.size} nodes; total relations now ${graph.relations.length}`);
}
