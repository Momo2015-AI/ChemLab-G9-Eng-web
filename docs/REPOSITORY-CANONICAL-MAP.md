# ChemLab-G9-Eng Repository Canonical Map

Status: V1.9 cleanup baseline — 2026-08-12

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
  -> runtime modules, adapters, indexes and explicitly documented compatibility/generated artifacts;
     never a second educational source of truth

schemas/
  -> non-content/global schemas only. Content lesson/question schemas belong under content/schema.
     Keep a schema here only when it has a distinct non-duplicate owner such as experiment/instrument contracts.

scripts/
  -> engineering validation/audit tooling

tests/
  -> automated behavioral and architectural verification

reports/
  -> generated or dated audit evidence; not runtime source

docs/
  -> durable engineering/content standards and architecture decisions

.github/workflows/
  -> CI, content integrity, and Pages deployment automation
```

## Cleanup rules

1. One canonical record per educational entity under `content/`.
2. No new legacy/compatibility copy without an explicit migration contract.
3. A file is deleted only after production, test, CI, and documentation references are checked.
4. Historical reports remain when they provide audit evidence; transient generated outputs should not become architecture dependencies.
5. Future cleanup must preserve the full question bank and other large source files; use isolated modules or exact transformations instead of destructive full-file reconstruction.
