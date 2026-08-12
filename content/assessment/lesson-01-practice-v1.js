/* ChemLab-G9 Lesson 01 — audit-v2 */
export const lesson01Practice = {
  lessonId: 'lesson-01-material-changes-properties',
  status: 'audit-v2',
  items: [
    { id:'L01-P01', type:'classification', target:'AT-01', knowledgeNode:'KN-01-05', prompt:'判断一种变化是否属于化学变化时，最核心的判断依据是什么？', options:['现象很明显','物质状态改变','有新物质生成','伴随吸热或放热'], answer:'有新物质生成', misconception:'M01-single-phenomenon', remediation:'回到“变化前后物质是否改变”的判断框架。' },
    { id:'L01-P02', type:'classification', target:'AT-02', knowledgeNode:'KN-01-04', prompt:'“铁在潮湿空气中容易生锈”属于物质的哪一类性质？', options:['物理性质','化学性质','物理变化','化学变化'], answer:'化学性质', misconception:'M02-property-vs-change', remediation:'区分性质描述的特征/倾向与已经发生的变化。' },
    { id:'L01-P03', type:'evidence-reasoning', target:'AT-03', knowledgeNode:'KN-01-05', prompt:'某无色液体加热后出现气泡。仅凭这个现象，能否确定发生了化学变化？', answer:'不能。气泡是观察现象，不能单独证明生成了新物质。', misconception:'M01-single-phenomenon', remediation:'区分观察现象与支持结论的证据。' },
    { id:'L01-P04', type:'transfer', target:'AT-01', knowledgeNode:'KN-01-01', prompt:'冰融化成水，再把水冷冻成冰。如何判断这一过程属于哪类变化？', answer:'物理变化；变化前后仍为水，没有生成新物质。', misconception:'M03-state-change-means-new-substance', remediation:'优先检查变化前后是否生成不同物质。' },
    { id:'L01-P05', type:'transfer', target:'AT-01', knowledgeNode:'KN-01-05', prompt:'食物放置一段时间后出现明显异味。仅凭“出现异味”能否确定发生了化学变化？', answer:'不能。异味是线索，需要进一步证据判断是否生成新物质。', misconception:'M01-single-phenomenon', remediation:'区分线索与充分依据。' },
    { id:'L01-P06', type:'metacognitive', target:'AT-03', knowledgeNode:'KN-01-05', prompt:'把“看到现象→直接下结论”改写成更可靠的化学探究步骤。', answer:'观察→记录证据→提出判断→寻找支持或排除其他解释的证据→形成结论。', misconception:'M04-observation-inference-collapse', remediation:'使用“观察—证据—解释”记录模板。' },
    { id:'L01-P07', type:'classification', target:'AT-01', knowledgeNode:'KN-01-02', prompt:'蜡烛燃烧时出现火焰、发光并放热。判断其为化学变化时，哪项理由最可靠？', options:['发光了','放热了','出现火焰了','燃烧过程中生成了新的物质'], answer:'燃烧过程中生成了新的物质', misconception:'M01-single-phenomenon', remediation:'发光、放热可作线索，核心仍是是否生成新物质。' },
    { id:'L01-P08', type:'classification', target:'AT-02', knowledgeNode:'KN-01-03', prompt:'“氧气是一种无色、无味的气体”属于哪一类描述？', options:['物理性质','化学性质','物理变化','化学变化'], answer:'物理性质', misconception:'M02-property-vs-change', remediation:'颜色、状态、气味等不需要发生化学反应即可观察，属于物理性质。' }
  ]
};
export default lesson01Practice;
