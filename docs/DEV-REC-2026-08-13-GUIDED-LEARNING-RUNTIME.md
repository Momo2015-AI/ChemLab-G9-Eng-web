# 开发日志 — Guided Learning Runtime 接入

日期：2026-08-13

## 本轮目标
将“**一步一步学**”从课程摘要卡片升级为真正的课程正文学习区域。

## 完成内容
- 建立 canonical lesson manifest，学生课程不再依赖已删除的 legacy `modules/lessons/day-*`。
- ContentLoader 仅从 canonical lesson source 加载生产课程。
- ContentService 增加 Guided Learning 内容接口。
- Lesson Runtime 加载对应 lesson 的 `*-guided-learning.json`。
- Course View 正式渲染 Guided Learning：步骤、正文讲解、即时检查、答案与解析。
- “开始一步一步学”按钮滚动到课程正文，不再只是导航卡片。
- UI 文案统一为中文：`本节课要掌握什么？`、`学习目标`、`核心学习`等。

## 教学设计原则
卡片只负责导航和摘要；真正的新知识必须进入正文讲解。每个步骤采用：

`情境/观察 → 概念 → 判断方法 → 即时检查 → 迁移`

## Lesson 01 当前正文
8 个学习步骤，覆盖：
1. 观察变化
2. 物理变化
3. 化学变化
4. 判断是否生成新物质
5. 物理性质
6. 化学性质
7. 四个概念综合比较
8. 陌生情境迁移

## 审计状态
`IN_REVIEW`

仍需完成：CSS 视觉细化、可交互即时检查、无障碍检查、运行时测试、CI 全绿和最终课程内容审计。
