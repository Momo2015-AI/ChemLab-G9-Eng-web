/**
 * ChemLab V2.0 application bootstrap.
 * The learning engine and composition root remain the production runtime;
 * the portal shell is an experience layer around the existing page runtime.
 */

import { createAppState } from './state.js';
import { createApplication } from './application.js';
import { createRemediationCatalog } from '../core/diagnosis/remediation-catalog.js';
import assessmentEngine from '../engine/assessment-engine.js';
import experimentEngine from '../engine/experiment-engine.js';
import { mountPortalShell, syncPortalNavigation } from '../frontend/shell/portal-shell.js';

const state = createAppState();

function getDefaultRoot() {
  if (typeof document === 'undefined') return null;
  return document.querySelector('#app-root');
}

function renderStartupError(root, error) {
  if (!root) return;
  const message = error instanceof Error ? error.message : String(error);
  console.error('ChemLab content bootstrap failed:', error);
  root.innerHTML = `
    <section class="page startup-error">
      <header class="page-header">
        <h1>ChemLab-G9</h1>
        <p>本次页面加载的内容资源未能完整加载。</p>
      </header>
      <div class="startup-error__body">
        <p>学习平台外壳已经启动。请刷新页面后重试。</p>
        <details>
          <summary>技术诊断</summary>
          <pre>${String(message).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]))}</pre>
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

  application.start();

  if (typeof window !== 'undefined') {
    const sync = () => syncPortalNavigation(root, application.router.current());
    window.addEventListener('hashchange', sync);
    sync();
  }

  try {
    const data = await application.contentService.load();
    application.controllers.learning.remediationCatalog = createRemediationCatalog(data);
  } catch (error) {
    renderStartupError(pageRoot, error);
    application.state.contentLoadError = error;
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
      const root = document.querySelector('#app-root');
      if (root) root.textContent = 'ChemLab failed to start. Please refresh and try again.';
    });
  });
}
