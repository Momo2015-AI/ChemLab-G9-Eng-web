/**
 * Day 01 production-bank corrections.
 *
 * These replacements deliberately live outside the 320-question source file so
 * the large legacy JSON is never reconstructed destructively by the connector.
 * ContentLoader removes the affected legacy IDs and appends these reviewed
 * replacements, preserving the published bank cardinality.
 */

export const day01ProductionOverrides = [
  {
    id: 'q-acid-001',
    type: 'choice',
    difficulty: 'easy',
    bloomLevel: 'remember',
    knowledge: ['acid-intro'],
    prompt: '下列物质的分类正确的是',
    options: [
      'A. HCl：酸',
      'B. NaOH：盐',
      'C. NaCl：碱',
      'D. H2O：酸'
    ],
    answer: 'A',
    explanation: 'HCl表示氯化氢，在初中物质分类中属于酸；NaOH属于碱；NaCl属于盐；H2O属于氧化物。注意：盐酸是HCl的水溶液，不应把“氯化氢”和“盐酸”当作完全相同的名称。',
    commonMistake: 'concept-error',
    status: 'review'
  },
  {
    id: 'q-acid-003',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'apply',
    knowledge: ['acid-intro'],
    prompt: '关于浓硫酸稀释的安全判断，最重要的是',
    options: [
      'A. 先判断混合过程可能产生大量热，并严格遵守教师和实验室批准的操作规范',
      'B. 只要液体看起来无色透明，任何混合方式都安全',
      'C. 为了加快反应，可以在没有防护的情况下自行尝试',
      'D. 只要少量使用，就不需要考虑飞溅和腐蚀风险'
    ],
    answer: 'A',
    explanation: '浓硫酸稀释会明显放热，飞溅可能造成腐蚀性伤害。初中学习重点是识别热和飞溅风险，并遵守教师演示及实验室安全规范，不自行尝试危险操作。',
    commonMistake: 'safety-reasoning-error',
    status: 'review'
  },
  {
    id: 'q-acid-004',
    type: 'choice',
    difficulty: 'easy',
    bloomLevel: 'understand',
    knowledge: ['acid-intro'],
    prompt: '浓硫酸不慎接触皮肤时，首先应采取哪一类安全措施？',
    options: [
      'A. 立即用大量流动清水持续冲洗，并按实验室应急规范处理',
      'B. 先自行寻找另一种化学品进行中和',
      'C. 先等待疼痛消失再处理',
      'D. 用纸巾擦干后继续实验'
    ],
    answer: 'A',
    explanation: '腐蚀性化学品接触皮肤时，初中阶段应重点掌握立即用大量流动清水冲洗并报告教师、遵循实验室应急规范。不要自行配制或选择中和剂进行处理。',
    commonMistake: 'safety-reasoning-error',
    status: 'review'
  },
  {
    id: 'q-acid-005',
    type: 'choice',
    difficulty: 'medium',
    bloomLevel: 'analyze',
    knowledge: ['acid-intro'],
    prompt: '下列各组物质在水溶液中能大量共存，且溶液呈无色透明的是',
    options: [
      'A. NaCl、AgNO3、HNO3',
      'B. Na2CO3、HCl、NaNO3',
      'C. KNO3、NaCl、Na2SO4',
      'D. CuSO4、KCl、HCl'
    ],
    answer: 'C',
    explanation: 'A中NaCl与AgNO3会生成AgCl沉淀；B中Na2CO3与HCl会反应；D中CuSO4使溶液呈蓝色。C中的三种物质在该条件下可大量共存且均为无色溶液，因此选C。',
    commonMistake: 'coexistence-reasoning-error',
    status: 'review'
  },
  {
    id: 'q-acid-011',
    type: 'fill',
    difficulty: 'medium',
    bloomLevel: 'apply',
    knowledge: ['acid-property'],
    prompt: '在初中阶段可用Fe2O3作为铁锈组成的简化模型。稀硫酸与Fe2O3反应：Fe2O3+3H2SO4=______+3H2O，此反应可用于____________________。',
    answer: 'Fe2(SO4)3；除铁锈',
    explanation: '初中化学常用Fe2O3作为铁锈主要成分的简化模型。它与硫酸反应生成硫酸铁和水，可用于解释酸除铁锈。真实铁锈通常是成分复杂的混合物，不能简单等同于纯Fe2O3。',
    commonMistake: 'model-overgeneralization',
    status: 'review'
  },
  {
    id: 'q-acid-012',
    type: 'choice',
    difficulty: 'hard',
    bloomLevel: 'analyze',
    knowledge: ['acid-property'],
    prompt: '在一个密闭、刚性且温度保持近似不变的装置中，向含有适量稀盐酸的锥形瓶加入碳酸钙，瓶内气体体积保持不变。若反应过程中CO2生成速率逐渐降低，压强的主要变化趋势是',
    options: [
      'A. 持续增大，直到反应物耗尽后保持基本不变',
      'B. 先增大后减小',
      'C. 先减小后增大',
      'D. 始终不变'
    ],
    answer: 'A',
    explanation: '在刚性密闭容器且温度近似不变的条件下，反应生成CO2会使气体物质的量增加，因此压强随反应进行而增大；生成速率降低只表示压强增加得越来越慢，并不意味着压强必然下降。反应结束后，若条件保持不变，压强趋于稳定。',
    commonMistake: 'pressure-trend-reasoning-error',
    status: 'review'
  }
];

export const day01ProductionOverrideIds = new Set(
  day01ProductionOverrides.map(question => question.id)
);

export default day01ProductionOverrides;
