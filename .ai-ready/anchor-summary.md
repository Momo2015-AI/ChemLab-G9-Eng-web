# Anchor Summary — ChemLab-G9-Eng-web

**Agent**: agnes-2.5-flash
**Working directory**: /workspace
**Workspace root**: /workspace
**Current git branch**: main
**Date**: 2026-08-19
**Last commit**: 261cc7e feat: 虚拟实验探究脚手架 + 实验器材库 + 课程序号重排

## Goal
继 L04/L05 内容建设完成后，实施新一轮改进：① 建立实验器材库（含 SVG 实验器械）并改造虚拟实验为循序渐进的探究脚手架；② 将 L03 酸入门（下册 u10 内容）从上册序列挪到下册并重排课程序号。

## Constraints & Preferences
- 全量测试必须通过（当前基线 179/179: `node --test tests/*.test.mjs`）
- audit 必须 PASS: `npm run audit:content` + `node scripts/runtime-audit.mjs`
- build 必须成功: `node scripts/build-pages.mjs`（当前 106 文件）
- 器材库若新增目录（如 content/equipment），需在 build-pages.mjs 的 RUNTIME_GLOBS 白名单中注册，否则不会发布到 dist/
- 实验视图改造要保留现有实验引擎/控制器/会话结构兼容
- 用户确认实施，无需再确认

## Progress
### Done
- **L04 实验安全与基本操作** 完成并推送（commit 72d32ce）
- **L05 空气与氧气** 完成并推送（commit c30a868, 179/179 测试通过、audit PASS、build 105 文件）
- **问题分析（实验点不开）**：模拟验证 8 步引导学习全对后 stages.experiment=true；解锁条件是本课引导学习全部答对，非前置课完成度
- **器材库调查完成**（结论：独立器材库不存在）：
  - `schemas/instrument.schema.json` 存在，定义字段 id/name/category/icon/image/usage/safety/experiments——但无实际数据
  - `content/experiments/schema.js` 仅 `materials:[]`/`instruments:[]` 字段占位
  - `content/experiments/exp-001-oxygen.json` 有 equipment 数组（试管/酒精灯/铁架台/集气瓶）；exp-metal-acid.js 有 instruments（试管/镊子）
  - `frontend/icons/` 仅 6 个 UI 图标（course/flask/home/atom/chart/robot），无实验器械 SVG
- **实验视图改造完成**：v19-experiment-view.js 重写为探究脚手架（目标→器材SVG网格→安全→分步操作→观察引导→观察输入→结果页含score和观察记录摘要）
- **实验器材库建立完成**：`content/equipment/instruments.json`，14 件器材（试管/烧杯/酒精灯/铁架台/集气瓶/导管/水槽/温度计/玻璃棒/量筒/滴管/镊子/剪刀/蜡烛），每件含内联 SVG、用法、安全提示、关联实验
- **实验数据补充**：L01-E01/E02、L02-E01、L03-E01、L04-E01、L05-E01 均已补充 `instruments` 字段
- **L03 重排完成**：上册 day01=L01、day02=L02、day03=L04、day04=L05；下册 day05=L03。上册序号 01-04 连续
- **content-loader/content-service 扩展**：新增 `loadInstruments()`/`getInstruments()` 方法
- **application.js renderExperimentRoute 更新**：加载器材库并传入视图
- **实验控制器 complete() 增加 score 字段**：通过 engine.getScore() 计算观察完整度
- **build-pages.mjs 注册 content/equipment**：RUNTIME_GLOBS 新增 glob
- **CSS 扩展**：portal-content.css 追加 `.v19-exp-*` 系列样式（goal/safety/instrument-grid/step/observation/result 布局）
- **p2-learning-contract.test.mjs 更新**：released canonicalId 顺序改为 [L01,L02,L04,L05,L03]
- **全量验证通过**：179/179 测试、audit PASS、build 106 文件
- **已提交推送**：commit 261cc7e

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- **重排方案**：保留 canonicalId（`lesson-03-acid-intro` 不变，避免牵动 5 个内容文件/知识图谱/测试/localStorage 键），调整 manifest + lesson JSON 的 day/sequenceNumber：上册 01-04 连续，L03 移至下册 day05
- **器材库位置**：新建 `content/equipment/instruments.json`（与 content/experiments 平行），已在 build-pages.mjs RUNTIME_GLOBS 注册
- **实验思维递进设计**：L01 观察→证据→结论 → L02 控制变量 → L04 安全识别 → L05 完整探究流程（制取→收集→检验）
- **视图改造方向**：虚拟实验渲染为 目标→器材(SVG)→安全→分步操作→观察引导→结论 的探究脚手架，复用现有 goal/safety/materials/observationPrompts/conclusion 字段
- **器材库 schema**：遵循 schemas/instrument.schema.json 标准（id/name/category/icon/image/usage/safety/experiments）

