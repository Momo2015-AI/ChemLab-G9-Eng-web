# ChemLab-G9 Source Authority Audit V1.0

**Status:** C0 — Source Authority Baseline
**Date:** 2026-08-12
**Scope:** Grade 9 chemistry curriculum for the Hubei examination context

## 1. Authority hierarchy

ChemLab content must be built from a source hierarchy rather than generated from model memory.

### S0 — Primary curriculum authorities

1. **2022 edition of the Compulsory Education Chemistry Curriculum Standard** — Ministry of Education.
2. **PEP Chemistry Grade 9 textbook, upper volume.**
3. **PEP Chemistry Grade 9 textbook, lower volume.**
4. **PEP Chemistry Grade 9 Teacher's Teaching Guide, upper volume.**
5. **PEP Chemistry Grade 9 Teacher's Teaching Guide, lower volume.**

### S1 — Hubei examination authorities

1. Hubei provincial education-authority documents governing unified junior-high academic examination.
2. Annual Hubei examination notices, requirements, sample materials, and other official documents for 2024, 2025 and 2026, where publicly issued and verifiable.

Important terminology rule: ChemLab must **not** assume that a separately published annual document titled exactly “湖北省中考化学考试说明/考纲” exists unless an official source is verified. Use the broader and verifiable category “当年度湖北省初中学业水平考试/中考命题相关正式文件、考试要求及官方材料”.

### S2 — Calibration evidence

Official Hubei 2024–2026 examination papers, answer keys, and officially released sample/mock materials, when obtainable from authoritative sources. These calibrate assessment style and difficulty; they do not override the curriculum standard or textbook scope.

## 2. Verified baseline sources

- Ministry of Education: 2022 compulsory-education curriculum standards notice. The Chemistry standard is explicitly included and was implemented from autumn 2022.
- People's Education Press: Grade 9 Chemistry upper textbook page and contents.
- People's Education Press: Grade 9 Chemistry lower textbook page and contents.
- People's Education Press: Grade 9 Chemistry lower Teacher's Teaching Guide page and contents.
- Hubei Provincial Department of Education: unified junior-high academic examination policy. From 2024, Hubei implements provincial unified examination for the specified subjects; Physics and Chemistry are combined, with Chemistry allocated 50 points.

## 3. Version and scope rules

- The textbook edition must be locked before lesson production.
- The 2022 curriculum standard is the curriculum-level authority.
- Teacher's Teaching Guide is authoritative for teaching intent, sequencing advice, experiments, common difficulties, and pedagogical recommendations, but it does not replace the curriculum standard.
- Hubei examination documents constrain assessment scope and style but must not be used to expand curriculum content beyond the standard/textbook.
- No high-school content, competition content, or private-training content may be introduced merely because it appears useful for an exam question.
- If sources conflict, record the conflict explicitly and resolve it by authority level and publication/version evidence.

## 4. Content production chain

`Source → Scope Lock → Curriculum Map → Knowledge Graph → Learning Objectives → Lesson → Experiment/Visual → Assessment Blueprint → Questions → Audit → Release`

No production question bank may be created before the source and curriculum layers are locked.

## 5. Audit gates

Every releasable lesson must pass:

1. Source traceability audit
2. Scientific correctness audit
3. Curriculum alignment audit
4. Grade-9 age appropriateness audit
5. Teaching/learning quality audit
6. Assessment quality audit
7. Knowledge-linkage and prerequisite audit

## 6. Current source status

- Curriculum standard: **VERIFIED**
- PEP Grade 9 upper textbook: **VERIFIED**
- PEP Grade 9 lower textbook: **VERIFIED**
- PEP Grade 9 lower Teacher's Teaching Guide: **VERIFIED**
- PEP Grade 9 upper Teacher's Teaching Guide: **PENDING DIRECT PRIMARY-SOURCE VERIFICATION**
- Hubei unified-exam policy: **VERIFIED**
- Hubei 2024 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2025 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2026 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2024–2026 official papers/materials: **PENDING COLLECTION/AUDIT**

## 7. Important implementation decision

The repository must remain `SOURCE_REGISTRY_PENDING` until the missing primary-source items above are collected and audited. Do not fabricate source metadata or treat search-result summaries as substitutes for the underlying source documents.

## 8. Official references

- Ministry of Education, 2022 curriculum standards notice: https://hudong.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html
- PEP Grade 9 Chemistry upper textbook: https://www.pep.com.cn/products/jc/czjks/201510/t20151026_1250821.shtml
- PEP Grade 9 Chemistry lower textbook: https://www.pep.com.cn/products/jc/czjks/201510/t20151026_1250781.shtml
- PEP Grade 9 Chemistry lower Teacher's Teaching Guide: https://www.pep.com.cn/products/jc/jks/201510/t20151026_1250892.shtml
- Hubei Provincial Department of Education unified-exam policy: https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/gfxwj_GK2020/202306/t20230629_4727322.shtml
