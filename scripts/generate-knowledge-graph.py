#!/usr/bin/env python3
"""
ChemLab-G9 知识点图谱生成器
基于人教版九年级化学下册课程标准
审查标准：华师一附中教研水平 + 王后雄教授化学教学规范
"""
import json

nodes = [
    # ===== 基础模块 =====
    {
        "id": "chem-fundamentals",
        "name": "物质的分类与变化",
        "chapter": "基础模块",
        "domain": "fundamentals",
        "relations": {
            "prerequisite": [],
            "related": ["acid-intro", "base-intro", "metal-intro"],
            "experiment": ["exp-chem-change"],
            "question": ["q-fund-001", "q-fund-002", "q-fund-003", "q-fund-004", "q-fund-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    # ===== 单元一：酸和碱 (Day01-Day07) =====
    {
        "id": "acid-intro",
        "name": "常见的酸",
        "chapter": "单元一 酸和碱",
        "domain": "substance",
        "relations": {
            "prerequisite": ["chem-fundamentals"],
            "related": ["acid-property", "ph-scale"],
            "experiment": ["exp-hcl-fe", "exp-h2so4-cuO"],
            "question": ["q-acid-001", "q-acid-002", "q-acid-003", "q-acid-004", "q-acid-005"],
            "commonMistake": ["concept-error", "operation-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "acid-property",
        "name": "酸的化学性质",
        "chapter": "单元一 酸和碱",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["acid-intro"],
            "related": ["base-property", "neutralization"],
            "experiment": ["exp-acid-copper-oxide", "exp-acid-iron"],
            "question": ["q-acid-007", "q-acid-008", "q-acid-009", "q-acid-010", "q-acid-011", "q-acid-012"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "acid-use",
        "name": "酸的重要用途",
        "chapter": "单元一 酸和碱",
        "domain": "application",
        "relations": {
            "prerequisite": ["acid-property"],
            "related": [],
            "experiment": [],
            "question": ["q-acid-use-001", "q-acid-use-002", "q-acid-use-003"],
            "commonMistake": []
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "base-intro",
        "name": "常见的碱",
        "chapter": "单元一 酸和碱",
        "domain": "substance",
        "relations": {
            "prerequisite": ["acid-intro"],
            "related": ["base-property", "ph-scale"],
            "experiment": ["exp-naoh-na2co3", "exp-ca(oh)2-co2"],
            "question": ["q-base-001", "q-base-002", "q-base-003", "q-base-004", "q-base-005", "q-base-006"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "base-property",
        "name": "碱的化学性质",
        "chapter": "单元一 酸和碱",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["base-intro"],
            "related": ["acid-property", "neutralization"],
            "experiment": ["exp-base-cuSO4", "exp-base-co2"],
            "question": ["q-base-007", "q-base-008", "q-base-009", "q-base-010", "q-base-011", "q-base-012"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "ph-scale",
        "name": "溶液的酸碱度 pH",
        "chapter": "单元一 酸和碱",
        "domain": "measurement",
        "relations": {
            "prerequisite": ["acid-intro", "base-intro"],
            "related": ["acid-property", "base-property", "neutralization"],
            "experiment": ["exp-ph-test"],
            "question": ["q-ph-001", "q-ph-002", "q-ph-003", "q-ph-004", "q-ph-005", "q-ph-006"],
            "commonMistake": ["concept-error", "calculation-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "neutralization",
        "name": "中和反应",
        "chapter": "单元一 酸和碱",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["acid-property", "base-property"],
            "related": ["ph-scale", "acid-use"],
            "experiment": ["exp-neutralization"],
            "question": ["q-neutral-001", "q-neutral-002", "q-neutral-003", "q-neutral-004", "q-neutral-005", "q-neutral-006"],
            "commonMistake": ["concept-error", "calculation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "unit1-review",
        "name": "单元一 酸和碱 综合复习",
        "chapter": "单元一 酸和碱",
        "domain": "review",
        "relations": {
            "prerequisite": ["acid-intro", "acid-property", "base-intro", "base-property", "ph-scale", "neutralization"],
            "related": [],
            "experiment": [],
            "question": ["q-unit1-001", "q-unit1-002", "q-unit1-003", "q-unit1-004", "q-unit1-005", "q-unit1-006", "q-unit1-007", "q-unit1-008"],
            "commonMistake": ["concept-error", "equation-error", "calculation-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
    # ===== 单元二：盐 化肥 (Day08-Day14) =====
    {
        "id": "salt-intro",
        "name": "盐的性质",
        "chapter": "单元二 盐 化肥",
        "domain": "substance",
        "relations": {
            "prerequisite": ["acid-intro", "base-intro"],
            "related": ["salt-use", "fertilizer-intro"],
            "experiment": ["exp-nacl-nahco3", "exp-caCO3-hCl"],
            "question": ["q-salt-001", "q-salt-002", "q-salt-003", "q-salt-004", "q-salt-005"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "salt-use",
        "name": "盐的化学性质与用途",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["salt-intro"],
            "related": ["salt-test", "fertilizer-intro"],
            "experiment": ["exp-salt-agNO3", "exp-salt-baCl2"],
            "question": ["q-salt-006", "q-salt-007", "q-salt-008", "q-salt-009", "q-salt-010"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "salt-test",
        "name": "常见离子的检验",
        "chapter": "单元二 盐 化肥",
        "domain": "experiment",
        "relations": {
            "prerequisite": ["salt-use"],
            "related": ["salt-use"],
            "experiment": ["exp-ion-test-cl", "exp-ion-test-so4", "exp-ion-test-co3"],
            "question": ["q-salt-test-001", "q-salt-test-002", "q-salt-test-003", "q-salt-test-004", "q-salt-test-005"],
            "commonMistake": ["operation-error", "concept-error"]
        },
        "bloomLevels": ["apply", "analyze"]
    },
    {
        "id": "fertilizer-intro",
        "name": "化学肥料概述",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["salt-intro"],
            "related": ["fertilizer-nitrogen", "fertilizer-phosphate", "fertilizer-potassium"],
            "experiment": [],
            "question": ["q-fert-001", "q-fert-002", "q-fert-003", "q-fert-004", "q-fert-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "fertilizer-nitrogen",
        "name": "氮肥",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["fertilizer-intro"],
            "related": ["fertilizer-phosphate", "fertilizer-potassium"],
            "experiment": [],
            "question": ["q-fert-N-001", "q-fert-N-002", "q-fert-N-003", "q-fert-N-004", "q-fert-N-005"],
            "commonMistake": ["concept-error", "calculation-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "fertilizer-phosphate",
        "name": "磷肥",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["fertilizer-intro"],
            "related": ["fertilizer-nitrogen", "fertilizer-potassium"],
            "experiment": [],
            "question": ["q-fert-P-001", "q-fert-P-002", "q-fert-P-003", "q-fert-P-004", "q-fert-P-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "fertilizer-potassium",
        "name": "钾肥",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["fertilizer-intro"],
            "related": ["fertilizer-nitrogen", "fertilizer-phosphate"],
            "experiment": [],
            "question": ["q-fert-K-001", "q-fert-K-002", "q-fert-K-003", "q-fert-K-004", "q-fert-K-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "compound-fert",
        "name": "复合肥",
        "chapter": "单元二 盐 化肥",
        "domain": "application",
        "relations": {
            "prerequisite": ["fertilizer-nitrogen", "fertilizer-phosphate", "fertilizer-potassium"],
            "related": [],
            "experiment": [],
            "question": ["q-compound-001", "q-compound-002", "q-compound-003", "q-compound-004", "q-compound-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "unit2-review",
        "name": "单元二 盐 化肥 综合复习",
        "chapter": "单元二 盐 化肥",
        "domain": "review",
        "relations": {
            "prerequisite": ["salt-intro", "salt-use", "salt-test", "fertilizer-intro", "fertilizer-nitrogen", "fertilizer-phosphate", "fertilizer-potassium", "compound-fert"],
            "related": [],
            "experiment": [],
            "question": ["q-unit2-001", "q-unit2-002", "q-unit2-003", "q-unit2-004", "q-unit2-005", "q-unit2-006", "q-unit2-007", "q-unit2-008"],
            "commonMistake": ["concept-error", "equation-error", "operation-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
    # ===== 单元三：金属和金属矿物 (Day15-Day21) =====
    {
        "id": "metal-intro",
        "name": "金属资源的利用",
        "chapter": "单元三 金属和金属矿物",
        "domain": "substance",
        "relations": {
            "prerequisite": [],
            "related": ["metal-reactivity", "metal-acid"],
            "experiment": ["exp-iron-rust", "exp-co-reduction"],
            "question": ["q-metal-001", "q-metal-002", "q-metal-003", "q-metal-004", "q-metal-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "metal-property",
        "name": "金属的物理性质",
        "chapter": "单元三 金属和金属矿物",
        "domain": "substance",
        "relations": {
            "prerequisite": ["metal-intro"],
            "related": ["metal-reactivity"],
            "experiment": ["exp-metal-conductivity"],
            "question": ["q-metal-p-001", "q-metal-p-002", "q-metal-p-003", "q-metal-p-004", "q-metal-p-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "metal-reactivity",
        "name": "金属活动性顺序",
        "chapter": "单元三 金属和金属矿物",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["metal-property"],
            "related": ["metal-acid", "metal-salt"],
            "experiment": ["exp-metal-acid", "exp-metal-salt"],
            "question": ["q-metal-r-001", "q-metal-r-002", "q-metal-r-003", "q-metal-r-004", "q-metal-r-005"],
            "commonMistake": ["concept-error", "operation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "metal-acid",
        "name": "金属与酸的反应",
        "chapter": "单元三 金属和金属矿物",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["metal-reactivity"],
            "related": ["metal-salt"],
            "experiment": ["exp-metal-hcl", "exp-metal-h2so4"],
            "question": ["q-metal-a-001", "q-metal-a-002", "q-metal-a-003", "q-metal-a-004", "q-metal-a-005"],
            "commonMistake": ["concept-error", "equation-error", "operation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "metal-salt",
        "name": "金属与盐溶液的反应",
        "chapter": "单元三 金属和金属矿物",
        "domain": "reaction",
        "relations": {
            "prerequisite": ["metal-reactivity", "metal-acid"],
            "related": ["metal-acid"],
            "experiment": ["exp-metal-cuSO4", "exp-metal-agNO3"],
            "question": ["q-metal-s-001", "q-metal-s-002", "q-metal-s-003", "q-metal-s-004", "q-metal-s-005"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "iron-rust",
        "name": "铁的锈蚀与防护",
        "chapter": "单元三 金属和金属矿物",
        "domain": "application",
        "relations": {
            "prerequisite": ["metal-intro"],
            "related": [],
            "experiment": ["exp-iron-rust", "exp-iron-protection"],
            "question": ["q-iron-r-001", "q-iron-r-002", "q-iron-r-003", "q-iron-r-004", "q-iron-r-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "metal-extraction",
        "name": "金属的冶炼",
        "chapter": "单元三 金属和金属矿物",
        "domain": "application",
        "relations": {
            "prerequisite": ["metal-reactivity"],
            "related": ["iron-rust"],
            "experiment": ["exp-co-reduction-Fe2O3"],
            "question": ["q-metal-e-001", "q-metal-e-002", "q-metal-e-003", "q-metal-e-004", "q-metal-e-005"],
            "commonMistake": ["equation-error", "calculation-error"]
        },
        "bloomLevels": ["understand", "apply", "analyze"]
    },
    {
        "id": "unit3-review",
        "name": "单元三 金属 综合复习",
        "chapter": "单元三 金属和金属矿物",
        "domain": "review",
        "relations": {
            "prerequisite": ["metal-intro", "metal-property", "metal-reactivity", "metal-acid", "metal-salt", "iron-rust", "metal-extraction"],
            "related": [],
            "experiment": [],
            "question": ["q-unit3-001", "q-unit3-002", "q-unit3-003", "q-unit3-004", "q-unit3-005", "q-unit3-006", "q-unit3-007", "q-unit3-008"],
            "commonMistake": ["concept-error", "equation-error", "calculation-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
    # ===== 单元四：化学方程式 (Day22-Day26) =====
    {
        "id": "mass-conservation",
        "name": "质量守恒定律",
        "chapter": "单元四 化学方程式",
        "domain": "law",
        "relations": {
            "prerequisite": [],
            "related": ["equation-writing"],
            "experiment": ["exp-mass-conservation"],
            "question": ["q-mass-001", "q-mass-002", "q-mass-003", "q-mass-004", "q-mass-005"],
            "commonMistake": ["concept-error", "calculation-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "equation-writing",
        "name": "化学方程式的书写",
        "chapter": "单元四 化学方程式",
        "domain": "skill",
        "relations": {
            "prerequisite": ["mass-conservation"],
            "related": ["equation-balancing", "equation-calculation"],
            "experiment": [],
            "question": ["q-eq-001", "q-eq-002", "q-eq-003", "q-eq-004", "q-eq-005"],
            "commonMistake": ["equation-error", "concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "equation-balancing",
        "name": "化学方程式的配平",
        "chapter": "单元四 化学方程式",
        "domain": "skill",
        "relations": {
            "prerequisite": ["equation-writing"],
            "related": ["equation-calculation"],
            "experiment": [],
            "question": ["q-eq-b-001", "q-eq-b-002", "q-eq-b-003", "q-eq-b-004", "q-eq-b-005"],
            "commonMistake": ["equation-error", "calculation-error"]
        },
        "bloomLevels": ["apply", "analyze"]
    },
    {
        "id": "equation-calculation",
        "name": "有关化学方程式的计算",
        "chapter": "单元四 化学方程式",
        "domain": "calculation",
        "relations": {
            "prerequisite": ["equation-writing", "equation-balancing"],
            "related": [],
            "experiment": [],
            "question": ["q-eq-c-001", "q-eq-c-002", "q-eq-c-003", "q-eq-c-004", "q-eq-c-005"],
            "commonMistake": ["calculation-error", "equation-error"]
        },
        "bloomLevels": ["apply", "analyze", "evaluate"]
    },
    {
        "id": "unit4-review",
        "name": "单元四 化学方程式 综合复习",
        "chapter": "单元四 化学方程式",
        "domain": "review",
        "relations": {
            "prerequisite": ["mass-conservation", "equation-writing", "equation-balancing", "equation-calculation"],
            "related": [],
            "experiment": [],
            "question": ["q-unit4-001", "q-unit4-002", "q-unit4-003", "q-unit4-004", "q-unit4-005", "q-unit4-006", "q-unit4-007", "q-unit4-008"],
            "commonMistake": ["calculation-error", "equation-error", "concept-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
    # ===== 单元五：化学与生活 (Day27-Day31) =====
    {
        "id": "nutrition-intro",
        "name": "人类重要的营养物质",
        "chapter": "单元五 化学与生活",
        "domain": "life",
        "relations": {
            "prerequisite": [],
            "related": ["nutrition-protein", "nutrition-carbs"],
            "experiment": [],
            "question": ["q-nut-001", "q-nut-002", "q-nut-003", "q-nut-004", "q-nut-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "nutrition-protein",
        "name": "蛋白质",
        "chapter": "单元五 化学与生活",
        "domain": "life",
        "relations": {
            "prerequisite": ["nutrition-intro"],
            "related": ["nutrition-carbs", "nutrition-vitamin"],
            "experiment": [],
            "question": ["q-protein-001", "q-protein-002", "q-protein-003", "q-protein-004", "q-protein-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "nutrition-carbs",
        "name": "糖类和油脂",
        "chapter": "单元五 化学与生活",
        "domain": "life",
        "relations": {
            "prerequisite": ["nutrition-intro"],
            "related": ["nutrition-protein", "nutrition-vitamin"],
            "experiment": [],
            "question": ["q-carbs-001", "q-carbs-002", "q-carbs-003", "q-carbs-004", "q-carbs-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "nutrition-vitamin",
        "name": "维生素",
        "chapter": "单元五 化学与生活",
        "domain": "life",
        "relations": {
            "prerequisite": ["nutrition-intro"],
            "related": ["nutrition-protein", "nutrition-carbs"],
            "experiment": [],
            "question": ["q-vitamin-001", "q-vitamin-002", "q-vitamin-003", "q-vitamin-004", "q-vitamin-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "material-organic",
        "name": "有机化合物",
        "chapter": "单元五 化学与生活",
        "domain": "substance",
        "relations": {
            "prerequisite": ["nutrition-intro"],
            "related": ["material-synthetic"],
            "experiment": [],
            "question": ["q-organic-001", "q-organic-002", "q-organic-003", "q-organic-004", "q-organic-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "material-synthetic",
        "name": "合成材料",
        "chapter": "单元五 化学与生活",
        "domain": "substance",
        "relations": {
            "prerequisite": ["material-organic"],
            "related": ["material-natural", "material-recycle"],
            "experiment": [],
            "question": ["q-synthetic-001", "q-synthetic-002", "q-synthetic-003", "q-synthetic-004", "q-synthetic-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "apply"]
    },
    {
        "id": "material-natural",
        "name": "天然纤维与合成纤维",
        "chapter": "单元五 化学与生活",
        "domain": "material",
        "relations": {
            "prerequisite": ["material-synthetic"],
            "related": ["material-recycle"],
            "experiment": [],
            "question": ["q-fiber-001", "q-fiber-002", "q-fiber-003", "q-fiber-004", "q-fiber-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["remember", "understand"]
    },
    {
        "id": "material-recycle",
        "name": "化学与环境保护",
        "chapter": "单元五 化学与生活",
        "domain": "application",
        "relations": {
            "prerequisite": ["material-synthetic"],
            "related": ["material-natural"],
            "experiment": [],
            "question": ["q-recycle-001", "q-recycle-002", "q-recycle-003", "q-recycle-004", "q-recycle-005"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["understand", "evaluate"]
    },
    {
        "id": "unit5-review",
        "name": "单元五 化学与生活 综合复习",
        "chapter": "单元五 化学与生活",
        "domain": "review",
        "relations": {
            "prerequisite": ["nutrition-intro", "nutrition-protein", "nutrition-carbs", "nutrition-vitamin", "material-organic", "material-synthetic", "material-natural", "material-recycle"],
            "related": [],
            "experiment": [],
            "question": ["q-unit5-001", "q-unit5-002", "q-unit5-003", "q-unit5-004", "q-unit5-005", "q-unit5-006", "q-unit5-007", "q-unit5-008"],
            "commonMistake": ["concept-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
    # ===== 单元六：综合提升 (Day32-Day36) =====
    {
        "id": "exam-review-1",
        "name": "基础概念回顾与巩固",
        "chapter": "单元六 综合提升",
        "domain": "review",
        "relations": {
            "prerequisite": ["acid-intro", "base-intro", "metal-intro", "mass-conservation", "nutrition-intro"],
            "related": ["exam-review-2", "exam-review-3"],
            "experiment": [],
            "question": ["q-final-001", "q-final-002", "q-final-003", "q-final-004", "q-final-005", "q-final-006", "q-final-007", "q-final-008"],
            "commonMistake": ["concept-error", "equation-error"]
        },
        "bloomLevels": ["remember", "understand", "apply"]
    },
    {
        "id": "exam-review-2",
        "name": "实验探究专题",
        "chapter": "单元六 综合提升",
        "domain": "review",
        "relations": {
            "prerequisite": ["exam-review-1"],
            "related": ["exam-review-1", "exam-review-3"],
            "experiment": ["exp-comprehensive-01", "exp-comprehensive-02"],
            "question": ["q-final-e-001", "q-final-e-002", "q-final-e-003", "q-final-e-004", "q-final-e-005", "q-final-e-006", "q-final-e-007", "q-final-e-008"],
            "commonMistake": ["operation-error", "concept-error", "reasoning-error"]
        },
        "bloomLevels": ["analyze", "evaluate", "create"]
    },
    {
        "id": "exam-review-3",
        "name": "化学计算专题",
        "chapter": "单元六 综合提升",
        "domain": "review",
        "relations": {
            "prerequisite": ["exam-review-1"],
            "related": ["exam-review-1", "exam-review-2"],
            "experiment": [],
            "question": ["q-final-c-001", "q-final-c-002", "q-final-c-003", "q-final-c-004", "q-final-c-005", "q-final-c-006", "q-final-c-007", "q-final-c-008"],
            "commonMistake": ["calculation-error", "equation-error", "concept-error"]
        },
        "bloomLevels": ["apply", "analyze", "evaluate"]
    },
    {
        "id": "exam-final",
        "name": "综合诊断测试",
        "chapter": "单元六 综合提升",
        "domain": "assessment",
        "relations": {
            "prerequisite": ["exam-review-1", "exam-review-2", "exam-review-3"],
            "related": [],
            "experiment": [],
            "question": ["q-final-009", "q-final-010", "q-final-011", "q-final-012", "q-final-013", "q-final-014", "q-final-015", "q-final-016", "q-final-017", "q-final-018", "q-final-019", "q-final-020"],
            "commonMistake": ["concept-error", "equation-error", "calculation-error", "operation-error", "reasoning-error"]
        },
        "bloomLevels": ["evaluate", "create"]
    },
]

with open("modules/questions/taxonomy/knowledge-graph.json", "w", encoding="utf-8") as f:
    json.dump({"version": "1.6", "nodes": nodes, "edges": []}, f, ensure_ascii=False, indent=2)

# 统计
total_questions = sum(len(n["relations"]["question"]) for n in nodes)
print(f"Knowledge nodes: {len(nodes)}")
print(f"Total question references: {total_questions}")
print(f"Chapters: 基础模块, 单元一~六")
print(f"Domains: substance, reaction, application, experiment, law, skill, calculation, life, material, review, assessment, fundamentals")

# 验证所有question ID在question-bank中
import os
if os.path.exists("modules/questions/question-bank.json"):
    with open("modules/questions/question-bank.json", "r", encoding="utf-8") as f:
        qb = json.load(f)
    qb_ids = set(q["id"] for q in qb["questions"])
    all_refs = []
    for n in nodes:
        all_refs.extend(n["relations"]["question"])
    missing = [q for q in all_refs if q not in qb_ids]
    if missing:
        print(f"\nWARNING: {len(missing)} question references not in question-bank: {missing[:10]}")
    else:
        print(f"\nAll {len(all_refs)} question references valid in question-bank")