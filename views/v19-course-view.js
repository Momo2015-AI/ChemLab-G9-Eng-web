/** V2.2 Course View — low-density overview plus real guided learning. */
export function renderV19Course({ root, lesson = {}, guidedLearning = null, progress = false, onStartQuiz, onStartExperiment, onComplete, onBack } = {}) {
  if (!root) return;
  const points = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const experiments = Array.isArray(lesson.experiments) ? lesson.experiments : [];
  const diagnostics = Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [];
  const steps = Array.isArray(guidedLearning?.steps) ? guidedLearning.steps : [];

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
        <div class="course-flow" aria-label="学习流程"><span class="active">① 学习</span><i>→</i><span>② 实验</span><i>→</i><span>③ 练习</span><i>→</i><span>④ 检查</span></div>
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
        <div class="guided-learning-cards">
          ${steps.map((step, i) => renderGuidedCard(step, i)).join('')}
        </div>
      </section>` : ''}
    </section>`;

  root.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  root.querySelector('[data-guided]')?.addEventListener('click', () => document.querySelector('#guided-learning')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  root.querySelector('[data-quiz]')?.addEventListener('click', () => onStartQuiz?.());
  root.querySelector('[data-experiment]')?.addEventListener('click', () => onStartExperiment?.(experiments[0]));
  root.querySelector('[data-complete]')?.addEventListener('click', () => onComplete?.());
}

function renderGuidedCard(step, index) {
  const body = Array.isArray(step.body) ? step.body : [step.body];
  const check = step.check;
  const hasDetail = body.some(Boolean) || Boolean(check);
  const label = step.type === 'concept' ? '核心概念' : step.type === 'reasoning' ? '判断方法' : step.type === 'transfer' ? '迁移检查' : '引导学习';
  return `<article class="guided-learning-card ${hasDetail ? '' : 'compact'}">
    <button class="guided-card-header" type="button" aria-expanded="false">
      <span class="guided-card-index">${String(index + 1).padStart(2,'0')}</span>
      <span class="guided-card-main"><span class="guided-card-label">第 ${index + 1} 步 · ${label}</span><strong>${escapeHtml(step.title || '')}</strong><small>点击展开学习内容</small></span>
      <span class="guided-card-toggle" aria-hidden="true">＋</span>
    </button>
    <div class="guided-card-detail" hidden>
      <div class="guided-step-body">${body.filter(Boolean).map(text => `<p>${escapeHtml(text)}</p>`).join('')}</div>
      ${check ? renderCheck(check) : ''}
    </div>
  </article>`;
}

function renderCheck(check) {
  const options = Array.isArray(check.options) ? check.options : [];
  return `<div class="guided-check">
    <div class="guided-check-title">马上检查一下</div>
    <p class="guided-question">${escapeHtml(check.question || '')}</p>
    ${options.length ? `<div class="guided-options">${options.map((option, i) => `<label><input type="radio" name="check-${escapeHtml(check.question || 'q')}" value="${i}"><span>${String.fromCharCode(65 + i)}. ${escapeHtml(option)}</span></label>`).join('')}</div>` : ''}
    <button type="button" class="guided-submit">提交答案</button>
    <div class="guided-result" hidden></div>
  </div>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

if (typeof document !== 'undefined') {
  document.addEventListener('click', event => {
    const header = event.target.closest('.guided-card-header');
    if (header) {
      const card = header.closest('.guided-learning-card');
      const detail = card?.querySelector('.guided-card-detail');
      if (!detail) return;
      const open = !detail.hidden;
      detail.hidden = open;
      header.setAttribute('aria-expanded', String(!open));
      const toggle = header.querySelector('.guided-card-toggle');
      if (toggle) toggle.textContent = open ? '＋' : '−';
      return;
    }
    const submit = event.target.closest('.guided-submit');
    if (submit) {
      const check = submit.closest('.guided-check');
      const selected = check?.querySelector('input[type="radio"]:checked');
      const result = check?.querySelector('.guided-result');
      if (!selected || !result) return;
      const answerIndex = Number(selected.value);
      const question = check.querySelector('.guided-question')?.textContent || '';
      const card = submit.closest('.guided-learning-card');
      const stepTitle = card?.querySelector('.guided-card-main strong')?.textContent || '';
      const source = window.__chemLabGuidedLearning?.steps?.find(step => step.title === stepTitle);
      const expected = Number.isInteger(source?.check?.answer) ? source.check.answer : null;
      const correct = expected !== null && answerIndex === expected;
      result.hidden = false;
      result.textContent = correct ? `✓ 回答正确。${source?.check?.explanation || ''}` : `再想一想。${source?.check?.explanation || '请回到本步骤的讲解，找出支持答案的证据。'}`;
      result.className = `guided-result ${correct ? 'correct' : 'retry'}`;
      void question;
    }
  });
}
