# ChemLab-G9-Eng-web 整改计划 V1.1（融合版）

**文档状态：** 可执行计划 / 取代 `PHASE-C4-C5-COMPREHENSIVE-AUDIT-REPAIR-PLAN-V1.0.md` 的执行顺序
**建立日期：** 2026-08-27
**目标基线：** 远端 `main` @ `213e5c2`（30 课 / 186 测试全绿 / 内容门禁 PASS）
**输入文档：**
1. `docs/roadmap/PHASE-C4-C5-COMPREHENSIVE-AUDIT-REPAIR-PLAN-V1.0.md`（项目自评，下称"C4-C5 计划"）
2. `docs/roadmap/REVIEW-2026-08-27-ARCH-CONTENT.md`（外部双维度审查报告，下称"审查报告"）

> **与 C4-C5 计划的关系：** 保留其全部质量目标与三条冻结原则；修正其执行顺序（新增 Sprint 0 止血）、将其 Phase 0/1 从"规格书"改写为"差距分析驱动"、补入其遗漏的三个系统性缺口（知识点链接断裂、题目双源漂移、语义审计规则）。

---

## 0. 修订总原则（在 C4-C5 三条冻结原则之上新增）

C4-C5 计划的三条冻结原则（不以题量、不以测试全绿、不以"有 JSON/ready"衡量完成度）**原样保留**，另增三条：

1. **止血优先**：已在生产上误判学生的缺陷，修复优先级高于一切架构与流程工作。
2. **差距驱动，禁止重写**：Phase 0/1 类条目必须先逐条核验现状（已实现/部分/缺失），只补缺口。与架构冻结原则一致：不再进行无明确需求的基础架构重写。
3. **语义门禁**：内容审计从"结构校验"升级为"语义校验"（答案键有效性、解析一致性、知识点链接、副本一致性）。结构绿 ≠ 内容对。

---

## 1. 前提准备（Sprint 0.0，0.5 天）

| # | 任务 | 说明 |
|---|---|---|
| 0.0-1 | **同步本地仓库** | 本地 `E:\Code\ChemLab-G9-Eng-web` 落后远端 main 19 个提交（停留在 8 课状态）。`git pull --ff-only origin main`。工作区需干净；若有本地未提交改动先 stash 评估 |
| 0.0-2 | **固化基线** | 记录 `git rev-parse HEAD`、`npm test`（预期 186/186）、`npm run audit:content`（预期 Gate PASS）三基线到 DEV-REC.md |
| 0.0-3 | **修复本地测试入口** | `package.json`：`"test": "node --test tests/"`（Node ≥18 目录递归匹配，跨平台；解决 Windows cmd 下 glob 不展开导致 `npm test` 直接失败的问题） |

---

## 2. Sprint 0 — 止血：生产坏题修复 + 语义审计规则（1~2 天）

**目标：** 消除正在误判学生的缺陷，并把此类缺陷的复发屏障建进 CI。这是 C4-C5 计划完全缺失、但优先级最高的部分。

### 2.1 修复三道坏题（0.5 天，含人工核验）

