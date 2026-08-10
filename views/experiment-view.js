/**
 * V1.7 Experiment View — step-by-step lab experience with observation recording.
 */

export function renderExperiment({ root, data = {} } = {}) {
  if (!root) return;
  const { experiment = null, session = null, knowledgeNodes = [] } = data;

  if (!experiment || !session) {
    root.innerHTML = '<section class="page experiment-page"><div class="container"><p class="loading">实验加载中...</p></div></section>';
    return;
  }

  const steps = session.steps || [];
  const currentStep = session.currentStep || 0;
  const total = steps.length;
  const step = steps[currentStep] || {};
  const isLast = currentStep >= total - 1;
  const materials = Array.isArray(experiment.materials) ? experiment.materials : [];
  const safety = Array.isArray(experiment.safety) ? experiment.safety : [];
  const equipment = Array.isArray(experiment.equipment) ? experiment.equipment : [];

  const nodeNames = (experiment.knowledge || []).map(k => {
    const node = knowledgeNodes.find(n => n.id === k);
    return node ? node.name : k;
  }).join('、');

  const stepsHtml = steps.map((st, i) => {
    const done = i < currentStep;
    const current = i === currentStep;
    return `<div class="step ${done ? 'done' : ''} ${current ? 'current' : ''}">
      <div class="step-num">${i + 1}</div>
      <div class="step-content">
        <div class="step-action">${esc(st.action)}</div>
        ${st.observation ? `<div class="step-observation">预期现象: ${esc(st.observation)}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="page experiment-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <div class="exp-header">
          <button class="btn-back" data-action="back">返回</button>
          <h2>${esc(experiment.title || experiment.name || '实验')}</h2>
          <span class="exp-progress">${currentStep + 1}/${total} 步</span>
        </div>
        <div class="exp-body">
          <div class="exp-info">
            <h3>实验目的</h3>
            <p>${esc(nodeNames || experiment.goal || '')}</p>
            ${equipment.length ? `<h3>仪器药品</h3><p>${esc(equipment.join('、'))}</p>` : ''}
            ${materials.length ? `<h3>试剂</h3><p>${esc(materials.join('、'))}</p>` : ''}
            ${experiment.equation ? `<h3>化学方程式</h3><p class="equation">${esc(experiment.equation)}</p>` : ''}
            ${safety.length ? `<h3>安全注意事项</h3><ul class="safety-list">${safety.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="exp-steps">
            <h3>实验步骤</h3>
            ${stepsHtml}
            ${step ? `
              <div class="exp-observe-area">
                <p>请记录观察到的现象:</p>
                <input type="text" class="exp-obs-input" placeholder="描述你观察到的现象..." data-observation />
                <div class="exp-actions">
                  ${!isLast
                    ? `<button class="btn-primary" data-action="observe">下一步</button>`
                    : `<button class="btn-primary" data-action="complete">完成实验</button>`}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

export function renderExperimentResult({ root, data = {} } = {}) {
  if (!root) return;
  const { score = 0, observations = [], totalSteps = 0, onContinue } = data;
  const icon = score >= 80 ? '\u{1F389}' : score >= 50 ? '\u{1F44D}' : '\u{1F4AA}';
  root.innerHTML = `
    <div class="page result-page">
      <div class="container">
        <div class="result-card">
          <div class="result-icon">${icon}</div>
          <h2>实验完成！</h2>
          <div class="result-score">${score}分</div>
          <p>完成 ${observations.length}/${totalSteps} 步观察</p>
          <div class="result-actions">
            <button class="btn-primary" data-action="continue">继续学习</button>
            <button class="btn-secondary" data-action="dashboard">查看学情</button>
          </div>
        </div>
      </div>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
