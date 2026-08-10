/**
 * ChemLab-G9 V1.6 Router
 * Hash-based SPA routing
 */
export function initRouter(app) {
  function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const page = hash.split('/')[0];
    const param = hash.split('/')[1];
    switch (page) {
      case 'home': app.goHome(); break;
      case 'course': app.goCourse(); break;
      case 'graph': app.goGraph(); break;
      case 'dashboard': app.goDashboard(); break;
      case 'quiz':
        if (param) app.startQuiz(param);
        else app.goCourse();
        break;
      default: app.goHome();
    }
  }
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function navigate(page, param) {
  window.location.hash = param ? `${page}/${param}` : page;
}
