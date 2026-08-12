# ChemLab-G9-Eng Source Registry Standard

## Purpose

Every production learning claim must be traceable to an identified source. The source registry is the provenance layer for curriculum, lessons, experiments, knowledge points, and questions.

## Source tiers

- **S0 — User-supplied canonical course material:** textbook, teacher guide, curriculum documents, school-provided material, or other material explicitly designated by the project owner. Highest priority for curriculum sequence and scope.
- **S1 — Official educational standards:** official curriculum standards, implementation guidance, and assessment requirements. Defines learning scope, outcomes, experiments, and boundaries.
- **S2 — Authoritative scientific references:** IUPAC, NIST, professional chemical societies, authoritative textbooks, and equivalent references. Used for scientific verification.
- **S3 — Evidence-based teaching and learning research:** chemistry education, misconceptions, assessment, cognitive science, and learning-science literature. Used to determine teachability and assessment design.
- **S4 — Supplementary references:** reputable public explanations, demonstrations, visual references, and teacher resources. Never the sole authority for a core scientific claim.

## Registry fields

Each source record should include: `source_id`, title, publisher/author, edition or version, year/date, source tier, chapter/page or stable locator, language, usage scope, provenance URL or file reference when applicable, and review status.

## Provenance rules

1. S0 controls curriculum ordering and grade-level scope when it conflicts with supplementary material.
2. S1 controls formal learning expectations and boundaries.
3. S2 is used to resolve scientific accuracy questions.
4. S3 informs pedagogy but does not override scientific or curriculum authority.
5. S4 may enrich presentation but cannot establish a core claim alone.
6. Generated content must retain source provenance at the lesson/knowledge/question level where practical.
7. No retired question-bank item may be reused as a source for new production questions.

## Release gate

A production lesson cannot be marked `ready` until its required source records are identified and its source scope is reviewed.
