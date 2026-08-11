/** V1.9 Course View — interactive lesson surface. */
export function renderV19Course({ root, lesson = {}, progress = false, onStartQuiz, onStartExperiment, onComplete, onBack } = {}) {
  if (!root) return;
  const points = Array.isArray(lesson.knowledgePoints) ? lesson.knowledgePoints : [];
  const experiments = Array.isArray(lesson.experiments) ? lesson.experiments : [];
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  root.innerHTML = `
    <section class="page course-page v19-course">
      <header class="page-header">
        <button type="button" data-back>← 学习中心</button>
        <span class="eyebrow">Day ${escapeHtml(lesson.day || lesson.id || '')} · ${escapeHtml(lesson.duration || '')}</span>
        <h1>${escapeHtml(lesson.title || lesson.id || 'Lesson')}</h1>
        <p>${escapeHtml(lesson.summary || lesson.description || '')}</p>
      </header>
      <section class="lesson-toolbar">
        <span>${progress ? '✓ 已完成' : '学习中'}</span>
        <button type="button" data-quiz>开始练习</button>
        ${experiments.length ? '<button type="button" data-experiment>进入虚拟实验</button>' : ''}
        ${!progress ? '<button type="button" data-complete>标记完成</button>' : ''}
      </section>
      <section class="knowledge-list"><h2>核心知识点</h2>${points.length ? points.map((id, i) => `<article class="knowledge-card"><span>${i + 1}</span><strong>${escapeHtml(id)}</strong></article>`).join('') : '<p>本课暂无独立知识点配置。</p>'}</section>
      <section class="lesson-sections"><h2>学习内容</h2>${sections.map(section => `<article><h3>${escapeHtml(section.title || '')}</h3>${Array.isArray(section.body) ? section.body.map(item => `<p>${escapeHtml(item)}</p>`).join('') : `<p>${escapeHtml(section.body || '')}</p>`}</article>`).join('')}</section>
    </section>`;
  root.querySelector('[data-back]')?.addEventListener('click', () => onBack?.());
  root.querySelector('[data-quiz]')?.addEventListener('click', () => onStartQuiz?.());
  root.querySelector('[data-experiment]')?.addEventListener('click', () => onStartExperiment?.(experiments[0]));
  root.querySelector('[data-complete]')?.addEventListener('click', () => onComplete?.());
}
function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
