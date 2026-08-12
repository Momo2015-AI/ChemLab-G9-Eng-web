# DEV-REC — ChemLab-G9-Eng Web Development Record

> Purpose: maintain a continuous, repository-local record of major development conversations, decisions, audits, implementation actions, commits, and next steps so future work can resume without losing context.
>
> Recording rule: at each remote push/commit during this project, append a concise record of the relevant conversation and resulting engineering action. This is a development log, not a verbatim transcript; it preserves decisions, rationale, findings, implementation status, commit references, and next actions.

---

## 2026-08-12 — Content Foundation / DEV-REC established

The project is moving from architecture-first development to content-quality-first development. The agreed priority is to build trustworthy Grade-9 chemistry learning content before broad UI polish or future AI features.

Key concerns identified:

1. 36 lesson files contain generic placeholder teaching sections.
2. The question bank mixes genuine questions with placeholder questions; 60 placeholder questions across 12 families have been quarantined.
3. Diagnosis architecture exists but real misconception records were initially missing.
4. Experiment data was not yet connected to misconception/diagnostic data.
5. `day01.json` is a legacy/duplicate lesson artifact alongside `day-01.json`.

Agreed development order:

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

Content standards established:

- `docs/V1.9-CONTENT-STANDARD.md`
- `docs/V1.9-CONTENT-REVIEW-PROTOCOL.md`
- `docs/V1.9-CONTENT-AUDIT-METRICS.md`
- `docs/V1.9-DAY01-BENCHMARK-SPEC.md`

Central principle: **file count, question count, or text length does not equal learning completeness**.

---

## 2026-08-12 — Lesson readiness baseline

The lesson set was audited and classified as `rewrite-required`, not publication-ready. Generic learning objectives, new-knowledge text, worked-example text, and practice text are treated as content defects.

Added:

- `reports/V1.9-LESSON-CONTENT-READINESS-2026-08-12.md`

Commit: `66b72355506b6e5009c7d6911a82ea8108951bba`

---

## 2026-08-12 — Day 01 benchmark lesson built

Day 01 (`常见的酸`) was rewritten from a template into a real lesson covering objectives, prerequisites, HCl/hydrochloric-acid terminology, common acids, evidence-based reasoning, rust removal, equations, safety, worked reasoning, misconceptions, questions, retrieval, provenance, and review status.

`q-acid-005` was removed from Day 01 because its wording admitted multiple valid answers; `q-acid-006` replaced it.

Commit: `1edcd436096695c8d813ebd405dc58a882568fc5`

Day 01 remained `review`, not `ready`.

---

## 2026-08-12 — Day 01 misconception foundation

Added `content/misconceptions/day01-acid.js` with real misconception records for:

- HCl vs hydrochloric acid
- dilution direction
- acid–metal overgeneralization

Commit: `d8170da879bc752a1a8485ca29e152ec1a6ae8ff`

Added benchmark review record in `content/review/day01-benchmark-review.json`.

Commit: `96ddfeb2d1f2e36a27157fda6ddb1cfc5b3989c9`

---

## 2026-08-12 — Day 01 deep review and integration corrections

Deep review checked lesson, linked questions, experiment, misconceptions, and knowledge relationships.

Findings included:

- P0: incorrect experiment ID linkage; corrected to `exp-acid-rust`.
- P0: experiment lacked explicit common-mistake/misconception linkage.
- P1: HCl/hydrochloric-acid terminology issue in `q-acid-001`.
- P1: safety-sensitive `q-acid-004` requires independent verification.
- P1: observation and interpretation needed separation.
- P1: experiment conditions/stopping criteria needed clarification.

Updated lesson, experiment, and misconception files and added `reports/V1.9-DAY01-DEEP-REVIEW-2026-08-12.md`.

---

## 2026-08-12 — Day 01 diagnostic routing review

The next review checked whether misconception records actually diagnosed the intended learner error.

Findings:

- `mc-acid-metal-overgeneralization` had an inappropriate question mapping.
- `mc-acid-observation-inference` lacked a direct diagnostic question.
- HCl misconception used an inappropriate recheck.
- Rechecks should normally use new surface forms rather than simply repeat the diagnostic item.

Added:

- `content/questions/day01-diagnostics.js`
- `reports/V1.9-DAY01-DIAGNOSTIC-ROUTING-2026-08-12.md`

---

## 2026-08-12 — Day 01 runtime integration completed

`app/content-loader.js` was updated so the new diagnostic question module is actually loaded by the runtime. `app/content-service.js` maps `misconceptionIds` into the diagnosis registry while preserving legacy mistake fields.

The lesson manifest was corrected so all 36 lessons are no longer falsely marked `ready`.

Key commits:

- `377d0ec2c4956aac82d1ab3d486aac644c30b3eb`
- `2d706d8d3029681a8c60c9e416518e0e3da39156`
- `477aac466aef0ef41f02a51b16e8e00929205dd2`
- `cbd3b896aecb80dbffb31785689d69cce83b3721`
- `81434a80ccfdafd680200553998c79b9e880b8a0`

