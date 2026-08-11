/** V1.9 Dashboard View — evidence and next-action surface. */
export function renderDashboard({ root, summary = {}, onContinue, onRemediation } = {}) {
  if (!root) return;
  const weak = Array.isArray(summary.weakPoints) ? summary.weakPoints : [];
  const diagnosis = summary.diagnosis || {};
  const plan = summary.remediation || {};
  root.innerHTML = `
    <section class="page dashboard-page">
      <header class="page-header">
        <span class="eyebrow">学习仪表盘</span>
        <h1>你的学习状态</h1>
        <p>掌握度来自真实学习证据，而不是单纯的完成率。</p>
      </header>
      <div class="dashboard-stats">
        <div><strong>${Number(summary.completed || 0)}</strong><span>课程完成</span></div>
        <div><strong>${Number(summary.mastery || 0)}%</strong><span>知识掌握度</span></div>
        <div><strong>${Number(summary.questions || 0)}</strong><span>答题证据</span></div>
      </div>
      <section class="dashboard-panel">
        <h2>最近一次学习诊断</h2>
        <p>${escapeHtml(diagnosis.status === 'incorrect' ? '发现需要加强的知识点，建议继续补救学习。' : diagnosis.status === 'correct' ? '最近一次证据表现良好，可以继续迁移应用。' : '完成一次练习后，这里会显示你的诊断结果。')}</p>
        ${diagnosis.knowledge?.length ? `<div class="tag-list">${diagnosis.knowledge.map(id => `<span>${escapeHtml(id)}</span>`).join('')}</div>` : ''}
      </section>
      <section class="dashboard-panel">
        <h2>优先复习</h2>
        ${weak.length ? `<ul>${weak.map(item => `<li><strong>${escapeHtml(item.title || item.id || item)}</strong>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</li>`).join('')}</ul>` : '<p>暂时没有优先复习项。</p>'}
      </section>
      <section class="dashboard-actions">
        ${plan.status === 'needs-remediation' ? '<button type="button" data-remediation>继续补救</button>' : ''}
        <button type="button" data-continue>继续学习</button>
      </section>
    </section>`;
  root.querySelector('[data-remediation]')?.addEventListener('click', () => onRemediation?.());
  root.querySelector('[data-continue]')?.addEventListener('click', () => onContinue?.());
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
