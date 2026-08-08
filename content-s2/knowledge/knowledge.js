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

  // 单元二（溶液）知识点：ID 命名空间 V2-K2xx
  const unit2 = [
    {
      id: "V2-K201",
      name: "溶液的概念",
      concept: "一种或几种物质分散到另一种物质里，形成均一的、稳定的混合物，叫做溶液。溶液由溶质和溶剂组成。均一指各部分性质相同，稳定指外界条件不变时溶质不会分离出来。",
      prerequisite: ["V2-K101"],
      related: ["V2-K202", "V2-K203"],
      experiments: ["V2-E201"],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["溶液三特征：均一、稳定、混合物", "区分溶液与悬浊液、乳浊液"],
      applications: ["生理盐水、碘酒、汽水"]
    },
    {
      id: "V2-K202",
      name: "溶质与溶剂",
      concept: "被溶解的物质叫溶质，能溶解其他物质的物质叫溶剂。水是最常用的溶剂，酒精、汽油也可做溶剂。当两种液体互溶时，量多的叫溶剂，量少的叫溶质；有水存在时，水一定是溶剂。",
      prerequisite: ["V2-K201"],
      related: ["V2-K203"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["辨别溶质与溶剂", "不同溶剂下的溶解现象"],
      applications: ["碘酒（碘溶解在酒精中）、油渍用汽油清洗"]
    },
    {
      id: "V2-K203",
      name: "溶解过程的微观解释",
      concept: "溶解包含两个过程：溶质分子（或离子）向水中扩散（吸热），与水分子结合形成水合分子（或水合离子，放热）。两个过程的热效应不同，决定溶液温度变化：硝酸铵溶解吸热（降温），氢氧化钠溶解放热（升温），氯化钠溶解温度基本不变。",
      prerequisite: ["V2-K201", "V2-K202"],
      related: ["V2-K204"],
      experiments: [],
      mistakeTypes: ["M-PHENOMENON-JUDGE"],
      examPoints: ["判断溶解时温度变化", "微观扩散与结合的动态平衡"],
      applications: ["冷敷包（硝酸铵溶于水）"]
    },
    {
      id: "V2-K204",
      name: "乳化现象",
      concept: "洗涤剂能使植物油在水中分散成无数细小的液滴，而不聚集成大的油珠，形成稳定的乳浊液，这种现象叫乳化。乳化不是溶解，油并没有消失，只是变成了微小的液滴均匀分散在水中。",
      prerequisite: ["V2-K201"],
      related: ["V2-K203"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["区分溶解与乳化", "洗涤剂去油污原理"],
      applications: ["洗碗用洗洁精、洗衣液去油渍"]
    },
    {
      id: "V2-K205",
      name: "饱和溶液与不饱和溶液",
      concept: "在一定温度下，向一定量溶剂里加入某种溶质，当溶质不能继续溶解时，所得的溶液叫做这种溶质的饱和溶液；还能继续溶解的，叫做不饱和溶液。两者在一定条件下可以相互转化：加溶质或降温（多数物质）可使不饱和溶液变为饱和溶液；加溶剂或升温可使饱和溶液变为不饱和溶液。",
      prerequisite: ["V2-K201"],
      related: ["V2-K206", "V2-K207", "V2-K211"],
      experiments: ["V2-E202"],
      mistakeTypes: ["M-CONDITION-OMISSION", "M-CONCEPT-CONFUSION"],
      examPoints: ["判断溶液是否饱和", "饱和与不饱和的转化方法", "明确"一定温度"和"一定量溶剂"这两个前提"],
      applications: ["饱和食盐水、糖水浓度上限"]
    },
    {
      id: "V2-K206",
      name: "溶解度的概念",
      concept: "在一定温度下，某固态物质在 100g 溶剂（通常为水）里达到饱和状态时所溶解的质量，叫做这种物质在这种溶剂里的溶解度。四要素：一定温度、100g 溶剂、饱和状态、单位是克。",
      prerequisite: ["V2-K205"],
      related: ["V2-K207", "V2-K211"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["溶解度四要素缺一不可", "溶解度与饱和溶液的换算"],
      applications: ["查表计算某温度下可溶解的最大质量"]
    },
    {
      id: "V2-K207",
      name: "溶解度曲线",
      concept: "用曲线表示物质溶解度随温度变化的规律。曲线上的点表示该温度下的溶解度；曲线下方的点表示不饱和溶液；曲线上方的点表示过饱和溶液或有未溶晶体的饱和溶液。可通过曲线读出某温度下的溶解度，判断结晶方法（降温结晶适合溶解度随温度变化大的物质，蒸发结晶适合变化小的物质）。",
      prerequisite: ["V2-K206"],
      related: ["V2-K211"],
      experiments: [],
      mistakeTypes: ["M-OBSERVATION-COMPARE"],
      examPoints: ["读溶解度曲线表信息", "比较同温下溶解度大小", "判断结晶方法"],
      applications: ["从硝酸钾中除去少量氯化钠（降温结晶法）"]
    },
    {
      id: "V2-K208",
      name: "溶质的质量分数",
      concept: "溶质质量与溶液质量之比，用百分数表示。公式：溶质质量分数 = 溶质质量 / (溶质质量 + 溶剂质量) × 100%。",
      prerequisite: ["V2-K201", "V2-K202"],
      related: ["V2-K209"],
      experiments: [],
      mistakeTypes: ["M-CALCULATION"],
      examPoints: ["质量分数计算", "稀释问题（稀释前后溶质质量不变）", "含杂质计算"],
      applications: ["医疗注射液浓度、农业选种液密度"]
    },
    {
      id: "V2-K209",
      name: "一定溶质质量分数溶液的配制",
      concept: "配制步骤：计算 → 称量（固体）或量取（液体）→ 溶解 → 装瓶贴标签。需要用到的仪器：托盘天平、药匙、量筒、胶头滴管、烧杯、玻璃棒。",
      prerequisite: ["V2-K208"],
      related: ["V2-E203"],
      experiments: ["V2-E203"],
      mistakeTypes: ["M-CALCULATION", "M-EXAM-READING"],
      examPoints: ["配制步骤与仪器选择", "误差分析（溶质少了→浓度偏低，溶剂多了→浓度偏低）"],
      applications: ["配制生理盐水、配制农药溶液"]
    },
    {
      id: "V2-K210",
      name: "气体溶解度",
      concept: "气体的溶解度随温度升高而减小，随压强增大而增大。打开汽水瓶盖时压强减小，CO₂ 溶解度降低，气体逸出形成泡沫。",
      prerequisite: ["V2-K206"],
      related: [],
      experiments: [],
      mistakeTypes: ["M-PHENOMENON-JUDGE"],
      examPoints: ["温度、压强对气体溶解度的影响", "解释生产生活现象"],
      applications: ["烧水时气泡（溶解空气逸出）、打开汽水冒泡"]
    },
    {
      id: "V2-K211",
      name: "温度对固体溶解度的影响",
      concept: "大多数固体物质的溶解度随温度升高而增大（如硝酸钾、氯化钾），少数受温度影响很小（如氯化钠），极少数随温度升高而减小（如氢氧化钙）。氢氧化钙的溶解度随温度升高而减小，是特例。",
      prerequisite: ["V2-K206"],
      related: ["V2-K207", "V2-K205"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["特殊物质 Ca(OH)₂ 的溶解度曲线走向", "由曲线判断结晶方法"],
      applications: ["澄清石灰水加热后变浑浊（Ca(OH)₂ 溶解度降低析出）"]
    },
    {
      id: "V2-K212",
      name: "结晶方法",
      concept: "从溶液中获得晶体的两种方法：降温结晶（冷却热饱和溶液）适用于溶解度随温度变化大的物质（如 KNO₃）；蒸发结晶适用于溶解度随温度变化小的物质（如 NaCl）。",
      prerequisite: ["V2-K207", "V2-K211"],
      related: [],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["选择结晶方法的依据", "除杂题中结晶法的选择"],
      applications: ["从海水中提取食盐（蒸发结晶）、提纯硝酸钾（降温结晶）"]
    }
  ];

  knowledge.push(...unit2);

  const byId = {};
  knowledge.forEach((k) => { byId[k.id] = k; });

  return { knowledge: knowledge, byId: byId };
}());
