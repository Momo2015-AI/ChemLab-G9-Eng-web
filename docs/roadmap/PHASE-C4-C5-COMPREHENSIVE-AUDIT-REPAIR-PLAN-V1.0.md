# ChemLab-G9-Eng-web Phase C4–C5

# 全面审查与修复计划 V1.0

**文档状态：** CANONICAL / MANDATORY FOR NEXT PHASE  
**建立日期：** 2026-08-27  
**基线：** `main` 最新已审查状态 `e6e5fb57cf270f0532d881a4f81c44da060a037e`

---

## 1. 核心目标

下一阶段的目标不是继续单纯增加课程数量，而是把现有系统收敛为一个真正可用、可验证、可持续扩展的九年级化学学习平台。

最终必须实现：

`权威来源 → 课程边界 → 学习目标 → 知识讲解 → 例题/即时检查 → 实验/证据 → 基础练习 → 诊断 → 针对性补救 → 再检测 → 95% Mastery → Transfer → 本课完成 → 下一课`

技术系统必须实现：

`Content ↔ Knowledge Graph ↔ Learning State ↔ Assessment Attempt ↔ Diagnosis ↔ Remediation ↔ Mastery ↔ UI/Router ↔ Browser E2E`

任何一层出现关键错误，都不得进入 `RELEASE_READY`。

---

## 2. 当前基线判断

### 2.1 系统规模

当前已有 **25 门课程 / 8 个单元**，课程生产、知识图谱、误解词表、内容审计和命名空间治理均已建立。最新 readiness report 已扫描 25 门课程。 

### 2.2 工程质量

当前项目状态记录：

- `npm test`: 183/183 GREEN
- runtime audit: GREEN
- content gate: 曾出现 BLOCKED/FAIL，需要以最新一致性扫描结果为准
- Browser E2E：尚未建立完整回归体系

### 2.3 主要风险

1. 浏览器端真实学习流程尚未被 E2E 完整证明。
2. 内容成熟度分层不够严格：部分课程已有 guided/practice/transfer，但尚无完整 diagnostic/mastery。
3. Source Registry 目前并非 25/25 完整覆盖。
4. 课程 manifest、lesson 数据和生成报告必须始终从同一 canonical snapshot 生成。
5. 95% Mastery 标准已经定义，但需要进一步落实为机器可验证的 Blueprint。
6. UI、Router、Learning State、Assessment Attempt 必须进一步实现单一事实源。

---

# 3. Phase 0：Canonical Source of Truth 收敛

## P0.1 建立 Canonical Lesson Model

统一并强制以下字段：

- `lesson.id`
- `lesson.canonicalId`
- `lesson.unitId`
- `lesson.semester`
- `lesson.displayOrder`
- `lesson.status`
- `lesson.releaseStatus`

禁止页面自行推断课程身份。

## P0.2 建立 Lesson Registry

所有系统通过统一 Registry 获取课程身份、单元、学期、显示顺序和发布状态。

## P0.3 所有报告只读 Canonical Data

`PROJECT-STATUS.md`、readiness report、统计数量等全部由脚本生成，不允许维护第二份手工事实源。

## P0.4 自动一致性检查

必须检查：

- Manifest `unitId == Lesson unitId`
- Manifest `semester == Lesson semester`
- Manifest `canonicalId == Lesson canonicalId`
- `displayOrder` 唯一且连续
- 所有 manifest lesson 文件存在
- 所有 lesson 资源引用存在
- 所有 knowledge / misconception / question / step 引用存在

### Definition of Done

`0 mismatch / 0 orphan / 0 dangling reference / reports reproducible`

---

# 4. Phase 1：Learning Runtime Consolidation

## P1.1 唯一 LessonLearningState

每个课程只有一个 lesson-scoped learning state：

```text
lessonId
phase
learning
experiment
practice
diagnosis
remediation
recheck
mastery
transfer
completed
```

所有阶段状态必须绑定 `lessonId`。

## P1.2 唯一 AssessmentAttempt

Practice、Recheck、Mastery、Transfer 统一使用：

```text
attemptId
lessonId
mode
questionIds
answers
results
score
knowledgeCoverage
misconceptions
completedAt
```

其中 `mode` 至少支持：

- `practice`
- `recheck`
- `mastery`
- `transfer`

不同 mode 不允许复用同一 Attempt。

## P1.3 统一答案协议

运行时只处理：

```text
selectedIndex
correctIndex
```

约定：

`0=A, 1=B, 2=C, 3=D`

历史 `answer: 2`、`answer: "C"` 等只允许在 Loader 边界转换，Assessment Engine 不再兼容多协议。

## P1.4 Attempt-Level Diagnosis

一次 Practice 完成后统一产生：

- `diagnosis.errors[]`
- `diagnosis.weakPoints[]`
- `diagnosis.errorTypes[]`
- `diagnosis.score`

不能只保留最后一道错误。

## P1.5 Lesson-aware Remediation

补救计划必须携带：

- `lessonId`
- `knowledgeIds`
- `resourceIds`
- `recheckQuestionIds`
- `status`