## Next Steps
- (all tasks in the current iteration are complete; commit 261cc7e pushed)

## Critical Context
- **器材库现状**：schemas/instrument.schema.json 有字段定义，content/experiments/schema.js 有 materials[]/instruments[] 空占位；无实际器材内容、无 SVG 实验器械
- **现有器材引用**：exp-001-oxygen.json equipment=[试管,酒精灯,铁架台,集气瓶]；exp-metal-acid.js instruments=[试管,镊子]；L01-E02 materials=[冰块,白纸,剪刀,蜡烛,打火机(教师),烧杯]
- **每课实验步骤数**：L01-E01=4、L01-E02=4、L02-E01=5、L03-E01=4、L04-E01=5、L05-E01=8
- **实验解锁机制**：`getStageAvailability` 中 `experiment: guidedComplete`，即本课引导学习全部正确后解锁
- **manifest 当前状态**：day01 L01(u01/upper)、day02 L02(u01/upper)、day03 L04(u01/upper)、day04 L05(u02/upper)、day05 L03(u10/lower)
- **测试锚点**：term-and-quality-hardening.test.mjs:33 断言 L03 为 lower/u10（不变）；p2-learning-contract.test.mjs:70-74 断言 released canonicalId 顺序（已更新）
- **构建白名单**：build-pages.mjs RUNTIME_GLOBS 含 content/lessons、content/knowledge、content/experiments、content/equipment
- **课程地图**：content/curriculum/g9-course-map.js 定义 u01..u12，u10=酸和碱(lower)，与 L03 移动一致

## Relevant Files
- `/workspace/content/curriculum/lesson-manifest.js`: 已重排 day01-05
- `/workspace/content/equipment/instruments.json`: 新建，14 件器材 SVG + metadata
- `/workspace/schemas/instrument.schema.json`: 器材字段标准（未修改）
- `/workspace/schemas/experiment.schema.json`: 实验字段（含 instruments 数组）
- `/workspace/views/v19-experiment-view.js`: 改造为探究脚手架视图
- `/workspace/engine/experiment-engine.js`: 会话结构 {id,title,currentStep,steps,observations,completed,errors}，含 getScore
- `/workspace/controllers/experiment-controller.js`: complete() 增加 score 字段
- `/workspace/controllers/experiment-view.js` (no such file): see views/v19-experiment-view.js
- `/workspace/app/content-loader.js`: 新增 loadInstruments()
- `/workspace/app/content-service.js`: 新增 getInstruments()
- `/workspace/app/application.js`: renderExperimentRoute 加载器材库传入视图
- `/workspace/content/lessons/lesson-0{1,2,3,4,5}-experiment.json`: 各课实验补充 instruments 字段
- `/workspace/frontend/themes/portal-content.css`: 追加 .v19-exp-* 系列样式
- `/workspace/scripts/build-pages.mjs`: RUNTIME_GLOBS 新增 content/equipment
- `/workspace/tests/p2-learning-contract.test.mjs`: released 列表断言已更新
- `/workspace/tests/term-and-quality-hardening.test.mjs`: L03 lower/u10 断言（33 行）——不需修改
- `/workspace/tests/runtime-paths-v21.test.mjs`: 实验按钮 disabled/enabled 测试（154-203 行）
