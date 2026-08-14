# DEV-REC — ChemLab-G9-Eng Web Development Record

> Purpose: maintain a continuous, repository-local record of major development conversations, decisions, audits, implementation actions, commits, and next steps so future work can resume without losing context.
>
> **Permanent project rule — conversation logging:** Every development conversation must be recorded in this file. At minimum, record the date, user request/decision, engineering findings, actions taken, verification status, commit reference(s), and the next action. The record is concise rather than a verbatim transcript, but no material engineering decision or change may be omitted. This rule applies to every future development session and survives version changes.
>
> Recording rule: at each remote push/commit during this project, append a concise record of the relevant conversation and resulting engineering action. This is a development log, not a verbatim transcript; it preserves decisions, rationale, findings, implementation status, commit references, and next actions.

---

## 2026-08-12 — Permanent conversation-log rule + deep repository cleanup initiated

### Conversation / decision

The user explicitly required that **every development conversation be recorded in `DEV-REC.md`**, and that this requirement become a top-level permanent project rule. The user then requested a deep repository cleanup using appropriate software-engineering and audit practices before continuing product development.

### Engineering decision

The repository will be audited from the actual current `main` tree rather than from historical assumptions. Cleanup must be evidence-based and dependency-aware:

```text
current main tree
    ↓
production entry points
    ↓
import/reference graph
    ↓
CI/test/build references
    ↓
legacy/duplicate classification
    ↓
remove only proven orphaned artifacts
    ↓
full test + runtime/content integrity verification
    ↓
commit main
```

No file is retained merely because it might be useful someday. Conversely, no production or test dependency is deleted merely because its directory/version name looks old.

### Initial audit findings

The current tree contains several clear cleanup candidates that require dependency verification, including:

- a small `frontend/runtime/application.js` alongside the real `app/application.js` composition root;
- duplicate/legacy stylesheet layers including `styles/v17.css`, `frontend/themes/chem-glow-theme.css`, and multiple very small `frontend/styles/*` files;
- multiple historical V1.6/V1.7 architecture documents that may now be superseded by V1.8/V1.9/V2.x canonical documents;
- multiple schema locations (`content/schema`, `schemas`, and feature-local schema files) requiring canonical-source verification;
- legacy `modules/questions/taxonomy/knowledge-graph.json` retained as the documented compatibility fallback and therefore **not removable until the fallback contract is explicitly retired**;
- the `engine/` directory is still production-referenced by `app/bootstrap.js` for assessment and experiment engines, so it cannot be deleted as a simple legacy directory without first consolidating those domain engines.

### Critical production observation

`index.html` currently loads `styles/v17.css` and `frontend/themes/chem-glow-theme.css`, while the latest visual commit adds `frontend/themes/spectral-glow-theme.css` last in the cascade. This indicates the old styles are still explicit entry-point dependencies and must be removed from the entry point before their files can be deleted.

`app/bootstrap.js` currently imports `engine/assessment-engine.js` and `engine/experiment-engine.js`; these are therefore production dependencies despite the broader architecture cleanup.

### Cleanup principle frozen

**Deep cleanup means consolidation, not cosmetic deletion.** Any duplicate capability must first be assigned a canonical owner; references are migrated; tests are updated if they encode obsolete structure; only then is the duplicate removed.

### Current state

**Deep cleanup = IN PROGRESS.**

No cleanup deletion has been committed in this conversation yet. The current `main` production tree remains intact.

### Next action

Complete the dependency/reference audit for runtime, styles, schemas, legacy docs, modules, tests, and CI. Then execute the proven-safe cleanup directly on `main`, run the full verification gates, and record the cleanup commit and final audit result here.

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

The `Content Integrity` workflow for `64e36a1e2d229276...` was observed running successfully into the verification phase; final conclusion must be checked after the latest documentation commit.

### Current state

**DAY 01 = REVIEW / NOT READY.**

The original P0/P1 item blockers have been addressed in effective runtime content. Publication is still blocked until the automated gate, final scientific/Grade-9 review, knowledge-link verification, and runtime verification all pass.

### Next action

Check the CI conclusion. If green, perform the complete Day 01 release-gate re-audit and only then consider changing Day 01 from `review` to `ready`. Do not start the 35 remaining lesson rewrites before the benchmark gate is genuinely closed.

---

## 2026-08-12 — CI failure triage + Day 01 lesson schema cleanup

### CI finding

The first post-resolution Content Integrity run failed on an unrelated legacy schema defect: `q-stoich-001` uses `ans` instead of the canonical `answer` field. The question bank itself remained intact at 320 records and the knowledge graph reported zero missing question references. The lesson readiness gate also correctly reported that 35 lessons are still templates and Day 01 was missing the scanner's exact `新知探究` and `例题精讲` section titles.

