# DEV-REC 2026-08-16 — 学习闭环加固与工程清理（Learning Loop Hardening）

> 本次会话基于对 `main` 分支的全项目架构/学习流程审查报告，按优先级逐项修复审查发现的问题。基线为 commit `876cabc`（117 tests 全绿），修复后 133 tests 全绿。

---

## 一、审查结论回顾（本次修复的依据）

前次审查发现的核心问题（按严重度）：

1. **recheck 跨课污染**：`startRecheck` 从全局题池按知识点取前 5 题，而全局题池以旧 day01 酸题开头——第 3 课的补救再检测推的永远是 day01 旧题，而不是学生刚做错的题。
2. **mastery 失败无法重试**：`reset()` 无人调用，路由对已完成会话只重渲染旧结果；评估门户在 `lessonState.mastery` 存在（哪怕 failed）后即隐藏 Mastery 任务。
3. **transfer 是 mastery 的复读**：`startTransfer` 直接切 mastery 题池前 5 题；真正为迁移编写的 `content/assessment/*transfer*/unseen*` 内容是死文件；transfer 永远只记 `completed` 不判对错。
4. **主观题关键词子串评分过于脆弱**：要求命中 `min(2, keywords)` 个精确子串，学生答"有新物质产生"（关键词是"生成"）被判错——而每课 mastery 只有 1 道主观题且是硬门禁。
5. **实验观察劫持学习阶段**：任何一次无效观察（包括空输入）立刻触发补救计划并把课程锁进 REMEDIATION；1 个恰好在预期串中出现的字符即可通过验证。
6. **全局题库文件不存在但被静默吞掉**：`question-bank.json`/`questions-by-topic.json` 端点 404 被无声降级；CI 内容门禁把"题库缺失"设计为通过。
7. **localStorage 无容错**：每答一题全量写单键，无 try/catch（配额超限直接打断答题 UI）、历史无上限、损坏 JSON 静默清零、迁移器无法处理 map 形态的 mastery。
8. **死代码与双管道**：旧 `AssessmentController` 门面、`engine/content-loader.js` 壳、孤儿 `lesson-02-*.js`（IN_REVIEW 与 ready 的 .json 矛盾）、`content/assessment/` 整层死内容（其中 `lesson-01-practice-v1.js`/`lesson-02-question-bank-v1.js` 与运行时 JSON **同 ID 不同题**，一旦接回即串题）、8 个死/坏脚本。
9. **`app/application.js` 压缩单行风格**：约 25 行语句的 `renderRoute` 无法维护。
10. **quiz 视图乱码**：对已是字母的答案再做 `fromCharCode(65 + 'B')`，每题详情显示 `\u0000`；day01 选项文本自带 "A. " 前缀与字母徽章双重编号。
11. **内容数据问题**：三课主 JSON mastery 计数 20/19 与实际 21 题不符；第 3 课知识点 `safety-awareness` 在知识图谱无节点，L03 题目零关联；知识点 ID 提取逻辑在 5 处各自实现。
12. **部署把整个仓库发布为学生站点**（docs/ 599KB、reports/、tests/、28KB Python 脚本全部公开）；`content-integrity.yml` 与 build-check 重复且被路径过滤静默跳过。

注：远端在审查后已合入 `68dc16b`、`876cabc` 两轮修复（扁平状态槽收敛、draft 门禁、mastery criteria 补全），本次在其之上继续，未重复修改。

---

## 二、修复内容

### A. 学习闭环四个硬伤

| 问题 | 修复 | 位置 |
|---|---|---|
| recheck 跨课污染 | recheck 池改为**仅本课资源**（lesson 内嵌 + practice + diagnostic + mastery），并在池内**错题优先**排序；不再触碰全局池 | `controllers/assessment-runtime-controller.js` `startRecheck` |
| mastery 无法重试 | 结果页新增"再考一次/再做一次/再次挑战"按钮 → `controllers.assessment.reset()` 后重渲染自动开新会话；评估门户 Mastery 任务条件改为 `mastery?.status !== 'passed'`（失败后仍可见，按钮文案变"再次挑战掌握测试"） | `views/quiz-view.js`、`app/application.js` |
| 主观题评分脆弱 | 评分引擎支持**同义词组关键词**（`[["新物质"],["生成","产生","形成"]]`，组内任一命中即算）+ 文本归一化（去空白、全角转半角、小写）；三课 M21 主观题关键词全部改为同义词组；通过标准维持 `min(2, 组数)` | `engine/assessment-engine.js` `checkConstructed`、`content/lessons/*-mastery.json` |
| 实验观察劫持阶段 | 空白观察=未记录（不记证据、不改阶段）；无效观察只记 0 分证据；**补救判定推迟到实验完成时**（按 `hadInvalidObservation` 标记）；验证器要求最短 2 字符且互含匹配使用完整输入（杜绝单字符通过） | `controllers/experiment-controller.js`、`engine/experiment-engine.js` `validateStep` |

