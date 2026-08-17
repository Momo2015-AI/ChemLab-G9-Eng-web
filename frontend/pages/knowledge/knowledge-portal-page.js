import { knowledgeDomainColor, SPECTRAL_VARS } from '../../design-system/spectral-domains.js';

const DOMAIN_LABEL = {
  violet: '基础/综合', blue: '酸碱', green: '生活应用',
  yellow: '盐/化肥', orange: '金属/材料', red: '反应/方程式',
};
const TYPE_LABEL = { prerequisite: '前置知识', related: '相关知识点', experiment: '关联实验', question: '关联题目', commonMistake: '常见错误' };

function bucketOf(domain) {
  const color = knowledgeDomainColor(domain);
  return Object.entries(SPECTRAL_VARS).find(([, v]) => v === color)?.[0] || 'violet';
}

// 80+ 个真实节点没有预置坐标，这里按学科域分成六个扇区、按序号分环，
// 是确定性布局（同一份数据永远长一个样子），不依赖物理模拟库。
function layout(nodes) {
  const buckets = ['violet', 'blue', 'green', 'yellow', 'orange', 'red'];
  const grouped = buckets.map(b => nodes.filter(n => bucketOf(n.domain) === b));
  const cx = 300, cy = 225;
  const positioned = [];
  grouped.forEach((group, gi) => {
    const sectorStart = (gi / buckets.length) * Math.PI * 2 - Math.PI / 2;
    const sectorSpan = (Math.PI * 2) / buckets.length * 0.86;
    group.forEach((node, i) => {
      const ring = 70 + (i % 3) * 45;
      const angle = sectorStart + (group.length > 1 ? (i / (group.length - 1 || 1)) * sectorSpan : sectorSpan / 2);
      positioned.push({ ...node, bucket: buckets[gi], x: Math.round(cx + Math.cos(angle) * ring), y: Math.round(cy + Math.sin(angle) * ring) });
    });
  });
  return positioned;
}

export function renderKnowledgePortal({ root, nodes = [], relations = [], lessons = [], onHome = () => { window.location.hash = 'home'; }, onLearn = () => {}, onSelectNode = () => {}, scope = 'term', scopeTerm = 'upper', allCount = 0, onScope = null } = {}) {
  if (!root) return;
  const laidOut = layout(nodes);
  const byId = new Map(laidOut.map(n => [n.id, n]));
  const lessonByPoint = new Map();
  for (const lesson of lessons) {
    for (const point of (lesson.knowledgePoints || [])) {
      if (!lessonByPoint.has(point)) lessonByPoint.set(point, lesson.id || lesson.canonicalId);
    }
  }
  const scopeBtn = typeof onScope === 'function'
    ? `<button class="portal-btn" data-scope>${scope === 'term' ? `查看全学年 (${allCount})` : `只看${scopeTerm === 'lower' ? '下' : '上'}册`}</button>`
    : '';

  root.innerHTML = `<section class="portal-page cg-graph-page">
    <div class="portal-hero">
      <div><div class="portal-eyebrow">KNOWLEDGE GRAPH</div><h1 class="portal-title">知识图谱</h1><p class="portal-subtitle">${nodes.length} 个知识点 · 点击节点查看定义、前置知识与常见误解</p></div>
      <div class="portal-actions">${scopeBtn}<button class="portal-btn" data-home>⌂ 首页</button></div>
    </div>
    <div class="cg-legend-row">${Object.entries(DOMAIN_LABEL).map(([b, label]) => `<span class="cg-chip" style="--c:${SPECTRAL_VARS[b]}"><i></i>${label}</span>`).join('')}</div>
    <div class="cg-graphwrap">
      <div class="cg-graphbox">
        <input class="cg-gsearch" type="search" placeholder="搜索知识点…" data-search>
        <svg viewBox="0 0 600 450" id="cg-svg"></svg>
      </div>
    </div>
  </section>`;

  root.querySelector('[data-home]')?.addEventListener('click', onHome);
  root.querySelector('[data-scope]')?.addEventListener('click', () => onScope?.(scope === 'term' ? 'all' : 'term'));

  const svg = root.querySelector('#cg-svg');
  const svgns = 'http://www.w3.org/2000/svg';

  laidOut.forEach(n => {
    const g = document.createElementNS(svgns, 'g');
    g.setAttribute('class', 'cg-gnode');
    g.style.color = SPECTRAL_VARS[n.bucket];
    g.dataset.id = n.id;
    const c = document.createElementNS(svgns, 'circle');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 9);
    c.setAttribute('fill', SPECTRAL_VARS[n.bucket]); c.setAttribute('fill-opacity', '0.85');
    g.appendChild(c);
    const t = document.createElementNS(svgns, 'text');
    t.setAttribute('x', n.x); t.setAttribute('y', n.y + 20); t.setAttribute('text-anchor', 'middle');
    t.textContent = n.name?.length > 8 ? n.name.slice(0, 7) + '…' : n.name || n.id;
    g.appendChild(t);
    g.addEventListener('click', () => onSelectNode(n.id));
    svg.appendChild(g);
  });

  root.querySelector('[data-search]')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    root.querySelectorAll('.cg-gnode').forEach(g => {
      const n = byId.get(g.dataset.id);
      const match = !q || (n?.name || '').toLowerCase().includes(q);
      g.style.opacity = match ? '1' : '.15';
    });
  });
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
