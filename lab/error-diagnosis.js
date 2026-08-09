// ChemLab LAB Engine V1.6
// Experiment operation error diagnosis foundation

const diagnosisRules = [
  {
    keyword: '加热',
    message: '请确认实验装置连接正确后再开始加热。',
    knowledge: '实验基本操作'
  },
  {
    keyword: '导管',
    message: '注意实验结束时的操作顺序，避免液体倒吸。',
    knowledge: '实验安全'
  }
];

export function diagnoseExperimentError(action) {
  const result = diagnosisRules.find(rule =>
    action.includes(rule.keyword)
  );

  return result || {
    message: '未识别该操作错误，请重新检查实验步骤。',
    knowledge: '实验规范'
  };
}
