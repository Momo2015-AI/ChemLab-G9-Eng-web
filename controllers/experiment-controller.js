/**
 * Experiment Controller
 * Owns experiment-session state; ExperimentEngine remains responsible for domain rules.
 *
 * Observation policy: an empty or too-short observation is treated as "not yet
 * recorded" — it produces no mastery evidence and never changes the lesson
 * phase. A substantive but invalid observation records zero-value evidence but
 * remediation is only decided when the experiment completes, so a mid-experiment
 * typo cannot lock the lesson into REMEDIATION.
 */
import { diagnoseExperiment } from '../core/diagnosis/diagnosis-engine.js';
import { knowledgeIdsOf } from '../core/diagnosis/question-knowledge-map.js';

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
    const substantive = observation.length >= 2;
    const validation = this.engine.validateStep(this.session, observation);
    this.session = this.engine.recordObservation(this.session, observation);
    this.session.lastValidation = validation;
    if (substantive && !validation.valid) this.session.hadInvalidObservation = true;
    this.#persistSession();
    if (substantive) this.#recordEvidence(validation);
    return this.session;
  }

  complete() {
    if (!this.session) return null;
    this.session = this.engine.complete(this.session);
    this.session.score = typeof this.engine.getScore === 'function' ? this.engine.getScore(this.session) : 0;
    if (this.session.hadInvalidObservation) {
      const diagnosis = diagnoseExperiment({ knowledgeIds: this.session.knowledgeIds || [], validation: { valid: false } });
      this.learningController?.getRemediationPlan?.({ ...diagnosis, lessonId: this.session.lessonId || undefined });
      this.#persistSession({ phase: 'REMEDIATION', completed: true, completedAt: this.session.completedAt });
    } else {
      this.#persistSession({ phase: 'PRACTICE', completed: true, completedAt: this.session.completedAt });
    }
    return this.session;
  }

  reset() {
    this.session = null;
  }

  getKnowledgeIds(experiment) {
    return knowledgeIdsOf(experiment);
  }

  #recordEvidence(validation) {
    if (!this.session?.id || !validation) return;
    const knowledgeIds = this.session.knowledgeIds || [];
    if (!knowledgeIds.length) return;

    const diagnosis = diagnoseExperiment({ knowledgeIds, validation });
    this.state.learning ||= {};

    if (this.masteryService) {
      for (const knowledgeId of knowledgeIds) {
        this.masteryService.recordEvidence(knowledgeId, validation.valid ? 1 : 0, 0.2);
      }
      this.state.progress ||= {};
      if (typeof this.masteryService.getState === 'function') {
        this.state.progress.mastery = this.masteryService.getState();
      }
    }

    if (this.session.lessonId) {
      const current = this.learningController?.getLessonState?.(this.session.lessonId)?.diagnosis || {};
      const hasPracticeDiagnosis = (Array.isArray(current.errors) && current.errors.length > 0) || (Array.isArray(current.weakPoints) && current.weakPoints.length > 0);
      if (!hasPracticeDiagnosis) {
        this.learningController?.updateLessonState?.(this.session.lessonId, {
          diagnosis: { ...diagnosis, lessonId: this.session.lessonId },
        });
      }
    }
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
