# ChemLab-G9-Eng 运行时架构（现行）

> 本文合并自 V1.6-ARCHITECTURE、V1.7-ARCHITECTURE-AND-LEARNING-REDESIGN、V1.7-ENGINE-BOUNDARIES、V1.7-DIAGNOSIS-ARCHITECTURE、V1.7-KNOWLEDGE-ENGINE-CONSOLIDATION 与 architecture/learning-runtime-consolidation-v1 的现行有效内容，并更新为 2026-08-16 的实际代码结构。历史版本演进见 `archive/HISTORY-V1.5-V2.2.md`。

## 1. 分层结构

```text
index.html                          ← 唯一生产入口（noscript 兜底）
    ↓
app/bootstrap.js                    ← 仅负责 DOM 挂载与启动错误渲染
    ↓
app/application.js                  ← Composition Root（每路由独立渲染函数）
    ├── app/state.js                ← 状态 + localStorage 持久化（容错/上限/迁移）
    ├── app/router.js               ← hash 路由
    ├── app/content-service.js      ← 内容边界（稳定的应用侧 API）
    │     └── app/content-loader.js ← 规范课程 JSON 的 fetch/缓存
    ├── app/mastery-service.js      ← 掌握度证据边界（包装 MasteryEngine）
    │     └── engine/mastery-engine.js（EWMA）
    └── app/progress-projection.js  ← 进度只读投影
          ↓
controllers/                        ← 用户流程编排（不复制领域算法）
    ├── assessment-runtime-controller.js   练习/掌握/再检测/迁移会话
    ├── experiment-controller.js           实验会话与证据
    └── learning-controller.js             课程状态/阶段门控/完成策略
          ↓
engine/ + core/                     ← 领域引擎与领域策略
    ├── engine/assessment-engine.js        答案判定（choice/fill/constructed）
    ├── engine/experiment-engine.js        实验步骤/观察/校验
    ├── core/assessment/mastery-policy.js  95% 掌握判定（分数+覆盖+误解+主观题）
    └── core/diagnosis/*                   诊断→补救→再检测链
          ↓
views/ + frontend/                  ← 学生端渲染（只渲染数据与回调）
```

## 2. 边界规则

1. `engine/` 是领域引擎层：不查 DOM、不持有浏览器生命周期；`engine/` 内不出现应用组合逻辑。
2. Controllers 编排用户流程，不重复领域算法；视图只渲染数据与回调，不直接修改领域状态。
3. 内容加载归 `app/` 内容边界所有；`ContentService` 是应用侧唯一稳定内容 API。
4. 诊断独立成域（`core/diagnosis/`），供评测与实验两条证据链共用，输出补救/再检测，不在各引擎内重复实现。
5. 诊断题目注册表（`question-knowledge-map.js`）同时是唯一的 `knowledgeIdsOf` 知识点提取实现，全仓库不得再写第二份字段兼容逻辑。
6. 删除 `engine/`、`core/` 下任何文件的前提：无生产引用、无测试引用、有规范替代且替代有回归覆盖、全量测试保持绿。

## 3. 学习闭环与数据流

```text
引导学习(guided) → 实验(experiment) → 练习(practice) → 诊断(diagnosis)
      → 补救(remediation) → 再检测(recheck) → 95%掌握(mastery) → 迁移(transfer)
```

- **证据流**：作答/实验观察 → `recordEvidence(knowledgeId, score, weight)` → EWMA 掌握度（权重：练习 0.25，实验 0.2）。
- **诊断流**：错误作答 → `diagnosis-engine` → weakPoints（本课池内错题知识点）→ `remediation-engine` 生成复习/练习/再检测步骤。
- **再检测（recheck）**：只从**本课资源池**（lesson 内嵌 + practice + diagnostic + mastery）选题，做错的题优先，不再触碰全局题池。
- **迁移（transfer）**：只从本课 `-transfer.json` 专属池出题（≥80% 记 passed），不复读 mastery 题。
- **掌握判定（mastery-policy）**：`passed = 分数≥95% ∧ 必需知识点全覆盖 ∧ 关键误解清零 ∧ 主观题通过`；失败可随时在结果页重试（`assessment.reset()`）。
- **实验观察策略**：空白=未记录（无证据、不改阶段）；无效观察记 0 分证据但**不**中途锁定补救——补救裁决推迟到实验完成时。

## 4. 内容数据模型

```text
Source Registry（content/sources/，登记中）
    ↓ 支撑
Curriculum（content/curriculum/lesson-manifest.js ← 唯一课程清单）
    ↓
Lesson（content/lessons/{id}.json）
    ├── {id}-guided-learning.json   引导学习步骤
    ├── {id}-experiment.json        实验资源
    ├── {id}-practice.json          基础练习
    ├── {id}-diagnostic.json        前置诊断
    ├── {id}-mastery.json           95% 掌握题库（含 constructed 主观题）
    └── {id}-transfer.json          迁移挑战题（constructed）
    ↓ 关联
Knowledge Graph（content/knowledge/knowledge-graph.json）
    节点（含 safety-awareness）+ 关系（question/prerequisite/related/experiment/commonMistake）
```

- 题目字段规范：`id / question(prompt) / options / answer(索引) / knowledgeIds / explanation`；主观题 `rubric.keywords` 支持**同义词组**（`[["新物质"],["生成","产生","形成"]]`）。
- 知识点 ID 只允许知识图谱节点词表（slug）；遗留 `KN-xx-xx`、`mc-acid-*` 词表不得再进入生产内容。
- 全局题池显式由 `content/questions/day01-*.js`（已审定替换题）+ 运行时按课注册组成；不存在隐式全局题库文件端点。

## 5. 状态与持久化

- 单键 `chemlab_v16`；写入全程 try/catch（配额/私密模式失败降级为警告，不打断答题）。
- 损坏 JSON 备份到 `chemlab_v16_corrupt` 后重置；`progress.history` 上限 100 条。
- 迁移：遗留扁平学习字段（含 map 形态 mastery）统一落入 `learning.lessons[lessonId]`；运行时只写按课状态，不写全局单槽字段。

## 6. CI/部署

```text
Validate: JS 语法 → npm test → runtime-audit → JSON 校验 → 内容完整性+课程就绪门禁
Deploy（needs: validate）: scripts/build-pages.mjs 组装 runtime-only dist/ → GitHub Pages
```

`build-pages.mjs` 从显式运行时清单组装站点；工程目录（docs/、reports/、tests/、scripts/）不发布到学生端。

## 7. 冻结原则（沿用）

- `main` 是唯一开发与发布分支；不再无理由重写基础架构。
- 不引入第二套 state / mastery / knowledge graph / diagnosis / recommendation 实现。
- 任何架构变更先有理由、影响分析、测试与审计记录（记入 `DEV-REC.md`）。
