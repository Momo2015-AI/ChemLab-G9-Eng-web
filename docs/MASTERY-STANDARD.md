# ChemLab-G9 95% Mastery Standard V1.0

## Core goal

ChemLab lessons are designed so that a student who completes a lesson and passes its mastery loop should be capable of achieving approximately **95% accuracy on representative, unseen assessment items for the lesson's approved learning objectives**.

This is a mastery target, not a guarantee of a score on an external examination. External exam performance also depends on coverage, time management, transfer, and content outside the lesson.

## What “95%” means

The 95% target applies to a validated assessment set that is:

- aligned to the lesson's approved knowledge nodes and assessment targets;
- predominantly unseen by the learner;
- scientifically and pedagogically audited;
- balanced across recall, explanation, evidence reasoning, application and transfer as appropriate;
- free from duplicated or near-duplicated training items.

A student should not be marked mastered merely because they can reproduce the lesson examples.

## Mastery gates

```text
Learn
  ↓
Guided practice
  ↓
Diagnostic check
  ↓
Targeted remediation
  ↓
Recheck (failed items first, then unseen items with the same knowledge tags)
  ↓
Transfer check
  ↓
Delayed / mixed check where practical
  ↓
95% mastery threshold
```

> **Recheck policy (Sprint 2, 2026-08-28):** the C4-C5 V1.0 plan said
> "Recheck must use new items, not repeat the Practice attempt". The runtime
> (`assessment-runtime-controller.startRecheck`) currently orders recheck
> items as **failed items first, then unseen items from the same lesson
> sharing the weak knowledge tags**, with the failed tail kept in stable
> order and only the rest shuffled. The C4-C5 P1.6 rule and the current
> implementation disagree on this point. We retain the implementation
> (failed items first) because:
> 1. The failed items **were** unseen on the first attempt — the student
>    answered them once and got them wrong. Re-presenting them targets the
>    specific knowledge gap that triggered the remediation, not arbitrary
>    material.
> 2. Pure-unseen recheck had a 0-of-N match in the existing lesson pools
>    during Sprint 1 diagnosis-recovery work (see
>    `INTEGRATED-REPAIR-PLAN-V1.1.md` §3.2) — every lesson's recheck pool
>    is small (≤ 6 practice + 3 diagnostic + 21 mastery) and "unseen but
>    same knowledge" often does not exist.
> 3. The two strategies converge as the lesson pool grows; for now we
>    keep the policy that demonstrably closes the diagnosis loop.
> The C4-C5 V1.0 text is therefore superseded for this rule.

## Recommended evidence threshold

For a lesson-level mastery decision:

- target score: **≥95%** on the validated unseen assessment set;
- no critical misconception may remain unresolved;
- no core learning objective may be completely untested;
- transfer items must be included where the objective requires reasoning rather than recall.

If the learner scores below 95%, the system should not simply expose the same answers. It should identify the failed knowledge node / misconception, provide targeted remediation, and generate or select a new equivalent-but-not-duplicated item set.

## Assessment design implications

A 95% target changes lesson design in four ways:

1. **More formative checks:** understanding is checked during the lesson, not only at the end.
2. **Error diagnosis:** wrong answers are evidence about the learner's misconception, not merely lost points.
3. **Unseen assessment:** mastery must survive new wording and new contexts.
4. **Spaced verification:** where practical, mastery is rechecked later in mixed practice.

## Relation to Wuhan middle-school examinations

Wuhan examination questions are used as an external calibration layer (S2). They help calibrate knowledge coverage, reasoning demand, context and item style. They do not replace the curriculum standard, textbook or teacher's guide as the instructional authority, and they do not justify expanding course scope beyond the approved curriculum.

The 95% lesson target therefore means:

> **Master the lesson's approved content deeply enough to answer representative unseen questions at about 95% accuracy, while using Wuhan exam materials to calibrate transfer and examination readiness.**

## Production rule

Every Golden Lesson must report:

- assessment-set size;
- score achieved;
- item blueprint;
- knowledge-node coverage;
- misconception coverage;
- transfer-item performance;
- remediation attempts;
- final mastery status.

A lesson cannot be labelled `MASTERED` from completion time, page views, or completion of practice alone.
