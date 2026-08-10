/** V1.7 Knowledge Graph View — presentation only. */
export function renderGraph({ root, graph = {} } = {}) {
  if (!root) return;
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  root.innerHTML = `<section class="page graph-page"><header class="page-header"><h1>Knowledge map</h1><p>Explore how chemistry ideas connect.</p></header><div class="knowledge-map">${nodes.map(node => `<article data-node-id="${escapeAttr(node.id || '')}"><h2>${escapeHtml(node.title || node.name || node.id || '')}</h2><p>${escapeHtml(node.description || '')}</p></article>`).join('')}</div></section>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function escapeAttr(value) { return escapeHtml(value); }
