/** Quiz View — rendering only, contextual learning results. */
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function renderQuiz({ root, question = {}, index = 0, total = 0, mode = 'practice', onAnswer } = {}) {
  if (!root) return;
  const options = Array.isArray(question.options) ? question.options : [];
  const pct = total ? Math.round(((index + 1) / total) * 100) : 0;
  const title = mode === 'mastery' ? '95% 掌握检查' : mode === 'recheck' ? '补救后再检测' : mode === 'transfer' ? '迁移挑战' : '基础练习';
  const isConstructed = question.type === 'constructed' || question.type === 'short-answer';
  const prompt = escapeHtml(question.prompt || question.stem || question.question || '');
  const body = isConstructed
    ? `<textarea class="cg-constructed-input" data-constructed rows="4" placeholder="请用完整的句子写出你的回答…" style="width:100%;box-sizing:border-box;padding:12px 14px;font-family:inherit;font-size:15px;line-height:1.6;border:1px solid var(--line);border-radius:10px;background:var(--panel-soft);color:var(--ink);resize:vertical"></textarea><button type="button" class="cg-btn cg-btn-primary" data-constructed-submit style="margin-top:14px">提交回答</button>`
    : options.map((option, i) => `<button type="button" class="cg-opt" data-option="${i}"><span class="cg-k">${LETTERS[i] || i + 1}</span><span>${escapeHtml(option.text ?? option)}</span></button>`).join('');
  root.innerHTML = `<section class="page quiz-page cg-quizwrap"><div class="cg-quiz-top"><span class="cg-chip" style="--c:var(--spec-yellow)"><i></i>${title}</span><small style="font-family:var(--font-mono);color:var(--ink-dim)">第 ${index + 1} / ${total} 题</small></div><div class="cg-quiz-track"><i style="width:${pct}%"></i></div><div class="cg-qcard"><h1 style="font-size:17px;line-height:1.55;font-weight:600;margin-bottom:20px;color:var(--ink)">${prompt}</h1>${body}</div></section>`;
  if (isConstructed) {
    const submit = root.querySelector('[data-constructed-submit]');
    const input = root.querySelector('[data-constructed]');
    if (typeof onAnswer === 'function' && submit && input) {
      const fire = () => { const text = input.value.trim(); if (!text) return; onAnswer(text); };
      submit.addEventListener('click', fire);
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) fire(); });
    }
  } else if (typeof onAnswer === 'function') {
    root.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => onAnswer(Number(button.dataset.option))));
  }
}