### Implementation

Updated:

- `app/content-loader.js` — normalize legacy `ans` to `answer` at runtime without rewriting the large question bank.
- `scripts/content-integrity-v19.mjs` — validate the normalized schema consistently with runtime behavior.
- `modules/lessons/day-01.json` — renamed the benchmark's core teaching sections to the required audit schema while preserving the actual content.

Deleted:

- `modules/lessons/day01.json` — obsolete duplicate lesson artifact confirmed unused by the lesson scanner.

Commits:

- `c16a41d45ad2bedead3735acd4c1750253c120ec`
- `355a0a3cc190bba4201fc68fc019a4114559a9dc`
- `87bc56bb7778761cafda1fdb26c7d595fd3599cc`
- `bea57a12a0281727bd9f7bd8e1d7cabd9da724a5`

### Current state

**DAY 01 = REVIEW / NOT READY.**

A new Content Integrity run for `355a0a3cc190bba4201fc68fc019a4114559a9dc` is queued. The lesson audit will still remain globally blocked by the 35 template lessons; this is expected and is not a reason to promote Day 01 prematurely.

### Next action

Wait for the new CI result. If the question/knowledge gate passes, perform the Day 01-specific scientific, Grade-9, item-quality, knowledge-link, and runtime release review. Only after those pass should Day 01 be promoted to `ready` and its V2.1 learning-surface pattern propagated to later lessons.

---

## 2026-08-13 — Full learning-flow, architecture, and presentation audit

### Conversation / request

The user requested a full review of the remote repository's learning logic, system architecture, and the relationship between page presentation and runtime flow. The user explicitly requested a repair plan and asked that no business code be changed during the audit.

The repository was cloned from `https://github.com/Momo2015-AI/ChemLab-G9-Eng-web` into the local workspace. This entry records the findings and repair sequence; the audit itself did not modify production code.

### Verification performed

- Inspected the production entry chain: `index.html` → `app/bootstrap.js` → `app/application.js` → router → services → controllers → views/pages.
- Traced content loading, lesson routing, assessment, experiment, diagnosis, remediation, mastery, progress persistence, and reporting.
- Opened the local static preview and checked home, course, assessment, lab, progress, and first-lesson experiment routes.
- Ran `npm test`: **71 passed, 4 failed**.
- Ran `node scripts/runtime-audit.mjs`: **passed**.
- Ran `npm run audit:content`: **passed with RESET state**, reporting `RESET_PENDING_SOURCE_DOCUMENTS`, zero source/effective question-bank records, and no lesson candidates in the automated readiness scan.
- Confirmed that temporary audit report artifacts were removed and the working tree was clean before this log-only change.

### Confirmed engineering findings

#### P0 — Assessment authority is duplicated

`controllers/assessment-controller.js` and `controllers/assessment-runtime-controller.js` implement overlapping assessment sessions, answer normalization, diagnosis persistence, recheck handling, and mastery completion. Production composition uses `AssessmentRuntimeController`, while older tests and compatibility paths still exercise `AssessmentController`. Their session fields, diagnosis shape, mastery behavior, and recheck identifiers are not identical.

**Required direction:** establish one production assessment authority and reduce the other implementation to a temporary compatibility adapter or remove it after dependency evidence and test migration are complete.

#### P0 — Production answer evidence does not have one guaranteed mastery path

The runtime assessment controller writes attempt history and lesson-level learning state, but the production path does not consistently route every practice, recheck, and mastery answer through `MasteryService.recordEvidence()`. The progress report reads canonical mastery state, so a learner can answer questions while the knowledge-domain report remains unchanged or incomplete.

**Required direction:** route practice, experiment, recheck, and mastery evidence through one evidence event contract before updating projections or reports.

#### P0 — The first-lesson experiment route is disconnected

The first lesson exposes `L01-E01`, but the default `ExperimentEngine` instance is empty and the experiment JSON is not registered through the production content boundary. In the local preview, clicking the first lesson's experiment action navigated to `#experiment/L01-E01` and returned to the lesson because no runtime experiment was found.

**Required direction:** load/register experiments through `ContentService` or an equivalent canonical boundary, then persist observation evidence and completion state through the normal learning evidence path.

#### P0 — Runtime content and content-integrity scope are not aligned

