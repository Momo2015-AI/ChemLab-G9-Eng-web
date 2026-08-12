# Development Log — 2026-08-12 — Lesson 01 Home Integration

## Goal
Make the audited Golden Lesson 01 directly discoverable and launchable from the learner-facing home page.

## Completed
- Added a dedicated Golden Lesson entry to the home page.
- Added direct `开始第一课` navigation to the first canonical lesson.
- Highlighted the 95% mastery target without implying that the home card itself proves mastery.
- Added the same Golden Lesson entry to the Course Center.
- Preserved the existing course list and navigation paths.
- Kept the first lesson fallback at Day 01 so the shell remains usable while content hydrates.

## Canonical learner path
`首页 → Golden Lesson 01 → 课程页 → 练习/实验 → 诊断 → 补救 → Unseen Mastery → Transfer → 掌握`

## Important boundary
This change exposes the existing audited Lesson 01 content. It does not mark later lessons READY and does not create a second source of truth for lesson content.

## Commits
- Home: `050391569d2d88433a2f397f5fdb7b299742cc15`
- Course Center: `70b225f5d3a86b6c40a7895ee49f7c7f49751547`

## Next action
Run the production build/CI and verify the deployed GitHub Pages home → Lesson 01 route end-to-end before starting Lesson 02 content development.