| # | 缺陷 | 文件 | 修复动作 | 验证 |
|---|---|---|---|---|
| 0-1 | L30-P06 答案键错误：2g H₂ + 16g O₂ 生成水的质量，正确答案 18g（选项 A），答案键标 16g（选项 B），解析自曝"正确答案：18g" | `content/lessons/lesson-18-stoichiometry-calculation-practice.json` | ① `answer: 1 → 0`；② 解析改为："质量守恒：2g + 16g = 18g。H₂ 与 O₂ 恰好按 1:8 质量比完全反应，无剩余。" | 人工复核计算；2.2 新规则回归 |
| 0-2 | L12-P08 无有效答案：问"操作错误的是"，四个选项全是正确操作；解析自曝"无错误选项。修正：选项应改为'试管口向上倾斜'" | `content/lessons/lesson-07-oxygen-preparation-comprehensive-practice.json` | 按解析既定方案：选项 D 改为"试管口向上倾斜"（保持 `answer: 3`），解析改为："加热固体制气体时试管口应略向下倾斜，防止冷凝水倒流使试管炸裂。" | 人工复核；新规则回归 |
| 0-3 | L05-Q03 无有效答案且与同课 L05-D02 矛盾：把"液态氧气是淡蓝色液体"（教材事实，L05-D02 判其为正确）判为"错误描述" | `content/lessons/lesson-05-oxygen.json`（主文件与 `-diagnostic.json` 副本同步改） | 选项 D 改为真正错误的陈述"氧气易溶于水"（保持 `answer: 3`），解析改为："氧气不易溶于水（可用排水法收集），'易溶于水'为错误描述；液态氧气确为淡蓝色液体。" | 人工复核；副本一致性规则回归 |

**规则：三道题修复前，先在审计脚本中落规则并确认报红（先红后绿），确保规则真的能拦住它们。**

### 2.2 语义审计规则（1 天）——治本

扩展 `scripts/content-integrity-v19.mjs`（或新增 `scripts/content-semantic-audit.mjs` 并入 `npm run audit:content`），以下规则**全部 BLOCKER**：

| 规则 | 检查内容 | 首次运行预期 |
|---|---|---|
| S1 矛盾标记词 | 题目 `explanation` 含 `需检查 / 实际应为 / 无错误选项 / 修正：/ 待确认 / TODO` | 命中 2 处（L30-P06、L12-P08），修复后归零 |
| S2 答案索引有效 | `answer` 为数字且 `0 ≤ answer < options.length` | 已是 0 处（防回归） |
| S3 副本一致性 | 同一题目 ID 出现在多个文件时，深度比较（排序键）必须相等 | 命中 33 处 → Sprint 1 归零 |
| S4 知识点链接 | 每道运行时题目（practice/diagnostic/mastery/transfer）必须含非空 `knowledgeIds` 且全部存在于知识图谱 52 节点 | 命中 103 处 → Sprint 1 归零（过渡期可先 WARN，Sprint 1 结束升 BLOCKER） |
| S5 重复 ID 台账 | 同 ID 多副本必须登记在册（允许的嵌入副本 vs 不允许的漂移） | 与 S3 配合 |
| S6 解析必备 | choice 题（含全部 transfer 题）必须有 `explanation` | 命中 157 处 → Sprint 1 归零（diagnostic 题过渡期豁免，见 3.3） |

### 2.3 Sprint 0 验收（Definition of Done）

```text
□ 3 道坏题修复并通过人工学科核验
□ 语义审计规则 S1/S2/S3 上线且 CI 生效（S4/S6 过渡期 WARN）
□ npm test 在 Windows 与 Linux 均可运行，186+/186+ 全绿
□ audit:content Gate PASS
□ DEV-REC.md 记录本次修复与规则建立
□ 一次提交，CI GREEN
```

---

## 3. Sprint 1 — 内容语义收敛：恢复诊断闭环（1.5~2 周，内容工作为主）

**目标：** 让"练习 → 诊断 → 补救 → 再检测"链路对全部 30 课真实生效。这是 C4-C5 计划 P1.4/P1.5 的**前置条件**——该计划假设诊断链是通的，实际对 lesson-14~18、21~24 共 12 课静默失效。

### 3.1 副本一致性收敛（2 天）

- **确立单一事实源：split 文件（`-practice.json` 等）为唯一题目来源**；主课程 JSON 中的 `questions`/`diagnosticQuestions`/`mastery.questions` 副本仅作展示索引。
- 一次性脚本对齐 33 处漂移：以**信息更全的一侧**为准（通常是主文件带 `knowledgeIds` 的版本——把 knowledgeIds 补进 split 侧；题干措辞差异逐条人工裁决，以更准确的为准）。
- 对齐后 S3 规则归零并升为永久 BLOCKER。

