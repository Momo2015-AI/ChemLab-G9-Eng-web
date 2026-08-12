export const lesson01Knowledge = [
  {
    id: 'KN-01-01',
    lessonId: 'L01',
    concept: '物理变化',
    definition: '没有生成其他物质的变化。',
    prerequisites: [],
    representations: ['宏观'],
    skills: ['现象描述', '变化分类'],
    misconceptions: ['状态或形状改变就一定生成新物质'],
    assessmentTargets: ['判断变化是否生成新物质'],
    sourceRefs: ['PEP-G9-C1-T1', 'CURRICULUM-2022-CHEM'],
    status: 'source-checked'
  },
  {
    id: 'KN-01-02',
    lessonId: 'L01',
    concept: '化学变化',
    definition: '生成其他物质的变化。',
    prerequisites: [],
    representations: ['宏观', '证据'],
    skills: ['证据判断', '变化分类'],
    misconceptions: ['有气泡、颜色变化等单一现象就足以证明化学变化'],
    assessmentTargets: ['依据新物质生成判断化学变化'],
    sourceRefs: ['PEP-G9-C1-T1', 'CURRICULUM-2022-CHEM'],
    status: 'source-checked'
  },
  {
    id: 'KN-01-03',
    lessonId: 'L01',
    concept: '物理性质',
    definition: '物质不需要发生化学变化就能表现出来的性质。',
    prerequisites: [],
    representations: ['宏观'],
    skills: ['性质与变化区分'],
    misconceptions: ['性质就是变化过程'],
    assessmentTargets: ['识别物理性质描述'],
    sourceRefs: ['PEP-G9-C1-T1', 'CURRICULUM-2022-CHEM'],
    status: 'source-checked'
  },
  {
    id: 'KN-01-04',
    lessonId: 'L01',
    concept: '化学性质',
    definition: '物质在化学变化中表现出来的性质。',
    prerequisites: ['KN-01-02'],
    representations: ['宏观', '证据'],
    skills: ['性质与变化区分', '反应能力识别'],
    misconceptions: ['“可燃性”本身就是燃烧过程'],
    assessmentTargets: ['区分化学性质与化学变化'],
    sourceRefs: ['PEP-G9-C1-T1', 'CURRICULUM-2022-CHEM'],
    status: 'source-checked'
  },
  {
    id: 'KN-01-05',
    lessonId: 'L01',
    concept: '证据优先的变化判断',
    definition: '观察到的现象是证据，变化类别需要依据是否生成新物质进行解释。',
    prerequisites: ['KN-01-01', 'KN-01-02'],
    representations: ['宏观', '证据'],
    skills: ['证据与结论区分', '科学推理'],
    misconceptions: ['单一现象可以直接等同于结论'],
    assessmentTargets: ['解释为什么单一现象不足以确定变化类别'],
    sourceRefs: ['PEP-G9-C1-T1', 'CURRICULUM-2022-CHEM'],
    status: 'source-checked'
  }
];
