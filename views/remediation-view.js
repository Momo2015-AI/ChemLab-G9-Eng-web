/** V1.7 Remediation View — presentation only. */
export function renderRemediation({ root, plan = {}, onRecheck, onTransfer } = {}) {
  if (!root) return;
  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  const labels = { review: 'Review', practice: 'Targeted practice', recheck: 'Recheck', transfer: 'Transfer task' };
  const title = plan.status === 'ready-for-transfer' ? 'Ready for transfer' : plan.status === 'needs-remediation' ? 'Your next learning steps' : 'Learning plan unavailable';
  const body = steps.length
    ? steps.map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(labels[step.type] || step.type || 'Learning step')}</strong>${step.resourceId ? `<span>Resource: ${escapeHtml(step.resourceId)}</span>` : ''}${step.reason ? `<small>${escapeHtml(step.reason)}</small>` : ''}</li>`).join('')
    : '<li>No remediation steps are available yet.</li>';
  const action = plan.status === 'ready-for-transfer'
    ? '<button type="button" data-transfer>Try a transfer task</button>'
    : steps.some(step => step.type === 'recheck')
      ? '<button type="button" data-recheck>Start recheck</button>'
      : '';

  root.innerHTML = `<section class="page remediation-page"><header class="page-header"><h1>${escapeHtml(title)}</h1><p>Use these steps to strengthen your understanding and then check your progress again.</p></header><ol class="remediation-steps">${body}</ol>${action}</section>`;
  root.querySelector('[data-recheck]')?.addEventListener('click', () => onRecheck?.(plan));
  root.querySelector('[data-transfer]')?.addEventListener('click', () => onTransfer?.(plan));
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
