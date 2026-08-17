import test from 'node:test';
import assert from 'node:assert/strict';
import assessmentEngine from '../engine/assessment-engine.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { renderV19Course } from '../views/v19-course-view.js';
import { renderKnowledgePortal } from '../frontend/pages/knowledge/knowledge-portal-page.js';

function makeState() {
  return { learning: {}, progress: {}, quizAnswers: {}, save() {} };
}

function makeContentService(overrides = {}) {
  const q = (id, knowledge, answer = 0) => ({ id, type: 'choice', options: ['A', 'B'], answer, knowledgeIds: knowledge });
  const extra = [
    ...(overrides.practice || []),
    ...(overrides.diagnostic || []),
    ...(overrides.mastery || []),
  ];
  const questionPool = [...(overrides.pool || [
    q('P1', ['physical-property'], 0),
    q('P2', ['chemical-property'], 1),
    q('P3', ['physical-change'], 0),
    q('P4', ['physical-property'], 1),
  ]), ...extra];
  return {
    async getLesson() { return { id: 'lesson-01-material-changes-properties', knowledgePoints: ['physical-change', 'physical-property'], questions: ['P3'] }; },
    async load() { return { questionById: new Map(questionPool.map(item => [item.id, item])), questions: questionPool }; },
    async getPractice() { return overrides.practice ? overrides.practice.map(item => item.id) : null; },
    async getDiagnostic() { return overrides.diagnostic ? overrides.diagnostic.map(item => item.id) : null; },
    async getMastery() { return { threshold: 0.95, questions: overrides.mastery !== undefined ? overrides.mastery : questionPool }; },
    ...overrides,
  };
}

test('practice uses the dedicated practice.json pool when available', async () => {
  const controller = new AssessmentRuntimeController({ assessment: assessmentEngine, contentService: makeContentService({ practice: [{ id: 'PC1', type: 'choice', options: ['A', 'B'], answer: 0, knowledgeIds: ['physical-change'] }] }), state: makeState() });
  const session = await controller.startPractice('lesson-01-material-changes-properties');
  assert.ok(session);
  assert.deepEqual(session.questions.map(q => q.id), ['PC1']);
});

test('recheck selects from lesson-scoped pools (practice + diagnostic) only', async () => {
  const controller = new AssessmentRuntimeController({ assessment: assessmentEngine, contentService: makeContentService({ practice: [{ id: 'PC1', type: 'choice', options: ['A', 'B'], answer: 0, knowledgeIds: ['physical-property'] }], diagnostic: [{ id: 'DC1', type: 'choice', options: ['A', 'B'], answer: 1, knowledgeIds: ['chemical-property'] }], mastery: [] }), state: makeState() });
  const session = await controller.startRecheck('lesson-01-material-changes-properties', ['physical-property', 'chemical-property'], 10);
  assert.ok(session);
  const ids = session.questions.map(q => q.id);
  assert.ok(ids.includes('PC1'), `practice question should be included: ${ids}`);
  assert.ok(ids.includes('DC1'), `diagnostic question should be included: ${ids}`);
  // Foreign pool questions that share the knowledge tag but belong to no
  // lesson-scoped pool (P1: physical-property, P2: chemical-property) must
  // never leak into a recheck.
  assert.ok(!ids.includes('P1') && !ids.includes('P2'), `foreign pool questions must be excluded: ${ids}`);
});

test('transfer starts a session from the dedicated transfer pool and evaluates a pass line', async () => {
  const state = makeState();
  const learningController = {
    updateLessonState(lessonId, patch) {
      state.learning.lessons ||= {};
      state.learning.lessons[lessonId] = { ...(state.learning.lessons[lessonId] || {}), ...patch, lessonId };
    },
    getLessonState(lessonId) { return state.learning.lessons?.[lessonId] || {}; },
  };
  const transferPool = [
    { id: 'T1', type: 'choice', options: ['A', 'B'], answer: 0, knowledgeIds: ['physical-property'] },
    { id: 'T2', type: 'choice', options: ['A', 'B'], answer: 1, knowledgeIds: ['chemical-property'] },
  ];
  const contentService = makeContentService({ mastery: [{ id: 'M1', type: 'choice', options: ['A', 'B'], answer: 0, knowledgeIds: ['physical-property'] }] });
  contentService.getTransfer = async () => transferPool;
  const controller = new AssessmentRuntimeController({ assessment: assessmentEngine, contentService, state, learningController });
  const session = await controller.startTransfer('lesson-01-material-changes-properties', 2);
  assert.ok(session);
  assert.equal(session.mode, 'transfer');
  assert.deepEqual(session.questions.map(q => q.id), ['T1', 'T2']);
  assert.equal(state.learning.lessons['lesson-01-material-changes-properties'].transfer.status, 'in-progress');
  controller.answer(0);
  controller.answer(1);
  assert.equal(controller.session.completed, true);
  assert.equal(state.learning.lessons['lesson-01-material-changes-properties'].transfer.status, 'passed');
  assert.equal(state.learning.lessons['lesson-01-material-changes-properties'].transfer.total, 2);
});

