/**
 * V1.7 Application Composition Root
 * Wires state, router, services, controllers and view adapters.
 */

import { createRouter } from './router.js';
import { contentService } from './content-service.js';
import { MasteryService } from './mastery-service.js';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { LearningController } from '../controllers/learning-controller.js';
import { renderHome } from '../views/home-view.js';
import { renderCourse } from '../views/course-view.js';
import { renderQuiz, renderQuizResult } from '../views/quiz-view.js';
import { renderExperiment, renderExperimentResult } from '../views/experiment-view.js';
import { renderDashboard } from '../views/dashboard-view.js';
import { renderGraph } from '../views/graph-view.js';

export function createApplication({ state, assessment, experimentEngine, masteryService = new MasteryService(), root = document.querySelector('#app') }) {
  masteryService.hydrate(state.progress?.mastery || {});

  const controllers = {
    learning: new LearningController({ contentService, state }),
    assessment: new AssessmentController({ assessment, contentService, state, masteryService }),
    experiment: new ExperimentController({ experimentEngine, state }),
  };

  const views = { renderHome, renderCourse, renderQuiz, renderQuizResult, renderExperiment, renderExperimentResult, renderDashboard, renderGraph };

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
    if (route.page === 'dashboard') return views.renderDashboard({ root, summary: state.progress || {} });
    if (route.page === 'graph') {
      const graph = await contentService.getKnowledgeGraphViewModel();
      return views.renderGraph({ root, graph });
    }
    if (route.page === 'quiz') {
      const session = controllers.assessment.session;
      if (!session) return;
      return views.renderQuiz({ root, question: session.questions[session.index], index: session.index, total: session.questions.length });
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
