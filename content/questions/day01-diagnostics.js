export const day01DiagnosticQuestions = [
  {
    id: 'q-acid-dx-001',
    type: 'choice',
    difficulty: 'easy',
    bloomLevel: 'understand',
    knowledge: ['acid-intro'],
    prompt: 'Which statement uses the terms hydrogen chloride (HCl) and hydrochloric acid correctly?',
    options: [
      'A. HCl is the formula for hydrochloric acid in every context.',
      'B. Hydrochloric acid is an aqueous solution of hydrogen chloride.',
      'C. Hydrogen chloride and hydrochloric acid are always different substances.',
      'D. Hydrochloric acid is solid HCl.'
    ],
    answer: 'B',
    explanation: 'HCl is hydrogen chloride. Hydrochloric acid refers to hydrogen chloride dissolved in water.',
    misconceptionIds: ['mc-acid-hcl-solution'],
    purpose: 'diagnostic',
    status: 'review'
  },
  {
    id: 'q-acid-dx-002',
    type: 'choice',
    difficulty: 'easy',
    bloomLevel: 'understand',
    knowledge: ['acid-property'],
    prompt: 'A student says, “Every acid reacts with every metal to produce hydrogen.” Which response is best?',
    options: [
      'A. The statement is always true.',
      'B. The statement is false because acid–metal reactions depend on the metal and conditions.',
      'C. The statement is true only for acids containing oxygen.',
      'D. The statement is true only when the solution is blue.'
    ],
    answer: 'B',
    explanation: 'A universal rule is not valid. For common dilute non-oxidizing acids taught at this level, metals above hydrogen in the activity series can react to release hydrogen, while metals below hydrogen generally do not.',
    misconceptionIds: ['mc-acid-metal-overgeneralization'],
    purpose: 'diagnostic',
    status: 'review'
  },
  {
    id: 'q-acid-dx-003',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'analyze',
    knowledge: ['acid-property'],
    prompt: 'During rust removal, a student writes “the solution contains FeCl3” as an observation. What is the problem with this statement?',
    options: [
      'A. It reports an interpretation as though it were directly observed.',
      'B. It is impossible for iron oxide to react with an acid.',
      'C. FeCl3 can never form in water.',
      'D. Rust is not a chemical substance.'
    ],
    answer: 'A',
    explanation: 'A color change or disappearance of rust can be observed directly. Identifying a product such as FeCl3 is an interpretation based on chemical knowledge and evidence, not a direct visual observation.',
    misconceptionIds: ['mc-acid-observation-inference'],
    purpose: 'diagnostic',
    status: 'review'
  }
];

export default day01DiagnosticQuestions;
