/**
 * V1.7 Experiment Controller
 * Owns experiment-session state; ExperimentEngine remains responsible for domain rules.
 */
export class ExperimentController {
  constructor({ experimentEngine, state, masteryService = null }) {
    this.engine = experimentEngine;
    this.state = state;
    this.masteryService = masteryService;
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
    const observation = String(text ?? '').trim();
    const validation = this.engine.validateStep(this.session, observation);
    this.session = this.engine.recordObservation(this.session, observation);
    this.session.lastValidation = validation;
    this.#recordEvidence(validation);
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

  #recordEvidence(validation) {
    if (!this.masteryService || !this.session?.id || !validation) return;
    const knowledgeId = this.session.knowledgeId || this.session.knowledgePointId;
    if (!knowledgeId) return;
    this.masteryService.recordEvidence(knowledgeId, validation.valid ? 1 : 0, 0.2);
  }
}
