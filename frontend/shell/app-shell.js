import { menuItems } from '../navigation/menu.js';

export function renderAppShell(content = '') {
  const nav = menuItems.map(item => `
    <a class="chem-nav-item" href="${item.path}">
      ${item.label}
    </a>`).join('');

  return `
    <div class="chem-shell">
      <aside class="chem-sidebar">
        <h1>⚗ ChemLab</h1>
        <nav>${nav}</nav>
      </aside>
      <section class="chem-main">
        <header class="chem-header">九年级化学智能学习平台</header>
        <main>${content}</main>
      </section>
    </div>`;
}
