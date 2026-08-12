# ChemLab-G9-Eng-web Roadmap Freeze

## Product target

V2.2 is the first-stage product completion line. The immediate goal is to launch a polished, content-first Grade 9 chemistry learning platform.

## Near-term sequence

1. V2.0.5 — finish portal UI, global navigation, responsive/iPad UX, and cross-module learning navigation.
2. V2.1 — build the chemistry content intelligence layer: curriculum model, knowledge graph, experiment knowledge base, question model, and misconception model.
3. V2.2 — add adaptive learning recommendations using progress, mastery, assessment, experiment evidence, and prerequisite relationships.
4. Release — test the complete learning loop and publish the production site.

## Frozen architecture

Do not redesign the existing learning core while completing V2.2:

- `core/`
- `services/`
- `engines/`
- `controllers/`
- `content/`

The frontend experience layer may evolve without replacing the learning engines.

## Learning loop

`Course → Knowledge → Experiment → Practice → Diagnosis → Remediation → Recheck → Mastery → Next Learning Action`

## AI roadmap — deferred

AI Tutor and AI Agent work are intentionally deferred to a future major version. AI-related UI entry points and integration seams may remain, but AI is not a V2.2 release blocker.

The principle is: content quality, learning validity, and student usability come before conversational AI.

## Release principle

For V2.2, prioritize:

- scientific correctness
- curriculum alignment
- clear learning paths
- experiment quality
- misconception quality
- iPad usability
- accessibility and navigation
- reliable learning evidence

Avoid feature expansion that delays a stable public release.