export function renderQuizResult({ root, score = 0, correct = 0, total = 0, hasRemediation = false, onRemediation, onContinue, onRetry, mode = 'practice', status = '', lessonId = '', answers = [], questions = [], criteria = {}, notice = '' } = {}) {
  if (!root) return;
  const isMastery = mode === 'mastery'; const isRecheck = mode === 'recheck'; const isTransfer = mode === 'transfer'; const passed = status === 'passed';
  const heading = isMastery ? (passed ? '本课掌握' : '还需要继续学习') : isRecheck ? (passed ? '补救完成' : '再检查一次') : isTransfer ? '迁移挑战完成' : '练习完成';
  const eyebrow = isMastery ? 'MASTERY CHECK' : isRecheck ? 'RECHECK' : isTransfer ? 'TRANSFER' : 'PRACTICE';
  const nextText = isMastery ? (passed ? '返回本课，完成最后一步' : '返回本课，查看需要补救的知识点') : isRecheck ? (passed ? '返回本课，进入95%掌握检查' : '返回本课，再次补救') : isTransfer ? '迁移完成，可以返回课程查看掌握状态' : '返回本课查看诊断与下一步学习';
  const remediationAction = (hasRemediation && !isTransfer) ? `<button type="button" class="cg-btn cg-btn-primary" data-remediation>${isMastery ? '继续针对性补救 →' : '开始针对性补救 →'}</button>` : '';
  const transferAction = isTransfer && passed ? `<button type="button" class="cg-btn cg-btn-primary" data-transfer>返回课程 →</button>` : '';
  const retryLabel = isMastery ? '再考一次掌握测试 →' : isRecheck ? '再做一次再检测 →' : isTransfer ? '再次挑战迁移题 →' : '再练一次 →';
  const retryAction = (typeof onRetry === 'function' && !passed) ? `<button type="button" class="cg-btn cg-btn-ghost" data-retry>${retryLabel}</button>` : '';
  const criteriaHtml = renderCriteria(criteria, passed);
  const noticeHtml = notice ? `<p style="color:var(--ink-dim);background:var(--spec-yellow-soft,var(--panel-soft));border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:0 auto 20px;max-width:520px;font-size:14px;line-height:1.6">${escapeHtml(notice)}</p>` : '';
  const questionMap = new Map((Array.isArray(questions) ? questions : []).map(q => [q.id, q]));
  const answerItems = Array.isArray(answers) ? answers : [];
  const reviewHtml = answerItems.length ? `<div class="quiz-review-section"><div class="quiz-review-toggle" data-review-toggle>查看每题详情 (${answerItems.length} 题)</div><div class="quiz-review-list" hidden>${answerItems.map((a, i) => {
    const q = questionMap.get(a.questionId) || {};
    const isConstructedAnswer = q.type === 'constructed' || q.type === 'short-answer';
    const correctFlag = a.correct ? '✓' : '✗';
    const color = a.correct ? 'var(--spec-green)' : 'var(--spec-red)';
    // a.answer / q.answer are already option letters ('A'..'F') for choice
    // questions — render them directly instead of re-encoding through
    // fromCharCode, which produced garbage control characters.
    const userAns = isConstructedAnswer ? String(a.answer ?? '') : (/^[A-F]$/.test(String(a.answer)) ? String(a.answer) : '—');
    const correctAns = /^[A-F]$/.test(String(q.answer)) ? String(q.answer) : '—';
    const answerLine = isConstructedAnswer
      ? `<p>你的回答：${escapeHtml(userAns || '—')}</p>${a.rubricPassed !== undefined ? `<p>主观题评分：${a.rubricPassed ? '通过' : '未通过'}</p>` : ''}`
      : `<p>你的答案：${escapeHtml(userAns)}${a.answer !== undefined ? `（正确：${escapeHtml(correctAns)}）` : ''}</p>`;
    return `<article class="quiz-review-item ${a.correct ? 'correct' : 'incorrect'}"><div class="quiz-review-header"><span class="quiz-review-index">${String(i + 1).padStart(2, '0')}</span><span class="quiz-review-status" style="color:${color}">${correctFlag}</span><strong>${escapeHtml(q.prompt || q.question || a.questionId || '')}</strong></div><div class="quiz-review-detail">${answerLine}${isConstructedAnswer && q.rubric?.modelAnswer ? `<p class="quiz-review-explanation">参考标准：${escapeHtml(q.rubric.modelAnswer)}</p>` : ''}${q.explanation ? `<p class="quiz-review-explanation">${escapeHtml(q.explanation)}</p>` : ''}${a.explanation ? `<p class="quiz-review-explanation">${escapeHtml(a.explanation)}</p>` : ''}</div></article>`;
  }).join('')}</div></div>` : '';
  root.innerHTML = `<section class="page quiz-result-page cg-quizwrap"><div class="cg-qcard" style="text-align:center"><div class="cg-eyebrow" style="justify-content:center">${eyebrow}</div><h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:8px;color:var(--ink)">${heading}</h1><p style="font-size:18px;margin-bottom:4px;color:var(--ink)">${correct} / ${total} 正确</p><p style="color:var(--ink-dim);margin-bottom:12px">得分 ${Number(score)}%</p><p style="color:var(--ink-dim);margin:0 auto 24px;max-width:520px">${nextText}</p>${noticeHtml}${criteriaHtml}<div class="cg-hero-actions" style="justify-content:center">${remediationAction}${transferAction}${retryAction}<button type="button" class="cg-btn cg-btn-ghost" data-continue>返回本课 →</button></div></div>${reviewHtml}</section>`;
  root.querySelector('[data-remediation]')?.addEventListener('click', () => { if (lessonId && typeof window !== 'undefined') window.location.hash = `remediation/${lessonId}`; else onRemediation?.(); });
  root.querySelector('[data-continue]')?.addEventListener('click', () => { if (lessonId && typeof window !== 'undefined') window.location.hash = `course/${lessonId}`; else onContinue?.(); });
  root.querySelector('[data-transfer]')?.addEventListener('click', () => { if (lessonId && typeof window !== 'undefined') window.location.hash = `course/${lessonId}`; else onContinue?.(); });
  root.querySelector('[data-retry]')?.addEventListener('click', () => onRetry?.());
  const toggle = root.querySelector('[data-review-toggle]');
  const list = root.querySelector('.quiz-review-list');
  toggle?.addEventListener('click', () => { const open = !list.hidden; list.hidden = open; toggle.textContent = open ? '收起每题详情' : `查看每题详情 (${answerItems.length} 题)`; });
}

function renderCriteria(criteria = {}, passed = false) {
  if (!criteria || typeof criteria !== 'object') return '';
  const uncovered = Array.isArray(criteria.uncoveredKnowledge) ? criteria.uncoveredKnowledge : [];
  const uncleared = Array.isArray(criteria.unclearedMisconceptions) ? criteria.unclearedMisconceptions : [];
  const constructed = criteria.constructedPassed;
  const scoreFailed = criteria.scorePassed === false;
  const items = [];
  if (scoreFailed) items.push({ label: '答题得分未达标', detail: `需要达到 ${Number(criteria.threshold || 0.95) * 100}% 的正确率` });
  if (uncovered.length) items.push({ label: '以下知识点未正确作答', detail: uncovered.map(escapeHtml).join('、') });
  if (uncleared.length) items.push({ label: '仍存在关键误解', detail: uncleared.map(escapeHtml).join('、') });
  if (constructed === false) items.push({ label: '主观题未通过', detail: '请根据评分标准完成并修正主观题回答' });
  if (!items.length) return '';
  return `<div class="cg-criteria" style="margin:0 auto 22px;max-width:560px;text-align:left;background:${passed ? 'var(--spec-green-soft,var(--panel-soft))' : 'var(--spec-red-soft,var(--panel-soft))'};border:1px solid var(--line);border-radius:12px;padding:14px 16px"><p style="margin:0 0 8px;font-weight:600;font-size:13px;letter-spacing:.04em;color:var(--ink)">${passed ? '达标条件全部满足' : '本次未满足的条件'}</p>${items.map(item => `<div style="display:flex;gap:8px;align-items:baseline;padding:4px 0"><span style="color:${passed ? 'var(--spec-green)' : 'var(--spec-red)'};font-family:var(--font-mono)">${passed ? '✓' : '✗'}</span><div><strong style="font-size:13px;color:var(--ink)">${escapeHtml(item.label)}</strong>${item.detail ? `<p style="margin:2px 0 0;font-size:12.5px;color:var(--ink-dim)">${escapeHtml(item.detail)}</p>` : ''}</div></div>`).join('')}</div>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
