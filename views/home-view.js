/** Golden Lesson home entry — Lesson 01 is the canonical first-course experience. */
export function renderHome({ root, data = {}, onCourse, onDashboard, onGraph, onRemediation } = {}) {
  if (!root) return;
  const stats = data.stats || {};
  const lessons = Array.isArray(data.lessons) ? data.lessons : [];
  const firstLesson = lessons[0] || { day: '01', title: '物质的变化和性质', description: '从现象、性质到证据推理' };
  const firstLessonId = firstLesson.day || firstLesson.id || '01';
  root.innerHTML = `
    <section class="page home-page">
      <header class="page-header">
        <span class="eyebrow">ChemLab-G9 · Golden Lesson v1.0</span>
        <h1>${escapeHtml(data.title || '九年级化学智能学习中心')}</h1>
        <p>${escapeHtml(data.subtitle || '学习 → 实验 → 答题 → 诊断 → 补救 → 再检测')}</p>
      </header>
      <section class="home-actions">
        <button type="button" data-course>开始学习</button>
        <button type="button" data-dashboard>查看学习仪表盘</button>
        <button type="button" data-graph>探索知识图谱</button>
        ${data.hasRemediation ? '<button type="button" data-remediation>继续补救学习</button>' : ''}
      </section>
      <section class="golden-lesson-entry" aria-label="精品首课">
        <div class="golden-lesson-entry__meta"><span>GOLDEN LESSON · 01</span><span>95% MASTERY</span></div>
        <h2>第一课：${escapeHtml(firstLesson.title || '物质的变化和性质')}</h2>
        <p>${escapeHtml(firstLesson.description || '从观察现象到证据推理，建立化学学习的第一套思维框架。')}</p>
        <div class="golden-lesson-entry__flow"><span>学习</span><b>→</b><span>练习</span><b>→</b><span>诊断</span><b>→</b><span>掌握</span></div>
        <button type="button" data-golden-lesson>开始第一课</button>
      </section>
      <div class="home-stats">
        <div><strong>${Number(stats.completed || 0)}</strong><span>已完成课程</span></div>
        <div><strong>${Number(stats.mastery || 0)}%</strong><span>掌握度</span></div>
        <div><strong>${Number(stats.questions || 0)}</strong><span>已答题</span></div>
      </div>
      <section class="learning-center-list">
        <h2>课程进度</h2>
        ${lessons.length ? `<div class="lesson-grid">${lessons.slice(0, 12).map(lesson => `
          <button type="button" class="lesson-card" data-day="${escapeHtml(lesson.day || lesson.id)}">
            <span>Day ${escapeHtml(lesson.day || '')}</span>
            <strong>${escapeHtml(lesson.title || lesson.id || 'Lesson')}</strong>
            <small>${lesson.completed ? '已完成' : '继续学习'}</small>
          </button>`).join('')}</div>` : '<p>课程内容正在准备中。</p>'}
      </section>
    </section>`;
  root.querySelector('[data-course]')?.addEventListener('click', () => onCourse?.());
  root.querySelector('[data-golden-lesson]')?.addEventListener('click', () => onCourse?.(firstLessonId));
  root.querySelector('[data-dashboard]')?.addEventListener('click', () => onDashboard?.());
  root.querySelector('[data-graph]')?.addEventListener('click', () => onGraph?.());
  root.querySelector('[data-remediation]')?.addEventListener('click', () => onRemediation?.());
  root.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => onCourse?.(button.dataset.day)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
