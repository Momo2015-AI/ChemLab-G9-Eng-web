/**
 * Canonical misconception vocabulary — single source of truth.
 *
 * All misconception IDs used across lessons, diagnostics, mastery and
 * practice files must reference one of the ids below.
 *
 * Old short-form IDs (observation-inference, M02-*, M03-*, etc.) are
 * registered as aliases in ALIAS_MAP so legacy data continues to resolve.
 */

export const canonicalMisconceptions = [
  {
    id: 'mc-matter-change-vs-property',
    title: '混淆性质与变化',
    description: '将物质的性质描述（如"可燃性""颜色"）误认为变化过程本身；或将性质的判断等同于变化的发生。',
    knowledgeIds: ['matter-change', 'chemical-property', 'physical-property'],
    signals: ['concept-confusion'],
    severity: 'high',
    source: 'lesson-01 audit',
    remediation: {
      goal: '明确"性质是能力，变化是过程"，能用是否生成新物质判断变化类别。',
      lessonIds: ['lesson-01-material-changes-properties'],
      practiceQuestionIds: ['L01-P12'],
      recheckQuestionIds: ['L01-M06']
    }
  },
  {
    id: 'mc-matter-physical-vs-chemical',
    title: '混淆物理变化与化学变化',
    description: '将物理变化与化学变化等同，或仅凭外观变化（颜色、形态）判断为化学变化。',
    knowledgeIds: ['physical-change', 'chemical-change'],
    signals: ['concept-confusion', 'phenomenon-misread'],
    severity: 'high',
    source: 'lesson-01 audit',
    remediation: {
      goal: '以"是否生成新物质"为判断依据，区分物理变化与化学变化。',
      lessonIds: ['lesson-01-material-changes-properties'],
      practiceQuestionIds: ['L01-P13'],
      recheckQuestionIds: ['L01-M11']
    }
  },
  {
    id: 'mc-method-single-phenomenon-overgeneralization',
    title: '单一现象过度推论',
    description: '仅凭一个现象（气泡、变色等）就断定发生了化学变化或某类反应，忽略了多种可能性。',
    knowledgeIds: ['observation-inference', 'evidence-reasoning'],
    signals: ['phenomenon-misread', 'reasoning-gap'],
    severity: 'high',
    source: 'lesson-01 audit',
    remediation: {
      goal: '理解单一现象只是证据之一，需要多源证据才能得出结论。',
      lessonIds: ['lesson-01-material-changes-properties'],
      practiceQuestionIds: ['L01-D02'],
      recheckQuestionIds: ['L01-M15']
    }
  },
  {
    id: 'mc-method-observation-inference',
    title: '混淆观察与推断',
    description: '将主观解释或结论当作直接观察到的现象，不能区分观察（证据）与推理（解释）。',
    knowledgeIds: ['observation-inference', 'evidence-reasoning', 'scientific-inquiry'],
    signals: ['observation-inference-confusion', 'reasoning-gap'],
    severity: 'high',
    source: 'lesson-01/02 audit',
    remediation: {
      goal: '严格区分"看到了什么"和"由此推导出什么"，建立证据→解释的推理链。',
      lessonIds: ['lesson-01-material-changes-properties', 'lesson-02-chemistry-as-experimental-science'],
      practiceQuestionIds: ['L02-P12'],
      recheckQuestionIds: ['L02-M01']
    }
  },
  {
    id: 'mc-matter-definition-confusion',
    title: '概念定义混淆',
    description: '对物理变化、化学变化、物理性质、化学性质的定义边界认识模糊，导致判断错误。',
    knowledgeIds: ['physical-change', 'chemical-change', 'physical-property', 'chemical-property'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'lesson-01 diagnostic audit',
    remediation: {
      goal: '回顾四概念的定义和区别，用"生成新物质"作为化学变化的判断标准。',
      lessonIds: ['lesson-01-material-changes-properties'],
      practiceQuestionIds: ['L01-D01'],
      recheckQuestionIds: ['L01-M01']
    }
  },
  {
    id: 'mc-matter-property-change-confusion',
    title: '性质与变化的因果混淆',
    description: '将"氧气具有助燃性"（性质）判断为化学变化（变化），或把性质的描述等同于变化过程。',
    knowledgeIds: ['matter-change', 'chemical-property', 'physical-property'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'lesson-01 diagnostic audit',
    remediation: {
      goal: '性质是能力的描述，变化是过程的描述，两者不能等同。',
      lessonIds: ['lesson-01-material-changes-properties'],
      practiceQuestionIds: ['L01-D03'],
      recheckQuestionIds: ['L01-M06']
    }
  },
  {
    id: 'mc-method-control-variable',
    title: '控制变量法使用不当',
    description: '在对照实验中未能正确控制单一变量，或忽略了对照组的设置。',
    knowledgeIds: ['control-variables', 'scientific-inquiry'],
    signals: ['condition-omission', 'reasoning-gap'],
    severity: 'high',
    source: 'lesson-02 audit',
    remediation: {
      goal: '理解对照实验设计原则：单一变量、设置对照组、控制无关变量。',
      lessonIds: ['lesson-02-chemistry-as-experimental-science'],
      practiceQuestionIds: ['L02-P13'],
      recheckQuestionIds: ['L02-M06']
    }
  },
  {
    id: 'mc-method-data-integrity',
    title: '数据完整性与实验可靠性混淆',
    description: '忽视实验数据的完整性要求，或将偶然数据当作可靠结论的依据。',
    knowledgeIds: ['data-integrity', 'scientific-inquiry'],
    signals: ['reasoning-gap', 'phenomenon-misread'],
    severity: 'medium',
    source: 'lesson-02 audit',
    remediation: {
      goal: '理解重复实验和足够样本量对结论可靠性的意义。',
      lessonIds: ['lesson-02-chemistry-as-experimental-science'],
      practiceQuestionIds: ['L02-D02'],
      recheckQuestionIds: ['L02-M08']
    }
  },
  {
    id: 'mc-method-evidence-logic',
    title: '证据与逻辑推理差距',
    description: '证据不足以支持结论，或在推理过程中存在逻辑跳跃。',
    knowledgeIds: ['evidence-reasoning', 'scientific-inquiry'],
    signals: ['reasoning-gap'],
    severity: 'high',
    source: 'lesson-02 audit',
    remediation: {
      goal: '检验每个结论是否有充分的证据支撑，避免逻辑跳跃。',
      lessonIds: ['lesson-02-chemistry-as-experimental-science'],
      practiceQuestionIds: ['L02-D03'],
      recheckQuestionIds: ['L02-M12']
    }
  },
  {
    id: 'mc-acid-safety-dilution',
    title: '浓硫酸稀释操作方向错误',
    description: '将浓硫酸加入水与将水加入浓硫酸的顺序混淆，或忽略搅拌和防护措施。',
    knowledgeIds: ['acid-intro', 'safety-awareness'],
    signals: ['condition-omission', 'reasoning-gap'],
    severity: 'high',
    source: 'lesson-03 audit',
    remediation: {
      goal: '记住"酸入水、沿器壁、慢慢倒、不断搅"的安全操作规范。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-P12'],
      recheckQuestionIds: ['L03-M04']
    }
  },
  {
    id: 'mc-acid-hcl-solution',
    title: '混淆氯化氢与盐酸',
    description: '将HCl（气体）与盐酸（HCl的水溶液）混为一谈，在不同语境下互换使用。',
    knowledgeIds: ['acid-intro'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'day01 benchmark review',
    remediation: {
      goal: '区分气体（HCl）与其水溶液（盐酸），根据语境准确使用名称和化学式。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-P13'],
      recheckQuestionIds: ['L03-M02']
    }
  },
  {
    id: 'mc-acid-metal-overgeneralization',
    title: '酸与金属反应过度泛化',
    description: '认为所有酸与所有金属都生成氢气，忽略金属活动性顺序和酸的氧化性。',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['concept-confusion', 'reasoning-gap'],
    severity: 'medium',
    source: 'day01 benchmark review',
    remediation: {
      goal: '用金属活动性顺序判断酸与金属反应产物，硝酸和浓硫酸不与金属生成氢气。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['q-acid-dx-002'],
      recheckQuestionIds: ['q-acid-rx-002']
    }
  },
  {
    id: 'mc-acid-observation-inference',
    title: '将观察报告为结论',
    description: '在实验报告中将解释性陈述（如"生成氢气"）当作直接观察到的现象。',
    knowledgeIds: ['acid-property', 'observation-inference'],
    signals: ['observation-inference-confusion', 'reasoning-gap'],
    severity: 'medium',
    source: 'day01 benchmark experiment review',
    remediation: {
      goal: '严格区分可观察现象（气泡、颜色变化）与化学解释（生成氢气）。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['q-acid-dx-003'],
      recheckQuestionIds: ['q-acid-rx-003']
    }
  },
  {
    id: 'mc-acid-property',
    title: '酸的通性与个体性质混淆',
    description: '将某种酸的特殊性质（如浓硫酸的脱水性）误认为所有酸的共性。',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['concept-confusion', 'overgeneralization'],
    severity: 'medium',
    source: 'lesson-03 audit',
    remediation: {
      goal: '区分酸的共性（H⁺决定）与不同酸的特殊性质（酸根决定）。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-D01'],
      recheckQuestionIds: ['L03-M01']
    }
  },
  {
    id: 'mc-acid-safety-awareness',
    title: '酸碱实验安全操作意识不足',
    description: '对强酸强碱的腐蚀性和稀释操作的危险性认识不足，缺乏基本安全防护意识。',
    knowledgeIds: ['acid-intro', 'safety-awareness'],
    signals: ['condition-omission'],
    severity: 'high',
    source: 'lesson-03 audit',
    remediation: {
      goal: '掌握酸碱实验基本安全规范：护目镜、手套、酸入水、通风。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-D02'],
      recheckQuestionIds: ['L03-M03']
    }
  },
  {
    id: 'mc-acid-necessary-sufficient',
    title: '充分必要条件混淆',
    description: '将酸的充分条件（如使石蕊变红）误认为是必要条件，或反之。',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['reasoning-gap', 'concept-confusion'],
    severity: 'medium',
    source: 'lesson-03 audit',
    remediation: {
      goal: '理解充分条件与必要条件的区别，建立逻辑推理框架。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-D03'],
      recheckQuestionIds: ['L03-M05']
    }
  },
  {
    id: 'mc-acid-safety-violation',
    title: '违反酸碱实验安全规范',
    description: '在实验操作中忽略必要的安全步骤，如不戴护目镜、直接闻气体等。',
    knowledgeIds: ['safety-awareness', 'acid-intro'],
    signals: ['condition-omission'],
    severity: 'high',
    source: 'lesson-03 diagnostic audit',
    remediation: {
      goal: '复现安全操作规程，通过模拟练习强化安全行为。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-D04'],
      recheckQuestionIds: ['L03-M04']
    }
  },
  {
    id: 'mc-acid-metal-activity',
    title: '金属活动性顺序应用错误',
    description: '错误判断金属与酸或盐溶液的置换反应，忽略金属活动性顺序表。',
    knowledgeIds: ['acid-intro', 'acid-property'],
    signals: ['concept-confusion', 'reasoning-gap'],
    severity: 'medium',
    source: 'lesson-03 diagnostic audit',
    remediation: {
      goal: '熟练运用金属活动性顺序表判断置换反应能否发生及产物。',
      lessonIds: ['lesson-03-acid-intro'],
      practiceQuestionIds: ['L03-D05'],
      recheckQuestionIds: ['L03-M06']
    }
  },
  {
    id: 'mc-lab-sense-safety',
    title: '对未知物质直接闻、尝、摸',
    description: '学生用鼻子凑近容器口闻气体、用手触碰或品尝药品，忽略"不得闻、尝、摸任何化学药品"的基本安全守则。',
    knowledgeIds: ['lab-operations', 'observation-inference', 'safety-awareness'],
    signals: ['condition-omission', 'habit-unsafe'],
    severity: 'high',
    source: 'lesson-04 audit',
    remediation: {
      goal: '掌握"扇闻法"等安全闻味方式，牢记不得闻、尝、摸任何化学药品。',
      lessonIds: ['lesson-04-lab-safety-operations'],
      practiceQuestionIds: ['L04-P01'],
      recheckQuestionIds: ['L04-M02']
    }
  },
  {
    id: 'mc-lab-alcohol-lamp',
    title: '酒精灯使用违规',
    description: '用酒精灯点燃另一只酒精灯、用嘴吹灭酒精灯、向燃着的酒精灯添加酒精，造成酒精溢出着火风险。',
    knowledgeIds: ['lab-operations', 'safety-awareness'],
    signals: ['procedure-mistake', 'condition-omission'],
    severity: 'high',
    source: 'lesson-04 audit',
    remediation: {
      goal: '掌握酒精灯正确点燃（火柴/打火机）、熄灭（灯帽盖灭）与添加酒精的规范。',
      lessonIds: ['lesson-04-lab-safety-operations'],
      practiceQuestionIds: ['L04-P05'],
      recheckQuestionIds: ['L04-M06']
    }
  },
  {
    id: 'mc-lab-heating-safety',
    title: '加热操作违规',
    description: '加热时试管口对着人、未预热直接用外焰加热、用酒精灯内焰或焰心加热，引发液体喷溅或试管破裂。',
    knowledgeIds: ['lab-operations', 'safety-awareness'],
    signals: ['procedure-mistake', 'condition-omission'],
    severity: 'high',
    source: 'lesson-04 audit',
    remediation: {
      goal: '掌握试管加热规范：外焰加热、先预热、试管口不对人、夹持位置正确。',
      lessonIds: ['lesson-04-lab-safety-operations'],
      practiceQuestionIds: ['L04-P07'],
      recheckQuestionIds: ['L04-M09']
    }
  },
  {
    id: 'mc-lab-measurement',
    title: '药品取用与读数错误',
    description: '取用药品过多、用手直接抓取固体药品、量筒俯视或仰视读数，导致实验数据失真。',
    knowledgeIds: ['lab-operations', 'observation-inference', 'evidence-reasoning'],
    signals: ['condition-omission', 'data-error'],
    severity: 'medium',
    source: 'lesson-04 audit',
    remediation: {
      goal: '掌握药品取用"量不宜过多、严格按量取用"原则与量筒正确读数姿势（视线与凹液面最低处相平）。',
      lessonIds: ['lesson-04-lab-safety-operations'],
      practiceQuestionIds: ['L04-P10'],
      recheckQuestionIds: ['L04-M11']
    }
  },
  {
    id: 'mc-o2-composition',
    title: '空气组成与分类误解',
    description: '将空气视为纯净物、误记氧气在空气中的比例过高、混淆氮气与氧气的体积分数。',
    knowledgeIds: ['air-composition', 'physical-change'],
    signals: ['concept-confusion', 'fact-error'],
    severity: 'medium',
    source: 'lesson-05 audit',
    remediation: {
      goal: '准确记忆空气组成体积分数（N₂ 约 78%、O₂ 约 21%），理解空气是混合物。',
      lessonIds: ['lesson-05-oxygen'],
      practiceQuestionIds: ['L05-P01'],
      recheckQuestionIds: ['L05-M01']
    }
  },
  {
    id: 'mc-o2-physical',
    title: '氧气物理性质误解',
    description: '认为氧气有颜色或有气味、认为氧气易溶于水、混淆液态氧的颜色。',
    knowledgeIds: ['oxygen-physical', 'air-composition'],
    signals: ['perception-error', 'concept-confusion'],
    severity: 'medium',
    source: 'lesson-05 audit',
    remediation: {
      goal: '掌握氧气无色无味、不易溶于水、密度比空气略大、液氧淡蓝色的物理性质。',
      lessonIds: ['lesson-05-oxygen'],
      practiceQuestionIds: ['L05-P05'],
      recheckQuestionIds: ['L05-M07']
    }
  },
  {
    id: 'mc-o2-chemical',
    title: '氧气化学性质与氧化反应误解',
    description: '认为氧气具有可燃性、认为氧气能与所有物质反应、将氧化反应等同于燃烧。',
    knowledgeIds: ['oxygen-chemical', 'oxygen-physical', 'chemical-property'],
    signals: ['concept-confusion', 'overgeneralization'],
    severity: 'high',
    source: 'lesson-05 audit',
    remediation: {
      goal: '区分氧气助燃性与可燃性；理解氧化反应是物质与氧发生的反应，不限于燃烧。',
      lessonIds: ['lesson-05-oxygen'],
      practiceQuestionIds: ['L05-P09'],
      recheckQuestionIds: ['L05-M10']
    }
  },
  {
    id: 'mc-o2-preparation',
    title: '氧气实验室制取操作误解',
    description: '实验结束时先熄灭酒精灯后移导管导致水倒吸炸裂试管、试管口朝上倾斜、药品未平铺。',
    knowledgeIds: ['oxygen-preparation', 'lab-operations', 'oxygen-physical'],
    signals: ['procedure-mistake', 'condition-omission'],
    severity: 'high',
    source: 'lesson-05 audit',
    remediation: {
      goal: '掌握"先移导管后熄灯"的操作顺序及科学依据，理解各步骤的安全意义。',
      lessonIds: ['lesson-05-oxygen'],
      practiceQuestionIds: ['L05-P02'],
      recheckQuestionIds: ['L05-M15']
    }
  }
];

