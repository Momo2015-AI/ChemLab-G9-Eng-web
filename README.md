# ChemLab-G9

## 九年级化学智能学习平台 · V1.7

ChemLab-G9 是一个面向中国初中九年级学生的原生 ES Module 化学学习平台。当前主线为 **V1.7**，重点不是堆叠功能，而是建立一条可验证、可维护的学习闭环：

> 课程学习 → 知识理解 → 实验探究 → 练习评价 → 掌握度更新 → 学习诊断 → 补救学习 → 再检测 → 迁移

平台坚持三个工程原则：**第一性原理、KISS、长期维护主义**。架构重构不得破坏学生学习过程中的证据积累、掌握度、诊断、补救与再检测逻辑。

---

## 当前运行架构

真实生产入口以代码为准：

```text
index.html
    ↓
app/bootstrap.js
    ↓
app/application.js          ← V1.7 Composition Root
    ├── app/state.js
    ├── app/router.js
    ├── app/content-service.js
    ├── app/mastery-service.js
    ├── app/progress-service.js
    ├── controllers/
    │   ├── assessment-controller.js
    │   ├── experiment-controller.js
    │   └── learning-controller.js
    └── views/
        ├── home-view.js
        ├── course-view.js
        ├── quiz-view.js
        ├── experiment-view.js
        ├── dashboard-view.js
        ├── graph-view.js
        └── remediation-view.js
```

`app/application.js` 是当前应用组合根：负责装配依赖、路由和 View，不再承担核心学习领域计算。fileciteturn271file0

### 核心学习链

```text
Assessment
    ↓
Evidence
    ↓
MasteryService
    ↓
MasteryEngine
    ↓
Learning State
    ↓
Diagnosis / Remediation
    ↓
Targeted Recheck
    ↓
Transfer
```

知识图谱由 `ContentService` 统一提供，核心知识查询使用 canonical knowledge engine；应用层不再维护多套 KnowledgeEngine。

---

## 目录职责

```text
ChemLab-G9/
├── index.html                  # 浏览器入口
├── app/                        # V1.7 应用编排与应用服务
│   ├── bootstrap.js
│   ├── application.js          # Composition Root
│   ├── state.js                # 运行状态
│   ├── router.js               # 路由
│   ├── content-service.js      # 内容/知识图谱访问
│   ├── mastery-service.js      # 掌握度领域入口
│   ├── progress-service.js     # 持久化适配
│   └── progress-projection.js  # Dashboard Read Model
├── controllers/                # 学习流程控制
├── views/                      # UI 渲染
├── engine/                     # 当前仍存在的领域引擎/兼容层；legacy 清理中
├── core/                       # 历史 V1.6 服务与仍有价值的领域模块；逐项审计中
├── modules/                    # 课程、题目等核心内容数据
├── content/                    # V1.7 实验与知识内容补充数据
├── schemas/                    # 数据结构约束
├── docs/                       # 架构、开发与审计记录
└── .github/workflows/          # CI/CD
```

> **重要：** `engine/`、`core/`、`dashboard/`、`lab/` 等历史目录目前仍有部分遗留实现。它们不能根据目录名称被视为 V1.7 生产入口，也不会在没有依赖、入口和教育语义验证的情况下批量删除。Legacy 正在按 KEEP / ARCHIVE / DELETE 三态清理。

---

## V1.7 架构原则

### 1. 单一事实来源

- Assessment 负责形成答题证据。
- MasteryEngine / MasteryService 负责掌握度更新。
- Canonical Knowledge Engine 负责知识图谱查询。
- Diagnosis / Remediation 负责学习补救决策。
- Application 不重新实现这些领域规则。

### 2. 学习科学优先

系统不是简单的“课程 + 题库”网站。学习闭环必须保留：

```text
学习 → 练习 → 证据 → 掌握度 → 诊断 → 补救 → 再检测 → 迁移
```

任何架构精简如果破坏这条链，都不应合并。

### 3. KISS

优先复用现有服务和领域对象；只有在职责确实无法归属时才新增抽象。禁止为了消除少量重复而创建新的 `*Engine`、`*Manager`、`*Service`。

### 4. 长期维护

- 文档必须描述当前代码，而不是历史愿景。
- 数据 schema 和测试应成为 CI 的保护网。
- legacy 删除必须先证明没有生产入口、测试依赖、部署入口或独立教育价值。
- 学习数据格式升级必须考虑 migration，不能仅修改 storage key。

---

## 数据与内容

课程和题目属于内容源；知识图谱属于知识数据；实验内容属于实验数据。`modules/` 与 `content/` 的边界在 V1.7 内容源策略中维护，新增内容必须遵循统一的数据来源规则。

课程加载不得依赖硬编码天数；生产代码应以 manifest / 内容元数据为事实来源。

---

## 测试与 CI

本项目使用 Node 原生 ES Module 测试，不使用构建器或框架依赖：

```bash
npm test
```

CI 的最低要求是测试通过。V1.7 Final Stabilization 当前优先处理历史测试失败、API 契约、Node/浏览器环境耦合与知识图谱回归；在测试恢复稳定后，再进行 Legacy 清场和 Schema CI 收尾。

---

## 当前 V1.7 收尾路线

```text
P0  修复测试失败与核心 API 契约
 ↓
P0  消除 Node / 浏览器环境耦合
 ↓
P0  验证 Assessment → Mastery → Diagnosis 闭环
 ↓
P1  README / 架构文档与代码保持一致
 ↓
P1  Legacy 三态清单：KEEP / ARCHIVE / DELETE
 ↓
P1  删除确定无价值的遗留实现
 ↓
P1  内容加载与题库来源收敛
 ↓
P2  Schema CI
 ↓
最终全仓库架构审计
```

---

## 本地运行

项目为原生 ES Module，需要 HTTP 静态服务器：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080/index.html
```

不能直接双击 `index.html`，因为浏览器模块加载和资源访问需要 HTTP 环境。

---

## 技术栈

- HTML / CSS / JavaScript
- 原生 ES Module
- 无前端框架
- 无打包器
- GitHub Pages
- GitHub Actions
- Node.js 测试

---

## 项目目标

打造一个适合中国初中化学学生自主学习的科学学习环境：

**不仅记住化学知识，更通过实验、证据、反馈、诊断、补救和再检测形成可迁移的科学学习能力。**
