/**
 * ChemLab V1.5 Assessment Engine
 * Converts activity evidence into normalized assessment results.
 */
export class AssessmentEngine {
  evaluate(evidence = {}) {
    const score = Number.isFinite(evidence.score)
      ? Math.max(0, Math.min(1, evidence.score))
      : 0;

    return {
      score,
      passed: score >= (evidence.passThreshold ?? 0.8),
      bloomLevel: evidence.bloomLevel || null,
      knowledge: evidence.knowledge || [],
      mistakeTags: evidence.mistakeTags || []
    };
  }
}
