import { createKnowledge } from './chemistry-g9-schema.js';

export default createKnowledge({
  id: 'knowledge-oxygen',
  name: '氧气的性质与制取',
  category: 'gas',
  description: '氧气的物理性质、化学性质以及实验室制取方法',
  level: 'basic',
  experiments: [
    'exp-oxygen-properties',
    'exp-oxygen-preparation'
  ],
  questions: [],
  errors: [
    '实验装置连接错误',
    '气体收集方法选择错误'
  ]
});
