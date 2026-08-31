import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assessmentEngine from '../engine/assessment-engine.js';
import { LearningController } from '../controllers/learning-controller.js';
import lessonManifest from '../content/curriculum/lesson-manifest.js';
import { g9CourseMap } from '../content/curriculum/g9-course-map.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

const unitSemester = new Map();
for (const semester of g9CourseMap.semesters) {
  const value = semester.id === 'g9-s2' ? 'lower' : 'upper';
  for (const unit of semester.units) unitSemester.set(unit.id, value);
}

function mcQuestions(relative, key) {
  const data = readJson(relative);
  const list = key === 'mastery' ? data.mastery.questions : (data.questions || data.diagnostics);
  return list.filter(q => q.type !== 'constructed' && Number.isInteger(q.answer));
}

test('every manifest lesson resolves to a course-map unit with matching semester', () => {
  for (const lesson of lessonManifest.lessons) {
    assert.ok(unitSemester.has(lesson.unitId), `${lesson.canonicalId}: unitId ${lesson.unitId} missing from course map`);
    assert.equal(lesson.semester, unitSemester.get(lesson.unitId), `${lesson.canonicalId}: semester must match its unit`);
  }
});

test('manifest displayOrder is a continuous global sequence (authoritative ordering)', () => {
  const orders = lessonManifest.lessons.map(lesson => lesson.displayOrder);
  assert.ok(orders.every(Number.isInteger), 'every lesson must declare an integer displayOrder');
  assert.deepEqual([...orders].sort((a, b) => a - b), orders, 'displayOrder must be unique and already ascending');
  assert.deepEqual(orders, [...Array(orders.length).keys()].map(i => i + 1), 'displayOrder must be a continuous 1..N sequence');
});

test('lesson-03 (acid intro) is catalogued as lower-semester unit 10 content', () => {
  const entry = lessonManifest.lessons.find(lesson => lesson.canonicalId === 'lesson-03-acid-intro');
  assert.equal(entry.semester, 'lower');
  assert.equal(entry.unitId, 'u10');
  const lesson = readJson('content/lessons/lesson-03-acid-intro.json');
  assert.equal(lesson.semester, 'lower');
  assert.equal(lesson.unitId, 'u10');
});

test('lesson JSON semesters agree with the manifest', () => {
  for (const entry of lessonManifest.lessons) {
    const lesson = readJson(`content/lessons/${entry.canonicalId}.json`);
    assert.equal(lesson.semester, entry.semester, `${entry.canonicalId}: JSON/manifest semester mismatch`);
  }
});

test('mastery and practice answer keys are position-balanced (anti answer-bias)', () => {
  const pools = [
    ['content/lessons/lesson-01-material-changes-properties-practice.json', 'questions'],
    ['content/lessons/lesson-01-material-changes-properties-mastery.json', 'mastery'],
    ['content/lessons/lesson-02-chemistry-as-experimental-science-mastery.json', 'mastery'],
    ['content/lessons/lesson-02-chemistry-as-experimental-science-diagnostic.json', 'diagnostics'],
    ['content/lessons/lesson-03-acid-intro-mastery.json', 'mastery'],
  ];
  for (const [file, key] of pools) {
    const items = mcQuestions(file, key);
    const counts = {};
    for (const item of items) counts[item.answer] = (counts[item.answer] || 0) + 1;
    const max = Math.max(...Object.values(counts));
    assert.ok(max <= Math.ceil(items.length / 2), `${path.basename(file)}: answer position bias (max ${max} of ${items.length})`);
  }
});

test('L03-M15 has exactly one defensible key: copper cannot react, iron forms XCl2', () => {
  const mastery = readJson('content/lessons/lesson-03-acid-intro-mastery.json').mastery.questions;
  const q = mastery.find(item => item.id === 'L03-M15');
  assert.equal(q.options[q.answer], '铁');
  assert.ok(q.options.includes('铜'), 'copper distractor present (does not react with dilute HCl)');
  assert.ok(!q.options.includes('镁') && !q.options.includes('锌'), 'Mg/Zn both form XCl2 and must not appear as distractors');
  assert.ok(q.explanation.includes('铜'), 'explanation addresses the copper distractor');
});

test('L01-P06 / L01-M05 no longer contain a second defensible option', () => {
  const practice = readJson('content/lessons/lesson-01-material-changes-properties-practice.json').questions;
  const p06 = practice.find(item => item.id === 'L01-P06');
  // index 0 must be property→change (reversed), so only the key matches change→property.
  assert.equal(p06.options[0], '铁能导电；铁生锈');
  const mastery = readJson('content/lessons/lesson-01-material-changes-properties-mastery.json').mastery.questions;
  const m05 = mastery.find(item => item.id === 'L01-M05');
  assert.equal(m05.options[3], '铁生锈；氧气助燃');
});

test('rubric mustMatch enforces polarity-critical keyword groups', () => {
  const question = {
    id: 'q',
    type: 'constructed',
    rubric: {
      keywords: [['只改变温度', '唯一变量'], ['水量', '水的体积'], ['盐量', '食盐'], ['保持', '一致', '相同']],
      mustMatch: [0],
    },
  };
  // Wrong design: names the variables but changes them — must fail even with 3 group hits.
  assert.equal(assessmentEngine.checkConstructed(question, '应该同时改变水量和盐量，温度也要变'), false);
  // Correct design hits the required control group.
  assert.equal(assessmentEngine.checkConstructed(question, '只改变温度，水量和盐量保持相同'), true);
  // mustMatch absent -> legacy min(2, groups) behaviour unchanged.
  const legacy = { id: 'q2', type: 'constructed', rubric: { keywords: [['水'], ['盐']] } };
  assert.equal(assessmentEngine.checkConstructed(legacy, '保持水和盐'), true);
  assert.equal(assessmentEngine.checkConstructed(legacy, '保持水'), false);
});

