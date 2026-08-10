/**
 * V1.7 Home View — full rendering with nav, hero, course grid, progress.
 * Receives pre-fetched data; owns no persistence or data fetching.
 */

import { MODULE_CONFIG, computeDayMastery } from './constants.js';

export function renderHome({ root, data = {} } = {}) {
  if (!root) return;
  const { lessons = [], questions = [], knowledgeGraph = null, progress = {}, manifest = null } = data;
  const completed = Object.keys(progress?.completed || {}).length;
  const nodes = knowledgeGraph?.nodes || [];
  const masteryScores = Object.values(progress?.mastery || {});
  const avgMastery = nodes.length
    ? Math.round(nodes.reduce((s, n) => s + (progress?.mastery?.[n.id]?.score || 0), 0) / nodes.length * 100)
    : 0;

  const recentLessons = lessons.slice(-5).reverse();
  const recentHtml = recentLessons.map(d => {
    const done = !!progress?.completed?.[d.day];
    const kp = d.knowledgePoints || [];
    const mastery = computeDayMastery(d, progress);
    return `<div class="progress-item ${done ? 'done' : ''}" data-action="start-quiz" data-day="${d.day}">
      <div class="day-label">Day ${d.day}</div>
      <div class="day-title">${esc(d.title)}</div>
      <div class="day-meta">
        <span class="badge ${done ? 'badge-done' : 'badge-pending'}">${done ? '已完成' : '未完成'}</span>
        <div class="mastery-bar"><div class="mastery-fill" style="width:${mastery}%"></div></div>
      </div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="page home-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link active" data-nav="home">首页</a>
            <a href="#course" class="nav-link" data-nav="course">课程</a>
            <a href="#graph" class="nav-link" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      <div class="container">
        <div class="hero">
          <h1>化学智能学习平台</h1>
          <p>课程学习 → 知识理解 → 虚拟实验 → 练习评价 → 学习诊断 → 个性推荐，构建完整学习闭环。</p>
          <div class="hero-stats">
            <div class="stat"><span class="num">${questions.length}</span><span class="label">题目</span></div>
            <div class="stat"><span class="num">${lessons.length}</span><span class="label">课程</span></div>
            <div class="stat"><span class="num">${completed}</span><span class="label">已完成</span></div>
            <div class="stat"><span class="num">${avgMastery}%</span><span class="label">掌握度</span></div>
          </div>
        </div>
        <section>
          <h2>核心能力</h2>
          <div class="grid">
            <div class="card" data-action="go-course">
              <h3>课程学习</h3>
              <p>${lessons.length}天系统化课程，覆盖人教版九年级化学下册全部内容。</p>
              <div class="card-btn">开始学习</div>
            </div>
            <div class="card" data-action="go-graph">
              <h3>知识图谱</h3>
              <p>${nodes.length}个知识点，${knowledgeGraph?.edges?.length || 0}条关联，可视化学习路径。</p>
              <div class="card-btn">查看图谱</div>
            </div>
            <div class="card" data-action="go-dashboard">
              <h3>学情诊断</h3>
              <p>错题分析、薄弱知识点识别、个性化复习推荐。</p>
              <div class="card-btn">查看详情</div>
            </div>
            <div class="card" data-action="go-experiments">
              <h3>虚拟实验</h3>
              <p>LAB Engine驱动的实验播放器，支持步骤交互与错误诊断。</p>
              <div class="card-btn">进入实验室</div>
            </div>
          </div>
        </section>
        <section>
          <h2>最近学习</h2>
          <div class="progress-list">${recentHtml}</div>
        </section>
      </div>
      <footer><p>ChemLab-G9 · V1.7 · 九年级化学智能学习平台</p></footer>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
