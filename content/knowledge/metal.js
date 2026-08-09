import { createKnowledge } from './chemistry-g9-schema.js';

export default createKnowledge({
  id: 'knowledge-metal',
  name: '金属活动性',
  category: 'reaction',
  description: '金属活动性顺序、置换反应以及金属与酸反应规律',
  level: 'basic',
  experiments: [
    'exp-metal-acid',
    'exp-metal-reactivity'
  ],
  questions: [],
  errors: [
    '无法判断置换反应',
    '金属活动性顺序混淆'
  ]
});
