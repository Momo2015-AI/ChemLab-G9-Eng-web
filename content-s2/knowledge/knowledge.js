window.ChemLabKnowledgeS2 = (function () {
  "use strict";

  // 知识图谱：单元一（金属和金属材料）。ID 命名空间：V2-K1xx。
  // prerequisite / related 引用其他知识点 ID；experiments 引用实验 ID；
  // mistakeTypes 引用错误分类 ID（见 content-s2/mistakes/mistakes.js）。
  const knowledge = [
    {
      id: "V2-K101",
      name: "金属的物理性质",
      concept: "多数金属有金属光泽、良好导电导热性、延展性；多数呈银白色，金呈黄色、铜呈紫红色。",
      prerequisite: [],
      related: ["V2-K102"],
      experiments: ["V2-E101"],
      mistakeTypes: ["M-OBSERVATION-COMPARE"],
      examPoints: ["金属的物理共性与特性", "由用途推断性质"],
      applications: ["铜做导线（导电性）、铝做炊具（导热）、金做首饰（化学稳定+延展性）"]
    },
    {
      id: "V2-K102",
      name: "合金",
      concept: "在金属中加热熔合某些金属或非金属而制得的、具有金属特性的物质。合金一般硬度比纯金属大、熔点比纯金属低，抗腐蚀性更好。",
      prerequisite: ["V2-K101"],
      related: ["V2-K103"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["合金是混合物", "合金性能优于纯金属", "常见合金及用途"],
      applications: ["不锈钢（抗腐蚀）、铝合金（轻而硬）、钛合金（人体植入）"]
    },
    {
      id: "V2-K103",
      name: "生铁与钢",
      concept: "生铁和钢都是铁的合金，区别在于含碳量不同：生铁含碳 2%~4.3%，钢含碳 0.03%~2%。",
      prerequisite: ["V2-K102"],
      related: [],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["生铁与钢的含碳量比较", "性质差异源于组成不同"],
      applications: ["生铁铸造、钢做结构材料"]
    },
    {
      id: "V2-K104",
      name: "金属与氧气的反应",
      concept: "镁、铝在常温即可与氧气反应（铝表面生成致密氧化膜起保护作用）；铁、铜需加热或点燃；金即使在高温下也不与氧气反应。由此体现金属活泼性的差异。",
      prerequisite: ["V2-K101"],
      related: ["V2-K105", "V2-K107"],
      experiments: ["V2-E102"],
      mistakeTypes: ["M-PHENOMENON-JUDGE"],
      examPoints: ["Mg/Al 常温氧化", "Fe 燃烧生成 Fe₃O₄", "Al 氧化膜的保护作用"],
      applications: ["铝制品的耐腐蚀性源于氧化膜"]
    },
    {
      id: "V2-K105",
      name: "金属与酸的反应",
      concept: "在金属活动性顺序中，位于氢之前的金属（K Ca Na Mg Al Zn Fe Sn Pb）能与稀盐酸、稀硫酸等反应生成氢气；位于氢之后的金属（Cu Hg Ag Pt Au）不能。反应的剧烈程度体现金属活动性。",
      prerequisite: ["V2-K104"],
      related: ["V2-K106", "V2-K107", "V2-K108"],
      experiments: ["V2-E103"],
      mistakeTypes: ["M-CHEMICAL-FORMULA", "M-PATTERN-OVERAPPLY", "M-OBSERVATION-COMPARE"],
      examPoints: ["氢前金属与酸反应生成氢气", "铁与酸生成 +2 价铁盐", "比较反应速率判断活泼性"],
      applications: ["实验室用锌与稀硫酸制氢气"]
    },
    {
      id: "V2-K106",
      name: "金属与盐溶液的反应",
      concept: "位于前面的金属能把位于后面的金属从其盐溶液中置换出来，如 Fe + CuSO₄ → FeSO₄ + Cu、Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag。",
      prerequisite: ["V2-K105"],
      related: ["V2-K107", "V2-K108"],
      experiments: ["V2-E104"],
      mistakeTypes: ["M-CHEMICAL-FORMULA", "M-PATTERN-OVERAPPLY"],
      examPoints: ["活动性强的置换弱的", "铁置换铜生成 FeSO₄（+2 价）", "现象描述：银白色固体表面析出红色固体"],
      applications: ["湿法炼铜原理"]
    },
    {
      id: "V2-K107",
      name: "金属活动性顺序",
      concept: "K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au。金属的位置越靠前，活动性越强；位于氢之前的能与酸反应放出氢气，位于前面的金属能把后面的从其盐溶液中置换出来。",
      prerequisite: ["V2-K104", "V2-K105", "V2-K106"],
      related: [],
      experiments: [],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CONDITION-OMISSION"],
      examPoints: ["顺序表的记忆", "判断反应能否发生", "设计实验比较三种金属活动性"],
      applications: ["预测置换反应", "比较金属的活泼性强弱"]
    },
    {
      id: "V2-K108",
      name: "置换反应",
      concept: "一种单质与一种化合物反应，生成另一种单质与另一种化合物的反应。通式：A + BC → B + AC。",
      prerequisite: ["V2-K105", "V2-K106"],
      related: ["V2-K107"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["置换反应判断", "与化合/分解反应的区分", "铁参与的置换反应方程式"],
      applications: ["金属活动性应用的总框架"]
    },
    {
      id: "V2-K109",
      name: "金属在自然界中的存在",
      concept: "少数化学性质不活泼的金属以单质形式存在（金、银等）；多数金属以化合态存在，存在于矿石中。",
      prerequisite: ["V2-K107"],
      related: ["V2-K110"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["存在形式与活泼性关系"],
      applications: ["解释金为什么能以单质存在"]
    },
    {
      id: "V2-K110",
      name: "常见矿石与炼铁原理",
      concept: "赤铁矿（主要成分 Fe₂O₃）、磁铁矿（Fe₃O₄）、铝土矿（Al₂O₃）等。工业炼铁原理：一氧化碳在高温下把铁从铁矿石中还原出来：Fe₂O₃ + 3CO →(高温) 2Fe + 3CO₂。CO 有毒，尾气需处理。",
      prerequisite: ["V2-K109"],
      related: [],
      experiments: ["V2-E105"],
      mistakeTypes: ["M-CHEMICAL-FORMULA", "M-CONDITION-OMISSION"],
      examPoints: ["矿石主要成分", "高炉炼铁原理与原料作用", "尾气处理（CO 有毒）", "含杂质计算"],
      applications: ["钢铁工业原理"]
    },
    {
      id: "V2-K111",
      name: "铁锈蚀的条件",
      concept: "铁生锈是铁与空气中的氧气和水共同作用的结果（两者缺一不可）。铁锈的主要成分是 Fe₂O₃·xH₂O，疏松多孔。",
      prerequisite: ["V2-K110"],
      related: ["V2-K112"],
      experiments: ["V2-E106"],
      mistakeTypes: ["M-CONDITION-OMISSION", "M-OBSERVATION-COMPARE"],
      examPoints: ["铁生锈需要氧气和水共同作用", "控制变量探究锈蚀条件"],
      applications: ["解释干燥地区铁制品不易生锈"]
    },
    {
      id: "V2-K112",
      name: "防锈方法与金属资源保护",
      concept: "防锈原理：隔绝氧气或水。常用方法：保持表面干燥、涂油、刷漆、镀锌/铬、制成不锈钢（合金）。保护金属资源的途径：防止锈蚀、回收利用废旧金属、合理开采、寻找代用品。",
      prerequisite: ["V2-K111"],
      related: [],
      experiments: [],
      mistakeTypes: ["M-CONDITION-OMISSION"],
      examPoints: ["防锈原理与方法的对应", "保护金属资源的三条途径"],
      applications: ["不锈钢炊具、涂油防锈、废旧金属回收"]
    }
  ];

  const byId = {};
  knowledge.forEach((k) => { byId[k.id] = k; });

  // 依赖倒序：每个知识点依赖的 prerequisite 必须是已定义的（拓扑可构造）。
  return { knowledge: knowledge, byId: byId };
}());
