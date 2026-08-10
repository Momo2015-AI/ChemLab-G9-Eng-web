/**
 * V1.7 Application Composition Root
 * Wires state, router, services, controllers and view adapters.
 */

import { createRouter } from './router.js';
import { contentService } from './content-service.js';
import { MasteryService } from './mastery-service.js';
import { createProgressProjection } from './progress-projection.js';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { LearningController } from '../controllers/learning-controller.js';
import { renderHome } from '../views/home-view.js';
import { renderCourse } from '../views/course-view.js';
import { renderQuiz, renderQuizResult } from '../views/quiz-view.js';
import { renderExperiment, renderExperimentResult } from '../views/experiment-view.js';
import { renderDashboard } from '../views/dashboard-view.js';
import { renderGraph } from '../views/graph-view.js';
import { renderRemediation } from '../views/remediation-view.js';

export function createApplication({ state, assessment, experimentEngine, masteryService = new MasteryService(), remediationCatalog = {}, root = document.querySelector('#app') }) {
  masteryService.hydrate(state.progress?.mastery || {});

  const controllers = {
    learning: new LearningController({ contentService, state, remediationCatalog }),
    assessment: new AssessmentController({ assessment, contentService, state, masteryService }),
    experiment: new ExperimentController({ experimentEngine, state, masteryService }),
  };

  const views = { renderHome, renderCourse, renderQuiz, renderQuizResult, renderExperiment, renderExperimentResult, renderDashboard, renderGraph, renderRemediation };

  const router = createRouter({
    onRoute: route => { state.route = route; },
    render: route => renderRoute(route),
  });

  async function renderRoute(route) {
    if (!root) return;
    if (route.page === 'home') return views.renderHome({ root });
    if (route.page === 'course') {
      const lesson = await controllers.learning.getLesson(route.params[0]);
      return views.renderCourse({ root, lesson });
    }
    if (route.page === 'dashboard') {
      const progress = createProgressProjection({ ...state.progress, mastery: masteryService.getState() });
      const summary = {
        completed: progress.completed.length,
        mastery: Math.round(progress.masteryScore * 100),
        questions: progress.questions,
        weakPoints: progress.weakPoints,
      };
      return views.renderDashboard({ root, summary });
    }
    if (route.page === 'remediation') {
      return views.renderRemediation({
        root,
        plan: state.learning?.remediation,
        onRecheck: async plan => {
          const ids = [...new Set((plan.steps || []).map(step => step.knowledgeId).filter(Boolean))];
          const session = await controllers.assessment.startTargeted(ids);
          if (session) return renderRoute({ page: 'quiz', params: [] });
        },
        onTransfer: () => router.navigate('course'),
      });
    }
    if (route.page === 'graph') {
      const graph = await contentService.getKnowledgeGraphViewModel();
      return views.renderGraph({ root, graph });
    }
    if (route.page === 'quiz') {
      const session = controllers.assessment.session;
      if (!session) return;
      return views.renderQuiz({
        root,
        question: session.questions[session.index],
        index: session.index,
        total: session.questions.length,
        onAnswer: optionIndex => {
          const result = controllers.assessment.answer(optionIndex);
          if (!result) return;
          if (controllers.assessment.session.completed) {
            const score = controllers.assessment.getScore();
            const hasRemediation = Boolean(state.learning?.remediation);
            return views.renderQuizResult({
              root,
              score,
              correct: controllers.assessment.session.answers.filter(a => a.correct).length,
              total: controllers.assessment.session.answers.length,
              hasRemediation,
              onRemediation: () => router.navigate('remediation'),
              onContinue: () => router.navigate('dashboard'),
            });
          }
          return renderRoute({ page: 'quiz', params: [] });
        },
      });
    }
    if (route.page === 'experiment') {
      const session = controllers.experiment.session;
      if (!session) return;
      return views.renderExperiment({ root, experiment: session.experiment || {}, session });
    }
  }

  return {
    state, router, contentService, masteryService, controllers, views,
    start() { router.start(); },
    stop() { router.stop(); },
  };
}
