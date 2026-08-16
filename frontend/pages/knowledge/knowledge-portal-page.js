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

export function renderKnowledgePortal({ root, nodes = [], relations = [], lessons = [], onHome = () => { window.location.hash = 'home'; }, onLearn = () => {}, scope = 'term', scopeTerm = 'upper', allCount = 0, onScope = null } = {}) {
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
      <div><div class="portal-eyebrow">KNOWLEDGE GRAPH</div><h1 class="portal-title">知识图谱</h1><p class="portal-subtitle">${nodes.length} 个知识点 · ${scope === 'term' ? `${scopeTerm === 'lower' ? '下' : '上'}册范围` : '全学年范围'} · 点击节点查看前置知识、关联实验与题目</p></div>
      <div class="portal-actions">${scopeBtn}<button class="portal-btn" data-home>⌂ 首页</button></div>
    </div>
    <div class="cg-legend-row">${Object.entries(DOMAIN_LABEL).map(([b, label]) => `<span class="cg-chip" style="--c:${SPECTRAL_VARS[b]}"><i></i>${label}</span>`).join('')}</div>
    <div class="cg-graphwrap">
      <div class="cg-graphbox">
        <input class="cg-gsearch" type="search" placeholder="搜索知识点…" data-search>
        <svg viewBox="0 0 600 450" id="cg-svg"></svg>
      </div>
      <div class="cg-gpanel" id="cg-panel"><div class="cg-gp-empty">点击左侧任意节点<br>查看知识点详情</div></div>
    </div>
  </section>`;

  root.querySelector('[data-home]')?.addEventListener('click', onHome);
  root.querySelector('[data-scope]')?.addEventListener('click', () => onScope?.(scope === 'term' ? 'all' : 'term'));

  const svg = root.querySelector('#cg-svg');
  const panel = root.querySelector('#cg-panel');
  const svgns = 'http://www.w3.org/2000/svg';
  let edgeLayer = document.createElementNS(svgns, 'g');
  svg.appendChild(edgeLayer);

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
    g.addEventListener('click', () => selectNode(n.id));
    svg.appendChild(g);
  });

  function selectNode(id) {
    const node = byId.get(id);
    if (!node) return;
    root.querySelectorAll('.cg-gnode').forEach(g => g.classList.toggle('sel', g.dataset.id === id));
    const linked = relations.filter(r => r.source === id || r.target === id);
    edgeLayer.innerHTML = '';
    linked.forEach(r => {
      const a = byId.get(r.source), b = byId.get(r.target);
      if (!a || !b) return;
      const line = document.createElementNS(svgns, 'line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('class', 'cg-gedge');
      edgeLayer.appendChild(line);
    });
    const byType = {};
    linked.forEach(r => {
      const other = r.source === id ? r.target : r.source;
      (byType[r.type] ||= []).push(r.type === 'experiment' || r.type === 'question' ? other : (byId.get(other)?.name || other));
    });
    panel.innerHTML = `
      <span class="cg-chip" style="--c:${SPECTRAL_VARS[node.bucket]}"><i></i>${DOMAIN_LABEL[node.bucket]}</span>
      <h4>${escapeHtml(node.name || node.id)}</h4>
      ${node.chapter ? `<p class="portal-muted">${escapeHtml(node.chapter)}</p>` : ''}
      ${Object.entries(TYPE_LABEL).map(([type, label]) => `<div class="cg-gp-row"><h5>${label}</h5><ul>${(byType[type]?.length ? byType[type] : ['—']).slice(0, 6).map(x => `<li>${escapeHtml(String(x))}</li>`).join('')}</ul></div>`).join('')}
      ${lessonByPoint.has(node.id) ? `<button type="button" class="portal-btn cg-learn-btn" data-learn>去学习这个知识点 →</button>` : ''}
    `;
    root.querySelector('[data-learn]')?.addEventListener('click', () => onLearn(lessonByPoint.get(node.id)));
  }

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