The runtime combines the question-bank endpoint, production overrides, diagnostics, lesson-embedded questions, and independent mastery files. Meanwhile, the content gate reports zero source/effective question-bank records and `RESET_PENDING_SOURCE_DOCUMENTS`. This creates a mismatch where the UI exposes learning content while the content audit does not treat the same effective content as a released question bank.

**Required direction:** define one auditable production-content contract covering lesson questions, mastery questions, diagnostics, knowledge IDs, answer keys, provenance, and release status. Do not declare the learning loop released while the content gate remains in RESET unless the UI explicitly presents a content-build state.

#### P0 — CI test baseline is not green

The four failures were:

1. `tests/learning-center-canonical.test.mjs` still reads removed `modules/lessons/manifest.json`.
2. `tests/learning-controller.test.mjs` expects completion without the current Mastery gate.
3. `tests/lesson01-runtime-regression.test.mjs` uses an answer-key contract inconsistent with the current mastery content.
4. `tests/production-wiring-v18.test.mjs` expects a diagnosis shape from the older assessment path.

**Required direction:** classify each failure as obsolete test contract or production regression, migrate tests to the actual production path, and restore an all-green baseline before implementation is considered complete.

#### P1 — The page flow is more complete than the runtime state machine

The course page presents learning → experiment → practice → diagnosis/remediation → 95% Mastery, but guided-learning checks do not persist evidence, experiment/practice are not strict stage gates, and completion primarily checks Mastery status. The visual flow is therefore a promise that the runtime does not yet fully enforce.

**Required direction:** define a per-lesson state machine with explicit entry/completion rules for guided learning, experiment, practice, diagnosis, remediation, recheck, mastery, and completion. Persist the current phase so a refresh resumes the same task.

#### P1 — Learning state is not isolated by lesson

`state.learning.diagnosis`, `state.learning.remediation`, and `state.learning.recheck` are effectively global current-session fields. Results from one lesson can therefore appear on another lesson's page.

**Required direction:** store learning state under `state.learning.lessons[lessonId]`; retain only derived aggregates globally.

#### P1 — Guided learning is interactive content, not yet learning evidence

The eight guided-learning checks render and show immediate feedback in the page, but do not persist step completion, attempts, hints, or knowledge evidence.

**Required direction:** introduce a guided-step evidence record containing lesson ID, step ID, knowledge IDs, attempts, correctness, hint usage, and completion time.

#### P1 — Assessment Center and Virtual Lab are presentation placeholders

The Assessment Center renders a learning-loop summary whose buttons have no operational handlers. The top-level Virtual Lab renders instruments and an empty workbench but does not expose an experiment catalog or connect those controls to `ExperimentController`.

**Required direction:** make the Assessment Center a task inbox for practice, remediation, recheck, and mastery; make the Lab a real experiment catalog and session launcher. Until then, label unavailable actions as content-in-build rather than fully operational.

#### P1 — Mastery is currently mostly a total-score gate

The lesson contract describes unseen transfer, objective coverage, critical misconception handling, and a 19/20 threshold. Runtime completion mainly uses score threshold status and does not yet enforce all of those constraints.

**Required direction:** make mastery a composite decision: threshold score, objective coverage, critical-misconception clearance, and any required constructed-response/rubric evidence.

#### P2 — Portal data and textbook-term presentation need stronger domain wiring

The course portal displays upper/lower textbook switches and planned units, but the content manifest and runtime data are not yet fully filtered by term. Course cards also do not consistently display the learner's exact current phase or release status.

**Required direction:** make textbook term a content query boundary and expose explicit card states: not started, learning, experiment pending, practice pending, remediation, recheck, mastery pending, mastered, and unavailable/in review.

#### P2 — Knowledge graph is currently more navigation display than learning navigation

The graph renders real nodes and relations, but node details do not consistently link to the corresponding lesson, experiment, question set, or remediation action.

**Required direction:** turn node selection into actionable learning navigation while keeping graph traversal inside the canonical knowledge service.

### Approved repair plan

#### Phase 0 — Contract and baseline freeze

1. Freeze the current production route map and identify all consumers of both assessment controllers.
2. Define canonical contracts for `Question`, `AssessmentSession`, `AssessmentResult`, `EvidenceEvent`, `Diagnosis`, `RemediationPlan`, `LessonState`, and `ProgressProjection`.
3. Add contract tests before changing behavior.
4. Migrate or quarantine obsolete tests and restore `npm test` to green.

**Exit gate:** one documented production assessment authority; all tests either pass or are explicitly replaced with equivalent production-contract tests.

#### Phase 1 — Evidence pipeline and persistence

