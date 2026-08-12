/** V2.1 Course View — visual, low-density learning surface. */
export function renderV19Course({ root, lesson = {}, progress = false, onStartQuiz, onStartExperiment, onComplete, onBack } = {}) {
  if (!root) return;
  const points = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const experiments = Array.isArray(lesson.experiments) ? lesson.experiments : [];
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const diagnostics = Array.isArray(lesson.diagnosticQuestions) ? lesson.diagnosticQuestions : [];
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
            <div class="course-kicker">DAY ${escapeHtml(lesson.day || lesson.id || '')} · ${escapeHtml(lesson.duration || '')}</div>
            <h1>${escapeHtml(lesson.title || lesson.id || 'Lesson')}</h1>
            <p>${escapeHtml(lesson.summary || lesson.description || '')}</p>
          </div>
          <div class="course-hero-icon" aria-hidden="true">⚗</div>
        </div>
        <div class="course-flow" aria-label="学习流程">
          <span class="active">① 学习</span><i>→</i><span>② 实验</span><i>→</i><span>③ 练习</span><i>→</i><span>④ 检查</span>
        </div>
      </div>

      <div class="course-action-grid">
        <button class="course-action primary" type="button" data-quiz><span class="action-icon">✦</span><span><strong>开始练习</strong><small>用题目检验理解</small></span><b>→</b></button>
        ${experiments.length ? `<button class="course-action teal" type="button" data-experiment><span class="action-icon">⚗</span><span><strong>进入虚拟实验</strong><small>观察现象 · 建立证据</small></span><b>→</b></button>` : ''}
        ${diagnostics.length ? `<div class="course-action diagnostic"><span class="action-icon">⌁</span><span><strong>诊断检查</strong><small>${diagnostics.length} 个概念检查点</small></span></div>` : ''}
        ${!progress ? `<button class="course-action quiet" type="button" data-complete><span class="action-icon">✓</span><span><strong>完成本课</strong><small>稍后可从学习中心继续</small></span></button>` : ''}
      </div>

      <section class="course-section-block">
        <div class="course-section-heading"><div><span class="section-eyebrow">KNOWLEDGE MAP</span><h2>这节课要掌握什么？</h2></div><span class="section-count">${points.length} 个知识点</span></div>
        <div class="knowledge-card-grid">${points.length ? points.map((id, i) => `<article class="knowledge-card-v21"><span class="knowledge-index">${String(i + 1).padStart(2,'0')}</span><div><strong>${escapeHtml(id)}</strong><small>核心知识 · 本课重点</small></div><span class="knowledge-arrow">›</span></article>`).join('') : '<div class="empty-card">本课暂无独立知识点配置。</div>'}</div>
      </section>

      <section class="course-section-block lesson-content-block">
        <div class="course-section-heading"><div><span class="section-eyebrow">LEARNING PATH</span><h2>一步一步学</h2></div><span class="section-count">${sections.length} 个学习模块</span></div>
        <div class="lesson-timeline">
          ${sections.map((section, i) => `<article class="lesson-module-card tone-${sectionTone[i % sectionTone.length]}">
            <div class="module-marker"><span>${sectionIcons[i % sectionIcons.length]}</span><em>${String(i + 1).padStart(2,'0')}</em></div>
            <div class="module-content"><div class="module-label">${moduleLabel(section.title, i)}</div><h3>${escapeHtml(section.title || '')}</h3><div class="module-body">${renderBody(section.body)}</div></div>
          </article>`).join('')}
        </div>
      </section>
    </section>`;

  root.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  root.querySelector('[data-quiz]')?.addEventListener('click', () => onStartQuiz?.());
  root.querySelector('[data-experiment]')?.addEventListener('click', () => onStartExperiment?.(experiments[0]));
  root.querySelector('[data-complete]')?.addEventListener('click', () => onComplete?.());
}

function moduleLabel(title, index) {
  const t = String(title || '');
  if (/目标/.test(t)) return 'START · 学习目标';
  if (/新知|探究|概念/.test(t)) return 'LEARN · 核心概念';
  if (/实验|观察/.test(t)) return 'DISCOVER · 实验证据';
  if (/例题/.test(t)) return 'THINK · 例题推理';
  if (/练习|巩固/.test(t)) return 'PRACTICE · 即时练习';
  if (/检查|诊断/.test(t)) return 'CHECK · 概念检查';
  return `STEP ${String(index + 1).padStart(2,'0')}`;
}

function renderBody(body) {
  const items = Array.isArray(body) ? body : [body];
  return items.filter(item => item !== null && item !== undefined && String(item).trim()).map((item, i) => {
    const text = String(item);
    return `<p class="lesson-paragraph">${escapeHtml(text)}</p>`;
  }).join('');
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
