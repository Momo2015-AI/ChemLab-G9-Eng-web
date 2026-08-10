# ChemLab-G9-S2

## 九年级化学智能学习平台（下册）

ChemLab-G9-S2 是面向初中九年级化学学习的 Web 化自学平台，目标是构建：

> 课程学习 → 知识理解 → 虚拟实验 → 练习评价 → 学习诊断 → 个性推荐

的完整学习闭环。

---

## 仓库结构（双版本隔离）

本仓库包含两个相互隔离的版本：

```
S2/       单文件版本（线上部署主体）
           ├── index.html          单文件应用（551KB，77个内联脚本块）
           ├── content-s2/         36天课程数据源
           ├── quiz-s2/            题目源
           ├── src/                渲染逻辑（app.js / app.css）
           ├── scripts/            构建与校验脚本
           ├── dist/               单文件构建产物
           └── docs/               S2 相关文档

根目录     V1.5/V1.6 引擎版本（模块化架构）
           ├── engine/             学习引擎骨架
           ├── core/               服务层（学习流/实验/知识图谱/推荐）
           ├── modules/            模块化数据（课程/题目/实验/仪器）
           ├── schemas/            JSON Schema 层
           ├── lab/                LAB 引擎前端
           ├── dashboard/          仪表盘
           └── docs/               V1.5/V1.6/V1.7 架构与开发计划文档
```

- 线上 GitHub Pages 部署入口为 `S2/index.html`（`dist/` 内的自包含文件）。
- `S2/` 与根目录引擎代码零耦合，互不引用。
- 部署与 CI 工作流（`.github/workflows/`）路径已指向 `S2/`。

---

## V1.6 当前架构

```
ChemLab Learning Engine

        用户
         |
         v
   Learning Center
         |
         v
   Knowledge Engine
         |
         v
 Experiment Engine
         |
         v
 Question Engine
         |
         v
 Learning Record
         |
         v
 Recommendation Engine
```

---

## 核心模块

### 1. 学习中心

负责：

- Day 课程组织
- 知识点学习
- 学习流程管理

路径：

```
content/days/
core/learning-flow.js
```

---

### 2. 实验学习系统

支持：

- 实验目标
- 仪器药品
- 实验步骤
- 实验现象
- 实验结论
- 安全评价

路径：

```
content/experiments/
core/experiment-loader.js
core/experiment-service.js
```

---

### 3. 学习记录系统

记录：

- 学习进度
- 实验完成情况
- 评分结果
- 知识掌握状态

路径：

```
core/learning-record.js
```

---

### 4. 智能推荐系统

根据学习情况提供：

- 实验重做建议
- 知识复习建议
- 强化训练路径

路径：

```
core/recommendation/
```

---

## 学习流程

```
选择课程
   |
学习知识点
   |
完成虚拟实验
   |
专项练习
   |
系统评价
   |
生成学习建议
```

---

## 开发路线

### V1.6

已完成：

- 学习流程引擎
- 课程实验关联
- 实验数据标准化
- 实验加载服务
- 学习记录系统
- 推荐系统基础版
- Dashboard 基础模块

### V1.7

规划：

- 化学知识图谱
- 错题诊断系统
- AI 化学导师
- 个性化学习路径

---

## 技术特点

- 原生 Web 架构
- 模块化 JavaScript
- 本地学习数据存储
- 面向 iPad 学习体验优化
- 支持 GitHub Pages 部署

---

## 项目目标

打造一个适合中国初中化学学生的智能学习环境：

让学生不仅学习知识，更通过实验、反馈和诊断形成科学学习能力。
