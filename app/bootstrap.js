/**
 * ChemLab V2.0 application bootstrap.
 *
 * Startup is deliberately staged so GitHub Pages can fail visibly instead of
 * leaving the initial loading placeholder on screen.
 */

import { createAppState } from './state.js';
import { createApplication } from './application.js';
import { createRemediationCatalog } from '../core/diagnosis/remediation-catalog.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';
// bootstrap.js lives under /app; the portal shell lives at /frontend.
// This relative path is required for browser module resolution on GitHub Pages.
import { mountPortalShell, syncPortalNavigation } from '../frontend/shell/portal-shell.js';

const state = createAppState();

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
        <details open>
          <summary>技术诊断</summary>
          <pre>${escapeHtml(message)}</pre>
        </details>
      </div>
    </section>`;
}

export async function bootstrap({ root = getDefaultRoot() } = {}) {
  const pageRoot = mountPortalShell(root) || root;
  const application = createApplication({
    state,
    assessment: assessmentEngine,
    experimentEngine,
    root: pageRoot,
  });

  try {
    const data = await application.contentService.load();
    application.controllers.learning.remediationCatalog = createRemediationCatalog(data);
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
}

export { state };

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(error => {
      console.error('ChemLab bootstrap failed:', error);
      renderStartupError(document.querySelector('#app-root'), error);
    });
  });
}
