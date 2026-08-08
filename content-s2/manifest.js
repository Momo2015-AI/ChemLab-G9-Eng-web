window.ChemLabManifestS2 = (function () {
  "use strict";

  // 模块划分与天数区间，来自 docs/CHEMISTRY_CURRICULUM.md 的教学地图。
  const modules = [
    { name: "金属和金属材料", range: [1, 6] },
    { name: "溶液", range: [7, 13] },
    { name: "酸和碱", range: [14, 20] },
    { name: "盐、化肥", range: [21, 27] },
    { name: "化学与生活", range: [28, 30] },
    { name: "综合提升", range: [31, 36] }
  ];

  // 仅收录课程地图中已明确的单日主题；其余天数在内容产出前不编造具体标题。
  const knownTitles = {
    "01": "金属材料",
    "02": "金属的化学性质（一）：金属与氧气、酸的反应",
    "03": "金属活动性顺序",
    "04": "金属的化学性质（二）：置换反应",
    "05": "金属资源的利用与保护",
    "06": "单元复习：金属和金属材料",
    "07": "溶液的形成",
    "08": "溶解度",
    "09": "溶解度曲线",
    "10": "溶质的质量分数",
    "11": "配制一定溶质质量分数的溶液",
    "12": "饱和溶液与不饱和溶液",
    "13": "单元复习：溶液",
    "14": "常见的酸：盐酸与硫酸",
    "15": "酸的化学性质",
    "16": "常见的碱：氢氧化钠与氢氧化钙",
    "17": "碱的化学性质",
    "18": "中和反应",
    "19": "pH 与溶液的酸碱度",
    "20": "单元复习：酸和碱",
    "21": "常见的盐：氯化钠、碳酸钠、碳酸氢钠、碳酸钙",
    "22": "复分解反应及条件",
    "23": "化肥：氮磷钾肥",
    "24": "化学肥料的使用",
    "25": "粗盐提纯",
    "26": "离子的检验与鉴别",
    "27": "单元复习：盐、化肥",
    "28": "人类重要的营养物质",
    "29": "化学元素与人体健康",
    "30": "化学与环境",
    "31": "综合提升：酸碱盐知识网络",
    "32": "综合提升：金属与溶液综合",
    "33": "综合提升：中考计算专练（一）",
    "34": "综合提升：中考计算专练（二）",
    "35": "综合提升：中考实验探究",
    "36": "综合提升：全册知识网络"
  };

  const readyDays = ["01", "02", "03", "04", "05", "06"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function moduleFor(dayNum) {
    return modules.find((m) => dayNum >= m.range[0] && dayNum <= m.range[1]);
  }

  const days = [];
  for (let i = 1; i <= 36; i += 1) {
    const key = pad(i);
    const mod = moduleFor(i);
    const title = knownTitles[key] || (mod ? `${mod.name} · 待发布` : "待发布");
    days.push({ day: key, title: title, module: mod ? mod.name : "", ready: readyDays.indexOf(key) !== -1 });
  }

  return { modules: modules, days: days };
}());
