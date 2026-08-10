/**
 * ChemLab-G9 V1.7 application bootstrap.
 *
 * This is the new application boundary. V1.6 engine/app.js remains the
 * compatibility runtime for now; future phases will move orchestration out
 * of that legacy module and into this bootstrap layer.
 */

import { createAppState } from './state.js';

const state = createAppState();

// Keep the state boundary observable for the migration period without
// changing the existing public `window.app` API used by legacy templates.
window.chemLabState = state;

export async function bootstrap() {
  // Importing the legacy runtime is intentionally deferred. This gives the
  // new entry point a stable place for future dependency wiring while keeping
  // V1.6 behaviour unchanged during the refactor.
  await import('../engine/app.js');
  return window.app;
}

export { state };
