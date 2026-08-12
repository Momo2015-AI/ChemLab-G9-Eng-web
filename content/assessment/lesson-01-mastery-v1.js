export const lesson01Mastery = {
  lessonId: 'lesson-01-material-changes-properties',
  standard: '95-percent-mastery',
  version: '1.0.0',
  sets: {
    training: {
      purpose: 'guided-practice',
      itemCount: 8,
      rule: 'feedback may be immediate; items must not be reused as final mastery evidence'
    },
    diagnostic: {
      purpose: 'misconception-detection',
      itemCount: 6,
      coverage: ['KN-01-01','KN-01-02','KN-01-03','KN-01-04','KN-01-05'],
      rule: 'wrong answers map to a specific misconception or knowledge node'
    },
    remediation: {
      purpose: 'targeted-reteach-and-practice',
      rule: 'select only the failed concept pathway; generate equivalent but non-duplicated practice'
    },
    unseenMastery: {
      purpose: 'mastery-decision',
      itemCount: 20,
      threshold: 0.95,
      rule: 'items are unseen and independently audited; no near-duplicate training items'
    },
    transfer: {
      purpose: 'novel-context-transfer',
      itemCount: 4,
      rule: 'new wording, context, or evidence pattern; tests reasoning rather than recall'
    }
  },
  masteryDecision: {
    minimumAccuracy: 0.95,
    criticalMisconceptionsMustBeResolved: true,
    allCoreObjectivesMustBeSampled: true,
    completionIsNotMastery: true
  }
};
