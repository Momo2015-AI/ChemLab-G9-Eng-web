/**
 * ChemLab application composition root.
 *
 * Startup contract:
 * 1. mount the portal and router immediately;
 * 2. render a usable shell without waiting for content;
 * 3. hydrate canonical content in the background;
 * 4. re-render the active route when content becomes ready.
 */
import { createRouter } from './router.js';
import { contentService } from './content-service.js';
import { MasteryService } from './mastery-service.js';
import { createProgressProjection } from './progress-projection.js';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { LearningController } from '../controllers/learning-controller.js';
import { renderHome } from '../views/home-view.js';
import { renderV19Course } from '../views/v19-course-view.js';
import { renderQuiz, renderQuizResult } from '../views/quiz-view.js';
import { renderV19Experiment, renderV19ExperimentResult } from '../views/v19-experiment-view.js';
import { renderDashboard } from '../views/dashboard-view.js';
import { renderGraph } from '../views/graph-view.js';
import { renderRemediation } from '../views/remediation-view.js';
import { renderAITutorPage } from '../frontend/pages/ai-tutor/ai-tutor-page.js';
import { renderCoursePortal } from '../frontend/pages/course/course-portal-page.js';
import { renderLabPortal } from '../frontend/pages/lab/lab-portal-page.js';
import { renderKnowledgePortal } from '../frontend/pages/knowledge/knowledge-portal-page.js';
import { renderAssessmentPortal } from '../frontend/pages/assessment/assessment-portal-page.js';
import { renderProgressPortal } from '../frontend/pages/progress/progress-portal-page.js';
import { createRemediationCatalog } from '../core/diagnosis/remediation-catalog.js';

const getDefaultRoot = () => typeof document === 'undefined' ? null : document.querySelector('#app-root');

