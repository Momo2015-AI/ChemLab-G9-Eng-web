/*
 * ChemLab-G9 — Lesson 01 original practice set
 * Topic: 物质的变化和性质
 * Status: draft / audit pending
 * Source rule: derived from approved knowledge nodes and assessment targets.
 * Wuhan examination materials are used only for competency calibration; no exam wording is copied.
 */

export const lesson01Practice = {
  lessonId: 'lesson-01-material-changes-properties',
  status: 'draft',
  items: [
    {
      id: 'L01-P01',
      type: 'classification',
      target: 'AT-01',
      prompt: '下列现象中，判断其属于化学变化时，最关键的依据是什么？',
      options: [
        '现象看起来很明显',
        '物质的状态发生了改变',
        '有新物质生成',
        '反应过程中伴随吸热或放热'
      ],
      answer: '有新物质生成',
      misconception: '把明显现象或能量变化直接当作化学变化的充分条件',
      remediation: '回到“观察证据→判断是否生成新物质”的两步判断框架。'
    },
    {
      id: 'L01-P02',
      type: 'classification',
      target: 'AT-02',
      prompt: '“铁在潮湿空气中容易生锈”属于物质的哪一类性质？',
      options: ['物理性质', '化学性质', '物理变化', '化学变化'],
      answer: '化学性质',
      misconception: '把“容易……”描述误认为变化本身',
      remediation: '强调：性质是物质表现出的倾向或特征，变化是已经发生的过程。'
    },
    {
      id: 'L01-P03',
      type: 'evidence-reasoning',
      target: 'AT-03',
      prompt: '某同学观察到一杯无色液体加热后出现气泡，于是断定“发生了化学变化”。这个结论是否充分？为什么？',
      answer: '不充分。气泡本身只能作为观察现象，不能单独证明生成了新物质；还需要进一步证据判断。',
      misconception: '把单一现象直接等同于新物质生成',
      remediation: '要求学生补充“什么证据能够支持新物质生成”的问题。'
    },
    {
      id: 'L01-P04',
      type: 'transfer',
      target: 'AT-04',
      prompt: '把一块冰融化成水，再把水冷冻成冰。请判断变化类型，并说明你的判断依据。',
      answer: '物理变化；变化前后仍是同一种物质水，状态发生改变但没有生成新物质。',
      misconception: '把状态变化当作新物质生成',
      remediation: '使用“变化前后物质是否相同”的检查问题。'
    },
    {
      id: 'L01-P05',
      type: 'transfer',
      target: 'AT-01',
      prompt: '厨房中食物放置一段时间后出现明显异味。仅凭“出现异味”能否确定发生了化学变化？',
      answer: '不能仅凭这一现象确定。异味提示可能发生了物质变化，但需要进一步证据判断是否生成了新物质。',
      misconception: '把“有气味”当作化学变化的充分证据',
      remediation: '回到证据链，并区分“线索”和“充分依据”。'
    },
    {
      id: 'L01-P06',
      type: 'metacognitive',
      target: 'AT-03',
      prompt: '请把“看到现象→下结论”改写成一个更可靠的化学探究步骤。',
      answer: '观察现象→记录证据→提出判断→寻找支持或排除其他解释的证据→形成结论。',
      misconception: '缺少证据验证环节',
      remediation: '使用 ChemLab 的“观察—证据—解释”三栏记录模板。'
    }
  ]
};

export default lesson01Practice;
