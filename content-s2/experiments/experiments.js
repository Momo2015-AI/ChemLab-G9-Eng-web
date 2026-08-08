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

  const byId = {};
  experiments.forEach((e) => { byId[e.id] = e; });

  return { experiments: experiments, byId: byId };
}());
