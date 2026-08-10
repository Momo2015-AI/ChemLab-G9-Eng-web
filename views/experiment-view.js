/** V1.7 Experiment View — rendering only. */
export function renderExperiment({ root, experiment = {}, session = {}, onNext, onObserve, onComplete } = {}) {
  if (!root) return;
  const steps = Array.isArray(experiment.steps) ? experiment.steps : [];
  const current = Number(session.step ?? session.currentStep ?? 0);
  const step = steps[current] || {};
  root.innerHTML = `<section class="page experiment-page"><header class="page-header"><span>Step ${Math.min(current + 1, Math.max(steps.length, 1))} of ${Math.max(steps.length, 1)}</span><h1>${escapeHtml(experiment.title || experiment.name || 'Experiment')}</h1></header><article class="experiment-step"><h2>${escapeHtml(step.title || `Step ${current + 1}`)}</h2><p>${escapeHtml(step.instruction || step.description || '')}</p></article><label>Observation<textarea data-observation placeholder="Record what you observe..."></textarea></label><div class="experiment-actions">${current < steps.length - 1 ? '<button type="button" data-next>Next step</button>' : '<button type="button" data-complete>Complete experiment</button>'}</div></section>`;
  root.querySelector('[data-next]')?.addEventListener('click', () => { onObserve?.(root.querySelector('[data-observation]')?.value || ''); onNext?.(); });
  root.querySelector('[data-complete]')?.addEventListener('click', () => { onObserve?.(root.querySelector('[data-observation]')?.value || ''); onComplete?.(); });
}

export function renderExperimentResult({ root, result = {}, onContinue } = {}) {
  if (!root) return;
  root.innerHTML = `<section class="page experiment-result-page"><header class="page-header"><h1>Experiment complete</h1><p>${escapeHtml(result.conclusion || result.message || 'Review your observations and conclusion.')}</p></header><button type="button" data-continue>Continue learning</button></section>`;
  root.querySelector('[data-continue]')?.addEventListener('click', () => onContinue?.());
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
