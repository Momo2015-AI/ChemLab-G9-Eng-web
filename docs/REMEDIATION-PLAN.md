# 修复计划 (Remediation Plan) — 2026-08-26

**Status:** CANONICAL / MANDATORY — 本文档列出的每一项都必须被处理（修复、或经项目所有者明确裁决后关闭），处理前不得在同一批次继续叠加新内容。所有向本仓库提交代码或内容的人（包括人类与 AI agent）都必须先读这份文档，确认自己的改动不会重复制造清单里已经发生过两次的问题。
**Version:** 1.0
**Established:** 2026-08-26
**关系:** 本文档是"当前必须处理的具体问题清单"，`docs/DEVELOPMENT-ROADMAP.md` 是"长期该怎么做事的规范"。两者配合看：本文档处理完的问题，如果背后是一类会重复出现的模式，要同步补进 `DEVELOPMENT-ROADMAP.md` 并配一条自动化测试。

---

## 如何使用本清单

- 每一项都有 **状态**（`OPEN` 待处理 / `NEEDS-DECISION` 需要人裁决 / `DONE` 已完成）、**证据**（怎么复现/验证）、**修复步骤**。
- 处理完一项，把状态改成 `DONE`，附上修复的 commit hash，不要删除这一条——这是这个仓库反复出现同类问题的记录，删掉记录等于让下一个人重新踩一次坑。
- `NEEDS-DECISION` 的项不允许自行处理后直接改成 `DONE`——必须先获得项目所有者确认。

---

## A. 架构问题

### A1. 〔NEEDS-DECISION，需要仓库管理员操作〕GitHub 分支保护规则未开启

**现状纠正**：上一轮审查报告里说"建议接入 CI"是不准确的——CI 早就存在（`.github/workflows/build-check.yml`，2026-08-08 就有了），而且配置是对的：`validate` job 跑 `npm test` + `npm run audit:content`，`deploy` job 显式 `needs: validate`，理论上验证不过就不会部署到线上。

**真正的问题**：`on: push: branches: [main]` 是"推送后触发"，不是"合并前拦截"。没有 GitHub 分支保护规则（Settings → Branches → Branch protection rules → 勾选 "Require status checks to pass before merging"），任何人（包括 AI agent 用 token 直接 push）都可以把没通过 `npm test` 的提交直接写进 `main` 的历史。这正是 2026-08-25/26 两次 mastery schema 事故实际发生的方式——代码确实推上去了，CI 大概率跑红了，但没有任何机制阻止这次推送本身。

**修复步骤**（需要有仓库管理员权限的人执行，AI agent 用 push token 做不到这一步）：
1. 打开 GitHub 仓库 Settings → Branches
2. 给 `main` 分支加一条 protection rule：勾选 "Require status checks to pass before merging"，选中 `validate` 这个 job
3. 如果希望更严格，同时勾选 "Require a pull request before merging"，彻底关闭直接 push 到 main 的权限，强制走 PR

**在这条生效之前的临时缓解**：见 A2。

### A2. 〔OPEN，所有贡献者立即遵守〕本地验证未做就推送——已经发生两次

**证据**：2026-08-25 09:13 推送了 mastery-schema 修复 + `DEVELOPMENT-ROADMAP.md`（明确写了新数据形状必须先确认运行时读得懂）；55 分钟后（10:09）的 u07 批次、以及次日的 u05 批次，**用了完全相同的、刚刚被判定为不兼容的 `{dimensions,criteria,items}` mastery 结构**。这不是不知道规则，时间线上规则已经发布，只能解释为推送前没有本地跑 `npm test`。

**规则（在 A1 的分支保护生效前，这是唯一的防线）**：
1. 任何推送到 `main` 之前，**必须**在本地跑：
   ```bash
   npm test && npm run audit:content
   ```
   两个命令都必须 0 失败 / Gate PASS，才允许推送。
2. 如果你推送后发现 CI 显示红色（无论是自己的 push 触发的，还是别人的），**下一次提交必须优先修复它**，不能带着已知失败继续在同一分支上叠加新内容——这个仓库已经出现过"新一批内容在旧一批内容还没修好的情况下继续往上摞"的模式，会让排查越来越难。
3. 拉取最新代码后，如果发现 `npm test` 在你什么都没改的情况下就是红的，说明上一位贡献者违反了第 1 条——记录下来（追加到本文档），但不要自己悄悄绕过去，按 A1 说的走完整修复流程。

### A3. 〔NEEDS-DECISION，需要项目所有者裁决〕lesson-09-chemical-formula 的单元归属冲突

**现状**：`content/lessons/lesson-09-chemical-formula.json` 内部 `unitId` 字段是 `u04`，但 `content/curriculum/lesson-manifest.js` 里登记的是 `u03`（commit `0759c92`，"per 人教版 third-unit curriculum"）。这个不一致已经连续两轮审查存在，`content-lesson-audit-v19.mjs` 现在正确报告为 Gate BLOCKED 的一部分。

