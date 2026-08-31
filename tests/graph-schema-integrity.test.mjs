// Enforces the knowledge-graph data contract defined in
// content/knowledge/schema.json (Sprint A of
// docs/KNOWLEDGE-GRAPH-UPGRADE-PLAN.md). This test exists so that
// schema drift (a node/relation shape the contract does not declare)
// and dangling references (question/experiment/commonMistake targets
// that no longer resolve) are caught by `npm test` instead of
// shipping silently — the q-acid-* relations referenced questions
// quarantined by v19 and nobody noticed until the graph audit was
// written (2026-08-28).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalMisconceptions } from '../content/misconceptions/canonical-misconceptions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const schemaPath = path.join(root, 'content/knowledge/schema.json');
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
const lessonsDir = path.join(root, 'content/lessons');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

const enumDomain = new Set(schema.enums.domainEnum);
const enumBloom = new Set(schema.enums.bloomLevelsEnum);
const enumSemester = new Set(schema.enums.semesterEnum);
const enumUnit = new Set(schema.enums.unitIdEnum);
const enumRelationType = new Set(schema.enums.relationTypeEnum);
const requiredNodeFields = Object.keys(schema.node.requiredFields);
const forbiddenNodeFields = Object.keys(schema.node.forbiddenFields || {});

const nodeIds = new Set(graph.nodes.map(node => node.id));

function runtimeQuestionIds() {
  const ids = new Set();
  const collect = list => {
    for (const question of list || []) {
      if (question?.id) ids.add(question.id);
    }
  };
  const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const lessonFiles = fs.readdirSync(lessonsDir)
    .filter(file => file.endsWith('.json') && !/(?:-practice|-mastery|-diagnostic|-guided-learning|-experiment|-transfer)\.json$/.test(file));
  for (const name of lessonFiles) {
    const lesson = readJson(path.join(lessonsDir, name));
    collect(lesson.questions);
    const practicePath = path.join(lessonsDir, name.replace(/\.json$/, '-practice.json'));
    if (fs.existsSync(practicePath)) {
      const practice = readJson(practicePath);
      collect(Array.isArray(practice?.questions) ? practice.questions : (Array.isArray(practice) ? practice : []));
    }
    const diagnosticPath = path.join(lessonsDir, name.replace(/\.json$/, '-diagnostic.json'));
    if (fs.existsSync(diagnosticPath)) {
      const diagnostic = readJson(diagnosticPath);
      collect(Array.isArray(diagnostic?.diagnostics) ? diagnostic.diagnostics : (Array.isArray(diagnostic?.questions) ? diagnostic.questions : []));
    }
    const masteryPath = path.join(lessonsDir, name.replace(/\.json$/, '-mastery.json'));
    if (fs.existsSync(masteryPath)) {
      const mastery = readJson(masteryPath);
      collect(Array.isArray(mastery?.mastery?.questions) ? mastery.mastery.questions : (Array.isArray(mastery?.questions) ? mastery.questions : []));
    }
    const transferPath = path.join(lessonsDir, name.replace(/\.json$/, '-transfer.json'));
    if (fs.existsSync(transferPath)) {
      collect(readJson(transferPath)?.questions || []);
    }
  }
  return ids;
}

function experimentIds() {
  const ids = new Set();
  const experimentsDir = path.join(root, 'content/experiments');
  if (fs.existsSync(experimentsDir)) {
    for (const file of fs.readdirSync(experimentsDir)) {
      if (!file.endsWith('.json')) continue;
      const data = JSON.parse(fs.readFileSync(path.join(experimentsDir, file), 'utf8'));
      if (data?.id) ids.add(data.id);
    }
  }
  const lessonFiles = fs.readdirSync(lessonsDir)
    .filter(file => file.endsWith('.json') && !/(?:-practice|-mastery|-diagnostic|-guided-learning|-experiment|-transfer)\.json$/.test(file));
  for (const name of lessonFiles) {
    const lesson = JSON.parse(fs.readFileSync(path.join(lessonsDir, name), 'utf8'));
    for (const experiment of lesson.experiments || []) {
      if (experiment?.id) ids.add(experiment.id);
    }
  }
  return ids;
}

const misconceptionIds = new Set(canonicalMisconceptions.map(entry => entry.id));
const questionPool = runtimeQuestionIds();
const experimentPool = experimentIds();

