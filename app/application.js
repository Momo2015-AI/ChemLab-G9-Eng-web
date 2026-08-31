/** ChemLab application composition root. */
import { createRouter } from './router.js';
import { contentService } from './content-service.js';
import { MasteryService } from './mastery-service.js';
import { createProgressProjection, isLessonCompleted } from './progress-projection.js';
import { AssessmentRuntimeController } from '../controllers/assessment-runtime-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { LearningController } from '../controllers/learning-controller.js';
import { renderHome } from '../views/home-view.js';
import { renderV19Course } from '../views/v19-course-view.js';
import { renderQuiz, renderQuizResult } from '../views/quiz-view.js';
import { renderV19Experiment, renderV19ExperimentResult } from '../views/v19-experiment-view.js';
import { renderGraph } from '../views/graph-view.js';
import { renderRemediation } from '../views/remediation-view.js';
import { renderAITutorPage } from '../frontend/pages/ai-tutor/ai-tutor-page.js';
import { renderCoursePortal } from '../frontend/pages/course/course-portal-page.js';
import { renderLabPortal } from '../frontend/pages/lab/lab-portal-page.js';
import { renderKnowledgePortal } from '../frontend/pages/knowledge/knowledge-portal-page.js';
import { renderAssessmentPortal } from '../frontend/pages/assessment/assessment-portal-page.js';
import { renderProgressPortal } from '../frontend/pages/progress/progress-portal-page.js';
import { renderKnowledgeDetail } from '../views/knowledge-detail-view.js';
import { createRemediationCatalog } from '../core/diagnosis/remediation-catalog.js';
import { getLessonReleaseState } from '../content/release-policy.js';

const getDefaultRoot = () => (typeof document === 'undefined' ? null : document.querySelector('#app-root'));
const CANONICAL_GOLDEN_LESSON = 'lesson-01-material-changes-properties';
const CONTENT_ROUTES = new Set(['home', 'course', 'progress', 'assessment', 'quiz', 'knowledge-map', 'knowledge-detail', 'graph']);
const HOME_DATA_ROUTES = new Set(['home', 'course', 'progress', 'assessment']);
const QUIZ_MODES = { 'mastery:': 'mastery', 'recheck:': 'recheck', 'transfer:': 'transfer' };

