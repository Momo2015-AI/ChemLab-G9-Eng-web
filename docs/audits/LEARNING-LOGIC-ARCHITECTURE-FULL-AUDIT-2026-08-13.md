# ChemLab-G9 学习逻辑 × 系统架构 × 页面展示 全面审计

日期：2026-08-13
范围：Lesson 01 运行时，并以其作为全部课程的架构样板
结论：**需要一次结构性收敛，而不是继续局部打补丁。**

## 一、总体判断

当前系统已经具备课程、题库、诊断、补救、Mastery、进度和多层页面，但运行时存在多个“事实源”：

1. `state.progress`：持久化进度
2. `state.learning`：运行时学习状态
3. `state.currentQuiz / quizIndex / quizAnswers`：旧式答题会话状态
4. `AssessmentController.session`：当前答题会话
5. `MasteryService`：知识点证据与掌握状态
6. `progress-projection`：UI 汇总后的二次状态

这些状态之间没有一个统一的 Session/Attempt/Outcome 合约，导致页面、控制器和引擎可能看到不同的“真实情况”。

## 二、严重问题

### P0-1：学习事实重复存储
同一答题结果同时写入 session、state.learning、state.progress、MasteryService，缺少唯一事实源。

### P0-2：答案协议不统一风险
题库同时存在 `answer: 0/1/2/3`、`a: A/B/C/D` 等历史格式；运行时虽有转换，但仍缺统一 content contract。

### P0-3：Diagnosis 当前仍然是单次诊断语义
诊断引擎返回单题 diagnosis；控制器必须聚合整次 Attempt 的 errors / knowledge / misconceptions，否则页面无法展示完整错误列表。

### P0-4：Mastery、Practice、Recheck 会话边界依赖路由
路由到 quiz 时如果存在旧 session，必须明确以 `mode + lessonId + attemptId` 判断，否则会出现点击 Mastery 却继续旧题的问题。

### P0-5：课程完成条件存在双重事实
页面通过 `masteryPassed` 判断，但 `LearningController.markComplete()` 本身没有强制验证 Mastery。未来任何调用者都可能绕过门禁。

## 三、中等问题

### P1-1：Experiment 没有完整进入统一 Attempt/Outcome 模型
实验证据与答题证据没有统一计入同一学习闭环。

### P1-2：Remediation 现在由单一 diagnosis 生成
真实场景需要基于一个 attempt 的多个错误，按知识点聚合并生成最小补救路径。

### P1-3：Recheck 返回普通 quiz 路由
重新检测应该有明确 `mode=recheck`、独立 result、成功后重新开放 Mastery 的状态迁移。

### P1-4：UI 直接读取部分运行时状态
页面应该只读稳定 ViewModel，而不是依赖 `state.learning` 等内部结构。

### P1-5：Progress Projection 仍然偏“统计面板”
它不表达 Lesson 状态机：未开始 / 学习中 / 待诊断 / 补救中 / 待 Mastery / 已掌握 / 已完成。

## 四、课程应采用的唯一学习状态机

`NOT_STARTED`
→ `LEARNING`
→ `EXPERIENCE`
→ `PRACTICE`
→ `DIAGNOSIS`
→ `REMEDIATION`
→ `RECHECK`
→ `MASTERY`
→ `MASTERED`
→ `COMPLETED`

允许学生回看内容，但状态只能按明确规则前进；失败从 Mastery/练习返回 Diagnosis/Remediation，不允许直接跳到 Completed。

## 五、推荐架构

### A. Content 层
Canonical Lesson 是唯一课程身份；统一 Lesson Contract：
- lessonId
- objectives
- learningSequence
- guidedLearning
- experiments
- practiceSet
- diagnosisMap
- remediationMap
- masterySet
- completionPolicy

### B. Learning Domain 层
新增 `LessonLearningSession`：
- lessonId
- phase
- attemptId
- startedAt
- completedAt
- practiceAttempt
- diagnosisSnapshot
- remediationPlan
- recheckAttempt
- masteryAttempt
- outcome

### C. Assessment Domain 层
统一 `AssessmentAttempt`：
- id
- lessonId
- mode: practice | recheck | mastery
- questionIds
- answers
- results
- score
- knowledgeSummary
- completedAt

### D. Diagnosis 层
输入整个 AssessmentAttempt，而非只接单题结果：
`attempt.results → errors[] → knowledgeGaps[] → remediationPlan`

### E. UI 层
所有页面只消费 `LessonViewModel`：
- currentPhase
- phaseStatuses
- practiceSummary
- diagnosisSummary
- remediationSummary
- masterySummary
- canComplete

UI 不得直接判断业务规则。

## 六、页面重新编排

### 第一屏
标题 → 为什么学 → 本课目标 → 学习路线 → 当前状态 → 开始学习

### 学习阶段
每一步：讲解 → 示例 → 思考 → 即时检查 → 下一步

### 实验阶段
问题 → 观察 → 记录 → 解释 → 结论 → 概念回扣

### 练习阶段
先基础、再应用；结束显示：正确率、错误题、薄弱点

### 诊断阶段
必须显示：
- 本次错题列表
- 每题对应知识点
- 错误类型
- 为什么错
- 去哪里补救

### 补救阶段
只回到薄弱知识步骤，不重放整课；完成短练习后进入 Recheck

### 再检测
只测薄弱点；通过后才能回到 Mastery

### Mastery
独立题组；显示题数、进度、最终得分；通过 ≥95%，失败返回 Diagnosis/Remediation

### 完成页
显示：掌握率、已掌握知识点、仍可回看的内容、下一课入口

## 七、P0 修复顺序

1. 建立统一 `AssessmentAttempt` 合约并让 Practice/Recheck/Mastery 共用。
2. 建立统一 Lesson 状态机。
3. 把答案格式在内容加载时一次性标准化为 `correctIndex`。
4. Diagnosis 改为按整次 Attempt 聚合。
5. Remediation 改为按知识点聚合。
6. Recheck 使用独立 mode 与 attemptId。
7. `markComplete()` 内部强制验证 Mastery passed。
8. 建立 `LessonViewModel`，页面只消费 ViewModel。
9. 第一课端到端回归测试覆盖全部状态迁移。
10. 再把该架构模板复制到后续课程。

## 八、验收标准

以下全部通过才能把 Lesson 01 标为 Production Ready：

- 正确答案不会被判错
- Practice 与 Mastery 永不串题
- Diagnosis 展示本次全部错误
- 错误能定位知识点与错误类型
- Remediation 只针对薄弱点
- Recheck 能回写状态
- Mastery ≥95% 才能进入 MASTERED
- 未 Mastered 不得 Completed
- 页面不直接操作内部业务状态
- 刷新页面后学习状态不丢失
- 所有模块都使用同一个 lessonId
- 不存在 legacy lesson 数据绕过 canonical pipeline

## 九、最终建议

当前不建议继续给页面增加新功能。

应执行一次 **Learning Runtime Consolidation（学习运行时收敛）**：先统一状态、Attempt、Diagnosis、Remediation、Mastery 和 Completion，再继续扩大课程数量。
