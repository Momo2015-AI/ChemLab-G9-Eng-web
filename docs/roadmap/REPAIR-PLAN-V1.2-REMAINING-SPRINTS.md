# ChemLab-G9-Eng-web 修复计划 V1.2 — 剩余 Sprint（Sprint 2.5 ~ Sprint 6）

**文档状态：** 可执行计划 / 衔接 `INTEGRATED-REPAIR-PLAN-V1.1.md`（V1.1 的 Sprint 0/1/2 已完成）
**建立日期：** 2026-08-28
**基线：** `main` @ `9e3c39e`（203/203 测试全绿 / 语义审计 S1–S6 全 0 / CI GREEN / Pages 已部署）
**新增输入：** 知识图谱体检（2026-08-28，见 §1 发现清单）

---

## 0. 已完成进度（V1.1 → 现在）

| Sprint | 内容 | 提交 | 状态 |
|---|---|---|---|
| Sprint 0 | 四道坏题修复 + 语义审计门禁 S1–S6 + npm test 跨平台 | `d749386` | ✅ 已推送，CI GREEN |
| Sprint 1 | 33 处副本对齐 + 103 题知识点链接 + 知识点中文名走图谱 | `99b3d43` | ✅ 已推送，CI GREEN |
| Sprint 2 | currentLessonId 隐藏 bug + Lab 并行化 + TermService 收敛 + 死内容登记 | `9e3c39e` | ✅ 已推送，CI GREEN |

---

## 1. Sprint 2.5 — 知识图谱治理（新增，2~3 天）

**依据：** 2026-08-28 图谱体检发现 5 个问题（详见下表）。图谱是诊断、补救、掌握度统计与知识地图页的地基，必须在 E2E（Sprint 3）之前治理——否则 E2E 路径 13（知识地图路由）会测在漂移的地基上。

### 1.1 发现清单（实测证据）

| # | 发现 | 证据 |
|---|---|---|
| KG-A | 同名重复节点："质量守恒定律"存在 `law-of-mass-conservation`（particle 域）与 `law-conservation`（law 域）两个节点，且都在生产使用（前者 11 个文件、后者 8 个文件） | knowledge-graph.json；content/lessons 全文检索 |
| KG-B | 反向引用失同步：题目→知识点引用 1046 条未镜像到 `node.questions[]`（如 oxygen-preparation 缺 Sprint 1 回填的 65 题） | 双向比对脚本，fwd=0 / rev=1046 |
| KG-C | 5 条悬空关系：2 条 experiment（→L01-E01/L02-E01 不存在）、3 条 commonMistake（→未注册误解 ID） | relations 遍历，node-node 悬空 5/82 |
| KG-D | `relations[]` 中 263 条 `question` 类型关系与 `node.questions[]` 完全重复（KG-B 的根源：同一事实两处维护） | relations 类型分布 |
| KG-E | `knowledgeIds` 无"必须存在于图谱"门禁（S4 只查非空），幽灵知识点 ID 可静默进入诊断引擎 | 审计规则现状 |

### 1.2 任务

| # | 任务 | 具体动作 | 工作量 | 验证 |
|---|---|---|---|---|
| KG-1 (P0) | **S7 门禁** | `content-semantic-audit.mjs` 增加规则：每道题 `knowledgeIds` 必须解析到图谱 52 节点之一，BLOCKER；单测覆盖 | 0.5 天 | 规则先红后绿（用 `law-of-mass-conservation` 合并前的双节点状态做不了红样，用临时假 ID 验证） |
| KG-2 (P1) | **合并重复节点** | `law-conservation` → `law-of-mass-conservation` 全局替换（8 个文件）；`knowledgeIdsOf()` 增加别名解析（仿误解词表 ALIAS_MAP），保证 localStorage 已持久化的旧 `weakPoints`/`recheck.knowledgeIds` 继续解析；knowledge-graph 删除 `law-conservation` 节点、其 relations 并入主节点 | 1 天 | S7 全绿；namespace 测试全绿；手动验证旧进度数据加载 |
| KG-3 (P2) | **单一事实源** | 题目 `knowledgeIds` 为唯一事实源：新增 `scripts/gen-graph-questions.mjs`（聚合全部题目引用 → 写回 `node.questions[]`），并入 `npm run audit:content` 前置生成步骤；审计增加漂移检查（node.questions[] ≠ 聚合结果即 BLOCKER） | 1 天 | 反向漂移 1046 → 0；重复生成幂等 |
| KG-4 (P3) | **悬空关系清理** | 2 条 experiment 关系：L01/L02 实验实际存在（lesson 文件内嵌），改为注册正确实验 ID 或删除关系；3 条 commonMistake 关系指向的误解 ID 与 canonical-misconceptions.js 对齐（注册或删除） | 0.5 天 | node-node 悬空 0 |
| KG-5 (P4) | **推迟项** | bloomLevels 消费与 domain 收敛不在本 Sprint 实施，仅在图谱文件头注释记录决策（domain 仅为展示分组、bloomLevels 留待 Sprint 6 Mastery Blueprint 启用） | — | — |

