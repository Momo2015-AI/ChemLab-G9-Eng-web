/**
 * V1.7 Graph View — knowledge graph with module cards, learning path tree, and node detail.
 */

import { MODULE_CONFIG, getNodesByModule, computeModuleMastery } from './constants.js';

export function renderGraph({ root, data = {} } = {}) {
  if (!root) return;
  const {
    knowledgeGraph = null,
    progress = {},
    viewMode = 'modules',
    selectedModule = null,
    selectedNode = null,
  } = data;

  const nodes = knowledgeGraph?.nodes || [];
  const edges = knowledgeGraph?.edges || [];

  if (viewMode === 'path' && selectedModule) {
    renderGraphPath(root, nodes, edges, selectedModule, progress);
  } else if (viewMode === 'detail' && selectedNode) {
    renderGraphNode(root, nodes, edges, selectedNode, progress, knowledgeGraph);
  } else {
    renderGraphModules(root, nodes, edges, progress);
  }
}

function renderGraphModules(root, nodes, edges, progress) {
  const moduleIds = Object.keys(MODULE_CONFIG);
  const moduleHtml = moduleIds.map(modId => {
  const cfg = MODULE_CONFIG[modId];
  const modNodes = getNodesByModule(nodes, modId);
  const mastery = computeModuleMastery(nodes, modId, progress);
    const weak = modNodes.filter(n => (progress?.mastery?.[n.id]?.score || 0) < 0.5).length;
    const expCount = edges.filter(e => e.type === 'experiment' && modNodes.some(n => n.id === e.from)).length;
    const color = mastery >= 80 ? '#2e9e63' : mastery >= 50 ? '#f59e0b' : '#ef4444';
    return `<div class="module-card" data-action="go-graph-path" data-module="${modId}" style="--accent:${cfg.color}">
      <div class="module-icon" style="background:${cfg.color}20;color:${cfg.color}">${cfg.name[0]}</div>
      <div class="module-info">
        <div class="module-name">${esc(cfg.name)}</div>
        <div class="module-meta">${modNodes.length} 知识点 · ${expCount} 实验</div>
      </div>
      <div class="module-mastery">
        <div class="mastery-ring" style="--mastery:${mastery}%;--color:${color}">
          <svg viewBox="0 0 36 36">
            <path d="M18 2.037a15.963 15.963 0 1 1 0 31.926 15.963 15.963 0 0 1 0-31.926" fill="none" stroke="#e2e8f0" stroke-width="3"/>
            <path d="M18 2.037a15.963 15.963 0 1 1 0 31.926 15.963 15.963 0 0 1 0-31.926" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="${mastery} 100"/>
            <text x="18" y="20" text-anchor="middle" fill="${color}" font-size="10" font-weight="700">${mastery}%</text>
          </svg>
        </div>
        ${weak > 0 ? `<span class="weak-badge">薄弱 ${weak}</span>` : ''}
      </div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="page graph-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link active" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <div class="graph-header">
          <h2>知识地图</h2>
          <p class="graph-subtitle">点击模块查看学习路径</p>
        </div>
        <div class="module-grid">${moduleHtml}</div>
        <div class="kg-legend">
          <div class="legend-item"><span class="legend-dot" style="background:#2e9e63"></span>掌握 >=80%</div>
          <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>掌握 >=50%</div>
          <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>掌握 <50%</div>
        </div>
      </div>
    </div>`;
}

function renderGraphPath(root, nodes, edges, modId, progress) {
  const cfg = MODULE_CONFIG[modId];
  const modNodes = getNodesByModule(nodes, modId);
  const modEdges = edges.filter(e => modNodes.some(n => n.id === e.from) && modNodes.some(n => n.id === e.to));
  const prereqs = modEdges.filter(e => e.type === 'prerequisite');
  const roots = modNodes.filter(n => !prereqs.some(e => e.to === n.id));

  function buildTree(nodeId, depth = 0) {
    const node = modNodes.find(n => n.id === nodeId);
    if (!node) return '';
    const mastery = progress?.mastery?.[nodeId]?.score || 0;
    const color = mastery >= 0.8 ? '#2e9e63' : mastery >= 0.5 ? '#f59e0b' : '#ef4444';
    const children = prereqs.filter(e => e.from === nodeId).map(e => e.to);
    const isCompleted = mastery >= 0.8;
    const isLocked = mastery === 0 && children.length > 0;
    const childrenHtml = children.map(c => buildTree(c, depth + 1)).join('');
    return `<div class="tree-node" style="margin-left:${depth * 24}px;${isLocked ? 'opacity:0.5' : ''}">
      <div class="tree-dot" style="background:${color};${isCompleted ? 'box-shadow:0 0 0 3px ' + color + '40' : ''}" data-action="go-graph-node" data-node="${esc(nodeId)}"></div>
      <div class="tree-label" data-action="go-graph-node" data-node="${esc(nodeId)}">${esc(node.name)}</div>
      ${childrenHtml}
    </div>`;
  }

  const treeHtml = roots.map(r => buildTree(r.id, 0)).join('');

  root.innerHTML = `
    <div class="page graph-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link active" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <div class="graph-header">
          <button class="btn-back" data-action="go-graph-modules">← 返回</button>
          <h2>${esc(cfg.name)}</h2>
          <span class="module-badge" style="background:${cfg.color}20;color:${cfg.color}">${modNodes.length} 知识点</span>
        </div>
        <div class="path-container">
          <div class="path-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#2e9e63"></span>已掌握</div>
            <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>学习中</div>
            <div class="legend-item"><span class="legend-dot" style="background:#94a3b8"></span>未开始</div>
          </div>
          <div class="tree-view">${treeHtml}</div>
        </div>
      </div>
    </div>`;
}

function renderGraphNode(root, nodes, edges, nodeId, progress, knowledgeGraph) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) { renderGraphModules(root, nodes, edges, progress); return; }

  const mastery = progress?.mastery?.[nodeId]?.score || 0;
  const color = mastery >= 0.8 ? '#2e9e63' : mastery >= 0.5 ? '#f59e0b' : '#ef4444';
  const prereqs = edges.filter(e => e.to === nodeId && e.type === 'prerequisite');
  const related = edges.filter(e => (e.from === nodeId || e.to === nodeId) && e.type === 'related');
  const experiments = edges.filter(e => (e.from === nodeId || e.to === nodeId) && e.type === 'experiment');
  const parentNode = prereqs.length > 0 ? nodes.find(n => n.id === prereqs[0].from) : null;
  const childNodes = edges.filter(e => e.from === nodeId && e.type === 'prerequisite')
    .map(e => nodes.find(n => n.id === e.to)).filter(Boolean);

  const childNames = childNodes.map(n => esc(n.name)).join(', ');
  const parentName = parentNode ? esc(parentNode.name) : '';

  root.innerHTML = `
    <div class="page graph-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link active" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <div class="graph-header">
          <button class="btn-back" data-action="go-graph-back">← 返回</button>
          <h2>${esc(node.name)}</h2>
        </div>
        <div class="node-detail">
          <div class="node-main">
            <div class="node-mastery-circle" style="--color:${color}">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="${color}" stroke-width="8"
                  stroke-dasharray="${mastery * 314 / 100} 314" stroke-linecap="round" transform="rotate(-90 60 60)"/>
                <text x="60" y="55" text-anchor="middle" fill="${color}" font-size="24" font-weight="700">${Math.round(mastery * 100)}%</text>
                <text x="60" y="75" text-anchor="middle" fill="var(--muted)" font-size="11">掌握度</text>
              </svg>
            </div>
            <div class="node-info">
              ${parentNode ? `<div class="node-prereq">前置: <span>${parentName}</span></div>` : '<div class="node-prereq">基础知识点</div>'}
              ${childNodes.length > 0 ? `<div class="node-children">后续: <span>${childNames}</span></div>` : ''}
            </div>
          </div>
          <div class="node-actions">
            ${experiments.length > 0
              ? `<button class="btn-secondary" data-action="go-experiment" data-exp="${esc(experiments[0].to || experiments[0].from || '')}">相关实验</button>`
              : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
