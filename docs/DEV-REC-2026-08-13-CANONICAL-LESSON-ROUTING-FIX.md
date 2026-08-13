# Development Log — 2026-08-13 — Canonical Lesson Routing Fix

## Problem
The homepage/course portal displayed the intended Golden Lesson title but routed through `lessons[0].day` / numeric `01`. The canonical manifest still mapped day 01 to the legacy `modules/lessons/day-01.json`, whose title was `常见的酸`. As a result, clicking the first lesson opened the acid lesson.

## Root cause
The application mixed two identities:
- numeric `day` used as both display order and route key;
- canonical lesson content intended to be identified by a stable lesson ID.

The legacy day file therefore won the runtime lookup.

## Fix
1. Added canonical Lesson 01 content: `content/lessons/lesson-01-material-changes-properties.json`.
2. Added canonical Lesson 02 content: `content/lessons/lesson-02-chemistry-as-experimental-science.json`.
3. Added `canonicalId` to the curriculum manifest for Lessons 01–02.
4. Changed course portal Golden Lesson routing to the fixed canonical ID `lesson-01-material-changes-properties`.
5. Changed application lesson navigation and incomplete-lesson selection to use canonical IDs; numeric day is now ordering/display data.
6. Changed content loader to resolve canonical lesson IDs first. Legacy `modules/lessons/day-*.json` files remain compatibility data and cannot override canonical lessons.

## Invariant
`Golden Lesson 01` must always resolve to `lesson-01-material-changes-properties`, regardless of manifest ordering or legacy day-file contents.

## Verification target
Run production tests/CI and verify:
`Home → Golden Lesson 01 → course/lesson-01-material-changes-properties → 物质的变化和性质`.

## Status
Code fix committed. Production CI verification pending.
