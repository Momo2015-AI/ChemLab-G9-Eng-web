/** V1.7 Home View — rendering only. */
export function renderHome({ root, data = {} } = {}) {
  if (!root) return;
  const stats = data.stats || {};
  root.innerHTML = `
    <section class="page home-page">
      <header class="page-header">
        <h1>${escapeHtml(data.title || 'ChemLab-G9')}</h1>
        <p>${escapeHtml(data.subtitle || 'Learn chemistry through evidence, models, and practice.')}</p>
      </header>
      <div class="home-stats">
        <div><strong>${Number(stats.completed || 0)}</strong><span>Lessons completed</span></div>
        <div><strong>${Number(stats.mastery || 0)}%</strong><span>Current mastery</span></div>
      </div>
    </section>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
