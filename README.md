# ChemLab-G9-Eng

## 九年级化学学习平台 · Architecture Freeze → Content-First Development

ChemLab-G9-Eng 是面向中国初中九年级学生的化学学习平台。当前工程架构已经完成深度清扫并正式冻结；项目进入**内容建设优先**阶段。

> **当前优先级：内容可信度 > 学习效果 > 实验与反馈 > UI 打磨 > 未来 AI 能力**

旧的 320 道题原始数据已永久退出生产体系。后续题库只允许基于经过登记、审查的新课程/教材/科学资料重新建设。

---

## 1. Architecture Freeze

当前生产入口保持单一事实来源：

```text
index.html
    ↓
app/bootstrap.js
    ↓
app/application.js              ← Composition Root
    ├── state
    ├── router
    ├── content service/loader
    ├── mastery
    └── progress
          ↓
controllers/
          ↓
canonical domain engines
          ↓
views/
```

### 冻结原则

- `main` 是唯一开发与发布分支。
- 不再进行无明确需求的基础架构重写。
- 不重新引入第二套 state / mastery / knowledge graph / diagnosis / recommendation engine。
- 任何架构变更必须先有明确理由、影响分析、测试和审计记录。
- 目录清扫已经完成；后续删除或迁移必须经过依赖证据确认。

### CI/CD Freeze

```text
ChemLab-G9 CI/CD
├── Validate
│   ├── JS syntax
│   ├── npm test
│   ├── runtime audit
│   ├── JSON validation
│   ├── content integrity + lesson readiness
│   └── deployment entry
└── Deploy (needs: validate)
    └── build-pages (runtime-only dist/) → GitHub Pages
```

仓库只保留一个自有 workflow（构建校验 + Pages 部署一体）。部署产物由 `scripts/build-pages.mjs` 从显式运行时清单组装，docs/、reports/、tests/、scripts/ 等工程目录不会发布到学生端站点。GitHub Pages 的内部 `pages-build-deployment` 属于平台基础设施，不计入仓库 workflow 数量。

当前生产门禁必须保持全绿：**tests / runtime audit / content integrity / Pages deployment**。

---

## 2. Content-First Development

内容生产遵循：

```text
Authoritative Sources
        ↓
Source Registry
        ↓
Curriculum Map
        ↓
Knowledge Graph
        ↓
Learning Objectives
        ↓
Lesson
        ↓
Experiment / Visual / Example
        ↓
Assessment Blueprint
        ↓
Question Bank
        ↓
Diagnosis / Remediation / Recheck
        ↓
7-Gate Content Audit
        ↓
Release
```

详细规范：

- `docs/README.md`（文档导航）
- `docs/COURSE-DEVELOPMENT-STANDARD.md`
- `docs/CONTENT-STANDARD.md`
- `content/sources/README.md`

### 内容来源原则

生产课程必须首先建立 Source Registry，并明确：

- **S0：指定教材/课程体系**——决定课程范围与章节顺序；
- **S1：官方课程标准/课程要求**——决定学习要求和边界；
- **S2：权威科学资料**——用于科学事实、实验和术语核验；
- **S3：可靠教学研究/教学资料**——仅在确有必要时支持教学设计；
- 未经登记的网络材料不能直接成为生产内容来源。

当前 Source Registry 状态为：`SOURCE_REGISTRY_PENDING`。在新的教材/课程文档登记并完成范围审查前，不批量生成生产题库。

---

## 3. Lesson Production Contract

每一课必须至少具备：

1. 可观察的学习目标；
2. 前置知识与知识依赖；
3. 核心概念及边界；
4. 从现象/问题 → 模型 → 解释 → 规律的学习链；
5. 适龄视觉模型或交互；
6. 适用时的实验目标、器材、现象、解释、结论、安全和异常情况；
7. 必要时的示范例题；
8. 从理解到应用、迁移的分层练习；
9. 误解诊断、补救和再检测链接；
10. 来源 provenance；
11. 明确的 `DRAFT / IN_REVIEW / REVISED / READY / RETIRED` 状态。

**题目必须在课程目标、知识关联和 Assessment Blueprint 完成后生成。**

---

## 4. Content Audit Gates

每个生产单元必须通过：

```text
1. Source Audit
       ↓
2. Scientific Audit
       ↓
3. Grade-9 Suitability Audit
       ↓
4. Pedagogical / Content Audit
       ↓
5. Question Quality Audit
       ↓
6. Knowledge-Linkage Audit
       ↓
7. Release Gate
```

任何 `BLOCKER` 或未关闭的高风险问题都不得进入 `READY`。

---

## 5. Current Content Phase

### Phase C0 — Source Intake

建立教材、课程标准、科学参考资料的来源登记与版本锁定。

### Phase C1 — Curriculum Reconstruction

从 S0/S1 来源重建课程范围、章节结构、课时边界和知识依赖。

### Phase C2 — Knowledge Architecture

建立 Curriculum Map、Knowledge Graph、Learning Graph、Assessment Graph。

### Phase C3 — Benchmark Lesson

选择第一课作为完整内容生产样板，跑通：

```text
source → lesson → experiment → knowledge → practice → diagnosis → audit
```

### Phase C4 — Controlled Expansion

Benchmark 通过全部 Gate 后，再逐课扩展，不允许批量复制模板制造“虚假完成度”。

---

## 6. Retired Question Bank Rule

旧 320 道题：

- 不属于 Source Registry；
- 不属于 seed；
- 不属于 benchmark；
- 不属于 fallback；
- 不用于新题目生成；
- 不用于评价新题库质量。

新题库必须从新课程资料重新建立。

---

## 7. Development Log

所有实质性开发对话、工程决策、审计结果、提交和下一步必须记录在顶层：

`DEV-REC.md`

这是永久项目规则，不因版本冻结或架构升级而失效。

---

## 8. Verification & Release

```bash
npm test
```

每次生产变更遵循：

```text
implementation
→ tests
→ runtime/content audit
→ documentation
→ commit on main
→ CI GREEN
→ Pages deployment
```

---

## 9. Local Development

项目使用原生 ES Module，需要 HTTP 静态服务器：

```bash
python3 -m http.server 8080
```

访问：

```text
http://localhost:8080/index.html
```

不能直接双击 `index.html`。

---

## 10. Technology

- HTML / CSS / JavaScript
- Native ES Modules
- No frontend framework
- No bundler
- GitHub Pages
- GitHub Actions
- Node.js native tests

---

## Project Vision

打造一个适合中国初中九年级学生自主学习的科学学习环境：

**不仅记住化学知识，更通过现象、模型、实验、证据、反馈、诊断、补救、再检测和迁移形成可持续的科学学习能力。**
