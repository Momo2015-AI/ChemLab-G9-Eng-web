// ChemLab LAB Engine V1
// Browser experiment renderer

export function renderExperiment(experiment, targetId) {
  const sections = {
    title: experiment.title,
    objective: experiment.objective,
    equipment: experiment.equipment || [],
    steps: experiment.steps || [],
    observation: experiment.observation || [],
    equation: experiment.equation || '',
    safety: experiment.safety || []
  };

  if (!targetId || typeof document === 'undefined') {
    return sections;
  }

  const root = document.getElementById(targetId);
  if (!root) return sections;

  root.innerHTML = `
    <div class="section"><h2>${sections.title}</h2><p>${sections.objective}</p></div>
    <div class="section"><h3>实验仪器</h3><p>${sections.equipment.join('、')}</p></div>
    <div class="section"><h3>实验步骤</h3>${sections.steps.map((s,i)=>`<div class="step">${i+1}. ${s}</div>`).join('')}</div>
    <div class="section"><h3>实验现象</h3><p>${sections.observation}</p></div>
    <div class="section"><h3>化学方程式</h3><p>${sections.equation}</p></div>
    <div class="section"><h3>安全注意事项</h3><p>${sections.safety}</p></div>
  `;

  return sections;
}

export function createSection(title, content) {
  return { title, content };
}
