/** V2.2 Course View — low-density overview plus real guided learning. */
export function renderV19Course({ root, lesson = {}, guidedLearning = null, progress = false, onStartQuiz, onStartExperiment, onComplete, onBack } = {}) {
  if (!root) return;
  const points = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const experiments = Array.isArray(lesson.experiments) ? lesson.experiments : [];
  const diagnostics = Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [];
  const steps = Array.isArray(guidedLearning?.steps) ? guidedLearning.steps : [];
  const sectionIcons = ['◎','◈','⚗','▣','✓','◆','↗'];
  const sectionTone = ['blue','violet','teal','amber','green','pink','indigo'];

  root.innerHTML = `
    <section class="page course-page v21-course">
      <div class="course-hero-card">
        <div class="course-hero-top">
          <button class="course-back" type="button" data-back>← 学习中心</button>
          <span class="course-status ${progress ? 'done' : ''}">${progress ? '✓ 已完成' : '● 学习中'}</span>
        </div>
        <div class="course-hero-main">
          <div>
            <div class="course-kicker">第 ${escapeHtml(lesson.day || lesson.sequenceNumber || '')} 课 · ${escapeHtml(lesson.duration || '')}</div>
            <h1>${escapeHtml(lesson.title || lesson.id || '课程')}</h1>
            <p>${escapeHtml(lesson.summary || lesson.description || '')}</p>
          </div>
          <div class="course-hero-icon" aria-hidden="true">⚗</div>
        </div>
        <div class="course-flow" aria-label="学习流程">
          <span class="active">① 学习</span><i>→</i><span>② 实验</span><i>→</i><span>③ 练习</span><i>→</i><span>④ 检查</span>
        </div>
      </div>

      <div class="course-action-grid">
        ${steps.length ? `<button class="course-action primary" type="button" data-guided><span class="action-icon">▸</span><span><strong>开始一步一步学</strong><small>${steps.length} 个学习步骤 · 讲解 + 即时检查</small></span><b>↓</b></button>` : ''}
        <button class="course-action" type="button" data-quiz><span class="action-icon">✦</span><span><strong>开始练习</strong><small>用题目检验理解</small></span><b>→</b></button>
        ${experiments.length ? `<button class="course-action teal" type="button" data-experiment><span class="action-icon">⚗</span><span><strong>进入虚拟实验</strong><small>观察现象 · 建立证据</small></span><b>→</b></button>` : ''}
        ${diagnostics.length ? `<div class="course-action diagnostic"><span class="action-icon">⌁</span><span><strong>诊断检查</strong><small>${diagnostics.length} 个概念检查点</small></span></div>` : ''}
        ${!progress ? `<button class="course-action quiet" type="button" data-complete><span class="action-icon">✓</span><span><strong>完成本课</strong><small>稍后可从学习中心继续</small></span></button>` : ''}
      </div>

      <section class="course-section-block">
        <div class="course-section-heading"><div><span class="section-eyebrow">学习目标</span><h2>本节课要掌握什么？</h2></div><span class="section-count">${points.length} 个知识点</span></div>
        <div class="knowledge-card-grid">${points.length ? points.map((id, i) => `<article class="knowledge-card-v21"><span class="knowledge-index">${String(i + 1).padStart(2,'0')}</span><div><strong>${escapeHtml(id)}</strong><small>本课重点</small></div><span class="knowledge-arrow">›</span></article>`).join('') : '<div class="empty-card">本课暂无独立知识点配置。</div>'}</div>
      </section>

      ${steps.length ? `<section class="course-section-block lesson-content-block" id="guided-learning">
        <div class="course-section-heading"><div><span class="section-eyebrow">核心学习</span><h2>一步一步学</h2></div><span class="section-count">${steps.length} 步</span></div>
        <div class="guided-learning-path">
          ${steps.map((step, i) => renderGuidedStep(step, i, sectionIcons[i % sectionIcons.length], sectionTone[i % sectionTone.length])).join('')}
        </div>
      </section>` : ''}
    </section>`;

  root.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  root.querySelector('[data-guided]')?.addEventListener('click', () => document.querySelector('#guided-learning')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  root.querySelector('[data-quiz]')?.addEventListener('click', () => onStartQuiz?.());
  root.querySelector('[data-experiment]')?.addEventListener('click', () => onStartExperiment?.(experiments[0]));
  root.querySelector('[data-complete]')?.addEventListener('click', () => onComplete?.());
}

function renderGuidedStep(step, index, icon, tone) {
  const body = Array.isArray(step.body) ? step.body : [step.body];
  const check = step.check;
  return `<article class="guided-step-card tone-${tone}">
    <div class="guided-step-marker"><span>${icon}</span><em>${String(index + 1).padStart(2,'0')}</em></div>
    <div class="guided-step-content">
      <div class="guided-step-label">第 ${index + 1} 步 · ${step.type === 'concept' ? '核心概念' : step.type === 'reasoning' ? '判断方法' : step.type === 'transfer' ? '迁移检查' : '引导学习'}</div>
      <h3>${escapeHtml(step.title || '')}</h3>
      <div class="guided-step-body">${body.filter(Boolean).map(text => `<p>${escapeHtml(text)}</p>`).join('')}</div>
      ${check ? `<details class="guided-check"><summary>马上检查一下</summary><div class="guided-check-body"><p class="guided-question">${escapeHtml(check.question || '')}</p>${Array.isArray(check.options) ? `<ol>${check.options.map(option => `<li>${escapeHtml(option)}</li>`).join('')}</ol>` : ''}<div class="guided-answer"><strong>正确答案：</strong>${Number.isInteger(check.answer) ? `第 ${check.answer + 1} 项` : escapeHtml(check.answer || '')}<p>${escapeHtml(check.explanation || '')}</p></div></div></details>` : ''}
    </div>
  </article>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
