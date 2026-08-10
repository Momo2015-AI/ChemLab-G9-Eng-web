/**
 * V1.7 Application Composition Root
 * Wires state, router, services and controllers without replacing the legacy runtime yet.
 */

import { createRouter } from './router.js';
import { contentService } from './content-service.js';
import { AssessmentController } from '../controllers/assessment-controller.js';
import { ExperimentController } from '../controllers/experiment-controller.js';
import { LearningController } from '../controllers/learning-controller.js';

export function createApplication({ state, assessment, experimentEngine }) {
  const controllers = {
    learning: new LearningController({ contentService, state }),
    assessment: new AssessmentController({ assessment, contentService, state }),
    experiment: new ExperimentController({ experimentEngine, state }),
  };

  const router = createRouter({
    onRoute: route => {
      state.route = route;
    },
  });

  return {
    state,
    router,
    contentService,
    controllers,
    start() {
      router.start();
    },
    stop() {
      router.stop();
    },
  };
}
