/** V1.7 Remediation View — presentation only. */
export function renderRemediation({ root, plan = {}, guidedLearning = null, lessonId = '', onRecheck, onTransfer, onReview } = {}) {
  if (!root) return;
  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  const lessonIdSafe = lessonId || (typeof window !== 'undefined' ? window.__chemLabCurrentLessonId : '');
  const guidedSteps = Array.isArray(guidedLearning?.steps) ? guidedLearning.steps : [];
  const stepByKnowledge = new Map();
  for (const step of guidedSteps) {
    const points = Array.isArray(step.knowledgePoints) ? step.knowledgePoints : [];
    for (const point of points) if (!stepByKnowledge.has(point)) stepByKnowledge.set(point, step);
  }
  const labels = { review: '复习', practice: '针对性练习', recheck: '再检测', transfer: '迁移任务' };
  const title = plan.status === 'ready-for-transfer' ? '可以进入迁移任务' : plan.status === 'needs-remediation' ? '你的下一步学习计划' : '暂时没有可执行的补救计划';
  const body = steps.length
    ? `<ol class="remediation-steps">${steps.map((step, index) => {
        const guided = step.knowledgeId ? stepByKnowledge.get(step.knowledgeId) : null;
        const reviewTarget = step.type === 'review' && step.knowledgeId && lessonIdSafe
          ? `<button type="button" class="remediation-review-link" data-review="${escapeHtml(step.knowledgeId)}">回到「${escapeHtml(guided?.title || formatKnowledgePoint(step.knowledgeId))}」复习 →</button>`
          : '';
        return `<li><strong>${index + 1}. ${escapeHtml(labels[step.type] || step.type || '学习步骤')}</strong>${reviewTarget}${step.resourceId && step.type !== 'review' ? `<span>资源：${escapeHtml(step.resourceId)}</span>` : ''}${step.reason ? `<small>${escapeHtml(reasonLabel(step.reason))}</small>` : ''}</li>`;
      }).join('')}</ol>`
    : '<p>还没有可执行的补救步骤。</p>';
  const action = plan.status === 'ready-for-transfer'
    ? '<button type="button" class="course-action primary inline-action" data-transfer>开始迁移任务 →</button>'
    : steps.some(step => step.type === 'recheck')
      ? '<button type="button" class="course-action primary inline-action" data-recheck>开始再检测 →</button>'
      : '';

  root.innerHTML = `<section class="page remediation-page v21-remediation"><header class="page-header"><span class="eyebrow">针对性补救</span><h1>${escapeHtml(title)}</h1><p>按以下步骤巩固薄弱知识点，再检测通过后进入 Mastery 掌握测试。</p></header>${body}${action}</section>`;
  root.querySelector('[data-recheck]')?.addEventListener('click', () => onRecheck?.(plan));
  root.querySelector('[data-transfer]')?.addEventListener('click', () => onTransfer?.(plan));
  root.querySelectorAll('[data-review]').forEach(button => button.addEventListener('click', () => {
    const point = button.dataset.review;
    const guided = stepByKnowledge.get(point);
    if (onReview && guided) onReview(guided.id);
    else if (lessonIdSafe) window.location.hash = `course/${encodeURIComponent(lessonIdSafe)}`;
  }));
}

function formatKnowledgePoint(id) {
  return {
    'matter-change': '物质的变化',
    'physical-change': '物理变化',
    'chemical-change': '化学变化',
    'physical-property': '物理性质',
    'chemical-property': '化学性质',
    'observation-inference': '观察与推断',
    'evidence-reasoning': '证据与推理',
  }[id] || id || '';
}

function reasonLabel(reason) {
  return {
    'diagnosis-review': '诊断要求复习该知识点',
    'knowledge-gap': '该知识点存在掌握缺口',
    'targeted-retrieval': '通过定向练习巩固提取能力',
    'verify-remediation': '检测补救是否真正生效',
    'demonstrated-understanding': '已展示对该知识点的理解',
  }[reason] || reason || '';
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
