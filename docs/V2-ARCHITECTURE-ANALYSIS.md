# ChemLab-G9 架构分析 & 版本建议

> 生成时间：2026-08-10  
> 基于：S2/docs/ARCHITECTURE.md, docs/V1.6-DEVELOPMENT-PLAN.md, docs/V1.7-REFACTOR-PLAN.md, 代码结构扫描

---

## 一、业务逻辑图

```mermaid
graph TB
    subgraph 学习闭环["化学学习闭环（核心业务流）"]
        direction LR
        L1["课程学习<br/>Day 1-36"]
        L2["知识理解<br/>知识点图谱"]
        L3["虚拟实验<br/>LAB Engine"]
        L4["练习评价<br/>题目引擎"]
        L5["学习诊断<br/>错题分析"]
        L6["个性推荐<br/>复习路径"]
    end

    L1 --> L2 --> L3 --> L4 --> L5 --> L6
    L6 -->|复习薄弱点| L1

    subgraph 用户入口["用户入口"]
        U1["学生"]
        U2["家长/教师"]
    end

    U1 --> L1
    U2 --> L6
```

---

## 二、模块架构图（S2 线上版）

```mermaid
graph TB
    subgraph 数据层["数据层 content-s2/"]
        D1["36天课程内容<br/>days/day-01.js ~ day-36.js"]
        D2["知识点图谱<br/>knowledge.js<br/>400+知识点"]
        D3["实验数据<br/>experiments.js<br/>50+实验"]
        D4["错题类型库<br/>mistakes.js"]
        D5["题目库<br/>quiz-s2/"]
        D6["课程manifest<br/>manifest.js"]
    end

    subgraph 引擎层["引擎层 engine/"]
        E1["Learning Engine<br/>课程流程控制"]
        E2["Knowledge Engine<br/>知识点图谱查询"]
        E3["Assessment Engine<br/>题目评分与反馈"]
        E4["Mastery Engine<br/>掌握度计算"]
        E5["Recommendation Engine<br/>错题推荐路径"]
        E6["Lab Engine<br/>虚拟实验播放器"]
    end

    subgraph 服务层["服务层 core/"]
        S1["Learning Flow<br/>学习流控制器"]
        S2["Experiment Service<br/>实验加载服务"]
        S3["Knowledge Graph<br/>图谱构建与查询"]
        S4["Learning Record<br/>学习记录存储"]
        S5["Dashboard Service<br/>仪表盘数据"]
    end

    subgraph 界面层["界面层 src/js/app.js"]
        I1["首页学习导航"]
        I2["课程学习页"]
        I3["错题复习页"]
        I4["虚拟实验页"]
        I5["仪表盘页"]
        I6["成就系统"]
    end

    subgraph 基础设施["基础设施"]
        B1["localStorage 本地存储"]
        B2["GitHub Pages 部署"]
        B3["GitHub Actions CI"]
        B4["单文件构建脚本"]
        B5["冒烟测试"]
        B6["科学巡检"]
    end

    D1 --> E1
    D2 --> E2
    D3 --> E6
    D4 --> E5
    D5 --> E3
    D6 --> E1

    E1 --> S1
    E2 --> S3
    E3 --> S4
    E4 --> S5
    E5 --> S5
    E6 --> S2

    S1 --> I1
    S2 --> I4
    S3 --> I2
    S4 --> I3
    S5 --> I5
    S4 --> I6

    I1 --> B1
    I2 --> B1
    I3 --> B1
    B2 --> I1
    B3 --> B4
    B4 --> D1
    B5 --> B4
    B6 --> B4
```

---

## 三、版本现状全景图