### 3.2 补齐 103 题知识点链接（4~5 天，需学科判断）

涉及文件与题数（对照知识图谱 52 节点逐题归属）：

| 课组 | 文件模式 | 题数 |
|---|---|---|
| lesson-14 燃烧与灭火 | diagnostic 3 + practice 6 + mastery 2 | 11 |
| lesson-14/15/16/17/18（质量守恒、化石燃料、燃烧安全、方程式书写、配平、计算、能源环境） | 各 diagnostic 3 + practice 6 | 8 × 9 = 72 |
| lesson-21/22/23/24（碳及其氧化物） | 各 diagnostic 3 + practice 2 | 4 × 5 = 20 |

- **注意：不能纯机械分配**。每题需判断考查的核心知识点（如配平题归 `equation-balancing` 而非笼统的 `equation-writing`），错链会把学生引向错误的补救路径。建议 AI 初配 + 人工逐题复核。
- 同步修正这些课自评 `review.knowledgeLinks: "pass"` 与事实不符的问题：复核完成后才允许保持 pass。
- **连带收益：** 修复后 `startRecheck` 对这些课不再因 `matches.length === 0` 返回 null。

### 3.3 迁移题与诊断题补解析（3~4 天）

- **15 个 transfer 文件 × 4 题 = 60 题，全部补 `explanation`**，聚焦"陌生情境如何映射回课内原理"（这是迁移环节的学习价值所在）。
- 诊断题（~97 题无解析）：最低要求补一句话"为什么错"；errorType 已有误解词表可参照生成。
- S6 规则升为 BLOCKER（diagnostic 至少一句话解析的最低标准同日生效）。

### 3.4 知识点中文显示走图谱（1 天，架构小修）

- `app/application.js`：从 `knowledgeEngine` 一次性取 `id → name` 映射，随视图入参传入。
- `views/v19-course-view.js`：删除硬编码 `KNOWLEDGE_LABELS`（仅覆盖第一课 8 个知识点，导致学生此后看到 `acid-intro` 等原始 ID），改用传入映射。
- 顺带提取三处重复的 `escapeHtml` 到 `core/utils/html.js`。

### 3.5 Sprint 1 验收

```text
□ S3/S4/S6 全部归零且升为 BLOCKER
□ 抽样 3 课（lesson-16、lesson-18、lesson-22）人工验证：答错题 → 诊断出现弱项（中文名）→ 补救计划生成 → 再检测抽到对应知识点题目
□ npm test 全绿（新增副本一致性/知识点链接测试）
□ audit:content Gate PASS
□ 知识点卡片全课程显示中文名（30 课逐课截图或单测覆盖）
```

---

## 4. Sprint 2 — Runtime 差距分析（1 周）：只补缺口，不重写

**目标：** 将 C4-C5 计划 Phase 0/1 从规格执行改为差距核验。以下为逐条核验结论（基于审查报告对代码的实测），**只执行"行动"列非空项**。

### 4.1 C4-C5 Phase 0/1 条目现状核验表

