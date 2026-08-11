export function createMissionCard(mission = {}) {
  return `
    <section class="dashboard-card mission-card">
      <h3>今日任务</h3>
      <p>${mission.title ?? '完成今日化学学习任务'}</p>
      <button>${mission.action ?? '开始学习'}</button>
    </section>
  `;
}
