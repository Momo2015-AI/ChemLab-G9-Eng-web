# ChemLab-G9-Eng 内容标准（Content Standard）

> 本文合并自 V1.9-CONTENT-STANDARD（内容生产标准主体）、CONTENT-AUDIT-STANDARD（7-Gate 审计门禁）、V1.9-CONTENT-REVIEW-PROTOCOL（审查流程与清单）、V1.9-CONTENT-AUDIT-METRICS（度量口径），合并日期 2026-08-16。原文件已删除。


## 1. Purpose

This document defines the production standard for grade-9 chemistry learning content. Content is not considered complete because files exist. It is complete only when a student can learn, practice, receive diagnosis, remediate misconceptions, and demonstrate recovery.

The product is English-language grade-9 chemistry content, but scientific scope and pedagogical sequencing must remain aligned with the intended junior-high chemistry curriculum and the approved textbook/curriculum evidence used by the project.

## 2. Core principles

1. **Truth before volume** — never preserve an arbitrary question count at the expense of scientific correctness.
2. **Teaching before testing** — a lesson must contain real explanatory content before its exercises are considered meaningful.
3. **Evidence before publication** — every production item has traceable curriculum and scientific evidence.
4. **Student cognition first** — language, abstraction, arithmetic load, and prerequisite knowledge must be appropriate for grade 9.
5. **Misconception-first design** — anticipate predictable errors and design explanation, distractors, experiments, and remediation around them.
6. **One learning graph** — knowledge, lesson, question, experiment, misconception, and remediation must use stable IDs and explicit relationships.
7. **No fake completeness** — templates, placeholder text, empty arrays, and generic claims never count as completed content.

## 3. Content layers

Every published learning unit is built from six layers:

### A. Curriculum layer
- curriculum objective
- textbook/unit/chapter location
- prerequisite knowledge
- expected learning depth
- grade-9 suitability

### B. Knowledge layer
- concept definition
- properties
- relationships
- representations
- equations where applicable
- boundaries and common misconceptions

### C. Learning layer
- motivation/context
- explanation
- observation or worked reasoning
- worked example
- guided practice
- independent practice
- summary/retrieval

### D. Diagnostic layer
- expected errors
- misconception IDs
- distractor-to-misconception mapping
- diagnostic signals
- remediation route

### E. Experiment layer
- objective
- apparatus/materials
- procedure
- expected observations
- interpretation
- safety
- common experimental errors
- linked misconceptions/questions

### F. Assessment layer
- question ID
- answer
- explanation
- difficulty
- cognitive level
- knowledge links
- experiment links where applicable
- evidence and review status

## 4. Lesson standard

A lesson is **not ready** unless it contains real content in every applicable core section.

Minimum structure:

1. Learning objectives
2. Why this matters / prior knowledge activation
3. Core concept explanation
4. Chemical reasoning or mechanism
5. Observable evidence, experiment, diagram, or concrete example where appropriate
6. Worked example with complete reasoning
7. Guided practice
8. Independent practice linked to real question IDs
9. Common misconceptions
10. Retrieval summary
11. Knowledge links
12. Assessment/recheck route

### Prohibited lesson patterns

The following are placeholders, not content:

- `掌握{title}的核心概念与性质。`
- `通过观察、实验和讨论，理解{title}的化学原理。`
- `结合典型例题，掌握{title}的应用方法。`
- `完成5道随堂练习，检测学习效果。`
- generic statements that could be pasted into any chemistry lesson without changing their truth value

A lesson containing these patterns in its primary teaching sections is automatically classified as `template` and cannot be `ready`.

## 5. Benchmark lesson standard

Day 01 is the benchmark lesson. It must be fully reviewed before the remaining lessons are mass-produced.

The benchmark must demonstrate:

- textbook/curriculum grounding
- scientifically precise explanation
- age-appropriate English
- at least one authentic worked example
- authentic question references
- misconception coverage
- experiment linkage where appropriate
- retrieval/check-for-understanding
- remediation route
- complete review evidence

No other lesson should be used as a production template until the benchmark passes the release gate.

## 6. Question standard

Every question must have:

- unique stable ID
- complete stem
- complete options when applicable
- unambiguous answer
- scientifically correct explanation
- knowledge-point IDs
- difficulty
- cognitive level
- curriculum evidence
- scientific review
- age-suitability review
- item-quality review
- knowledge-link review

P0 issues block publication.

Placeholder questions must be quarantined and rebuilt, not cosmetically edited.

## 7. Misconception standard

Each important knowledge point should identify 2–3 high-value misconceptions where evidence or teacher experience supports them.

A misconception record should include:

- ID
- concise student-facing description
- underlying incorrect mental model
- associated knowledge points
- trigger signals
- likely distractors
- diagnostic questions
- prevention/explanation strategy
- remediation content
- recheck questions

The goal is not to label students. The goal is to identify a teachable error pattern and route the learner to recovery.

## 8. Distractor standard

A multiple-choice distractor should represent a plausible misconception or reasoning error.

Forbidden distractors:

