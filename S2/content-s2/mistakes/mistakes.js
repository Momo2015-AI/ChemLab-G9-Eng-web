window.ChemLabMistakesS2 = (function () {
  "use strict";

  // 错误分类表（跨单元共享的通用错误类型 + 单元一具体表现）。
  // ID 命名空间：M-*。knowledgeIds 指向错误对应缺失/混淆的知识点。
  const mistakes = [
    {
      id: "M-CHEMICAL-FORMULA",
      name: "化学用语错误",
      description: "化学式、化合价、方程式书写错误。典型：铁与酸/盐反应误写 FeCl₃、Fe₂(SO₄)₃（应为 +2 价 FeCl₂/FeSO₄）。",
      remediation: "复习金属与酸、盐反应时铁的化合价固定为 +2；对比 Fe₂O₃（+3）与 FeCl₂/FeSO₄（+2）的差异。",
      knowledgeIds: ["V2-K105", "V2-K106", "V2-K110"]
    },
    {
      id: "M-CONCEPT-CONFUSION",
      name: "概念混淆",
      description: "对合金、生铁钢、置换反应等概念理解偏差。典型：误认为合金是纯金属；混淆生铁与钢的含碳量。",
      remediation: "用对比表格区分概念：合金=混合物，生铁 2%~4.3% 碳、钢 0.03%~2% 碳。",
      knowledgeIds: ["V2-K102", "V2-K103", "V2-K108", "V2-K109"]
    },
    {
      id: "M-PATTERN-OVERAPPLY",
      name: "规律过度外推",
      description: "把局部规律推广到不适用场景。典型：认为所有金属都能与酸反应放出氢气，忽略氢之后金属（Cu Hg Ag Pt Au）不反应。",
      remediation: "以金属活动性顺序为准绳判断：氢之前的金属才能置换出氢气；氢之后的金属不与酸反应。",
      knowledgeIds: ["V2-K105", "V2-K106", "V2-K107"]
    },
    {
      id: "M-CONDITION-OMISSION",
      name: "条件遗漏",
      description: "忽略反应或现象的必要条件。典型：认为铁生锈只需水或只需氧气；高炉炼铁漏掉尾气 CO 处理；比较活泼性时未控制变量。",
      remediation: "养成列出充分必要条件的好习惯：铁锈蚀=氧气+水共同作用；炼铁尾气必含 CO 需点燃或收集。",
      knowledgeIds: ["V2-K107", "V2-K110", "V2-K111", "V2-K112"]
    },
    {
      id: "M-PHENOMENON-JUDGE",
      name: "现象判断错误",
      description: "从表面现象错误推断本质。典型：只凭有气泡就断言金属活泼，未控制金属种类、酸浓度、接触面积等变量；把发光当化学变化证据。",
      remediation: "现象是线索不是证据；比较必须控制变量，结论要由足够证据支撑。",
      knowledgeIds: ["V2-K104", "V2-K105"]
    },
    {
      id: "M-OBSERVATION-COMPARE",
      name: "观察比较不规范",
      description: "比较时条件不唯一，或观察不完整。典型：比较金属与酸反应速率时金属大小/酸的浓度不同，导致结论失真。",
      remediation: "控制变量：金属颗粒大小相近、酸浓度与体积相同、温度相同，才可比较反应速率。",
      knowledgeIds: ["V2-K101", "V2-K105", "V2-K111"]
    },
    {
      id: "M-CALCULATION",
      name: "计算错误",
      description: "溶质质量分数、含杂质方程式计算、相对分子质量计算等步骤错误。",
      remediation: "规范步骤：设未知量→写方程式→标已知量→列比例式→求解→答。含杂质先换算为纯净物质量。",
      knowledgeIds: []
    },
    {
      id: "M-EXAM-READING",
      name: "审题错误",
      description: "漏读关键词、答非所问。典型：把比较活泼性顺序答成能否反应。",
      remediation: "圈出题干关键词（比较/排序/能否/原因/现象），先明确问题再作答。",
      knowledgeIds: []
    }
  ];

  const byId = {};
  mistakes.forEach((m) => { byId[m.id] = m; });

  return { mistakes: mistakes, byId: byId };
}());
