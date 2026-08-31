# ChemLab-G9-Eng-web 双维度审查报告与修复计划

**审查日期：** 2026-08-27
**审查基线：** `main` @ `213e5c2`（docs: add Phase C4-C5 comprehensive audit and repair plan）
**审查维度：** 系统架构 / 课程质量
**审查方式：** 全量代码阅读 + 自动化扫描脚本（题目有效性、重复与漂移检测、引用可达性）+ 项目自带门禁复跑

---

## 0. 总体结论（TL;DR）

| 维度 | 评级 | 一句话结论 |
|---|---|---|
| 系统架构 | **B+（良好）** | 分层契约真实成立、门禁完整、186/186 测试全绿；主要问题是少量全局耦合、串行加载瀑布、死内容与 Windows 可用性 |
| 课程质量 | **C+（合格但有硬伤）** | 上册 7 单元课程生产链完整、字段规范；但发现 **3 道坏题（含 1 道答案键错误、2 道无有效答案）**、**103 道题无知识点链接导致诊断链断裂**、**33 处重复题内容漂移** |

**最严重的单个问题：** `lesson-18-stoichiometry-calculation-practice.json` 的 L30-P06——正确答案 18g 就在选项中（选项 A），答案键却标为 16g，且解析原文自曝"实际应为18g，此处16g为干扰项。正确答案：18g"。**学生答对会被判错，直接打击学习信心。**

**项目自评对照：** 仓库内的 `docs/roadmap/PHASE-C4-C5-COMPREHENSIVE-AUDIT-REPAIR-PLAN-V1.0.md` 已识别出 E2E 缺失、Source Registry 不完整等问题，判断准确；但该计划**未覆盖**本次发现的答案键错误、题目无有效选项、知识点链接缺失、重复题漂移等具体缺陷，本报告可作为其 P0 内容补强。

---

## 1. 审查执行摘要

| 检查项 | 结果 |
|---|---|
| `node --test tests/*.test.mjs`（Git Bash 展开） | **186/186 全绿**（约 4.4s） |
| `npm test`（Windows cmd） | **失败**——glob 未展开，`Could not find 'tests\*.test.mjs'`（CI 在 Linux 上正常） |
| `node scripts/runtime-audit.mjs` | PASS |
| `npm run audit:content`（integrity + lesson audit） | Gate PASS：30 课全部 released/ready，1121 道源题，0 manifest 违约 |
| 题目全量扫描（自建脚本） | 1242 个题目对象 / 1126 个唯一 ID / 答案索引全部在范围内 |
| 重复 ID 检测 | 116 个 ID 在"主课程文件"与"split 资源文件"中重复，其中 **33 处内容已漂移** |
| 实验文件可达性 | `content/experiments/` 下 **30 个 JSON 全部未被任何课程引用**（不可达死内容） |

---

## 2. 系统架构审查

### 2.1 总体评价

声明的架构（`index.html → bootstrap → application（组合根）→ controllers → 领域引擎 → views`）**在代码中真实成立**，不是纸面架构：

- **依赖方向干净。** `views/` 不 import 引擎；引擎（`core/`、`engine/`）零 DOM 依赖，可在 Node 直接测试——这是 186 个测试无需 DOM 即可运行的根本原因。`scripts/runtime-audit.mjs` 还会静态校验相对 import 可解析性，把分层契约变成了机器门禁。
- **组合根职责清晰。** `app/application.js`（482 行）集中装配 controller/view/路由分发；`bootstrap.js` 只负责 DOM 挂载与启动错误兜底（含转义后的诊断信息渲染）。
- **持久化健壮。** `progress-service.js` 对 localStorage 损坏做备份（`chemlab_v16_corrupt`）后重置，配额超限不阻断答题；`state.js` 有 schemaVersion=2 与 legacy 数据迁移（含 mastery 双形态兼容）。
- **XSS 防护一致。** 全部 16 个含 `innerHTML` 的视图文件均通过 `escapeHtml` 转义内容字段（抽查 quiz-view、v19-course-view、bootstrap 无遗漏）。
- **CI/CD 门禁完整。** workflow 串联语法检查 → 测试 → runtime audit → JSON 校验 → 内容门禁 → Pages 部署；`build-pages.mjs` 用显式 allowlist 组装 dist/，避免工程目录泄漏到学生端。
- **代码质量细节好。** 注释解释"为什么"而非"是什么"（如 assessment-runtime-controller.js:98-107 关于再检测排序的说明）；router 未知路由回落 home；刷新后 quiz 会话可从 localStorage 恢复。

