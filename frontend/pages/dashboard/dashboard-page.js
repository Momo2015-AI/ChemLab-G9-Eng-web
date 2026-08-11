export function renderDashboard(container) {
  container.innerHTML = `
    <section class="glow-card dashboard-page">
      <header>
        <h2>学习驾驶舱</h2>
        <p>ChemLab Grade 9 Chemistry Portal</p>
      </header>
      <div class="dashboard-grid">
        <article class="glow-card">今日任务</article>
        <article class="glow-card">知识掌握度</article>
        <article class="glow-card">AI 学习建议</article>
      </div>
    </section>
  `;
}
