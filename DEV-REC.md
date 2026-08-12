# DEV-REC — ChemLab-G9-Eng Web Development Record

> Purpose: maintain a continuous, repository-local record of major development conversations, decisions, audits, implementation actions, commits, and next steps so future work can resume without losing context.
>
> Recording rule: at each remote push/commit during this project, append a concise record of the relevant conversation and resulting engineering action. This is a development log, not a verbatim transcript; it preserves decisions, rationale, findings, implementation status, commit references, and next actions.

---

## 2026-08-12 — Content Foundation / DEV-REC established

### Conversation / decision

The project is moving from architecture-first development to content-quality-first development. The agreed priority is to build trustworthy Grade-9 chemistry learning content before continuing broad UI polish or future AI features.

The following content-quality concerns were identified as higher priority than continuing to expand the question bank:

1. The 36 lesson files contain core teaching sections that were generated from generic placeholder templates rather than real teaching content.
2. The question bank mixes genuine questions with placeholder questions; 60 placeholder questions across 12 families have been quarantined.
3. The diagnosis architecture exists, but real misconception records are missing.
4. Experiment data is not yet connected to misconception/diagnostic data.
5. `day01.json` is a legacy/duplicate lesson artifact alongside `day-01.json` and should eventually be removed after loader impact is verified.

### Agreed development order

```text
36 Lesson Content Audit
        ↓
Day 01 Benchmark Lesson
        ↓
Misconception Foundation
        ↓
Experiment × Misconception
        ↓
Lesson × Question × Knowledge × Misconception
        ↓
Question Rebuild
        ↓
36 Lesson Full Rewrite
        ↓
Content Integrity Gate
        ↓
UI / Learning Flow Final Polish
```

### Content standards established

New repository documents define:

- `docs/V1.9-CONTENT-STANDARD.md`
- `docs/V1.9-CONTENT-REVIEW-PROTOCOL.md`
- `docs/V1.9-CONTENT-AUDIT-METRICS.md`
- `docs/V1.9-DAY01-BENCHMARK-SPEC.md`

The central principle is: **file count, question count, or text length does not equal learning completeness**.

### Audit requirements

Every publishable content item must pass:

1. curriculum/source review
2. scientific correctness review
3. Grade-9 suitability review
4. content/item quality review
5. knowledge relationship review

For lessons, real teaching content and learning-flow completeness are also mandatory.

P0 defects block publication. P1 defects must be resolved before publication.

### Implementation status

A V1.9 content lesson audit and content integrity workflow are being built so template lessons, missing fields, broken IDs, placeholder distractors, unresolved review defects, and related integrity problems are detected automatically.

Day 01 is the benchmark lesson. It must be genuinely teachable and fully reviewed before its structure is propagated to the remaining lessons.

### This record

The user requested a dedicated repository document named `DEV-REC.md`. From this point forward, every substantive remote push/commit for this project should append a concise development record here, including the relevant conversation decision, implementation work, audit findings, commit reference, and next step.

### Next action

Complete the automated 36-lesson content readiness audit, then build and review Day 01 as the canonical benchmark lesson.

---