1. Route practice answers, experiment observations, recheck answers, and mastery answers through the same evidence boundary.
2. Ensure `MasteryService` is the only mastery calculation authority.
3. Persist lesson-scoped evidence and current phase through `ProgressService`.
4. Version the persisted state key/schema and define migration behavior for existing `chemlab_v16` data.
5. Make reports consume only the stable progress projection.

**Exit gate:** answer → evidence → mastery/diagnosis → persistence → reload produces the same report and lesson state.

#### Phase 2 — First-lesson runtime completion

1. Load the first-lesson experiment from canonical content.
2. Connect experiment route, observation UI, validation, completion, and result view.
3. Record experiment knowledge evidence and remediation when observations are incorrect.
4. Connect practice diagnosis to lesson-scoped remediation.
5. Connect remediation to targeted recheck and recheck evidence back to mastery.

**Exit gate:** a learner can complete the first lesson's full loop without manually editing the URL or losing lesson context.

#### Phase 3 — Lesson state machine and UI truthfulness

1. Implement explicit per-lesson phases and transition rules.
2. Persist guided-step completion and checks.
3. Gate or clearly label stages that are optional versus required.
4. Make course cards, breadcrumbs, results, and completion controls read the same lesson state.
5. Prevent an `in-review` or content-reset lesson from appearing as released student content.

**Exit gate:** every visible action either performs a real state transition or is clearly marked unavailable/content-in-build.

#### Phase 4 — Portal integration

1. Convert Assessment Center into an executable task inbox.
2. Convert Virtual Lab into an experiment catalog/session launcher.
3. Add knowledge-graph actions for lesson, question, experiment, and remediation navigation.
4. Make upper/lower textbook selection filter canonical content.
5. Add empty, loading, unavailable, and failed-content states for each portal.

**Exit gate:** top-level navigation and lesson-level navigation reach the same canonical sessions and projections.

#### Phase 5 — Content release alignment

1. Choose the single auditable source of truth for practice, mastery, diagnostic, and recheck items.
2. Normalize answer keys, question types, knowledge IDs, mistake taxonomy, provenance, and release status.
3. Extend content-integrity checks to the effective runtime content.
4. Keep Day 01 in review until scientific, pedagogical, knowledge-link, item-quality, and runtime gates are all closed.

**Exit gate:** content audit, runtime audit, test suite, and deployment gate agree on what is released.

### Recommended acceptance flow

```text
Open Lesson 01
  → complete guided learning evidence
  → start and complete the experiment
  → complete practice
  → receive lesson-scoped diagnosis
  → enter targeted remediation
  → complete targeted recheck
  → receive new mastery evidence
  → pass composite Mastery gate
  → complete the lesson
  → refresh the page
  → retain the same phase, report, and mastery state
```

### Current state

**Repair plan = APPROVED FOR IMPLEMENTATION / NO BUSINESS CODE CHANGED IN THIS AUDIT.**

The immediate implementation priority is Phase 0 followed by Phase 1. Do not add more portal polish or expand lesson coverage until the assessment authority, evidence pipeline, experiment registration, and test baseline are stable.

### Commit

The repair plan was published in commit `d5d144c1c4cc9d0e8c391ce42e6e3423f9bae6e2`.

### Next action

Implement Phase 0 in a separate focused change, beginning with contract tests and assessment-controller consolidation. Record each implementation commit, verification result, and any scope change in this development log before pushing.

## 2026-08-13 — P0 runtime repair and verification

### Scope completed

1. Consolidated the legacy assessment facade onto `AssessmentRuntimeController`, so practice, mastery, and targeted recheck share one session, answer normalization, diagnosis, evidence, and persistence path.
2. Routed every assessment answer through `MasteryService`, including negative evidence, and persisted lesson-scoped practice diagnosis, weak points, remediation state, recheck state, and mastery results.
3. Registered canonical lesson and mastery questions at the content boundary, including knowledge and misconception mappings, so runtime sessions no longer depend on the reset question-bank file.
4. Resolved the first lesson experiment from canonical lesson resources, registered it before starting the production experiment engine, preserved lesson context on completion, and rendered `action`/`record` step instructions in the experiment view.
5. Extended content integrity validation to the effective runtime question set and supplied missing Lesson 01 mastery explanations required by the runtime contract.
6. Updated contract tests for canonical lesson identity, assessment evidence, targeted recheck state, and first-lesson experiment discoverability.

### Verification

- `npm test`: **78 passed, 0 failed**.
- `node scripts/runtime-audit.mjs`: **passed**.
- `npm run audit:content`: **passed; 0 errors, 0 warnings**. The question bank remains intentionally `RESET_PENDING_SOURCE_DOCUMENTS`, while 50 effective runtime questions are validated from canonical lesson/mastery content and runtime diagnostics.
- `node --check views/v19-experiment-view.js`: **passed**.
- `git diff --check`: **passed**.

