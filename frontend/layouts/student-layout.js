export function createStudentLayout(content = '') {
  return `
    <section class="student-layout">
      <header class="student-header">
        <h1>ChemLab-G9</h1>
        <span>九年级化学智能学习平台</span>
      </header>
      <main class="student-main">
        ${content}
      </main>
    </section>
  `;
}