### B. transfer 内容接线

- 新增 `content/lessons/lesson-01-material-changes-properties-transfer.json`（4 题，迁移自 `lesson-01-transfer-items-v1.js`）与 `lesson-02-chemistry-as-experimental-science-transfer.json`（4 题，迁移自 `lesson-02-transfer-v1.js`），转为运行时规范格式（constructed + rubric 同义词组 + knowledgeIds）。
- 加载链新增 `loadTransfer` → `ContentService.getTransfer` → `startTransfer`（不再复读 mastery 池）。
- transfer 增加及格线：≥80% 记 `passed`，否则 `completed`。
- 第 3 课无迁移内容属内容缺口而非缺陷：入口给出明确提示"本课暂无迁移挑战题，迁移内容建设完成后开放"。

### C. 题库端点与静默降级

- 删除 `question-bank.json`、`questions-by-topic.json` 死端点与 `loadOptionalJSON` 静默兜底；全局池显式声明为"day01 已审定替换题 + 运行时按课注册"。
- 新增测试锁定契约：loader 源码不得再引用这两个端点、不得重新引入 `loadOptionalJSON`；若未来刻意恢复题库文件，必须满足 bank 契约。

### D. localStorage 加固（`app/progress-service.js`、`app/state.js`）

- `save` 全 try/catch：配额/私密模式失败降级为 console 警告并返回 false，**不再打断答题**。
- 损坏 JSON 备份到 `chemlab_v16_corrupt` 后重置（可检查、可手工恢复），不再无声清零。
- `progress.history` 上限 100 条（保留最新），写入时自动裁剪。
- 迁移器修复：支持 map 形态 `learning.mastery`（lessonId → record）逐课分发；`transfer` 纳入扁平字段迁移清单。
- `STORAGE_KEY` 单一来源（progress-service 导出，state.js 引用），删除 `saveProgress/updateRoute/resetSession` 死导出。

### E. 死代码清理（全部经引用图谱验证后删除）

- 模块：`controllers/assessment-controller.js`（旧门面）、`engine/content-loader.js`（零引用壳）、`core/diagnosis/learning-diagnosis.js`、`dashboard/mastery-report.js`、`views/dashboard-view.js`（application.js 不再注册）。
- 内容：孤儿 `content/lessons/lesson-02-chemistry-as-experimental-science.js`（IN_REVIEW 与 ready .json 矛盾）；`content/assessment/` 整层 11 个死 JS 文件——包括与运行时 JSON **同 ID 不同题**的 `lesson-01-practice-v1.js`、`lesson-02-question-bank-v1.js`（真实内容已迁入 canonical transfer JSON）。
- 脚本：8 个死/坏脚本（validate-lessons、validate-question-bank、check-content-references、check-content-sources、generate-knowledge-graph.py、migrate-knowledge-graph、verify-knowledge-graph-migration、health-check）；`scripts/` 仅保留 CI 实际接线的 3 个 + 新增 build-pages。
- 工作流：删除冗余的 `content-integrity.yml`（与 build-check 的 `audit:content` 完全重复且被路径过滤）。
- `engine/assessment-engine.js` 移除三个无引用方法（`computeQuizScore/getMistakeSummary/getWeakKnowledge`）及跨会话泄漏的 mistakes Map。

### F. application.js 重构

- 从 25 行压缩单行重写为**每路由独立函数**（renderHomeRoute / renderCourseRoute / renderLabRoute / renderKnowledgeMapRoute / renderAssessmentRoute / renderProgressRoute / renderQuizRoute / renderExperimentRoute / renderRemediationRoute），行为除上述修复外保持一致；quiz 模式解析改为前缀表驱动。

### G. 视图与展示修复

- **乱码修复**：`quiz-view` 直接渲染已是字母的答案（原 `fromCharCode(65+'B')` 输出 `\u0000`）。
- **选项双编号修复**：`normalizeQuestion` 剥离选项文本自带的 "A. / A、/ A）" 前缀（视图本身渲染字母徽章）。
- `index.html` 增加 `<noscript>` 兜底。