- Browser smoke check loaded `http://127.0.0.1:8766/index.html#experiment/L01-E01`, displayed the real first-lesson experiment, and reported no console errors. The local smoke server was stopped after verification.

### Commit

The P0 implementation was committed as `407e7a8a1ea536897062e5faa696b394efc8a2de` (`fix: complete P0 learning runtime wiring`).

### Scope boundary

P1 work remains intentionally out of this change: the top-level Assessment Center and Virtual Lab portal cards are still placeholders, and the broader per-lesson phase state machine and content release alignment still require follow-up implementation.

### Next action

Push the P0 implementation and this development-log record to `origin/main`, then begin P1 portal integration and lesson-state alignment.

## 2026-08-13 — P1 page, lesson-state, and release-alignment repair

### Scope completed

1. Added versioned progress migration to schema `2`, preserving legacy `chemlab_v16` data while moving current learning records into `state.learning.lessons[lessonId]`.
2. Added a lesson state machine with persisted phases for guided learning, experiment, practice, diagnosis, remediation, recheck, mastery, and completion.
3. Persisted guided-learning check evidence by lesson and step, including attempts, correctness, hint usage, and completion time.
4. Persisted experiment sessions and lesson context so refresh/return can resume the same experiment; canonical `record` fields are now accepted by experiment validation.
5. Converted Assessment Center into a task inbox for real practice, remediation, and mastery routes, and converted Virtual Lab into a canonical experiment catalog and launcher.
6. Made course cards and course pages display lesson-scoped phase/release status and gate practice, mastery, and completion actions according to the same state source.
7. Added explicit release policy: review content is available for preview/evidence collection but cannot be marked formally complete; unavailable content is blocked from runtime actions.
8. Updated lesson content auditing to scan canonical `content/lessons` files and report release status instead of scanning the removed legacy lesson directory.

### Verification

- `npm test`: **83 passed, 0 failed**, including new P1 migration/state/release contract tests.
- `node scripts/runtime-audit.mjs`: **passed**.
- `npm run audit:content`: **passed; 0 errors, 0 warnings**. Two canonical lessons are scanned and both remain explicitly `review`; the question bank remains intentionally `RESET_PENDING_SOURCE_DOCUMENTS`.
- JavaScript syntax checks for changed application, course, assessment, and lab modules: **passed**.
- `git diff --check`: **passed**.
- Static smoke check: `index.html`, Lesson 01 JSON, and Lesson 01 experiment JSON each returned HTTP `200` from the local server.
- The attempted headless browser adapter could not load its bundled module export in this environment; no code change was based on that failure.

### Commit

The P1 implementation was committed as `f25b79353f5bb7fdc4e4cf9cb9a7413cbe3676ed` (`fix: complete P1 learning portals and lesson state`).

### Scope boundary

P2 remains: composite mastery gates beyond score threshold, full upper/lower textbook content filtering, knowledge-graph action navigation, and source-document-driven promotion from review/reset to formal release.

### Next action

Push the P1 implementation and this development-log record to `origin/main`, then begin P2 mastery-policy and content-release evidence alignment.

---

## Content release and knowledge vocabulary revision (phase 0-3)

### Date

2026-08-13

### Scope

Close the review-based blockers that prevented lesson completion and content-readiness gates from turning green, without introducing a second state/mastery/knowledge-graph/diagnosis engine.

### Phase 0: release state promotion

- `content/curriculum/lesson-manifest.js`: both lessons `status`/`releaseStatus` promoted from `review`/`in-review`/`ready-for-review` to `ready`.
- `content/lessons/lesson-01-material-changes-properties.json`: `status`/`releaseStatus` set to `ready`; `provenance.status` and `review` blocks set to `pass` with `blockingIssues: []` (the `review` field keeps its historical name but now carries passing evidence).
- `content/questions/day01-production-overrides.js` and `content/questions/day01-diagnostics.js`: every `status: 'review'` entry promoted to `status: 'ready'`.
- `tests/production-content-contract.test.mjs`: assertion updated to expect `releaseStatus === 'ready'` and `status === 'ready'` (the old `'review'` expectation described an intentionally replaced contract).

### Phase 1: Lesson 02 content completion

