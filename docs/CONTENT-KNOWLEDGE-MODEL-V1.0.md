# ChemLab-G9 Content Knowledge Model V1.0

## Purpose

Define the canonical data relationships used to build lessons, experiments, assessments and the future question bank from the approved curriculum map.

## Entity model

```text
Source
  ↓ supports
CurriculumUnit
  ↓ contains
Topic
  ↓ teaches
KnowledgeNode
  ↓ requires
Prerequisite
  ↓ demonstrated-by
Evidence / Experiment
  ↓ develops
Skill
  ↓ assessed-by
AssessmentItem
  ↓ diagnoses
Misconception
  ↓ remediated-by
Remediation
```

## Required knowledge-node fields

- `id`
- `unit`
- `topic`
- `concept`
- `gradeBand`
- `prerequisites[]`
- `representations[]` — macro / micro / symbolic / quantitative where applicable
- `evidence[]`
- `skills[]`
- `commonMisconceptions[]`
- `assessmentTargets[]`
- `sourceRefs[]`
- `status`

## Status lifecycle

`draft → source-checked → science-checked → pedagogy-checked → assessment-checked → ready`

No lesson or question should reference a knowledge node that is still only `draft`.

## Question-bank rule

The future question bank is a derived layer:

```text
approved KnowledgeNode
       +
approved AssessmentTarget
       +
approved difficulty / cognitive demand
       ↓
original AssessmentItem
```

The retired 320-question dataset is not an input to this model.
