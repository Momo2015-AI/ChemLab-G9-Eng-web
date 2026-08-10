/**
 * ChemLab-G9 V1.7 application bootstrap.
 *
 * Loads content and wires the new composition root. The legacy runtime is
 * kept as a fallback during migration; it is no longer auto-initialized here.
 */

import { createAppState } from './state.js';
import { createApplication } from './application.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';

const state = createAppState();
if (typeof window !== 'undefined') window.chemLabState = state;

export async function bootstrap({ root = document.querySelector('#app') } = {}) {
  const application = createApplication({
    state,
    assessment: assessmentEngine,
    experimentEngine,
    root,
  });

  await application.contentService.load();
  application.start();
  if (typeof window !== 'undefined') window.chemLabApplication = application;
  return application;
}

export { state };
