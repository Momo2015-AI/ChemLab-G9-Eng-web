export const routes = {
  '/dashboard': 'DashboardPage',
  '/course': 'CoursePage',
  '/lab': 'VirtualLabPage',
  '/knowledge-map': 'KnowledgeMapPage',
  '/assessment': 'AssessmentPage',
  '/progress': 'ProgressPage',
  '/ai-tutor': 'AITutorPage',
  '/settings': 'SettingsPage'
};

export function resolveRoute(path) {
  return routes[path] || routes['/dashboard'];
}
