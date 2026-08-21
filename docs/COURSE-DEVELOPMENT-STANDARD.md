# ChemLab-G9-Eng Course Development Standard

**Status:** CANONICAL / MANDATORY  
**Version:** 1.2  
**Established:** 2026-08-12  
**Updated:** 2026-08-21 — added Section 16 (namespace/ID allocation) after a live ID-collision incident across parallel u02/u03/u04 lesson production.

## 1. Core principle
Build the course from authoritative sources and learning goals—not from a pre-existing question bank. The production order is:

`Sources → Curriculum Boundary → Curriculum Map → Knowledge Graph → Learning Objectives → Lesson → Explanation/Examples → Practice → Diagnostic → Remediation → Unseen Mastery → Transfer → Final Audit → Freeze`

## 2. Source hierarchy
1. 人教版九年级化学教材 and the exact approved project edition.
2. 人教版《教师教学用书》 for teaching intent, misconceptions, emphasis and classroom boundaries.
3. Wuhan junior-high chemistry examination materials for competency and item-demand calibration, not wording copying.
4. Applicable Hubei/Wuhan curriculum and examination policy documents when officially available.
5. Authoritative scientific references for factual verification beyond textbook scope.

Commercial question banks and general web material are supplementary and cannot silently override the canonical textbook/teacher-guide boundary.

## 3. Curriculum architecture
`Course → Unit/Chapter → Lesson → Knowledge Point → Skill → Experiment → Practice → Assessment`

The exact chapter sequence follows the designated canonical curriculum source. Convenience-driven reordering requires documented rationale.

## 4. Lesson contract
Every production lesson must define:
- observable learning objectives;
- prerequisites and dependencies;
- core concepts and boundaries;
- conceptual explanation from phenomenon/question to model, explanation and rule;
- age-appropriate visual models/interactions where useful;
- experiment purpose, apparatus, materials, procedure, observations, explanation, conclusion, safety and anomalies where applicable;
- worked examples where procedural reasoning is required;
- graduated practice from recognition/understanding through application and transfer;
- misconception and remediation links;
- source provenance;
- readiness/review status.

## 5. Learning and assessment architecture
Maintain linked Curriculum, Knowledge, Learning and Assessment maps. Assessment must connect knowledge → skill → question type → demand/difficulty → misconception → remediation.

## 6. Question production standard
Questions are generated only after objectives, knowledge links and an assessment blueprint exist. Every production item must carry a stable ID, lesson linkage, knowledge linkage, assessment target/skill, cognitive demand, type, prompt, answer/key or rubric, explanation, provenance/boundary note where required, and review status.

Training questions do not prove mastery.

## 7. 95% mastery standard
The project target is approximately 95% accuracy on representative unseen items for approved lesson objectives. The Golden Lesson protocol uses 20 unseen mastery items, 19/20 numerical threshold, constructed-response evidence, complete core-objective sampling, no unresolved critical misconception, and a separate transfer gate.

A raw 19/20 score MUST NOT automatically produce `MASTERED` if a critical misconception remains unresolved. Below-threshold performance triggers targeted remediation and a new, non-duplicated recheck.

The 95% target is lesson-level mastery evidence, not a guarantee of 95% on an external examination.

## 8. Audit gates
Every production lesson passes:
1. source/provenance audit;
2. scientific accuracy audit;
3. textbook/teacher-guide and curriculum-boundary audit;
4. Grade-9 suitability/pedagogical audit;
5. safety audit;
6. question-quality and ambiguity audit;
7. knowledge/assessment linkage audit;
8. misconception/remediation audit;
9. unseen-mastery validity audit;
10. transfer audit;
11. runtime/schema/test integration audit — run `npm test` and `npm run audit:content` locally before opening a PR; both must be clean, not just the scripts you think are relevant to your change;
12. namespace/ID allocation audit (Section 16) — enforced by `tests/content-namespace-integrity.test.mjs`, part of `npm test`;
13. release/freeze gate.

## 9. Wuhan calibration
Wuhan papers may calibrate competency, item demand, contextual forms, reasoning expectations and scoring expectations. They are not the textbook source of truth and copyrighted wording must not be copied.

## 10. Safety and age standard
Learner-facing content must not ask students to smell unknown substances, taste chemicals, handle hazardous materials, or perform unsafe experiments. Unknown-material reasoning uses teacher-controlled demonstrations or supplied observations/evidence.

## 11. Golden Lesson rule
Lesson 01 is Golden Lesson v1.0. Future lessons reuse its architecture and audit gates, not its wording. Each new lesson requires independent source mapping and audit.

## 12. Development-log rule
Every development session that changes the project MUST be recorded. Each log entry states date, work completed, decisions/rationale, audit findings, important commits/changes, and next action. Major content decisions must not exist only in chat history.

## 13. Content state and change control
Use explicit states such as `DRAFT`, `IN_REVIEW`, `REVISED`, `READY`, and `RETIRED`. Frozen lessons require focused re-audit for modifications. Do not add questions merely to increase counts.