**我的建议依据**（仅供参考，不代表最终结论）：人教版九年级化学上册标准单元划分是——第三单元《物质构成的奥秘》（课题1 分子和原子、课题2 原子的结构、课题3 元素），第四单元《自然界的水》（课题1 爱护水资源、课题2 水的净化、课题3 水的组成、课题4 化学式与化合价）。按这个划分，"化学式与化合价"属于第四单元课题4，即 `u04`，不是 `u03`。但我没有找到另一位贡献者做出 `0759c92` 这次改动时依据的具体材料，不能排除他们参考的是不同版本教材或有我不知道的理由。

**修复步骤**：
1. 项目所有者确认真实依据（核对实体教材或电子版目录）
2. 确认后，让 `lesson-manifest.js` 和 `lesson-09-chemical-formula.json` 内部的 `unitId` 字段保持一致（哪个字段需要改，取决于第 1 步的结论）
3. 如果归属变化，同步检查 `content/knowledge/knowledge-graph.json` 里相关节点的 `unitId` 标注是否也要跟着调整
4. 跑 `npm run audit:content` 确认 Gate 转为 PASS

### A4. 〔DONE，无需动作，记录用〕ID 命名空间隔离机制运行良好

u05（`L26-L30` 前缀）和 u07（`L17/L18/L19/L25` 前缀）两批课完全并行生产，`canonicalId` 数字后缀本身重复（都用了 14-17），但两边的题目 ID 前缀经核实完全没有冲突——说明 `docs/COURSE-DEVELOPMENT-STANDARD.md` Section 16 的"先 grep 再claim 前缀"规则确实被遵守了。这一条不需要修复，写在这里是为了让下一次审查知道这部分不用重新查。

---

## B. 课程问题

### B1. 〔OPEN〕u05 三门课的 mastery 文件需要做和 u06 一样的 schema 转换

**受影响文件**：`lesson-15-law-conservation-micro-mastery.json`、`lesson-16-equation-writing-mastery.json`、`lesson-17-equation-balancing-mastery.json`、`lesson-18-stoichiometry-calculation-mastery.json`

**问题**：用了 `{lessonId, dimensions, criteria, items}` 结构，`app/content-loader.js` 的 `loadMastery()` 读不出题目，`tests/content-namespace-integrity.test.mjs` 已经能自动抓到这个（2026-08-26 验证：4 个文件全部触发失败）。

**修复步骤**（和 2026-08-25 修复 u06 时用的方法完全一致，可以直接照搬）：
1. 把 `{dimensions, criteria, items}` 转换成 `{mastery: {threshold, questionCount, minCorrect, mode, dimensions, criteria, questions: items}}`——`dimensions`/`criteria` 作为附加 metadata 保留，不丢弃多维度设计的意图，只是把 `items` 挂到 `mastery.questions` 这个运行时真正读取的字段上。
2. 检查 `items` 里的题目 ID 是否和同一课 `lesson.questions`（base 文件里嵌入的概念检测题）有重复——如果有，参照 u06 的处理方式重新分配 ID（比如 `-Q01` 改成 `-MQ01`），避免 `content-integrity-v19.mjs` 报 "Duplicate effective runtime question id"。
3. 跑 `node --test tests/content-namespace-integrity.test.mjs` 确认这 4 个文件不再出现在失败列表里。

### B2. 〔OPEN〕u05 三门课的 base 文件需要补齐顶层 `experiments[]` / `questions[]`

**现状纠正（重要）**：上一轮审查报告把这三门课描述成"空壳课/没写完的草稿"，**这个结论是错的**，已核实修正。经检查，这三门课的 `-experiment.json` / `-practice.json` / `-diagnostic.json` / `-mastery.json` / `-guided-learning.json` / `-transfer.json` 全部存在且有实质内容（1KB-5KB，不是空文件）。真正的问题是：这三门课的 base 文件（`lesson-16-equation-writing.json` 等）只写了 `resourceRefs` 指针，没有像其他所有课一样**同时**在顶层直接嵌入一份 `experiments[]` / `questions[]` 小数组（通常是 3-6 道概念检测题，供课程页面直接渲染，与 `resourceRefs.practice` 指向的完整练习池是两回事）。`content-lesson-audit-v19.mjs` 的 `requiredArrays` 检查要求的正是这个顶层数组，不认 `resourceRefs`。

**修复步骤**：
1. 参照 `content/lessons/lesson-06-molecules-and-atoms.json` 的结构（顶层同时有 `experiments`/`questions` 数组和 `resourceRefs`），给这三门课的 base 文件各补一份顶层 `experiments`/`questions`——内容可以直接从已有的 `-experiment.json`/`-practice.json` 里提炼 1 个实验摘要 + 3-6 道代表性概念题，不需要从零生产新内容。
2. 跑 `node scripts/content-lesson-audit-v19.mjs` 确认这三门课的 `missing` 列不再出现 `experiments[]`/`questions[]`。

