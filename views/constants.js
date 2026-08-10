/**
 * Shared module configuration for knowledge graph and course views.
 */
export const MODULE_CONFIG = {
  'module-acid-base': { name: '酸和碱', color: '#146c6e', order: 1, prefixes: ['acid', 'base', 'ph', 'neutralization'] },
  'module-salt-fert': { name: '盐 化肥', color: '#2563eb', order: 2, prefixes: ['salt', 'fertilizer', 'compound'] },
  'module-metal': { name: '金属和金属矿物', color: '#7c3aed', order: 3, prefixes: ['metal', 'iron', 'mass', 'alloy', 'ore'] },
  'module-equation': { name: '化学方程式', color: '#dc2626', order: 4, prefixes: ['equation'] },
  'module-life': { name: '化学与生活', color: '#16a34a', order: 5, prefixes: ['nutrition', 'material', 'organic', 'environment', 'eco', 'organics', 'polymer', 'matter'] },
  'module-review': { name: '综合提升', color: '#d97706', order: 6, prefixes: ['unit', 'exam', 'lab', 'gas', 'quant', 'oxygen', 'stoichiometry'] },
};

export function getNodesByModule(nodes, modId) {
  const cfg = MODULE_CONFIG[modId];
  if (!cfg) return [];
  const result = nodes.filter(n => cfg.prefixes.some(p => n.id.startsWith(p)));
  if (modId === 'module-review') {
    const orphans = ['chem-fundamentals', 'chem-symbol'];
    orphans.forEach(id => {
      const n = nodes.find(x => x.id === id);
      if (n && !result.find(r => r.id === n.id)) result.push(n);
    });
  }
  return result;
}

export function computeModuleMastery(nodes, modId, progress) {
  const modNodes = getNodesByModule(nodes, modId);
  if (!modNodes.length) return 0;
  return Math.round(modNodes.reduce((s, n) => s + (progress?.mastery?.[n.id]?.score || 0), 0) / modNodes.length * 100);
}

export function computeDayMastery(day, progress) {
  const kp = day.knowledgePoints || [];
  if (!kp.length) return 0;
  return Math.round(kp.reduce((s, k) => s + (progress?.mastery?.[k]?.score || 0), 0) / kp.length * 100);
}
