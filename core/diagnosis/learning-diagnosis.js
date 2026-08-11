/**
 * V1.7 diagnosis compatibility adapter.
 *
 * Keeps the historical learning-facing API while delegating all diagnosis
 * policy to the canonical diagnosis engine.
 */
import { diagnoseAssessment, diagnoseExperiment } from './diagnosis-engine.js';

export { diagnoseAssessment, diagnoseExperiment };
