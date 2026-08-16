# ChemLab-G9-Eng Repository Canonical Map

Status: V2.2 文档整合后刷新 — 2026-08-16

## Purpose

Define ownership of repository areas so future development does not recreate duplicate runtime, content, schema, style, or compatibility layers.

## Canonical ownership

```text
index.html
  -> production entry point

app/
  -> application composition, routing, state, content loading, progress/mastery services

core/
  -> shared domain utilities and learning primitives

controllers/
  -> application interaction orchestration

engine/
  -> production assessment and experiment domain engines

frontend/
  -> current visual system, shells, components and presentation styles

views/
  -> student-facing page/view rendering

content/
  -> canonical educational content source
     curriculum/
     lessons/
     knowledge/
     questions/
     experiments/
     misconceptions/
     review/
     schema/

modules/
  -> legacy V1.5 数据模型遗留区；生产代码不再引用。
     仅 modules/questions/taxonomy/knowledge-graph.json 作为图谱加载兜底保留，
     其余待 Source Registry 落地后随内容重建一并处理

schemas/
  -> non-content/global schemas only. Content lesson/question schemas belong under content/schema.
     Keep a schema here only when it has a distinct non-duplicate owner such as experiment/instrument contracts.

scripts/
  -> engineering validation/audit tooling

tests/
  -> automated behavioral and architectural verification

reports/
  -> CI 审计脚本再生文件（content-integrity-v19、lesson-content-readiness-v19）；
     一次性日期报告已删除，不作为运行时源

docs/
  -> durable engineering/content standards and architecture decisions

.github/workflows/
  -> 单一 workflow：Validate + build-pages dist 组装 + Pages 部署（content-integrity 独立工作流已并入）
```

## Cleanup rules

1. One canonical record per educational entity under `content/`.
2. No new legacy/compatibility copy without an explicit migration contract.
3. A file is deleted only after production, test, CI, and documentation references are checked.
4. Historical reports remain when they provide audit evidence; transient generated outputs should not become architecture dependencies.
5. 全局题库文件端点已于 2026-08-16 移除：运行时题池显式由 content/questions/day01-*.js 与按课注册组成，禁止重新引入隐式题库文件端点。
