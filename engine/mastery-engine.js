/**
 * ChemLab V1.5 Mastery Engine
 * Keeps a bounded mastery estimate and records evidence from activities.
 */
export class MasteryEngine {
  constructor({ initial = 0 } = {}) {
    this.mastery = new Map();
    this.initial = Math.max(0, Math.min(1, initial));
  }

  get(knowledgeId) {
    return this.mastery.get(knowledgeId) ?? this.initial;
  }

  update(knowledgeId, evidence = {}) {
    const previous = this.get(knowledgeId);
    const score = Number.isFinite(evidence.score) ? Math.max(0, Math.min(1, evidence.score)) : previous;
    const weight = Number.isFinite(evidence.weight) ? Math.max(0, Math.min(1, evidence.weight)) : 0.25;
    const next = previous + (score - previous) * weight;
    this.mastery.set(knowledgeId, next);
    return next;
  }
}