### B3. 〔OPEN，工作量较大，单独排期〕mastery 池复用已见过题目的问题，横跨 u06 和 u07 两批课

**证据**：
- u06（2026-08-25 已发现并做过 ID 重命名规避冲突，但没有解决"是否真的是未见过的题"这个根本问题）
- u07（2026-08-26 新发现）：`content-integrity-v19.mjs` 报告 `L17-D01`/`L17-D02`/`L18-D01`/`L18-D02`/`L19-D01`/`L19-D02`/`L25-D01`/`L25-D02` 共 8 处"重复的运行时题目 ID"，核实后确认是 diagnostic 文件里的题被原样复制进了 mastery 文件。

**为什么这是个真问题，不只是 ID 卫生问题**：本仓库的 mastery 模型明确设计成 `mode: "unseen-transfer"`——用没见过的题检验是否真正掌握，而不是检验"记不记得刚做过的题"。复用诊断题/概念检测题作为 mastery 题，从设计目的上就违背了这个原则,即使 ID 不冲突,分数本身的含义也是有问题的（虚高）。

**修复步骤**：
1. 逐一核对 u06（5 门）、u07（4 门）各课的 mastery 题池，标出哪些题和 diagnostic/base-questions 重复
2. 为重复的题目位置重新出未见过的新题（不是换个说法重写同一道题，是覆盖同一知识点的不同情境/不同表述）
3. 这个工作量接近重新产出 30-50 道题，建议作为独立的内容任务排期，不要和其他修复混在一次提交里，方便审查。

### B4. 〔OPEN，第四次记录〕u10（常见的酸和碱）持续未推进

从第一轮审查到现在，`u10` 一直只有"酸入门"一门课，中间至少三次在审查报告里提出要补碱、pH、中和反应，均未被采纳；这期间新开了 u05、u06、u07 三个单元。**这不是技术问题，是排期优先级的问题，写在这里是为了明确记录这个模式，不是继续用同样的话再提一遍**——如果这次还是被跳过，说明"先完成已开工单元再开新单元"这条建议本身需要项目所有者重新评估是否采纳，而不是我继续在审查报告里重复。

### B5. 〔DONE，记录用〕知识图谱悬空引用——v19 隔离题目的遗留关系

**发现**：2026-08-28 落地 `docs/KNOWLEDGE-GRAPH-UPGRADE-PLAN.md` Sprint A 时，新增的 `scripts/content-graph-schema-audit.mjs` 首跑即抓到 19 处悬空引用（此前 `content-integrity-v19.mjs` 与 `npm test` 均不校验图谱引用，属审计盲区）：
- 14 条 `question` 关系指向 `q-acid-*` 旧题 ID——这些题目已被 v19 隔离（见 `content/review/question-quarantine-v19.json` 与 `content-review-registry.json`），题目不在运行时池中，关系成死链。
- 3 条 `commonMistake` 关系使用无前缀旧别名（`single-phenomenon-overgeneralization` 等），canonical-misconceptions.js 的 ALIAS_MAP 已给出规范 ID 映射。
- 1 处节点 `misconceptionIds` 引用 `mc-pure-mixture`，注册表无此 ID。

**修复**（commit 见 git log 2026-08-28）：删除 14 条死链（acid-intro/acid-property 仍保留 L03-* 存活关联）；3 条关系改写为 ALIAS_MAP 规范 ID；删除 `mc-pure-mixture` 引用（该节点保留语义正确的 `mc-single-compound-distinguish`；`mc-mixture-pure` 已归属 element-classify，不做语义拉伸替换）。

**防复发**：`content-graph-schema-audit.mjs` 已接入 `npm run audit:content` 链，question/experiment/commonMistake/misconceptionIds 引用无法解析即 Gate BLOCKED；`tests/graph-schema-integrity.test.mjs` 在 `npm test` 层做同类断言。

**教训**：题目被隔离/重命名时，知识图谱的引用关系必须同步清理——此前两轮 mastery schema 事故都是"改了一边漏了另一边"，本次是同一模式的第三个变体。

---

## C. 处理顺序建议

1. **A1（分支保护）最先做**——这是唯一能从机制上阻止清单里其余问题重演的动作，而且不需要理解任何化学内容，仓库管理员可以立刻做。
2. **A3（lesson-09 归属裁决）**——阻塞 Gate PASS，且决定会影响后续图谱设计，应该尽快定下来。
3. **B1 + B2**——机械性修复，方法已经验证过，风险低，一次处理完能让 u05 五门课全部转为真正的 PASS。
4. **B3**——工作量大，单独排期，不要和上面几项混在一起提交。
5. **B4**——需要项目所有者明确表态是否采纳，不是执行层面能单方面推进的。
