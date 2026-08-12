# ChemLab-G9-Eng Content Build Plan

## Status

**Architecture: FROZEN**  
**Content phase: C0 — SOURCE INTAKE**  
**Production question bank: RESET / awaiting new source documents**

## 1. Purpose

This document converts the course-development and audit standards into an executable production workflow. It deliberately separates **source reconstruction** from **content authoring** and **question generation**.

## 2. Production pipeline

```text
S0 textbook / curriculum source
        +
S1 official curriculum requirements
        +
S2 scientific verification references
        +
S3 pedagogical references when needed
        ↓
Source Registry
        ↓
Scope & version lock
        ↓
Curriculum Map
        ↓
Knowledge Graph
        ↓
Learning Graph
        ↓
Assessment Graph
        ↓
Benchmark Lesson
        ↓
Experiments / visuals / worked examples
        ↓
Assessment Blueprint
        ↓
Production Questions
        ↓
Diagnosis / Remediation / Recheck
        ↓
7-Gate Audit
        ↓
READY
```

## 3. C0 — Source Intake

Before writing production lessons, register each supplied document with:

- source ID;
- title;
- issuing organization / author;
- edition/version;
- publication date when known;
- intended grade/course;
- scope covered;
- source level (S0–S3);
- local file/reference;
- role in production;
- review status.

The designated S0 source controls chapter/order/scope. If multiple candidate textbooks exist, do not silently merge their sequences; explicitly select a canonical curriculum source.

## 4. C1 — Curriculum Reconstruction

Produce:

- course scope;
- unit/chapter map;
- lesson boundaries;
- required experiments;
- prerequisite relationships;
- explicit out-of-scope topics;
- terminology conventions;
- assessment coverage map.

No lesson is marked `READY` merely because a file exists.

## 5. C2 — Knowledge Architecture

For each knowledge point record:

- stable ID;
- canonical name;
- student-facing wording;
- prerequisite knowledge;
- related/contrast/application relationships;
- required skill;
- common misconceptions;
- experiment linkage;
- assessment linkage;
- source provenance.

Maintain separate Curriculum, Knowledge, Learning, and Assessment graphs.

## 6. C3 — Benchmark Lesson

The first lesson is the production benchmark. It must demonstrate the complete contract:

```text
phenomenon/question
→ prior knowledge activation
→ conceptual model
→ explanation
→ rule / representation
→ experiment or evidence where appropriate
→ worked reasoning
→ guided practice
→ independent practice
→ transfer
→ misconception diagnosis
→ remediation
→ recheck
```

The benchmark cannot be promoted until all seven content gates pass.

## 7. C4 — Controlled Expansion

Only after the benchmark is `READY` should additional lessons be produced. Expansion is lesson-by-lesson, with each lesson independently auditable.

Do not bulk-fill lesson files with generic objectives, generic explanations, generic examples, or generic practice merely to increase coverage.

## 8. Question production gate

Questions are produced only after:

1. lesson objectives are stable;
2. knowledge IDs are stable;
3. assessment blueprint is approved;
4. misconception coverage is defined;
5. source provenance is recorded.

Every production question requires a stable ID, lesson/knowledge linkage, skill, difficulty, type, answer, explanation, provenance, and review state.

## 9. Release states

```text
DRAFT
  ↓
IN_REVIEW
  ↓
REVISED
  ↓
READY
  ↓
RETIRED
```

`READY` requires all required audit gates to pass. `BLOCKER` findings force a return to `REVISED` or `IN_REVIEW`.

## 10. Retired 320-question dataset

The former 320-question raw dataset is permanently excluded from this pipeline. It is not a source, seed, benchmark, fallback, or quality reference.

## 11. Immediate next action

The repository is ready for **C0 source intake**. The project owner must supply the textbook/course-standard documents that are to become the canonical source set. Once supplied, the next operation is source registration and curriculum-scope audit—not question generation.
