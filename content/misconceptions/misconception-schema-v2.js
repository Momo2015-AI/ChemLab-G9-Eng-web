/**
 * Misconception model used by diagnosis and remediation.
 */
export const misconceptionSchemaV2 = {
  required: ['id', 'title', 'description', 'knowledgeIds', 'signals', 'remediation'],
  optional: ['questionIds', 'experimentIds', 'severity', 'source'],
  severity: ['low', 'medium', 'high'],
  signals: ['concept-confusion', 'condition-omission', 'phenomenon-misread', 'equation-error', 'calculation-error', 'reasoning-gap'],
  remediation: {
    required: ['goal', 'lessonIds', 'practiceQuestionIds', 'recheckQuestionIds']
  }
};

export default misconceptionSchemaV2;
