const routes = {
  dashboard: 'dashboard',
  learning: 'learning',
  lab: 'lab',
  assessment: 'assessment',
  knowledge: 'knowledge'
};

export function resolveFrontendRoute(name) {
  return routes[name] || routes.dashboard;
}
