/**
 * V1.7 Dashboard View — learning stats, skill bars, and recommendations.
 */

export function renderDashboard({ root, data = {} } = {}) {
  if (!root) return;
  const {
    totalQuizzes = 0,
    avgScore = 0,
    masteredCount = 0,
    learningCount = 0,
    weakCount = 0,
    skillBars = [],
    recommendations = [],
  } = data;

  root.innerHTML = `
    <div class="page dashboard-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link active" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <h2 style="margin-bottom:20px">学情诊断</h2>
        <div class="dash-stats">
          <div class="dash-stat"><span class="num">${totalQuizzes}</span><span class="label">已完成测试</span></div>
          <div class="dash-stat"><span class="num">${avgScore}%</span><span class="label">平均正确率</span></div>
          <div class="dash-stat"><span class="num">${masteredCount}</span><span class="label">已掌握知识点</span></div>
          <div class="dash-stat"><span class="num">${learningCount + weakCount}</span><span class="label">待强化知识点</span></div>
        </div>
        <div class="dash-grid">
          <div class="dash-card">
            <h3>知识点掌握度</h3>
            <div class="skill-bars">
              ${skillBars.length
                ? skillBars.map(s => `<div class="skill-row">
                    <span class="skill-name">${esc(s.name)}</span>
                    <div class="skill-bar"><div class="skill-fill" style="width:${s.score}%;background:${s.score >= 80 ? '#2e9e63' : s.score >= 50 ? '#f59e0b' : '#ef4444'}"></div></div>
                    <span class="skill-score">${s.score}%</span>
                  </div>`).join('')
                : '<p style="color:var(--muted);font-size:13px">暂无数据，开始答题后这里会显示掌握度。</p>'}
            </div>
          </div>
          <div class="dash-card">
            <h3>推荐学习</h3>
            <div class="recommend-list">
              ${recommendations.length
                ? recommendations.map(r => `<div class="rec-item" data-action="start-quiz-by-node" data-node="${esc(r.id)}">
                    <span class="rec-name">${esc(r.name)}</span>
                    <span class="rec-score" style="color:${r.score >= 50 ? '#f59e0b' : '#ef4444'}">${r.score}%</span>
                  </div>`).join('')
                : '<p style="color:var(--muted)">所有知识点已掌握！</p>'}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
