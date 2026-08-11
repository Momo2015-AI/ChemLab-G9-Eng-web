# ChemLab-G9 Project Status

> Refreshed for V1.8 after the V1.7 baseline and production-wiring audit.

## Current release state

**V1.7 — Architecture baseline**

Previous verified baseline:

```text
55 tests
55 pass
0 fail
0 skipped
0 cancelled
```

V1.7 established the canonical application architecture. V1.8 now focuses on product completion and production wiring rather than another broad refactor.

## V1.7 architecture established

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

## Production wiring audit status

The V1.8 production audit identified and repaired the remaining wiring/data-boundary gaps:

```text
canonical graph path
→ graph normalization
→ question registration
→ assessment diagnosis
→ remediation generation
→ targeted recheck
→ multi-knowledge experiment evidence
→ data-derived remediation catalog
```

The production path is now explicitly tested by `tests/production-wiring-v18.test.mjs`.

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

Production wiring audit: `docs/V1.8-PRODUCTION-WIRING-AUDIT.md`.

Release/deployment workflow: `docs/RELEASE-AND-DEPLOYMENT.md`.

## Architecture contract

```text
app/          application orchestration
controllers/  workflow coordination
views/        presentation
engine/       domain engines
core/         canonical domain modules / adapters
modules/      primary content
content/      supporting canonical content
schemas/      contracts
docs/         project documentation
```

Domain ownership remains explicit:

```text
ContentService       → content access + normalization + registration boundary
Knowledge Engine     → graph semantics
MasteryEngine        → mastery calculation
DiagnosisEngine      → diagnosis
RemediationEngine    → remediation planning
Controllers          → orchestration only
Views                → rendering only
```

## Release discipline

All V1.8 work remains on `main`.

```text
code
→ tests
→ npm test GREEN
→ CI GREEN
→ Pages deploy
→ docs refreshed
→ commit
```

The single canonical repository is `Momo2015-AI/ChemLab-G9-Eng-web`. No secondary development or publication repository is part of the active workflow.

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
