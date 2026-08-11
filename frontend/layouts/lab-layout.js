export function createLabLayout(content = '') {
  return `
    <section class="lab-layout">
      <aside class="instrument-panel">
        仪器区
      </aside>
      <main class="experiment-workspace">
        ${content}
      </main>
      <aside class="ai-hint-panel">
        AI 提示区
      </aside>
    </section>
  `;
}
