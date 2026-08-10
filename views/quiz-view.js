/** V1.7 Quiz View — rendering only. */
export function renderQuiz({ root, question = {}, index = 0, total = 0, onAnswer } = {}) {
  if (!root) return;
  const options = Array.isArray(question.options) ? question.options : [];
  root.innerHTML = `<section class="page quiz-page"><header class="page-header"><span>Question ${index + 1} of ${total}</span><h1>${escapeHtml(question.prompt || question.stem || question.question || '')}</h1></header><div class="quiz-options">${options.map((option, i) => `<button type="button" data-option="${i}">${escapeHtml(option.text ?? option)}</button>`).join('')}</div></section>`;
  if (typeof onAnswer === 'function') root.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => onAnswer(Number(button.dataset.option))));
}

export function renderQuizResult({ root, score = 0, correct = 0, total = 0, hasRemediation = false, onRemediation, onContinue } = {}) {
  if (!root) return;
  const remediationAction = hasRemediation ? '<button type="button" data-remediation>Start targeted learning</button>' : '';
  root.innerHTML = `<section class="page quiz-result-page"><header class="page-header"><h1>Practice complete</h1><p>${correct} of ${total} correct · ${Number(score)}%</p></header>${remediationAction}<button type="button" data-continue>Continue learning</button></section>`;
  if (typeof onRemediation === 'function') root.querySelector('[data-remediation]')?.addEventListener('click', onRemediation);
  if (typeof onContinue === 'function') root.querySelector('[data-continue]')?.addEventListener('click', onContinue);
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