| C4-C5 条目 | 现状（实测） | 行动 |
|---|---|---|
| P0.1 Canonical Lesson Model（7 字段统一） | **已实现**：manifest 与 lesson JSON 字段齐全且一致（audit:content 0 违约） | 无需开发；将字段契约写入 `content/schema/lesson.schema.json` 校验（半天） |
| P0.2 Lesson Registry | **已实现**：`lesson-manifest.js` 为声明的唯一注册表 | 核验所有消费方走 manifest（`getHomeData` 已走；补一条单测锁定） |
| P0.3 报告只读 Canonical Data | **部分**：`gen-project-status.mjs` 已脚本化，但 C4-C5 文档自身基线数字过期（写 25 课/183 测试，实际 30 课/186） | 修订文档数字来源规则：合入前由脚本生成 |
| P0.4 自动一致性检查 | **部分**：现有检查覆盖 manifest↔lesson、引用存在（dangling）；缺反向规则 | **补**：题目必须有知识点链接（S4，Sprint 1 已做）；`displayOrder` 唯一且连续（现有 audit 未查，补上）；实验文件必须"被引用或登记"（见 4.3） |
| P1.1 唯一 LessonLearningState | **已实现**：`learning-controller.js` 按 lessonId 隔离全部阶段状态 | 无需开发 |
| P1.2 唯一 AssessmentAttempt | **基本已实现**：session 含 attemptId/lessonId/mode/answers，各 mode 独立，localStorage 可恢复 | **补**：session 补 `knowledgeCoverage`/`misconceptions` 汇总字段（从诊断结果回填，半天） |
| P1.3 统一答案协议 | **内容层已统一**：1242 题全部数字索引、0 字母答案；字母处理仅存于 `quiz-view.js:53-54` 容错 | **补**：删视图层字母容错分支；Loader 边界加断言（answer 必须为有效数字索引），半天 |
| P1.4 Attempt-Level Diagnosis | **已实现**：diagnosis-engine 产出 errors[]/weakPoints[] | 无需开发 |
| P1.5 Lesson-aware Remediation | **已实现**：补救计划携带 lessonId/knowledgeIds/steps（含 recheck 知识点） | 无需开发 |
| P1.6 Recheck 独立化 | **部分且有意分歧**：再检测从本课题池抽取、错题优先（代码注释明确该策略）——与 C4-C5"不重复原 Practice 题"的要求**设计上冲突** | **裁决项**：保留现行"错题优先"策略（更符合补救学习原理），在 MASTERY-STANDARD.md 记录该决策，修订 C4-C5 计划该条 |
| P1.7 Mastery 独立化 | **已实现**：`startMastery` 独立 session | 无需开发 |
| P1.8 Domain 层完成门禁 | **已实现**：`markComplete` 在领域层验证 mastery passed | 无需开发 |

**结论：C4-C5 的 Sprint 1（Runtime Consolidation）实际开发量约为其规划的 15%。** 剩余真实缺口见 4.2/4.3。

### 4.2 架构遗留修复（审查报告 ARCH 项，2~3 天）

| # | 缺陷 | 修复 | 预估 |
|---|---|---|---|
| A-1 | `state.currentLessonId` 被读取（application.js:241）但**从未被写入**——隐藏 bug | `renderCourseRoute` 进入课程时写入 | 0.5 天（含单测） |
| A-2 | Shell↔App 靠 4 个 `window` 全局通信（chemLabTextbookTerm / chemLabSetTerm / chemLabApplication / __chemLabCurrentLessonId） | 收敛为 `TermService`（状态+事件合一），application 注入 shell；A-1 修复后 `__chemLabCurrentLessonId` 删除 | 1 天 |
| A-3 | Lab 门户首次进入 ~30 次串行 fetch（`getExperimentCatalog` 顺序 await + `loadExperiment` O(N) 全 manifest 扫描兜底） | catalog 改 `Promise.all`；建立 lesson→experiment 索引消灭扫描兜底 | 1 天 |
| A-4 | `renderCourseRoute` 用 `setTimeout(1400)` 魔法数同步 UI | `recordGuidedCheck` 返回状态，视图局部更新卡片徽标，不整页重渲染 | 1 天（可推迟至 Sprint 3 E2E 暴露问题后再做） |
| A-5 | manifest `day` 键重复（'11'/'12'/'13' 各 2 次）致 `dayById` 碰撞 | `dayById` 构建遇重复跳过并 warn；manifest 注释固化 day→canonicalId 映射 | 0.5 天 |

### 4.3 死内容登记（1 天，可与 4.2 并行）

