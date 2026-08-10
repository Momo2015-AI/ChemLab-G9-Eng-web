window.ChemLabQuizS2 = window.ChemLabQuizS2 || {};
window.ChemLabQuizS2["day-03"] = {
  questions: [
    {
      prompt: "下列金属活动性顺序中，排列正确的是（ ）。",
      options: [
        "K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au",
        "K Na Ca Mg Al Zn Fe Sn Pb (H) Cu Ag Hg Pt Au",
        "K Ca Na Mg Zn Al Fe Sn Pb (H) Cu Hg Ag Pt Au",
        "K Ca Na Mg Al Fe Zn Sn Pb (H) Cu Hg Ag Pt Au"
      ],
      answer: "0",
      difficulty: "基础",
      topic: "金属活动性顺序记忆",
      knowledgeIds: ["V2-K107"],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      explanation: "正确顺序：K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au。注意 Na 在 Ca 后、Fe 在 Zn 后、Hg 在 Cu 后、Ag 在 Hg 后。"
    },
    {
      prompt: "下列金属中，能与稀盐酸反应放出氢气的是（ ）。",
      options: ["铜", "汞", "锌", "银"],
      answer: "2",
      difficulty: "基础",
      topic: "金属与酸反应判断",
      knowledgeIds: ["V2-K107", "V2-K105"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY"],
      explanation: "锌在氢前，能与稀盐酸反应放出氢气；铜、汞、银都在氢后，不与稀盐酸反应。"
    },
    {
      prompt: "把锌粒放入硫酸铜溶液中，观察到的现象是（ ）。",
      options: [
        "无明显现象",
        "锌粒表面出现红色固体，溶液蓝色变浅",
        "产生大量气泡",
        "溶液变成浅绿色"
      ],
      answer: "1",
      difficulty: "基础",
      topic: "金属与盐溶液反应",
      knowledgeIds: ["V2-K106"],
      mistakeTypes: ["M-PHENOMENON-JUDGE"],
      explanation: "锌比铜活泼，Zn + CuSO₄ → ZnSO₄ + Cu，锌表面析出红色铜，蓝色硫酸铜溶液逐渐变浅（变成无色 ZnSO₄）。"
    },
    {
      prompt: "下列反应中，不能发生的是（ ）。",
      options: [
        "Fe + CuSO₄ → FeSO₄ + Cu",
        "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag",
        "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
        "Cu + FeSO₄ → CuSO₄ + Fe"
      ],
      answer: "3",
      difficulty: "提升",
      topic: "判断反应能否发生",
      knowledgeIds: ["V2-K107", "V2-K106"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY"],
      explanation: "Cu 在 Fe 后面，后面的金属不能置换前面的金属，铜不能把铁从 FeSO₄ 中置换出来，此反应不发生。"
    },
    {
      prompt: "将铁粉放入 Cu(NO₃)₂ 和 AgNO₃ 的混合溶液中，铁粉先置换出来的是（ ）。",
      options: ["铜", "银", "铁", "无法确定"],
      answer: "1",
      difficulty: "挑战",
      topic: "置换先后顺序",
      knowledgeIds: ["V2-K107"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CONDITION-OMISSION"],
      explanation: "金属活动性越靠后的越先被置换。Ag 比 Cu 更靠后，所以铁先置换 AgNO₃ 中的银，AgNO₃ 反应完再置换铜。"
    },
    {
      prompt: "要比较 Fe、Cu、Ag 三种金属的活动性，下列方案可行的是（ ）。",
      options: [
        "把铁分别放入硫酸铜和硝酸银溶液",
        "把铜分别放入硫酸亚铁和硝酸银溶液",
        "把银分别放入硫酸亚铁和硫酸铜溶液",
        "把三种金属都放入稀盐酸观察"
      ],
      answer: "1",
      difficulty: "挑战",
      topic: "设计实验比较活动性",
      knowledgeIds: ["V2-K107"],
      mistakeTypes: ["M-CONDITION-OMISSION", "M-OBSERVATION-COMPARE"],
      explanation: "Cu 不与 FeSO₄ 反应说明 Cu < Fe；Cu 能置换 AgNO₃ 中的银说明 Cu > Ag，从而得 Fe > Cu > Ag。"
    },
    {
      prompt: "关于金属活动性顺序的运用，下列说法正确的是（ ）。",
      options: [
        "氢后的金属能与稀硫酸反应放出氢气",
        "浓硫酸与金属反应放氢气，规律与稀硫酸相同",
        "前金属能把后金属从其可溶性盐溶液中置换出来",
        "钾钙钠可以直接放入盐溶液中置换金属"
      ],
      answer: "2",
      difficulty: "提升",
      topic: "金属活动性应用",
      knowledgeIds: ["V2-K107"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CONDITION-OMISSION"],
      explanation: "前面的金属能置换后面金属的可溶性盐溶液中的金属。氢后金属不与稀酸反应放氢气；浓硫酸硝酸反应不放氢气；钾钙钠太活泼先与水反应，不用来做置换实验。"
    }
  ]
};
