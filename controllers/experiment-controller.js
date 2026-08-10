/**
 * V1.7 Experiment Controller
 * Owns experiment-session state; ExperimentEngine remains responsible for domain rules.
 */
export class ExperimentController {
  constructor({ experimentEngine, state }) {
    this.engine = experimentEngine;
    this.state = state;
    this.session = null;
  }

  start(experimentId) {
    const experiment = this.engine.get(experimentId);
    if (!experiment) return null;
    this.session = this.engine.start(experimentId);
    return { experiment, session: this.session };
  }

  next() {
    if (!this.session) return null;
    this.session = this.engine.next(this.session);
    return this.session;
  }

  observe(text) {
    if (!this.session) return null;
    this.session = this.engine.recordObservation(this.session, text || '');
    return this.session;
  }

  complete() {
    if (!this.session) return null;
    this.session = this.engine.complete(this.session);
    return this.session;
  }

  reset() {
    this.session = null;
  }
}
