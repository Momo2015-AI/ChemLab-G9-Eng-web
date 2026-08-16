import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LearningController } from '../controllers/learning-controller.js';
import { canCompleteLesson } from '../content/release-policy.js';
import { KnowledgeEngine } from '../core/knowledge-graph/canonical-knowledge-engine.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const lessonFiles = [
  'lesson-01-material-changes-properties',
  'lesson-01-material-changes-properties-mastery',
  'lesson-01-material-changes-properties-practice',
  'lesson-01-material-changes-properties-diagnostic',
  'lesson-02-chemistry-as-experimental-science',
  'lesson-02-chemistry-as-experimental-science-mastery',
  'lesson-02-chemistry-as-experimental-science-practice',
  'lesson-02-chemistry-as-experimental-science-diagnostic',
];

const VOCABULARY = new Set([
  'matter-change', 'physical-change', 'chemical-change',
  'physical-property', 'chemical-property',
  'observation-inference', 'evidence-reasoning',
  'scientific-inquiry', 'control-variables', 'data-integrity',
]);

test('lesson-01 reaches completed phase through markComplete when ready', () => {
  const lesson = JSON.parse(read('content/lessons/lesson-01-material-changes-properties.json'));
  assert.equal(canCompleteLesson(lesson), true);
  const state = {
    progress: { completed: {} },
    learning: { lessons: { 'lesson-01-material-changes-properties': { phase: 'MASTERED', mastery: { status: 'passed' } } } },
    save() {},
  };
  const controller = new LearningController({ contentService: {}, state });
  assert.equal(controller.markComplete('lesson-01-material-changes-properties'), true);
  assert.equal(state.progress.completed['lesson-01-material-changes-properties'], true);
  assert.equal(state.learning.lessons['lesson-01-material-changes-properties'].phase, 'COMPLETED');
});

test('lesson-02 ships complete guided learning and resource chain', () => {
  const lesson = JSON.parse(read('content/lessons/lesson-02-chemistry-as-experimental-science.json'));
  assert.equal(lesson.status, 'ready');
  assert.equal(lesson.releaseStatus, 'ready');
  assert.ok(Array.isArray(lesson.guidedLearning.steps) && lesson.guidedLearning.steps.length >= 8);
  for (const step of lesson.guidedLearning.steps) {
    assert.ok(step.id, 'guided step has id');
    assert.ok(typeof step.title === 'string' && step.title.length > 0);
  }
  for (const key of ['mastery', 'practice', 'diagnostic', 'experiment']) {
    const ref = lesson.resourceRefs?.[key];
    assert.ok(ref, `resourceRefs.${key} exists`);
    assert.ok(fs.existsSync(new URL(`../${ref}`, import.meta.url)), `resourceRef target exists: ${ref}`);
  }
});

test('lesson-02 mastery content satisfies the declared contract', () => {
  const lesson = JSON.parse(read('content/lessons/lesson-02-chemistry-as-experimental-science.json'));
  const mastery = JSON.parse(read('content/lessons/lesson-02-chemistry-as-experimental-science-mastery.json'));
  assert.ok(Array.isArray(mastery.mastery?.questions));
  const questions = mastery.mastery.questions;
  assert.ok(questions.length >= lesson.mastery.questionCount);
  assert.equal(lesson.mastery.threshold, mastery.mastery.threshold);
  const choiceQuestions = questions.filter(question => question.type !== 'constructed');
  assert.ok(choiceQuestions.length > 0, 'at least one choice question');
  for (const question of choiceQuestions) {
    assert.ok(question.id, 'mastery question has id');
    assert.ok(Array.isArray(question.options) && question.options.length > 1);
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
  }
  const constructed = questions.filter(question => question.type === 'constructed');
  assert.ok(constructed.length >= 1, 'mastery includes at least one constructed question');
  for (const question of constructed) {
    assert.ok(question.rubric, `constructed question ${question.id} declares a rubric`);
    assert.ok(Array.isArray(question.rubric.keywords) && question.rubric.keywords.length > 0, `constructed question ${question.id} rubric has keywords`);
  }
});

test('all lesson question knowledge references are canonical vocabulary', () => {
  const problems = [];
  for (const file of lessonFiles) {
    const data = JSON.parse(read(`content/lessons/${file}.json`));
    const questions = data.questions || data.diagnostics || data.mastery?.questions || [];
    for (const question of questions) {
      const ids = question.knowledgeIds || question.knowledgePoints
        || (question.knowledgePoint ? [question.knowledgePoint] : []);
      for (const id of ids) {
        if (!VOCABULARY.has(id)) problems.push(`${file}:${question.id} -> ${id}`);
      }
    }
  }
  assert.deepEqual(problems, [], 'no non-canonical knowledge ids in lesson content');
});

test('knowledge graph nodes cover the full lesson vocabulary', () => {
  const graph = JSON.parse(read('content/knowledge/knowledge-graph.json'));
  const nodeIds = new Set(graph.nodes.map(node => node.id));
  for (const id of VOCABULARY) assert.ok(nodeIds.has(id), `graph contains vocabulary node ${id}`);
});

test('knowledge graph relations reference existing nodes only', () => {
  const graph = JSON.parse(read('content/knowledge/knowledge-graph.json'));
  const nodeIds = new Set(graph.nodes.map(node => node.id));
  const relation = graph.relations || graph.edges || [];
  for (const edge of relation) {
    if (['question', 'experiment', 'commonMistake'].includes(edge.type)) continue;
    assert.ok(nodeIds.has(edge.source), `relation source exists: ${edge.source}`);
    assert.ok(nodeIds.has(edge.target), `relation target exists: ${edge.target}`);
  }
});

test('canonical knowledge graph loads through the KnowledgeEngine', () => {
  const graph = JSON.parse(read('content/knowledge/knowledge-graph.json'));
  const engine = new KnowledgeEngine(graph);
  assert.equal(engine.hasNode('scientific-inquiry'), true);
  assert.equal(engine.hasNode('acid-intro'), true);
  assert.ok(engine.getNode('evidence-reasoning'));
});