test('transfer returns null when no dedicated transfer content exists', async () => {
  const controller = new AssessmentRuntimeController({ assessment: assessmentEngine, contentService: makeContentService(), state: makeState() });
  assert.equal(await controller.startTransfer('lesson-01-material-changes-properties'), null);
});

test('course view renders lesson sections and preset diagnostic questions', () => {
  const root = {
    innerHTML: '',
    querySelector() { return null; },
    querySelectorAll() { return []; },
  };
  renderV19Course({
    root,
    lesson: {
      id: 'lesson-01-material-changes-properties',
      title: '物质的变化与性质',
      knowledgePoints: ['physical-change'],
      sections: [
        { title: '本节课要掌握什么？', body: ['区分变化与性质。'] },
        { title: '一步一步学', body: ['按 8 个步骤学习。'] },
      ],
      diagnosticQuestions: [
        { id: 'L01-D01', knowledgePoint: 'physical-vs-chemical-change', question: '你能否用「是否生成新物质」解释区别？', answer: true, remediationStep: 'L01-S02/L01-S03/L01-S04' },
      ],
    },
    diagnosticQuestions: [
      { id: 'L01-D01', knowledgePoint: 'physical-vs-chemical-change', question: '你能否用「是否生成新物质」解释区别？', answer: true, remediationStep: 'L01-S02/L01-S03/L01-S04' },
    ],
  });
  assert.match(root.innerHTML, /本节课要掌握什么？/);
  assert.match(root.innerHTML, /本课内容速览/);
  assert.match(root.innerHTML, /预置诊断自查/);
  assert.match(root.innerHTML, /data-guided-step="L01-S02"/);
});

test('knowledge portal renders learn action for nodes covered by a lesson', () => {
  const clickHandlers = [];
  const selectedNodes = [];
  const fakeElement = () => ({
    setAttribute() {}, appendChild() {}, style: {}, dataset: {},
    classList: { toggle() {} },
    addEventListener(type, handler) { if (type === 'click') clickHandlers.push(handler); },
  });
  global.document = {
    createElementNS: () => fakeElement(),
  };
  const fakeSvg = { appendChild() {} };
  const root = {
    innerHTML: '',
    querySelector(selector) {
      if (selector === '#cg-svg') return fakeSvg;
      return null;
    },
    querySelectorAll() { return []; },
  };
  try {
    renderKnowledgePortal({
      root,
      nodes: [{ id: 'physical-property', name: '物理性质', domain: 'matter', chapter: '单元一 走进化学世界' }],
      relations: [],
      lessons: [{ id: 'lesson-01-material-changes-properties', knowledgePoints: ['physical-property'] }],
      onSelectNode: id => selectedNodes.push(id),
    });
  } finally {
    delete global.document;
  }
  clickHandlers.forEach(handler => handler());
  assert.equal(selectedNodes.length, 1);
  assert.equal(selectedNodes[0], 'physical-property');
});

test('disabled experiment button does not trigger onStartExperiment', () => {
  let experimentCalled = false;
  const clickHandlers = [];
  const fakeBtn = {
    disabled: true,
    addEventListener(type, handler) { if (type === 'click') clickHandlers.push(handler); },
  };
  const root = {
    innerHTML: '',
    querySelector(selector) {
      if (selector === '[data-experiment]') return fakeBtn;
      return null;
    },
    querySelectorAll() { return []; },
  };
  renderV19Course({
    root,
    lesson: { id: 'l1', knowledgePoints: ['physical-change'], experiments: [{ id: 'exp1' }] },
    stages: { experiment: false },
    onStartExperiment: () => { experimentCalled = true; },
  });
  // Simulate click on disabled button
  clickHandlers.forEach(h => h());
  assert.equal(experimentCalled, false, 'onStartExperiment should not fire when button is disabled');
});

test('enabled experiment button triggers onStartExperiment', () => {
  let experimentCalled = false;
  const clickHandlers = [];
  const fakeBtn = {
    disabled: false,
    addEventListener(type, handler) { if (type === 'click') clickHandlers.push(handler); },
  };
  const root = {
    innerHTML: '',
    querySelector(selector) {
      if (selector === '[data-experiment]') return fakeBtn;
      return null;
    },
    querySelectorAll() { return []; },
  };
  renderV19Course({
    root,
    lesson: { id: 'l1', knowledgePoints: ['physical-change'], experiments: [{ id: 'exp1' }] },
    stages: { experiment: true },
    onStartExperiment: (exp) => { experimentCalled = true; assert.equal(exp, 'exp1'); },
  });
  clickHandlers.forEach(h => h());
  assert.equal(experimentCalled, true, 'onStartExperiment should fire when button is enabled');
});

test('knowledge cards carry data-kp-index for CSS theming', () => {
  const root = { innerHTML: '', querySelector() { return null; }, querySelectorAll() { return []; } };
  renderV19Course({
    root,
    lesson: { id: 'l1', knowledgePoints: ['physical-change', 'chemical-change', 'observation-inference'], sections: [] },
  });
  assert.match(root.innerHTML, /data-kp-index="0"/);
  assert.match(root.innerHTML, /data-kp-index="1"/);
  assert.match(root.innerHTML, /data-kp-index="2"/);
  assert.equal((root.innerHTML.match(/data-kp-index/g) || []).length, 3);
});