### 2.2 架构发现清单

#### ARCH-1【中】`npm test` 在 Windows 本地不可用
- **证据：** `package.json` 的 `"test": "node --test tests/*.test.mjs"` 在 Windows cmd/npm 下 glob 不展开，直接报 `Could not find 'tests\*.test.mjs'`（本次实测复现）。CI 跑在 ubuntu（sh 会展开 glob）所以门禁是绿的，本地 Windows 开发者会误以为测试坏了。
- **修复：** 改为 `node --test tests/`（Node ≥18 支持目录参数，递归匹配 `*.test.mjs`），一行修复且跨平台。

#### ARCH-2【中】Lab 门户串行请求瀑布 + `loadExperiment` O(N) 全量扫描兜底
- **证据：** `app/content-service.js:60-71` `getExperimentCatalog` 对每门课 `await loadLesson` 再对每个实验 `await getExperiment`，首次进入 Lab 页约 **30+ 次串行 fetch**。且 `content-loader.js:35-53` `loadExperiment` 的兜底路径会顺序拉取**所有**课程 JSON 逐个找嵌入实验（O(N) 次 fetch），实验 ID 拼错时放大为 30 次无谓请求。有缓存所以只有首次慢，但首屏体验（尤其弱网）受损。
- **修复：** ① catalog 构建改 `Promise.all` 并行；② 为实验建立一次性索引（lesson → experimentIds 映射，来自已加载 manifest 与 lesson 缓存），消灭全量扫描兜底；③ 兜底扫描仅在显式 debug 模式保留。

#### ARCH-3【中】Shell ↔ App 通过 `window` 全局变量契约耦合
- **证据：** `application.js:47-56` 依赖 `window.chemLabTextbookTerm` / `window.chemLabSetTerm`；`portal-shell.js` 反向写这些全局并广播 `chemlab:term-change` 事件；另有 `window.chemLabApplication`、`window.chemLabState`（bootstrap.js:63-64）、`window.__chemLabCurrentLessonId`（v19-course-view.js:5）。跨模块通信靠 4 个 window 全局 + 1 个自定义事件，契约不可类型检查、易被第三方脚本污染。
- **修复：** 收敛为一个显式的 `TermService`（事件 + 状态合一），由 application 注入 shell；`__chemLabCurrentLessonId` 改走 `state.currentLessonId`（该字段在 application.js:241 已被读取，但目前没有任何代码写入它——**读取的是一个永远为空的值**，这是隐藏 bug 而不仅是坏味道）。

#### ARCH-4【中】题目数据双份维护且已发生漂移（详见 CONTENT-6）
- **证据：** 主课程 JSON 内嵌 `questions` / `diagnosticQuestions` / `mastery.questions`，同时 `resourceRefs` 指向的 split 文件（`-practice.json` 等）又有一份。运行时以 split 文件为准，但主文件的副本仍会被 `registerQuestions` 注册进全局 `questionById`（`content-service.js:73-93`），**后注册者覆盖先注册者**——两份不一致时，诊断映射取决于加载顺序。现有 `content-integrity-v19.mjs` 只查结构（模板占位、manifest 契约），**不查两份副本是否一致**，33 处漂移全部漏网。
- **修复：** 确立"split 文件为唯一事实源"，主文件仅保留引用（`resourceRefs` + 计数）；过渡期先在审计脚本中加"副本一致性"检查并设为 BLOCKER。

