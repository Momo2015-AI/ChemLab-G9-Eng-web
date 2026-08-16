# ChemLab-G9-Eng 项目状态

> 更新于 2026-08-16（V2.2 学习闭环加固之后）。历史版本状态见 `archive/HISTORY-V1.5-V2.2.md`。

## 当前阶段

**架构冻结 + 内容优先（Phase C3 → C4）**：3 门基准课程已交付并发布，进入逐课扩展阶段。

## 质量基线

```text
tests:            133 / 133 GREEN
runtime audit:    GREEN
content gates:    integrity + lesson readiness GREEN
deployment:       GitHub Pages（runtime-only dist/）
```

## 课程覆盖

| 课程 | 状态 | 内容 |
|---|---|---|
| lesson-01 物质的变化与性质 | ready | 8 步引导学习、实验、练习 8、诊断 3、mastery 21、迁移 4 |
| lesson-02 化学是一门以实验为基础的科学 | ready | 引导学习、实验、练习 13、诊断 3、mastery 21、迁移 4 |
| lesson-03 酸入门 | ready | 引导学习、实验、练习 13、诊断 3、mastery 21（迁移题待建） |

课程清单：`content/curriculum/lesson-manifest.js`（3/36 课，扩展须逐课过 7-Gate）。

## 学习闭环（2026-08-16 加固后）

```text
引导学习 → 实验 → 练习 → 诊断 → 补救 → 再检测(本课池+错题优先)
  → 95% Mastery(可重试) → 迁移(专属题池, ≥80%) → 完成本课
```

- 掌握判定 = 分数≥95% ∧ 知识点覆盖 ∧ 关键误解清零 ∧ 主观题(同义词组评分)通过。
- 实验观察：空白不计证据；无效观察不中途锁定补救，实验完成时统一裁决。
- 持久化：配额容错、损坏备份、历史上限 100、遗留状态自动迁移。

## 内容治理状态

- **Source Registry：PENDING**（`content/sources/`）——批量生产新题库前必须完成教材/课程标准登记。
- 知识图谱 v2.1：13 节点 / 221 关系（含 safety-awareness）。
- 全局题池 = day01 已审定替换题 + 按课注册；旧 320 题永久退役。

## 已知缺口（按优先级）

1. lesson-03 迁移题未建设（入口有诚实提示，不阻塞）。
2. 题目顺序固定（无洗牌），存在背题空间。
3. 知识详情页仅覆盖 2/13 节点。
4. misconception 词表（slug / M0x-* / mc-acid-*）未统一。
5. 浏览器端到端回归测试缺失（当前为 Node 单元/集成测试）。

## 工程约定

- `main` 唯一分支；变更流程：实现 → 测试 → runtime/content 审计 → 文档（DEV-REC.md）→ 提交 → CI GREEN → Pages。
- 本地开发：`python3 -m http.server 8080`（不能双击 index.html）。
- 文档导航见 `docs/README.md`。
