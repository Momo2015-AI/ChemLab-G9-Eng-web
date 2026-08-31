# 知识图谱升级计划 (Knowledge Graph Upgrade Plan) — 2026-08-28

**Status:** DRAFT — 待项目所有者确认后转为 CANONICAL
**Version:** 1.0
**Established:** 2026-08-28
**关系:** 本文档是 `content/knowledge/knowledge-graph.json` 及其周边数据的专项升级计划，与 `docs/REMEDIATION-PLAN.md`（当前具体问题清单）、`docs/DEVELOPMENT-ROADMAP.md`（长期规范）配套。图谱升级完成后，涉及的防回归测试与文档更新必须同步落地，遵循「自动化测试 + 文档 + 流程规范」三件套规则。

---

## 1. 现状基线（2026-08-28 实测）

| 指标 | 数值 | 说明 |
|---|---|---|
| 节点数 | 52 | upper 49 / lower 3，章节级粒度 |
| 关系数 | 345 | 全部为裸三元组 `{source, target, type}` |
| 关系类型分布 | prerequisite 57 / related 20 / commonMistake 3 / experiment 2 / question 263 | 只有 5 类语义，缺 contains/contrast 等 |
| 节点字段 | id, name, chapter, domain, bloomLevels, questions, semester, unitId, definition, prerequisiteIds, misconceptionIds, remediationGoal, prerequisites | 部分字段冗余 |
| 孤立节点 | 0 | 全连通，无完全无关系的节点 |
| 悬空关系 | 0 | source/target 均能解析到节点（排除 question 关系指向题目 ID 的情况） |
| question 关系 | 263 条 | 与节点 `questions[]` 数组**双重表示**；其中 142 条 target 无法从 base 文件题目池直接解析 |
| schema.json | 脱节 | 内容仍是旧模板（`level/relatedExperiments/mastery`），与真实结构不一致 |

**核心问题**：
1. `content/knowledge/schema.json` 与实际 `knowledge-graph.json` 结构完全脱节，无权威 schema，无法约束后续数据生产。
2. 双重表示：`node.prerequisites[]`/`node.questions[]` 数组与 `relations[]` 并存，改一边漏一边。
3. 关系无属性（无 weight/difficulty/description），无法支撑难度排序与自适应路径。
4. 关系类型少，缺 `contains`（知识点-子知识点）与 `contrast`（易混淆辨析）；`commonMistake` 仅 3 条，与 `canonical-misconceptions.js` 存量严重不匹配。
5. 节点 `prerequisiteIds` 字段存在于 46 节点，但 `prerequisites` 字段仅 1 节点有——字段命名不统一。

---

## 2. 升级目标

对照 GitHub 同类项目（清华 EDUKG 本体先行、课程图谱 5-8 种关系方法论、问题图谱难度/认知层级标签、四层实体模型）与本项目「章节级」现状，确立以下目标：

1. **schema 权威化**：`schema.json` 成为图谱唯一数据契约，审计脚本按它校验，消除结构漂移。
2. **单一事实源**：`relations[]` 为唯一事实源，节点内联数组降级为只读索引或删除，杜绝双重表示。
3. **关系属性化**：prerequisite 带 `weight`/`required`，question 关系带 `difficulty`，为自适应路径和 AB 测试提供依据。
4. **语义补全**：新增 `contains` 与 `contrast` 两类关系，`commonMistake` 对齐 misconception 存量。
5. **粒度演进**：以 u01/u02 为试点从章节级拆到知识点级，验证后再推广。

---

## 3. 升级项（分 Sprint）

### Sprint A：Schema 权威化（基础，最高优先级）

**Status:** DONE — 2026-08-28 完成。

**问题**：schema.json 与真实数据脱节，无约束能力。

**改动范围**：
- 重写 `content/knowledge/schema.json`，定义真实结构：必填字段、可选字段、枚举值（domain/bloomLevels/relation type）、取值约束。
- 新增审计规则 `scripts/content-graph-schema-audit.mjs`：按 schema 校验 `knowledge-graph.json`，违反即 Gate BLOCKED。已接入 `npm run audit:content` 链。
- 新增测试 `tests/graph-schema-integrity.test.mjs`（4 项）：节点契约符合性、关系类型与引用解析、misconceptionIds 字段解析、图级契约键。

