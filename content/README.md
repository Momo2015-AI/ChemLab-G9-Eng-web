# ChemLab-G9 Content Layer

V1.7 defines `content/` as the **canonical educational content source**. It is the single authoritative source for chemistry learning semantics and assessment evidence.

## Structure

```text
content/
├── curriculum/    # curriculum structure and learning progression
├── lessons/       # lesson learning sequences
├── knowledge/     # concepts, relationships and knowledge graph data
├── questions/     # assessment items and diagnostic metadata
├── experiments/   # experiment models and evidence
├── misconceptions/ # misconception and remediation definitions
└── schema/        # machine-readable content contracts
```

## Source-of-truth rule

A concept, lesson, question, experiment, or misconception must have one canonical record under `content/`.

`modules/` is **not** a second content database. It is reserved for runtime modules, adapters, indexes, compatibility code, or reproducible generated artifacts.

New educational content must be added to `content/`, not copied into runtime modules.

## Runtime flow

```text
content/
   ↓
Schema validation
   ↓
ContentService / repositories
   ↓
Learning + Assessment + Experiment engines
   ↓
Views
```

## Migration

Legacy content can remain temporarily while consumers are migrated. Do not create new duplicate records. Once references are removed and CI passes, legacy copies should be deleted.