/**
 * Alias map: old/variant ID → canonical ID.
 * Used by the alias resolution layer in mastery-policy.js to handle
 * legacy references without breaking existing data.
 */
export const ALIAS_MAP = {
  // L01 short-form IDs
  'observation-inference': 'mc-method-observation-inference',
  'M02-observation-inference': 'mc-method-observation-inference',
  'observation-inference-confusion': 'mc-method-observation-inference',
  'change-vs-property': 'mc-matter-change-vs-property',
  'physical-vs-chemical': 'mc-matter-physical-vs-chemical',
  'single-phenomenon-overgeneralization': 'mc-method-single-phenomenon-overgeneralization',
  'definition-confusion': 'mc-matter-definition-confusion',
  'property-change-confusion': 'mc-matter-property-change-confusion',
  // L02 prefixed IDs
  'M02-control-variable': 'mc-method-control-variable',
  'control-variable-violation': 'mc-method-control-variable',
  'M02-data-integrity': 'mc-method-data-integrity',
  'data-fabrication': 'mc-method-data-integrity',
  'M02-evidence-logic': 'mc-method-evidence-logic',
  'evidence-logic-gap': 'mc-method-evidence-logic',
  // L03 prefixed IDs
  'M03-safety-dilution': 'mc-acid-safety-dilution',
  'M03-acid-distinguish': 'mc-acid-hcl-solution',
  // L03 conceptual IDs
  'acid-property': 'mc-acid-property',
  'safety-awareness': 'mc-acid-safety-awareness',
  'necessary-sufficient-confusion': 'mc-acid-necessary-sufficient',
  'safety-violation': 'mc-acid-safety-violation',
  'metal-activity-mistake': 'mc-acid-metal-activity',
  // Existing mc- IDs (identity映射)
  'mc-acid-metal-overgeneralization': 'mc-acid-metal-overgeneralization',
  'mc-acid-observation-inference': 'mc-acid-observation-inference',
  // L04 lab-safety aliases
  'lab-sense-safety': 'mc-lab-sense-safety',
  'alcohol-lamp': 'mc-lab-alcohol-lamp',
  'heating-safety': 'mc-lab-heating-safety',
  'measurement-safety': 'mc-lab-measurement',
  // L05 oxygen aliases
  'air-composition-mistake': 'mc-o2-composition',
  'o2-physical-mistake': 'mc-o2-physical',
  'o2-chemical-mistake': 'mc-o2-chemical',
  'o2-preparation-mistake': 'mc-o2-preparation'
};

/**
 * Resolve any legacy or canonical ID to its canonical form.
 * Returns the canonical ID if found, otherwise returns the input unchanged.
 */
export function resolveMisconceptionId(id) {
  if (!id) return null;
  const canonical = ALIAS_MAP[id];
  return canonical || id;
}

/**
 * Check whether a given ID is a known alias (not yet canonical).
 */
export function isAlias(id) {
  return id && ALIAS_MAP[id] !== undefined && ALIAS_MAP[id] !== id;
}

/**
 * Get the full canonical misconception object for an ID.
 * Returns null if not found.
 */
export function getCanonicalMisconception(id) {
  const resolved = resolveMisconceptionId(id);
  return canonicalMisconceptions.find(m => m.id === resolved) || null;
}

export default canonicalMisconceptions;
