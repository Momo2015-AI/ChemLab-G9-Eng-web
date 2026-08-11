export function renderDashboard(container) {
  container.innerHTML = `
    <section class="dashboard">
      <h2>学习驾驶舱</h2>
      <div class="dashboard-grid">
        <article>今日任务</article>
        <article>知识掌握度</article>
        <article>推荐学习</article>
      </div>
    </section>
  `;
}
