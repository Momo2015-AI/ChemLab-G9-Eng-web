/**
 * V1.7 Experiment Controller
 * Owns experiment-session state; ExperimentEngine remains responsible for domain rules.
 */
import { diagnoseExperiment } from '../core/diagnosis/diagnosis-engine.js';

export class ExperimentController {
  constructor({ experimentEngine, state, masteryService = null, learningController = null }) {
    this.engine = experimentEngine;
    this.state = state;
    this.masteryService = masteryService;
    this.learningController = learningController;
    this.session = null;
  }

  start(experimentId) {
    const experiment = this.engine.get(experimentId);
    if (!experiment) return null;
    this.session = this.engine.start(experimentId);
    this.session.experiment = experiment;
    this.session.knowledgeIds = this.getKnowledgeIds(experiment);
    return { experiment, session: this.session };
  }

  register(experiment) {
    if (!experiment?.id || typeof this.engine.register !== 'function') return false;
    this.engine.register(experiment.id, experiment);
    return true;
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

  getKnowledgeIds(experiment) {
    const ids = experiment?.knowledgeIds ?? experiment?.knowledgeId ?? experiment?.knowledge ?? [];
    return (Array.isArray(ids) ? ids : [ids]).filter(Boolean);
  }

  #recordEvidence(validation) {
    if (!this.session?.id || !validation) return;
    const knowledgeIds = this.session.knowledgeIds || [];
    if (!knowledgeIds.length) return;

    const diagnosis = diagnoseExperiment({ knowledgeIds, validation });
    this.state.learning ||= {};
    this.state.learning.diagnosis = diagnosis;

    if (this.masteryService) {
      for (const knowledgeId of knowledgeIds) {
        this.masteryService.recordEvidence(knowledgeId, validation.valid ? 1 : 0, 0.2);
      }
      this.state.progress ||= {};
      if (typeof this.masteryService.getState === 'function') {
        this.state.progress.mastery = this.masteryService.getState();
      }
    }

    if (diagnosis.status === 'incorrect' && this.learningController) {
      this.learningController.getRemediationPlan(diagnosis);
    }
    this.state.save?.();
  }
}
