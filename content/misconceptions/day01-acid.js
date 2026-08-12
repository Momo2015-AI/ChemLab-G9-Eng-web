export const day01AcidMisconceptions = [
  {
    id: 'mc-acid-hcl-solution',
    title: 'Confusing hydrogen chloride with hydrochloric acid',
    description: 'The learner treats HCl and hydrochloric acid as interchangeable names in every context, rather than recognizing hydrochloric acid as an aqueous solution of hydrogen chloride.',
    knowledgeIds: ['acid-intro'],
    signals: ['concept-confusion'],
    questionIds: ['q-acid-001', 'q-acid-dx-001'],
    experimentIds: [],
    severity: 'medium',
    source: 'Day 01 benchmark content review',
    remediation: {
      goal: 'Distinguish a substance formula from the name of its aqueous solution and use both terms precisely.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-001'],
      recheckQuestionIds: ['q-acid-dx-001']
    }
  },
  {
    id: 'mc-acid-dilution-direction',
    title: 'Reversing the direction of concentrated sulfuric acid dilution',
    description: 'The learner remembers that dilution requires water and acid but reverses the safe addition direction.',
    knowledgeIds: ['acid-intro'],
    signals: ['condition-omission', 'reasoning-gap'],
    questionIds: ['q-acid-003', 'q-acid-004'],
    experimentIds: [],
    severity: 'high',
    source: 'Day 01 benchmark safety review',
    remediation: {
      goal: 'Recall and explain the safe dilution procedure and the reason for slow addition and stirring.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-003'],
      recheckQuestionIds: ['q-acid-003']
    }
  },
  {
    id: 'mc-acid-metal-overgeneralization',
    title: 'Overgeneralizing acid–metal reactions',
    description: 'The learner applies the rule “acid + metal always produces hydrogen” without considering the metal, acid, and reaction conditions.',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['concept-confusion', 'reasoning-gap'],
    questionIds: ['q-acid-007', 'q-acid-dx-002'],
    experimentIds: ['exp-acid-rust'],
    severity: 'medium',
    source: 'Day 01 benchmark scientific review',
    remediation: {
      goal: 'Treat acid–metal reactions as condition-dependent and avoid unsupported universal statements.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-002'],
      recheckQuestionIds: ['q-acid-007']
    }
  },
  {
    id: 'mc-acid-observation-inference',
    title: 'Treating an observation as a conclusion',
    description: 'The learner reports an interpretation as though it were directly observed, instead of separating observation, explanation, and conclusion.',
    knowledgeIds: ['acid-property'],
    signals: ['observation-inference-confusion', 'reasoning-gap'],
    questionIds: ['q-acid-dx-003'],
    experimentIds: ['exp-acid-rust'],
    severity: 'medium',
    source: 'Day 01 benchmark experiment review',
    remediation: {
      goal: 'Separate what is directly observed from the chemical explanation and the conclusion supported by evidence.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-003'],
      recheckQuestionIds: ['q-acid-dx-003']
    }
  }
];

export default day01AcidMisconceptions;