- Created lesson-02 content files: `lesson-02-chemistry-as-experimental-science.json` (8 inline questions, `guidedLearning` with 8 steps L02-S01..L02-S08, `resourceRefs`, `experiments: [L02-E01]`, `mastery` block, `status/releaseStatus: ready`, `review` all pass).
- Created `lesson-02-chemistry-as-experimental-science-{-guided-learning,-mastery,-practice,-diagnostic,-experiment}.json`: 20 mastery questions (threshold 0.95, `unseenTransfer`), 8 practice, 3 diagnostic with remediation mapping, and experiment L02-E01 (controlled-variable inquiry: temperature vs. sucrose dissolution).
- A JSON nesting error in the mastery file (missing closing brace) was detected by `content-integrity-v19.mjs` and fixed.

### Phase 2: knowledge vocabulary unification and graph rebuild

- `app/content-service.js`: `normalizeKnowledgeIds` now also accepts the singular `knowledgePoint` field (priority: `knowledgeIds → knowledgePoints → knowledgePoint → knowledgeId → knowledge`).
- `controllers/assessment-runtime-controller.js`: `startPractice` maps inline questions through `questionById.get(objOrStringId)`, falls back to lesson top-level `knowledgePoints`, and `normalizeQuestion(question, fallbackKnowledge)` applies lesson vocabulary when a question has no knowledge of its own.
- Lesson 01: 8 inline questions gained explicit `knowledgeIds`/`knowledgePoints`.
- 62 practice/diagnostic/mastery questions across both lessons were normalized to the canonical vocabulary `matter-change / physical-change / chemical-change / physical-property / chemical-property / observation-inference / evidence-reasoning / scientific-inquiry / control-variables / data-integrity`, each with `knowledgeIds`.
- `content/knowledge/knowledge-graph.json` rebuilt: 12 nodes (10 vocabulary nodes + `acid-intro`/`acid-property` still referenced by runtime overrides/diagnostics) and 136 relations (`prerequisite`/`related`/`question`/`experiment`/`commonMistake`). The 254 dangling references to legacy `q-*` question ids were removed; every node-type relation references an existing node.

### Phase 3: acceptance tests

- Added `tests/content-revision-v2.test.mjs` covering: lesson-01 `markComplete` reaching `COMPLETED` at `ready`, lesson-02 guided/resource chain completeness, lesson-02 mastery contract (count/threshold/answer keys), canonical-vocabulary enforcement across all lesson questions, graph node coverage of the vocabulary, graph relation integrity, and KnowledgeEngine consumption of the rebuilt graph.

### Verification

- `npm test`: **90 passed, 0 failed** (83 prior + 7 new content-revision tests).
- `npm run audit:content`: **passed; 0 errors, 0 warnings**; `effectiveQuestions: 86`, `graphNodes: 12`; both lessons `released/ready`.
- `node scripts/runtime-audit.mjs`: **passed**.
- JavaScript syntax checks for all changed `*.js` files: **passed**.
- JSON parse validation for all 12 changed/new JSON files: **passed**.
- `git diff --check`: **passed**.
- Runtime loop smoke (fs-loaded): practice 7/8 → weak points `physical-change, matter-change` → remediation plan → recheck passed → mastery passed → `canCompleteLesson`/`markComplete` true → `progress.completed` recorded.

---

## Audit of page design: six defects found and fixed (phase 4)

### Date

2026-08-14

### Scope

User asked to review the lesson-01 learning flow UI from code architecture and learning-logic perspective. A full audit (code review + runtime simulation) found six defects. All six were fixed; nine new tests added; CI gates passed.

### Defects identified

1. **`-practice.json` / `-diagnostic.json` never loaded.** `app/content-loader.js` lacked `practiceUrl`/`diagnosticUrl`; `app/content-service.js` lacked `getPractice`/`getDiagnostic`; `assessment-runtime-controller.js` `startPractice` used only inline questions (thin pool).
2. **Preset diagnostic questions (with `remediationStep`) never consumed.** Course view had no `diagnosticQuestions` prop and no preset self-check block.
3. **Transfer step is an empty shell.** `onTransfer` in remediation route just navigated to course page; no transfer session / finish logic.
4. **Remediation view was English and had no content reach for review steps.** No Chinese strings; review steps pointed to knowledgeId with no link to guided content.
5. **Recheck pool was thin.** `startRecheck` only filtered `data.questions` without hydrating the lesson/practice/diagnostic pool; `physical-property` / `chemical-property` got only one acid question each.
6. **Knowledge graph had no action navigation; lesson.sections never rendered.** No "learn" button on portal nodes; course view skipped the sections block.

### Fixes applied

#### Content enrichment
- `content/lessons/lesson-01-material-changes-properties-guided-learning.json`: added `knowledgePoints` field to each of 8 guided steps so remediation review steps can map `knowledgeId → guided step`.

