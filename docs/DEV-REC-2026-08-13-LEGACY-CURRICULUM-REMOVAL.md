# Development Log — 2026-08-13 — Legacy Curriculum Removal

## Decision
The legacy `modules/lessons/day-*.json` curriculum is no longer a student-facing or runtime content source. The project now uses canonical lesson IDs under `content/lessons/`.

## Completed
- Removed the legacy `modules/lessons/day-01.json` through `day-36.json` files.
- Removed `modules/lessons/manifest.json`.
- Kept canonical lesson content and assessment under `content/lessons/` and `content/assessment/`.
- Added a regression guard preventing recreation of `modules/lessons`.
- Searched the repository for legacy lesson references after removal; no active code reference was found.

## Rule
No production UI, router, loader, test fixture, or curriculum registry may reintroduce `modules/lessons/day-*` as a learning-content source. New lessons must use a stable canonical lesson ID.

## Status
Legacy curriculum removal: COMPLETE. CI validation and Pages deployment remain the release gate.