#### ARCH-5【低】`renderCourseRoute` 用 `setTimeout(1400)` 同步 UI
- **证据：** `application.js:169-189`：引导学习提交后等 1400ms 再重渲染并手工恢复展开卡片与滚动位置。魔法数时序在慢设备上会闪烁/丢状态，快设备上白等 1.4 秒。
- **修复：** 让 `recordGuidedCheck` 返回状态并由视图做局部 DOM 更新（只更新该卡片的状态徽标），而非整页重渲染。

#### ARCH-6【低】知识点中文标签硬编码在视图层，仅覆盖第一课
- **证据：** `views/v19-course-view.js:44` `KNOWLEDGE_LABELS` 只有 lesson-01 的 8 个映射；`formatKnowledgePoint` 对其余 44 个知识点直接返回英文 ID。`content/knowledge/knowledge-graph.json` 明明有全部 52 个节点的 `name` 字段（如 `air-composition → 空气的组成`），视图没有使用。**学生在 lesson-03 以后的"学习目标"卡片、诊断弱项列表中会看到 `acid-intro`、`environmental-impact` 这类原始 ID。**
- **修复：** 视图入参增加 `knowledgeNames`（由 application 从 knowledgeEngine 一次取齐传入），删除硬编码表。

#### ARCH-7【低】manifest `day` 键重复导致 `dayById` 映射碰撞
- **证据：** `lesson-manifest.js` 中 `day:'11'` 出现 2 次（lesson-06-molecules / lesson-11-atomic-structure）、`day:'12'` 2 次、`day:'13'` 2 次；`content-loader.js:28` `dayById = new Map(days.map(d => [d.day, d]))` 后写者覆盖先写者；`loadLesson` 按 day 查找时 `find` 命中第一个。manifest 头部注释已承认 day 是 legacy 字段，但碰撞行为未在任何地方声明。
- **修复：** 短期：`dayById` 构建时遇重复 day 直接跳过并 warn；长期：内容彻底切到 `canonicalId`，`day` 字段废弃。

#### ARCH-8【低】死代码与不可达内容
- **证据：** ① `content/experiments/` 30 个 JSON（金属、酸碱盐、化肥等下册实验）无一被任何课程 `experiments`/`resourceRefs` 引用，Lab 门户只编目课程挂接的实验，故全部不可达；② `content/experiments/exp-metal-acid.js`（JS 版实验）无任何 import/引用；③ `content/labs/zone11.js`/`zone4.js` 仅被 guided-learning 的 lab-zone 步骤动态 import，属可达（无问题）。README 明言"目录清扫已完成"，与事实不符。
- **修复：** 给 30 个实验文件在 Source Registry / review 体系中登记状态（`PENDING-LOWER-SEMESTER` 或 `RETIRED`），或在下册课程建设中挂接；删除 `exp-metal-acid.js`。

#### ARCH-9【低】无浏览器 E2E 回归
- **证据：** 186 个测试全部为 Node 层逻辑测试；完整学习闭环（引导→实验→练习→诊断→补救→再检测→Mastery→迁移）从未在真实浏览器中被自动验证。项目自己的 Phase C4-C5 文档第 2.3 节也承认这是首要风险。
- **修复：** 按 DEV-REC 中既定计划引入 Playwright，先覆盖 L01/L02 全闭环 + 本报告的坏题回归（见修复计划 P2）。

#### ARCH-10【低】`escapeHtml` 三处重复实现
- **证据：** `bootstrap.js:20`、`quiz-view.js:85`、`v19-course-view.js:85` 各有一份相同的转义函数。
- **修复：** 提取到 `core/utils/html.js`（`core/utils/equation.js` 已存在，目录习惯一致）。

### 2.3 架构维度结论

冻结的架构**值得维持**：分层真实、门禁机器可执行、测试金字塔的逻辑层扎实。不存在需要推翻重来的问题；上述 10 项中无 BLOCKER，4 项中危都是收敛性/健壮性打磨，符合其"不再无理由重写"的冻结原则。

---

## 3. 课程质量审查

### 3.1 覆盖率与结构

