# ChemLab-G9

## 九年级化学智能学习平台 · V1.8

ChemLab-G9 是一个面向中国初中九年级学生的原生 ES Module 化学学习平台。V1.7 已完成核心架构收敛；V1.8 已完成生产接线、知识图谱边界归一化、诊断→补救→再检测闭环和 Architecture Freeze Audit。

> 课程学习 → 知识理解 → 实验探究 → 练习评价 → 证据 → 掌握度 → 诊断 → 补救 → 再检测 → 迁移 → 下一学习任务

项目坚持三个长期原则：**第一性原理、KISS、长期维护主义**。任何新功能或重构都不能破坏学习证据、掌握度、诊断、补救和再检测链路。

---

## V1.7 / V1.8 稳定架构

V1.7/V1.8 已形成稳定的应用架构：

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
engine/ + core/
    ├── assessment
    ├── experiment
    ├── mastery
    ├── diagnosis
    └── canonical knowledge graph
          ↓
views/
```

应用层负责装配和流程协调；领域引擎负责学习领域规则；View 负责展示。

### 当前验证结果

```text
62 tests
62 pass
0 fail
0 skipped
0 cancelled
```

V1.8 Architecture Freeze Audit 已完成，结果为 **PASS WITH CONTROLLED COMPATIBILITY**。

完整审计记录：`docs/V1.8-ARCHITECTURE-FREEZE-AUDIT.md`。

---

## V1.8 产品目标

V1.8 的核心问题不是“再增加多少页面”，而是：

> **系统能否根据学生产生的学习证据，判断下一步最值得做什么？**

当前核心闭环：

```text
Lesson
  ↓
Knowledge understanding
  ↓
Practice / Experiment
  ↓
Evidence
  ↓
Mastery update
  ↓
Diagnosis
  ↓
Remediation
  ↓
Targeted recheck
  ↓
New evidence
  ↓
Mastery
```

---

## Architecture Freeze

V1.8 冻结以下核心边界：

- `ContentService`：唯一应用侧内容访问边界。
- `Canonical Knowledge Engine`：唯一知识图谱遍历和查询实现。
- `MasteryEngine`：唯一掌握度计算实现。
- `DiagnosisEngine`：唯一诊断决策实现。
- `Remediation`：唯一补救规划路径。
- `ProgressService`：唯一学习进度持久化边界。
- `Controllers`：协调流程，不重复领域算法。

禁止：

1. 新增第二套 application state。
2. 新增第二套 mastery calculation。
3. 新增第二套 knowledge graph engine。
4. 在 Controller 中复制领域算法。
5. 新增生产代码依赖 deprecated legacy adapter。
6. 绕过 `ContentService` 直接建立第二套 canonical content access。

唯一受控兼容例外是旧 knowledge graph JSON fallback：canonical graph 始终优先，旧路径只作为迁移安全网。

---

## 数据合同

V1.8 统一使用以下核心语义标识：

```text
knowledgeId
lessonId
questionId
experimentId
evidenceId
errorType
difficulty
masteryScore
confidence
recommendedAction
```

所有会影响掌握度的学习事件都应该可以追溯到 evidence。

---

## 测试与发布

项目使用 Node 原生 ES Module 测试：

```bash
npm test
```

当前基线：

```text
62 / 62
0 failures
```

Build Check 验证 JavaScript syntax、Node tests、内容 JSON 和入口文件。

GitHub Pages 发布 workflow 同样先执行 `npm test`，测试通过后才允许上传和部署 Pages artifact。

每个后续 Phase 的完成条件：

```text
implementation
→ tests
→ npm test GREEN
→ CI GREEN
→ documentation updated
→ commit on main
```

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
