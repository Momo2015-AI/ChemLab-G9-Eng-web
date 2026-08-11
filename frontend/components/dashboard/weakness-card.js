export function createWeaknessCard(points = []) {
  return `
    <section class="dashboard-card weakness-card">
      <h3>待加强知识点</h3>
      <div>${points.length ? points.join('、') : '暂无诊断结果'}</div>
    </section>
  `;
}
