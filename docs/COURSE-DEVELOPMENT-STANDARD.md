# ChemLab-G9-Eng Course Development Standard

**Status:** CANONICAL / MANDATORY  
**Version:** 1.1  
**Established:** 2026-08-12

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
11. runtime/schema/test integration audit;
12. release/freeze gate.

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
