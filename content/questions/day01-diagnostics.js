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
  },
  {
    id: 'q-acid-dx-004',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'apply',
    knowledge: ['acid-intro'],
    prompt: 'Which procedure is correct when diluting concentrated sulfuric acid in a school laboratory?',
    options: [
      'A. Pour water quickly into concentrated sulfuric acid.',
      'B. Pour concentrated sulfuric acid slowly into water while stirring.',
      'C. Mix equal amounts of acid and water at once.',
      'D. Heat the acid first so it mixes more easily.'
    ],
    answer: 'B',
    explanation: 'Dilution releases heat. The standard school-laboratory procedure is to add concentrated sulfuric acid slowly to water while stirring, using appropriate protective equipment.',
    misconceptionIds: ['mc-acid-dilution-direction'],
    purpose: 'diagnostic',
    status: 'review'
  },
  {
    id: 'q-acid-rx-001',
    type: 'choice',
    difficulty: 'easy',
    bloomLevel: 'understand',
    knowledge: ['acid-intro'],
    prompt: 'A label on a reagent bottle says “HCl(aq)”. Which description is most precise for the material in the bottle?',
    options: [
      'A. Hydrogen chloride gas only.',
      'B. Hydrochloric acid, an aqueous solution containing hydrogen chloride.',
      'C. Solid hydrogen chloride.',
      'D. Pure water with no dissolved solute.'
    ],
    answer: 'B',
    explanation: 'The aqueous-state notation HCl(aq) indicates hydrogen chloride dissolved in water; in school chemistry this solution is called hydrochloric acid.',
    misconceptionIds: ['mc-acid-hcl-solution'],
    purpose: 'recheck',
    recheckFor: 'q-acid-dx-001',
    status: 'review'
  },
  {
    id: 'q-acid-rx-002',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'apply',
    knowledge: ['acid-property'],
    prompt: 'A student compares magnesium, copper, and zinc with dilute hydrochloric acid. Which statement best avoids an overgeneralization?',
    options: [
      'A. All three metals must produce hydrogen because the acid is an acid.',
      'B. The result depends on the metal and the reaction conditions; the metal activity series helps predict common reactions.',
      'C. Only metals containing oxygen can react with acids.',
      'D. No metal can react with hydrochloric acid.'
    ],
    answer: 'B',
    explanation: 'Acid–metal reactions are not an unconditional rule. For common dilute hydrochloric acid, metal activity and conditions matter.',
    misconceptionIds: ['mc-acid-metal-overgeneralization'],
    purpose: 'recheck',
    recheckFor: 'q-acid-dx-002',
    status: 'review'
  },
  {
    id: 'q-acid-rx-003',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'analyze',
    knowledge: ['acid-property'],
    prompt: 'In an experiment, a black solid disappears after dilute acid is added and the solution changes color. Which is an observation rather than an explanation?',
    options: [
      'A. The black solid disappears and the solution changes color.',
      'B. Copper(II) ions are definitely responsible for the color.',
      'C. A new soluble compound must have formed.',
      'D. The acid reacted with the solid according to a chemical equation.'
    ],
    answer: 'A',
    explanation: 'The disappearance of the solid and the visible color change are directly observable. Identifying ions, products, or the reaction equation is an interpretation based on evidence.',
    misconceptionIds: ['mc-acid-observation-inference'],
    purpose: 'recheck',
    recheckFor: 'q-acid-dx-003',
    status: 'review'
  },
  {
    id: 'q-acid-rx-004',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'apply',
    knowledge: ['acid-intro'],
    prompt: 'Which action best follows the same safety principle used when diluting concentrated sulfuric acid?',
    options: [
      'A. Make the mixing sudden so the total time is shorter.',
      'B. Add the concentrated acid gradually to water with stirring and avoid unnecessary splashing.',
      'C. Add water to concentrated acid in one quick stream.',
      'D. Hold the container close to the face to observe the mixture.'
    ],
    answer: 'B',
    explanation: 'The safe procedure controls heat release and reduces the risk of splashing. Concentrated sulfuric acid should be handled only with appropriate laboratory supervision and protective equipment.',
    misconceptionIds: ['mc-acid-dilution-direction'],
    purpose: 'recheck',
    recheckFor: 'q-acid-dx-004',
    status: 'review'
  }
];

export default day01DiagnosticQuestions;
