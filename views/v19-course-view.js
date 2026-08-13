/** V2.3 Course View — complete learning-flow presentation. */
export function renderV19Course({ root, lesson = {}, guidedLearning = null, progress = false, onStartQuiz, onStartMastery, onStartExperiment, onComplete, onBack } = {}) {
  if (!root) return;
  const points = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const experiments = Array.isArray(lesson.experiments) ? lesson.experiments : [];
  const diagnostics = Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [];
  const steps = Array.isArray(guidedLearning?.steps) ? guidedLearning.steps : [];
  const mastery = lesson.mastery || {};

  root.innerHTML = `
    <section class="page course-page v21-course">
      <div class="course-hero-card">
        <div class="course-hero-top">
          <button class="course-back" type="button" data-back>← 学习中心</button>
          <span class="course-status ${progress ? 'done' : ''}">${progress ? '✓ 已完成' : '● 学习中'}</span>
        </div>
        <div class="course-hero-main">
          <div><div class="course-kicker">第 ${escapeHtml(lesson.day || lesson.sequenceNumber || '')} 课 · ${escapeHtml(lesson.duration || '')}</div><h1>${escapeHtml(lesson.title || lesson.id || '课程')}</h1><p>${escapeHtml(lesson.summary || lesson.description || '')}</p></div>
          <div class="course-hero-icon" aria-hidden="true">⚗</div>
        </div>
        <div class="course-flow" aria-label="完整学习流程"><span class="active">① 学习</span><i>→</i><span>② 实验</span><i>→</i><span>③ 练习</span><i>→</i><span>④ 诊断</span><i>→</i><span>⑤ 补救</span><i>→</i><span>⑥ 95%掌握</span></div>
      </div>

      <section class="course-section-block lesson-goal-block">
        <div class="course-section-heading"><div><span class="section-eyebrow">学习目标</span><h2>本节课要掌握什么？</h2></div><span class="section-count">${points.length} 个知识点</span></div>
        <div class="knowledge-card-grid">${points.length ? points.map((id, i) => `<article class="knowledge-card-v21"><span class="knowledge-index">${String(i + 1).padStart(2,'0')}</span><div><strong>${escapeHtml(formatKnowledgePoint(id))}</strong><small>本课重点</small></div></article>`).join('') : '<div class="empty-card">本课暂无独立知识点配置。</div>'}</div>
      </section>

      ${steps.length ? `<section class="course-section-block lesson-content-block" id="guided-learning"><div class="course-section-heading"><div><span class="section-eyebrow">第一阶段 · 核心学习</span><h2>一步一步学</h2><p class="section-description">先理解，再练习；每一步都包含知识讲解与即时检查。</p></div><span class="section-count">${steps.length} 步</span></div><div class="guided-learning-cards">${steps.map((step, i) => renderGuidedCard(step, i)).join('')}</div></section>` : ''}

      ${experiments.length ? `<section class="course-section-block" id="experiment-section"><div class="course-section-heading"><div><span class="section-eyebrow">第二阶段 · 实验探究</span><h2>观察 → 证据 → 结论</h2><p class="section-description">把刚学的概念放进实验情境中，训练科学判断。</p></div><span class="section-count">${experiments.length} 个实验</span></div><div class="course-resource-card"><div><strong>${escapeHtml(experiments[0].title || '实验探究')}</strong><p>${escapeHtml(experiments[0].purpose || '观察现象、记录证据并形成结论。')}</p></div><button class="course-action primary inline-action" type="button" data-experiment>进入实验 →</button></div></section>` : ''}

      <section class="course-section-block" id="practice-section"><div class="course-section-heading"><div><span class="section-eyebrow">第三阶段 · 基础练习</span><h2>练习：检查是否真正理解</h2><p class="section-description">先完成基础题，再进入诊断与补救。</p></div><span class="section-count">${Array.isArray(lesson.questions) ? lesson.questions.length : 0} 题</span></div><div class="course-resource-card"><div><strong>基础练习</strong><p>覆盖本课核心概念、辨析和证据推理。</p></div><button class="course-action primary inline-action" type="button" data-quiz>开始练习 →</button></div></section>

      ${diagnostics.length ? `<section class="course-section-block" id="diagnostic-section"><div class="course-section-heading"><div><span class="section-eyebrow">第四阶段 · 诊断</span><h2>诊断：找到不会的地方</h2><p class="section-description">错题不是结束，而是定位知识漏洞；系统会把你带回对应学习步骤。</p></div><span class="section-count">${diagnostics.length} 个检查点</span></div><div class="diagnostic-flow"><span>答题</span><b>→</b><span>定位知识点</span><b>→</b><span>识别错误类型</span><b>→</b><span>进入补救</span></div></section>` : ''}

      <section class="course-section-block" id="mastery-section"><div class="course-section-heading"><div><span class="section-eyebrow">第五阶段 · 最终掌握</span><h2>95% Mastery</h2><p class="section-description">使用未直接见过的变式与陌生情境检验迁移能力。</p></div><span class="section-count">${Number(mastery.questionCount || 20)} 题 · ≥${Math.round(Number(mastery.threshold || .95) * 100)}%</span></div><div class="mastery-gate-card"><div><strong>真正掌握的标准</strong><p>${escapeHtml(mastery.description || '20题至少答对19题，才算本课掌握。')}</p></div><button class="course-action primary inline-action" type="button" data-mastery>开始 Mastery →</button></div></section>

      ${!progress ? `<div class="course-completion-bar"><button class="course-action quiet" type="button" data-complete><span class="action-icon">✓</span><span><strong>完成学习记录</strong><small>仅在完成本课流程后使用</small></span></button></div>` : ''}
    </section>`;

  root.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  root.querySelector('[data-guided]')?.addEventListener('click', () => document.querySelector('#guided-learning')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  root.querySelector('[data-quiz]')?.addEventListener('click', () => onStartQuiz?.());
  root.querySelector('[data-mastery]')?.addEventListener('click', () => onStartMastery?.());
  root.querySelector('[data-experiment]')?.addEventListener('click', () => onStartExperiment?.(experiments[0]?.id || experiments[0]));
  root.querySelector('[data-complete]')?.addEventListener('click', () => onComplete?.());
}

const KNOWLEDGE_LABELS = {
  'matter-change':'物质的变化','physical-change':'物理变化','chemical-change':'化学变化','physical-property':'物理性质','chemical-property':'化学性质','observation-inference':'观察与推理','evidence-reasoning':'证据与结论'
};
function formatKnowledgePoint(id) { return KNOWLEDGE_LABELS[id] || id; }

function renderGuidedCard(step, index) {
  const body = Array.isArray(step.body) ? step.body : [step.body];
  const check = step.check;
  const hasDetail = body.some(Boolean) || Boolean(check);
  const label = step.type === 'concept' ? '核心概念' : step.type === 'reasoning' ? '判断方法' : step.type === 'transfer' ? '迁移检查' : step.type === 'compare' ? '综合辨析' : '引导学习';
  return `<article class="guided-learning-card ${hasDetail ? '' : 'compact'}"><button class="guided-card-header" type="button" aria-expanded="false"><span class="guided-card-index">${String(index + 1).padStart(2,'0')}</span><span class="guided-card-main"><span class="guided-card-label">第 ${index + 1} 步 · ${label}</span><strong>${escapeHtml(step.title || '')}</strong><small>点击展开完整讲解与检查</small></span><span class="guided-card-toggle" aria-hidden="true">＋</span></button><div class="guided-card-detail" hidden><div class="guided-step-body">${body.filter(Boolean).map(text => `<p>${escapeHtml(text)}</p>`).join('')}</div>${check ? renderCheck(check, index) : ''}</div></article>`;
}
function renderCheck(check, index) {
  const options = Array.isArray(check.options) ? check.options : [];
  return `<div class="guided-check" data-answer="${Number.isInteger(check.answer) ? check.answer : ''}" data-explanation="${escapeHtml(check.explanation || '请回到本步骤的讲解，找出支持答案的证据。')}"><div class="guided-check-title">马上检查一下</div><p class="guided-question">${escapeHtml(check.question || '')}</p>${options.length ? `<div class="guided-options">${options.map((option, i) => `<label><input type="radio" name="guided-check-${index}" value="${i}"><span>${String.fromCharCode(65 + i)}. ${escapeHtml(option)}</span></label>`).join('')}</div>` : ''}<button type="button" class="guided-submit">提交答案</button><div class="guided-result" hidden></div></div>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

if (typeof document !== 'undefined') document.addEventListener('click', event => {
  const header = event.target.closest('.guided-card-header');
  if (header) { const card = header.closest('.guided-learning-card'); const detail = card?.querySelector('.guided-card-detail'); if (!detail) return; const open = !detail.hidden; detail.hidden = open; header.setAttribute('aria-expanded', String(!open)); const toggle = header.querySelector('.guided-card-toggle'); if (toggle) toggle.textContent = open ? '＋' : '−'; return; }
  const submit = event.target.closest('.guided-submit');
  if (submit) { const check = submit.closest('.guided-check'); const selected = check?.querySelector('input[type="radio"]:checked'); const result = check?.querySelector('.guided-result'); if (!selected || !result) return; const expected = Number.parseInt(check.dataset.answer, 10); const correct = Number.parseInt(selected.value, 10) === expected; result.hidden = false; result.textContent = correct ? `✓ 回答正确。${check.dataset.explanation}` : `再想一想。${check.dataset.explanation}`; result.className = `guided-result ${correct ? 'correct' : 'retry'}`; }
});