### H. 内容与知识图谱修正

- 三课主 JSON `mastery.questionCount/minCorrect` 修正为 21/20（与实际题数一致）。
- 知识图谱（v2.0.0 → v2.1.0）：新增 `safety-awareness` 节点（此前第 3 课引用了不存在的节点）；为 L03 全部题目（lesson 6 + practice 13 + diagnostic 3 + mastery 21）与 L01/L02 transfer 题按其 knowledgeIds 生成 **+85 条 question 关联**（此前 L03 题目零关联）。
- 知识点 ID 提取统一为 `knowledgeIdsOf`（`core/diagnosis/question-knowledge-map.js` 单一实现），替换 content-service、两个 controller、remediation-catalog、mastery-policy 中的 5 处变体。

### I. CI/部署

- 新增 `scripts/build-pages.mjs`：按显式运行时清单组装 `dist/`（约 114 文件 / 858KB，此前整仓 4MB+ 且包含全部工程文档）；部署改为上传 `dist`，学生站点不再暴露 docs/reports/tests/scripts。
- 缺失运行时资产时 build-pages 直接失败（防患于未然）。
- 内容审计脚本识别 `-transfer.json` 资源并纳入运行时题量统计与完整性校验。
- `.gitignore` 补充 node_modules/dist/.DS_Store/Thumbs.db/*.log。

---

## 三、验证

- `npm test`：**133 tests，全绿**（基线 117；新增 16 个断言新契约的测试，含 recheck 本课限定/错题优先/跨课污染回归、transfer 独立源与及格线、会话重试、同义词组评分、配额/损坏/上限存储行为、迁移、选项前缀、题库端点契约、transfer 内容契约、KG 关联完整性）。
- `node scripts/runtime-audit.mjs`：通过。
- `npm run audit:content`（integrity + lesson readiness）：通过，报告已再生（lesson-01/02 题量矩阵现为 `8+8+3+21+4`）。
- `node scripts/build-pages.mjs`：通过，dist 仅含运行时资产。

## 四、遗留事项（后续会话）

1. **第 3 课迁移题建设**：lesson-03 无 transfer 内容（当前诚实提示缺位，不阻塞）。
2. **Source Registry 登记**：`content/sources/` 仍为 PENDING；3 课 provenance 的"武汉中考校准"表述需要在 registry 落地后回填证据。
3. **题目随机化**：所有会话仍按固定顺序出题（本课池内），建议在题目级加洗牌并保留错题优先策略。
4. **知识详情覆盖**：13 个节点中仅 2 个有 `content/knowledge/*.json` 详情页可取。
5. **misconception 词表**：仍存在 slug/M0x-*/mc-acid-* 三套 ID，未与 KG commonMistake 关联打通。
6. **课程扩展**：manifest 仅 3/36 课；扩展须逐课通过 7-Gate，不允许模板复制。

## 五、涉及文件

```text
新增:
  content/lessons/lesson-01-material-changes-properties-transfer.json
  content/lessons/lesson-02-chemistry-as-experimental-science-transfer.json
  scripts/build-pages.mjs
  tests/learning-loop-hardening.test.mjs
重写/修改:
  app/application.js            app/content-loader.js        app/content-service.js
  app/progress-service.js       app/state.js
  controllers/assessment-runtime-controller.js
  controllers/experiment-controller.js
  core/assessment/mastery-policy.js
  core/diagnosis/question-knowledge-map.js
  core/diagnosis/remediation-catalog.js
  engine/assessment-engine.js   engine/experiment-engine.js
  views/quiz-view.js            index.html
  content/knowledge/knowledge-graph.json (v2.1.0, +safety-awareness, +85 关联)
  content/lessons/*.json ×6 (mastery 计数、同义词组关键词)
  scripts/content-integrity-v19.mjs   scripts/content-lesson-audit-v19.mjs
  .github/workflows/build-check.yml   .gitignore   README.md
删除:
  controllers/assessment-controller.js  engine/content-loader.js
  core/diagnosis/learning-diagnosis.js  dashboard/ (整目录)
  views/dashboard-view.js
  content/lessons/lesson-02-...-science.js (孤儿)
  content/assessment/ (整目录 11 文件)
  scripts/ ×8 死脚本
  .github/workflows/content-integrity.yml
```
