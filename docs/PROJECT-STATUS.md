# ChemLab-G9 Project Status

> Last refreshed for V1.8 planning after the V1.7 55/55 GREEN baseline.

## Current release state

**V1.7 — Stable Baseline**

```text
55 tests
55 pass
0 fail
0 skipped
0 cancelled
```

V1.7 is considered architecture-stable. New development should prefer additive product evolution over another broad refactor.

## What V1.7 established

- V1.7 browser entry and Composition Root.
- Canonical ContentService boundary.
- Manifest-driven content loading.
- Canonical Knowledge Engine ownership.
- Assessment → Evidence → Mastery integration.
- Experiment → Evidence → Mastery integration.
- Canonical diagnosis contract.
- Remediation and targeted recheck flow.
- Progress projection and persistence boundaries.
- Node/CI-safe application construction and router behavior.
- CI baseline for syntax, tests, JSON and entrypoint validation.
- Legacy cleanup governed by KEEP / ARCHIVE / DELETE rather than directory-name heuristics.

## V1.8 objective

V1.8 turns the stable learning architecture into an adaptive learning product.

The product should continuously transform learner evidence into a justified next action:

```text
content
→ learning
→ practice / experiment
→ evidence
→ mastery
→ diagnosis
→ remediation
→ recheck
→ recommendation
```

## V1.8 workstreams

| Phase | Workstream | Primary outcome |
|---|---|---|
| P1 | Learning Center 2.0 | Actionable learner home and daily tasks |
| P2 | Semantic content mapping | Knowledge ↔ lesson ↔ question ↔ experiment |
| P3 | Assessment 2.0 | Diagnostic/adaptive assessment |
| P4 | Diagnosis 2.0 | Evidence-based diagnosis output |
| P5 | Remediation 2.0 | Dynamic personalized recovery paths |
| P6 | Experiment Lab 2.0 | Experiment as a first-class learning evidence source |
| P7 | Dashboard 2.0 | Learning cockpit and recommendation rationale |
| P8 | End-to-end integration | Complete learning-loop verification |
| P9 | Final baseline | Release-grade CI and regression protection |

Detailed plan: `docs/V1.8-DEVELOPMENT-PLAN.md`.

## Architecture contract

```text
app/          application orchestration
controllers/  workflow coordination
views/        presentation
engine/       domain engines
core/         canonical domain modules / adapters
modules/      primary content
content/      supporting content
schemas/      contracts
docs/         project documentation
```

Domain ownership remains explicit:

```text
ContentService       → content access
Knowledge Engine     → graph semantics
MasteryEngine        → mastery calculation
DiagnosisEngine      → diagnosis
RemediationEngine    → remediation planning
Controllers          → orchestration only
Views                → rendering only
```

## Release discipline

All V1.8 work remains on `main` unless a future change explicitly requires another strategy.

Each phase must finish with:

```text
code
→ tests
→ npm test GREEN
→ CI GREEN
→ docs refreshed
→ commit
```

A red `main` branch is not an acceptable intermediate release state.

## Definition of V1.8 complete

V1.8 is complete when a learner can complete the full adaptive loop:

```text
lesson
→ evidence
→ diagnosis
→ remediation
→ targeted recheck
→ mastery update
→ next-task recommendation
```

and the complete regression suite remains GREEN.

## Explicit non-goals

V1.8 does not require a frontend framework, backend service, cloud account system, second state-management solution, or new build system.
