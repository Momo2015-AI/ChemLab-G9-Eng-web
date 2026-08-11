/**
 * V1.9 Application Composition Root.
 * Single production wiring point for state, content, controllers and views.
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
import { renderExperiment, renderExperimentResult } from '../views/experiment-view.js';
import { renderDashboard } from '../views/dashboard-view.js';
import { renderGraph } from '../views/graph-view.js';
import { renderRemediation } from '../views/remediation-view.js';

const getDefaultRoot = () => typeof document === 'undefined' ? null : document.querySelector('#app-root');

export function createApplication({ state, assessment, experimentEngine, masteryService = new MasteryService(), remediationCatalog = {}, root = getDefaultRoot() }) {
  const learning = new LearningController({ contentService, state, remediationCatalog });
  const controllers = {
    learning,
    assessment: new AssessmentController({ assessment, contentService, state, masteryService, learningController: learning }),
    experiment: new ExperimentController({ experimentEngine, state, masteryService, learningController: learning }),
  };
  const views = { renderHome, renderCourse: renderV19Course, renderQuiz, renderQuizResult, renderExperiment, renderExperimentResult, renderDashboard, renderGraph, renderRemediation };
  const router = createRouter({ onRoute: route => { state.route = route; }, render: route => renderRoute(route) });

  async function getHomeData() {
    const data = await contentService.load();
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
    if (route.page === 'home') {
      const data = await getHomeData();
      return views.renderHome({ root, data, onCourse: day => router.navigate('course', day || firstIncompleteDay(data)), onDashboard: () => router.navigate('dashboard'), onGraph: () => router.navigate('graph'), onRemediation: () => router.navigate('remediation') });
    }
    if (route.page === 'course') {
      const data = await getHomeData();
      const dayId = route.params[0] || firstIncompleteDay(data) || '01';
      const lesson = await controllers.learning.getLesson(dayId);
      if (!lesson) return views.renderCourse({ root, lesson: { id: dayId, title: '课程未找到', description: '请返回学习中心选择课程。' } });
      return views.renderCourse({ root, lesson, progress: controllers.learning.getProgress(dayId), onStartQuiz: () => router.navigate('quiz', dayId), onStartExperiment: id => router.navigate('experiment', id), onComplete: () => { controllers.learning.markComplete(dayId); renderRoute(route); }, onBack: () => router.navigate('home') });
    }
    if (route.page === 'dashboard') {
      const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
      const data = await contentService.load();
      const weakPoints = (progress.weakPoints || []).map(item => typeof item === 'object' ? item : data.knowledgeGraph?.nodes?.find(node => node.id === item) || { id: item });
      const summary = { completed: Object.values(progress.completed || {}).filter(Boolean).length, mastery: Math.round((progress.masteryScore || 0) * 100), questions: progress.questions || 0, weakPoints, diagnosis: state.learning?.diagnosis, remediation: state.learning?.remediation };
      return views.renderDashboard({ root, summary, onContinue: () => router.navigate('home'), onRemediation: () => router.navigate('remediation') });
    }
    if (route.page === 'remediation') return views.renderRemediation({ root, plan: state.learning?.remediation, onRecheck: async plan => { const ids = (plan.steps || []).find(step => step.type === 'recheck')?.knowledgeIds || []; if (await controllers.assessment.startTargeted(ids)) router.navigate('quiz'); }, onTransfer: () => router.navigate('home') });
    if (route.page === 'graph') return views.renderGraph({ root, graph: await contentService.getKnowledgeGraphViewModel(), onBack: () => router.navigate('home') });
    if (route.page === 'quiz') {
      if (!controllers.assessment.session) await controllers.assessment.start(route.params[0] || firstIncompleteDay(await getHomeData()));
      const session = controllers.assessment.session;
      if (!session) return;
      if (session.completed) return views.renderQuizResult({ root, score: controllers.assessment.getScore(), correct: session.answers.filter(a => a.correct).length, total: session.answers.length, hasRemediation: state.learning?.remediation?.status === 'needs-remediation', onRemediation: () => router.navigate('remediation'), onContinue: () => router.navigate('dashboard') });
      return views.renderQuiz({ root, question: session.questions[session.index], index: session.index, total: session.questions.length, onAnswer: optionIndex => { if (controllers.assessment.answer(optionIndex)) renderRoute(route); } });
    }
    if (route.page === 'experiment') {
      if (!controllers.experiment.session && !controllers.experiment.start(route.params[0])) return;
      const session = controllers.experiment.session;
      return views.renderExperiment({ root, experiment: session.experiment || {}, session, onNext: () => { controllers.experiment.next(); renderRoute(route); }, onObserve: text => controllers.experiment.observe(text), onComplete: () => views.renderExperimentResult({ root, result: controllers.experiment.complete() || {}, onContinue: () => router.navigate('dashboard') }) });
    }
    if (route.page === 'experiment-result' || route.page === 'result') return router.navigate('dashboard');
  }

  return { state, router, contentService, masteryService, controllers, views, start() { router.start(); }, stop() { router.stop(); } };
}
function firstIncompleteDay(data) { return data.lessons?.find(lesson => !lesson.completed)?.day || data.lessons?.[0]?.day || '01'; }
