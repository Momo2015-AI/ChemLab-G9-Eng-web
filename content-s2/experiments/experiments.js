window.ChemLabExperimentsS2 = (function () {
  "use strict";

  // 实验模型：单元一（金属和金属材料）。ID 命名空间：V2-E1xx。
  // commonErrors 引用错误分类 ID；knowledgeIds 引用知识点 ID。
  const experiments = [
    {
      id: "V2-E101",
      name: "金属物理性质的观察",
      day: "01",
      type: "observation",
      purpose: "通过观察与简单操作，认识金属的物理性质共性与特性。",
      materials: ["铁片", "铜丝", "铝箔", "导线", "小锤"],
      setup: "金属样品摆放在桌面，供观察颜色、光泽、导电性与延展性。",
      steps: [
        "观察铁片、铜丝、铝箔的颜色和光泽，用手折弯感受硬度与延展性。",
        "用导线把铜丝接入简单电路，观察小灯泡是否发光。",
        "记录比较：三种金属在颜色、导电性上的异同。"
      ],
      observations: ["多数金属有金属光泽", "铜呈紫红色，铁、铝呈银白色", "金属能导电、能被弯曲"],
      conclusion: "金属具有金属光泽、导电导热性和延展性；不同金属在颜色、硬度上存在差异。",
      safety: "supervised",
      commonErrors: ["M-OBSERVATION-COMPARE"],
      knowledgeIds: ["V2-K101"],
      examPoints: ["金属物理共性", "由用途推断性质"]
    },
    {
      id: "V2-E102",
      name: "金属与氧气的反应（演示）",
      day: "02",
      type: "demonstration",
      purpose: "比较镁、铝、铁、铜与氧气反应的难易，建立金属活泼性差异的直观认识。",
      materials: ["镁条", "铝箔", "铁钉", "铜丝", "酒精灯", "坩埚钳"],
      setup: "坩埚钳夹持金属样品，酒精灯加热，注意防护与通风。",
      steps: [
        "用砂纸打磨镁条表面，观察其在常温下的变化。",
        "加热铝箔、铁钉、铜丝，分别观察燃烧或变色的剧烈程度。",
        "金在加热条件下无明显变化，可对比说明其化学性质极不活泼。"
      ],
      observations: ["镁条常温表面变暗，点燃剧烈燃烧发出耀眼白光", "铝箔表面生成致密氧化膜", "铁丝在氧气中剧烈燃烧火星四射生成黑色固体", "铜丝加热表面变黑（CuO）"],
      conclusion: "不同金属与氧气反应难易不同，镁铝较活泼、铁铜次之、金极不活泼。",
      safety: "supervised",
      commonErrors: ["M-PHENOMENON-JUDGE"],
      knowledgeIds: ["V2-K104"],
      examPoints: ["铁燃烧生成 Fe₃O₄ 而非 Fe₂O₃", "铝氧化膜保护作用", "通过反应难易比较活泼性"]
    },
    {
      id: "V2-E103",
      name: "金属与稀盐酸、稀硫酸的反应（探究）",
      day: "02",
      type: "inquiry",
      purpose: "探究不同金属与稀酸反应的剧烈程度，归纳金属活动性差异。",
      materials: ["镁条", "锌粒", "铁钉", "铜片", "稀盐酸", "稀硫酸", "试管"],
      setup: "四支试管分别加入等量稀盐酸，再分别放入镁、锌、铁、铜。",
      steps: [
        "取四支试管，各加入等体积、等浓度的稀盐酸。",
        "分别放入大小相近的镁条、锌粒、铁钉、铜片。",
        "观察产生气泡的快慢，比较反应的剧烈程度。",
        "（对照组）铜片放回另一支装稀盐酸的试管，确认不反应。"
      ],
      observations: ["镁反应最剧烈，快速产生大量气泡", "锌反应较快", "铁反应缓慢，气泡较少，溶液变浅绿色", "铜无明显现象"],
      conclusion: "Mg > Zn > Fe > Cu（Cu 不反应），金属与酸反应的剧烈程度反映其活动性强弱。",
      safety: "supervised",
      commonErrors: ["M-OBSERVATION-COMPARE", "M-PATTERN-OVERAPPLY", "M-CHEMICAL-FORMULA"],
      knowledgeIds: ["V2-K105", "V2-K107"],
      examPoints: ["氢前金属与酸反应生成氢气", "铁与酸生成 FeSO₄/FeCl₂（+2 价）", "比较反应速率判断活泼性"]
    },
    {
      id: "V2-E104",
      name: "铁钉与硫酸铜溶液的反应（探究）",
      day: "04",
      type: "inquiry",
      purpose: "观察铁能否把铜从硫酸铜溶液中置换出来，认识金属与盐溶液的反应。",
      materials: ["铁钉", "硫酸铜溶液", "试管"],
      setup: "洁净铁钉放入盛有硫酸铜溶液的试管，静置观察。",
      steps: [
        "将洁净铁钉放入硫酸铜溶液中。",
        "观察铁钉表面和溶液颜色的变化。",
        "数分钟后取出观察，并写出反应的化学方程式。"
      ],
      observations: ["铁钉表面出现红色固体", "溶液蓝色逐渐变浅"],
      conclusion: "铁能把铜从硫酸铜溶液中置换出来：Fe + CuSO₄ → FeSO₄ + Cu，铁比铜活泼。",
      safety: "supervised",
      commonErrors: ["M-CHEMICAL-FORMULA", "M-PATTERN-OVERAPPLY"],
      knowledgeIds: ["V2-K106", "V2-K108"],
      examPoints: ["置换反应判断", "生成 FeSO₄ 而非 Fe₂(SO₄)₃", "现象描述（析出红色固体、溶液变浅）"]
    },
    {
      id: "V2-E105",
      name: "高炉炼铁原理（CO 还原 Fe₂O₃，演示）",
      day: "05",
      type: "demonstration",
      purpose: "理解一氧化碳在高温下把铁从氧化铁中还原出来的原理及尾气处理。",
      materials: ["一氧化碳", "氧化铁粉末", "硬质玻璃管", "酒精灯", "石灰水"],
      setup: "CO 通入盛有 Fe₂O₃ 粉末的硬质玻璃管，高温加热，尾气通入石灰水后点燃或收集。",
      steps: [
        "先通入 CO 排尽装置内空气，再点燃酒精灯加热（防爆炸）。",
        "观察红色氧化铁粉末的变化与石灰水的变化。",
        "实验结束后先停止加热，继续通 CO 至冷却，处理尾气。"
      ],
      observations: ["红棕色粉末逐渐变为黑色（铁）", "澄清石灰水变浑浊（CO₂）"],
      conclusion: "Fe₂O₃ + 3CO →(高温) 2Fe + 3CO₂。CO 有毒，尾气必须处理。",
      safety: "supervised",
      commonErrors: ["M-CONDITION-OMISSION", "M-CHEMICAL-FORMULA"],
      knowledgeIds: ["V2-K110"],
      examPoints: ["炼铁原理方程式", "先通 CO 再加热的原因", "尾气处理方式"]
    },
    {
      id: "V2-E106",
      name: "铁钉锈蚀条件的探究",
      day: "05",
      type: "inquiry",
      purpose: "用控制变量的方法探究铁生锈是否需要氧气和水，两者缺一不可。",
      materials: ["铁钉", "试管", "水", "干燥剂（氯化钙）", "植物油", "蒸馏水"],
      setup: "三支试管：①铁钉接触干燥空气（放干燥剂）；②铁钉一半浸入蒸馏水（水面上加植物油隔绝空气）；③铁钉一半浸入蒸馏水，敞口同时接触空气和水。",
      steps: [
        "按上述条件分别组装三支试管，标记清楚。",
        "放置数天后观察三支试管中铁钉的变化。",
        "对比分析：哪个条件组合使铁钉生锈？"
      ],
      observations: ["①干燥空气中的铁钉不生锈", "②只接触水（隔绝空气）的铁钉不生锈", "③同时接触水和空气的铁钉明显生锈"],
      conclusion: "铁生锈需要氧气和水同时存在，缺一不可。",
      safety: "supervised",
      commonErrors: ["M-CONDITION-OMISSION", "M-OBSERVATION-COMPARE"],
      knowledgeIds: ["V2-K111", "V2-K112"],
      examPoints: ["锈蚀条件控制变量设计", "对比实验结论", "防锈原理的对应"]
    }
  ];

  // 单元二（溶液）实验：ID 命名空间 V2-E2xx
  const unit2Experiments = [
    {
      id: "V2-E201",
      name: "物质在水中的溶解现象",
      day: "07",
      type: "observation",
      purpose: "观察不同物质在水中溶解的现象，建立溶液概念。",
      materials: ["蔗糖", "食盐", "植物油", "面粉", "水", "试管", "胶头滴管"],
      setup: "取四支试管，各加入约 5mL 水，分别加入少量蔗糖、食盐、植物油、面粉，振荡后观察现象。",
      steps: [
        "取四支洁净试管，编号 1-4，各加入约 5mL 蒸馏水",
        "向试管 1 中加入少量蔗糖，振荡，观察",
        "向试管 2 中加入少量食盐，振荡，观察",
        "向试管 3 中加入少量植物油，振荡，观察",
        "向试管 4 中加入少量面粉，振荡，观察",
        "静置片刻，比较四支试管的现象差异"
      ],
      observations: ["①蔗糖溶解，得到无色透明液体（溶液）", "②食盐溶解，得到无色透明液体（溶液）", "③植物油不溶解，液体分层（乳浊液）", "④面粉不溶解，液体浑浊不均（悬浊液）"],
      conclusion: "蔗糖和食盐能均匀分散在水中形成溶液，植物油形成乳浊液，面粉形成悬浊液。溶液具有均一性、稳定性。",
      safety: "supervised",
      commonErrors: ["M-CONCEPT-CONFUSION", "M-OBSERVATION-COMPARE"],
      knowledgeIds: ["V2-K201", "V2-K202", "V2-K204"],
      examPoints: ["区分溶液、悬浊液、乳浊液", "溶液的特征描述"]
    },
    {
      id: "V2-E202",
      name: "饱和溶液与不饱和溶液的转化",
      day: "09",
      type: "experiment",
      purpose: "通过实验探究饱和溶液与不饱和溶液的相互转化方法。",
      materials: ["硝酸钾固体", "水", "烧杯", "玻璃棒", "酒精灯", "三脚架", "石棉网"],
      setup: "在烧杯中配制硝酸钾溶液，通过加溶质、加水、升温、降温观察溶解变化。",
      steps: [
        "在烧杯中加入约 30mL 水，分次加入硝酸钾固体，搅拌至不再溶解，得到饱和溶液",
        "向上述饱和溶液中再加少量水，搅拌，观察固体是否继续溶解",
        "另取一支试管，加入少量饱和硝酸钾溶液和一粒硝酸钾晶体",
        "用酒精灯加热试管，观察晶体是否溶解",
        "停止加热，让试管冷却，观察晶体是否重新析出"
      ],
      observations: ["①加水后，饱和溶液中剩余固体继续溶解", "②加热后，晶体逐渐溶解", "③冷却后，晶体重新析出"],
      conclusion: "饱和溶液加水可变为不饱和溶液；不饱和溶液加溶质可变为饱和溶液；多数固体物质升温使溶解度增大（不饱和→饱和），降温使溶解度减小（饱和→析出晶体）。",
      safety: "supervised",
      commonErrors: ["M-CONDITION-OMISSION", "M-CONCEPT-CONFUSION"],
      knowledgeIds: ["V2-K205", "V2-K211"],
      examPoints: ["饱和与不饱和的转化条件", "溶解度随温度变化的规律"]
    },
    {
      id: "V2-E203",
      name: "配制一定溶质质量分数的溶液",
      day: "12",
      type: "experiment",
      purpose: "学习用固体溶质配制一定质量分数的溶液，掌握基本操作。",
      materials: ["氯化钠固体", "蒸馏水", "托盘天平", "药匙", "量筒（10mL、50mL）", "胶头滴管", "烧杯（100mL）", "玻璃棒"],
      setup: "配制 50g 溶质质量分数为 6% 的氯化钠溶液。",
      steps: [
        "计算：需要氯化钠 50g × 6% = 3g，需要水 50g - 3g = 47g（约 47mL）",
        "称量：用托盘天平称取 3g 氯化钠固体，倒入烧杯中",
        "量取：用量筒量取 47mL 蒸馏水",
        "溶解：将水倒入烧杯，用玻璃棒搅拌至氯化钠完全溶解",
        "装瓶：将配制好的溶液倒入试剂瓶，贴标签（名称、质量分数）"
      ],
      observations: ["氯化钠固体完全溶解，得到无色透明溶液，溶液质量为 50g"],
      conclusion: "配制溶液的基本步骤为计算、称量、溶解。实验操作需规范，误差来源包括天平读数不准、量筒读数仰视或俯视、溶解时未完全转移等。",
      safety: "supervised",
      commonErrors: ["M-CALCULATION", "M-EXAM-READING"],
      knowledgeIds: ["V2-K208", "V2-K209"],
      examPoints: ["配制步骤", "仪器选择", "误差分析"]
    },
    {
      id: "V2-E204",
      name: "溶解时的吸热和放热现象",
      day: "08",
      type: "observation",
      purpose: "通过手触感或温度计测量，认识不同物质溶解时的热效应。",
      materials: ["硝酸铵固体", "氢氧化钠固体", "氯化钠固体", "三支试管", "水", "温度计", "烧杯"],
      setup: "分别将三种固体溶于水，测量溶液温度变化。",
      steps: [
        "取三支试管，各加入约 10mL 水，测量并记录初始水温",
        "向第一支试管加入少量硝酸铵固体，搅拌，测量温度",
        "向第二支试管加入少量氢氧化钠固体，搅拌，测量温度",
        "向第三支试管加入少量氯化钠固体，搅拌，测量温度",
        "对比三支试管的温度变化"
      ],
      observations: ["①硝酸铵溶解后温度明显降低", "②氢氧化钠溶解后温度明显升高", "③氯化钠溶解后温度基本不变"],
      conclusion: "不同物质溶解时的热效应不同：硝酸铵溶解吸热（温度降低），氢氧化钠溶解放热（温度升高），氯化钠溶解温度基本不变。",
      safety: "supervised",
      commonErrors: ["M-PHENOMENON-JUDGE"],
      knowledgeIds: ["V2-K203"],
      examPoints: ["判断溶解时的温度变化", "解释相关生活现象"]
    }
  ];

  experiments.push(...unit2Experiments);

  const byId = {};
  experiments.forEach((e) => { byId[e.id] = e; });

  return { experiments: experiments, byId: byId };
}());
