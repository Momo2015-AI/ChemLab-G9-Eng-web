export const lesson01UnseenMastery = {
  lessonId: 'lesson-01-material-changes-properties',
  status: 'blueprint-v1',
  targetAccuracy: 0.95,
  totalItems: 20,
  blueprint: [
    { id:'UM01', node:'KN-01-01', target:'AT-01', demand:'apply', context:'state change', misconception:'M03' },
    { id:'UM02', node:'KN-01-01', target:'AT-01', demand:'explain', context:'separation/physical process', misconception:'M03' },
    { id:'UM03', node:'KN-01-02', target:'AT-01', demand:'apply', context:'combustion', misconception:'M01' },
    { id:'UM04', node:'KN-01-02', target:'AT-01', demand:'evidence', context:'reaction observation', misconception:'M01' },
    { id:'UM05', node:'KN-01-03', target:'AT-02', demand:'classify', context:'observable property', misconception:'M02' },
    { id:'UM06', node:'KN-01-03', target:'AT-02', demand:'apply', context:'material selection', misconception:'M02' },
    { id:'UM07', node:'KN-01-04', target:'AT-02', demand:'classify', context:'reactivity', misconception:'M02' },
    { id:'UM08', node:'KN-01-04', target:'AT-02', demand:'apply', context:'safe material use', misconception:'M02' },
    { id:'UM09', node:'KN-01-05', target:'AT-03', demand:'evidence', context:'gas/temperature/precipitate', misconception:'M01' },
    { id:'UM10', node:'KN-01-05', target:'AT-03', demand:'reason', context:'competing explanations', misconception:'M04' },
    { id:'UM11', node:'KN-01-01', target:'AT-01', demand:'transfer', context:'phase change', misconception:'M03' },
    { id:'UM12', node:'KN-01-02', target:'AT-01', demand:'transfer', context:'food/material change', misconception:'M01' },
    { id:'UM13', node:'KN-01-03', target:'AT-02', demand:'transfer', context:'material identification', misconception:'M02' },
    { id:'UM14', node:'KN-01-04', target:'AT-02', demand:'transfer', context:'reactivity prediction', misconception:'M02' },
    { id:'UM15', node:'KN-01-05', target:'AT-03', demand:'reason', context:'insufficient evidence', misconception:'M01' },
    { id:'UM16', node:'KN-01-05', target:'AT-03', demand:'reason', context:'observation vs inference', misconception:'M04' },
    { id:'UM17', node:'KN-01-01', target:'AT-01', demand:'mixed', context:'unfamiliar physical process', misconception:'M03' },
    { id:'UM18', node:'KN-01-02', target:'AT-01', demand:'mixed', context:'unfamiliar chemical process', misconception:'M01' },
    { id:'UM19', node:'KN-01-04', target:'AT-02', demand:'mixed', context:'property statement', misconception:'M02' },
    { id:'UM20', node:'KN-01-05', target:'AT-03', demand:'mixed', context:'evidence-based conclusion', misconception:'M04' }
  ],
  rules: {
    unseen: true,
    noNearDuplicateTrainingItems: true,
    allCoreObjectivesSampled: true,
    criticalMisconceptionsSampled: true,
    masteryThreshold: '19/20',
    retestIfBelowThreshold: true
  }
};
export default lesson01UnseenMastery;
