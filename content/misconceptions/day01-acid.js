export const day01AcidMisconceptions = [
  {
    id: 'mc-acid-hcl-solution',
    title: 'Confusing hydrogen chloride with hydrochloric acid',
    description: 'The learner treats HCl and hydrochloric acid as interchangeable names in every context, rather than recognizing hydrochloric acid as an aqueous solution of hydrogen chloride.',
    knowledgeIds: ['acid-intro'],
    signals: ['concept-confusion'],
    questionIds: ['q-acid-dx-001', 'q-acid-rx-001'],
    experimentIds: [],
    severity: 'medium',
    source: 'Day 01 benchmark content review',
    remediation: {
      goal: 'Distinguish hydrogen chloride from hydrochloric acid and use the formula, state, and name precisely.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-001'],
      recheckQuestionIds: ['q-acid-rx-001']
    }
  },
  {
    id: 'mc-acid-dilution-direction',
    title: 'Reversing the direction of concentrated sulfuric acid dilution',
    description: 'The learner remembers that dilution requires water and acid but reverses the safe addition direction or ignores controlled mixing.',
    knowledgeIds: ['acid-intro'],
    signals: ['condition-omission', 'reasoning-gap'],
    questionIds: ['q-acid-003', 'q-acid-dx-004', 'q-acid-rx-004'],
    experimentIds: [],
    severity: 'high',
    source: 'Day 01 benchmark safety review',
    remediation: {
      goal: 'Recall and explain the safe dilution procedure: add concentrated acid slowly to water with stirring and appropriate protection.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-004'],
      recheckQuestionIds: ['q-acid-rx-004']
    }
  },
  {
    id: 'mc-acid-metal-overgeneralization',
    title: 'Overgeneralizing acid–metal reactions',
    description: 'The learner applies the rule “acid + metal always produces hydrogen” without considering the metal, acid, and reaction conditions.',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['concept-confusion', 'reasoning-gap'],
    questionIds: ['q-acid-dx-002', 'q-acid-rx-002'],
    experimentIds: ['exp-acid-rust'],
    severity: 'medium',
    source: 'Day 01 benchmark scientific review',
    remediation: {
      goal: 'Treat acid–metal reactions as condition-dependent and use the metal activity series appropriately for common school-level cases.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-002'],
      recheckQuestionIds: ['q-acid-rx-002']
    }
  },
  {
    id: 'mc-acid-observation-inference',
    title: 'Treating an observation as a conclusion',
    description: 'The learner reports an interpretation as though it were directly observed, instead of separating observation, explanation, and conclusion.',
    knowledgeIds: ['acid-property'],
    signals: ['observation-inference-confusion', 'reasoning-gap'],
    questionIds: ['q-acid-dx-003', 'q-acid-rx-003'],
    experimentIds: ['exp-acid-rust'],
    severity: 'medium',
    source: 'Day 01 benchmark experiment review',
    remediation: {
      goal: 'Separate directly observable evidence from chemical interpretation and conclusions supported by that evidence.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-dx-003'],
      recheckQuestionIds: ['q-acid-rx-003']
    }
  }
];

export default day01AcidMisconceptions;
