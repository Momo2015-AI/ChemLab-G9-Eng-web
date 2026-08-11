export function createAppShell({ title = 'ChemLab-G9' } = {}) {
  const element = document.createElement('section');
  element.className = 'app-shell';
  element.innerHTML = `
    <header class="app-header">
      <h1>${title}</h1>
    </header>
    <main class="app-content"></main>
  `;
  return element;
}
