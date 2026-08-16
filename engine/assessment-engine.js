/**
 * ChemLab-G9 Assessment Engine
 * Evaluates answers and returns per-question evidence for diagnosis.
 */

const normalizeText = value => String(value ?? '')
  .replace(/[\s\u3000]/g, '')
  .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
  .toLowerCase();

export class AssessmentEngine {
  evaluate(question, userAnswer) {
    const isCorrect = this.checkAnswer(question, userAnswer);
    return {
      questionId: question.id,
      correct: isCorrect,
      rubricPassed: this.isConstructed(question) ? isCorrect : undefined,
      score: isCorrect ? 1 : 0,
      knowledge: question.knowledge || [],
      bloomLevel: question.bloomLevel,
      explanation: isCorrect ? null : this.explanationFor(question),
      commonMistake: isCorrect ? null : question.commonMistake || null,
    };
  }

  isConstructed(question) {
    return Boolean(question?.type === 'constructed' || question?.type === 'short-answer' || question.rubric);
  }

  explanationFor(question) {
    return question.rubric?.explanation || question.explanation || '';
  }

  checkAnswer(question, answer) {
    if (!question || answer === undefined) return false;
    if (!question.type) question.type = 'choice';
    if (question.type === 'choice') {
      const correct = (question.answer || '').toUpperCase();
      const selected = (answer || '').toString().toUpperCase();
      return selected === correct;
    }
    if (question.type === 'fill' || question.type === 'calculation') {
      const correct = normalizeText(question.answer);
      const selected = normalizeText(answer);
      return correct !== '' && selected === correct;
    }
    if (question.type === 'constructed' || question.type === 'short-answer') {
      return this.checkConstructed(question, answer);
    }
    return false;
  }

  /**
   * Keyword rubric grading for constructed answers.
   * rubric.keywords supports two shapes:
   *   - flat strings: ['新物质', '生成']
   *   - synonym groups (arrays): [['新物质'], ['生成', '产生', '形成']]
   * A group counts as a hit when any synonym appears in the answer, so
   * correct paraphrases are not punished. Passing requires hitting
   * min(2, groupCount) groups.
   */
  checkConstructed(question, answer) {
    const text = String(answer ?? '').trim();
    if (!text) return false;
    const rubric = question.rubric || {};
    const rawKeywords = Array.isArray(rubric.keywords) ? rubric.keywords.filter(Boolean) : [];
    if (rawKeywords.length === 0) {
      return Boolean(rubric.modelAnswer) && text.length >= 4;
    }
    const groups = rawKeywords
      .map(keyword => (Array.isArray(keyword) ? keyword : [keyword]))
      .map(synonyms => synonyms.map(normalizeText).filter(Boolean))
      .filter(synonyms => synonyms.length > 0);
    if (groups.length === 0) return Boolean(rubric.modelAnswer) && text.length >= 4;
    const normalized = normalizeText(text);
    const hits = groups.filter(synonyms => synonyms.some(synonym => normalized.includes(synonym)));
    return hits.length >= Math.min(2, groups.length);
  }
}

export default new AssessmentEngine();
