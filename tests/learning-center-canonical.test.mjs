import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const application = fs.readFileSync('app/application.js', 'utf8');
const home = fs.readFileSync('views/home-view.js', 'utf8');
const portal = fs.readFileSync('frontend/pages/course/course-portal-page.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('modules/lessons/manifest.json', 'utf8'));

test('Golden Lesson routes by canonical ID', () => {
  assert.match(application, /CANONICAL_GOLDEN_LESSON\s*=\s*['"]lesson-01-material-changes-properties['"]/);
  assert.match(home, /GOLDEN_LESSON_ID\s*=\s*['"]lesson-01-material-changes-properties['"]/);
  assert.match(portal, /data-golden/);
});

test('learner-facing lessons exclude legacy day-only entries', () => {
  assert.match(application, /filter\(day => Boolean\(day\.canonicalId\)\)/);
  assert.ok(manifest.days.some(day => day.canonicalId === 'lesson-01-material-changes-properties'));
  assert.ok(manifest.days.some(day => day.canonicalId === 'lesson-02-chemistry-as-experimental-science'));
});

test('canonical first two lessons belong to the introductory unit', () => {
  const first = manifest.days.find(day => day.canonicalId === 'lesson-01-material-changes-properties');
  const second = manifest.days.find(day => day.canonicalId === 'lesson-02-chemistry-as-experimental-science');
  assert.equal(first.module, 'module-intro-chemistry');
  assert.equal(second.module, 'module-intro-chemistry');
});
