# Learning Route & Page Content Render Audit V1.0

日期：2026-08-13
范围：ChemLab-G9-Eng-web 第一课 Golden Lesson

## 一、审查结论

当前内容数据基本齐全，但学习页面的“内容呈现”和“学习路由闭环”尚未完全一致。

核心页面能够呈现：
- 课程目标
- Guided Learning 8 步
- 实验入口
- 基础练习入口
- 诊断区
- Mastery 区
- 完成门禁

但以下路由仍存在产品级断点：

1. 练习完成后，结果页可以进入 Assessment Center，但不是直接进入本课的诊断详情。
2. 课程页“进入补救”目前跳到 `#/assessment`，而不是直接进入当前课程的 Remediation/Recheck。
3. Recheck 路由已经存在，但用户从课程页无法直接进入；需要由补救页面触发。
4. 实验完成后的继续按钮进入 Progress，而不是回到当前 Lesson，因此学习连续性被打断。
5. 页面没有把当前阶段 `LEARNING/PRACTICE/DIAGNOSIS/REMEDIATION/RECHECK/MASTERY` 明确投影为统一的当前状态。
6. Guided Learning 的即时检查是页面局部反馈，尚未统一写入 Learning Runtime 的 Attempt/知识证据状态。
7. `LearningController.getLessonPhase()` 中 `remediation` 与 `diagnosis` 的部分判断使用全局 learning 状态，存在跨课程污染风险。

## 二、当前路由矩阵

| 路由 | 数据 | 页面 | 当前链路结论 |
|---|---|---|---|
| `course/:lessonId` | lesson + guided | 完整 | 主要内容可呈现 |
| `quiz/:lessonId` | practice questions | 完整 | 正常 |
| `quiz:mastery` 变体 | mastery questions | 完整 | Session 已隔离 |
| `quiz:recheck` 变体 | targeted questions | 完整 | Runtime 已建立 |
| `experiment/:id` | experiment | 完整 | 完成后回 Progress，连续性不足 |
| `assessment` | diagnosis summary | 部分 | 不能代替课程内诊断详情 |
| `remediation` | remediation plan | 有页面 | 课程页当前没有直达入口 |
| `progress` | progress projection | 有页面 | 适合复盘，不适合作为本课流程中间页 |

## 三、建议的最终学习路由

`course/:lessonId`
→ Guided Learning
→ `experiment/:experimentId`
→ 返回 `course/:lessonId`
→ `quiz/:lessonId`
→ 结果自动回 `course/:lessonId#diagnosis-section`
→ `remediation/:lessonId`
→ `quiz/recheck/:lessonId`
→ `course/:lessonId#mastery-section`
→ `quiz/mastery/:lessonId`
→ 结果回 `course/:lessonId`
→ Mastery passed
→ 完成本课

## 四、页面呈现标准

Lesson 页面必须始终能够从单页回答：

- 我现在在哪个阶段？
- 我刚刚完成了什么？
- 我哪里做错了？
- 下一步应该做什么？
- 当前 Mastery 是多少？
- 为什么还不能完成本课？

## 五、P0 修复

1. 统一 lesson-aware 路由参数，所有中间页返回当前 lesson。
2. 课程页诊断按钮直接进入当前课程 Remediation。
3. Practice 结果返回当前 Lesson 的诊断区，而不是只进入全局 Assessment Center。
4. Experiment 完成后返回当前 Lesson。
5. Recheck 完成后返回当前 Lesson，并显示结果。
6. Lesson ViewModel 统一输出 `phase / diagnosis / recheck / mastery / canComplete`。
7. `getLessonPhase()` 的诊断、补救、再检测状态必须绑定 lessonId，禁止跨课污染。

## 六、P1 修复

1. Guided Learning 即时检查进入统一 evidence store。
2. 页面顶部流程条根据当前 phase 显示进行中/完成/锁定。
3. 刷新后恢复当前 lesson phase。
4. 结果页统一中文，不再只显示 `PRACTICE COMPLETE` 等开发文案。

## 七、验收路径

必须实际跑通：

课程首页 → 8 步学习 → 实验 → 返回本课 → 基础练习 → 错题列表 → 补救 → Recheck → Mastery 20题 → 19/20 → 解锁完成 → 刷新页面 → 状态保持。

在上述路径全部通过前，第一课不得标记 `Production Ready`。
