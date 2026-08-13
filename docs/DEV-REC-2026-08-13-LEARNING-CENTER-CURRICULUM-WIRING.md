# Development Log — 2026-08-13 — Learning Center Curriculum Wiring

## Problem found
The learner-facing course center still exposed the legacy `day-*` curriculum. The legacy `modules/lessons/day-01.json` is an old acid-base sequence, so numeric day routing could make the visible learning unit disagree with the canonical Lesson 01 content.

## Root cause
Three layers had drifted:
1. `modules/lessons/manifest.json` still contains legacy day entries and old module ordering.
2. `app/application.js` previously projected every manifest day into the learner-facing lesson list.
3. `views/home-view.js` used numeric `day` as the click target for lesson cards, while the canonical lesson model uses stable IDs.

## Corrected architecture
- Canonical lesson ID is the only learner-facing routing key.
- Legacy day-only entries are excluded from the learner-facing curriculum until explicitly migrated and audited.
- Golden Lesson 01 is fixed to `lesson-01-material-changes-properties`.
- Lesson 02 is fixed to `lesson-02-chemistry-as-experimental-science`.
- Course Center is organized by textbook unit rather than by the legacy acid-base module.
- Upper-book unit sequence is displayed as the canonical learning structure; only audited/available lessons are clickable.
- Lower-book units are represented as planned structure and do not expose unfinished legacy content.
- The textbook term switch now re-renders the Course Center.

## Learning sequence
01 Learning understanding → 02 Experiment/inquiry → 03 Practice → 04 Diagnosis/remediation → 05 Unseen Mastery (95%) → 06 Transfer.

## Quality gate
A legacy lesson may not become learner-facing merely because it exists in the repository. It must have a canonical ID, correct textbook/unit mapping, source audit, scientific audit, age-appropriateness audit, assessment linkage and runtime verification.

## Regression protection
Added `tests/learning-center-canonical.test.mjs` to prevent numeric day routing and legacy-only entries from re-entering the learner-facing course center.