- `content/experiments/` 30 个未被引用的 JSON（下册金属/酸碱盐/化肥实验）：在 Source Registry 登记 `PENDING-LOWER-SEMESTER`（它们是下册建设的现成素材，**不删除**）。
- `content/experiments/exp-metal-acid.js`（无任何引用的 JS 版实验）：删除。
- `g9-course-map.js` 12 个单元 `status: 'planned'` 改为实况（u01–u07 `built`，u08–u12 `planned`）。
- runtime-audit 增加规则：`content/experiments` 文件必须被引用或已登记。

### 4.4 Sprint 2 验收

```text
□ 4.1 表中全部"补"项完成并有对应单测
□ 裁决项（P1.6）在 MASTERY-STANDARD.md 形成书面决策
□ Lab 门户弱网（DevTools throttle）下首屏无串行瀑布（Network 面板验证）
□ npm test 全绿 / runtime-audit GREEN / audit:content PASS
```

---

## 5. Sprint 3 — Browser E2E 发布门禁（1~1.5 周）

**目标：** 落实 C4-C5 Phase 10，并补入其路径清单缺失的 4 条。E2E 是 Release Gate，不以 Node 单测代替。

### 5.1 基础设施

- 引入 Playwright + `tests/e2e/`（或 `e2e/` 目录，注意与 build-pages 的 dist 无关）；CI workflow 增加 `e2e` job（`needs: validate`，Pages 部署依赖其通过）。
- 本地入口：`npm run test:e2e`（需静态服务器，复用 README 的 http.server 约定或改用 Playwright 内置 server）。

### 5.2 用户路径清单（C4-C5 的 12 条 + 补充 4 条 = 16 条）

| # | 路径 | 来源 |
|---|---|---|
| 1–12 | 首页→第一课 / Guided Step 1→8 / 即时检查对与错 / 实验 / Practice 判分 / 诊断完整显示 / 补救→再检测 / 再检测→Mastery / 19/20→Mastery→Transfer→Complete / <95%→补救循环 / 刷新恢复 | C4-C5 原文 |
| 13 | 知识地图 → 节点详情 → 跳转对应课程学习（knowledge-map/knowledge-detail 路由从未被 E2E 覆盖） | 新增 |
| 14 | 上/下册切换：切换后课程列表、实验目录、知识图谱范围联动刷新 | 新增 |
| 15 | localStorage 损坏恢复：写入非法 JSON → 刷新 → 数据备份到 `chemlab_v16_corrupt` 且应用正常启动（该逻辑有专门实现，零回归覆盖） | 新增 |
| 16 | **答案键完整性回归**：Sprint 0 的三道坏题所在课（lesson-18/07/05）各答一次"正确答案"，断言判分为对——防止答案键再次被改坏 | 新增 |

### 5.3 路由矩阵固化（C4-C5 Phase 9 的落地方式）

以**实际实现**为准（C4-C5 的 Route Matrix 与现行 router 语法不一致：实际是 `quiz/mastery:lessonId` 前缀参数而非 `quiz/mastery/:id` 路径段），将 16 条路径的路由断言扩展进现有 `tests/router.test.mjs`。学习路由丢失 lessonId 视为 P0 缺陷的原则保留。

### 5.4 Sprint 3 验收

```text
□ 16 条 E2E 路径全绿，CI 集成为发布门禁
□ E2E 总时长 < 5 分钟（CI 预算内）
□ 路由矩阵以测试固化，与实现一致
```

---

## 6. Sprint 4 — Golden Lesson A：lesson-01（1 周）

按 C4-C5 Phase 10/13 执行，补充以下校准：

- 教材/教参对齐（P3.1）：**前置依赖——Source Registry 的 S0 文档必须先落实**（当前 `S0-PEP-CHEM` 的 `provenanceUrl` 为 null，"S0 定义要求项目所有者指定文档"）。若项目所有者一周内无法提供，降级处理：S0 用现行课标（S1）+教师用书替代并显式记录该妥协，不得静默放行。
- 武汉真题能力校准：**推迟到 Source Registry 落实后**（见第 9 节），Golden Lesson 阶段只做"能力维度自查"，不做真题映射。
- 评分卡先行试算：用 C4-C5 Phase 9 评分卡对 L01 打分，验证评分卡可操作性（权重修订见第 8 节）。