```mermaid
graph TB
    subgraph V2["V2.0 S2（九年级化学下册）"]
        direction TB
        S2_RUN["线上部署运行中<br/>GitHub Pages"]
        S2_36["36天课程内容 全部完成"]
        S2_FEATURES["学习闭环：课程→练习→错题→推荐"]
        S2_DIST["dist/ChemLab-S2.html<br/>1.1MB 单文件"]
    end

    subgraph V15["V1.5/V1.6（九年级化学上册·模块化架构）"]
        direction TB
        ROOT_ENGINE["根目录模块化引擎<br/>engine/ core/ modules/"]
        ROOT_KG["知识图谱 v1.5<br/>modules/questions/taxonomy/"]
        ROOT_DIAG["错题诊断引擎<br/>core/diagnosis/"]
        ROOT_DASH["仪表盘服务<br/>dashboard/"]
        ROOT_LAB["LAB 实验播放器<br/>lab/"]
        ROOT_30["上册30天课程<br/>未发布至S2"]
    end

    subgraph V17["V1.7 重构计划（文档状态）"]
        PLAN1["Phase 1: 目录标准化"]
        PLAN2["Phase 2: 模块隔离"]
        PLAN3["Phase 3: 智能升级准备"]
    end

    subgraph LEGACY["遗留产物"]
        OFFLINE["ChemLab-G9-离线版.html<br/>旧版打包产物"]
        PREVIEW["pages/v17-preview.html<br/>占位预览页"]
    end

    S2_RUN --- S2_36 --- S2_FEATURES --- S2_DIST
    ROOT_ENGINE --- ROOT_KG --- ROOT_DIAG
    ROOT_ENGINE --- ROOT_DASH --- ROOT_LAB
    ROOT_ENGINE --- ROOT_30
    PLAN1 --- PLAN2 --- PLAN3
    OFFLINE --- PREVIEW
```

---

## 四、版本混乱分析

### 问题诊断

| 问题 | 表现 | 影响 |
|------|------|------|
| 双版本并行无整合 | S2（下册）与根目录 V1.5（上册）互不引用 | 知识图谱、实验数据无法跨册复用 |
| 版本号体系冲突 | S2 自报 v1.0.0，根目录文档写 V1.6/V1.7 | 外部无法判断哪个是"当前版本" |
| V1.7 计划未执行 | 文档中有 Phase 1/2/3，但代码无对应提交 | 重构计划悬空 |
| 遗留产物未清理 | 离线版 HTML、v17-preview.html 仍在仓库 | 混淆用户与部署路径 |
| 知识图谱数据重复 | 根目录 modules/questions/taxonomy/ 与 S2 content-s2/knowledge/ 内容重叠 | 维护两份数据 |
| 仪器库数据分散 | 根目录 modules/instruments/ 有6个JSON，S2 中无对应引用 | 实验可视化无法跨版本使用 |

### 核心矛盾

```
S2（单文件版）
├── 优点：部署简单，iPad 可直接打开
├── 缺点：内容耦合在 JS 内，扩展困难
└── 状态：已发布，功能完整

根目录（模块化版）
├── 优点：代码分层清晰，适合长期维护
├── 缺点：未整合进 S2，没有运行入口
└── 状态：开发中，代码可用但未部署
```

---

## 五、后续开发计划（V1.8 整合阶段）

### 阶段一：版本整合（预计 2 周）

```
目标：将根目录模块化引擎接入 S2，形成统一版本体系

Step 1: 确定版本号
  - S2 升级至 v2.0（明确为九年级化学下册）
  - 上册内容创建独立仓库或 subdirectory：ChemLab-G9-S1
  - 根目录 V1.5/V1.6 引擎代码迁移至 S2/core/ 目录

Step 2: 合并知识图谱数据
  - 将 modules/questions/taxonomy/knowledge-graph.json 的节点
    合并进 S2/content-s2/knowledge/knowledge.js
  - 建立统一的知识点 ID 规范（如 K317 已存在，继续 K318-K400）

Step 3: 实验数据整合
  - 将 lab/experiment-player.js 与 content-s2/experiments/experiments.js 对接
  - 将 modules/instruments/*.json 的图标引用接入 S2 assets/icons/

Step 4: 清理遗留产物
  - 删除 ChemLab-G9-离线版.html（已被 S2/dist/ 替代）
  - 删除 pages/v17-preview.html（功能已被 S2 替代）
  - 删除根目录 docs/ 下的 V1.5/V1.6/V1.7 文档（迁移至 S2/docs/）
```

