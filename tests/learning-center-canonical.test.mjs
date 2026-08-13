import assert from 'node:assert/strict';
import test from 'node:test';
import lessonManifest from '../content/curriculum/lesson-manifest.js';

const manifest = lessonManifest.lessons;

test('Golden Lesson routes by canonical ID', () => {
  assert.ok(manifest.some(lesson => lesson.canonicalId === 'lesson-01-material-changes-properties'));
});

test('learner-facing lessons exclude legacy day-only entries', () => {
  assert.ok(manifest.every(lesson => lesson.canonicalId));
  assert.ok(manifest.some(lesson => lesson.canonicalId === 'lesson-01-material-changes-properties'));
  assert.ok(manifest.some(lesson => lesson.canonicalId === 'lesson-02-chemistry-as-experimental-science'));
});

test('canonical first two lessons belong to the introductory unit', () => {
  const first = manifest.find(lesson => lesson.canonicalId === 'lesson-01-material-changes-properties');
  const second = manifest.find(lesson => lesson.canonicalId === 'lesson-02-chemistry-as-experimental-science');
  assert.equal(first.unitId, 'u01');
  assert.equal(second.unitId, 'u01');
});
