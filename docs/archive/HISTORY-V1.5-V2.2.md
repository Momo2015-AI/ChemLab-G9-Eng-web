# ChemLab-G9-Eng 版本演进史（V1.5 → V2.2）

> 本文整合了各版本开发计划、阶段报告与一次性审计的结论性内容（2026-08-16 整理）。原始文件已删除；逐日开发对话记录见根目录 `DEV-REC.md`，现行架构见 `../ARCHITECTURE.md`，现行标准见 `../CONTENT-STANDARD.md`。

## V1.5 — 学习平台基础（2026-08 前）

建立了单页学习界面、每日学习路径、知识模块、题目引擎与进度成长 UI。`modules/` 目录（instruments/learning/questions/tasks 数据模型与 schema）是这一代的遗留物，现仅剩 `modules/questions/taxonomy/knowledge-graph.json` 作为图谱加载兜底，其余不再被生产代码引用。

## V1.6 — 内容与实验引擎分离（ChemLab-Learning-Engine-V1.5 架构落地）

目标：教学内容与 UI 代码分离；建立实验引擎基础、实验数据模型与器材库。`engine/`（assessment/experiment/mastery）与 `content/`、`schemas/` 结构在这一版成型。两次开发计划迭代后确立了"数据 → 服务/引擎 → 学习状态 → 视图"的完成度定义。

## V1.7 — 架构重构与学习系统重设计（最大一次重构）

- **动因**：`ChemLabApp` 单体职责过多、路由双轨、`modules/` 与 `content/` 边界不清、CI 只查语法。
- **落地**：bootstrap/application 组合根、`app/content-service.js` 内容边界、引擎边界规则（engine 不碰 DOM）、诊断独立成域（diagnosis-engine → remediation-engine → 定向再检测）、知识引擎收敛（canonical-knowledge-engine）、进度只读投影。分 12 个 Phase 完成（P1.2 路由内容迁移 → P1.12 入口迁移），并完成 P0.5 运行时稳定化与遗留清理。
- **认知层设计**：从"页面学习"转向"认知学习"——三重表征（宏观现象/微观模型/符号）、Mastery 不只看正确率、误解优先设计。
- 测试基线从 55 逐步提升。

## V1.8 — 产品化与目录冻结

定位：不二次重构，把学习闭环变成可用的产品化系统（回答"下一步学什么/为什么推荐"）。完成架构冻结审计、目录冻结审计（`tests/directory-freeze-v18.test.mjs` 仍在守护）、生产接线审计；门户化 UI（course/lab/knowledge/assessment/progress 五门户 + portal-shell）。

## V1.9 — 内容治理与 Day01 基准课（内容优先转向）

- 旧 320 题题库整体退役；确立 Source Registry（S0-S3 来源分级）与 7-Gate 内容审计。
- Day01 基准课（酸）完成题目替换/隔离/重建（question-quarantine、production-overrides、8 道诊断题）。
- 仓库深度清扫两轮：删除 `modules/lessons/`、`services/`、旧评估层；`content/` 成为唯一生产内容源。
- 测试基线 66 → 117；CI 增加内容完整性门禁。

## V2.0–V2.1 — 课程重建与学习中心

- 旧 36 课占位内容全部删除，按"模板课程零容忍"重建：lesson-01《物质的变化与性质》（8 步引导学习+实验+练习+诊断+21 题 mastery+迁移题）、lesson-02《化学是一门以实验为基础的科学》、lesson-03《酸入门》。
- 知识图谱 v2.0（12 节点/136 关系）；课程学习流程基准冻结（理解→…→95% Mastery）。
- 学习中心/门户导航重接线；遗留课程体系守卫测试（legacy-curriculum-guard）。
- V2.0 架构审计（2026-08-12）确认单入口/单内容源/单图谱。

## V2.2 — 学习闭环加固与工程清理（2026-08-16，现行）

全项目架构与学习流程审查后的修复轮（详见 `../DEV-REC-2026-08-16-LEARNING-LOOP-HARDENING.md`）：

- 学习闭环四硬伤修复：recheck 本课池+错题优先、mastery 失败可重试、主观题同义词组评分、实验观察不再中途劫持阶段。
- transfer 接入专属每课题池（≥80% 及格），不再复读 mastery 题。
- localStorage 容错（配额/损坏/上限/迁移）；application.js 按路由重构；quiz 详情乱码修复。
- 死代码清除：旧评估门面、`content/assessment/` 层（含同 ID 冲突源）、8 个死脚本、冗余工作流。
- 知识图谱 v2.1（+safety-awareness 节点、+85 条关联）；三课 mastery 计数对齐 21/20。
- 部署改为 runtime-only `dist/`（build-pages.mjs）；测试基线 133。
- 文档整合：92+ 份文档收敛为现行标准 + 本历史（本次清理）。

## 现行路线（原 ROADMAP-V2.2-FROZEN 的有效部分）

1. 内容优先：逐课扩展（当前 3/36），每课过 7-Gate，禁止模板复制。
2. Source Registry 落地登记（`content/sources/` 目前 PENDING）。
3. 完成后进入自适应推荐（利用进度/掌握度/实验证据/前置关系）；AI 导师明确延后。

冻结原则：不重设计 `core/ engines/ controllers/ content/` 学习内核；前端体验层可演进。
