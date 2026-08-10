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

  // Bind global actions from data-action attributes
  function bindActions(container) {
    container?.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const action = el.dataset.action;
        const day = el.dataset.day;
        const nodeId = el.dataset.node;
        const modId = el.dataset.module;
        const expId = el.dataset.exp;
        switch (action) {
          case 'go-home': router.navigate('home'); break;
          case 'go-course': router.navigate('course'); break;
          case 'go-graph': router.navigate('graph'); break;
          case 'go-graph-modules': router.navigate('graph'); break;
          case 'go-graph-path': router.navigate('graph', 'path', modId); break;
          case 'go-graph-node': router.navigate('graph', 'detail', nodeId); break;
          case 'go-graph-back': {
            const cur = router.current();
            if (cur.params[1]) router.navigate('graph', 'path', cur.params[1]);
            else router.navigate('graph');
            break;
          }
          case 'go-dashboard': router.navigate('dashboard'); break;
          case 'go-experiments': router.navigate('experiment'); break;
          case 'go-experiment': if (expId) router.navigate('experiment', expId); break;
          case 'start-quiz': if (day) controllers.assessment.start(day).then(session => {
            if (session) router.navigate('quiz', day);
          }); break;
          case 'start-quiz-by-node': if (nodeId) {
            // Trigger quiz for node's questions via assessment controller
            controllers.assessment.startByNode(nodeId).then(session => {
              if (session) router.navigate('quiz', nodeId);
            });
          } break;
          case 'retry': router.navigate('quiz', state.currentQuiz || '01'); break;
          case 'continue': router.navigate('course'); break;
          case 'back': router.navigate('course'); break;
        }
      });
    });
  }

  async function renderRoute(route) {
    if (!root) return;
    const { page, params } = route;
    // Clear and rebind
    root.innerHTML = '';
    switch (page) {
      case 'home': {
        const data = await contentService.load();
        const homeData = {
          lessons: data.days,
          questions: data.questions,
          knowledgeGraph: data.knowledgeGraph,
          progress: state.progress,
        };
        views.renderHome({ root, data: homeData });
        bindActions(root);
        break;
      }
      case 'course': {
        const data = await contentService.load();
        views.renderCourse({ root, data: { manifest: data.manifest, lessons: data.days, progress: state.progress } });
        bindActions(root);
        break;
      }
      case 'graph': {
        const data = await contentService.load();
        const engine = contentService.getKnowledgeEngine();
        const viewMode = params[0] || 'modules';
        const selectedModule = viewMode === 'path' ? params[1] : null;
        const selectedNode = viewMode === 'detail' ? params[2] : null;
        views.renderGraph({ root, data: {
          knowledgeGraph: data.knowledgeGraph,
          knowledgeEngine: engine,
          progress: state.progress,
          viewMode,
          selectedModule,
          selectedNode,
        }});
        bindActions(root);
        break;
      }
      case 'dashboard': {
        const data = await contentService.load();
        const nodes = data.knowledgeGraph?.nodes || [];
        const mastery = masteryService.getState();
        const mastered = nodes.filter(n => mastery[n.id] >= 0.8).length;
        const learning = nodes.filter(n => { const m = mastery[n.id]; return m > 0 && m < 0.8; }).length;
        const weak = nodes.filter(n => !mastery[n.id]).length;
        const quizzes = state.progress?.quizScores || {};
        const totalQuizzes = Object.keys(quizzes).length;
        const avgScore = totalQuizzes ? Math.round(Object.values(quizzes).reduce((a, b) => a + b, 0) / totalQuizzes) : 0;
        const skillBars = nodes
          .filter(n => mastery[n.id] > 0)
          .map(n => ({ id: n.id, name: n.name, score: Math.round(mastery[n.id] * 100) }))
          .sort((a, b) => a.score - b.score)
          .slice(-15);
        const recommendations = nodes
          .filter(n => mastery[n.id] < 0.5)
          .slice(0, 8)
          .map(n => ({ id: n.id, name: n.name, score: Math.round(mastery[n.id] * 100) }));
        views.renderDashboard({ root, data: {
          totalQuizzes, avgScore, masteredCount: mastered,
          learningCount: learning, weakCount: weak,
          skillBars, recommendations,
        }});
        bindActions(root);
        break;
      }
      case 'quiz': {
        const dayId = params[0] || state.currentQuiz;
        if (dayId) {
          const session = controllers.assessment.session;
          if (!session) {
            await controllers.assessment.start(dayId);
          }
          const s = controllers.assessment.session;
          if (s?.completed) {
            const answers = s.answers || [];
            const correct = answers.filter(a => a.correct).length;
            const score = answers.length ? Math.round(correct / answers.length * 100) : 0;
            views.renderQuizResult({ root, data: { score, correct, total: answers.length } });
          } else {
            const q = s?.questions?.[s.index];
            if (q) {
              const quizData = {
                question: q,
                index: s.index,
                total: s.questions.length,
                answered: false,
                selected: null,
                quizAnswers: s.answers.map(a => ({ [s.questions[s.answers.indexOf(a)]?.id]: a })),
              };
              // Flatten quizAnswers
              const qa = {};
              s.answers.forEach(a => { if (a.questionId) qa[a.questionId] = a; });
              quizData.quizAnswers = qa;
              views.renderQuiz({ root, data: quizData });
            }
          }
        }
        bindActions(root);
        break;
      }
      case 'experiment': {
        const expId = params[0] || state.currentExperiment;
        if (expId) {
          const result = controllers.experiment.start(expId);
          if (result) {
            const data = await contentService.load();
            const expData = {
              experiment: result.experiment,
              session: result.session,
              knowledgeNodes: data.knowledgeGraph?.nodes || [],
            };
            views.renderExperiment({ root, data: expData });
          }
        }
        bindActions(root);
        break;
      }
      case 'experiment-result': {
        const s = controllers.experiment.session;
        if (s) {
          const score = controllers.experiment.engine.getScore(s);
          views.renderExperimentResult({ root, data: {
            score, observations: s.observations || [], totalSteps: s.steps?.length || 0,
          }});
        }
        bindActions(root);
        break;
      }
      case 'result':
      default: {
        const s = controllers.assessment.session;
        if (s?.completed) {
          const answers = s.answers || [];
          const correct = answers.filter(a => a.correct).length;
          const score = answers.length ? Math.round(correct / answers.length * 100) : 0;
          views.renderQuizResult({ root, data: { score, correct, total: answers.length } });
        } else {
          views.renderHome({ root, data: {} });
        }
        bindActions(root);
        break;
      }
    }
  }

  return {
    state, router, contentService, controllers, views,
    start() { router.start(); },
    stop() { router.stop(); },
  };
}
