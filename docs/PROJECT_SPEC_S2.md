# ChemLab-G9 下册开发说明

本文档记录下册（ChemLab-G9-S2）与上册（ChemLab-G9）的差异、隔离策略与合并约定。

## 为什么独立仓库

- 上册产物（dist/ChemLab-G9.html）与线上页面在开发期间保持不动。
- 下册内容量大（36 天），独立仓库避免开发期互相干扰。
- 完成后以"单提交合并"并入上册仓库，旧历史保留在 `s2-legacy` 分支。

## 三层隔离

| 层面 | 上册 | 下册 | 说明 |
|------|------|------|------|
| localStorage 键 | `chemlab-g9:v3:*` | `chemlab-g9:v4:s2:*` | 学习记录互不影响，合并后零迁移 |
| 内容目录 | `content/`、`quiz/` | `content-s2/`、`quiz-s2/` | 文件路径不冲突 |
| 全局变量 | `ChemLabManifest` / `ChemLabContent` / `ChemLabQuiz` | `ChemLabManifestS2` / `ChemLabContentS2` / `ChemLabQuizS2` | 构建内联后不互相覆盖 |

## 构建与产物

- 默认输出 `dist/ChemLab-S2.html`（36 天全部内联，自包含可离线）。
- 构建脚本从 manifest 的 `ready` 标记决定内联哪些天；未标记 `ready` 的天显示"待发布"占位。
- 上册构建路径不变（`/workspace/scripts/build-single.mjs` 输出 `dist/ChemLab-G9.html`）。

## 发布门禁

```
node scripts/validate-content.mjs   # 内容结构一致性
node scripts/check-science.mjs --fatal  # 科学表述巡检
node scripts/build-single.mjs       # 单文件构建
node tests/smoke.mjs                # Node 冒烟测试
```

## 后期合并约定

1. 下册完成且发布门禁全绿后，在 `/workspace`（上册）执行 `git remote add s2 /workspace/ChemLab-G9-S2`。
2. `git fetch s2 && git checkout -b s2-legacy s2/main` 保留下册历史。
3. 回主分支 `git checkout main`，`git merge --squash s2/main`（单提交合并），解决目录/键/变量层面因隔离产生的极少量冲突。
4. `git commit -m "feat: merge ChemLab-G9-S2 (下册 36 天课程)"`。

## 下册课程规划

| 模块 | 天数 | 主题 |
|------|------|------|
| 一 | Day01-06 | 金属和金属材料 |
| 二 | Day07-13 | 溶液 |
| 三 | Day14-20 | 酸和碱 |
| 四 | Day21-27 | 盐、化肥 |
| 五 | Day28-30 | 化学与生活 |
| 六 | Day31-36 | 综合提升（知识网络 / 综合 / 中考计算 / 实验探究） |

## 现状

- 仓库骨架已就位，36 天 manifest 已建立（全为"待发布"占位）。
- 数据层已建立（`chemlab-curriculum-development` skill Phase 1-4）：
  - `docs/CURRICULUM_MAP_S2.md`：教材分析 + 全册课程地图 + 单元一详细拆解。
  - `content-s2/knowledge/knowledge.js`：知识图谱（单元一 12 个知识点，`V2-K1xx`）。
  - `content-s2/experiments/experiments.js`：实验模型（单元一 6 个实验，`V2-E1xx`）。
  - `content-s2/mistakes/mistakes.js`：错误分类表（8 类，`M-*`，含单元一具体表现）。
- 数据层已纳入单文件构建（P0 规则），smoke 测试断言其内联。
- validator 已升级：校验 ID 唯一性 + knowledge/experiment/mistake 引用完整性（含已发布天的内容与题目引用）。
- 后续工作：按课程地图产出一单元内容（day-XX.js + quiz-XX.js），带 `knowledgeIds` / `experimentIds` / `mistakeTypes` 引用，标记 ready，跑门禁。

## 数据层 ID 命名空间

| 层 | 前缀 | 示例 |
|----|------|------|
| 知识点 | `V2-K` | `V2-K101` |
| 实验 | `V2-E` | `V2-E101` |
| 错误类型 | `M-` | `M-CHEMICAL-FORMULA` |
| 天（预留） | `V2-D` | `V2-D01` |
| 题（预留） | `V2-Q` | `V2-Q0101` |
