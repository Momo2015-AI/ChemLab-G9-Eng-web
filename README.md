# ChemLab-G9

## 九年级化学智能学习平台

ChemLab-G9 是基于模块化架构的九年级化学学习引擎，覆盖上册与下册全部内容。

> 课程学习 → 知识理解 → 虚拟实验 → 练习评价 → 学习诊断 → 个性推荐

---

## 仓库结构

```
ChemLab-G9/
├── index.html              应用入口（ES Module）
├── engine/                 应用引擎层
│   ├── app.js              应用主入口（ChemLabApp）
│   ├── router.js           路由
│   ├── knowledge-engine.js 知识引擎
│   ├── experiment-engine.js 实验引擎
│   ├── assessment-engine.js 评估引擎
│   ├── mastery-engine.js   掌握度引擎
│   ├── recommendation-engine.js 推荐引擎
│   ├── progress-manager.js 进度管理器
│   ├── task-engine.js      任务引擎
│   └── content-loader.js   内容加载器
│
├── core/                   服务层
│   ├── learning-flow.js    学习流程控制器
│   ├── learning-record.js  学习记录系统
│   ├── experiment-loader.js 实验加载器
│   ├── experiment-service.js 实验服务
│   ├── day-course-service.js 课程服务
│   ├── diagnosis/          错题诊断
│   ├── knowledge-graph/    知识图谱引擎
│   ├── learning-link/      课程-实验映射
│   └── recommendation/     推荐服务
│
├── lab/                    LAB 实验前端
│   ├── experiment-player.js 实验播放器
│   ├── experiment-renderer.js 实验渲染器
│   ├── experiment-state.js  实验状态管理
│   ├── error-diagnosis.js   实验错误诊断
│   ├── equipment.js         仪器注册表
│   └── lab-page.html        实验页面（独立）
│
├── dashboard/              仪表盘服务
│   ├── dashboard-service.js
│   ├── learning-progress.js
│   ├── experiment-history.js
│   └── mastery-report.js
│
├── modules/                模块化数据与模型
│   ├── lessons/            课程数据（day01.json 等）
│   ├── instruments/        仪器图标数据（JSON）
│   ├── experiments/        实验模块定义
│   ├── materials/          教材材料
│   ├── learning/           学习数据模型
│   ├── questions/          题目与 taxonomy
│   └── tasks/              学习任务定义
│
├── content/                内容数据层
│   ├── experiments/        实验数据（JSON/JS）
│   └── knowledge/          知识点数据（JS/JSON）
│
├── schemas/                JSON Schema 层
│   ├── lesson.schema.json
│   ├── question.schema.json
│   ├── experiment.schema.json
│   └── instrument.schema.json
│
├── docs/                   架构与开发文档
│   ├── ChemLab-Learning-Engine-V1.5-Architecture.md
│   ├── V1.6-ARCHITECTURE.md
│   └── V1.6-DEVELOPMENT-PLAN.md
│
└── .github/workflows/      CI/CD
    ├── build-check.yml     构建校验（JS 语法 + 结构检查）
    ├── check.yml           健康检查
    └── pages.yml           GitHub Pages 部署
```

---

## V1.6 架构总览

```
用户
 │
 ▼
┌─────────────────────────────────────┐
│           应用引擎层（engine/）        │
│  app → router → knowledge/experiment/
│        assessment/mastery/
│        recommendation/task           │
└─────────────────────────────────────┘
 │
 ▼
┌─────────────────────────────────────┐
│           服务层（core/）             │
│  learning-flow | experiment-service |
│  knowledge-graph | diagnosis |        │
│  learning-record | recommendation    │
└─────────────────────────────────────┘
 │
 ▼
┌─────────────────────────────────────┐
│           数据层                     │
│  modules/lessons/  课程数据           │
│  modules/instruments/  仪器图标        │
│  modules/questions/  题目与分类        │
│  modules/tasks/      学习任务定义      │
│  content/experiments/ 实验数据         │
│  content/knowledge/    知识点数据      │
│  schemas/              JSON Schema    │
└─────────────────────────────────────┘
 │
 ▼
┌─────────────────────────────────────┐
│           前端展示层                 │
│  lab/          虚拟实验播放器         │
│  dashboard/    学习仪表盘            │
│  index.html    主入口（ES Module）   │
└─────────────────────────────────────┘
```

