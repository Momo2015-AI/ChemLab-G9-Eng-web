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
    const lessonId = experiment.lessonId || experiment.lesson || null;
    const saved = lessonId ? this.learningController?.getLessonState?.(lessonId)?.experiment?.session : null;
    this.session = saved?.experimentId === experimentId ? saved.session : this.engine.start(experimentId);
    this.session.experiment = experiment;
    this.session.lessonId = lessonId;
    this.session.knowledgeIds = this.getKnowledgeIds(experiment);
    if (this.session.lessonId) this.#persistSession({ phase: 'EXPERIMENT', experimentId, startedAt: new Date().toISOString() });
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
    this.#persistSession();
    return this.session;
  }

  observe(text) {
    if (!this.session) return null;
    const observation = String(text ?? '').trim();
    const validation = this.engine.validateStep(this.session, observation);
    this.session = this.engine.recordObservation(this.session, observation);
    this.session.lastValidation = validation;
    this.#persistSession();
    this.#recordEvidence(validation);
    return this.session;
  }

  complete() {
    if (!this.session) return null;
    this.session = this.engine.complete(this.session);
    this.#persistSession({ phase: 'PRACTICE', completed: true, completedAt: this.session.completedAt });
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
    this.state.learning.diagnosis = { ...diagnosis, lessonId: this.session.lessonId || undefined };

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
      this.learningController.getRemediationPlan({ ...diagnosis, lessonId: this.session.lessonId || undefined });
    }
    if (this.session.lessonId) this.learningController?.updateLessonState?.(this.session.lessonId, { diagnosis: this.state.learning.diagnosis, phase: diagnosis.status === 'incorrect' ? 'REMEDIATION' : 'PRACTICE' });
    this.state.save?.();
  }

  #persistSession(extra = {}) {
    const lessonId = this.session?.lessonId;
    if (!lessonId || !this.learningController) return;
    this.learningController.updateLessonState(lessonId, {
      ...extra,
      experiment: {
        ...(this.learningController.getLessonState(lessonId).experiment || {}),
        ...extra,
        experimentId: this.session.id,
        session: this.session,
      },
    });
  }
}
