/** V1.9 Home View — learning center entry surface. */
export function renderHome({ root, data = {}, onCourse, onDashboard, onGraph, onRemediation } = {}) {
  if (!root) return;
  const stats = data.stats || {};
  const lessons = Array.isArray(data.lessons) ? data.lessons : [];
  root.innerHTML = `
    <section class="page home-page">
      <header class="page-header">
        <span class="eyebrow">ChemLab-G9 · V1.9</span>
        <h1>${escapeHtml(data.title || '九年级化学智能学习中心')}</h1>
        <p>${escapeHtml(data.subtitle || '学习 → 实验 → 答题 → 诊断 → 补救 → 再检测')}</p>
      </header>
      <section class="home-actions">
        <button type="button" data-course>开始学习</button>
        <button type="button" data-dashboard>查看学习仪表盘</button>
        <button type="button" data-graph>探索知识图谱</button>
        ${data.hasRemediation ? '<button type="button" data-remediation>继续补救学习</button>' : ''}
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
  root.querySelector('[data-dashboard]')?.addEventListener('click', () => onDashboard?.());
  root.querySelector('[data-graph]')?.addEventListener('click', () => onGraph?.());
  root.querySelector('[data-remediation]')?.addEventListener('click', () => onRemediation?.());
  root.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => onCourse?.(button.dataset.day)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