test('every knowledge node conforms to the schema contract (required fields + enums)', () => {
  assert.ok(graph.nodes.length >= 1, 'graph must declare nodes');
  const seen = new Set();
  for (const node of graph.nodes) {
    const label = node.id || '(missing id)';
    for (const field of requiredNodeFields) {
      const value = node[field];
      assert.ok(value !== undefined && value !== null && value !== '', `node ${label} missing required field: ${field}`);
    }
    assert.ok(!seen.has(node.id), `duplicate node id: ${node.id}`);
    seen.add(node.id);
    assert.ok(enumDomain.has(node.domain), `node ${node.id} domain not in schema enum: ${node.domain}`);
    assert.ok(enumSemester.has(node.semester), `node ${node.id} semester not in schema enum: ${node.semester}`);
    assert.ok(enumUnit.has(node.unitId), `node ${node.id} unitId not in schema enum: ${node.unitId} (new unit? update schema.json first)`);
    assert.ok(Array.isArray(node.bloomLevels) && node.bloomLevels.length > 0, `node ${node.id} bloomLevels must be a non-empty array`);
    for (const level of node.bloomLevels) {
      assert.ok(enumBloom.has(level), `node ${node.id} bloomLevel not in schema enum: ${level}`);
    }
    for (const field of forbiddenNodeFields) {
      assert.ok(node[field] === undefined, `node ${node.id} carries forbidden field ${field} (relations[] is the single source of truth since Sprint B)`);
    }
  }
});

test('every relation declares a valid type and resolves its references per contract', () => {
  const nodeNode = new Set(['prerequisite', 'related']);
  const enumDifficulty = new Set(schema.enums.difficultyEnum);
  const attributeMount = {
    question: new Set(['difficulty']),
    prerequisite: new Set(['weight', 'required']),
    related: new Set(['description']),
    contrast: new Set(['description']),
  };
  for (const relation of graph.relations) {
    const label = `${relation.source} -> ${relation.target} (${relation.type})`;
    assert.ok(relation.source && relation.target, `relation missing source/target: ${label}`);
    assert.ok(enumRelationType.has(relation.type), `relation type not in schema enum: ${label}`);
    assert.ok(nodeIds.has(relation.source), `relation source does not resolve to a node: ${label}`);
    if (nodeNode.has(relation.type)) {
      assert.ok(nodeIds.has(relation.target), `relation target does not resolve to a node: ${label}`);
    }
    if (relation.type === 'question') {
      assert.ok(questionPool.has(relation.target), `question relation target not in runtime question pool: ${label}`);
    }
    if (relation.type === 'experiment') {
      assert.ok(experimentPool.has(relation.target), `experiment relation target not resolvable: ${label}`);
    }
    if (relation.type === 'commonMistake') {
      assert.ok(misconceptionIds.has(relation.target), `commonMistake relation target not a canonical misconception id: ${label}`);
    }
    const allowed = attributeMount[relation.type] || new Set();
    for (const key of Object.keys(relation)) {
      if (['source', 'target', 'type'].includes(key)) continue;
      assert.ok(allowed.has(key), `attribute ${key} not allowed on ${relation.type} relation: ${label}`);
      if (key === 'difficulty') assert.ok(enumDifficulty.has(relation[key]), `difficulty not in schema enum: ${label}`);
      if (key === 'weight') assert.ok(typeof relation[key] === 'number' && relation[key] >= 0 && relation[key] <= 1, `weight must be 0-1 number: ${label}`);
      if (key === 'required') assert.ok(typeof relation[key] === 'boolean', `required must be boolean: ${label}`);
    }
  }
});

test('node misconceptionIds only reference canonical misconception ids', () => {
  for (const node of graph.nodes) {
    for (const ref of node.misconceptionIds || []) {
      assert.ok(misconceptionIds.has(ref), `node ${node.id} misconceptionIds reference does not resolve: ${ref}`);
    }
  }
});

test('schema contract itself stays current with the graph top-level shape', () => {
  for (const key of schema.graph.requiredKeys) {
    assert.ok(graph[key] !== undefined, `graph is missing contract key: ${key}`);
  }
  assert.ok(Array.isArray(graph.nodes) && Array.isArray(graph.relations), 'graph nodes/relations must be arrays');
});
