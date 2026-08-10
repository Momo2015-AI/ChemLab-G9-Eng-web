/**
 * ChemLab-G9 V1.6 Assessment Engine
 * Evaluates answers, computes scores, tracks mistakes
 */

export class AssessmentEngine {
  constructor() {
    this.mistakes = new Map();
  }

  evaluate(question, userAnswer) {
    const isCorrect = this.checkAnswer(question, userAnswer);
    const result = {
      questionId: question.id,
      correct: isCorrect,
      score: isCorrect ? 1 : 0,
      knowledge: question.knowledge || [],
      bloomLevel: question.bloomLevel,
      explanation: isCorrect ? null : question.explanation || '',
      commonMistake: isCorrect ? null : question.commonMistake || null,
    };

    if (!isCorrect) {
      const key = question.id;
      if (!this.mistakes.has(key)) {
        this.mistakes.set(key, { count: 0, knowledge: result.knowledge, mistake: result.commonMistake });
      }
      const m = this.mistakes.get(key);
      m.count++;
    }

    return result;
  }

  checkAnswer(question, answer) {
    if (!question || answer === undefined) return false;
    if (question.type === 'choice') {
      const correct = (question.answer || '').toUpperCase();
      const selected = (answer || '').toString().toUpperCase();
      return selected === correct;
    }
    if (question.type === 'fill' || question.type === 'calculation') {
      const correct = (question.answer || '').trim().toLowerCase();
      const selected = (answer || '').toString().trim().toLowerCase();
      return correct !== '' && selected === correct;
    }
    return false;
  }

  computeQuizScore(results) {
    if (!results || results.length === 0) return 0;
    const correct = results.filter(r => r.correct).length;
    return Math.round(correct / results.length * 100);
  }

  getMistakeSummary() {
    const summary = {};
    for (const [qid, m] of this.mistakes) {
      for (const k of m.knowledge) {
        if (!summary[k]) summary[k] = { count: 0, questions: [] };
        summary[k].count += m.count;
        summary[k].questions.push(qid);
      }
    }
    return summary;
  }

  getWeakKnowledge(threshold = 0.5) {
    return Object.entries(this.getMistakeSummary())
      .filter(([, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count);
  }
}

export default new AssessmentEngine();