test('L02-M21 ships a mustMatch polarity group', () => {
  const mastery = readJson('content/lessons/lesson-02-chemistry-as-experimental-science-mastery.json').mastery.questions;
  const q = mastery.find(item => item.id === 'L02-M21');
  assert.ok(Array.isArray(q.rubric.mustMatch) && q.rubric.mustMatch.length, 'L02-M21 must require the single-variable group');
  const wrongDesign = '实验时同时改变水量和盐量，再看溶解快慢';
  assert.equal(assessmentEngine.checkConstructed(q, wrongDesign), false, 'wrong variable design must fail L02-M21');
});

test('guided step completion never regresses on a wrong re-attempt', () => {
  const state = { progress: {}, learning: {}, save() {} };
  const controller = new LearningController({ contentService: {}, state });
  controller.recordGuidedCheck('lesson-01', 'L01-S01', { correct: true, stepCount: 2 });
  controller.recordGuidedCheck('lesson-01', 'L01-S02', { correct: true, stepCount: 2 });
  assert.equal(state.learning.lessons['lesson-01'].guided.completed, true);
  controller.recordGuidedCheck('lesson-01', 'L01-S01', { correct: false, stepCount: 2 });
  const guided = state.learning.lessons['lesson-01'].guided;
  assert.equal(guided.steps['L01-S01'].correct, true, 'previously correct step must stay correct');
  assert.equal(guided.completed, true, 'completion must not regress');
  assert.equal(guided.steps['L01-S01'].attempts, 2);
});

test('blocked quiz screens no longer render a 0/0 score shell', async () => {
  const { renderQuizResult } = await import('../views/quiz-view.js');
  const root = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  renderQuizResult({ root, mode: 'transfer', status: 'empty', blocked: true, notice: '本课暂无迁移挑战题。', lessonId: 'lesson-03-acid-intro', onContinue: () => {} });
  assert.ok(/暂不能开始答题/.test(root.innerHTML), 'neutral blocked heading');
  assert.ok(!/0 \/ 0 正确/.test(root.innerHTML), 'no 0/0 correct line');
  assert.ok(!/得分/.test(root.innerHTML), 'no misleading score line');
  assert.ok(!/data-retry/.test(root.innerHTML), 'no retry button on blocked screens');
});

test('knowledge graph: every node is semester-tagged and acid nodes belong to unit 10', () => {
  const graph = readJson('content/knowledge/knowledge-graph.json');
  const runtimeIds = new Set();
  const lessonsDir = path.join(ROOT, 'content/lessons');
  for (const file of fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'))) {
    const data = readJson(path.join('content/lessons', file));
    for (const key of ['questions', 'diagnostics']) for (const q of data[key] || []) runtimeIds.add(q.id);
    for (const q of data.mastery?.questions || []) runtimeIds.add(q.id);
  }
  // Sprint 2.5 KG-3: graph node.questions[] now mirrors the full
  // runtime question pool, which includes the day01 production-overrides
  // and day01 diagnostics modules (e.g. q-acid-001..q-acid-012). Pull
  // their ids into runtimeIds so the "stale question ref" check stays
  // authoritative.
  for (const file of fs.readdirSync(path.join(ROOT, 'content/questions')).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(ROOT, 'content/questions', file), 'utf8');
    for (const match of src.matchAll(/id:\s*'([A-Za-z0-9_-]+)'/g)) runtimeIds.add(match[1]);
  }
  for (const node of graph.nodes) {
    assert.ok(['upper', 'lower'].includes(node.semester), `${node.id}: semester tag required`);
    assert.equal(unitSemester.get(node.unitId), node.semester, `${node.id}: unitId/semester mismatch`);
    for (const qid of node.questions || []) assert.ok(runtimeIds.has(qid), `${node.id}: stale question ref ${qid}`);
  }
  for (const id of ['acid-intro', 'acid-property', 'safety-awareness']) {
    const node = graph.nodes.find(n => n.id === id);
    assert.equal(node.semester, 'lower');
    assert.equal(node.unitId, 'u10');
    assert.equal(node.chapter, '第十单元 酸和碱');
  }
  const upperCount = graph.nodes.filter(n => n.semester === 'upper').length;
  const lowerCount = graph.nodes.filter(n => n.semester === 'lower').length;
  // Per Section 16.4 of docs/COURSE-DEVELOPMENT-STANDARD.md: do not hardcode
  // an exact total node count here — it drifts every time content is added
  // and the failure then has nothing to do with what actually broke. The
  // real guarantee (every node correctly semester/unit-tagged) is already
  // asserted above per-node; this is just a floor to catch a mass-deletion
  // regression, not a ceiling on how many nodes the graph is allowed to have.
  assert.ok(upperCount >= 25 && lowerCount >= 3, `expected at least 25 upper / 3 lower nodes, got ${upperCount}/${lowerCount}`);
});
