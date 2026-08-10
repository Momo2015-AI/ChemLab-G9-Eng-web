/**
 * ChemLab-G9 V1.7 application bootstrap.
 *
 * The legacy runtime remains available as a compatibility layer while the
 * new composition root is introduced incrementally.
 */

import { createAppState } from './state.js';
import { createApplication } from './application.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';

const state = createAppState();
window.chemLabState = state;

export async function bootstrap({ root = document.querySelector('#app') } = {}) {
  const application = createApplication({
    state,
    assessment: assessmentEngine,
    experimentEngine,
    root,
  });

  await application.contentService.load();
  application.start();
  window.chemLabApplication = application;

  // Legacy runtime is intentionally loaded only after the new boundary is
  // ready, preserving the existing public `window.app` API during migration.
  await import('../engine/app.js');
  return application;
}

export { state };
