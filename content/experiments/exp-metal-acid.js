import { createExperiment } from './schema.js';

export default createExperiment({
  id: 'exp-metal-acid',
  title: '金属与酸的反应',
  day: 'Day03',
  category: 'metal-properties',
  objective: [
    '认识金属与酸反应的规律',
    '观察实验现象并总结结论'
  ],
  materials: ['铁片', '锌粒', '稀盐酸'],
  instruments: ['试管', '镊子'],
  steps: [
    '加入金属样品',
    '滴加稀盐酸',
    '观察反应现象'
  ],
  observations: [
    '产生气泡',
    '不同金属反应速率不同'
  ],
  conclusion: '金属活动性不同，与酸反应能力不同。',
  safety: [
    '规范使用酸性试剂'
  ],
  assessment: {
    operation: 90,
    observation: 95,
    conclusion: 90
  }
});
