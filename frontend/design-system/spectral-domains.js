/**
 * Shared domain → spectral-color mapping.
 * The six CSS custom properties (--spec-violet/blue/green/yellow/orange/red)
 * come from frontend/themes/spectral-glow-theme.css and are grounded in real
 * emission-spectrum wavelengths (Hg 435 / Hb 486 / O 558 / Na-D 589 / Ne 640 / Ha 656).
 * This module buckets the two real vocabularies used in the content data —
 * knowledge-graph node `domain` (18 values) and curriculum `module` id (6 values) —
 * onto those six colors so the same color always means the same subject area
 * across course, lab, quiz, knowledge-graph and dashboard.
 */

export const SPECTRAL_VARS = {
  violet: 'var(--spec-violet)',
  blue: 'var(--spec-blue)',
  green: 'var(--spec-green)',
  yellow: 'var(--spec-yellow)',
  orange: 'var(--spec-orange)',
  red: 'var(--spec-red)',
};

// content/knowledge/knowledge-graph.json node.domain -> bucket
const KNOWLEDGE_DOMAIN_BUCKET = {
  fundamentals: 'violet', substance: 'violet', measurement: 'violet', skill: 'violet', assessment: 'violet', review: 'violet',
  'acid-base': 'blue',
  life: 'green',
  salt: 'yellow', fertilizer: 'yellow',
  metal: 'orange', material: 'orange',
  reaction: 'red', equation: 'red', law: 'red', experiment: 'red', application: 'red', calculation: 'red',
};

// modules/lessons/manifest.json module id -> bucket
const CURRICULUM_MODULE_BUCKET = {
  'module-acid-base': 'blue',
  'module-salt-fert': 'yellow',
  'module-metal': 'orange',
  'module-equation': 'red',
  'module-life': 'green',
  'module-review': 'violet',
};

export function knowledgeDomainColor(domain) {
  return SPECTRAL_VARS[KNOWLEDGE_DOMAIN_BUCKET[domain]] || SPECTRAL_VARS.violet;
}

export function curriculumModuleColor(moduleId) {
  return SPECTRAL_VARS[CURRICULUM_MODULE_BUCKET[moduleId]] || SPECTRAL_VARS.violet;
}
