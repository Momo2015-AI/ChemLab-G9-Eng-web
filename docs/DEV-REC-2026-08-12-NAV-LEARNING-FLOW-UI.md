# Development Log — 2026-08-12 — Navigation & Learning Flow UI

## Completed
- Added persistent textbook semester switcher: 上册 / 下册 in the main header and sidebar navigation.
- Added shared semester state via `window.chemLabTextbookTerm` and `chemlab:term-change` event for future content filtering.
- Reworked the home page into an explicit learning sequence rather than a collection of loosely ordered modules.
- Fixed Golden Lesson 01 identity on the home page so it is no longer derived from `lessons[0]`.
- Added larger lesson/module numbering for faster visual scanning.
- Moved secondary utilities (reports, knowledge map, remediation) below the primary learning path.

## Canonical home learning order
1. Platform/course orientation
2. Golden Lesson / current lesson entry
3. Learning Flow explanation
4. Curriculum lesson list
5. Supporting tools
6. Learning statistics

## Canonical lesson flow shown to learners
`学习理解 → 实验探究 → 基础练习 → 诊断与补救 → Unseen Mastery → Transfer`

## Design rationale
The home page should answer three questions in order: “What should I learn now?”, “How do I learn it?”, and “Where can I review/support my learning?”. Navigation and analytics must not compete visually with the primary learning path.

## Future rule
All new course modules must be placed according to the learning-flow model rather than being added as independent dashboard cards. Upper/lower textbook switching is a global navigation state and will become content-aware when both books are fully wired.
