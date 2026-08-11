export function createMasteryCard(mastery = {}) {
  return `
    <section class="dashboard-card mastery-card">
      <h3>知识掌握度</h3>
      <div class="metric">${mastery.level ?? '学习中'}</div>
      <p>${mastery.focus ?? '继续完成知识训练'}</p>
    </section>
  `;
}