**实施中发现并一并修复的数据问题**（审计先红后绿验证）：
- 14 条 `q-acid-*` question 关系指向 v19 已隔离的题目，属真悬空，已删除（acid-intro/acid-property 节点仍保留 L03-* 存活关联）。
- 3 条 commonMistake 关系使用无前缀旧别名，已按 `canonical-misconceptions.js` ALIAS_MAP 映射改为规范 ID（`mc-method-single-phenomenon-overgeneralization` / `mc-method-control-variable` / `mc-method-data-integrity`）。
- 节点 `single-substance-compound` 的 `misconceptionIds` 含无法解析的 `mc-pure-mixture`，已删除（该节点保留语义正确的 `mc-single-compound-distinguish`；`mc-mixture-pure` 归属 element-classify，不做语义拉伸替换）。
- experiment 关系语义确认为"节点 → 实验资源 ID"（课内嵌 experiments[].id ∪ content/experiments/ 注册表），契约按此定义。

**验收结果**：`npm test` 193/193；`npm run audit:content` 三段全 PASS；知识图谱 345 → 331 关系（0 悬空）。

### Sprint B：单一事实源化（消除双重表示）

**Status:** DONE — 2026-08-28 完成。

**问题**：`node.prerequisites[]`/`node.questions[]` 与 `relations[]` 并存。

**改动范围**：
- 选定 `relations[]` 为唯一事实源。
- 节点上的 `questions`/`prerequisiteIds`/`prerequisites` 数组：已从全部 52 个节点剥离（52×questions、52×prerequisiteIds、1×prerequisites），schema.json 列为 `forbiddenFields`，审计脚本遇违规即 Gate BLOCKED。
- question 关系 target 核验结论：142 条无法从 base 文件解析的 target 中，128 条合法（指向 mastery/diagnostic 等子池），14 条真悬空（q-acid-*，v19 已隔离题目），悬空已在 Sprint A 修复。
- 消费方改造：`views/knowledge-detail-view.js` 改为接收 `prerequisiteNodes` 参数（由调用方经引擎 relations 解析，芯片显示节点名）；`app/application.js` 的 `renderKnowledgeDetailRoute` 经 `contentService.getPrerequisites()`（引擎 `prerequisites()`）解析。全仓 grep 确认其余代码零消费内联数组，改造面收敛在视图+路由+测试。
- `content-service.js` 的 `normalizeKnowledgeGraph`/引擎的 legacy fallback（`node?.relations?.[type]`）对本仓数据形态是死分支，保留不动（引擎为通用组件，不影响单一事实源）。

**验收结果**：`npm test` 194/194（新增引擎关系推导测试）；`npm run audit:content` 三段全 PASS 且无 warning；节点字段收敛为 id/name/chapter/domain/bloomLevels/semester/unitId/definition/misconceptionIds/remediationGoal。

### Sprint C：关系属性化

**Status:** DONE — 2026-08-28 完成。

**问题**：裸三元组无属性。

**改动范围**：
- schema.json 定义关系可选属性：`question.difficulty`（basic/medium/hard）、`prerequisite.weight`（0-1，缺省 1）、`prerequisite.required`（boolean，缺省 true）、`related.description`；附挂载策略（属性只能挂声明的关系类型，违规即 ERROR）。
- 数据同步：114 条 question 关系从题目池 difficulty 字段同步（basic 33 / medium 49 / hard 32）；10 条因题目使用旧词表（application/transfer）跳过，125 条题目无难度字段留空——两类待内容侧补齐后重跑同步。
- 引擎：新增 `prerequisiteEntries(id)`（返回 [{node, relation}]，暴露边属性）与 `sortedLearningPath(id)`（required 优先、weight 降序、自身在末尾）。**顺带修复潜在死方法**：`questions()`/`experiments()`/`commonMistakes()` 此前对非节点 target 一律 filter 掉，生产数据下恒返回空数组；现改为"可解析为节点则返回节点对象，否则返回原始 ID"，零生产消费方，兼容存量 node-target fixture 测试。
- 审计脚本与 `tests/graph-schema-integrity.test.mjs` 同步属性类型/枚举/挂载校验；`tests/knowledge-engine.test.mjs` 新增 3 项行为测试。

