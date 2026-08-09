// Knowledge Registry
// Central registry for chemistry knowledge nodes

const registry = new Map();

export function registerKnowledge(node) {
  if (!node || !node.id) return false;
  registry.set(node.id, node);
  return true;
}

export function registerMany(nodes = []) {
  nodes.forEach(registerKnowledge);
  return registry.size;
}

export function getKnowledge(id) {
  return registry.get(id);
}

export function getAllKnowledge() {
  return Array.from(registry.values());
}

export function clearRegistry() {
  registry.clear();
}
