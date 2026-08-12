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

**Important finding:** Hubei's official policy interpretation states that the unified junior-high examination is based on the curriculum standard and **does not formulate an examination syllabus (不制定考试大纲)**. Therefore ChemLab must not model its content system around an assumed annual document called “湖北省中考化学考试说明/考纲”. The authoritative examination layer is the current Hubei policy and verified official examination materials together with the curriculum standard.

### S2 — Calibration evidence

Official Hubei 2024–2026 examination papers, answer keys, and officially released sample/mock materials, when obtainable from authoritative sources. These calibrate assessment style and difficulty; they do not override the curriculum standard or textbook scope.

## 2. Verified baseline sources

- Ministry of Education: 2022 compulsory-education curriculum standards notice. The Chemistry standard is explicitly included and was implemented from autumn 2022.
- People's Education Press: Grade 9 Chemistry upper textbook page and contents.
- People's Education Press: Grade 9 Chemistry lower textbook page and contents.
- People's Education Press: Grade 9 Chemistry lower Teacher's Teaching Guide page and contents.
- Hubei Provincial Department of Education: unified-exam policy. From 2024, Hubei implements provincial unified examination for the specified subjects; Physics and Chemistry are combined, with Chemistry allocated 50 points.
- Hubei Provincial Department of Education policy interpretation: the unified examination follows the curriculum standard, does not establish an examination syllabus, and emphasizes core competencies, thinking processes, analysis/problem solving, and inquiry/open/comprehensive questions.

## 3. Hubei examination interpretation rules

The 2023 Hubei policy is the governing framework for the 2024 onward provincial-unified examination. It states that the exam should follow the curriculum standard, should not exceed or arbitrarily expand/reduce the prescribed scope, and should not use high-school curriculum, competition material, or private-training content as examination content. It also specifies Physics and Chemistry as a combined paper, with Chemistry worth 50 points.

Therefore:

- **2024/2025/2026 are calibration years, not three separate “syllabus versions”, unless an official annual document is independently verified.**
- Annual official papers/materials may reveal changes in question presentation and assessment emphasis, but they do not override the 2022 curriculum standard.
- A question may not be admitted to the ChemLab bank merely because a similar question appeared in a private workbook, training course, or online collection.
- The absence of a verified annual “exam outline” is itself a source-audit finding and must remain recorded.

## 4. Version and scope rules

- The textbook edition must be locked before lesson production.
- The 2022 curriculum standard is the curriculum-level authority.
- Teacher's Teaching Guide is authoritative for teaching intent, sequencing advice, experiments, common difficulties, and pedagogical recommendations, but it does not replace the curriculum standard.
- Hubei examination documents constrain assessment scope and style but must not be used to expand curriculum content beyond the standard/textbook.
- No high-school content, competition content, or private-training content may be introduced merely because it appears useful for an exam question.
- If sources conflict, record the conflict explicitly and resolve it by authority level and publication/version evidence.

## 5. Content production chain

`Source → Scope Lock → Curriculum Map → Knowledge Graph → Learning Objectives → Lesson → Experiment/Visual → Assessment Blueprint → Questions → Audit → Release`

No production question bank may be created before the source and curriculum layers are locked.

## 6. Audit gates

Every releasable lesson must pass:

1. Source traceability audit
2. Scientific correctness audit
3. Curriculum alignment audit
4. Grade-9 age appropriateness audit
5. Teaching/learning quality audit
6. Assessment quality audit
7. Knowledge-linkage and prerequisite audit

## 7. Current source status

- Curriculum standard: **VERIFIED**
- PEP Grade 9 upper textbook: **VERIFIED**
- PEP Grade 9 lower textbook: **VERIFIED**
- PEP Grade 9 lower Teacher's Teaching Guide: **VERIFIED**
- PEP Grade 9 upper Teacher's Teaching Guide: **PENDING DIRECT PRIMARY-SOURCE VERIFICATION**
- Hubei unified-exam policy: **VERIFIED**
- Hubei annual “exam syllabus”: **NOT ASSUMED / NOT REQUIRED BY THE VERIFIED POLICY FRAMEWORK**
- Hubei 2024 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2025 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2026 annual chemistry-specific official materials: **PENDING COLLECTION/AUDIT**
- Hubei 2024–2026 official papers/materials: **PENDING COLLECTION/AUDIT**

## 8. Important implementation decision

The repository must remain `SOURCE_REGISTRY_PENDING` until the missing primary-source items above are collected and audited. Do not fabricate source metadata or treat search-result summaries as substitutes for the underlying source documents.

## 9. Official references

- Ministry of Education, 2022 curriculum standards notice: https://hudong.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html
- PEP Grade 9 Chemistry upper textbook: https://www.pep.com.cn/products/jc/czjks/201510/t20151026_1250821.shtml
- PEP Grade 9 Chemistry lower textbook: https://www.pep.com.cn/products/jc/czjks/201510/t20151026_1250781.shtml
- PEP Grade 9 Chemistry lower Teacher's Teaching Guide: https://www.pep.com.cn/products/jc/jks/201510/t20151026_1250892.shtml
- Hubei Provincial Department of Education unified-exam policy: https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/gfxwj_GK2020/202306/t20230629_4727322.shtml
- Hubei Provincial Department of Education policy interpretation: https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/zcjd_GK2020/202306/t20230629_4727340.shtml