## 14. Retired 320-question dataset
The retired 320-question dataset is not a seed, source, benchmark, or hidden fallback. Production questions resume from newly supplied source documents and approved blueprints.

## 15. Definition of done
A lesson is DONE only when content, assessment, mastery protocol, source mapping, audit evidence, runtime integration, development log and release state are complete.

## 16. Namespace and ID allocation (mandatory — read before writing any content file)

This section exists because parallel content production has repeatedly collided on the same IDs without anyone noticing until a runtime audit script crashed. The pattern each time: someone derives a question/step ID prefix from the numeric suffix of a `canonicalId` (e.g. `lesson-07-...` → `L07-`) without checking whether another in-flight lesson already claimed that prefix. `canonicalId` numeric suffixes are display artifacts, not a reservation system — treat them as such.

### 16.1 Before starting any new lesson

1. Pull `main` and read the current `content/curriculum/lesson-manifest.js` in full — not just the tail. Do not assume the highest `canonicalId` number reflects the highest reserved number; multiple people may be working on different `lesson-0N-*` slugs concurrently.
2. Run this check and confirm your intended ID prefix returns **zero** hits before writing a single question:
   ```bash
   grep -rl "\"L<N>-" content/lessons/ content/misconceptions/ content/knowledge/
   ```
   Replace `<N>` with the prefix number you intend to use. Any output means the prefix is taken — pick the next free integer, regardless of what your lesson's `canonicalId` number is.
3. Record your claimed prefix in `docs/PROJECT-STATUS.md` (or the active development log entry, per Section 12) the same day you start, so the next person's step 1 check actually finds it.

### 16.2 ID prefix is independent of `canonicalId`

The question/step ID prefix (`L<N>-Q01`, `L<N>-D01`, `L<N>-M01`, `L<N>-T01`, etc.) and the `canonicalId` numeric suffix (`lesson-07-...`) are **two separate namespaces**. Do not assume they match. When they collide with another in-flight lesson, keep the `canonicalId` (renaming it breaks any external references) and change the **ID prefix** instead — this repository's convention going forward is to keep ID prefixes strictly monotonically increasing across the whole project regardless of `canonicalId` numbering (query the check in 16.1 for the next free integer; do not reuse a lower number even if it looks unclaimed at a glance from directory listing alone — always grep first).

### 16.3 Misconception IDs are canonical-vocabulary-first, not lesson-first

Every `misconceptionIds` / `errorType` value used anywhere in `content/lessons/*.json` MUST already exist in `content/misconceptions/canonical-misconceptions.js` (as a canonical `id` or an `ALIAS_MAP` key) **before** the lesson referencing it is marked `ready`. Writing a plausible-looking `mc-*` string in a diagnostic question and moving on is how this repository silently accumulated 23 dangling references across one content batch — none of them caused a visible error until someone happened to run a full-repo scan.

Concretely: `npm test` must be run (and must include the misconception-vocabulary suite) as part of your own pre-merge checklist, not left to whoever merges after you. `tests/misconception-vocab.test.mjs` derives its knowledge-graph whitelist dynamically from `content/knowledge/knowledge-graph.json` — if a misconception's `knowledgeIds` doesn't resolve there, either the node needs to exist first or the misconception needs a different, already-existing node. Do not hand-add a knowledge node ID to a misconception entry that isn't actually in the graph "to make it work" — that recreates the same class of dangling reference from the other direction.

### 16.4 No hand-maintained lists that duplicate a real data source

If a test, script, or doc needs "the current list of released lessons" (or misconception count, or alias count, or any other fact that already lives in a JSON/JS data file), it must **derive that list at runtime from the data file**, not hardcode a copy of it inline. This repository has hit the same bug shape at least four separate times in one week: a hardcoded array in a test drifts out of sync with the real manifest/vocabulary the moment anyone else adds content, and the test then fails for a reason that has nothing to do with what the failing PR actually changed. When you must assert something about the full content set, write the assertion against `import ... from '../content/...'` output, never against a list you typed by hand.

### 16.5 Merge protocol when two lessons land on the same slot

If you discover — via `git pull` or a merge conflict — that another lesson has already claimed the `canonicalId` number or ID prefix you were using:
1. Keep both lessons' `canonicalId` values as-authored (do not rename either lesson's identity).
2. Renumber ID prefixes per 16.1–16.2, always keeping the earlier-committed lesson's prefix untouched and moving the later one to the next free integer.
3. Re-run `scripts/content-lesson-audit-v19.mjs` and `scripts/content-integrity-v19.mjs` after resolving — a clean git merge (no conflict markers) does not mean the content is internally consistent; both scripts must independently report a clean state before pushing.
4. `content/curriculum/lesson-manifest.js` carries an explicit `displayOrder` field (continuous `1..N`) separate from `day`/`sequenceNumber`. Slot the merged lesson into `displayOrder` by real curriculum position (which unit/课题 it teaches), not by merge arrival order or by its `day` number.
