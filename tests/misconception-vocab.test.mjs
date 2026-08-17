import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalMisconceptions,
  ALIAS_MAP,
  resolveMisconceptionId,
  isAlias,
  getCanonicalMisconception
} from '../content/misconceptions/canonical-misconceptions.js';
import { evaluateMastery } from '../core/assessment/mastery-policy.js';

test('canonical vocabulary has 18 entries with required fields', () => {
  assert.equal(canonicalMisconceptions.length, 18);
  for (const mc of canonicalMisconceptions) {
    assert.ok(mc.id, 'each entry has id');
    assert.ok(mc.title, 'each entry has title');
    assert.ok(mc.description, 'each entry has description');
    assert.ok(Array.isArray(mc.knowledgeIds) && mc.knowledgeIds.length > 0, `entry ${mc.id} has knowledgeIds`);
    assert.ok(Array.isArray(mc.signals) && mc.signals.length > 0, `entry ${mc.id} has signals`);
    assert.ok(['low', 'medium', 'high'].includes(mc.severity), `entry ${mc.id} has valid severity`);
    assert.ok(mc.remediation?.goal, `entry ${mc.id} has remediation.goal`);
    assert.ok(mc.remediation?.lessonIds?.length > 0, `entry ${mc.id} has remediation.lessonIds`);
  }
});

test('ALIAS_MAP has 23 entries covering all legacy ID variants', () => {
  assert.equal(Object.keys(ALIAS_MAP).length, 23);
});

test('resolveMisconceptionId resolves all known aliases to canonical form', () => {
  // L01 short-form aliases
  assert.equal(resolveMisconceptionId('observation-inference'), 'mc-method-observation-inference');
  assert.equal(resolveMisconceptionId('change-vs-property'), 'mc-matter-change-vs-property');
  assert.equal(resolveMisconceptionId('physical-vs-chemical'), 'mc-matter-physical-vs-chemical');
  assert.equal(resolveMisconceptionId('single-phenomenon-overgeneralization'), 'mc-method-single-phenomenon-overgeneralization');
  assert.equal(resolveMisconceptionId('definition-confusion'), 'mc-matter-definition-confusion');
  assert.equal(resolveMisconceptionId('property-change-confusion'), 'mc-matter-property-change-confusion');
  // L02 prefixed aliases
  assert.equal(resolveMisconceptionId('M02-observation-inference'), 'mc-method-observation-inference');
  assert.equal(resolveMisconceptionId('observation-inference-confusion'), 'mc-method-observation-inference');
  assert.equal(resolveMisconceptionId('M02-control-variable'), 'mc-method-control-variable');
  assert.equal(resolveMisconceptionId('control-variable-violation'), 'mc-method-control-variable');
  assert.equal(resolveMisconceptionId('M02-data-integrity'), 'mc-method-data-integrity');
  assert.equal(resolveMisconceptionId('data-fabrication'), 'mc-method-data-integrity');
  assert.equal(resolveMisconceptionId('M02-evidence-logic'), 'mc-method-evidence-logic');
  assert.equal(resolveMisconceptionId('evidence-logic-gap'), 'mc-method-evidence-logic');
  // L03 prefixed aliases
  assert.equal(resolveMisconceptionId('M03-safety-dilution'), 'mc-acid-safety-dilution');
  assert.equal(resolveMisconceptionId('M03-acid-distinguish'), 'mc-acid-hcl-solution');
  // L03 conceptual aliases
  assert.equal(resolveMisconceptionId('acid-property'), 'mc-acid-property');
  assert.equal(resolveMisconceptionId('safety-awareness'), 'mc-acid-safety-awareness');
  assert.equal(resolveMisconceptionId('necessary-sufficient-confusion'), 'mc-acid-necessary-sufficient');
  assert.equal(resolveMisconceptionId('safety-violation'), 'mc-acid-safety-violation');
  assert.equal(resolveMisconceptionId('metal-activity-mistake'), 'mc-acid-metal-activity');
  // Identity mappings (already canonical)
  assert.equal(resolveMisconceptionId('mc-acid-metal-overgeneralization'), 'mc-acid-metal-overgeneralization');
  assert.equal(resolveMisconceptionId('mc-acid-observation-inference'), 'mc-acid-observation-inference');
});

