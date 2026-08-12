# ChemLab-G9-Eng-web — V2 Deep Cleanup Final Audit

## Scope

This audit closes the repository deep-cleanup phase after the legacy 320-question bank reset.

## Decisions

- The legacy 320-question dataset is permanently retired and is not migrated or reused.
- `content/questions/question-bank.json` is the canonical future question-bank location.
- An absent question bank is a valid `RESET_PENDING_SOURCE_DOCUMENTS` state until new source documents are supplied.
- `content/schema/*` is the canonical content schema location.
- Legacy runtime/view/dashboard modules confirmed unreachable from production, tests, and CI were removed.
- Question taxonomy, schemas, learning/task contracts, and other future content infrastructure are retained until their ownership is explicitly migrated or retired.
- Historical reports remain audit evidence; versioned development documents are archived rather than silently deleted.

## Validation policy

A file is deleted only after static references, dynamic/data-driven references, test references, package scripts, and CI references are checked, and it is confirmed not to be canonical infrastructure.

## Content reset policy

No replacement questions are generated from the retired 320-question bank. New questions will be built only after the project receives the new source/course documents and passes source, scientific, grade-9 suitability, question-quality, and knowledge-linkage review.

## Next phase

Repository cleanup is considered complete when the current Build Check and Pages deployment pass on the latest `main`. Development then moves to source-driven curriculum/content reconstruction rather than further speculative deletion.
