# 2026-08-13 Learning Runtime Consolidation V1

## 本次审查结论

第一课连续出现“正确答案判错”“Mastery 串用旧题”“诊断为空/被覆盖”等问题，根因不是单一 UI Bug，而是学习事实分散在多个状态源：`state.progress`、`state.learning`、`AssessmentController.session`、`MasteryService`、`ProgressProjection`。

## 冻结的架构原则

1. **Canonical Lesson ID** 是课程唯一身份。
2. **AssessmentAttempt** 是一次答题事实的唯一来源；Practice / Recheck / Mastery 必须有明确且互斥的 `mode`。
3. 所有选择题运行时统一使用 `correctIndex` / `selectedIndex` 的 0-based 数字协议；内容层的 `answer: 2`、`answer: "C"` 等历史格式只能在 Loader/Controller 边界归一化。
4. 诊断必须基于整次 Attempt 聚合，保存错误题、知识点和错误类型，不能被后续正确题清空。
5. Recheck 是独立 Attempt，不复用 Practice / Mastery Session。
6. Lesson completion 只能由 Domain/Controller 验证 Mastery passed 后产生，UI 不能直接决定完成。
7. 学习状态需要持久化；刷新后必须恢复 lesson phase、诊断和 Mastery 状态。
8. 页面只消费稳定 ViewModel/状态投影，不直接依赖内部可变状态结构。

## 第一课目标状态机

`NOT_STARTED → LEARNING → EXPERIMENT → PRACTICE → DIAGNOSIS → REMEDIATION → RECHECK → MASTERY → MASTERED → COMPLETED`

学生可以回看前面阶段，但不得伪造后续结果。

## 本轮 P0/P1 修复范围

- Assessment Session 身份与 mode 隔离
- 答案协议统一
- Attempt 级诊断聚合
- Remediation 不再被后续正确题清空
- Recheck 独立状态
- Learning 状态持久化
- Mastery lesson-level 状态统一
- `markComplete()` 强制 Mastery passed
- Progress Projection 只从稳定持久化状态读取
- 为关键路径增加回归测试

## 验收路径

进入第一课 → 学习 → 实验 → Practice → 查看全部错题 → 补救 → Recheck → Mastery 20 题 → 19/20 解锁完成 → 刷新页面后状态仍正确。

本日志对应的结构性修复必须先通过后，才能批量复制课程模板。
