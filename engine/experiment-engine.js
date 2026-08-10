/**
 * ChemLab-G9 V1.6 Experiment Engine
 * Drives structured chemistry experiments with step validation.
 */

export class ExperimentEngine {
  constructor(experiments = {}) { this.experiments = new Map(Object.entries(experiments)); }
  register(id, data) { this.experiments.set(id, data); return this; }
  get(id) { return this.experiments.get(id) || null; }
  list() { return Array.from(this.experiments.values()); }

  start(id) {
    const exp = this.get(id);
    if (!exp) return null;
    return { id: exp.id, title: exp.title, currentStep: 0, steps: exp.steps || [], observations: [], completed: false, errors: [] };
  }

  next(session) {
    if (!session || session.completed) return session;
    const nextStep = Math.min(session.currentStep + 1, Math.max(session.steps.length - 1, 0));
    return { ...session, currentStep: nextStep };
  }

  recordObservation(session, observation) {
    if (!session || session.completed) return session;
    return { ...session, observations: [...session.observations, { step: session.currentStep, observation: String(observation ?? '') }] };
  }

  complete(session) {
    if (!session) return null;
    return { ...session, completed: true, completedAt: new Date().toISOString() };
  }

  validateStep(session, expectedObservation) {
    if (!session || !expectedObservation) return { valid: true, message: 'Step validated' };
    const current = session.steps[session.currentStep];
    if (!current) return { valid: true, message: 'Step completed' };
    const expected = String(current.observation || '').trim().toLowerCase();
    const actual = String(expectedObservation || '').trim().toLowerCase();
    if (!expected || !actual) return { valid: false, message: '请记录你观察到的实验现象', expected: current.observation };
    const sample = expected.slice(0, Math.min(10, expected.length));
    const match = actual.includes(sample) || expected.includes(actual.slice(0, Math.min(10, actual.length)));
    return { valid: match, message: match ? '观察记录与预期现象一致' : '请仔细观察并重新记录实验现象', expected: current.observation };
  }

  getScore(session) {
    if (!session || !session.completed) return 0;
    const total = session.steps.length;
    const observed = new Set(session.observations.map(o => o.step)).size;
    return total > 0 ? Math.round(observed / total * 100) : 0;
  }
}

const engine = new ExperimentEngine();
export default engine;
