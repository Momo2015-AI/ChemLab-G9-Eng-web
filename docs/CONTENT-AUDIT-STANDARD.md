# ChemLab-G9-Eng Content Audit Standard

## Audit gates

### Gate 1 — Source audit
Verify authority, edition/version, scope, provenance, and traceability. Core claims must have an approved source tier.

### Gate 2 — Scientific audit
Check definitions, terminology, equations, symbols, units, reaction descriptions, experimental claims, diagrams, and safety statements against authoritative scientific references.

### Gate 3 — Grade-9 suitability audit
Check prerequisite assumptions, vocabulary, abstraction, arithmetic load, reading load, cognitive load, examples, and experiment complexity. Remove unnecessary university-level detail.

### Gate 4 — Pedagogical/content audit
Check objective alignment, conceptual progression, misconceptions, explanations, visuals, examples, practice progression, feedback, and self-study usability.

### Gate 5 — Question-quality audit
Check uniqueness of answer, wording, distractors, data sufficiency, difficulty calibration, cognitive target, scoring logic, explanation quality, and absence of answer leakage or ambiguity.

### Gate 6 — Knowledge-linkage audit
Every lesson and question must resolve to canonical lesson/knowledge IDs. Verify prerequisite relationships, question-to-knowledge mappings, misconception links, and graph integrity.

### Gate 7 — Release audit
Verify schema, references, assets, navigation, accessibility basics, tests, runtime integrity, content integrity, and deployment readiness.

## Evidence requirements

Each audit finding records: item ID/path, gate, severity (`BLOCKER`, `HIGH`, `MEDIUM`, `LOW`), finding, evidence/source, required correction, owner/status, and reviewer/date when applicable.

## Severity rules

- **BLOCKER:** scientific error, unsafe instruction, broken canonical reference, invalid answer, or content that cannot be released.
- **HIGH:** material curriculum, pedagogical, knowledge-linkage, or accessibility defect.
- **MEDIUM:** meaningful clarity, consistency, or quality issue.
- **LOW:** cosmetic or non-blocking improvement.

No item with an unresolved BLOCKER may reach `READY`.

## Audit independence

Do not treat successful rendering or passing unit tests as evidence of content correctness. Engineering validation and content validation are separate gates.

## Change control

Any material content change reopens the affected audit gates. New questions require fresh review; they inherit source and knowledge links but do not inherit approval from unrelated questions.
