export const lesson01Transfer = {
  lessonId: 'lesson-01-material-changes-properties',
  status: 'blueprint-v1',
  items: [
    { id:'TR01', target:'AT-03', node:'KN-01-05', context:'two competing explanations for an observed change', demand:'evaluate-evidence' },
    { id:'TR02', target:'AT-01', node:'KN-01-02', context:'unfamiliar everyday process', demand:'classify-and-justify' },
    { id:'TR03', target:'AT-02', node:'KN-01-04', context:'new material-property statement', demand:'property-vs-change' },
    { id:'TR04', target:'AT-03', node:'KN-01-05', context:'design the next observation needed to support a conclusion', demand:'experimental-reasoning' }
  ],
  rules: {
    newContext: true,
    noCopyOfWuhanExamWording: true,
    reasoningRequired: true,
    remediationIfWeak: true
  }
};
export default lesson01Transfer;
