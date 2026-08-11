# ChemLab-G9

## 九年级化学智能学习平台 · V1.8 Freeze → V1.9 Feature Development

ChemLab-G9 是一个面向中国初中九年级学生的原生 ES Module 化学学习平台。V1.8 已完成生产接线、知识图谱边界归一化、诊断→补救→再检测闭环、Architecture Freeze 与 Directory Freeze。当前进入 V1.9 功能开发阶段。

> 课程学习 → 知识理解 → 实验探究 → 练习评价 → 证据 → 掌握度 → 诊断 → 补救 → 再检测 → 迁移 → 下一学习任务

项目坚持三个长期原则：**第一性原理、KISS、长期维护主义**。任何新功能都不能破坏学习证据、掌握度、诊断、补救和再检测链路。

---

## V1.8 冻结架构

```text
index.html
    ↓
app/bootstrap.js
    ↓
app/application.js              ← Composition Root
    ├── app/state.js
    ├── app/router.js
    ├── app/content-service.js
    ├── app/content-loader.js
    ├── app/mastery-service.js
    └── app/progress-service.js
          ↓
controllers/
    ├── assessment-controller.js
    ├── experiment-controller.js
    └── learning-controller.js
          ↓
canonical core / domain engines
    ├── assessment
    ├── experiment
    ├── mastery
    ├── diagnosis
    └── knowledge graph
          ↓
views/
```

应用层负责装配和流程协调；领域引擎负责学习规则；View 负责展示。

### 单一事实来源

| 能力 | Canonical 来源 |
|---|---|
| Application Runtime | `app/bootstrap.js` + `app/application.js` |
| Application State | `app/state.js` |
| Progress Persistence | `app/progress-service.js` |
| Content Access | `app/content-service.js` |
| Knowledge Graph | Canonical Knowledge Engine |
| Mastery | `MasteryEngine` |
| Diagnosis | Canonical Diagnosis Engine |
| Remediation | Canonical remediation flow/catalog |
| Assessment | `AssessmentController` |
| Experiment | `ExperimentController` |
| Learning | `LearningController` |

禁止重新引入第二套 application state、mastery、knowledge graph 或 recommendation/diagnosis engine。

---

## V1.8 验证基线

当前自动化测试：

```text
66 tests
66 pass
0 fail
0 skipped
0 cancelled
```

V1.8 Architecture Freeze Audit：**APPROVED**。

V1.8 Directory Freeze：**APPROVED**。

完整审计记录：

- `docs/V1.8-ARCHITECTURE-FREEZE-AUDIT.md`
- `docs/V1.8-DIRECTORY-FREEZE-AUDIT.md`

Health Check 已迁移到 ESM，与项目 `"type": "module"` 契约一致。

---

## 受控兼容层

当前唯一明确保留的架构兼容项是旧知识图谱 JSON fallback：

```text
canonical: /content/knowledge/knowledge-graph.json
fallback:  /modules/questions/taxonomy/knowledge-graph.json
```

canonical 数据始终优先。fallback 仅用于内容迁移安全，不属于第二套生产知识引擎。

已有 `chemlab_v16` storage key 也作为旧学习数据兼容标识保留，但不构成第二套状态实现。

---

## V1.9 开发方向

V1.9 不再进行基础架构重写，重点进入产品能力与真实学习体验：

```text
Learning Center
      ↓
Knowledge Learning
      ↓
Interactive Experiment
      ↓
Assessment
      ↓
Evidence
      ↓
Diagnosis
      ↓
Personalized Remediation
      ↓
Targeted Recheck
      ↓
Mastery / Dashboard
      ↓
Transfer / Next Task
```

详细开发计划：`docs/V1.9-DEVELOPMENT-PLAN.md`。

---

## 测试与发布

项目使用 Node 原生 ES Module 测试：

```bash
npm test
```

每个功能阶段必须满足：

```text
implementation
→ unit/integration tests
→ npm test GREEN
→ Build Check GREEN
→ documentation updated
→ commit on main
→ Pages deployment
```

GitHub Pages 发布 workflow 必须先通过测试，再上传和部署 Pages artifact。

`main` 是本项目唯一开发与发布分支。

---

## 本地运行

项目为原生 ES Module，需要 HTTP 静态服务器：

```bash
python3 -m http.server 8080
```

访问：

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
- Node.js 原生测试

---

## 项目愿景

打造一个适合中国初中化学学生自主学习的科学学习环境：

**不仅记住化学知识，更通过实验、证据、反馈、诊断、补救、再检测和迁移形成可持续的科学学习能力。**
