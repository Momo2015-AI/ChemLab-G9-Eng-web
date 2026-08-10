/** V1.7 Dashboard View — presentation only. */
export function renderDashboard({ root, summary = {} } = {}) {
  if (!root) return;
  const weak = Array.isArray(summary.weakPoints) ? summary.weakPoints : [];
  root.innerHTML = `<section class="page dashboard-page"><header class="page-header"><h1>Learning dashboard</h1><p>Use your learning evidence to decide what to study next.</p></header><div class="dashboard-stats"><div><strong>${Number(summary.completed || 0)}</strong><span>Lessons completed</span></div><div><strong>${Number(summary.mastery || 0)}%</strong><span>Mastery</span></div><div><strong>${Number(summary.questions || 0)}</strong><span>Questions attempted</span></div></div><section><h2>Needs review</h2><ul>${weak.length ? weak.map(item => `<li>${escapeHtml(item.title || item.id || item)}</li>`).join('') : '<li>No priority review items yet.</li>'}</ul></section></section>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
