/**
 * HTML escaping helper shared by views and bootstrappers. Centralised to
 * guarantee one consistent mapping across the codebase; previously the
 * same function was duplicated in quiz-view, v19-course-view and
 * bootstrap.js with identical behaviour.
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
