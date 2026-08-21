/**
 * Canonical misconception vocabulary — single source of truth.
 *
 * All misconception IDs used across lessons, diagnostics, mastery and
 * practice files must reference one of the ids below.
 *
 * Old short-form IDs (observation-inference, M02-*, M03-*, etc.) are
 * registered as aliases in ALIAS_MAP so legacy data continues to resolve.
 */

export const canonicalMisconceptionsBase = [
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
  },
  {
    id: 'mc-particle-physical',
    title: '将宏观物质性质等同于微观粒子性质',
    description: '认为分子、原子等微观粒子具有与宏观物质相同的颜色、气味、状态等性质，或将粒子本身等同于可见的固体颗粒。',
    knowledgeIds: ['particle-model'],
    signals: ['scale-confusion', 'macro-micro-mix'],
    severity: 'high',
    source: 'knowledge-graph v2.1 u03 extension',
    remediation: {
      goal: '理解微观粒子是模型概念，不能直接用宏观感官属性描述。',
      lessonIds: ['lesson-06-molecules-and-atoms'],
      practiceQuestionIds: ['L11-P01'],
      recheckQuestionIds: ['L11-M01']
    }
  },
  {
    id: 'mc-molecule-atom-distinction',
    title: '混淆分子与原子的本质区别',
    description: '认为分子和原子没有本质区别，或认为分子比原子"大"、原子比分子"小"是唯一区别；误认为化学变化中原子还能够继续分裂，而不理解"分子在化学变化中可分、原子在化学变化中不可分"这一判据。',
    knowledgeIds: ['particle-model'],
    signals: ['concept-confusion', 'macro-micro-mix'],
    severity: 'high',
    source: 'lesson-06 authoring',
    remediation: {
      goal: '能用"化学变化中是否可分"区分分子与原子：分子是保持物质化学性质的最小粒子，在化学变化中可分裂为原子；原子是化学变化中的最小粒子，在化学变化范围内不能再分。',
      lessonIds: ['lesson-06-molecules-and-atoms'],
      practiceQuestionIds: ['L11-P05'],
      recheckQuestionIds: ['L11-M08']
    }
  },
  {
    id: 'mc-atom-electron-loss',
    title: '认为原子失去电子后质子数改变',
    description: '误认为原子失电子变成离子时，原子核内的质子数也发生变化，从而改变元素种类。',
    knowledgeIds: ['atomic-structure'],
    signals: ['structural-confusion'],
    severity: 'high',
    source: 'knowledge-graph v2.1 u03 extension',
    remediation: {
      goal: '明确电子转移只改变电荷，质子数不变，元素种类不变。',
      lessonIds: [],
      practiceQuestionIds: [],
      recheckQuestionIds: []
    }
  },
  {
    id: 'mc-ion-only-metal',
    title: '认为只有金属能形成离子',
    description: '误认为阴离子（如O²⁻、Cl⁻）不存在或不属于离子，认为离子只指金属阳离子。',
    knowledgeIds: ['ion-bond'],
    signals: ['concept-narrowing'],
    severity: 'medium',
    source: 'knowledge-graph v2.1 u03 extension',
    remediation: {
      goal: '理解阴阳离子均可通过电子转移形成，非金属原子也能得电子形成阴离子。',
      lessonIds: [],
      practiceQuestionIds: [],
      recheckQuestionIds: []
    }
  },
  {
    id: 'mc-mixture-pure',
    title: '将均一稳定的混合物误认为纯净物',
    description: '认为溶液（如食盐水）是纯净物，因为外观均一透明；或用"看起来干净"判断纯净物。',
    knowledgeIds: ['element-classify'],
    signals: ['visual-overgeneralization'],
    severity: 'medium',
    source: 'knowledge-graph v2.1 u03 extension',
    remediation: {
      goal: '以是否由同种物质组成判断纯净物，均一透明不是纯净物的充分条件。',
      lessonIds: [],
      practiceQuestionIds: [],
      recheckQuestionIds: []
    }
  },
  {
    id: 'mc-atomic-solid-ball',
    title: '误认为原子是实心小球，内部没有空隙',
    description: '对原子的直观想象是一个实心的、不可再分的小球，不理解原子内部绝大部分是空的、原子核只占极小体积，以及"化学变化中原子不可再分"的限定条件已被混淆为"原子绝对不可再分"。',
    knowledgeIds: ['atomic-structure'],
    signals: ['intuitive-overgeneralization', 'over-extended-definition'],
    severity: 'high',
    source: 'lesson-11 atomic-structure production',
    remediation: {
      goal: '用原子核式模型（足球场与绿豆类比）建立原子内部大部分是空的直观认识，区分"化学变化中不可再分"与"原子内部仍有结构"两句话的适用范围。',
      lessonIds: ['lesson-11-atomic-structure'],
      practiceQuestionIds: [],
      recheckQuestionIds: ['L14-T02']
    }
  },
  {
    id: 'mc-atomic-charge-neutrality',
    title: '误认为原子不带电是因为内部没有电荷',
    description: '把"原子不显电性"错误地理解为原子内部不存在任何电荷，而非"质子所带正电荷总数与电子所带负电荷总数相等、相互抵消"的结果。',
    knowledgeIds: ['atomic-structure'],
    signals: ['reasoning-skip', 'concept-confusion'],
    severity: 'high',
    source: 'lesson-11 atomic-structure production',
    remediation: {
      goal: '理解原子不显电性的真正原因是正负电荷总数相等相互抵消，而非内部没有电荷；同时明确质子数决定元素种类、得失电子只改变核外电子数。',
      lessonIds: ['lesson-11-atomic-structure'],
      practiceQuestionIds: [],
      recheckQuestionIds: ['L14-T01']
    }
  },
  {
    id: 'mc-relative-atomic-mass',
    title: '混淆相对原子质量与原子实际质量',
    description: '把相对原子质量当作原子的实际质量，给它加上"克"等质量单位；或认为相对原子质量就是质子数。',
    knowledgeIds: ['atomic-structure'],
    signals: ['unit-confusion', 'definition-confusion'],
    severity: 'medium',
    source: 'lesson-11 atomic-structure production',
    remediation: {
      goal: '明确相对原子质量是以碳-12原子质量的1/12为基准得到的比值，单位为1（省略），数值约等于质子数加中子数，不是原子的实际质量。',
      lessonIds: ['lesson-11-atomic-structure'],
      practiceQuestionIds: [],
      recheckQuestionIds: ['L14-T03']
    }
  }
];

