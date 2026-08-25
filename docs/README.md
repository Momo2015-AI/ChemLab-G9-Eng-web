# docs/ 文档导航

> 2026-08-16 文档整合后的结构。历史版本细节见 `archive/HISTORY-V1.5-V2.2.md` 与根目录 `DEV-REC.md`；一次性过程报告已删除，结论以代码、测试与 CI 再生报告为准。

## 现行标准（内容生产必读）

| 文档 | 作用 |
|---|---|
| `DEVELOPMENT-ROADMAP.md` | **权威开发计划（强制）**：架构优先级、课程结构下一步、质量门禁——所有贡献者提交前必读 |
| `COURSE-DEVELOPMENT-STANDARD.md` | 课程开发权威流程：来源→课程边界→图谱→目标→课程→练习→诊断→补救→掌握→迁移→审计→冻结 |
| `CONTENT-STANDARD.md` | 内容六层标准 + 题目/误解/实验规范 + 7-Gate 审计门禁 + 审查流程与度量 |
| `MASTERY-STANDARD.md` | 95% 掌握标准的定义、门禁与适用边界 |
| `LEARNING-FLOW.md` | 课程级学习流程基准 + 页面级学习路径规范 |
| `LEARNING-UI-STANDARD.md` | 学习页 UI 认知负荷标准（信息架构/视觉层级） |
| `SOURCE-REGISTRY-STANDARD.md` | 来源登记规范（S0-S3 分级，题库生产前置条件） |

## 架构与工程

| 文档 | 作用 |
|---|---|
| `ARCHITECTURE.md` | 现行运行时架构：分层、边界规则、学习闭环数据流、内容模型、CI/部署 |
| `REPOSITORY-CANONICAL-MAP.md` | 仓库目录职责与"禁止重复建设"清单 |
| `RELEASE-AND-DEPLOYMENT.md` | 发布与部署流程（单仓库/单分支/dist 构建） |
| `PROJECT-STATUS.md` | 当前项目状态、质量基线、课程覆盖、已知缺口 |

## 内容参考

| 文档 | 作用 |
|---|---|
| `CURRICULUM-MAP-G9.md` | 人教版九年级化学课程范围与课时映射（扩展课程的边界依据） |
| `SOURCE-AUTHORITY-AUDIT-V1.0.md` | 来源权威性基线审计（C0 阶段证据） |
| `HUBEI-EXAM-MATERIAL-AUDIT-2024-2026.md` | 湖北/武汉中考材料年度校准审计（命题风格校准，不扩教材范围） |

## 历史归档

| 文档 | 作用 |
|---|---|
| `archive/HISTORY-V1.5-V2.2.md` | V1.5→V2.2 各版本目标、落地与证据指针的合并时间线 |
| `DEV-REC-2026-08-16-LEARNING-LOOP-HARDENING.md` | 最近一轮学习闭环加固的完整修复记录 |

## 已删除的文档类型（不再保留）

- 各版本 DEVELOPMENT-PLAN / PHASE 报告（结论并入 HISTORY）
- 一次性审计日报告（audits/、reports/ 日期文件；CI 再生报告保留在 `reports/`）
- docs/ 下逐会话 DEV-REC 副本与 dev-log（权威日志是根目录 `DEV-REC.md`）
- 被现行标准取代的旧版标准（V1.7/V1.8/V1.9 内容来源政策、管线、清单等）