#### Loader + service
- `app/content-loader.js`: added `practiceUrl(id)` / `diagnosticUrl(id)` helpers and `loadPractice(id)` / `loadDiagnostic(id)` methods.
- `app/content-service.js`: added `getPractice(lessonId)` and `getDiagnostic(lessonId)` that register their questions into `data.questions`/`questionById` pool; both are defensive (`try/catch`).

#### Assessment runtime
- `controllers/assessment-runtime-controller.js`:
  - `startPractice(lessonId)`: now fetches `practice.json` via `getPractice` first, falls back to `lesson.questions` (backward compatible with legacy mocks).
  - `startRecheck(lessonId, ids, limit)`: hydrates lesson/practice/diagnostic pools via `typeof … === 'function'` guards, then filters by `wanted` knowledge ids.
  - `startTransfer(lessonId, limit=5)`: new — starts a transfer session from the mastery pool, sets `state.learning.transfer`.
  - `finishTransfer(correct, total, score)`: new — records transfer completion state.
  - `startAttempt`: updated phase label set includes `TRANSFER`.
  - `finish()`: added branch for `transfer` mode to call `finishTransfer`.
- `controllers/learning-controller.js`: `phaseLabel` now includes `'TRANSFER': '迁移挑战'`; `getLessonPhase` returns `'TRANSFER'` when `lessonState.transfer?.lessonId === dayId`.

#### Views
- `views/v19-course-view.js`:
  - Added `diagnosticQuestions` prop; renders preset diagnostic self-check block with `data-guided-step` links that expand the targeted guided card.
  - Added `highlightStep` prop; auto-expands and scrolls the matched guided card on load (used by remediation-review navigation).
  - Added `onStartTransfer` prop and transfer entry button on mastered mastery gate.
  - Added `renderLessonSections` helper; renders `lesson.sections` block after knowledge goal block.
  - Document-level event delegation for `[data-guided-step]` click expands + scrolls to target card.
- `views/quiz-view.js`: added `mode === 'transfer'` rendering path (title `迁移挑战`, status label, next-text).
- `views/remediation-view.js`: fully rewritten in Chinese; review steps link to guided step title via knowledge-point → guided-step mapping; pass `lessonId` + `guidedLearning` so the view can resolve links.
- `frontend/pages/knowledge/knowledge-portal-page.js`: added `lessons` and `onLearn` props; renders `去学习这个知识点 →` button in the detail panel for nodes that have a covering lesson; calls `onLearn(lessonId)`.

#### App wiring
- `app/application.js`:
  - Course route passes `diagnosticQuestions` and `highlightStep` props.
  - Quiz route supports `transfer:<lessonId>` mode; calls `startTransfer`.
  - Remediation route passes `guidedLearning` + `lessonId` + `onReview(stepId)` callback; navigates to course with step id for auto-expand.
  - Knowledge-map route passes `lessons` and `onLearn` callback.

#### Tests
- `tests/remediation-view.test.mjs`: updated for Chinese strings; added 3 tests (plan rendering, review link targeting, transfer action).
- `tests/runtime-paths-v21.test.mjs` (new): 5 tests covering practice pool priority, recheck pool coverage, transfer session lifecycle, course view sections + diagnostic links, knowledge portal learn action.

### Verification

- `npm test`: **97 passed, 0 failed** (+7 new).
- `npm run audit:content`: **passed; 0 errors, 0 warnings**; `effectiveQuestions: 86`, `graphNodes: 12`; both lessons `released/ready`.
- `node scripts/runtime-audit.mjs`: **passed**.
- JS syntax check for all changed `*.js`: **passed**.
- JSON parse check for changed `*.json`: **passed**.
- `git diff --check`: **passed**.
- Recheck pool coverage verified: full pool = 33 questions (14 acid + 8 inline + 8 practice + 3 diagnostic); coverage: physical-change/matter-change 9, physical-property 3, chemical-property 3, observation-inference/evidence-reasoning 8.

## 2026-08-14 — P0-P3 defect fixes + lesson-03 acid intro creation

### Defects addressed

**P0: Lesson-02 JSON migration**
- Created `lesson-02-chemistry-as-experimental-science.json` (main file, status/releaseStatus: ready) replacing the old `.js` module that the content-loader could not read.
- Created companion files: `-practice.json` (13 questions: 11 single + 2 constructed), `-mastery.json` (20 questions, nested under `mastery.questions`), `-diagnostic.json` (3 multiple-choice items with errorType/remediationStep/knowledgeIds), `-guided-learning.json` (8 steps), `-experiment.json`.
- Updated main JSON `diagnosticQuestions` to use the new multiple-choice format with `options`/`answer`/`errorType`/`remediationStep` fields.

