export function createProgressCard(progress = {}) {
  return `
    <section class="dashboard-card progress-card">
      <h3>学习进度</h3>
      <div class="metric">${progress.percent ?? 0}%</div>
      <p>${progress.completed ?? 0} 个学习任务已完成</p>
    </section>
  `;
}
