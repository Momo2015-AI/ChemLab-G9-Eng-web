/**
 * ChemLab-G9 V1.7 application bootstrap.
 * The V1.7 composition root is now the sole production runtime entry.
 */

import { createAppState } from './state.js';
import { createApplication } from './application.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';

const state = createAppState();

export async function bootstrap({ root = document.querySelector('#app-root') } = {}) {
  const application = createApplication({
    state,
    assessment: assessmentEngine,
    experimentEngine,
    root,
  });

  await application.contentService.load();
  application.start();
  window.chemLabApplication = application;
  window.chemLabState = state;
  return application;
}

export { state };

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(error => {
      console.error('ChemLab V1.7 bootstrap failed:', error);
      const root = document.querySelector('#app-root');
      if (root) root.textContent = 'ChemLab failed to start. Please refresh and try again.';
    });
  });
}