### 阶段二：功能增强（预计 3 周）

```
目标：补齐用户指南中提到的四大功能

Feature 1: 错题本完善
  - 当前 mistakes.js 仅 69 行，数据稀疏
  - 需要：错误类型标签体系、错题聚合查询、按知识点分组复习
  - 参考：core/diagnosis/ 已有诊断引擎骨架

Feature 2: 学习档案
  - 当前 localStorage 存储较简单（chemlab-g9:v3:*）
  - 需要：增加学习时长、各知识点正确率趋势、实验完成记录
  - 参考：dashboard/learning-progress.js 已有基础

Feature 3: 实验专题
  - 当前 experiments.js 357 行，以数据为主
  - 需要：将 lab/experiment-player.js 渲染逻辑接入 S2 界面
  - 参考：V1.6-DEVELOPMENT-PLAN.md Phase 2 已有规划

Feature 4: AI 化学助手（V2.0）
  - 纯前端无法实现，需要接入 LLM API
  - 预留接口：core/diagnosis/diagnosis-engine.js 已定义输入输出格式
  - 待 V2.0 阶段实现，当前仅做接口定义
```

### 阶段三：体验优化（持续）

```
- iPad Safari 触控优化（已部分完成，需测试覆盖）
- 暗色模式完善
- 离线包体积优化（当前 1.1MB，目标 <800KB）
- 多册内容统一导航（上册/下册切换）
```

---

## 六、版本命名建议

```
ChemLab-G9 系列版本号规范：

V2.0.x  → 九年级化学下册（S2）线上版
           例：V2.0.1 = 基础功能完善
           例：V2.1.0 = 错题本升级
           例：V2.2.0 = 实验专题上线
           例：V3.0.0 = AI 化学助手（需要后端/LCM API）

V1.x.x  → 九年级化学上册（S1，待创建独立仓库）
           保持 V1.x.x 编号以示与下册区分
```

---

## 七、立即可执行的清理操作

```bash
# 1. 删除遗留产物
rm ChemLab-G9-离线版.html
rm pages/v17-preview.html
rmdir pages/  # 若为空

# 2. 归档根目录 V1.5/V1.6 文档（保留但不作为主文档）
mkdir -p docs/archive/v1-legacy
mv docs/V1.5-Architecture.md docs/V1.6-ARCHITECTURE.md \
   docs/V1.6-DEVELOPMENT-PLAN.md docs/V1.7-REFACTOR-PLAN.md \
   docs/archive/v1-legacy/

# 3. 在 S2/docs/ 中创建统一架构文档
# 4. 更新根目录 README.md 明确版本定位
# 5. 更新 S2/VERSION.md 版本号
```

---

## 八、总结

**当前状态：**
- S2（下册36天）已完整并发布，是线上唯一运行版本
- 根目录模块化引擎代码可用，但未整合进 S2
- 版本命名混乱，S2 自报 v1.0.0 与根目录 V1.6 文档冲突

**建议优先级：**
1. **立即清理**：删除遗留产物，归档旧文档（半天）
2. **统一版本**：S2 版本号改为 V2.0.0，README 明确定位（半天）
3. **知识图谱整合**：合并根目录 taxonomy 数据至 S2（1周）
4. **实验引擎接入**：将 lab/ 播放器接入 S2（1周）
5. **错题本完善**：基于 core/diagnosis/ 扩展数据（1周）
6. **AI 助手预留接口**：完成接口定义，V2.1 接入（长期）

**核心原则：**
- S2 是线上主体，所有新功能优先接入 S2
- 根目录模块化代码作为"引擎库"供 S2 引用，不再独立部署
- 上册（S1）创建独立仓库，保持版本清晰
