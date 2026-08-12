/**
 * V2.1 question contract.
 * Questions should be original/teacher-authored and linked to canonical knowledge IDs.
 */
export const questionSchemaV2 = {
  required: [
    'id', 'type', 'stem', 'answer', 'explanation',
    'knowledgeIds', 'difficulty', 'cognitiveLevel'
  ],
  optional: [
    'options', 'experimentIds', 'prerequisiteIds',
    'misconceptionIds', 'remediation', 'tags', 'source'
  ],
  difficulty: ['basic', 'standard', 'challenge'],
  cognitiveLevel: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
  types: ['single-choice', 'multiple-choice', 'fill-blank', 'short-answer', 'equation', 'calculation', 'experiment', 'comprehensive']
};

export default questionSchemaV2;
