# ChemLab-G9-Eng Course Development Standard

## 1. Core principle

Build the course from authoritative sources and learning goals—not from a pre-existing question bank. The production order is:

`Sources → Curriculum Map → Knowledge Graph → Learning Objectives → Lessons → Experiments/Visuals → Assessment Blueprint → Questions → Diagnosis/Review`

## 2. Curriculum architecture

`Course → Unit/Chapter → Lesson → Knowledge Point → Skill → Experiment → Practice → Assessment`

The exact chapter sequence follows the designated S0 curriculum source. No convenience-driven reordering is allowed without documenting the rationale.

## 3. Lesson contract

Every production lesson should define:

- learning objectives using observable student actions;
- prerequisites and dependency knowledge;
- core concepts and boundaries;
- conceptual explanation from phenomenon/question to model, explanation, and rule;
- age-appropriate visual models or interactions where useful;
- experiment purpose, apparatus, materials, procedure, observations, explanation, conclusion, safety, and common anomalies where applicable;
- at least one worked example where the topic requires procedural reasoning;
- graduated practice from recognition/understanding to application, synthesis, and transfer;
- misconception and remediation links;
- source provenance;
- readiness/review status.

## 4. Pedagogical standards

Content must be suitable for Grade 9 independent learning on an iPad. Prefer short conceptual steps, explicit models, retrieval opportunities, worked examples, meaningful practice, feedback, and spaced review. Do not increase difficulty merely by increasing calculation length or terminology.

## 5. Knowledge architecture

Maintain four linked maps:

1. **Curriculum Map:** course → units → lessons.
2. **Knowledge Graph:** prerequisite, related, contrast, and application relationships between knowledge points.
3. **Learning Graph:** recommended learning and review dependencies.
4. **Assessment Graph:** knowledge → skill → question type → difficulty → misconception.

## 6. Question production

Questions are generated only after lesson objectives, knowledge links, and an assessment blueprint exist. Every production question should carry a stable ID, lesson linkage, knowledge linkage, skill, difficulty, Bloom level, type, prompt, answer, explanation, source/provenance, and review status.

## 7. Content quality gates

Every production unit passes: source audit → scientific audit → Grade-9 suitability audit → pedagogical/content audit → question-quality audit → knowledge-linkage audit → release gate.

## 8. Content state

Use explicit states such as `DRAFT`, `IN_REVIEW`, `REVISED`, `READY`, and `RETIRED`. Template or placeholder lessons cannot be `READY`.

## 9. Reset rule

The retired 320-question dataset is not a seed, source, benchmark, or hidden fallback. When the canonical question bank is absent, the repository may remain in `RESET_PENDING_SOURCE_DOCUMENTS`; production questions resume only after new source documents are supplied.
