/**
 * ChemLab application bootstrap.
 * The bootstrapper owns DOM mounting only; application.start() owns routing
 * and background content hydration so the UI never waits on the content graph.
 */
import { createAppState } from './state.js';
import { createApplication } from './application.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';
import { mountPortalShell, syncPortalNavigation } from '../frontend/shell/portal-shell.js';

const state = createAppState();
let bootstrapPromise = null;

function getDefaultRoot() {
  if (typeof document === 'undefined') return null;
  return document.querySelector('#app-root');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderStartupError(root, error) {
  if (!root) return;
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error('ChemLab bootstrap failed:', error);
  root.innerHTML = `
    <section class="page startup-error">
      <header class="page-header">
        <h1>ChemLab-G9</h1>
        <p>学习平台启动失败。</p>
      </header>
      <div class="startup-error__body">
        <p>请刷新页面后重试；如果问题持续存在，可展开技术诊断信息。</p>
        <button type="button" onclick="location.reload()">重新加载</button>
        <details open><summary>技术诊断</summary><pre>${escapeHtml(message)}</pre></details>
      </div>
    </section>`;
}

export async function bootstrap({ root = getDefaultRoot() } = {}) {
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = (async () => {
    const pageRoot = mountPortalShell(root) || root;
    const application = createApplication({ state, assessment: assessmentEngine, experimentEngine, root: pageRoot });

    try {
      application.start();
      if (typeof window !== 'undefined') {
        const sync = () => syncPortalNavigation(root, application.router.current());
        window.addEventListener('hashchange', sync);
        sync();
      }
    } catch (error) {
      state.contentLoadError = error;
      renderStartupError(pageRoot, error);
    }

    if (typeof window !== 'undefined') {
      window.chemLabApplication = application;
      window.chemLabState = state;
    }
    return application;
  })();
  return bootstrapPromise;
}

export { state };

function startWhenReady() {
  bootstrap().catch(error => {
    console.error('ChemLab bootstrap failed:', error);
    renderStartupError(getDefaultRoot(), error);
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWhenReady, { once: true });
  } else {
    startWhenReady();
  }
}