- `Option A`, `Option B`, etc.
- random nonsense
- obviously longer/shorter answer designed only to reveal the key
- duplicate answers
- scientifically impossible alternatives unless the item explicitly tests recognition of impossibility

## 9. Experiment standard

Experiments must separate:

`procedure → observation → interpretation → conclusion`

They must also record:

- safety constraints
- important conditions
- expected observations
- common procedural errors
- common interpretation errors
- linked misconception IDs
- linked question IDs

Observation must not be presented as a conclusion, and a conclusion must be supported by the stated evidence.

## 10. Scientific review

Reviewers must check:

- chemical terminology
- formulas and symbols
- valence/ions where taught
- chemical equations and balancing
- reaction conditions
- experimental procedure
- observations
- conclusions
- quantitative calculations
- units and significant assumptions
- exceptions to absolute statements
- consistency between stem, answer, and explanation

Any contradiction between question and explanation is a blocking defect.

## 11. Grade-9 suitability review

Check:

- prerequisite knowledge is available or explicitly activated
- language is understandable to a grade-9 learner
- abstraction is appropriate
- arithmetic load is justified
- terminology matches the intended curriculum level
- examples are age-appropriate and safe
- task difficulty is intentional rather than accidental

Age suitability does not mean oversimplification. It means the learner has a fair route to the intended reasoning.

## 12. Knowledge relationship standard

Allowed canonical relationships include:

`knowledge → lesson`

`knowledge → question`

`knowledge → experiment`

`question → misconception`

`experiment → misconception`

`misconception → remediation`

`remediation → recheck`

Every referenced ID must exist. Orphan references are integrity failures.

## 13. Content status

```text
draft → review → verified → ready
             ↘
             blocked
```

- `draft`: content under construction
- `review`: content exists but evidence/review is incomplete
- `verified`: all required review evidence passes
- `ready`: verified and cleared for production
- `blocked`: a P0/P1 defect or missing evidence prevents publication

## 14. Five-layer release gate

Every publishable content item must pass:

1. **Curriculum/source**
2. **Scientific correctness**
3. **Grade-9 suitability**
4. **Item/content quality**
5. **Knowledge relationships**

For lessons, the same gate additionally requires real teaching content and learning-flow completeness.

## 15. Automated integrity checks

CI must detect at minimum:

- template placeholder phrases
- missing required fields
- empty teaching sections
- broken IDs
- orphan knowledge references
- nonexistent question references
- duplicate IDs
- invalid status transitions
- unresolved P0 issues
- placeholder distractors
- missing provenance/review evidence

A passing structural test does not substitute for scientific or pedagogical review.

## 16. Production workflow

```text
Audit
  ↓
Benchmark lesson
  ↓
Scientific + pedagogical review
  ↓
Misconception modeling
  ↓
Lesson/question/experiment linking
  ↓
Automated integrity checks
  ↓
Human content review
  ↓
Verified
  ↓
Ready
```

## 17. Quality metrics

The project should track:

- lesson real-content coverage
- lesson verified coverage
- question verified coverage
- placeholder rate
- P0/P1 defect count
- misconception coverage by knowledge point
- question-to-knowledge link coverage
- lesson-to-question link coverage
- experiment-to-misconception coverage
- remediation-to-recheck coverage

A high file count or question count is not a quality metric.

## 18. Definition of Done

A content unit is Done only when:

- a student can actually learn from it without relying on hidden assumptions;
- every important factual claim has an appropriate evidence basis;
- exercises are real and solvable;
- predictable errors are modeled;
- diagnosis can identify an error pattern;
- remediation exists;
- a recheck exists;
- all referenced content IDs resolve;
- automated integrity checks pass;
- required human reviews pass.

---

## 附录 A：内容审计门禁（7-Gate）

每个生产单元必须依次通过以下七道门禁；任何 `BLOCKER` 或未关闭的高风险问题都不得进入 `READY`。

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

---

## 附录 B：内容审查流程（Review Protocol）

### B.1 审查顺序

所有新增或大幅修订的内容按以下顺序审查：

1. 内容清点与模板检测
2. 课程/来源核验
3. 科学性审查
4. 九年级适龄性审查
5. 学习设计审查
6. 题目质量审查（适用时）
7. 知识关联完整性审查
8. 误解/补救审查
9. 自动化完整性门禁（`npm run audit:content`）
10. 最终发布决定

### B.2 课程审查清单（要点）

- 学习目标映射到课程范围；前置知识已识别；内容深度适宜。
- 讲解包含具体化学事实/关系/推理；无模板语句残留；示例具体相关。
- 观察与结论严格区分；例题包含推理过程而非仅有答案。

### B.3 度量口径

文件存在、题目数量、页面数量都不构成"内容完成度"证据。接受的项目度量：

- **真实内容覆盖率** = 真实课程数 / 总课程数（"真实"= 主动教学段落含具体学科内容且不匹配占位模板）。
- **就绪覆盖率** = 通过全部 7-Gate 的课程数 / 总课程数。
- **题库有效性** = 可解析到知识图谱节点且答案/解析完备的题目占比。