Day 01 remained **NOT READY**.

---

## 2026-08-12 — Day 01 diagnostic → remediation → recheck closure

The diagnostic/recheck layer was expanded to four distinct pairs covering HCl terminology, dilution safety reasoning, acid–metal overgeneralization, and observation versus interpretation.

Design rule frozen: a recheck must use a different surface form or context while testing the same underlying concept.

Key commits:

- `6c203f0a7b8cbfbed58f15fff6d5e9980d89a995`
- `522d58d739b021f580be12badaadf15a04d535e2`
- `37735ca72195926055671f9223b568a560c38cb1`
- `9ab0af0d0a22f920fb4a2c65877635ac920ce01e`

Day 01 remained **NOT READY**.

---

## 2026-08-12 — Day 01 final release-gate review

### Conversation / decision

The user requested continued deep review rather than moving on to Day 02. The review was expanded from structural linkage to scientific precision, Grade-9 suitability, safety boundary, and release-state consistency.

### Findings

1. The Day 01 lesson had four diagnostic questions available, but the lesson metadata listed only three. This was corrected so `q-acid-dx-004` is part of the diagnostic flow.
2. Student-facing safety content was too procedural around concentrated sulfuric acid. It was revised to teach the heat/splash hazard and require teacher-approved laboratory procedures rather than provide operational handling instructions.
3. The rust experiment is acceptable as a junior-high model only if Fe2O3 is explicitly framed as a simplified representation of rust composition; the final scientific review must verify this wording.
4. The production-bank `q-acid-001` terminology issue remains excluded from Day 01.
5. The production-bank `q-acid-004` safety-sensitive item remains excluded pending independent review/replacement.
6. Diagnostic and recheck content remains `review` until runtime and independent content review gates pass.

### Implementation

Updated:

- `modules/lessons/day-01.json`
- `content/questions/day01-diagnostics.js`

Added:

- `reports/V1.9-DAY01-RELEASE-GATE-2026-08-12.md`

Commit:

- Day 01 alignment: `0aa253282341438194f745081c3c4cb854d4d419`
- Diagnostic safety boundary: `4a8a91c47e255756a60cc357b53fd27a4b26c88a`
- Release gate report: `312f434bbdc1fad846e79d36fb1b72e62195bfc7`

### Current state

**DAY 01 = BLOCKED / NOT READY.**

Structural and diagnostic/recheck design gates pass. Publication remains blocked by independent scientific review, Grade-9 pedagogical review, item-quality review, knowledge-link verification, and final runtime/CI verification.

### Next action

Run the independent scientific and Grade-9 review against the complete Day 01 graph, then execute the final automated integrity gate. Do not mark Day 01 ready until all blockers are closed.

---

## 2026-08-12 — V2.1 learning UI redesign + deeper Day 01 audit

### Conversation / decision

The user requested a visual redesign because the current course page was too text-dense and visually crowded. The new direction is to use icons, color, cards, compact metadata, and a visible learning flow so a Grade-9 learner can understand the current task and next action without reading the whole page first.

### UI implementation

Updated:

- `views/v19-course-view.js`
- `frontend/themes/portal-content.css`

The lesson surface now uses:

```text
Hero
 ↓
Learning flow
 ↓
Action cards
 ↓
Knowledge cards
 ↓
Learning timeline
 ↓
Practice / experiment / diagnosis
```

The redesign reduces uninterrupted prose, uses visual modules for learning stages, keeps primary actions visible, and provides responsive layouts for desktop/iPad/mobile.

Added:

- `docs/V2.1-LEARNING-UI-STANDARD.md`

Key commits:

- `1fd44aee82dc666c7a9eafa630db17bd4b618c0b`
- `081b7fe469fdb985958e6d780c90be2fadf2f9c6`
- `cbe7dbacdbeb6956d8737bdff88e4655946bc2f4`

### Deeper Day 01 audit

Added:

- `reports/V1.9-DAY01-SCIENTIFIC-AGE-AUDIT-2026-08-12.md`

New findings:

1. The HCl classification example remains context-sensitive and should be rewritten so state/solution terminology is explicit rather than making terminology ambiguity part of the test.
2. Fe2O3 must remain explicitly framed as a junior-high simplified rust model in all future content; do not normalize rust as pure Fe2O3.
3. “Yellow solution” and post-rust-removal bubbling are conditional observations and must not be presented as universal guaranteed observations.
4. Safety diagnostics should assess hazard recognition and supervised-lab reasoning rather than procedural hazardous handling.
5. The new UI is considered a cognitive-load correction, not a content simplification: scientific content remains unchanged while presentation becomes more scannable.

### Current state

**DAY 01 = REVIEW / NOT READY.**