/**
 * The following entries backfill misconception IDs that were referenced by
 * the u04 (water / chemical-formula / chemical-equation) lesson batch but
 * never registered here — discovered via a full-repo reference audit.
 * knowledgeIds map to the closest existing knowledge-graph node; u04/u05
 * do not yet have their own dedicated graph nodes (water-purification,
 * chemical-formula, valence, law-conservation, etc.) — that is a separate,
 * larger follow-up (see docs/CONTENT-DEV-STANDARD.md反引用完整性 section).
 */
const u04BackfillMisconceptions = [
  {
    id: 'mc-water-electrolysis-polarity',
    title: '混淆电解水实验中正负极产生的气体',
    description: '不清楚电解水时与电源正极相连的玻璃管产生氧气（较少）、与负极相连的玻璃管产生氢气（较多），或记反正负极对应的气体。',
    knowledgeIds: ['electrolysis-experiment'],
    signals: ['fact-recall-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '记住电解水“正氧负氢，氢二氧一”的体积关系与正负极对应关系。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-water-composition',
    title: '对水的组成认识不准确',
    description: '误认为水是由氢气和氧气直接混合而成，而不理解水是由氢、氧两种元素组成的化合物，电解水是化学变化而非物理混合的逆过程。',
    knowledgeIds: ['water-composition'],
    signals: ['concept-confusion'],
    severity: 'high',
    source: 'u04 backfill audit',
    remediation: { goal: '理解水是氢、氧两种元素组成的化合物，电解水是化学变化。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-single-compound-distinguish',
    title: '混淆单质与化合物',
    description: '不能根据“由一种元素组成”还是“由不同种元素组成”正确区分单质与化合物，容易将纯净物笼统等同于单质。',
    knowledgeIds: ['single-substance-compound'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '用“组成元素种类”作为判据区分单质与化合物。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-element-misunderstanding',
    title: '元素概念理解偏差',
    description: '误认为元素是指具体的原子个数或分子，而不理解元素是“质子数相同的一类原子的总称”，且元素只讲种类、不讲个数。',
    knowledgeIds: ['element-concept'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '理解元素是质子数相同的一类原子的总称，描述物质组成时只讲元素种类。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-hydrogen-burn',
    title: '氢气燃烧性质描述错误',
    description: '误认为氢气燃烧现象与其他常见气体相同，或不清楚氢气燃烧前需要验纯、纯净氢气安静燃烧产生淡蓝色火焰并生成水。',
    knowledgeIds: ['hydrogen-property'],
    signals: ['fact-recall-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '记住氢气燃烧前必须验纯，纯净氢气安静燃烧、产生淡蓝色火焰、生成水。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-filtration-operation',
    title: '过滤操作规范掌握不准确',
    description: '不熟悉过滤操作“一贴二低三靠”的规范要点，例如滤纸未紧贴漏斗、液面高于滤纸边缘、玻璃棒引流角度不对等。',
    knowledgeIds: ['lab-operations'],
    signals: ['operational-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '掌握过滤操作“一贴二低三靠”的规范要点。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-hard-soft-distinguish',
    title: '硬水与软水的区分方法掌握不准确',
    description: '不知道可以用肥皂水检验硬水软水（泡沫少、浮渣多的是硬水），或误认为硬水与软水可以凭肉眼直接分辨。',
    knowledgeIds: ['water-composition'],
    signals: ['method-gap'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '掌握用肥皂水检验硬水、软水的方法。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-purification-level',
    title: '误认为某净化方法能使硬水彻底软化',
    description: '误认为过滤、吸附等常规净化方法能把硬水变为软水，而不理解硬水软化通常需要蒸馏等更高级的净化方式。',
    knowledgeIds: ['water-composition'],
    signals: ['concept-overreach'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '理解过滤、吸附不能软化硬水，蒸馏等方法才能有效降低水的硬度。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-purification-complete',
    title: '误认为净化后的水就是纯净物',
    description: '误认为经过过滤、吸附等常规净化步骤后得到的水已经是纯净水，忽视了这些方法只能除去部分杂质，净化后的水仍是混合物。',
    knowledgeIds: ['water-composition'],
    signals: ['concept-overreach'],
    severity: 'high',
    source: 'u04 backfill audit',
    remediation: { goal: '理解常规净化方法得到的水仍是混合物，只有蒸馏水才接近纯净物。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-purification-physical-chemical',
    title: '混淆净化过程中的物理变化与化学变化',
    description: '误认为过滤、吸附、蒸馏等净化步骤都是化学变化，而不理解它们都属于物理变化（没有生成新物质），只有加药剂杀菌消毒等步骤才可能涉及化学变化。',
    knowledgeIds: ['physical-change'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '区分净化步骤中的物理变化（过滤、吸附、蒸馏）与化学变化（消毒杀菌）。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-adsorption-limit',
    title: '夸大或误解活性炭的吸附能力',
    description: '误认为活性炭能吸附水中所有杂质（包括可溶性盐类）、或误认为活性炭吸附是化学变化，而不理解活性炭吸附主要针对色素和异味物质，且吸附是物理过程。',
    knowledgeIds: ['physical-change'],
    signals: ['concept-overreach'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '理解活性炭吸附是物理变化，主要用于除去色素和异味，不能除去可溶性杂质。', lessonIds: ['lesson-07-water-purification'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-water-resource-stat',
    title: '对水资源现状的认识存在偏差',
    description: '误认为地球上水资源总量丰富就等于淡水资源充足，忽视了淡水（尤其是可直接利用的淡水）在地球总水量中占比很小这一事实。',
    knowledgeIds: ['water-composition'],
    signals: ['concept-overreach'],
    severity: 'low',
    source: 'u04 backfill audit',
    remediation: { goal: '理解地球淡水资源、尤其是可直接利用的淡水资源十分有限。', lessonIds: ['lesson-08-water-conservation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-water-pollution',
    title: '对造成水污染的行为判断不准确',
    description: '不能准确识别哪些日常行为会造成水体污染（如随意排放生活污水、过量使用化肥农药），或误认为只有工业排放才算污染。',
    knowledgeIds: ['water-composition'],
    signals: ['fact-recall-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '识别生活污水、农业面源污染等多种水污染来源，不局限于工业排放。', lessonIds: ['lesson-08-water-conservation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-formula-meaning',
    title: '化学式意义理解不完整',
    description: '只能说出化学式表示某种物质，遗漏了化学式同时表示的其他层面含义（该物质由哪些元素组成、一个分子的构成、元素质量比等）。',
    knowledgeIds: ['element-concept'],
    signals: ['incomplete-understanding'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '从宏观（物质、组成元素）和微观（分子、原子个数）两方面完整表述化学式的意义。', lessonIds: ['lesson-09-chemical-formula'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-formula-writing',
    title: '化学式书写不规范',
    description: '书写化学式时不遵循“正价元素在前、负价元素在后”的一般顺序，或不能根据化合价代数和为零的规则正确配平各元素的原子个数。',
    knowledgeIds: ['element-concept'],
    signals: ['operational-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '掌握化学式书写顺序，能根据化合价代数和为零推出正确的原子个数比。', lessonIds: ['lesson-09-chemical-formula'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-valence-calculation',
    title: '化合价代数和计算错误',
    description: '在计算化合物中某元素化合价时，代数和计算出错，或忽略了化合物中正负化合价代数和必须为零这一基本规则。',
    knowledgeIds: ['element-concept'],
    signals: ['calculation-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '牢记化合物中各元素化合价代数和为零，据此正确计算未知元素的化合价。', lessonIds: ['lesson-09-chemical-formula'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-valence-multiple',
    title: '不理解同一元素在不同化合物中可有多种化合价',
    description: '误认为某种元素在所有化合物中只有一个固定的化合价，而不理解像铁、锰、氮等元素在不同化合物中可以显示不同的化合价。',
    knowledgeIds: ['element-concept'],
    signals: ['concept-overreach'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '理解同一元素在不同化合物中可以有不同的化合价，需要具体化合物具体计算。', lessonIds: ['lesson-09-chemical-formula'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-valence-confusion',
    title: '混淆化合价与元素的其他属性',
    description: '将化合价与原子的核外电子数、离子所带电荷数等概念混为一谈，或误认为化合价是元素固定不变的物理属性。',
    knowledgeIds: ['element-concept'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '明确化合价是元素在化合物中表现出的一种性质，与最外层电子数相关但不完全等同于电子数或离子电荷数。', lessonIds: ['lesson-09-chemical-formula'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-relative-mass-calc',
    title: '相对分子质量计算错误',
    description: '计算相对分子质量时未按化学式中各原子个数正确加和相对原子质量，或漏乘下标数字。',
    knowledgeIds: ['element-concept'],
    signals: ['calculation-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '按化学式中各元素的原子个数，逐项乘以相对原子质量后相加，得到相对分子质量。', lessonIds: ['lesson-10-chemical-equation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-mass-fraction',
    title: '元素质量分数计算错误',
    description: '计算化合物中某元素质量分数时，公式使用错误（例如误用原子个数比代替质量比），或计算过程中相对分子质量算错导致结果错误。',
    knowledgeIds: ['element-concept'],
    signals: ['calculation-error'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '掌握元素质量分数=（该元素相对原子质量×原子个数）÷相对分子质量×100%的正确计算方法。', lessonIds: ['lesson-10-chemical-equation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-law-conservation',
    title: '质量守恒定律理解不准确',
    description: '误认为化学反应中质量守恒只适用于固体反应物，或不理解质量守恒的微观原因是反应前后原子的种类、数目、质量都不变，只是重新组合。',
    knowledgeIds: ['chemical-change'],
    signals: ['concept-confusion'],
    severity: 'high',
    source: 'u04 backfill audit',
    remediation: { goal: '理解质量守恒定律对任何化学反应都成立，其微观原因是反应前后原子种类、数目、质量都不变。', lessonIds: ['lesson-10-chemical-equation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-physical-chemical-distinguish',
    title: '质量变化情境下混淆物理变化与化学变化',
    description: '看到反应后固体质量增加或减少，就直接判断是否符合质量守恒定律，而不先判断该变化是否为化学变化、是否有敞口体系中气体参与等前提条件。',
    knowledgeIds: ['physical-change'],
    signals: ['concept-confusion'],
    severity: 'medium',
    source: 'u04 backfill audit',
    remediation: { goal: '应用质量守恒定律前，先确认是化学变化，并考虑敞口体系中气体是否参与反应。', lessonIds: ['lesson-10-chemical-equation'], practiceQuestionIds: [], recheckQuestionIds: [] }
  },
  {
    id: 'mc-element-pure-substance',
    title: '混淆“元素”与“单质”两个概念',
    description: '把“元素”和“单质”当成同一个概念混用，例如把“氧元素”和“氧气（单质）”混为一谈；元素是同类原子的总称、只讲种类不讲个数，单质是由同种元素组成的纯净物、可以称量和参与反应。',
    knowledgeIds: ['element-concept'],
    signals: ['concept-confusion'],
    severity: 'high',
    source: 'u04 backfill audit',
    remediation: { goal: '区分“元素”（同类原子的总称，描述组成）与“单质”（由同种元素组成的纯净物，是具体物质）。', lessonIds: ['lesson-06-water-composition'], practiceQuestionIds: [], recheckQuestionIds: [] }
  }
];

const canonicalMisconceptionsFull = [
  ...canonicalMisconceptionsBase,
  ...u04BackfillMisconceptions
];

export const canonicalMisconceptions = canonicalMisconceptionsFull;

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
  'o2-preparation-mistake': 'mc-o2-preparation',
  // L06 molecules-and-atoms aliases
  'particle-physical-mistake': 'mc-particle-physical',
  'molecule-atom-confusion': 'mc-molecule-atom-distinction',
  'atom-electron-loss': 'mc-atom-electron-loss',
  'ion-only-metal': 'mc-ion-only-metal',
  'mixture-pure': 'mc-mixture-pure',
  // L11 atomic-structure misconceptions
  'atomic-solid-ball': 'mc-atomic-solid-ball',
  'atomic-charge-neutrality': 'mc-atomic-charge-neutrality',
  'relative-atomic-mass': 'mc-relative-atomic-mass'
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