### 1.3 验收

```text
□ S7 门禁上线且全绿（含单测）
□ 图谱无同名重复节点；law 双节点合并完成且旧数据可解析
□ node.questions[] 由脚本生成，双向漂移 0
□ node-node 悬空关系 0
□ 全门禁复绿（tests / runtime-audit / audit:content / build-pages）
□ DEV-REC.md 记录
```

---

## 2. Sprint 3 — Browser E2E 发布门禁（1~1.5 周）

按 V1.1 §5 执行，无变更，补充两点：

1. **路径 16（答案键回归）扩为四道坏题**：Sprint 0 实际修复了 4 道（L30-P06 / L12-P08 / L05-Q03 / L05-M14），E2E 对 lesson-18 / lesson-07 / lesson-05 各答一次正确答案并断言判分为对。
2. **前置依赖**：Sprint 2.5 完成后路径 13（知识地图 → 节点详情 → 跳课）测在干净数据上。

任务清单（不变）：Playwright 基础设施 → 16 条路径 → 路由矩阵固化进 `tests/router.test.mjs` → CI `e2e` job（`needs: validate`，Pages 依赖其通过）→ 时长预算 < 5 分钟。

---

## 3. Sprint 4 — Golden Lesson A：lesson-01（1 周）

按 V1.1 §6 执行，无变更：教材/教参对齐（S0 缺位则按降级预案显式记录）→ 全链路审计 → 评分卡试算。武汉真题映射仍推迟（见 §7）。

## 4. Sprint 5 — Golden Lesson B + C（1~1.5 周）

按 V1.1 §7 执行：Golden B = 燃烧与灭火（程序型）；Golden C = lesson-18 化学方程式计算（计算型，兼 Sprint 0 坏题回归载体）。

## 5. Sprint 6 — 全量质量分层（1~2 周）

按 V1.1 §8 执行，另加入两项图谱增值工作（V1.1 未含，源自 §1 体检）：

| # | 任务 | 说明 |
|---|---|---|
| S6-KG1 | **启用 bloomLevels** | 节点已标注认知层级但零消费。实现 `节点.bloomLevels × 题目认知层级` 覆盖矩阵，作为 C4-C5 P2.1 Mastery Blueprint 的数据基础，落实 "objectiveCoverage = 100%" 的机器可验证版 |
| S6-KG2 | **跨单元前置链补齐** | 52 节点仅 82 条节点间关系（1.6 条/节点）且集中在 u01 方法论节点。下册扩张（u08 金属 / u09 溶液）前补齐上册跨单元 prerequisite 边（如 equation-balancing 前置 chemical-formula-writing），否则知识地图对学生的"先学什么"指引失真 |
| S6-KG3 | **domain 收敛裁决** | 13 个 domain 中 5 个只含 1 节点。收敛为 5–6 个稳定域（物质/粒子/反应/方法/定量/社会）或文档化"仅展示分组"；随下册建设一并处理 |

其余不变：30 课评分卡（Runtime/E2E 权重 2→10）、状态机迁移（releaseStatus 维度化扩展）、Source Registry 30/30。

---

## 6. 时间线与依赖

```text
周 1      Sprint 2.5  知识图谱治理          ← 无依赖，立即开始（2~3 天）
周 1-3    Sprint 3    Browser E2E           ← 依赖 Sprint 2.5（路径 13/16）
周 3-4    Sprint 4    Golden A (L01)        ← 依赖 E2E 门禁就绪
周 4-5    Sprint 5    Golden B + C
周 5-7    Sprint 6    全量分层 + 图谱增值（bloom/前置链）
剩余约 5~7 周
```

关键依赖：
- Sprint 2.5 插队原因：KG-A（双节点）直接污染掌握度统计，KG-E（无 S7 门禁）让一切图谱数据不可信——两者都会被 Sprint 3 的 E2E 固化进回归基线，先治理成本低。
- Sprint 6 的 bloomLevels/前置链依赖 Golden Lesson 验证过的评分卡。

## 7. 推迟项（与 V1.1 §9 一致，无变化）

| 项 | 推迟到 | 前置条件 |
|---|---|---|
| 武汉中考校准矩阵 | Sprint 6 后 | S1-WUHAN-EXAM 来源文档登记锁定 |
| 下册课程扩展 | Golden A/B/C + E2E 稳定后 | 30 个实验素材已登记（Sprint 2）；跨单元前置链补齐（S6-KG2） |
| 方程式书写规范升级 | 与下册建设并行 | core/utils/equation.js 渲染约定先行 |

## 8. 风险登记（新增两条）

| 风险 | 概率 | 应对 |
|---|---|---|
| KG-2 节点合并破坏已持久化的 weakPoints/recheck 数据 | 中 | 别名解析兜底 + 手动验证旧 localStorage 数据加载 + 单测锁定 |
| gen-graph-questions 生成步骤与手工编辑冲突 | 中 | 生成脚本幂等 + 漂移检查 BLOCKER + 生成顺序固定在审计之前 |
