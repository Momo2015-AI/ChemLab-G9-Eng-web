/**
 * Compatibility facade for the canonical assessment runtime.
 * New production code must use AssessmentRuntimeController directly.
 */
import { AssessmentRuntimeController } from './assessment-runtime-controller.js';

export class AssessmentController extends AssessmentRuntimeController {
  async start(dayId) {
    return this.startPractice(dayId);
  }

  async startTargeted(knowledgeIds, limit = 5) {
    const session = await this.startRecheck('remediation-recheck', knowledgeIds, limit);
    if (session) session.dayId = 'remediation-recheck';
    return session;
  }

  async startMastery(lessonId) {
    const session = await super.startMastery(lessonId);
    if (session) session.dayId = `mastery:${lessonId}`;
    return session;
  }

  createSession(dayId, questions, mode = 'practice') {
    return this.startAttempt(dayId, questions.map(question => this.normalizeQuestion(question)), mode);
  }
}
