/**
 * Lesson 02 — 化学是一门以实验为基础的科学
 * Status: IN_REVIEW
 * Source boundary: PEP Grade 9 Chemistry, Unit 1 / Topic 2.
 * This file contains original instructional wording, not textbook reproduction.
 */
export const lesson02 = {
  id: 'lesson-02-chemistry-as-experimental-science',
  title: '化学是一门以实验为基础的科学',
  unitId: 'u01',
  term: 'g9-s1',
  sequenceNumber: 2,
  status: 'IN_REVIEW',
  learningObjectives: [
    '能从实验目的出发提出可观察、可比较的问题。',
    '能区分实验现象、解释和结论，并用证据支持判断。',
    '能描述科学探究的一般过程：提出问题、猜想与假设、制定计划、实验与观察、分析证据、得出结论、反思交流。',
    '能根据变量控制和公平比较的原则设计简单、适龄、安全的探究方案。',
    '能用实验数据或观察证据解释结论，并识别证据不足的推断。'
  ],
  knowledgePoints: [
    'KN-02-01 科学探究的一般过程',
    'KN-02-02 实验现象与结论',
    'KN-02-03 变量与公平比较',
    'KN-02-04 证据、解释与反思',
    'KN-02-05 实验记录与数据表达'
  ],
  assessmentTargets: [
    'AT-02-01 探究流程排序与目的识别',
    'AT-02-02 现象—证据—结论区分',
    'AT-02-03 控制变量与方案评价',
    'AT-02-04 基于证据作出解释'
  ],
  misconceptions: [
    'M02-01 认为实验就是验证课本结论，不需要提出问题',
    'M02-02 把观察到的现象直接当作结论',
    'M02-03 比较两组实验时忽略无关变量',
    'M02-04 认为一次观察就足以证明普遍规律',
    'M02-05 只记录“成功结果”，忽略异常与不确定性'
  ],
  sequence: [
    { type: 'phenomenon', id: 'L02-P01', prompt: '同样的问题，为什么要设计“可比较”的实验？', content: '从两个条件不同的观察案例入手，发现如果一次改变多个因素，就很难知道结果究竟由什么造成。' },
    { type: 'question', id: 'L02-Q01', prompt: '一个好的化学实验首先要回答什么？', content: '明确问题、对象、可观察结果和比较条件。' },
    { type: 'model', id: 'L02-M01', prompt: '把探究过程变成一条证据链', content: '问题 → 假设 → 方案 → 观察/数据 → 证据分析 → 结论 → 反思交流。' },
    { type: 'experiment', id: 'L02-E01', experimentId: 'exp-acid-iron', prompt: '比较不同条件下的实验现象（教师演示/安全模拟）', content: '学生先预测并确定观察指标，再比较教师提供的实验记录，避免自行操作未知或危险材料。' },
    { type: 'representation', id: 'L02-R01', prompt: '现象、证据、解释、结论四格记录', content: '现象：看到了什么；证据：哪些观察/数据支持判断；解释：如何联系已有知识；结论：在本实验条件下可以得到什么。' },
    { type: 'practice', id: 'L02-PR01', questionIds: ['L02-PRACTICE-01', 'L02-PRACTICE-02', 'L02-PRACTICE-03'] },
    { type: 'reflection', id: 'L02-RF01', prompt: '如果结果与预测不同怎么办？', content: '不修改记录迎合预测；检查条件、操作、测量与假设，说明不确定性，并提出下一步验证方案。' },
    { type: 'transfer', id: 'L02-TR01', prompt: '评价一个“看起来很科学”的实验方案', content: '检查是否只有一个主要变量改变、是否有可比较的对照、是否有明确观察指标、是否能由证据支持结论。' }
  ],
  mastery: {
    targetAccuracy: 0.95,
    unseenItemCount: 20,
    threshold: 19,
    criticalMisconceptionBlock: true,
    transferGate: true
  },
  sourceNotes: [
    'PEP Grade 9 Chemistry textbook: Unit 1 / Topic 2, used as curriculum boundary and concept source.',
    'PEP Teacher’s Book: use for teaching intent, experiment emphasis and common misconceptions; exact edition to be verified against project source record.',
    'Wuhan examination papers: calibration only for competency and item demand; no copyrighted wording is reproduced.'
  ]
};

export default lesson02;
