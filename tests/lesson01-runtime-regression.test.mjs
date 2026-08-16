import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assessmentEngine from '../engine/assessment-engine.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';

const lessonDir = fileURLToPath(new URL('../content/lessons/', import.meta.url));
const loadLessonJSON = name => JSON.parse(readFileSync(`${lessonDir}${name}`, 'utf-8'));

function makeState() {
  return { learning: {}, progress: {}, quizAnswers: {}, save() {} };
}

function makeMasteryHarness(lessonFile) {
  const mastery = loadLessonJSON(lessonFile).mastery;
  const state = makeState();
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
  };
  const controller = new AssessmentRuntimeController({
    assessment: assessmentEngine,
    contentService: { async getMastery() { return mastery; } },
    state,
    learningController,
  });
  return { controller, mastery, state };
}

for (const lessonFile of [
  'lesson-01-material-changes-properties-mastery.json',
  'lesson-02-chemistry-as-experimental-science-mastery.json',
  'lesson-03-acid-intro-mastery.json',
]) {
  test(`${lessonFile}: all answer keys evaluate correctly for every choice item`, async () => {
    const { controller, mastery } = makeMasteryHarness(lessonFile);
    const lessonId = lessonFile.replace('-mastery.json', '');
    await controller.startMastery(lessonId);
    const session = controller.session;
    const choiceItems = session.questions.filter(q => q.type === 'choice');
    assert.ok(choiceItems.length >= 15, `expected a real mastery bank, got ${choiceItems.length} choice items`);
    for (const question of choiceItems) {
      const result = controller.answer(question.correctIndex);
      assert.equal(result.correct, true, `${question.id} expected key ${question.answer}`);
    }
  });

  test(`${lessonFile}: constructed item passes with a paraphrased model answer`, () => {
    const mastery = loadLessonJSON(lessonFile).mastery;
    const constructed = mastery.questions.find(q => q.type === 'constructed');
    assert.ok(constructed, 'each mastery bank ships exactly one constructed item');
    const keywordGroups = (constructed.rubric?.keywords || []);
    assert.ok(keywordGroups.length >= 2, 'constructed rubric declares keyword groups');
    assert.ok(keywordGroups.some(group => Array.isArray(group)), 'rubric uses synonym groups so paraphrases pass');
    // Build a paraphrase: for the first group that has an alternative synonym,
    // use the alternative instead of the primary keyword.
    const paraphrase = keywordGroups.map(group => {
      const synonyms = Array.isArray(group) ? group : [group];
      return synonyms.length > 1 ? synonyms[1] : synonyms[0];
    }).join('，') + '，所以判断依据是充分的。';
    assert.equal(
      assessmentEngine.checkConstructed(constructed, paraphrase),
      true,
      `paraphrase "${paraphrase}" should pass the rubric`,
    );
  });
}

test('switching from practice to mastery creates the requested fresh session', async () => {
  const { controller } = makeMasteryHarness('lesson-01-material-changes-properties-mastery.json');
  controller.startAttempt('lesson-01-material-changes-properties', [{ id: 'P1', type: 'choice', options: ['x'], answer: 'A' }], 'practice');
  await controller.startMastery('lesson-01-material-changes-properties');
  assert.equal(controller.session.mode, 'mastery');
  assert.equal(controller.session.lessonId, 'lesson-01-material-changes-properties');
  assert.equal(controller.session.index, 0);
});