export function createApplication({ state, assessment, experimentEngine, masteryService = new MasteryService(), remediationCatalog = {}, root = getDefaultRoot() } = {}) {
  const learning = new LearningController({ contentService, state, remediationCatalog });
  const controllers = {
    learning,
    assessment: new AssessmentController({ assessment, contentService, state, masteryService, learningController: learning }),
    experiment: new ExperimentController({ experimentEngine, state, masteryService, learningController: learning }),
  };
  const views = { renderHome, renderCourse: renderV19Course, renderQuiz, renderQuizResult, renderExperiment: renderV19Experiment, renderExperimentResult: renderV19ExperimentResult, renderDashboard, renderGraph, renderRemediation, renderAITutorPage };

  let hydrationPromise = null;
  let stopped = false;

  const router = createRouter({
    onRoute: route => { state.route = route; },
    render: route => renderRoute(route),
  });

  function renderHomeLoading() {
    if (!root) return;
    views.renderHome({
      root,
      data: {
        title: '九年级化学智能学习中心',
        subtitle: '正在准备学习内容…',
        lessons: [],
        stats: { completed: 0, mastery: 0, questions: 0 },
      },
      onCourse: () => router.navigate('course'),
      onDashboard: () => router.navigate('progress'),
      onGraph: () => router.navigate('knowledge-map'),
    });
  }

  async function hydrateContent() {
    if (hydrationPromise) return hydrationPromise;
    hydrationPromise = contentService.load().then(data => {
      learning.remediationCatalog = createRemediationCatalog(data);
      state.contentReady = true;
      state.contentLoadError = null;
      if (!stopped) renderRoute(router.current());
      return data;
    }).catch(error => {
      state.contentLoadError = error;
      state.contentReady = false;
      if (root && !stopped) {
        const current = router.current();
        if (current.page === 'home') {
          views.renderHome({
            root,
            data: { title: '九年级化学智能学习中心', subtitle: '课程内容暂时无法加载，请刷新后重试。', lessons: [], stats: { completed: 0, mastery: 0, questions: 0 } },
            onCourse: () => router.navigate('course'),
            onDashboard: () => router.navigate('progress'),
            onGraph: () => router.navigate('knowledge-map'),
          });
        }
      }
      throw error;
    });
    return hydrationPromise;
  }

  async function getHomeData() {
    if (!contentService.data) return null;
    const data = contentService.data;
    const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
    const lessons = data.days.map(day => ({ ...day, completed: Boolean(progress.completed?.[day.day]) }));
    return {
      title: '九年级化学智能学习中心',
      subtitle: '学习 → 实验 → 答题 → 诊断 → 补救 → 再检测',
      lessons,
      hasRemediation: state.learning?.remediation?.status === 'needs-remediation',
      stats: { completed: lessons.filter(day => day.completed).length, mastery: Math.round((progress.masteryScore || 0) * 100), questions: progress.questions || 0 },
    };
  }

  async function renderRoute(route) {
    if (!root) return;
    const needsContent = ['home', 'course', 'progress', 'assessment', 'quiz', 'knowledge-map', 'graph'].includes(route.page);
    if (needsContent && !state.contentReady) {
      if (route.page === 'home') renderHomeLoading();
      return;
    }
    const data = ['home', 'course', 'progress', 'assessment'].includes(route.page) ? await getHomeData() : null;
    if (route.page === 'home') return views.renderHome({ root, data, onCourse: day => router.navigate('course', day || firstIncompleteDay(data)), onDashboard: () => router.navigate('progress'), onGraph: () => router.navigate('knowledge-map'), onRemediation: () => router.navigate('assessment') });
    if (route.page === 'course' && !route.params.length) return renderCoursePortal({ root, lessons: data?.lessons, onLesson: id => router.navigate('course', id), onHome: () => router.navigate('home') });
    if (route.page === 'course') { const dayId = route.params[0] || firstIncompleteDay(data) || '01'; const lesson = await controllers.learning.getLesson(dayId); if (!lesson) return views.renderCourse({ root, lesson: { id: dayId, title: '课程未找到', description: '请返回学习中心选择课程。' } }); return views.renderCourse({ root, lesson, progress: controllers.learning.getProgress(dayId), onStartQuiz: () => router.navigate('quiz', dayId), onStartExperiment: id => router.navigate('experiment', id), onComplete: () => { controllers.learning.markComplete(dayId); renderRoute(route); }, onBack: () => router.navigate('course') }); }
    if (route.page === 'lab' && !route.params.length) return renderLabPortal({ root, onHome: () => router.navigate('home') });
    if (route.page === 'knowledge-map') return renderKnowledgePortal({ root, onHome: () => router.navigate('home'), nodes: await contentService.getKnowledgeGraphViewModel().then(model => model?.nodes || []).catch(() => []) });
    if (route.page === 'assessment') return renderAssessmentPortal({ root, onHome: () => router.navigate('home'), score: Math.round((createProgressProjection({ ...state.progress, mastery: masteryService.getState() }).masteryScore || 0) * 100), weakPoints: state.learning?.diagnosis?.weakPoints || [] });
    if (route.page === 'progress' || route.page === 'dashboard') { const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() }); return renderProgressPortal({ root, onHome: () => router.navigate('home'), summary: { completed: Object.values(progress.completed || {}).filter(Boolean).length, mastery: Math.round((progress.masteryScore || 0) * 100), questions: progress.questions || 0 } }); }
    if (route.page === 'graph') return views.renderGraph({ root, graph: await contentService.getKnowledgeGraphViewModel(), onBack: () => router.navigate('home') });
    if (route.page === 'quiz') { if (!controllers.assessment.session) await controllers.assessment.start(route.params[0] || firstIncompleteDay(await getHomeData())); const session = controllers.assessment.session; if (!session) return; if (session.completed) return views.renderQuizResult({ root, score: controllers.assessment.getScore(), correct: session.answers.filter(a => a.correct).length, total: session.answers.length, hasRemediation: state.learning?.remediation?.status === 'needs-remediation', onRemediation: () => router.navigate('assessment'), onContinue: () => router.navigate('progress') }); return views.renderQuiz({ root, question: session.questions[session.index], index: session.index, total: session.questions.length, onAnswer: optionIndex => { if (controllers.assessment.answer(optionIndex)) renderRoute(route); } }); }
    if (route.page === 'experiment' && !route.params.length) return renderLabPortal({ root, onHome: () => router.navigate('home') });
    if (route.page === 'experiment') { if (!controllers.experiment.session && !controllers.experiment.start(route.params[0])) return; const session = controllers.experiment.session; return views.renderExperiment({ root, experiment: session.experiment || {}, session, onNext: () => { controllers.experiment.next(); renderRoute(route); }, onObserve: text => controllers.experiment.observe(text), onComplete: () => views.renderExperimentResult({ root, result: controllers.experiment.complete() || {}, onContinue: () => router.navigate('progress') }) }); }
    if (route.page === 'remediation') return views.renderRemediation({ root, plan: state.learning?.remediation, onRecheck: async plan => { const ids = (plan.steps || []).find(step => step.type === 'recheck')?.knowledgeIds || []; if (await controllers.assessment.startTargeted(ids)) router.navigate('quiz'); }, onTransfer: () => router.navigate('home') });
    if (route.page === 'ai-tutor') return views.renderAITutorPage({ root });
    if (route.page === 'experiment-result' || route.page === 'result') return router.navigate('progress');
  }

  return {
    state,
    router,
    contentService,
    masteryService,
    controllers,
    views,
    hydrateContent,
    start() {
      stopped = false;
      router.start();
      void hydrateContent();
    },
    stop() {
      stopped = true;
      router.stop();
    },
  };
}

function firstIncompleteDay(data) { return data?.lessons?.find(lesson => !lesson.completed)?.day || data?.lessons?.[0]?.day || '01'; }
