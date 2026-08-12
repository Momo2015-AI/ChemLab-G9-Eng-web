# ChemLab-G9 Source Authority Audit V1.0

**Status:** C0 — Source Authority Baseline substantially verified  
**Date:** 2026-08-12  
**Scope:** Grade 9 chemistry curriculum for the Hubei examination context

## 1. Authority hierarchy

ChemLab content must be built from a source hierarchy rather than generated from model memory.

### S0 — Primary curriculum authorities

1. **2022 edition of the Compulsory Education Chemistry Curriculum Standard** — Ministry of Education. The standard was issued in 2022 and implemented from autumn 2022. [Official source](https://hudong.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html)
2. **PEP Chemistry Grade 9 textbook, upper volume.** Official PEP page confirms the title, ISBN 9787107245015 and the canonical seven-unit structure plus laboratory activities and appendices. [Official source](https://www.pep.com.cn/products/jc/czjks/201510/t20151026_1250692.shtml)
3. **PEP Chemistry Grade 9 textbook, lower volume.** The PEP catalogue and the Ministry of Education's 2024 national textbook catalogue confirm the PEP Grade 9 two-volume Chemistry textbook. [PEP catalogue](https://www.pep.com.cn/rjyc/kcjc/gjkc/jxck/) [MOE catalogue](https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf)
4. **PEP Chemistry Grade 9 Teacher's Teaching Guide, lower volume.** Official PEP page confirms ISBN 9787107253188 and lists Units 8–12, teaching suggestions, resources, cases and experiment activities. [Official source](https://www.pep.com.cn/products/jc/jks/201510/t20151026_1250892.shtml)
5. **PEP Chemistry Grade 9 Teacher's Teaching Guide, upper volume.** The Ministry of Education's national textbook catalogue confirms that the PEP Grade 9 Chemistry textbook has accompanying teacher books. PEP's current teaching-reference catalogue exposes the Chemistry Grade 9 teacher-reference category, but a separate current first-party Book 1 product page was not independently located during this audit. Therefore Book 1 teacher-reference **existence is verified; direct product-page/content verification remains pending**. [MOE catalogue](https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf) [PEP teaching-reference catalogue](https://www.pep.com.cn/rjyc/kcjc/gjkc/jxck/)

### S1 — Hubei examination authority

1. **Hubei Provincial Department of Education, Notice on unified junior-high academic examination proposition** — official policy. From 2024 Hubei implements unified provincial examination proposition for the specified subjects; Wuhan separately organizes its exam under provincial requirements. Physics and Chemistry are a combined paper, with Chemistry 50 points. The policy states that examination content follows the curriculum standard and does not establish a separate examination syllabus. [Official source](https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/gfxwj_GK2020/202306/t20230629_4727322.shtml)
2. The official policy is the stable examination framework for 2024 onward. ChemLab will not invent a yearly document called “湖北省中考化学考试说明/考纲” unless a first-party source is independently verified.

### S2 — annual exam evidence

Annual papers are used to **calibrate assessment**, not to redefine the curriculum.

- **2024:** A publicly accessible copy of the Hubei Provincial Junior High Academic Level Examination Physics-Chemistry paper is available from a third-party educational archive; a separate archive identifies a 2024 Hubei Chemistry answer resource. These are secondary reproductions and are not S0/S1 policy sources. [2024 paper archive](https://ks.xwuli.cn/gonggaogongshi/42.html) [2024 answer archive](https://www.zhongkao.com/e/20240701/6682338ac462b.shtml)
- **2025:** A publicly accessible copy of the Hubei Provincial Junior High Academic Level Examination Physics-Chemistry paper is available from a third-party educational archive. [2025 paper archive](https://www.xwuli.cn/Item/1018.aspx)
- **2026:** A publicly accessible copy of the 2026 Hubei Provincial Physics-Chemistry paper is available from secondary archives, and an educational-resource archive lists the 2026 Hubei Chemistry paper with standard answers. These are secondary reproductions and require provenance checking before question-level reuse. [2026 paper archive](https://max.book118.com/html/2026/0613/8120077061010101.shtm) [2026 resource listing](https://www.wh111.com/lihuasheng/xitidaan/)

**Important:** These secondary copies prove that annual papers are publicly discoverable; they do **not** upgrade them to first-party authority. When original official files are available, those originals must replace secondary copies in the repository source registry.

## 2. Important correction: “annual Hubei examination syllabus”

ChemLab will **not** assume that Hubei publishes a separate annual Chemistry “exam syllabus”. The verified provincial policy says the examination follows the curriculum standard and does not formulate an examination syllabus. Therefore the canonical authority chain is:

`2022 Curriculum Standard → PEP Textbook → PEP Teacher Reference → Hubei Official Examination Policy → Verified Annual Examination Evidence`

## 3. Verification matrix

| Source | Status | Authority | ChemLab use |
|---|---|---|---|
| 2022 Chemistry Curriculum Standard | VERIFIED | S0 | Curriculum scope, core literacy, academic quality |
| PEP Grade 9 Chemistry Book 1 | VERIFIED | S0 | Course sequence and canonical content |
| PEP Grade 9 Chemistry Book 2 | VERIFIED | S0 | Course sequence and canonical content |
| PEP Grade 9 Teacher Reference Book 1 | EXISTENCE VERIFIED; CONTENT PAGE PENDING | S0 | Teaching design after direct-source confirmation |
| PEP Grade 9 Teacher Reference Book 2 | VERIFIED | S0 | Teaching goals, suggestions, resources, experiments |
| Hubei unified-exam policy | VERIFIED | S1 | Examination framework and scope guardrail |
| 2024 Hubei annual paper | SECONDARY COPY VERIFIED | S2 | Assessment calibration; original-source replacement required |
| 2025 Hubei annual paper | SECONDARY COPY VERIFIED | S2 | Assessment calibration; original-source replacement required |
| 2026 Hubei annual paper | SECONDARY COPY VERIFIED | S2 | Assessment calibration; original-source replacement required |

## 4. What C0 has established

The authority model is now sufficient to start **C1 textbook-to-curriculum mapping**. We have also confirmed the critical policy correction: Hubei's provincial framework does not require an assumed annual “chemistry exam syllabus”.

The remaining provenance tasks are **source-hardening**, not a reason to invent content:

1. Replace secondary 2024/2025/2026 paper copies with first-party originals where obtainable.
2. Directly verify the PEP Grade 9 upper Teacher's Teaching Guide product/content page or a first-party catalogue entry with sufficient bibliographic detail.
3. Record exact editions/ISBNs and acquisition provenance before using teacher-guide details as traceable evidence.

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

## 7. Implementation rules

- The textbook edition must be locked before lesson production.
- The 2022 curriculum standard is the curriculum-level authority.
- Teacher's Teaching Guide is authoritative for teaching intent, sequencing advice, experiments, common difficulties and pedagogical recommendations, but does not replace the curriculum standard.
- Hubei examination documents constrain assessment scope and style but must not expand curriculum content beyond the standard/textbook.
- No high-school, competition or private-training content may be introduced merely because it appears in an exam collection.
- Annual papers are evidence for assessment analysis and calibration; they are not templates to copy.
- If sources conflict, record the conflict explicitly and resolve it by authority level and publication/version evidence.
- Third-party reproductions may be used for discovery and cross-checking, but are not sufficient provenance for direct source claims or direct question reuse.

## 8. C0 conclusion

**C0 source authority verification is substantially complete.** The repository may now begin C1 curriculum mapping, while the three source-hardening items in Section 4 remain tracked audit tasks. The `SOURCE_REGISTRY_PENDING` state should remain until the repository has registered the exact primary-source files/editions it will use for production.