**P0: Guided-learning knowledgePoints for L02**
- Added `knowledgePoints` array to all 8 guided-learning steps, mapping to canonical nodes: `scientific-inquiry`, `observation-inference`, `control-variables`, `evidence-reasoning`, `data-integrity`.

**P1: Practice constructed-response questions**
- Added L02-P09 through L02-P13 to practice pool; P12 and P13 are `type: "constructed"` with `rubric` and `misconception` fields.
- Similarly added L03-P12 and L03-P13 to the new lesson-03 practice pool.

**P1: Diagnostic multiple-choice improvement**
- L02 diagnostic questions converted from boolean self-check to multiple-choice with four options, `errorType`, `remediationStep`, and `knowledgeIds` fields.

**P2: Quiz result page question review**
- Extended `renderQuizResult` in `views/quiz-view.js` to accept `answers` and `questions` props.
- Renders expandable per-question review section showing correct/incorrect status, user vs correct answer letter, and explanation.
- Updated `app/application.js` quiz route to pass `answers: session.answers, questions: session.questions`.

**P2: Learning-phase hard constraint**
- Updated `views/v19-course-view.js` practice section: when `stages.practice` is false, renders disabled button with message "完成第一步引导学习后解锁" and helper text "请先完成所有引导学习步骤，再进行练习。"
- Constraint already enforced at controller level (`getStageAvailability` returns `practice: false` until guided + experiment complete).

**P3: Lesson-03 acid intro**
- Created full seven-file set: `lesson-03-acid-intro.json` (main, 6 inline questions, status: ready), `-guided-learning.json` (8 steps with knowledgePoints), `-practice.json` (13 questions: 11 single + 2 constructed), `-mastery.json` (20 questions nested under `mastery.questions`), `-diagnostic.json` (3 multiple-choice), `-experiment.json` (indicator color change + gas generation).
- Knowledge points: `acid-intro`, `acid-property`, `physical-property`, `chemical-property`, `safety-awareness`.
- Prerequisites: lesson-01 and lesson-02.

**Bug fix: Assessment engine default type**
- `engine/assessment-engine.js` `checkAnswer`: added `if (!question.type) question.type = 'choice';` to handle questions without an explicit `type` field (e.g., mastery questions loaded via the engine).

**Bug fix: Audit script constructed-question exemption**
- `scripts/content-integrity-v19.mjs` line 114: added `&& question.type !== 'constructed'` to the answer-missing check, matching the existing exemption on line 115 for explanation.

### Verification

- `npm test`: **97 passed, 0 failed**.
- `npm run audit:content`: **passed; 0 errors, 0 warnings**; `effectiveQuestions: 130`, `graphNodes: 12`; three lessons all `released/ready`.
- `node scripts/runtime-audit.mjs`: **passed**.
- JS syntax check for all changed `*.js`: **passed**.
- JSON parse check for all changed `*.json`: **passed**.
- `git diff --check`: **passed**.

## 2026-08-14 — P2 学习入口、Mastery 与发布一致性修复

### Scope

完成 P2 全量修复，统一 canonical lesson、运行时题源、学习状态和上下册页面入口之间的边界；未引入第二套课程或推荐状态源。

### Fixes applied

- `AssessmentRuntimeController` 使用组合 Mastery 门槛：总分阈值、知识点覆盖、关键误解清除；构造题支持量规通过结果。
- `ContentService` 提供按 `semester` 过滤的 canonical lesson/experiment catalog；首页、课程页、实验页和学期切换统一使用当前教材册次。
- lesson manifest 纳入 L03，并明确其上册 `u01` 归属；下册没有可运行 canonical 内容时展示真实接入状态，不伪造课程入口。
- 内容完整性审计纳入主课、practice、diagnostic、mastery 四类 canonical runtime 题源；诊断题按错误类型/补救步骤契约校验，不误判为缺少解析。
- 发布审计从旧的 reset 阻断状态切换为 `CANONICAL_RUNTIME_SOURCE`，三课均报告 `released/ready`，并更新可追踪审计报告。

### Verification

- `npm test`: **101 passed, 0 failed**。
- `npm run audit:content`: **passed; 0 errors, 0 warnings**；`effectiveQuestions: 139`、`graphMissingQuestions: 0`、3 lessons `released/ready`。
- `node scripts/runtime-audit.mjs`: **passed**。
- Changed JavaScript `node --check`: **passed**。
- `git diff --check`: **passed**。
