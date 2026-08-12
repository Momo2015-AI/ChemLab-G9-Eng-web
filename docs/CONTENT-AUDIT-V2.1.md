# ChemLab-G9-Eng-web V2.1 内容审计

> 审计基线：main @ 11b68107b61fa383207d9156aefb5fedd0da761c
>
> 目标：在不破坏 V1.9 Learning Core 的前提下，为 V2.1/V2.2 建立可验证、可扩展、适合九年级学生的内容体系。

## 1. 审计结论

当前仓库已经具备较好的“内容运行时基础”，但还不能认为已经完成完整的九年级课程内容建设。

### 已有能力

- `content/` 已被定义为 canonical educational content source。
- 已存在课程日数据 schema：`day/title/knowledge/experiments/exercises/assessment`。
- 已存在知识点记录、知识图谱和若干专题知识记录。
- 已存在较丰富的实验 JSON 数据，覆盖氧气、酸碱、金属、锈蚀、离子检验、化肥、二氧化碳、质量守恒等主题。
- Knowledge Graph 已经把知识节点与题目 ID、Bloom 层级建立了关联。
- Learning / Assessment / Experiment / Mastery / Remediation runtime 已具备承载内容闭环的基础。

### 关键缺口

1. `content/README.md` 规划了 `curriculum/`、`lessons/`、`questions/`、`misconceptions/`，但当前仓库目录审计显示这些 canonical 内容目录尚未形成完整数据层。
2. `content/knowledge/knowledge-graph.json` 的 `source` 仍指向 `modules/questions/taxonomy/knowledge-graph.json`，与“content 是唯一内容源”的规则冲突，需要迁移并清理历史来源字段。
3. 课程结构目前仍偏向 Day lesson schema，缺少稳定的“教材单元 → 课题 → 课时 → 知识点 → 活动 → 练习 → 评价”层级。
4. Knowledge schema 已有 `questions` 与 `errors` 字段，但没有形成统一的 question registry 与 misconception registry。
5. 练习题需要从“题目 ID 被引用”升级为“每道题有 canonical record、答案、解析、知识点、难度、认知层级、错误标签和补救路径”。
6. 实验内容需要统一实验目的、器材、步骤、现象、解释、方程式、安全边界、误差/常见错误、关联知识点和评价证据。
7. 当前内容需要建立来源、版本、审核状态和版权边界；不得把教材原文整段复制进仓库。

## 2. 内容质量分级

每条内容采用以下状态：

- `draft`：草稿，不能作为正式教学依据。
- `review`：完成初审，等待科学/教学复核。
- `verified`：已完成来源和科学性复核。
- `published`：已进入正式学习路径。
- `deprecated`：旧内容，仅保留迁移兼容。

## 3. 内容来源等级

### S1 课程依据

- 教育部《义务教育化学课程标准（2022年版）》。

### S2 教材依据

- 项目指定教材：人民教育出版社九年级化学上下册。
- 教材用于课程结构、学习范围和教学顺序的对齐，不复制教材原文。

### S3 科学依据

- 权威化学教材、公开教育资源、经过可靠来源交叉验证的基础化学事实。

### S4 教学设计

- ChemLab 自主设计的解释、练习、诊断、实验交互和学习路径。
- S4 必须建立在 S1/S2/S3 已验证的知识基础上。

## 4. 内容对象审计矩阵

| 对象 | 当前状态 | V2.1目标 | 优先级 |
|---|---|---|---|
| Curriculum | 缺少 canonical 完整层 | 上下册/单元/课题/课时 | P0 |
| Lessons | 结构不完整 | 每课题形成学习序列 | P0 |
| Knowledge | 已有部分专题与图谱 | 全课程知识点标准化 | P0 |
| Questions | ID 已被图谱引用，但 canonical registry 不完整 | 完整题库 | P0 |
| Experiments | 已有较多 JSON | 统一实验模型并逐条审核 | P0 |
| Misconceptions | schema/runtime 有基础 | 错误模型 registry | P0 |
| Assessments | runtime 已有 | 单元/阶段评价 | P1 |
| Learning Tasks | runtime 有基础 | 课程任务模板 | P1 |
| Progress | 已有 | 内容完成度与掌握度绑定 | P1 |
| Media/Diagrams | 有资源基础 | 知识/实验配图规范 | P1 |

## 5. 审计原则

- 不因为“文件很多”就认为“课程已经完整”。
- 不因为知识图谱节点存在，就认为对应教材内容已经完整。
- 不允许题目只存在于引用 ID 中而没有 canonical question record。
- 不允许同一个知识点在多个目录存在不同定义。
- 不允许未经来源和科学性复核的内容进入 `published`。
- 不改变已经冻结的 Core / Engine / Controller 架构，只完善内容层和必要的内容适配器。

## 6. V2.1 验收标准

V2.1 内容层必须满足：

1. 上下册课程结构完整。
2. 每个课题有明确学习目标和知识点。
3. 核心知识点具备前置关系与关联关系。
4. 核心实验全部可追溯到知识点和课程位置。
5. 练习题具有 canonical record。
6. 错误类型与补救内容建立映射。
7. 单元复习与阶段测试可以覆盖课程知识。
8. 内容来源与审核状态可追踪。
9. ContentService 只从 canonical `content/` 获取教育语义。
10. CI 能验证 schema、引用完整性和孤儿内容。
