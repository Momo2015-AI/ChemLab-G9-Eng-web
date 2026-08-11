export function createRecommendationCard(items = []) {
  return `
    <section class="dashboard-card recommendation-card">
      <h3>推荐学习</h3>
      <ul>
        ${items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `;
}
