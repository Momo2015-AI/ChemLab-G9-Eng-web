/**
 * Lesson 02 — 化学是一门以实验为基础的科学
 * Status: IN_REVIEW
 * Source boundary: PEP Grade 9 Chemistry, Unit 1 / Topic 2.
 * Original instructional wording; no textbook passage reproduced.
 */
export const lesson02 = {
  id: 'lesson-02-chemistry-as-experimental-science', title: '化学是一门以实验为基础的科学', unitId: 'u01', term: 'g9-s1', sequenceNumber: 2, status: 'IN_REVIEW',
  learningObjectives: [
    '能从实验目的出发提出可观察、可比较的问题。','能区分实验现象、解释和结论，并用证据支持判断。','能描述科学探究的一般过程并说明各环节的作用。','能根据变量控制和公平比较原则评价简单探究方案。','能用观察或数据证据解释结论，并识别证据不足的推断。'
  ],
  knowledgePoints: ['KN-02-01 科学探究的一般过程','KN-02-02 实验现象与结论','KN-02-03 变量与公平比较','KN-02-04 证据、解释与反思','KN-02-05 实验记录与数据表达'],
  assessmentTargets: ['AT-02-01 探究流程排序与目的识别','AT-02-02 现象—证据—结论区分','AT-02-03 控制变量与方案评价','AT-02-04 基于证据作出解释'],
  misconceptions: ['M02-01 认为实验只是验证既有结论','M02-02 把现象直接当成结论','M02-03 比较时忽略无关变量','M02-04 用一次观察宣称普遍规律','M02-05 只记录符合预测的结果'],
  sequence: [
    {type:'phenomenon',id:'L02-P01',prompt:'为什么实验必须“可比较”？',content:'通过两个条件同时改变的观察案例，发现无法判断结果由哪个因素造成。'},
    {type:'question',id:'L02-Q01',prompt:'一个好的化学实验首先要回答什么？',content:'明确问题、对象、观察指标和比较条件。'},
    {type:'model',id:'L02-M01',prompt:'建立证据链',content:'问题 → 假设 → 方案 → 观察/数据 → 证据分析 → 结论 → 反思交流。'},
    {type:'experiment',id:'L02-E01',prompt:'蜡烛燃烧的观察探究（教师演示/数字化观察）',content:'学生先提出观察问题，再记录火焰、状态变化及其他可观察证据；课程重点放在“观察—证据—解释”而非背诵现象。'},
    {type:'experiment',id:'L02-E02',prompt:'吸入空气与呼出气体的比较（教师提供安全演示记录）',content:'比较预先提供的观察/检测记录，训练公平比较、证据解释和结论边界。'},
    {type:'representation',id:'L02-R01',prompt:'现象—证据—解释—结论四格记录',content:'现象是直接观察；证据是支持判断的观察或数据；解释连接证据与已有知识；结论限定在实验条件和证据范围内。'},
    {type:'practice',id:'L02-PR01',questionIds:['L02-PRACTICE-01','L02-PRACTICE-02','L02-PRACTICE-03']},
    {type:'reflection',id:'L02-RF01',prompt:'如果结果与预测不同怎么办？',content:'保留真实记录，检查条件、操作、测量和假设，说明不确定性并提出下一步验证方案。'},
    {type:'transfer',id:'L02-TR01',prompt:'评价一个看起来很科学的实验方案',content:'检查是否只有主要变量改变、是否有合理对照、是否有明确观察指标，以及证据是否足以支持结论。'}
  ],
  mastery:{targetAccuracy:0.95,unseenItemCount:20,threshold:19,criticalMisconceptionBlock:true,transferGate:true},
  sourceNotes:['人教版九年级化学上册 Unit 1 / 课题2：化学是一门以实验为基础的科学；用于课程边界和概念范围。','《教师教学用书》：用于教学意图、实验重点和常见误区；具体版本需在来源台账中核验。','武汉中考真题：仅用于能力与题型需求校准，不复制原题表述。']
};
export default lesson02;