验收：L01 全链路（source→lesson→experiment→practice→diagnosis→remediation→recheck→mastery→transfer→E2E）证据链完整，评分 ≥95 且无阻断项。

## 7. Sprint 5 — Golden Lesson B + C：双类型模板验证（1~1.5 周）

- **Golden B**：燃烧与灭火（程序性课程）——按 C4-C5 原计划。
- **Golden C（新增）：lesson-18 基于化学方程式的简单计算（计算型课程）**。理由：概念课与程序课暴露不了计算题答案键数值错误与主观题评分问题——审查发现的唯一 BLOCKER 恰在此类型上。三类型验证后，模板才算跨课程类型可复用。
- lesson-18 同时是 Sprint 0 修复的回归载体，双重价值。

## 8. Sprint 6 — 全量质量分层（1~2 周）

- **30 课逐课评分**（C4-C5 Phase 9 评分卡），产出真实 `RELEASE_READY` 清单。
- **评分卡权重修订**（提交给 C4-C5 V1.1 修订）：Runtime/E2E 从 2 分提至 10 分（自"教学设计"15→13、教材对齐 15→13、Practice 10→9 匀出），否决规则不变。理由：E2E 是唯一能端到端证明学习闭环的维度，2/100 会引导执行者把它排到最后——与 C4-C5 自己"Browser E2E 是 Release Gate"的定位矛盾。
- **状态机迁移**（C4-C5 Phase 8）：`CONTENT_READY/RUNTIME_READY/MASTERY_READY/RELEASE_READY` 新词表与现行 `content/release-policy.js` 的 ready/review 体系**必须给出映射与迁移脚本**，两套词表并存正是 C4-C5 第 17 节批评的"第二事实源"问题。建议实现为 releaseStatus 的维度化扩展（如 `ready` → `{content:ready, runtime:ready, mastery:ready}`），而非平行的第二字段。
- Source Registry 补齐 30/30 课程来源覆盖（C4-C5 P3.2）。

---

## 9. 明确推迟项（含前置条件）

| 项 | 推迟到 | 前置条件 |
|---|---|---|
| 武汉中考校准矩阵（C4-C5 Phase 4） | Sprint 6 之后 | Source Registry 中 `S1-WUHAN-EXAM` 等来源的 `provenanceUrl` 落实、版本锁定。来源未登记前产出无法审计，违反项目自身来源原则 |
| 下册课程扩展（u08 金属起步） | Golden A/B/C + E2E 稳定后 | ① Sprint 1 已把 30 个下册实验素材登记为 `PENDING-LOWER-SEMESTER`；② 按逐课扩展原则（不批量复制模板）；③ lesson-03-acid-intro 的 displayOrder 在下册开建时重新分配段位（当前 16 插在上册序列中） |
| 方程式书写规范升级（全库 "→" 改 "= 条件" 文本约定） | Sprint 6 之后与下册建设并行 | 先在 `core/utils/equation.js` 定义渲染约定并让 lesson-16/17（正是教书写规范的课）先行示范 |
| 题目 ID 规范化（legacy L30→lesson-18 等错位） | 不做改名 | 旧 ID 锚定 localStorage 进度与图谱关系，**不可改名**；仅在 lesson-manifest 注释固化映射说明，新题一律 `L{displayOrder}-*` |

---

## 10. 时间线与依赖

