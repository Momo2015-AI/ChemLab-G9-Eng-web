import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateMastery } from '../core/assessment/mastery-policy.js';
import ContentService from '../app/content-service.js';
import lessonManifest from '../content/curriculum/lesson-manifest.js';

test('Mastery requires score, knowledge coverage, and critical misconception clearance', () => {
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

  assert.equal(decision.scorePassed, true);
  assert.equal(decision.coveragePassed, false);
  assert.equal(decision.misconceptionsPassed, false);
  assert.equal(decision.passed, false);
  assert.deepEqual(decision.uncoveredKnowledge, ['chemical-change']);
  assert.deepEqual(decision.unclearedMisconceptions, ['mc-matter-definition-confusion']);
});

test('Mastery passes when all declared dimensions are satisfied', () => {
  const question = { id: 'q1', type: 'constructed', knowledgeIds: ['evidence-reasoning'] };
  const decision = evaluateMastery({
    questions: [question],
    answers: [{ question, correct: false, rubricPassed: true }],
    threshold: 0.95,
    requireConstructed: true,
  });

  assert.equal(decision.scorePassed, true);
  assert.equal(decision.coveragePassed, true);
  assert.equal(decision.constructedPassed, true);
  assert.equal(decision.passed, true);
});

test('ContentService filters canonical lessons by textbook semester', async () => {
  const service = new ContentService({
    async loadAll() {
      return {
        questions: [],
        questionById: new Map(),
        knowledgeGraph: { nodes: [], relations: [] },
        manifest: lessonManifest,
        topics: [],
        days: [
          { id: 'upper-lesson', canonicalId: 'upper-lesson', semester: 'upper' },
          { id: 'lower-lesson', canonicalId: 'lower-lesson', semester: 'lower' },
        ],
        dayById: new Map(),
      };
    },
  });

  assert.deepEqual((await service.getLessons({ semester: 'upper' })).map(lesson => lesson.id), ['upper-lesson']);
  assert.deepEqual((await service.getLessons({ semester: 'lower' })).map(lesson => lesson.id), ['lower-lesson']);
});

test('lesson manifest exposes every released canonical lesson with textbook metadata', () => {
  const released = lessonManifest.lessons.filter(lesson => lesson.releaseStatus === 'ready');
  assert.deepEqual(released.map(lesson => lesson.canonicalId), [
    'lesson-01-material-changes-properties',
    'lesson-02-chemistry-as-experimental-science',
    'lesson-03-acid-intro',
    'lesson-04-lab-safety-operations',
  ]);
  for (const lesson of released) {
    assert.ok(['upper', 'lower'].includes(lesson.semester));
    assert.match(lesson.unitId, /^u\d+$/);
  }
});