**验收结果**：`npm test` 197/197；`npm run audit:content` 三段全 PASS。
**后续**：weight/required 数值待教研评审填充（见 DEVELOPMENT-ROADMAP 1.3）；题目旧词表与缺字段同步靠内容侧治理。

### Sprint D：关系语义补全

**问题**：缺 contains/contrast，commonMistake 严重不足。

**改动范围**：
- 新增 `contains` 关系：知识节点-子知识点（配合粒度拆分）。
- 新增 `contrast` 关系：易混淆辨析对（如 physical-change vs chemical-change）。
- `commonMistake` 从 3 条对齐到 `canonical-misconceptions.js` 的存量误解 ID，确保每条误解至少挂一个节点。

**验收**：三类新关系数量非零且全部可解析；commonMistake 覆盖率达 100%。

### Sprint E：粒度演进试点（u01/u02）

**问题**：52 节点为章节级，无法支撑精细诊断与智能出题。

**改动范围**：
- 以 u01（走进化学世界）、u02（我们周围的空气）为试点，按人教版课题拆分到知识点级。
- 拆分后新增 `contains` 关系挂接父子层级，question 关系从父节点迁移到子节点。
- 对比拆分前后诊断/推荐效果，产出评估结论后再决定是否推广到全部单元。

**验收**：试点单元知识点级节点上线，learningPath 仍正确；评估报告产出。

---

## 4. 优先级与顺序

1. **Sprint A** 最先——它是其余项的基础，schema 不权威则后续改动无约束。
2. **Sprint B** 其次——数据一致性是 C/D/E 的前提，双重表示不消除，改关系必漏节点。
3. **Sprint C + D** 并行——属性与语义互补，均为纯增量。
4. **Sprint E** 最后——工作量最大，需要试点评估后才能规模化。

每个 Sprint 单独提交，遵循「改动 + 防回归测试 + 文档更新」三件套，不在一次提交里混多个 Sprint。

---

## 5. 风险与依赖

- **Sprint E 粒度拆分**：依赖教研评审（`DEVELOPMENT-ROADMAP.md` 1.3 节已记录"前置关系未经真人教研核对"），拆分粒度需教研确认，否则可能重新造出错误前置。
- **Sprint B 的 142 条 question target**：需先确认子池 ID 合法性，若存在真悬空，说明运行时读取了不存在题目，属于数据事故等级，需在 Remediation Plan 单列。
- **question 关系与节点 questions[] 去重**：删除数组版时，所有消费方（`progress-portal-page.js`、`remediation-catalog.js`、`content-service.js`）必须改为读 relations，回归面较大，Sprint B 需专门测试覆盖。
- **与 u10（酸和碱）未收口的关系**：acid-intro/acid-property 节点存在，但单元未收口，Sprint E 拆分时 u10 暂不纳入，避免在未完成单元上做粒度演进。

---

## 6. 落地后的防回归

每个 Sprint 完成后，以下回归必须全绿：

```bash
npm test
npm run audit:content
node --test tests/graph-schema-integrity.test.mjs
```

新增的图谱相关测试统一收敛到 `tests/graph-*-integrity.test.mjs` 命名空间，与 `tests/content-*-integrity.test.mjs` 平级，避免测试文件碎片化。

---

## 7. 待项目所有者确认的事项

1. 是否采纳本计划的 5 个 Sprint 及其顺序。
2. Sprint E 试点单元是否从 u01/u02 开始，还是由教研指定。
3. Sprint B 中 142 条 question target 的核验结论是否需要单列到 `REMEDIATION-PLAN.md` 跟踪。
4. `commonMistake` 对齐 misconception 时，误解与节点的映射标准由谁定义。