不能把学生突然送到无上下文的全局训练页。

## P1.6 Recheck 独立化

`mode = recheck`，使用新的、不重复原 Practice 的题目。

## P1.7 Mastery 独立化

`mode = mastery`，不得复用 Practice / Recheck session。

## P1.8 Domain 层完成门禁

`markComplete(lessonId)` 必须自己验证 Mastery 与 Transfer 条件；UI 只负责展示，不能绕过业务规则。

---

# 5. Phase 2：Mastery Quality System

## P2.1 Mastery Blueprint

每课必须建立目标到题目的覆盖矩阵：

```text
Objective A → n questions
Objective B → n questions
Objective C → n questions
...
```

## P2.2 Mastery 通过规则

最终统一为：

```text
score >= 95%
AND objectiveCoverage = 100%
AND criticalMisconception = 0
AND constructedResponse = pass
AND transfer = pass
```

19/20 只是数字阈值，不是唯一条件。

## P2.3 题库审计

检查：

- unseen
- 变式
- 陌生情境
- 多认知层级
- 核心目标覆盖
- 不与 Practice 重复
- 不与 Recheck 重复
- 答案唯一且正确
- 解析与答案一致

---

# 6. Phase 3：课程内容质量审查

每一课必须完成以下审查：

### P3.1 教材边界

依据项目冻结的来源优先级：

1. 人教版九年级化学教材及项目批准版本
2. 人教版《教师教学用书》
3. 武汉中考材料用于能力和题型校准
4. 湖北/武汉适用考试政策文件
5. 权威科学资料用于超教材事实核验

商业题库和一般网页资料不得覆盖 canonical textbook/teacher-guide boundary。

### P3.2 Source Registry

目标：**25/25 课程来源覆盖完整**。

至少记录：

- textbook
- teacherGuide
- examCalibration
- policy
- scienceReference

### P3.3 科学性

检查定义、现象、结论、反应条件、安全边界、单位、数值、图示和解析的一致性。

### P3.4 初三适龄性

避免过早大学化表达；复杂概念必须通过现象、模型、图示或分步推理落地。

### P3.5 教学闭环

每个课程至少能够回答：

> 学生现在学什么？为什么学？怎么理解？如何应用？错了为什么？如何补救？如何证明已经掌握？

---

# 7. Phase 4：武汉中考能力校准

建立统一 `Wuhan Calibration Matrix`：

```text
知识点
→ 真题年份
→ 题型
→ 核心能力
→ 认知层级
→ 评分点
→ 易错点
→ 课程训练位置
```

重点纳入武汉 2024、2025、2026 真题及后续历年真题。

原则：

- 真题用于能力/需求校准
- 不复制受版权保护的题面文字
- 不以单一真题代替教材知识边界

---

# 8. Phase 5：页面与学生学习流程重构

页面设计必须从“系统有哪些模块”转向“学生下一步需要做什么”。

## 8.1 第一屏

展示：

- 本课标题
- 今天学什么
- 建议学习时间
- 最终达成标准

## 8.2 核心学习

每一步必须有：

`知识讲解 → 例子/现象 → 图/实验 → 即时检查 → 解析`

不能只有标题卡片。

## 8.3 实验

统一：

`观察 → 记录 → 证据 → 解释 → 结论`

## 8.4 基础练习

从理解到应用逐级增加难度。

## 8.5 诊断

必须直接显示：

- 错了几道
- 哪几道
- 错在哪里
- 错误类型
- 对应知识点
- 下一步补救

## 8.6 补救

必须告诉学生：

> 为什么需要重新学习这一点，以及学完以后要重新验证什么。

## 8.7 再检测

针对薄弱知识点，使用未重复题目。

## 8.8 Mastery

明确显示：

`20题 / ≥95% / 未见变式 / 核心目标全覆盖`

## 8.9 Transfer

用独立情境检验真正的迁移。

## 8.10 完成本课

只有满足所有完成门禁后才显示可完成状态。

---

# 9. Phase 6：全路由审查

建立 Route Matrix：

| 路由 | 入口 | 返回 | lessonId | 状态要求 |
|---|---|---|---|---|
| `home` | 首页 | — | — | — |
| `course/:id` | 学习中心 | home | 必须 | lesson存在 |
| `experiment/:id` | course | course/:lessonId | 必须 | 当前课 |
| `quiz/:id` | course | course/:lessonId | 必须 | 当前课 |
| `remediation/:id` | diagnosis | course/:lessonId | 必须 | 当前课 |
| `quiz/recheck/:id` | remediation | course/:lessonId | 必须 | recheck |
| `quiz/mastery/:id` | course | course/:lessonId | 必须 | mastery |
| `transfer/:id` | mastery | course/:lessonId | 必须 | transfer |

任何学习路由丢失 `lessonId` 均视为 P0 缺陷。

---

# 10. Phase 7：Browser E2E

必须建立至少以下真实用户路径：

