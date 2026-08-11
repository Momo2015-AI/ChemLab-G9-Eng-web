# ChemLab-G9

## 九年级化学智能学习平台 · V1.8

ChemLab-G9 是一个面向中国初中九年级学生的原生 ES Module 化学学习平台。V1.7 已完成核心架构收敛并通过 **55/55 基线测试**；V1.8 进入产品化阶段，重点是把已有学习闭环升级为可执行、可诊断、可补救、可重测、可推荐的智能学习系统。

> 课程学习 → 知识理解 → 实验探究 → 练习评价 → 证据 → 掌握度 → 诊断 → 补救 → 再检测 → 迁移 → 下一学习任务

项目坚持三个长期原则：**第一性原理、KISS、长期维护主义**。任何新功能或重构都不能破坏学习证据、掌握度、诊断、补救和再检测链路。

---

## V1.7 稳定基线

V1.7 已形成稳定的应用架构：

```text
index.html
    ↓
app/bootstrap.js
    ↓
app/application.js              ← Composition Root
    ├── app/state.js
    ├── app/router.js
    ├── app/content-service.js
    ├── app/content-loader.js
    ├── app/mastery-service.js
    └── app/progress-service.js
          ↓
controllers/
    ├── assessment-controller.js
    ├── experiment-controller.js
    └── learning-controller.js
          ↓
engine/ + core/
    ├── assessment
    ├── experiment
    ├── mastery
    ├── diagnosis
    └── canonical knowledge graph
          ↓
views/
```

应用层负责装配和流程协调；领域引擎负责学习领域规则；View 负责展示。V1.7 已消除主要重复实现，并保留必要的兼容 adapter 作为迁移安全网。

### V1.7 基线结果

```text
55 tests
55 pass
0 fail
0 skipped
0 cancelled
```

当前 55/55 是 V1.7 的稳定基线。V1.8 新增功能必须在此基础上扩展测试，而不是破坏已有契约。

---

## V1.8 产品目标

V1.8 的核心问题不是“再增加多少页面”，而是：

> **系统能否根据学生产生的学习证据，判断下一步最值得做什么？**

目标闭环：

```text
Lesson
  ↓
Knowledge understanding
  ↓
Practice / Experiment
  ↓
Evidence
  ↓
Mastery update
  ↓
Diagnosis
  ↓
Remediation
  ↓
Targeted recheck
  ↓
New evidence
  ↓
Mastery
  ↓
Next-task recommendation
```

最终系统应从“课程 + 题库 + 实验页面”升级为**以知识图谱和学习证据为核心的九年级化学自主学习系统**。

---

## V1.8 开发路线

```text
P1  Learning Center 2.0                         →
 ↓
P2  Knowledge ↔ Lesson ↔ Question ↔ Experiment  →
 ↓
P3  Assessment 2.0                              →
 ↓
P4  Diagnosis 2.0                               →
 ↓
P5  Remediation 2.0                             →
 ↓
P6  Experiment Lab 2.0                          →
 ↓
P7  Dashboard 2.0                               →
 ↓
P8  End-to-End Learning Loop                    →
 ↓
P9  Final Baseline / Release                    →
```

完整开发说明见：`docs/V1.8-DEVELOPMENT-PLAN.md`。

### P1 — Learning Center 2.0

学习中心需要回答“我现在应该学什么”，显示当前课程、今日任务、掌握度、薄弱点、补救任务和下一任务推荐。

### P2 — 内容语义映射

建立统一的：

```text
Knowledge ↔ Lesson
Knowledge ↔ Question
Knowledge ↔ Experiment
```

所有学习证据都可以回到统一知识语义。

### P3 — Assessment 2.0

在现有 Assessment → Evidence → Mastery 契约上增加难度、题型、诊断标签和自适应选题。

### P4 — Diagnosis 2.0

统一处理答题证据和实验证据，输出知识目标、置信度、错误类型、证据来源和建议动作。

### P5 — Remediation 2.0

生成动态补救路径：

```text
review → example → practice → experiment → recheck
```

根据学生表现调整路径，而不是固定脚本。

### P6 — Experiment Lab 2.0

实验形成完整学习证据链：

```text
prediction → operation → observation → explanation → conclusion
```

实验结果与答题结果进入同一个 Mastery / Diagnosis 合同。

### P7 — Dashboard 2.0

从统计页面升级为学习驾驶舱，展示掌握度、完成度、实验能力、薄弱点、待办任务和推荐原因。

### P8 — End-to-End Integration

必须覆盖真正的完整闭环：

```text
进入课程
→ 学习
→ 答错
→ Evidence
→ Diagnosis
→ Remediation
→ Targeted Recheck
→ 答对
→ Mastery 提升
→ 推荐下一任务
```

### P9 — Final Baseline

目标将测试规模逐步扩展到约 80–100 个高价值测试，重点增加跨模块和端到端覆盖，而不是为了数字增加无意义的单元测试。

---

## 架构边界

```text
app/          应用编排、服务、Composition Root
controllers/  学习流程协调
views/        UI 渲染
engine/       领域引擎
core/         canonical 领域模块与迁移兼容层
modules/      主要课程、题目等内容
content/      知识与实验等补充内容
schemas/      数据结构约束
docs/         架构、开发和审计文档
.github/      CI/CD
```

### 单一事实来源

- ContentService：应用侧唯一内容访问边界。
- Canonical Knowledge Engine：唯一知识图谱遍历和查询实现。
- MasteryEngine：唯一掌握度计算实现。
- DiagnosisEngine：唯一诊断决策实现。
- RemediationEngine：唯一补救规划实现。
- Controllers：协调流程，不重复领域算法。

### Compatibility Policy

兼容 adapter 可以暂时存在，但：

1. 不允许新增生产代码依赖 deprecated adapter；
2. 删除前必须完成仓库级 import audit；
3. 删除后必须保持完整测试和 CI GREEN。

---

## 数据合同

V1.8 统一使用以下核心语义标识：

```text
knowledgeId
lessonId
questionId
experimentId
evidenceId
errorType
difficulty
masteryScore
confidence
recommendedAction
```

所有会影响掌握度的学习事件都应该可以追溯到 evidence。

---

## 测试与 CI

项目使用 Node 原生 ES Module 测试：

```bash
npm test
```

V1.7 已通过：

```text
55 / 55
0 failures
```

CI 同时负责 JavaScript syntax、Node tests、内容 JSON、入口文件等基础检查。V1.8 增加功能后，最终 CI 还必须覆盖完整学习闭环。

每个 V1.8 Phase 的完成条件：

```text
implementation
→ tests
→ npm test GREEN
→ CI GREEN
→ documentation updated
→ commit on main
```

---

## 本地运行

项目为原生 ES Module，需要 HTTP 静态服务器：

```bash
python3 -m http.server 8080
```

访问：

```text
http://localhost:8080/index.html
```

不能直接双击 `index.html`，因为浏览器模块加载和资源访问需要 HTTP 环境。

---

## 技术栈

- HTML / CSS / JavaScript
- 原生 ES Module
- 无前端框架
- 无打包器
- GitHub Pages
- GitHub Actions
- Node.js 原生测试

---

## 项目愿景

打造一个适合中国初中化学学生自主学习的科学学习环境：

**不仅记住化学知识，更通过实验、证据、反馈、诊断、补救、再检测和迁移形成可持续的科学学习能力。**
