// Knowledge Graph Query Layer

import { getKnowledge, getAllKnowledge } from './knowledge-registry.js';

export function queryKnowledge(id) {
  return getKnowledge(id);
}

export function searchKnowledge(keyword = '') {
  const text = keyword.toLowerCase();

  return getAllKnowledge().filter(node => {
    return (node.name || '').toLowerCase().includes(text);
  });
}
