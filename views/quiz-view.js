/** Quiz View — rendering only, letter-badge option cards. */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function renderQuiz({ root, question = {}, index = 0, total = 0, onAnswer } = {}) {
  if (!root) return;
  const options = Array.isArray(question.options) ? question.options : [];
  const pct = total ? Math.round(((index + 1) / total) * 100) : 0;
  root.innerHTML = `<section class="page quiz-page cg-quizwrap">
    <div class="cg-quiz-top"><span class="cg-chip" style="--c:var(--spec-yellow)"><i></i>随堂测验</span><small style="font-family:var(--font-mono);color:var(--ink-dim)">第 ${index + 1} / ${total} 题</small></div>
    <div class="cg-quiz-track"><i style="width:${pct}%"></i></div>
    <div class="cg-qcard">
      <h1 style="font-size:17px;line-height:1.55;font-weight:600;margin-bottom:20px;color:var(--ink)">${escapeHtml(question.prompt || question.stem || question.question || '')}</h1>
      ${options.map((option, i) => `<button type="button" class="cg-opt" data-option="${i}"><span class="cg-k">${LETTERS[i] || i + 1}</span><span>${escapeHtml(option.text ?? option)}</span></button>`).join('')}
    </div>
  </section>`;
  if (typeof onAnswer === 'function') root.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => onAnswer(Number(button.dataset.option))));
}

export function renderQuizResult({ root, score = 0, correct = 0, total = 0, hasRemediation = false, onRemediation, onContinue } = {}) {
  if (!root) return;
  const remediationAction = hasRemediation ? '<button type="button" class="cg-btn cg-btn-primary" data-remediation>开始针对性补救 →</button>' : '';
  root.innerHTML = `<section class="page quiz-result-page cg-quizwrap">
    <div class="cg-qcard" style="text-align:center">
      <div class="cg-eyebrow" style="justify-content:center">PRACTICE COMPLETE</div>
      <h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:8px;color:var(--ink)">${correct} / ${total} 正确</h1>
      <p style="color:var(--ink-dim);margin-bottom:24px">得分 ${Number(score)}%</p>
      <div class="cg-hero-actions" style="justify-content:center">${remediationAction}<button type="button" class="cg-btn cg-btn-ghost" data-continue>继续学习 →</button></div>
    </div>
  </section>`;
  if (typeof onRemediation === 'function') root.querySelector('[data-remediation]')?.addEventListener('click', onRemediation);
  if (typeof onContinue === 'function') root.querySelector('[data-continue]')?.addEventListener('click', onContinue);
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