test('resolveMisconceptionId passes through unknown IDs unchanged', () => {
  assert.equal(resolveMisconceptionId('unknown-id'), 'unknown-id');
  assert.equal(resolveMisconceptionId(null), null);
  assert.equal(resolveMisconceptionId(undefined), null);
});

test('isAlias returns true only for non-identity aliases', () => {
  assert.equal(isAlias('observation-inference'), true);
  assert.equal(isAlias('M02-control-variable'), true);
  assert.equal(isAlias('mc-acid-metal-overgeneralization'), false);
  assert.equal(isAlias('unknown-id'), false);
});

test('getCanonicalMisconception returns full object for known IDs', () => {
  const mc = getCanonicalMisconception('mc-method-observation-inference');
  assert.ok(mc);
  assert.equal(mc.id, 'mc-method-observation-inference');
  assert.ok(mc.title.includes('观察') || mc.title.includes('推理'));
});

test('getCanonicalMisconception returns null for unknown IDs', () => {
  assert.equal(getCanonicalMisconception('nonexistent-id'), null);
});

test('mastery-policy resolves alias in criticalMisconceptions and question misconceptionIds', () => {
  const questions = [
    { id: 'q1', knowledgeIds: ['matter-change'], misconceptionIds: ['definition-confusion'] },
    { id: 'q2', knowledgeIds: ['chemical-change'], misconceptionIds: ['definition-confusion'] },
  ];
  const decision = evaluateMastery({
    questions,
    answers: [
      { question: questions[0], correct: true },
      { question: questions[1], correct: false },
    ],
    threshold: 0.5,
    requiredKnowledgeIds: ['matter-change', 'chemical-change'],
    criticalMisconceptions: ['definition-confusion'],
  });
  assert.equal(decision.misconceptionsPassed, false);
  assert.deepEqual(decision.unclearedMisconceptions, ['mc-matter-definition-confusion']);
});

test('mastery-policy resolves alias in single misconception field', () => {
  const q1 = { id: 'q1', knowledgeIds: ['acid-intro'], misconception: 'M03-safety-dilution' };
  const decision = evaluateMastery({
    questions: [q1],
    answers: [
      { question: q1, correct: false },
    ],
    criticalMisconceptions: ['M03-safety-dilution'],
  });
  assert.equal(decision.misconceptionsPassed, false);
  assert.deepEqual(decision.unclearedMisconceptions, ['mc-acid-safety-dilution']);
});

test('mastery-policy resolves alias in errorType field', () => {
  const decision = evaluateMastery({
    questions: [
      { id: 'q1', knowledgeIds: ['acid-intro'] },
    ],
    answers: [
      { question: { id: 'q1', errorType: 'safety-violation' }, correct: false },
    ],
    criticalMisconceptions: ['safety-violation'],
  });
  assert.equal(decision.misconceptionsPassed, false);
  assert.deepEqual(decision.unclearedMisconceptions, ['mc-acid-safety-violation']);
});

test('all canonical IDs have unique identifiers', () => {
  const ids = canonicalMisconceptions.map(m => m.id);
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, 'all canonical IDs must be unique');
});

test('canonical IDs do not overlap with knowledge graph node IDs', () => {
  const kgNodes = new Set([
    'acid-intro', 'acid-property', 'chemical-change', 'chemical-property',
    'control-variables', 'data-integrity', 'evidence-reasoning',
    'matter-change', 'observation-inference', 'physical-change',
    'physical-property', 'safety-awareness', 'scientific-inquiry'
  ]);
  for (const mc of canonicalMisconceptions) {
    assert.ok(!kgNodes.has(mc.id), `${mc.id} must not collide with knowledge graph node IDs`);
  }
});

test('every canonical misconception maps to at least one knowledge graph node', () => {
  const validKgNodes = new Set([
    'acid-intro', 'acid-property', 'chemical-change', 'chemical-property',
    'control-variables', 'data-integrity', 'evidence-reasoning',
    'matter-change', 'observation-inference', 'physical-change',
    'physical-property', 'safety-awareness', 'scientific-inquiry'
  ]);
  for (const mc of canonicalMisconceptions) {
    const allValid = mc.knowledgeIds.every(kid => validKgNodes.has(kid));
    assert.ok(allValid, `${mc.id} has invalid knowledgeId: ${mc.knowledgeIds.filter(k => !validKgNodes.has(k)).join(', ')}`);
  }
});
