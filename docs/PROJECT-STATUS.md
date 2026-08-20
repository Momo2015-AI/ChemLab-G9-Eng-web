# ChemLab-G9-Eng 项目状态

> 更新于 2026-08-19 (自动生成，运行 `node scripts/gen-project-status.mjs` 刷新)。历史版本状态见 `archive/HISTORY-V1.5-V2.2.md`。

## 当前阶段

**架构冷卺 + 内容优先（Phase C3 → C4）**：5 门基准课程已交付并发布，进入逐课扩展阶段。

## 质量基线

```text
tests:            179 / 179 GREEN
runtime audit:    GREEN
content gates:    GREEN
deployment:       GitHub Pages（runtime-only dist/）
```

## 课程覆盖

| 课程 | 状态 | 内容 |
|---|---|---|
| lesson-01-material-changes-properties 物质的变化和性质 | ready | 8 step guided, 1 experiment, 8 practice, 3 diagnostic, 21 mastery, 4 transfer |
| lesson-02-chemistry-as-experimental-science 化学是一门以实验为基础的科学 | ready | 8 step guided, 1 experiment, 16 practice, 3 diagnostic, 27 mastery, 4 transfer |
| lesson-04-lab-safety-operations 实验安全与基本操作 | ready | 8 step guided, 1 experiment, 16 practice, 3 diagnostic, 21 mastery, 4 transfer |
| lesson-05-oxygen 空气与氧气 | ready | 8 step guided, 1 experiment, 16 practice, 3 diagnostic, 21 mastery, 4 transfer |
| lesson-03-acid-intro 酸入门：初识身边的酸 | ready | 8 step guided, 1 experiment, 13 practice, 3 diagnostic, 21 mastery, 4 transfer |

课程清单：`content/curriculum/lesson-manifest.js`（5/5 课，扩展须逐课过 7-Gate）。

**覆盖广度说明**：当前 5/5 课时、3/3 单元有内容（L01-material-changes-properties/L02-chemistry-as-experimental-science/L04-lab-safety-operations 上册第一单元“走进化学世界”，L05-oxygen 上册第二单元“我们周围的空气”，L03-acid-intro 下册第十单元“酸和碱”）。这是项目“先做深、再做广”的主动选择——已完成内容完整、判分链路可运行，但覆盖面仍窄；完整性与覆盖广度是两个维度，进度评估需区分看待。

## 学习闭环

```text
引导学习 → 实验 → 练习 → 诊断 → 补救 → 再检测(本课池+错题优先)
  → 95% Mastery(可重试) → 迁移(专属题池, ≥80%) → 完成本课
```

- 掌握判定 = 分数≥95% ∧ 知识点覆盖 ∧ 关键误解清零 ∧ 主观题(同义词组评分)通过。
- 实验观察：空白不计证据；无效观察不中途锁定补救，实验完成时统一裁决。
- 持久化：嬹量容错、损坏备份、历史上限 100、遗留状态自动迁移。
- 题目乱序：`shuffleQuestions` 支持依赖注入的 RNG，测试验证不改变原池、错题优先于乱序正确题。

## 内容治理状态

- **Source Registry：PARTIAL — S0 designation document awaited from project owner**（`content/sources/source-registry.json`）——状态待确认。当前 4/5 课程有来源标注。
- 知识图谱 v2.1：22 节点（upper 19 / lower 3）/ 245 关系，**全部节点均具备详情内容**（定义 / 补救目标 / 认知层次 / 误解 / 前置）。
- misconception 词表：30 个 canonical ID + 35 个 alias，`core/assessment/mastery-policy.js` 负责别名解析到 canonical 形式。
- 全局题池：263 题（CANONICAL_RUNTIME_SOURCE），旧 320 题永久退役。

## 虚拟实验

- `zone4.js`（566 行）：空气成分气泡图 + 燃烧剧场（5 种物质 × 空气/氧气对比）
- `zone11.js`（1068 行）：指示剂变色 + pH 彩虹条 + 浓酸稀释 + 中和滴定 pH 曲线 + 微观粒子
- 两模块均支持自适应画布（ResizeObserver + devicePixelRatio）

## 已知缺口（按优先级）

1. **Source Registry PARTIAL — S0 designation document awaited from project owner** —— S0 权威来源指定文档待项目所有者签批（需人工决策）。当前 4/5 课程有来源标注。
2. Browser E2E regression tests missing (Node-only unit/integration tests; innerHTML-based view layer has untestable paths).
3. 课程覆盖广度仍窄：5/5 课时，3/3 单元。建议按 u03→u04→u05→u06→u07→u08→u09→u11→u12 顺序逐课扩展。

## 工程约定

- `main` 唯一分支；变更流程：实现 → 测试 → runtime/content 审计 → 文档（DEV-REC.md）→ 提交 → CI GREEN → Pages。
- 本地开发：`python3 -m http.server 8080`（不能双击 index.html）。
- 文档导航见 `docs/README.md`。