1. 首页 → 第一课
2. 第一课 → Guided Step 1 → Step 8
3. 即时检查 → 正确 → 解析
4. 即时检查 → 错误 → 解析
5. 课程 → 实验 → 完成 → 当前课
6. 课程 → Practice → 答题 → 正确判分
7. Practice → 错题 → Diagnosis 显示完整错误
8. Diagnosis → Remediation → Recheck
9. Recheck → Mastery
10. Mastery 19/20 → Mastered → Transfer → Complete
11. Mastery <95% → Remediation → 新 Recheck → 新 Mastery
12. 刷新浏览器 → 状态恢复

Browser E2E 是 Release Gate，不得以 Node unit tests 代替。

---

# 11. Phase 8：课程状态分级

停止使用单一 `READY` 表示所有质量维度。

推荐状态：

```text
DRAFT
CONTENT_READY
RUNTIME_READY
MASTERY_READY
RELEASE_READY
FROZEN
RETIRED
```

例如：

```text
L20
CONTENT_READY = true
RUNTIME_READY = true
MASTERY_READY = false
RELEASE_READY = false
```

当前存在尚无完整 Diagnostic/Mastery 的课程，因此不能全部视为最终发布级课程。

---

# 12. Phase 9：课程质量评分卡

每课 100 分：

| 维度 | 分值 |
|---|---:|
| 内容准确性 | 20 |
| 教材/教师用书对齐 | 15 |
| 知识图谱 | 10 |
| 教学设计 | 15 |
| Practice | 10 |
| Diagnosis | 10 |
| Remediation | 5 |
| Mastery | 10 |
| Transfer | 3 |
| Runtime / E2E | 2 |
| **合计** | **100** |

建议：

- `<90`：不得发布
- `90–94`：继续整改
- `≥95`：具备 Release Ready 基础
- 即使总分 ≥95，只要存在关键阻断项，也不得发布

---

# 13. Phase 10：双 Golden Lesson 验证

不要只用 Lesson 01 验证全部架构。

## Golden A

**第一课：物质的变化和性质**

代表：概念与证据推理型课程。

必须完成：

- 教材/教参对齐
- 武汉真题能力校准
- Guided Learning
- Experiment
- Practice
- Diagnosis
- Remediation
- Recheck
- 20题 Mastery
- Transfer
- Browser E2E

## Golden B

选择一个程序性或综合型课程，例如：

- 化学式与化合价
- 燃烧与灭火

用于验证模板是否可以跨课程类型复用。

---

# 14. Phase 11：内容扩展策略

在 Golden A/B 和 Runtime E2E 未稳定前，暂停无序增加课程。

推荐扩展顺序：

`U03 → U04 → U05 → U06 → U07 → 后续单元`

每新增一课必须独立通过完整审查，不允许因为已有模板就跳过 source / science / pedagogy / assessment / runtime gate。

---

# 15. Phase 12：最终 Release Gate

正式发布前必须同时满足：

```text
CONTENT              ✅
SOURCE 25/25         ✅
SCIENCE              ✅
PEDAGOGY             ✅
ASSESSMENT           ✅
DIAGNOSIS            ✅
REMEDIATION          ✅
MASTERY              ✅
TRANSFER             ✅
ROUTING              ✅
BROWSER E2E          ✅
CI                    ✅
PAGES                 ✅
```

任何一项 FAIL / BLOCKED，课程或版本不得标记为 `RELEASE_READY`。

---

# 16. 六个实际执行 Sprint

## Sprint 1 — Runtime Consolidation

完成：

- LessonLearningState
- AssessmentAttempt
- Answer Protocol
- Diagnosis
- Remediation
- Recheck
- Mastery

## Sprint 2 — Route & UI Consolidation

完成：

- lessonId 全链路保持
- 页面阶段统一
- 返回路径统一
- 当前阶段指示
- 页面中文化
- 学习状态可见

## Sprint 3 — Browser E2E

完成上述关键用户路径并加入发布门禁。

## Sprint 4 — Golden Lesson A

对 L01 做完整内容、题目、诊断、Mastery、Transfer 审计。

## Sprint 5 — Golden Lesson B

验证第二种课程类型。

## Sprint 6 — 全量质量分层

25 门课程逐课评估：

`Content / Source / Teaching / Assessment / Mastery / Runtime`

形成真正的 `RELEASE_READY` 清单。

---

# 17. 三项冻结原则

### 原则 1

**不再以题目数量衡量课程完成度。**

### 原则 2

**不再以自动测试全绿衡量学生学习流程完成度。**

### 原则 3

**不再以“有 JSON / ready”衡量课程已经可以上线。**

真正的 Done 是：

> 一个初三学生进入课程，不需要理解系统结构，就能自然完成整节课；系统能够可靠证明其是否真正掌握；任何错误都能被解释、补救、再验证；页面和路由在整个过程中保持课程上下文。

---

# 18. 下一阶段唯一优先级

**先把 L01 + Runtime + Browser E2E 做成可验证的 Golden Lesson，再以 L02/B 复验，最后批量推广。**

这是从“内容生产项目”进入“学习产品质量工程”的正式切换点。
