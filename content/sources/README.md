# Course Source Registry

This directory is the canonical home for source provenance records used to build ChemLab-G9-Eng content.

## Before content production

1. Add source records with the fields defined in `docs/SOURCE-REGISTRY-STANDARD.md`.
2. Identify the designated S0 curriculum/textbook source.
3. Record official S1 curriculum requirements.
4. Record S2 scientific references used for factual verification.
5. Record S3 pedagogical evidence when it materially informs lesson or assessment design.
6. Do not generate production questions until the relevant source set and curriculum scope have been reviewed.

## Current state

`SOURCE_REGISTRY_PARTIAL` — baseline records for S0/S1 sources referenced by released L01-L04 provenance are registered in `source-registry.json`. The S0 designation document (the textbook/curriculum documents explicitly provided by the project owner) is still awaited; `reviewStatus: referenced-by-content` marks entries declared through released lesson provenance, `reference` marks standards used as curriculum basis.

The retired 320-question dataset is not a source and must not be entered here.
