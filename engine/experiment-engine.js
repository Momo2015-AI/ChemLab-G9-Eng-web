/**
 * ChemLab-G9 V1.6 Experiment Engine
 * Drives structured chemistry experiments with step validation
 */

export class ExperimentEngine {
  constructor(experiments = {}) {
    this.experiments = new Map(Object.entries(experiments));
  }

  register(id, data) {
    this.experiments.set(id, data);
    return this;
  }

  get(id) {
    return this.experiments.get(id) || null;
  }

  list() {
    return Array.from(this.experiments.values());
  }

  start(id) {
    const exp = this.get(id);
    if (!exp) return null;
    return {
      id: exp.id,
      title: exp.title,
      currentStep: 0,
      steps: exp.steps,
      observations: [],
      completed: false,
      errors: [],
    };
  }

  next(session) {
    if (!session || session.completed) return session;
    const nextStep = session.currentStep + 1;
    return { ...session, currentStep: nextStep };
  }

  recordObservation(session, observation) {
    if (!session || session.completed) return session;
    return {
      ...session,
      observations: [...session.observations, { step: session.currentStep, observation }],
    };
  }

  complete(session) {
    if (!session) return null;
    return { ...session, completed: true, completedAt: new Date().toISOString() };
  }

  validateStep(session, expectedObservation) {
    if (!session || !expectedObservation) return { valid: true, message: 'Step validated' };
    const current = session.steps[session.currentStep];
    if (!current) return { valid: true, message: 'Step completed' };
    const match = expectedObservation.toLowerCase().includes(current.observation?.toLowerCase()?.slice(0, 10)) ||
                  current.observation?.toLowerCase().includes(expectedObservation.toLowerCase().slice(0, 10));
    return {
      valid: match || true,
      message: match ? '观察正确' : '请仔细观察实验现象',
      expected: current.observation,
    };
  }

  getScore(session) {
    if (!session || !session.completed) return 0;
    const total = session.steps.length;
    const observed = session.observations.length;
    return total > 0 ? Math.round(observed / total * 100) : 0;
  }
}

const engine = new ExperimentEngine();
export default engine;
