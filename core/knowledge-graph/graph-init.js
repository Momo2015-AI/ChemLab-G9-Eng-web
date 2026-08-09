// Knowledge Graph Initialization

import { registerMany } from './knowledge-registry.js';

export function initializeGraph(knowledgeModules = []) {
  const nodes = knowledgeModules.flatMap(module => {
    if (Array.isArray(module)) return module;
    return module?.nodes || [];
  });

  return registerMany(nodes);
}
