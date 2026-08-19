/** V1.10 Experiment View — inquiry scaffold: goal → instruments → safety → steps → observation → conclusion. */
function instrumentById(instruments, id) {
  return (Array.isArray(instruments) ? instruments : []).find(item => item && item.id === id);
}

export function renderV19Experiment({ root, experiment = {}, session = {}, instruments = [], onNext, onObserve, onComplete } = {}) {
  if (!root) return;
  const steps = Array.isArray(experiment.steps) ? experiment.steps : [];
  const current = Number(session.step ?? session.currentStep ?? 0);
  const step = steps[current] || {};
  const validation = session.lastValidation || {};
  const prompts = Array.isArray(experiment.observationPrompts) ? experiment.observationPrompts : [];
  const prompt = prompts.length ? prompts[Math.min(current, prompts.length - 1)] : '';
  const instrumentIds = Array.isArray(experiment.instruments) ? experiment.instruments : [];
  const instrumentItems = instrumentIds.map(id => instrumentById(instruments, id)).filter(Boolean);
  const goal = experiment.goal || experiment.purpose || '';
  const safety = experiment.safety || '';

  const instrumentMarkup = instrumentItems.length
    ? `<div class="v19-exp-instruments"><h3 class="v19-exp-section-title">实验器材</h3><div class="v19-exp-instrument-grid">${instrumentItems.map(item => {
        const usage = Array.isArray(item.usage) ? item.usage : [];
        return `<div class="v19-exp-instrument"><div class="v19-exp-instrument-icon">${item.icon || ''}</div><div class="v19-exp-instrument-body"><strong class="v19-exp-instrument-name">${escapeHtml(item.name || item.id)}</strong>${usage.length ? `<ul class="v19-exp-instrument-usage">${usage.map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>` : ''}</div></div>`;
      }).join('')}</div></div>`
    : '';

  const safetyMarkup = safety
    ? `<div class="v19-exp-safety"><h3 class="v19-exp-section-title">安全提示</h3><p>${escapeHtml(safety)}</p></div>`
    : '';

  const goalMarkup = goal
    ? `<div class="v19-exp-goal"><h3 class="v19-exp-section-title">实验目标</h3><p>${escapeHtml(goal)}</p></div>`
    : '';

  const promptMarkup = prompt
    ? `<p class="v19-exp-prompt">观察引导：${escapeHtml(prompt)}</p>`
    : '';

  root.innerHTML = `<section class="page experiment-page v19-experiment"><header class="page-header"><span class="eyebrow">虚拟实验 · Step ${Math.min(current + 1, Math.max(steps.length, 1))}/${Math.max(steps.length, 1)}</span><h1>${escapeHtml(experiment.title || experiment.name || 'Experiment')}</h1></header>${goalMarkup}${instrumentMarkup}${safetyMarkup}<article class="v19-exp-step"><h3 class="v19-exp-section-title">操作步骤 ${Math.min(current + 1, Math.max(steps.length, 1))}</h3><p class="v19-exp-action">${escapeHtml(step.action || step.instruction || step.description || step.record || '')}</p>${step.record ? `<p class="v19-exp-record">记录要点：${escapeHtml(step.record)}</p>` : ''}${promptMarkup}</article><article class="experiment-observation"><label><strong>记录实验现象</strong><textarea data-observation placeholder="写下你观察到的现象、变化或结论..."></textarea></label>${validation.message ? `<p class="validation ${validation.valid ? 'valid' : 'invalid'}">${escapeHtml(validation.message)}</p>` : ''}</article><div class="experiment-actions">${current < steps.length - 1 ? '<button type="button" data-next>记录并进入下一步</button>' : '<button type="button" data-complete>完成实验并生成学习证据</button>'}</div></section>`;
  const observe = () => onObserve?.(root.querySelector('[data-observation]')?.value || '');
  root.querySelector('[data-next]')?.addEventListener('click', () => { observe(); onNext?.(); });
  root.querySelector('[data-complete]')?.addEventListener('click', () => { observe(); onComplete?.(); });
}

export function renderV19ExperimentResult({ root, result = {}, onContinue } = {}) {
  if (!root) return;
  const lessonId = typeof window !== 'undefined' ? window.__chemLabCurrentLessonId : '';
  const observations = Array.isArray(result.observations) ? result.observations : [];
  const scored = Number.isFinite(Number(result.score)) ? Number(result.score) : null;
  root.innerHTML = `<section class="page experiment-result-page"><header class="page-header"><span class="eyebrow">实验完成</span><h1>实验学习证据已记录</h1><p>${escapeHtml(result.conclusion || result.message || '实验结果已进入学习状态。')}</p></header>${scored !== null ? `<div class="v19-exp-score"><span class="v19-exp-score-value">${scored}%</span><span class="v19-exp-score-label">观察完整度</span></div>` : ''}${observations.length ? `<details class="v19-exp-observations"><summary>查看我的实验记录（${observations.length} 条）</summary><ul>${observations.map(item => `<li><span class="v19-exp-obs-step">Step ${Number(item.step) + 1}</span>${escapeHtml(item.observation || '')}</li>`).join('')}</ul></details>` : ''}<p class="experiment-next-hint">下一步：回到本课，继续完成基础练习。</p><button type="button" data-continue>返回本课 →</button></section>`;
  root.querySelector('[data-continue]')?.addEventListener('click', () => {
    if (lessonId && typeof window !== 'undefined') window.location.hash = `course/${encodeURIComponent(lessonId)}`;
    else onContinue?.();
  });
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
