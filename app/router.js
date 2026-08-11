/**
 * ChemLab-G9 V1.7 Application Router
 * Single source of truth for SPA navigation.
 */

const ROUTES = new Set(['home', 'course', 'graph', 'dashboard', 'quiz', 'experiment', 'experiment-result', 'result', 'remediation']);

const hasWindow = () => typeof window !== 'undefined';

function parseHash(hash = hasWindow() ? window.location.hash : '') {
  const value = hash.replace(/^#/, '') || 'home';
  const [page, ...parts] = value.split('/');
  return { page: ROUTES.has(page) ? page : 'home', params: parts };
}

export function createRouter({ render, onRoute } = {}) {
  let started = false;

  const handleRoute = () => {
    const route = parseHash();
    onRoute?.(route);
    render?.(route);
  };

  return {
    start() {
      if (started || !hasWindow()) return;
      started = true;
      window.addEventListener('hashchange', handleRoute);
      handleRoute();
    },
    navigate(page, ...params) {
      const safePage = ROUTES.has(page) ? page : 'home';
      const suffix = params.filter(Boolean).join('/');
      if (!hasWindow()) return;
      window.location.hash = suffix ? `${safePage}/${suffix}` : safePage;
    },
    current() {
      return parseHash();
    },
    stop() {
      if (hasWindow()) window.removeEventListener('hashchange', handleRoute);
      started = false;
    }
  };
}

export { parseHash, ROUTES };
