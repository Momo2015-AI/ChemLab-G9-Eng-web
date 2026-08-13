/** V1.9 Experiment View — observation, evidence and feedback surface. */
export function renderV19Experiment({ root, experiment = {}, session = {}, onNext, onObserve, onComplete } = {}) {
  if (!root) return;
  const steps = Array.isArray(experiment.steps) ? experiment.steps : [];
  const current = Number(session.step ?? session.currentStep ?? 0);
  const step = steps[current] || {};
  const validation = session.lastValidation || {};
  root.innerHTML = `<section class="page experiment-page v19-experiment"><header class="page-header"><span class="eyebrow">虚拟实验 · Step ${Math.min(current + 1, Math.max(steps.length, 1))}/${Math.max(steps.length, 1)}</span><h1>${escapeHtml(experiment.title || experiment.name || 'Experiment')}</h1><p>${escapeHtml(step.instruction || step.description || '')}</p></header><article class="experiment-observation"><label><strong>记录实验现象</strong><textarea data-observation placeholder="写下你观察到的现象、变化或结论..."></textarea></label>${validation.message ? `<p class="validation ${validation.valid ? 'valid' : 'invalid'}">${escapeHtml(validation.message)}</p>` : ''}</article><div class="experiment-actions">${current < steps.length - 1 ? '<button type="button" data-next>记录并进入下一步</button>' : '<button type="button" data-complete>完成实验并生成学习证据</button>'}</div></section>`;
  const observe = () => onObserve?.(root.querySelector('[data-observation]')?.value || '');
  root.querySelector('[data-next]')?.addEventListener('click', () => { observe(); onNext?.(); });
  root.querySelector('[data-complete]')?.addEventListener('click', () => { observe(); onComplete?.(); });
}
export function renderV19ExperimentResult({ root, result = {}, onContinue } = {}) {
  if (!root) return;
  const lessonId = typeof window !== 'undefined' ? window.__chemLabCurrentLessonId : '';
  root.innerHTML = `<section class="page experiment-result-page"><header class="page-header"><span class="eyebrow">实验完成</span><h1>实验学习证据已记录</h1><p>${escapeHtml(result.conclusion || result.message || '实验结果已进入学习状态。')}</p></header><p class="experiment-next-hint">下一步：回到本课，继续完成基础练习。</p><button type="button" data-continue>返回本课 →</button></section>`;
  root.querySelector('[data-continue]')?.addEventListener('click', () => {
    if (lessonId && typeof window !== 'undefined') window.location.hash = `course/${encodeURIComponent(lessonId)}`;
    else onContinue?.();
  });
}
function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
