import { knowledgeDomainColor, SPECTRAL_VARS } from '../../design-system/spectral-domains.js';

const DOMAIN_LABEL = { violet: '基础/综合', blue: '酸碱', green: '生活应用', yellow: '盐/化肥', orange: '金属/材料', red: '反应/方程式' };

function bucketOf(domain) {
  const color = knowledgeDomainColor(domain);
  return Object.entries(SPECTRAL_VARS).find(([, v]) => v === color)?.[0] || 'violet';
}

// 掌握度按 content/knowledge/knowledge-graph.json 的真实 domain 字段聚合成六个学科域；
// 没有作答证据的知识点不计入平均分，不用占位数字填充。
function aggregateByDomain(masteryState = {}, nodes = []) {
  const buckets = new Map();
  nodes.forEach(node => {
    const value = masteryState[node.id];
    if (!Number.isFinite(value)) return;
    const bucket = bucketOf(node.domain);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket).push(value);
  });
  return Array.from(buckets.entries())
    .map(([bucket, values]) => ({ bucket, label: DOMAIN_LABEL[bucket], color: SPECTRAL_VARS[bucket], value: values.reduce((a, b) => a + b, 0) / values.length }))
    .sort((a, b) => b.value - a.value);
}

export function renderProgressPortal({ root, onHome = () => { window.location.hash = 'home'; }, onQuiz = () => { window.location.hash = 'assessment'; }, summary = {}, masteryState = {}, knowledgeNodes = [], weakPoints = [] } = {}) {
  if (!root) return;
  const mastery = summary.mastery ?? 0, completed = summary.completed ?? 0, questions = summary.questions ?? 0;
  const domainRows = aggregateByDomain(masteryState, knowledgeNodes);

  root.innerHTML = `<section class="portal-page cg-dash-page">
    <div class="portal-hero">
      <div><div class="portal-eyebrow">LEARNING ANALYTICS</div><h1 class="portal-title">学习看板</h1><p class="portal-subtitle">掌握度按知识域计算，与"完成度"分开呈现。</p></div>
      <div class="portal-actions"><button class="portal-btn" data-home>⌂ 首页</button></div>
    </div>
    <div class="cg-stats" style="margin-bottom:20px">
      <div class="cg-stat"><b>${completed}</b><span>已完成课程</span></div>
      <div class="cg-stat"><b>${mastery}%</b><span>总体掌握度</span></div>
      <div class="cg-stat"><b>${questions}</b><span>累计答题</span></div>
      <div class="cg-stat"><b>${weakPoints.length}</b><span>待补练薄弱点</span></div>
    </div>
    <div class="cg-dashgrid">
      <div class="cg-card">
        <h3>知识域掌握度</h3>
        ${domainRows.length ? domainRows.map(row => `<div class="cg-mrow"><div class="cg-mname">${escapeHtml(row.label)}</div><div class="cg-mtrack"><div class="cg-mfill" style="width:${Math.round(row.value * 100)}%;background:${row.color}"></div></div><div class="cg-mval">${(row.value).toFixed(2)}</div></div>`).join('') : '<p class="portal-muted">还没有足够的答题证据，完成几次练习后会显示分知识域掌握度。</p>'}
      </div>
      <div class="cg-card">
        <h3>薄弱点 · 建议优先补练</h3>
        ${weakPoints.length ? weakPoints.slice(0, 8).map(w => { const name = typeof w === 'string' ? w : (w.name || w.id || ''); const id = typeof w === 'string' ? w : (w.id || ''); return `<div class="cg-weak"><div class="cg-wdot"></div><div class="cg-wname">${escapeHtml(name)}</div>${id ? `<button type="button" class="cg-wact" data-quiz="${escapeHtml(id)}">补练 →</button>` : ''}</div>`; }).join('') : '<p class="portal-muted">暂无明显薄弱点，继续保持。</p>'}
      </div>
    </div>
  </section>`;

  root.querySelectorAll('[data-home]').forEach(b => b.addEventListener('click', onHome));
  root.querySelectorAll('[data-quiz]').forEach(b => b.addEventListener('click', () => onQuiz(b.dataset.quiz)));
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