| 册 | 单元 | 课程数 | 状态 |
|---|---|---|---|
| 上册 | u01 走进化学世界 ~ u07 燃料及其利用（7 单元） | 29 | 全部 released/ready，单元顺序符合人教版主线 |
| 下册 | u08 金属 / u09 溶液 / u10 酸和碱 / u11 盐化肥 / u12 化学与生活 | **1**（lesson-03-acid-intro，u10） | 下册覆盖率约 4%（1/约25课） |

结构问题：
- **CONTENT-7【中】下册已有素材与课程严重脱节。** 30 个下册实验 JSON + 9 个 knowledge 文件（acid/fertilizer/salt/metal 等）已经写好，但没有任何下册课程引用它们（见 ARCH-8）。这不是错误，但构成 README 警告过的"虚假完成度"风险：数据存在 ≠ 课程可用。应在 Source Registry 登记这批素材的处置状态。
- **【低】lesson-03-acid-intro 的 displayOrder=16 插在上册课程序列中间。** 它 `semester:'lower'`，上册视图会过滤掉它，但任何按 displayOrder 排序的全量视图（如 home 数据未过滤时）会出现序列错乱。下册建设时需要重新分配 displayOrder 段。
- **【低】题目 ID 前缀与课程编号错位。** lesson-18 的题叫 `L30-*`，lesson-07 的题叫 `L12-*`，lesson-14 的叫 `L17-*`（legacy 30 天计划残留）。维护时极易张冠李戴，本次漂移检测也因此更难做。
- **【低】g9-course-map.js 12 个单元全部 `status:'planned'`，与实际（u01-u07 已建成 29 课）不符。** 违反其自身 P0.3"报告只读 canonical data"原则，属元数据陈旧。

### 3.2 科学性错误（最高优先级）

#### CONTENT-1【BLOCKER】L30-P06 答案键错误——学生答对会被判错
- **文件：** `content/lessons/lesson-18-stoichiometry-calculation-practice.json`
- **题目：** "某同学将2gH₂和16gO₂混合点燃，充分反应后生成水的质量是？" 选项 `["18g","16g","14g","12g"]`，`answer: 1`。
- **正确答案应为 18g（选项 0）**：2g H₂ + 16g O₂ 恰好按 1:8 质量比完全反应，质量守恒，生成 18g 水。
- **解析原文自曝：** "生成18g水（但选项中只有16g，需检查：实际应为18g，此处16g为干扰项）。正确答案：18g。" ——解析一边承认 18g 正确，答案键一边标 16g。这是一道**带着未解决审查意见直接上线**的题。

#### CONTENT-2【BLOCKER】L12-P08 四个选项全部正确，无有效答案
- **文件：** `content/lessons/lesson-07-oxygen-preparation-comprehensive-practice.json`
- **题目：** "用高锰酸钾制取氧气时，下列操作错误的是？" 选项：试管口略向下倾斜（√正确操作）、先预热再集中加热（√）、实验结束先移导管后熄灯（√）、试管口塞一团棉花（√）——**四项全是正确操作**，`answer: 3` 却把"塞棉花"（本题情境下的必要操作）判为错误。
- **解析原文自曝：** "……D放棉花也正确，无错误选项。修正：选项应改为'试管口向上倾斜'。" ——同样是一道带着"待修正"注释上线的题。

