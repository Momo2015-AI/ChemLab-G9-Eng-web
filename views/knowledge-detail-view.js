/** Knowledge Detail View — renders a single knowledge node with full context. */
import { getCanonicalMisconception } from '../content/misconceptions/canonical-misconceptions.js';

const DOMAIN_LABEL = {
  matter: '物质基础', method: '科学方法', substance: '物质性质',
  reaction: '反应原理', acid: '酸碱专题'
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

export function renderKnowledgeDetail({ root, node = null, prerequisiteNodes = [], lessonId = '', onBack, onLearn } = {}) {
  if (!root) return;
  if (!node) {
    root.innerHTML = `<section class="page kd-page"><div class="kd-empty"><h2>知识点未找到</h2><p>该知识节点暂无详细内容。</p><button type="button" class="kd-back-btn" data-back>返回知识图谱</button></div></section>`;
    root.querySelector('[data-back]')?.addEventListener('click', onBack);
    return;
  }
  const domainLabel = DOMAIN_LABEL[node.domain] || node.domain;
  const misconceptions = (node.misconceptionIds || []).map(id => getCanonicalMisconception(id)).filter(Boolean);
  const prerequisites = (prerequisiteNodes || []).filter(p => p?.id);
  const relatedLessons = lessonId ? [{ id: lessonId, title: '当前课程' }] : [];
  const colorVar = node.domain === 'matter' ? 'var(--spec-violet)' :
                   node.domain === 'method' ? 'var(--spec-indigo)' :
                   node.domain === 'substance' ? 'var(--spec-blue)' :
                   node.domain === 'reaction' ? 'var(--spec-red)' :
                   node.domain === 'acid' ? 'var(--spec-blue)' : 'var(--spec-violet)';

  root.innerHTML = `
    <section class="page kd-page">
      <header class="kd-header">
        <button type="button" class="kd-back" data-back>← 返回知识图谱</button>
        <div class="kd-header-main">
          <span class="kd-domain-chip" style="--c:${colorVar}">${domainLabel}</span>
          <h1 class="kd-title">${escapeHtml(node.name || node.id)}</h1>
        </div>
      </header>
      <div class="kd-body">
        <article class="kd-card kd-def-card">
          <h3>定义</h3>
          <p>${escapeHtml(node.definition || '暂无定义。')}</p>
        </article>
        ${node.bloomLevels && node.bloomLevels.length ? `
        <article class="kd-card">
          <h3>认知层次</h3>
          <div class="kd-bloom-row">${node.bloomLevels.map(l => `<span class="kd-bloom-chip">${escapeHtml(l)}</span>`).join('')}</div>
        </article>` : ''}
        ${prerequisites.length ? `
        <article class="kd-card">
          <h3>前置知识</h3>
          <div class="kd-prereq-list">${prerequisites.map(p => `
            <button type="button" class="kd-prereq-btn" data-node-id="${escapeHtml(p.id)}">
              <span class="kd-prereq-arrow">→</span>
              <span>${escapeHtml(p.name || p.id)}</span>
            </button>`).join('')}</div>
        </article>` : '<article class="kd-card"><h3>前置知识</h3><p class="kd-muted">无，这是基础知识点。</p></article>'}
        ${misconceptions.length ? `
        <article class="kd-card">
          <h3>常见误解</h3>
          <div class="kd-mc-list">${misconceptions.map(mc => `
            <div class="kd-mc-item">
              <span class="kd-mc-severity kd-sev-${mc.severity || 'medium'}"></span>
              <strong>${escapeHtml(mc.title)}</strong>
              <p>${escapeHtml(mc.description)}</p>
            </div>`).join('')}</div>
        </article>` : '<article class="kd-card"><h3>常见误解</h3><p class="kd-muted">暂无记录的常见误解。</p></article>'}
        ${node.remediationGoal ? `
        <article class="kd-card kd-remed-card">
          <h3>补救目标</h3>
          <p>${escapeHtml(node.remediationGoal)}</p>
        </article>` : ''}
        ${relatedLessons.length ? `
        <article class="kd-card">
          <h3>关联课程</h3>
          <div class="kd-lesson-list">${relatedLessons.map(l => `
            <button type="button" class="kd-lesson-btn" data-lesson="${escapeHtml(l.id)}">
              <span>${escapeHtml(l.title)}</span>
              <span class="kd-lesson-arrow">→</span>
            </button>`).join('')}</div>
        </article>` : ''}
      </div>
    </section>`;

  root.querySelector('[data-back]')?.addEventListener('click', onBack);
  root.querySelectorAll('[data-node-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof onBack === 'function') onBack(btn.dataset.nodeId);
    });
  });
  root.querySelectorAll('[data-lesson]').forEach(btn => {
    btn.addEventListener('click', () => onLearn?.(btn.dataset.lesson));
  });
}
