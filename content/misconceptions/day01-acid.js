export const day01AcidMisconceptions = [
  {
    id: 'mc-acid-hcl-solution',
    title: 'Confusing hydrogen chloride with hydrochloric acid',
    description: 'The learner treats HCl and hydrochloric acid as interchangeable names in every context, rather than recognizing hydrochloric acid as an aqueous solution of hydrogen chloride.',
    knowledgeIds: ['acid-intro'],
    signals: ['concept-confusion'],
    questionIds: ['q-acid-001'],
    experimentIds: ['exp-hcl-fe'],
    severity: 'medium',
    source: 'Day 01 benchmark content review',
    remediation: {
      goal: 'Distinguish a substance formula from the name of its aqueous solution and use both terms precisely.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-001'],
      recheckQuestionIds: ['q-acid-006']
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
      recheckQuestionIds: ['q-acid-004']
    }
  },
  {
    id: 'mc-acid-metal-overgeneralization',
    title: 'Overgeneralizing acid–metal reactions',
    description: 'The learner applies the rule “acid + metal always produces hydrogen” without considering the metal, acid, and reaction conditions.',
    knowledgeIds: ['acid-intro'],
    signals: ['concept-confusion', 'reasoning-gap'],
    questionIds: ['q-acid-006'],
    experimentIds: ['exp-hcl-fe'],
    severity: 'medium',
    source: 'Day 01 benchmark scientific review',
    remediation: {
      goal: 'Treat acid–metal reactions as condition-dependent and avoid unsupported universal statements.',
      lessonIds: ['day-01'],
      practiceQuestionIds: ['q-acid-006'],
      recheckQuestionIds: ['q-acid-001']
    }
  }
];

export default day01AcidMisconceptions;