```text
周 1      Sprint 0  止血（坏题+语义规则）        ← 无依赖，立即开始
周 1-3    Sprint 1  内容语义收敛                 ← 依赖 Sprint 0 的审计规则
周 3-4    Sprint 2  Runtime 差距分析             ← 可与 Sprint 1 后半并行
周 4-5    Sprint 3  Browser E2E                  ← 依赖 Sprint 1（诊断链路必须先修好，否则 E2E 路径 7/8/11 必然失败）
周 5-6    Sprint 4  Golden A (L01)
周 6-7    Sprint 5  Golden B + C
周 7-9    Sprint 6  全量分层 + Source Registry
合计约 7~9 周
```

关键依赖说明：
- **E2E 必须排在 Sprint 1 之后**：路径 7/8/11（诊断→补救→再检测）对 lesson-14~18 走不通（知识点链接缺失），先建 E2E 只会得到一堆预期失败。
- Sprint 2 与 Sprint 1 后半可并行（架构修复与内容生产互不触碰）。
- Source Registry 的 S0 文档落实是外部依赖（项目所有者），全程跟踪，不阻塞工程 Sprint。

---

## 11. 风险登记

| 风险 | 概率 | 应对 |
|---|---|---|
| 知识点链接补齐误链（把学生引向错误补救路径） | 中 | AI 初配 + 逐题人工复核；抽查 3 课走完整诊断链路验证 |
| 副本对齐脚本误覆盖正确数据 | 中 | 对齐前建基线提交；以信息更全一侧为准；33 处逐条出 diff 供人工审 |
| E2E 在 CI 不稳定（GitHub Actions 环境） | 中 | 测试固定 seed、放宽动画断言、重试一次策略；总时长预算 5 分钟 |
| Source Registry S0 文档持续缺位 | 高 | 第 6 节的降级预案：显式记录妥协而非静默放行 |
| C4-C5 计划与实现的设计分歧（如 P1.6 再检测策略）引发执行摇摆 | 中 | Sprint 2 内逐条裁决并书面记录于 MASTERY-STANDARD.md，以代码现状为准修订文档 |
| 内容修改引入新坏题 | 中 | S1–S6 语义门禁永久生效；E2E 路径 16 答案键回归 |

---

## 12. 总验收标准（全部 Sprint 完成后）

```text
□ 语义审计 S1–S6 全部 BLOCKER 且全绿
□ 30 课知识点链接、副本一致性、解析覆盖率 100%
□ 诊断→补救→再检测链路对 30 课全部生效（E2E 抽样 + 单测全量）
□ 16 条 E2E 路径为发布门禁
□ Golden A/B/C 三类型课程评分 ≥95 且无阻断项
□ 真实 RELEASE_READY 清单（分层状态机）替代单一 ready
□ Source Registry 30/30 覆盖
□ 一名初三学生可以在不理解系统结构的前提下自然完成一节课（C4-C5 第 17 节的 Done 定义）
```

---

## 附：与 C4-C5 V1.0 的逐条对照（本计划改了什么）

| C4-C5 原条目 | 本计划处理 |
|---|---|
| 无止血安排 | **新增 Sprint 0**（3 道坏题 + 语义规则） |
| Phase 0/1 规格书式执行 | **改写为差距核验表**（4.1），实际开发量 ~15% |
| P1.3 答案协议 | 缩小为"删视图层容错 + Loader 断言" |
| P1.6 Recheck 不重复原题 | **裁决保留现行"错题优先"策略**，书面记录 |
| Phase 4 武汉校准 | 推迟，前置 Source Registry 落实 |
| Phase 9 评分卡 | 权重修订：Runtime/E2E 2→10 |
| Phase 8 状态机 | 增加与现行 release-policy 的映射迁移方案 |
| Phase 10 E2E 12 条路径 | 扩充为 16 条（+知识地图/册次切换/损坏恢复/答案键回归） |
| Phase 13 Golden A/B | 扩充为 A/B/**C（计算型）** |
| 未覆盖 | **新增**：103 题知识点链接、33 处副本漂移、知识点中文名显示、死内容登记、npm test 跨平台、state.currentLessonId 隐藏 bug、Lab 加载瀑布 |