The UI direction is approved as the V2.1 learning-surface standard. Day 01 remains blocked by the outstanding terminology/item issue plus final independent scientific, Grade-9, knowledge-link, and CI gates.

### Next action

Finish the Day 01 content corrections, then run the complete release gate again. Only after Day 01 is genuinely READY should the V2.1 visual pattern be propagated to the remaining lessons.

---

## 2026-08-12 — Day 01 final item audit

### Findings

A focused audit of the production acid question set identified three concrete blockers:

1. **P0 — `q-acid-012`:** the answer key and explanation are internally inconsistent, and the question lacks sufficient apparatus assumptions to establish a unique pressure-change answer. It must be rewritten or replaced.
2. **P1 — `q-acid-001`:** its explanation incorrectly describes HCl as an aqueous solution. The benchmark must distinguish hydrogen chloride (HCl) from hydrochloric acid (aqueous HCl).
3. **P1 — `q-acid-004`:** the legacy fixed-concentration post-exposure instruction is not suitable as a generic student safety instruction. It remains quarantined pending independent safety review/replacement.
4. **P1 — `q-acid-011`:** Fe2O3 must remain explicitly presented as a simplified junior-high model rather than a claim that all real rust is pure Fe2O3.

### Engineering integrity correction

An attempted connector edit of the 320-question `question-bank.json` was detected as destructive because the update replaced the complete file with an incomplete reconstruction. The remote `main` reference was immediately restored to the pre-edit commit `35c83924bedae2bf2b307309d7e742b534abc766`; the destructive intermediate commit was removed from the active `main` history. No truncated question bank remains on `main`.

This establishes a new engineering rule: **never perform a full question-bank replacement unless the complete source is preserved; prefer isolated question modules or exact transformations.**

Added:

- `reports/V1.9-DAY01-FINAL-ITEM-AUDIT-2026-08-12.md`

Commit: `0b0cca2cbdb27b98d2e455300d95f61eadeb0006`

### Current state

**DAY 01 = BLOCKED / NOT READY.**

### Next action

Resolve `q-acid-012`, correct/replace `q-acid-001`, independently review/rewrite `q-acid-004`, then rerun the full Day 01 release gate. Do not propagate Day 01 to other lessons until the gate passes.

---

## 2026-08-12 — Day 01 blocker resolution pass

### Conversation / decision

The user requested that development continue from the final item audit. The identified Day 01 blockers were resolved through isolated runtime overrides rather than a destructive rewrite of the 320-question JSON.

### Content corrections

Added `content/questions/day01-production-overrides.js` with replacements for:

- `q-acid-001` — corrected HCl / hydrochloric-acid terminology.
- `q-acid-003` — converted the dilution item to hazard-recognition and supervised-safety reasoning.
- `q-acid-004` — removed the fixed-concentration post-exposure neutralization instruction.
- `q-acid-005` — replaced the ambiguous coexistence item with a unique-answer version.
- `q-acid-011` — explicitly framed Fe2O3 as a simplified junior-high rust model.
- `q-acid-012` — replaced the under-specified pressure item with a fully specified conceptual model.

Updated `content/experiments/exp-acid-rust.json` to preserve the observation/interpretation boundary and explicitly distinguish the Fe2O3 school model from real rust composition.

### Runtime / CI integrity

`app/content-loader.js` now removes the affected legacy IDs and appends the isolated replacements, preserving an effective 320-question set.

`scripts/content-integrity-v19.mjs` now validates the effective runtime question set, including the override records.

`.github/workflows/content-integrity.yml` now triggers when runtime question modules, experiments, or the content loader change; previously those changes could bypass the integrity workflow.

### Verification

Commit sequence:

- `88b855d7a209341a29a1601f7ccd5980b7254475`
- `5965172b3324626fa9a727087d2b7e77876f51c1`
- `2b989d8558e31ef39aa4113302f40364ff67ed11`
- `a38ffc5475a649d880ba7ebbf5faa1c7662e377b`
- `4c4a364335d7c0e00ae73a53c6e4ad4c47317f0e`
- `64e36a1e2d229511214040f9bab5fa39fb079c60`
- `61f64289fba2b02ce32ae798f99d404ad60ac535`

Added:

- `reports/V1.9-DAY01-BLOCKER-RESOLUTION-2026-08-12.md`

The `Content Integrity` workflow for `64e36a1e2d229511214040f9bab5fa39fb079c60` was observed running successfully into the verification phase; final conclusion must be checked after the latest documentation commit.

### Current state

**DAY 01 = REVIEW / NOT READY.**

The original P0/P1 item blockers have been addressed in effective runtime content. Publication is still blocked until the automated gate, final scientific/Grade-9 review, knowledge-link verification, and runtime verification all pass.

### Next action

Check the CI conclusion. If green, perform the complete Day 01 release-gate re-audit and only then consider changing Day 01 from `review` to `ready`. Do not start the 35 remaining lesson rewrites before the benchmark gate is genuinely closed.
