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
      examPoints: ["判断溶液是否饱和", "饱和与不饱和的转化方法", "明确“一定温度”和“一定量溶剂”这两个前提"],
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

  // 单元三（酸和碱）知识点：ID 命名空间 V2-K3xx
  const unit3 = [
    {
      id: "V2-K301",
      name: "盐酸的物理性质",
      concept: "浓盐酸是无色液体，有刺激性气味，有挥发性。打开浓盐酸瓶盖，瓶口出现白雾（盐酸小液滴），这是挥发性的体现。盐酸常用于金属除锈、制备二氧化碳等。",
      prerequisite: [],
      related: ["V2-K302"],
      experiments: ["V2-E301"],
      mistakeTypes: ["M-OBSERVATION-COMPARE"],
      examPoints: ["浓盐酸的物理性质（挥发性、白雾）", "浓盐酸与浓硫酸的物理性质对比"],
      applications: ["金属除锈、实验室制CO₂"]
    },
    {
      id: "V2-K302",
      name: "硫酸的物理性质",
      concept: "浓硫酸是无色粘稠油状液体，不易挥发。浓硫酸具有强烈的吸水性，可用作干燥剂（干燥中性或酸性气体，不能干燥碱性气体如NH₃）。浓硫酸还具有脱水性，能将有机物中的H、O按水的比例脱去，使有机物炭化。",
      prerequisite: ["V2-K301"],
      related: ["V2-K301"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["浓硫酸的三大特性：吸水性、脱水性、强氧化性", "浓硫酸稀释操作（酸入水、沿器壁、不断搅拌）"],
      applications: ["浓硫酸作干燥剂、稀释操作规范"]
    },
    {
      id: "V2-K303",
      name: "酸的通性（与指示剂反应）",
      concept: "酸溶液能使紫色石蕊试液变红，使无色酚酞试液不变色。注意：是酸溶液（含H⁺）使指示剂变色，不是酸分子本身。稀硫酸、稀盐酸、醋酸等都能使石蕊变红。",
      prerequisite: [],
      related: ["V2-K304"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["酸碱指示剂的变色规律", "酸使石蕊变红、酚酞不变色"],
      applications: ["用石蕊试液检验溶液的酸性"]
    },
    {
      id: "V2-K304",
      name: "酸的化学性质",
      concept: "酸的通性（五条）：①与指示剂反应（石蕊变红，酚酞不变）；②酸+活泼金属→盐+氢气（H前的金属）；③酸+金属氧化物→盐+水；④酸+碱→盐+水（中和反应）；⑤酸+盐→新酸+新盐（生成沉淀、气体或水）。",
      prerequisite: ["V2-K303"],
      related: ["V2-K305", "V2-K306"],
      experiments: ["V2-E302"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CHEMICAL-FORMULA"],
      examPoints: ["酸的五个化学性质与方程式书写", "判断反应能否发生"],
      applications: ["除铁锈（Fe₂O₃+6HCl=2FeCl₃+3H₂O）、实验室制H₂和CO₂"]
    },
    {
      id: "V2-K305",
      name: "氢氧化钠的性质",
      concept: "氢氧化钠（NaOH）俗称烧碱、火碱、苛性钠，白色固体，易溶于水并放出大量热，易潮解（吸收空气中水分而潮解，可用作干燥剂）。氢氧化钠有强烈的腐蚀性，使用时要格外小心。NaOH能吸收空气中的CO₂而变质：2NaOH+CO₂=Na₂CO₃+H₂O。",
      prerequisite: [],
      related: ["V2-K306"],
      experiments: ["V2-E303"],
      mistakeTypes: ["M-CONDITION-OMISSION"],
      examPoints: ["NaOH的物理性质（潮解）", "NaOH变质的原因与检验", "NaOH的保存方法（密封）"],
      applications: ["NaOH固体作干燥剂、制作肥皂、石油精炼"]
    },
    {
      id: "V2-K306",
      name: "氢氧化钙的性质",
      concept: "氢氧化钙（Ca(OH)₂）俗称熟石灰、消石灰，白色粉末，微溶于水，其水溶液叫澄清石灰水。Ca(OH)₂能与CO₂反应：Ca(OH)₂+CO₂=CaCO₃↓+H₂O，此反应常用于检验CO₂。Ca(OH)₂也易与空气中的CO₂反应而变质。",
      prerequisite: ["V2-K305"],
      related: ["V2-K305"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["Ca(OH)₂的制备（CaO+H₂O=Ca(OH)₂）", "CO₂的检验方法", "澄清石灰水变浑浊的原理"],
      applications: ["建筑砌砖（石灰浆硬化）、改良酸性土壤、配制波尔多液"]
    },
    {
      id: "V2-K307",
      name: "碱的通性（与指示剂反应）",
      concept: "碱溶液能使紫色石蕊试液变蓝，使无色酚酞试液变红。注意：必须是碱溶液（含OH⁻），不溶性的碱（如Cu(OH)₂、Fe(OH)₃）不能使指示剂变色。氨水（NH₃·H₂O）是弱碱，也能使指示剂变色。",
      prerequisite: ["V2-K303"],
      related: ["V2-K308"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["碱使石蕊变蓝、酚酞变红", "不溶性碱不能使指示剂变色"],
      applications: ["用酚酞检验溶液的碱性"]
    },
    {
      id: "V2-K308",
      name: "碱的化学性质",
      concept: "碱的通性（四条）：①与指示剂反应（石蕊变蓝，酚酞变红）；②碱+非金属氧化物→盐+水（如CO₂、SO₂）；③碱+酸→盐+水（中和反应）；④碱+盐→新碱+新盐（反应物均可溶，生成物有沉淀）。",
      prerequisite: ["V2-K307"],
      related: ["V2-K304"],
      experiments: ["V2-E304"],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CHEMICAL-FORMULA"],
      examPoints: ["碱的四个化学性质与方程式书写", "判断复分解反应能否发生"],
      applications: ["用NaOH吸收SO₂（防止酸雨）、用Ca(OH)₂检验CO₂"]
    },
    {
      id: "V2-K309",
      name: "中和反应",
      concept: "酸和碱作用生成盐和水的反应叫做中和反应。实质是H⁺+OH⁻=H₂O。中和反应放热。中和反应的应用：①改变土壤酸碱性（用熟石灰改良酸性土壤）；②处理工厂废水（用碱性物质中和酸性废水）；③医药（用Al(OH)₃治疗胃酸过多：Al(OH)₃+3HCl=AlCl₃+3H₂O）；④被蚊虫叮咬后涂肥皂水（中和蚊虫分泌的蚁酸）。",
      prerequisite: ["V2-K304", "V2-K308"],
      related: ["V2-K310"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["中和反应的定义与实质", "中和反应的应用", "中和反应与复分解反应的关系"],
      applications: ["改良酸性土壤、处理废水、治疗胃酸过多"]
    },
    {
      id: "V2-K310",
      name: "溶液的酸碱度（pH）",
      concept: "pH是表示溶液酸碱强弱的数值。pH<7为酸性，pH越小酸性越强；pH=7为中性；pH>7为碱性，pH越大碱性越强。测定pH的方法：在白瓷板或玻璃片上放一小片pH试纸，用玻璃棒蘸取待测液滴到试纸上，把试纸显示的颜色与标准比色卡对照，读出pH。注意：pH试纸不能事先润湿，不能直接浸入待测液。",
      prerequisite: ["V2-K309"],
      related: ["V2-K309"],
      experiments: [],
      mistakeTypes: ["M-EXAM-READING"],
      examPoints: ["pH与酸碱性的关系", "pH试纸的正确使用方法", "pH测定误差分析"],
      applications: ["测定雨水pH判断酸雨、测定土壤pH指导农业"]
    },
    {
      id: "V2-K311",
      name: "常见酸碱指示剂",
      concept: "指示剂是能跟酸或碱的溶液起作用而显示不同颜色的物质。常用的指示剂有石蕊和酚酞。石蕊：酸性溶液变红，碱性溶液变蓝，中性溶液不变色（紫色）。酚酞：酸性溶液不变色，碱性溶液变红，中性溶液不变色。",
      prerequisite: ["V2-K303", "V2-K307"],
      related: ["V2-K310"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["石蕊和酚酞的变色规律", "指示剂与pH试纸的区别"],
      applications: ["用指示剂检验溶液的酸碱性"]
    },
    {
      id: "V2-K312",
      name: "常见的盐（氯化钠、碳酸钠、碳酸氢钠、碳酸钙）",
      concept: "氯化钠（NaCl）：俗称食盐，白色固体，易溶于水，是日常调味品和食品防腐剂，也是重要的化工原料（制NaOH、Cl₂、H₂等）。碳酸钠（Na₂CO₃）：俗称纯碱、苏打，白色粉末，易溶于水，水溶液呈碱性，用于玻璃、造纸、纺织等。碳酸氢钠（NaHCO₃）：俗称小苏打，白色晶体，受热易分解：2NaHCO₃=Na₂CO₃+H₂O+CO₂↑，用于焙制糕点和治疗胃酸过多。碳酸钙（CaCO₃）：白色固体，不溶于水，是石灰石、大理石的主要成分，用于建筑材料、实验室制CO₂。",
      prerequisite: [],
      related: ["V2-K313"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["四种常见盐的俗名、性质与用途", "NaHCO₃受热分解方程式"],
      applications: ["食盐调味、纯碱制玻璃、小苏打烘焙、碳酸钙建筑材料"]
    },
    {
      id: "V2-K313",
      name: "盐的化学性质",
      concept: "盐的化学性质：①盐+金属→新盐+新金属（前置后，K Ca Na除外）；②盐+酸→新盐+新酸（生成沉淀、气体或水）；③盐+碱→新盐+新碱（反应物均可溶，生成物有沉淀）；④盐+盐→两种新盐（反应物均可溶，生成物有沉淀）。",
      prerequisite: ["V2-K304", "V2-K308"],
      related: ["V2-K312"],
      experiments: [],
      mistakeTypes: ["M-PATTERN-OVERAPPLY", "M-CHEMICAL-FORMULA"],
      examPoints: ["盐的四条化学性质与方程式书写", "判断盐的反应能否发生"],
      applications: ["湿法炼铜（Fe+CuSO₄=FeSO₄+Cu）、工业制Na₂CO₃"]
    }
  ];

  knowledge.push(...unit3);

  // 单元四（盐、化肥）知识点：ID 命名空间 V2-K4xx
  const unit4 = [
    {
      id: "V2-K401",
      name: "复分解反应的深化",
      concept: "复分解反应是两种化合物互相交换成分生成两种新化合物的反应。反应发生的条件是生成物中有沉淀、气体或水。酸+碱→盐+水（中和反应），酸+盐→新酸+新盐，碱+盐→新碱+新盐，盐+盐→两种新盐。记忆口诀：沉淀气体水，反应才能成。",
      prerequisite: ["V2-K304", "V2-K308", "V2-K313"],
      related: ["V2-K317", "V2-K318"],
      experiments: [],
      mistakeTypes: ["M-PATTERN-OVERAPPLY"],
      examPoints: ["复分解反应条件判断", "常见沉淀和气体的记忆"],
      applications: ["物质制备、除杂、推断"]
    },
    {
      id: "V2-K402",
      name: "物质的检验与鉴别",
      concept: "检验：确定某物质是否存在。鉴别：区分两种或多种物质。离子检验方法：Cl⁻→AgNO₃+稀HNO₃（白沉），SO₄²⁻→Ba(NO₃)₂+稀HNO₃（白沉），CO₃²⁻→稀HCl（气泡+石灰水变浑），NH₄⁺→NaOH+加热（刺激性气体）。检验顺序：CO₃²⁻→SO₄²⁻→Cl⁻。",
      prerequisite: ["V2-K317", "V2-K318", "V2-K319"],
      related: ["V2-K401"],
      experiments: [],
      mistakeTypes: ["M-CONDITION-OMISSION"],
      examPoints: ["离子检验方法", "鉴别方案设计", "检验顺序"],
      applications: ["物质鉴定、纯度检验"]
    },
    {
      id: "V2-K403",
      name: "化肥的种类与作用",
      concept: "氮肥（N）：促进茎叶生长，叶色浓绿。常见：尿素CO(NH₂)₂、NH₄HCO₃、NH₄Cl、(NH₄)₂SO₄。磷肥（P）：促进根系发达，增强抗寒抗旱。常见：过磷酸钙、磷矿粉。钾肥（K）：增强抗病虫害和抗倒伏。常见：KCl、K₂SO₄、K₂CO₃。复合肥：含两种以上营养元素，如KNO₃、NH₄H₂PO₄。",
      prerequisite: [],
      related: ["V2-K404"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["化肥种类与作用的对应", "铵态氮肥的鉴别"],
      applications: ["农业施肥指导"]
    },
    {
      id: "V2-K404",
      name: "铵态氮肥的使用禁忌",
      concept: "铵态氮肥（含NH₄⁺）不能与碱性物质（如草木灰K₂CO₃、熟石灰Ca(OH)₂）混合施用，否则会产生NH₃逸出，降低肥效。反应：2NH₄Cl+Ca(OH)₂=CaCl₂+2H₂O+2NH₃↑。鉴别铵态氮肥：加碱研磨，产生刺激性气味气体使湿润红色石蕊试纸变蓝。",
      prerequisite: ["V2-K403"],
      related: ["V2-K403"],
      experiments: [],
      mistakeTypes: ["M-CONDITION-OMISSION"],
      examPoints: ["铵态氮肥与碱反应的方程式", "铵态氮肥的鉴别方法"],
      applications: ["合理施肥"]
    },
    {
      id: "V2-K405",
      name: "粗盐提纯",
      concept: "粗盐提纯步骤：溶解→过滤→蒸发→计算产率。过滤要点：一贴二低三靠。蒸发要点：用玻璃棒不断搅拌防止液滴飞溅，出现较多固体时停止加热，利用余热蒸干。产率=精盐质量/粗盐质量×100%。产率偏低原因：溶解不充分、过滤时洒出、蒸发时飞溅。产率偏高：精盐未干燥。",
      prerequisite: ["V2-K312"],
      related: ["V2-K401"],
      experiments: ["V2-E401"],
      mistakeTypes: ["M-CALCULATION"],
      examPoints: ["粗盐提纯步骤", "过滤蒸发操作要点", "产率误差分析"],
      applications: ["海水晒盐", "实验室提纯"]
    },
    {
      id: "V2-K406",
      name: "人类六大营养素",
      concept: "糖类（主要供能，淀粉/葡萄糖/蔗糖）、油脂（备用能源）、蛋白质（构成细胞基本物质）、维生素（调节新陈代谢）、水（生命之源）、无机盐（构成人体组织）。蛋白质是有机高分子化合物，遇热、重金属盐、甲醛会变性（不可逆）。蛋白质灼烧有烧焦羽毛气味（鉴别蚕丝和羊毛）。",
      prerequisite: [],
      related: ["V2-K407"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["六大营养素的食物来源", "蛋白质的特性"],
      applications: ["合理膳食"]
    },
    {
      id: "V2-K407",
      name: "化学元素与人体健康",
      concept: "常量元素（>0.01%）：O、C、H、N、Ca、P、K、S、Na、Cl、Mg。微量元素（<0.01%）：Fe、Zn、Se、I、F等。缺钙→佝偻病/骨质疏松，缺铁→贫血，缺碘→甲状腺肿大，缺锌→发育不良，缺硒→癌症风险增加，缺氟→龋齿。重金属盐中毒可服用牛奶或蛋清（蛋白质结合重金属离子）急救。",
      prerequisite: ["V2-K406"],
      related: ["V2-K406"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["元素缺乏症与补充来源", "重金属中毒急救"],
      applications: ["合理膳食、健康饮食"]
    },
    {
      id: "V2-K408",
      name: "环境问题与绿色化学",
      concept: "酸雨（pH<5.6）：SO₂和NOₓ引起，腐蚀建筑、酸化土壤。温室效应：CO₂等温室气体过量导致全球变暖。白色污染：难降解塑料废弃物。臭氧层空洞：氟氯代烷破坏臭氧层。绿色化学：从源头上减少和消除污染，原子利用率100%。防治：使用脱硫煤、植树造林、可降解塑料、无氟制冷剂。",
      prerequisite: ["V2-K301", "V2-K302"],
      related: ["V2-K407"],
      experiments: [],
      mistakeTypes: ["M-CONCEPT-CONFUSION"],
      examPoints: ["环境问题的成因与防治", "绿色化学理念"],
      applications: ["环境保护意识"]
    }
  ];

  knowledge.push(...unit4);

  const byId = {};
  knowledge.forEach((k) => { byId[k.id] = k; });

  return { knowledge: knowledge, byId: byId };
}());
