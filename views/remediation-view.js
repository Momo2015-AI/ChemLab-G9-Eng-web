/** V1.7 Remediation View — presentation only. */
export function renderRemediation({ root, plan = {} } = {}) {
  if (!root) return;
  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  const labels = { review: 'Review', practice: 'Targeted practice', recheck: 'Recheck', transfer: 'Transfer task' };
  const title = plan.status === 'ready-for-transfer' ? 'Ready for transfer' : plan.status === 'needs-remediation' ? 'Your next learning steps' : 'Learning plan unavailable';
  const body = steps.length
    ? steps.map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(labels[step.type] || step.type || 'Learning step')}</strong>${step.resourceId ? `<span>Resource: ${escapeHtml(step.resourceId)}</span>` : ''}${step.reason ? `<small>${escapeHtml(step.reason)}</small>` : ''}</li>`).join('')
    : '<li>No remediation steps are available yet.</li>';

  root.innerHTML = `<section class="page remediation-page"><header class="page-header"><h1>${escapeHtml(title)}</h1><p>Use these steps to strengthen your understanding and then check your progress again.</p></header><ol class="remediation-steps">${body}</ol></section>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