---

## 核心模块

### 1. 学习引擎（engine/）

| 模块 | 职责 |
|------|------|
| `app.js` | 应用主入口，初始化所有引擎 |
| `router.js` | 路由分发 |
| `knowledge-engine.js` | 知识点查询与图谱遍历 |
| `experiment-engine.js` | 实验数据加载与执行 |
| `assessment-engine.js` | 题目评分与反馈 |
| `mastery-engine.js` | 知识掌握度计算 |
| `recommendation-engine.js` | 个性化复习路径推荐 |
| `progress-manager.js` | 学习进度持久化 |
| `task-engine.js` | 学习任务调度 |

### 2. 服务层（core/）

| 模块 | 职责 |
|------|------|
| `learning-flow.js` | 学习流程控制器（lesson→knowledge→experiment→practice→evaluation） |
| `learning-record.js` | 学习记录存储（localStorage） |
| `experiment-loader.js` | 实验数据加载 |
| `experiment-service.js` | 实验完成状态管理 |
| `diagnosis/` | 错题诊断引擎（错误类型模型、题目-知识点映射） |
| `knowledge-graph/` | 知识图谱构建、查询、学习路径生成 |
| `recommendation/` | 实验与知识复习推荐 |

### 3. LAB 实验引擎（lab/）

```
Experiment JSON
      ↓
experiment-state   实验状态管理
      ↓
experiment-player  交互播放器
      ↓
experiment-renderer 实验渲染（页面输出）
      ↓
error-diagnosis    实验错误诊断
```

### 4. 仪表盘（dashboard/）

- `learning-progress.js` — 学习进度报告
- `experiment-history.js` — 实验完成历史
- `mastery-report.js` — 知识掌握度报告
- `dashboard-service.js` — 聚合层

---

## 数据模型

### 知识图谱节点

```json
{
  "id": "oxygen-property",
  "name": "氧气的性质",
  "chapter": "我们周围的空气",
  "domain": "substance",
  "relations": {
    "prerequisite": ["chemical-change"],
    "related": ["oxygen-preparation"],
    "experiment": ["task-oxygen-production-001"],
    "question": ["q0001"],
    "commonMistake": ["concept-error"]
  },
  "bloomLevels": ["remember", "understand", "apply", "analyze"]
}
```

### 学习数据模型

```
lesson → task → knowledge（target）
task   → activity（composes）
activity → assessment（produces）
assessment → mistake（mayIdentify）
assessment → mastery（updates）
mastery → nextTask（influences）
```

---

## 本地运行

```bash
# 使用任意静态服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080/index.html
```

> 注意：ES Module 需要 HTTP 服务器运行（不能直接双击打开）。

---

## 开发路线

### V1.6（当前）

已完成：

- 模块化引擎骨架（engine/）
- 知识图谱 v1.5（modules/questions/taxonomy/）
- 实验数据模型与 LAB 播放器基础
- 仪器图标库（6 种基础仪器）
- 学习流程控制器
- 错题诊断模型
- Dashboard 基础模块

待完成：

- 完整课程内容填充（模块数据）
- 题目库扩充
- LAB 实验交互完善
- 知识图谱节点全量导入

### V1.7（规划）

- 化学知识图谱全量构建
- 错题诊断系统上线
- AI 化学导师（需接入 LLM API）
- 个性化学习路径

### V2.0（远期）

- 上册内容完整填充
- 多册内容统一导航
- 学习数据分析看板

---

## 技术栈

- 原生 HTML / CSS / JavaScript（ES Module）
- 无框架、无打包器、无外部依赖
- GitHub Pages 部署
- GitHub Actions CI

---

## 项目目标

打造一个适合中国初中化学学生的智能学习环境：

让学生不仅学习知识，更通过实验、反馈和诊断形成科学学习能力。
