# ChemLab 内容建设计划 V2.1 → V2.2

## 目标

把现有“知识点 + 实验 + 题目引用”升级为完整的九年级化学学习内容系统，并最终形成 V2.2 自适应学习闭环。

## 一、课程结构

Canonical 层级：

```text
Grade 9
└── Semester
    └── Unit
        └── Topic
            └── Lesson
                ├── Learning Objectives
                ├── Knowledge Points
                ├── Experiment / Observation
                ├── Guided Practice
                ├── Independent Practice
                ├── Review
                └── Assessment
```

### PEP 对齐范围

上册：

1. 绪言：化学使世界变得更加绚丽多彩
2. 第一单元：走进化学世界
3. 第二单元：我们周围的空气
4. 第三单元：物质构成的奥秘
5. 第四单元：自然界的水
6. 第五单元：化学方程式
7. 第六单元：碳和碳的氧化物
8. 第七单元：燃料及其利用

下册：

9. 第八单元：金属和金属材料
10. 第九单元：溶液
11. 第十单元：酸和碱
12. 第十一单元：盐 化肥
13. 第十二单元：化学与生活

> 实际上线时以项目指定教材版本和当地课程实施要求复核；教材目录用于结构对齐，不复制教材原文。

## 二、Knowledge Point 规划

每个知识点必须至少包含：

- id
- name
- unit/topic
- learningObjective
- conciseExplanation
- prerequisiteKnowledge
- relatedKnowledge
- commonMisconceptions
- experiments
- questions
- assessmentTargets
- sourceRefs
- reviewStatus

知识点按认知层级组织：

```text
知道 → 理解 → 应用 → 分析 → 综合/评价
```

初中阶段避免为了“高级”而过度引入超纲大学化学内容。

## 三、Lesson 规划

每课题建议采用 15–35 分钟可拆分学习单元：

```text
1. 激活已有知识
2. 核心问题
3. 概念学习
4. 现象/实验
5. 解释与模型
6. 小练习
7. 易错点
8. 迁移题
9. Exit Check
10. 下一步建议
```

每节课至少产生一个可验证学习证据。

## 四、练习题体系

建立 canonical：`content/questions/`

题目字段至少包括：

```text
id
stem
type
options
answer
explanation
knowledgePoints
difficulty
bloomLevel
misconceptions
experimentLinks
sourceRefs
status
```

题型覆盖：

- 单选
- 多选（仅在课程确有需要时）
- 填空
- 判断并解释
- 化学方程式
- 实验现象与结论
- 实验设计
- 计算
- 综合应用

### 难度配比建议

日常练习：

- 基础 50%
- 理解 30%
- 应用/综合 20%

单元测试再根据教学目标调整，不追求单纯“难”。

## 五、实验内容体系

Canonical：`content/experiments/`

统一字段：

```text
id
title
unit
aim
equipment
materials
steps
observations
conclusion
explanation
equations
safety
commonErrors
knowledgePoints
questions
evidence
sourceRefs
reviewStatus
```

实验不只展示“步骤”，必须让学生完成：

```text
预测 → 操作/模拟 → 观察 → 记录 → 解释 → 结论 → 迁移
```

## 六、Misconception 错误模型

Canonical：`content/misconceptions/`

建议首批覆盖：

- 物理变化与化学变化混淆
- 物质性质与用途混淆
- 分子/原子概念混淆
- 化学式与化合价混淆
- 方程式配平与化学计量混淆
- 氧气支持燃烧与氧气本身燃烧混淆
- 二氧化碳性质与温室效应概念混淆
- 金属活动性顺序误用
- 溶液、溶质、溶剂混淆
- 溶解度与溶质质量分数混淆
- 酸/碱性质混淆
- 中和反应判断错误
- 盐与化肥分类混淆
- 实验现象与实验结论混淆

每个错误必须关联：

```text
misconception
→ diagnosticEvidence
→ remediationLesson
→ targetedQuestions
→ recheck
```

## 七、Assessment 体系

三级评价：

### Lesson Check

5–8题，确认本节课最低掌握要求。

### Unit Assessment

覆盖：

- 核心概念
- 关键实验
- 化学方程式
- 易错点
- 迁移应用

### Stage Assessment

按学期/阶段综合评价，避免只考记忆题。

## 八、学习任务体系

统一任务类型：

```text
learn
observe
experiment
practice
review
assessment
remediation
recheck
```

任务可组合成：

```text
Lesson Task
→ Practice Task
→ Experiment Task
→ Assessment Task
```

## 九、V2.2 自适应学习

输入：

- mastery
- recentEvidence
- misconception
- prerequisite
- completion
- assessment result

输出：

```text
nextBestAction
```

优先规则：

1. 先修知识未掌握 → 补前置知识。
2. 当前核心知识未掌握 → targeted remediation。
3. 已掌握 → 迁移/应用练习。
4. 实验表现不足 → 再观察/实验任务。
5. 单元知识均稳定 → 进入综合复习。

## 十、内容生产流水线

```text
课程标准/教材对齐
        ↓
课程地图
        ↓
知识点建模
        ↓
Lesson 编写
        ↓
实验建模
        ↓
题目生产
        ↓
Misconception 建模
        ↓
交叉审核
        ↓
Schema Validation
        ↓
Learning Runtime 集成
        ↓
学生体验测试
        ↓
published
```

## 十一、质量门禁

内容只有同时满足以下条件才进入 published：

- 科学事实正确
- 与课程目标一致
- 无明显超纲
- 术语统一
- 化学方程式经过校验
- 实验描述安全且适合学校教学语境
- 答案与解析一致
- 知识点引用存在
- 错误标签存在时有补救路径
- sourceRefs 完整
- schema validation 通过

## 十二、实施顺序

### Sprint 1

内容模型、来源字段、课程地图、迁移规则。

### Sprint 2

九年级上册课程完整化。

### Sprint 3

九年级下册课程完整化。

### Sprint 4

实验库标准化。

### Sprint 5

题库与解析体系。

### Sprint 6

Misconception + remediation。

### Sprint 7

单元测试、阶段测试、学习任务。

### Sprint 8

V2.2 Adaptive Learning 集成与全量内容验收。

## 十三、V2.2 上线标准

最终学生能够完成：

```text
课程
 ↓
知识
 ↓
实验/观察
 ↓
练习
 ↓
诊断
 ↓
补救
 ↓
再练习
 ↓
掌握
 ↓
下一任务
```

AI Tutor/AI Agent 不作为 V2.2 发布阻塞条件，保持远期冻结。