#### CONTENT-3【高】L05-Q03 同类缺陷 + 课内自相矛盾
- **文件：** `content/lessons/lesson-05-oxygen.json`
- **题目：** "下列关于氧气物理性质的描述错误的是？" 四个选项（无色无味气体/不易溶于水/密度略大于空气/**液态氧气是淡蓝色液体**）**全部是真命题**，`answer: 3` 将"液氧淡蓝色"这一教材标准事实判为"错误描述"。
- **自相矛盾：** 同课 `lesson-05-oxygen-diagnostic.json` 的 L05-D02（"下列关于氧气物理性质的描述正确的是？"）把"液态氧气呈淡蓝色"标为**正确**答案。同一课内一题说它对、一题说它错。
- **修复：** 将 L05-Q03 的 D 项改为真正错误的陈述（如"氧气易溶于水"），或把题干限定为"气态氧气"并把 D 改为"气态氧气是淡蓝色气体"。

#### 其余抽样（未发现错误的范围声明）
以下抽样经人工核验**未发现**科学性错误：lesson-05 全部 6 道练习题中除 Q03 外（含 78%/21%/0.94%/0.03% 空气组成、氧化反应vs化合反应辨析、高锰酸钾方程式配平）；lesson-18 全部 6 道练习计算（P01-P05 数值全部正确：31.6g KMnO₄→3.2g O₂、80g CaCO₃→44.8g CaO、13g Zn→0.4g H₂）；lesson-05 mastery 21 题抽样 4 题（红磷测氧含量、排水法收集依据等）；lesson-17（能源与环境）诊断题。方程式配平与化学式（KMnO₄、K₂MnO₄、CaCO₃、H₂SO₄ 等）均正确。

### 3.3 违反项目自身内容标准的问题

项目在 README/CONTENT-STANDARD 中定义了 7-Gate 审计与 Lesson Production Contract，以下发现是**对其自身标准的违反**：

#### CONTENT-4【高】103 道题无知识点链接 → 诊断/补救链断裂（违反 Gate 6 Knowledge-Linkage Audit）
- **证据（自建扫描，按文件聚合）：** lesson-14~18（燃烧/方程式书写/配平/计算单元）的 diagnostic 3 题 + practice 6 题全部缺失 `knowledgeIds`/`knowledgePoint`；lesson-21~24（碳及其氧化物单元）practice 各 2 题、diagnostic 各 3 题缺失。合计 103 题。
- **影响链路：** `core/diagnosis/question-knowledge-map.js` 靠 `knowledgeIds` 建立题目→知识映射；无链接的题答错后无法归因到知识点 → `diagnosis-engine` 不产生 weakPoints → 补救计划缺失 → 再检测抽不到题（`startRecheck` 按 knowledgeIds 过滤题池，`matches.length===0` 直接 return null）。**这些题答错等于白错，学生拿不到任何补救。**而这批课程的 `review.knowledgeLinks` 字段全部自评 "pass"——自评与事实不符。
- **附带发现：** `lesson-16/17/18` 主文件 `questions: 0`、`mastery.questionCount: undefined`（题目全在 split 文件），审计矩阵首列为 0 也印证。结构上没问题（运行时从 split 文件取），但与其 "Lesson Production Contract" 第 8 条"分层练习"在主文件中的可读性预期不符。

#### CONTENT-5【中】157 道题无解析 → 反馈环节缺失
- **证据：** 全部 15 个 transfer 文件 × 4 题 = 60 道迁移题**均无 explanation**；绝大多数课程的 diagnostic 题无解析。quiz 结果页的"每题详情"（quiz-view.js:58）对无解析题只能显示题干与对错，"误解诊断→解释"的学习闭环在迁移环节断掉。
- **裁量：** diagnostic 题无解析可以辩解为"诊断用途优先"（学生答错走 remediationStep 跳回引导步骤），但 transfer 题作为学习闭环的最后一环（陌生情境检验），无解析直接削弱"迁移后修正"价值。建议 transfer 必须补解析，diagnostic 至少补"为什么错"一句话。

#### CONTENT-6【中】33 处重复题内容漂移（主文件 vs split 文件）
- **证据：** 116 个题目 ID 同时存在于主课程 JSON 与 split 资源文件；语义级比对（排序键后深度比较）显示 **33 处内容不一致**，集中于 lesson-14~18 与 lesson-21~24 的 diagnostic 对：主文件版本带 `knowledgeIds`，split 文件版本不带（还伴随题干措辞差异，如 L25-D02 "下列哪种措施不能有效减少CO₂排放？" vs "下列措施不能有效减少CO₂排放的是？"）。
- **影响：** 同一个题 ID 两份数据，`questionById` 注册顺序决定哪个生效；答案键一旦在一边修改就会产生"练习时是对的、再检测时是错的"这类极难排查的缺陷。这是 CONTENT-1 级别事故的温床。
- **根因：** 内容生产流程没有"单一事实源"约束，审计脚本不查副本一致性（见 ARCH-4）。

### 3.4 教学设计质量（抽样正面评价）

lesson-05 作为抽样深读对象，教学设计**高于平均水准**：
- 学习目标可观察（"知道空气的组成（氮气约78%…）"而非"了解空气"）；
- 5 段式 sections（要掌握什么/为什么/核心概念/常见误区/学习方法）符合"现象→模型→解释→规律"链；
- 实验含安全字段（"试管口略向下倾斜；先移导管后熄灯；高锰酸钾有腐蚀性"）；
- guided-learning 9 步含 lab-zone 交互步骤（动态 import `content/labs/zone4.js`），检查题错误后不锁定、可重试（v19-course-view.js:100-102 注释明确该策略）；
- 误解词表（misconceptions）与诊断题 errorType 对齐，remediationStep 指回具体引导步骤。

**主要教学设计短板：**
- **CONTENT-8【低】化学方程式书写不符合教材规范。** 全库使用 "→" 而非 "="，且普遍缺失反应条件（点燃/Δ/高温）与必要时的 ↑↓ 标注不完整（部分题有 ↑）。人教版九年级对方程式书写规范（等号、条件注写在上方）是明确考点，lesson-16（方程式书写）、lesson-17（配平）两课自身教的是规范，而题干与解析中的方程式却不按规范书写，存在"教一套、练一套"的风险。UI 层用等宽文本渲染，无下标/条件上标排版能力，建议至少统一为 "= 条件" 的文本约定（如 `2KMnO₄ =Δ= K₂MnO₄ + MnO₂ + O₂↑`）。
- **CONTENT-9【低】Source Registry 状态 PARTIAL。** S0（指定教材）文档仍待项目所有者提供（source-registry.json 自述），与 README "SOURCE_REGISTRY_PENDING" 一致——项目对这点是诚实的，此处仅作记录，风险在于 30 课已在 S0 缺位的情况下标为 released。

### 3.5 课程质量维度结论

课程质量的最大风险**不是覆盖不足（下册少是公开事实），而是已上线内容中潜伏的硬伤**：3 道坏题会直接误判学生，103 道无链接题让诊断系统对下册方向课程部分失效。这些缺陷全部穿透了自建的 7-Gate 审计（自评 pass）与 CI 门禁（PASS），说明**门禁校验的是结构，不是语义**——这是内容质量体系的系统性缺口，比单道错题更值得修复。

---

## 4. 修复计划

原则：延续仓库自身的"内容可信度 > 学习效果 > 实验反馈 > UI 打磨"优先级与 main 单分支流程；每项修复先补测试/审计规则，再改数据，最后提交（implementation → tests → audit → docs → commit → CI GREEN）。

### P0 — 止血（预计 1~2 个工作日，全部为小改动）

| # | 任务 | 具体动作 | 验证 |
|---|---|---|---|
| P0-1 | 修复 3 道坏题 | ① L30-P06：`answer: 1→0`，解析改为"质量守恒：2g+16g=18g，恰好完全反应"；② L12-P08：按解析既定方案把 D 项改为"试管口向上倾斜"（保持 answer:3）；③ L05-Q03：D 项改为"氧气易溶于水"（保持 answer:3），或改题干限定气态 | 手工核验 + P0-2 新审计脚本 |
| P0-2 | 建立语义级题目审计（治本） | 在 `scripts/content-integrity-v19.mjs` 增加规则并接入 `npm run audit:content`：① 解析含矛盾标记词（"需检查/实际应为/无错误选项/修正："）即 BLOCKER；② 答案索引越界即 BLOCKER；③ 副本一致性：同 ID 两处深度不等即 BLOCKER；④ choice 题缺少 knowledgeIds 链接即 WARN（下册扩容后升 BLOCKER） | 用本报告 3 道坏题与 33 处漂移做回归样本（先红后绿） |
| P0-3 | 统一题目事实源（消除漂移温床） | 以 split 文件为准，脚本一次性将主文件 `questions`/`diagnosticQuestions`/`mastery.questions` 中与 split 冲突的 33 处对齐（补 knowledgeIds 到 split 侧）；长期主文件只留计数与 resourceRefs | P0-2 规则③ 全绿 |
| P0-4 | 修复 `npm test` 跨平台 | `"test": "node --test tests/"` | Windows cmd 与 CI 各跑一次 |

### P1 — 补链（预计 1~2 周，内容工作量为主）

| # | 任务 | 具体动作 | 验证 |
|---|---|---|---|
| P1-1 | 补齐 103 题知识点链接 | lesson-14~18、21~24 的 practice/diagnostic 题逐题补 `knowledgeIds`（对照 knowledge-graph 52 节点）；同步修正这些课自评 pass 的 `review.knowledgeLinks` | P0-2 规则④ 归零；E2E 一条"答错→出现弱项→补救→再检测"链路 |
| P1-2 | 迁移题补解析 | 15 个 transfer 文件 × 4 题补 explanation（聚焦"陌生情境映射回课内原理"） | 审计脚本加"transfer 必须有解析"规则 |
| P1-3 | 知识点中文显示走图谱 | application 从 knowledgeEngine 取 `id→name` 映射传入 v19-course-view，删除 `KNOWLEDGE_LABELS` 硬编码（ARCH-6） | 手工验证 lesson-05 学习目标卡片显示中文名 |
| P1-4 | Lab 门户性能 | catalog 并行化 + 实验索引（ARCH-2） | 弱网（throttle）下 Lab 首屏请求瀑布消失 |
| P1-5 | 死内容登记 | 30 个下册实验 JSON 与 `exp-metal-acid.js` 在 source-registry/review 登记 `PENDING-LOWER-SEMESTER`/删除；g9-course-map 12 单元 status 改为 `built`/`planned` 实况 | runtime-audit 增加一条"content/experiments 文件必须被引用或登记"检查 |
| P1-6 | 全局契约收敛 | TermService 注入化（ARCH-3），修复 `state.currentLessonId` 永不为空的隐藏 bug | 相关单测 |

### P2 — 加固（按其 Phase C4-C5 计划推进，与本报告对齐）

1. **Playwright E2E**：优先覆盖 L01/L02 完整学习闭环 + P0 三道坏题的回归（防止答案键再被改坏）。
2. **方程式书写规范**（CONTENT-8）：确立文本约定（等号+条件），全库批量替换并让 lesson-16/17 的题目以规范格式呈现；考虑 `core/utils/equation.js` 渲染支持下标。
3. **题目 ID 规范化**：新题一律 `L{displayOrder}-*`；旧 ID 因锚定 localStorage 进度与图谱关系不可改名，在 lesson-manifest 注释中固化映射说明。
4. **下册建设**：按其 Phase C4 "逐课扩展、不批量复制模板"原则，从 u08 金属单元起步，直接复用已登记的 30 个实验素材（P1-5 的登记就是为此铺路）。
5. **ARCH-5 setTimeout 重构、ARCH-10 escapeHtml 提取、ARCH-7 day 键退役**：随其他改动顺带处理。

### 修复优先级依据

- P0 全部直接影响学生判定正确性或开发门禁可用性，且改动极小、风险极低；
- P1 修复"诊断→补救"闭环的实际有效性——这是产品核心承诺（README 愿景：诊断、补救、再检测、迁移），目前对 2025 系列课程（lesson-14~18、21~24）承诺未兑现；
- P2 是可持续性与规模扩张投资，节奏可与内容建设并行。

---

## 附：本次审查使用的自动化扫描（可复用为审计规则）

```js
// 题目有效性 + 重复漂移检测（在 content/lessons 上运行）
// 1. answer 索引越界检查（当前：0 处）
// 2. 解析矛盾标记词检查（当前：2 处 → L30-P06、L12-P08）
// 3. 同 ID 副本深度一致性（当前：33 处漂移）
// 4. knowledgeIds 缺失统计（当前：103 题）
// 5. explanation 缺失统计（当前：157 题，其中 transfer 60 题）
// 6. content/experiments 引用可达性（当前：30/30 未引用）
```