export function createApplication({ state, assessment, experimentEngine, masteryService = new MasteryService(), root = getDefaultRoot() } = {}) {
  const learning = new LearningController({ contentService, state, remediationCatalog: {} });
  const controllers = {
    learning,
    assessment: new AssessmentRuntimeController({ assessment, contentService, state, masteryService, learningController: learning }),
    experiment: new ExperimentController({ experimentEngine, state, masteryService, learningController: learning }),
  };
  const views = {
    renderHome, renderCourse: renderV19Course, renderQuiz, renderQuizResult,
    renderExperiment: renderV19Experiment, renderExperimentResult: renderV19ExperimentResult,
    renderGraph, renderRemediation, renderAITutorPage,
  };
  let hydrationPromise = null;
  let stopped = false;
  let knowledgeScope = 'term';
  const router = createRouter({ onRoute: route => { state.route = route; }, render: route => renderRoute(route) });
  const currentTerm = () => (typeof window !== 'undefined' && window.chemLabTextbookTerm === 'lower' ? 'lower' : 'upper');

  // Deep links may target a lesson from the other semester; follow the user's
  // intent by switching the whole UI to that semester (lists, portals and the
  // shell toggle all re-sync through the term-change event).
  function switchTermFor(semester) {
    if (typeof window === 'undefined' || semester === currentTerm()) return;
    if (typeof window.chemLabSetTerm === 'function') { window.chemLabSetTerm(semester); return; }
    window.chemLabTextbookTerm = semester;
  }

  function renderHomeMessage(subtitle) {
    if (!root) return;
    views.renderHome({
      root,
      data: { title: '九年级化学智能学习中心', subtitle, lessons: [], stats: { completed: 0, total: 0, progressPercent: 0, mastery: 0, questions: 0 } },
      onCourse: () => router.navigate('course'),
      onDashboard: () => router.navigate('progress'),
      onGraph: () => router.navigate('knowledge-map'),
    });
  }

  async function hydrateContent() {
    if (hydrationPromise) return hydrationPromise;
    hydrationPromise = contentService.load()
      .then(data => {
        learning.remediationCatalog = createRemediationCatalog(data);
        state.contentReady = true;
        state.contentLoadError = null;
        if (!stopped) renderRoute(router.current());
        return data;
      })
      .catch(error => {
        state.contentLoadError = error;
        state.contentReady = false;
        if (root && !stopped && router.current().page === 'home') renderHomeMessage('课程内容暂时无法加载，请刷新后重试。');
        throw error;
      });
    return hydrationPromise;
  }

  async function getHomeData() {
    if (!contentService.data) return null;
    const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
    const lessons = (await contentService.getLessons({ semester: currentTerm() }))
      .filter(day => Boolean(day.canonicalId))
      .sort((a, b) => (a.displayOrder ?? Number(a.day || 0)) - (b.displayOrder ?? Number(b.day || 0)))
      .map(day => {
        const lessonId = day.canonicalId;
        const release = getLessonReleaseState(day);
        const stateView = controllers.learning.getLessonCardState({ ...day, id: lessonId });
        return {
          ...day,
          id: lessonId,
          completed: isLessonCompleted(progress.completed, lessonId),
          phase: stateView.phase,
          cardLabel: stateView.available ? `${stateView.label} · ${release.label}` : release.label,
          available: stateView.available,
          releaseStatus: release.key,
        };
      });
    const weakPoints = lessons.flatMap(lesson => controllers.learning.getLessonState(lesson.id).diagnosis?.weakPoints || []);
    return {
      title: '九年级化学智能学习中心',
      subtitle: '学习 → 实验 → 答题 → 诊断 → 补救 → 再检测 → Mastery',
      lessons,
      term: currentTerm(),
      hasRemediation: weakPoints.length > 0,
      stats: {
        completed: lessons.filter(day => day.completed).length,
        total: lessons.length,
        progressPercent: lessons.length ? Math.round((lessons.filter(day => day.completed).length / lessons.length) * 100) : 0,
        mastery: Math.round((progress.masteryScore || 0) * 100),
        questions: progress.questions || 0,
        weak: new Set(weakPoints).size,
      },
    };
  }

  function firstIncompleteLesson(data) {
    return data?.lessons?.find(lesson => !lesson.completed)?.id || data?.lessons?.[0]?.id || CANONICAL_GOLDEN_LESSON;
  }

  async function renderHomeRoute(data) {
    views.renderHome({
      root, data,
      onCourse: id => router.navigate('course', id || firstIncompleteLesson(data)),
      onDashboard: () => router.navigate('progress'),
      onGraph: () => router.navigate('knowledge-map'),
      onRemediation: () => router.navigate('assessment'),
    });
  }

  async function renderCourseRoute(route, data) {
    if (!route.params.length) {
      return renderCoursePortal({ root, lessons: data?.lessons, term: currentTerm(), onLesson: id => router.navigate('course', id), onHome: () => router.navigate('home') });
    }
    const lessonId = route.params[0] || firstIncompleteLesson(data) || CANONICAL_GOLDEN_LESSON;
    const lesson = await controllers.learning.getLesson(lessonId);
    if (!lesson) {
      return views.renderCourse({ root, lesson: { id: lessonId, title: '课程未找到', description: '请返回学习中心选择课程。' } });
    }
    if (lesson.semester && lesson.semester !== currentTerm()) {
      switchTermFor(lesson.semester);
      return; // the term-change listener re-renders this route in the new term
    }
    const guidedLearning = await contentService.getGuidedLearning(lesson.id || lessonId);
    const lessonState = controllers.learning.getLessonState(lessonId);
    const phase = controllers.learning.getLessonPhase(lessonId);
    const stages = controllers.learning.getStageAvailability(lesson, guidedLearning);
    const masteryState = controllers.learning.getLessonMastery(lessonId);
    return views.renderCourse({
      root, lesson, guidedLearning, lessonState, phase, stages,
      progress: controllers.learning.getProgress(lessonId),
      masteryPassed: masteryState?.status === 'passed',
      diagnosis: lessonState.diagnosis || {},
      diagnosticQuestions: Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [],
      highlightStep: route.params[1] || '',
      onGuidedCheck: (id, stepId, result) => {
        controllers.learning.recordGuidedCheck(id, stepId, result);
        // Let the inline ✓/✗ feedback render first, then refresh the stage
        // UI while preserving card expansion and scroll position.
        setTimeout(() => {
          const current = router.current();
          if (current.page !== route.page || (current.params[0] || '') !== (route.params[0] || '')) return;
          const cards = typeof document !== 'undefined' ? document.querySelectorAll('.guided-learning-card') : [];
          const expandedIds = [...cards].filter(card => !card.querySelector('.guided-card-detail')?.hidden).map(card => card.dataset.stepId).filter(Boolean);
          const scroller = typeof document !== 'undefined' ? document.querySelector('#chem-page-root') : null;
          const scrollTop = scroller?.scrollTop ?? 0;
          void renderRoute(route).then(() => {
            for (const openId of expandedIds) {
              const selector = `.guided-learning-card[data-step-id="${typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(openId) : openId}"]`;
              const card = typeof document !== 'undefined' ? document.querySelector(selector) : null;
              if (!card) continue;
              const detail = card.querySelector('.guided-card-detail');
              if (detail) detail.hidden = false;
              card.querySelector('.guided-card-header')?.setAttribute('aria-expanded', 'true');
              const toggle = card.querySelector('.guided-card-toggle');
              if (toggle) toggle.textContent = '−';
            }
            if (scroller) scroller.scrollTop = scrollTop;
          });
        }, 1400);
      },
      onStartQuiz: () => router.navigate('quiz', lessonId),
      onStartMastery: () => router.navigate('quiz', `mastery:${lessonId}`),
      onStartExperiment: id => router.navigate('experiment', id),
      onStartRemediation: () => router.navigate('remediation', lessonId),
      onStartTransfer: () => router.navigate('quiz', `transfer:${lessonId}`),
      onComplete: () => { if (controllers.learning.markComplete(lessonId, lesson)) void renderRoute(route); },
      onBack: () => router.navigate('course'),
    });
  }

  async function renderLabRoute() {
    const experiments = await contentService.getExperimentCatalog({ semester: currentTerm() });
    return renderLabPortal({
      root, experiments,
      onHome: () => router.navigate('home'),
      onExperiment: experiment => { if (experiment?.id) router.navigate('experiment', experiment.id); },
    });
  }

  async function renderKnowledgeMapRoute() {
    const graph = await contentService.getKnowledgeGraphViewModel().catch(() => ({ nodes: [], relations: [] }));
    const homeData = await getHomeData();
    const allNodes = graph?.nodes || [];
    const term = currentTerm();
    const nodes = knowledgeScope === 'all'
      ? allNodes
      : allNodes.filter(node => !node.semester || node.semester === term);
    return renderKnowledgePortal({
      root,
      onHome: () => router.navigate('home'),
      onLearn: lessonId => router.navigate('course', lessonId),
      onSelectNode: id => router.navigate('knowledge-detail', id),
      nodes,
      relations: graph?.relations || [],
      lessons: Array.isArray(homeData?.lessons) ? homeData.lessons : [],
      scope: knowledgeScope,
      scopeTerm: term,
      allCount: allNodes.length,
      onScope: scope => { knowledgeScope = scope; void renderKnowledgeMapRoute(); },
    });
  }

  async function renderKnowledgeDetailRoute(nodeId) {
    const graph = await contentService.getKnowledgeGraphViewModel().catch(() => ({ nodes: [], relations: [] }));
    const homeData = await getHomeData();
    const node = (graph?.nodes || []).find(n => n.id === nodeId);
    const prerequisiteNodes = node ? await contentService.getPrerequisites(nodeId).catch(() => []) : [];
    const lessons = Array.isArray(homeData?.lessons) ? homeData.lessons : [];
    return renderKnowledgeDetail({
      root,
      node,
      prerequisiteNodes,
      lessonId: state.currentLessonId || '',
      onBack: () => router.navigate('knowledge-map'),
      onLearn: lessonId => router.navigate('course', lessonId),
    });
  }

  async function renderAssessmentRoute(data) {
    const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
    const tasks = [];
    const weakPoints = [];
    for (const lesson of data.lessons || []) {
      const lessonId = lesson.canonicalId;
      const lessonState = controllers.learning.getLessonState(lessonId);
      weakPoints.push(...(lessonState.diagnosis?.weakPoints || []));
      const fullLesson = await controllers.learning.getLesson(lessonId);
      const stages = controllers.learning.getStageAvailability({ ...lesson, ...fullLesson, id: lessonId }, await contentService.getGuidedLearning(lessonId));
      if (stages.practice && !lessonState.practice && Array.isArray(fullLesson?.questions) && fullLesson.questions.length) {
        tasks.push({ id: `practice:${lessonId}`, title: `${lesson.title} · 基础练习`, description: '完成本课基础练习并生成诊断证据。', label: '开始练习' });
      }
      if (lessonState.remediation?.status === 'needs-remediation') {
        tasks.push({ id: `remediation:${lessonId}`, title: `${lesson.title} · 针对性补救`, description: '复习薄弱点并完成定向再检测。', label: '继续补救' });
      }
      // A failed mastery attempt must keep the task visible so students can
      // retry without refreshing the page.
      if (stages.mastery && lessonState.mastery?.status !== 'passed' && fullLesson?.mastery?.resourceRef) {
        tasks.push({ id: `mastery:${lessonId}`, title: `${lesson.title} · Mastery`, description: '通过陌生情境题检验是否达到掌握标准。', label: lessonState.mastery ? '再次挑战掌握测试' : '开始掌握测试' });
      }
    }
    return renderAssessmentPortal({
      root,
      onHome: () => router.navigate('home'),
      score: Math.round((progress.masteryScore || 0) * 100),
      weakPoints: weakPoints.filter((id, index) => weakPoints.indexOf(id) === index),
      tasks,
      onTask: task => {
        if (!task) return;
        if (task.id.startsWith('practice:')) router.navigate('quiz', task.id.slice(9));
        else if (task.id.startsWith('mastery:')) router.navigate('quiz', task.id);
        else if (task.id.startsWith('remediation:')) router.navigate('remediation', task.id.slice(12));
      },
    });
  }

  async function renderProgressRoute(data) {
    const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
    const graph = await contentService.getKnowledgeGraphViewModel().catch(() => ({ nodes: [] }));
    const term = currentTerm();
    const weakPoints = (data.lessons || [])
      .flatMap(lesson => controllers.learning.getLessonState(lesson.canonicalId).diagnosis?.weakPoints || [])
      .filter((id, index, arr) => arr.indexOf(id) === index)
      .map(id => {
        const node = (graph?.nodes || []).find(node => node.id === id);
        return { id, name: node?.name || id };
      });
    return renderProgressPortal({
      root,
      onHome: () => router.navigate('home'),
      onQuiz: id => router.navigate('quiz', id),
      summary: {
        completed: Object.values(progress.completed || {}).filter(Boolean).length,
        mastery: Math.round((progress.masteryScore || 0) * 100),
        questions: progress.questions || 0,
      },
      masteryState: masteryService.getState(),
      knowledgeNodes: (graph?.nodes || []).filter(node => !node.semester || node.semester === term),
      weakPoints,
    });
  }

  function renderQuizBlocked(lessonId, mode, status, notice) {
    return views.renderQuizResult({ root, score: 0, correct: 0, total: 0, mode, status, lessonId, notice, blocked: true, onContinue: () => router.navigate('course', lessonId) });
  }

  function parseQuizParam(raw) {
    const text = String(raw || '');
    for (const [prefix, mode] of Object.entries(QUIZ_MODES)) {
      if (text.startsWith(prefix)) return { mode, lessonId: text.slice(prefix.length) };
    }
    return { mode: 'practice', lessonId: text };
  }

  async function renderQuizRoute(route) {
    const raw = route.params[0] || firstIncompleteLesson(await getHomeData());
    const { mode, lessonId } = parseQuizParam(raw);
    const lesson = await controllers.learning.getLesson(lessonId);
    const release = getLessonReleaseState(lesson || {});
    const lessonState = controllers.learning.getLessonState(lessonId);
    if (lesson?.semester && lesson.semester !== currentTerm()) {
      switchTermFor(lesson.semester);
    }
    const gateModes = ['practice', 'mastery', 'transfer', 'recheck'];
    if (gateModes.includes(mode) && !release.available) {
      return renderQuizBlocked(lessonId, mode, 'unavailable', '该课程内容尚未发布，暂不能开始答题。');
    }
    if (gateModes.includes(mode) && release.key === 'review') {
      return renderQuizBlocked(lessonId, mode, 'review', '该课程正在审核中，可浏览内容但暂不能开始答题。');
    }
    if ((mode === 'practice' || mode === 'mastery') && lesson) {
      const guidedLearning = await contentService.getGuidedLearning(lessonId);
      const stages = controllers.learning.getStageAvailability({ ...lesson, id: lessonId }, guidedLearning);
      if (mode === 'practice' && !stages.practice) return router.navigate('course', lessonId);
      if (mode === 'mastery' && !stages.mastery) return router.navigate('course', lessonId);
    }
    if (!controllers.assessment.hasSession(lessonId, mode)) {
      const started = mode === 'practice' ? await controllers.assessment.startPractice(lessonId)
        : mode === 'mastery' ? await controllers.assessment.startMastery(lessonId)
        : mode === 'recheck' ? await controllers.assessment.startRecheck(lessonId, lessonState.recheck?.knowledgeIds || lessonState.diagnosis?.weakPoints || [])
        : await controllers.assessment.startTransfer(lessonId);
      if (!started) {
        const notices = {
          practice: '本课暂无可用练习题目，请联系内容维护后再试。',
          mastery: '本课暂无可用掌握测试题，请联系内容维护后再试。',
          recheck: '暂无待复查的题目，请先完成练习或补救。',
          transfer: '本课暂无迁移挑战题，迁移内容建设完成后开放。',
        };
        return renderQuizBlocked(lessonId, mode, 'empty', notices[mode] || notices.practice);
      }
    }
    const session = controllers.assessment.session;
    if (!session || session.lessonId !== lessonId || session.mode !== mode) return router.navigate('course', lessonId);
    if (session.completed) {
      const score = controllers.assessment.getScore();
      const result = mode === 'mastery' ? lessonState.mastery : mode === 'recheck' ? lessonState.recheck : mode === 'transfer' ? lessonState.transfer : lessonState.practice;
      return views.renderQuizResult({
        root,
        score,
        correct: session.answers.filter(a => a.correct).length,
        total: session.answers.length,
        hasRemediation: lessonState.remediation?.status === 'needs-remediation',
        onRemediation: () => router.navigate('remediation', lessonId),
        onContinue: () => router.navigate('course', lessonId),
        onRetry: () => { controllers.assessment.reset(); void renderRoute(route); },
        status: result?.status,
        mode, lessonId,
        answers: session.answers,
        questions: session.questions,
        criteria: result?.criteria || {},
      });
    }
    return views.renderQuiz({
      root,
      question: session.questions[session.index],
      index: session.index,
      total: session.questions.length,
      mode,
      onAnswer: value => { if (controllers.assessment.answer(value)) renderRoute(route); },
    });
  }

  async function renderExperimentRoute(route) {
    const experiment = await contentService.getExperiment(route.params[0]);
    if (experiment) controllers.experiment.register(experiment);
    // A stale session for a different experiment must never be rendered for
    // this route (the old guard short-circuited on any existing session).
    if (controllers.experiment.session && controllers.experiment.session.id !== route.params[0]) {
      controllers.experiment.reset();
    }
    if (!controllers.experiment.session && !controllers.experiment.start(route.params[0])) {
      return router.navigate('course', experiment?.lessonId || CANONICAL_GOLDEN_LESSON);
    }
    const session = controllers.experiment.session;
    const instruments = await contentService.getInstruments();
    return views.renderExperiment({
      root,
      experiment: session.experiment || {},
      session,
      instruments,
      onNext: () => { controllers.experiment.next(); renderRoute(route); },
      onObserve: text => controllers.experiment.observe(text),
      onComplete: () => views.renderExperimentResult({
        root,
        result: controllers.experiment.complete() || {},
        onContinue: () => router.navigate('course', session.experiment?.lessonId || CANONICAL_GOLDEN_LESSON),
      }),
    });
  }

  async function renderRemediationRoute(route) {
    const homeData = await getHomeData();
    const remediationLesson = (homeData?.lessons || []).find(lesson => controllers.learning.getLessonState(lesson.id).remediation?.status === 'needs-remediation');
    const lessonId = route.params[0] || remediationLesson?.id || firstIncompleteLesson(homeData);
    const lessonState = controllers.learning.getLessonState(lessonId);
    const plan = lessonState.remediation || null;
    const lesson = await controllers.learning.getLesson(lessonId);
    const guidedLearning = await contentService.getGuidedLearning(lesson?.id || lessonId);
    return views.renderRemediation({
      root, plan, lessonId, guidedLearning,
      onRecheck: async selectedPlan => {
        const ids = (selectedPlan?.steps || []).find(step => step.type === 'recheck')?.knowledgeIds || lessonState.diagnosis?.weakPoints || [];
        if (await controllers.assessment.startRecheck(lessonId, ids)) router.navigate('quiz', `recheck:${lessonId}`);
      },
      onTransfer: async () => {
        if (await controllers.assessment.startTransfer(lessonId)) router.navigate('quiz', `transfer:${lessonId}`);
        else router.navigate('course', lessonId);
      },
      onReview: stepId => { router.navigate('course', lessonId, stepId); },
    });
  }

  async function renderRoute(route) {
    if (!root) return;
    if (CONTENT_ROUTES.has(route.page) && !state.contentReady) {
      if (route.page === 'home') renderHomeMessage('正在准备学习内容…');
      else if (root) root.innerHTML = `<section class="page"><p style="padding:80px 24px;text-align:center;color:var(--ink-dim);font-size:15px">${state.contentLoadError ? '课程内容暂时无法加载，请刷新后重试。' : '正在准备学习内容…'}</p></section>`;
      return;
    }
    const data = HOME_DATA_ROUTES.has(route.page) ? await getHomeData() : null;
    switch (route.page) {
      case 'home': return renderHomeRoute(data);
      case 'course': return renderCourseRoute(route, data);
      case 'lab': return renderLabRoute();
      case 'knowledge-map': return renderKnowledgeMapRoute();
      case 'knowledge-detail': return renderKnowledgeDetailRoute(route.params[0]);
      case 'assessment': return renderAssessmentRoute(data);
      case 'progress':
      case 'dashboard': return renderProgressRoute(data);
      case 'graph': return views.renderGraph({ root, graph: await contentService.getKnowledgeGraphViewModel(), onBack: () => router.navigate('home') });
      case 'quiz': return renderQuizRoute(route);
      case 'experiment': return route.params.length ? renderExperimentRoute(route) : renderLabRoute();
      case 'remediation': return renderRemediationRoute(route);
      case 'ai-tutor': return views.renderAITutorPage({ root });
      case 'experiment-result':
      case 'result': return router.navigate('progress');
      default: return renderHomeRoute(data);
    }
  }

  return {
    state, router, contentService, masteryService, controllers, views, hydrateContent,
    start() {
      stopped = false;
      if (typeof window !== 'undefined') {
        window.addEventListener('chemlab:term-change', () => {
          if (['home', 'course', 'lab', 'assessment', 'knowledge-map', 'progress'].includes(router.current().page)) void renderRoute(router.current());
        });
      }
      router.start();
      void hydrateContent().catch(() => undefined);
    },
    stop() { stopped = true; router.stop(); },
  };
}
