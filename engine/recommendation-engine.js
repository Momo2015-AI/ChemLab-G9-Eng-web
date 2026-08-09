/**
 * ChemLab V1.5 Recommendation Engine
 * Selects the next task from mastery and task candidates.
 */
export class RecommendationEngine {
  recommend({ knowledge = [], mastery = new Map(), tasks = [] } = {}) {
    const candidates = tasks.filter(task => {
      const targets = task.knowledge || [];
      return targets.some(id => (mastery.get(id) ?? 0) < 0.8) || targets.length === 0;
    });

    if (!candidates.length) return null;

    const target = knowledge.find(id => (mastery.get(id) ?? 0) < 0.8);
    return candidates.find(task => (task.knowledge || []).includes(target)) || candidates[0];
  }
}
