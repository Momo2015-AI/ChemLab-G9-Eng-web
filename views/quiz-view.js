/** Quiz View — rendering only, contextual learning results. */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function renderQuiz({ root, question = {}, index = 0, total = 0, mode = 'practice', onAnswer } = {}) {
  if (!root) return;
  const options = Array.isArray(question.options) ? question.options : [];
  const pct = total ? Math.round(((index + 1) / total) * 100) : 0;
  const title = mode === 'mastery' ? '95% 掌握检查' : mode === 'recheck' ? '补救后再检测' : mode === 'transfer' ? '迁移挑战' : '基础练习';
  root.innerHTML = `<section class="page quiz-page cg-quizwrap"><div class="cg-quiz-top"><span class="cg-chip" style="--c:var(--spec-yellow)"><i></i>${title}</span><small style="font-family:var(--font-mono);color:var(--ink-dim)">第 ${index + 1} / ${total} 题</small></div><div class="cg-quiz-track"><i style="width:${pct}%"></i></div><div class="cg-qcard"><h1 style="font-size:17px;line-height:1.55;font-weight:600;margin-bottom:20px;color:var(--ink)">${escapeHtml(question.prompt || question.stem || question.question || '')}</h1>${options.map((option, i) => `<button type="button" class="cg-opt" data-option="${i}"><span class="cg-k">${LETTERS[i] || i + 1}</span><span>${escapeHtml(option.text ?? option)}</span></button>`).join('')}</div></section>`;
  if (typeof onAnswer === 'function') root.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => onAnswer(Number(button.dataset.option))));
}

export function renderQuizResult({ root, score = 0, correct = 0, total = 0, hasRemediation = false, onRemediation, onContinue, mode = 'practice', status = '', lessonId = '' } = {}) {
  if (!root) return;
  const isMastery = mode === 'mastery'; const isRecheck = mode === 'recheck'; const isTransfer = mode === 'transfer'; const passed = status === 'passed';
  const heading = isMastery ? (passed ? '本课掌握' : '还需要继续学习') : isRecheck ? (passed ? '补救完成' : '再检查一次') : isTransfer ? '迁移挑战完成' : '练习完成';
  const eyebrow = isMastery ? 'MASTERY CHECK' : isRecheck ? 'RECHECK' : isTransfer ? 'TRANSFER' : 'PRACTICE';
  const nextText = isMastery ? (passed ? '返回本课，完成最后一步' : '返回本课，查看需要补救的知识点') : isRecheck ? (passed ? '返回本课，进入95%掌握检查' : '返回本课，再次补救') : isTransfer ? '迁移完成，可以返回课程查看掌握状态' : '返回本课查看诊断与下一步学习';
  const remediationAction = (hasRemediation && !isTransfer) ? `<button type="button" class="cg-btn cg-btn-primary" data-remediation>${isMastery ? '继续针对性补救 →' : '开始针对性补救 →'}</button>` : '';
  root.innerHTML = `<section class="page quiz-result-page cg-quizwrap"><div class="cg-qcard" style="text-align:center"><div class="cg-eyebrow" style="justify-content:center">${eyebrow}</div><h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:8px;color:var(--ink)">${heading}</h1><p style="font-size:18px;margin-bottom:4px;color:var(--ink)">${correct} / ${total} 正确</p><p style="color:var(--ink-dim);margin-bottom:12px">得分 ${Number(score)}%</p><p style="color:var(--ink-dim);margin:0 auto 24px;max-width:520px">${nextText}</p><div class="cg-hero-actions" style="justify-content:center">${remediationAction}<button type="button" class="cg-btn cg-btn-ghost" data-continue>返回本课 →</button></div></div></section>`;
  root.querySelector('[data-remediation]')?.addEventListener('click', () => { if (lessonId && typeof window !== 'undefined') window.location.hash = `remediation/${lessonId}`; else onRemediation?.(); });
  root.querySelector('[data-continue]')?.addEventListener('click', () => { if (lessonId && typeof window !== 'undefined') window.location.hash = `course/${lessonId}`; else onContinue?.(); });
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
