/**
 * ChemLab-G9 V1.6 Application
 * SPA with quiz, knowledge graph, dashboard
 */

const STORAGE_KEY = 'chemlab_v16';

function loadData(basePath) {
  return Promise.all([
    fetch(`${basePath}/modules/questions/question-bank.json`).then(r => r.json()),
    fetch(`${basePath}/modules/questions/taxonomy/knowledge-graph.json`).then(r => r.json()),
    fetch(`${basePath}/modules/lessons/manifest.json`).then(r => r.json()),
    fetch(`${basePath}/modules/questions/bank/questions-by-topic.json`).then(r => r.json()).catch(() => ({ topics: [] })),
    Promise.all(Array.from({ length: 36 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return fetch(`${basePath}/modules/lessons/day-${day}.json`).then(r => r.json()).catch(() => null);
    })).then(arr => arr.filter(Boolean)),
  ]);
}

class ChemLabApp {
  constructor() {
    this.questions = [];
    this.knowledgeGraph = null;
    this.lessons = [];
    this.manifest = null;
    this.progress = this.loadProgress();
    this.currentPage = 'home';
    this.currentQuiz = null;
    this.quizIndex = 0;
    this.quizAnswers = {};
    this.currentDay = null;
    this.currentExperiment = null;
    this.currentExpStep = 0;
  }

  loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
  }

  saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
  }

  async init(basePath) {
    const [qb, kg, manifest, topics, days] = await loadData(basePath || '');
    this.questions = qb.questions;
    this.knowledgeGraph = kg;
    this.manifest = manifest;
    this.lessons = days;
    this.questionById = new Map(this.questions.map(q => [q.id, q]));
    this.questionByKnowledge = {};
    this.questions.forEach(q => {
      (q.knowledge || []).forEach(k => {
        (this.questionByKnowledge[k] = this.questionByKnowledge[k] || []).push(q);
      });
    });
    this.initMastery();
    this.currentPage = 'home';
    this.navigate();
  }

  initMastery() {
    if (!this.progress.mastery) {
      this.progress.mastery = {};
      this.knowledgeGraph.nodes.forEach(n => {
        this.progress.mastery[n.id] = { score: 0, attempts: 0, correct: 0 };
      });
      this.saveProgress();
    }
  }

  getMastery(nodeId) {
    const m = this.progress.mastery[nodeId];
    return m ? m.score : 0;
  }

  recordAnswer(nodeId, correct) {
    if (!this.progress.mastery[nodeId]) {
      this.progress.mastery[nodeId] = { score: 0, attempts: 0, correct: 0 };
    }
    const m = this.progress.mastery[nodeId];
    m.attempts++;
    if (correct) m.correct++;
    m.score = m.correct / m.attempts;
    this.saveProgress();
  }

  startQuiz(dayId) {
    const day = this.lessons.find(d => d.day === dayId);
    if (!day) return;
    this.currentDay = day;
    this.currentQuiz = day.questions.map(id => this.questionById.get(id)).filter(Boolean);
    this.quizIndex = 0;
    this.quizAnswers = {};
    this.currentPage = 'quiz';
    this.render();
  }

  answerQuiz(optionIndex) {
    const q = this.currentQuiz[this.quizIndex];
    if (!q) return;
    const isCorrect = this.checkAnswer(q, optionIndex);
    this.quizAnswers[q.id] = { selected: optionIndex, correct: isCorrect };
    (q.knowledge || []).forEach(k => this.recordAnswer(k, isCorrect));
    this.saveProgress();
    this.quizIndex++;
    if (this.quizIndex >= this.currentQuiz.length) {
      this.currentPage = 'result';
    }
    this.render();
  }

  checkAnswer(q, optionIndex) {
    if (q.type === 'choice') {
      const answer = q.answer || '';
      const selected = ['A','B','C','D'][optionIndex] || '';
      return selected === answer.toUpperCase();
    }
    if (q.type === 'fill' || q.type === 'calculation') {
      const selected = this.quizAnswers[q.id]?.input || '';
      return selected.trim().toLowerCase() === (q.answer || '').toLowerCase();
    }
    return false;
  }

  getQuizScore() {
    if (!this.currentQuiz) return 0;
    const answered = Object.values(this.quizAnswers);
    return answered.length ? Math.round(answered.filter(a => a.correct).length / answered.length * 100) : 0;
  }

  navigate() {
    this.render();
    window.scrollTo(0, 0);
  }

  goHome() { this.currentPage = 'home'; this.navigate(); }
  goCourse() { this.currentPage = 'course'; this.navigate(); }
  goGraph() { this.currentPage = 'graph'; this.navigate(); }
  goDashboard() { this.currentPage = 'dashboard'; this.navigate(); }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;
    switch (this.currentPage) {
      case 'home': root.innerHTML = this.renderHome(); break;
      case 'course': root.innerHTML = this.renderCourse(); break;
      case 'quiz': root.innerHTML = this.renderQuiz(); break;
      case 'result': root.innerHTML = this.renderResult(); break;
      case 'graph': root.innerHTML = this.renderGraph(); break;
      case 'dashboard': root.innerHTML = this.renderDashboard(); break;
      default: root.innerHTML = this.renderHome();
    }
    this.bindEvents();
  }

  renderHome() {
    const completed = this.lessons.filter(d => this.progress.completed?.[d.day]).length;
    const avgMastery = this.getTotalMastery();
    return `
      <div class="page">
        <header>
          <div class="container header-inner">
            <div class="logo">ChemLab-G9 <span>九年级化学</span></div>
            <nav>
              <a href="#" data-nav="home" class="nav-link active">首页</a>
              <a href="#" data-nav="course" class="nav-link">课程</a>
              <a href="#" data-nav="graph" class="nav-link">知识图谱</a>
              <a href="#" data-nav="dashboard" class="nav-link">学情</a>
            </nav>
          </div>
        </header>
        <div class="container">
          <div class="hero">
            <h1>化学智能学习平台</h1>
            <p>课程学习 → 知识理解 → 虚拟实验 → 练习评价 → 学习诊断 → 个性推荐，构建完整学习闭环。</p>
            <div class="hero-stats">
              <div class="stat"><span class="num">${this.questions.length}</span><span class="label">题目</span></div>
              <div class="stat"><span class="num">${this.lessons.length}</span><span class="label">课程</span></div>
              <div class="stat"><span class="num">${completed}</span><span class="label">已完成</span></div>
              <div class="stat"><span class="num">${avgMastery}%</span><span class="label">掌握度</span></div>
            </div>
          </div>
          <section>
            <h2>核心能力</h2>
            <div class="grid">
              <div class="card" onclick="app.goCourse()">
                <h3>课程学习</h3>
                <p>${this.lessons.length}天系统化课程，覆盖人教版九年级化学下册全部内容。</p>
                <div class="card-btn">开始学习</div>
              </div>
              <div class="card" onclick="app.goGraph()">
                <h3>知识图谱</h3>
                <p>${this.knowledgeGraph.nodes.length}个知识点，${this.knowledgeGraph.edges.length}条关联，可视化学习路径。</p>
                <div class="card-btn">查看图谱</div>
              </div>
              <div class="card" onclick="app.goDashboard()">
                <h3>学情诊断</h3>
                <p>错题分析、薄弱知识点识别、个性化复习推荐。</p>
                <div class="card-btn">查看详情</div>
              </div>
              <div class="card">
                <h3>虚拟实验</h3>
                <p>LAB Engine驱动的实验播放器，支持步骤交互与错误诊断。</p>
                <div class="card-btn">进入实验室</div>
              </div>
            </div>
          </section>
          <section>
            <h2>最近学习</h2>
            <div class="progress-list">
              ${this.renderRecentLessons()}
            </div>
          </section>
        </div>
        <footer><p>ChemLab-G9 · V1.6 · 九年级化学智能学习平台</p></footer>
      </div>`;
  }

  renderRecentLessons() {
    const recent = this.lessons.slice(-5).reverse();
    return recent.map(d => {
      const done = !!this.progress.completed?.[d.day];
      const mastery = this.getKnowledgeMastery(d);
      return `
        <div class="progress-item ${done ? 'done' : ''}" onclick="app.startQuiz('${d.day}')">
          <div class="day-label">Day ${d.day}</div>
          <div class="day-title">${d.title}</div>
          <div class="day-meta">
            <span class="badge ${done ? 'badge-done' : 'badge-pending'}">${done ? '已完成' : '未完成'}</span>
            <div class="mastery-bar"><div class="mastery-fill" style="width:${mastery}%"></div></div>
          </div>
        </div>`;
    }).join('');
  }

  renderCourse() {
    const modules = this.manifest.modules;
    const days = this.manifest.days;
    return `
      <div class="page">
        <header>
          <div class="container header-inner">
            <div class="logo">ChemLab-G9 <span>九年级化学</span></div>
            <nav>
              <a href="#" data-nav="home" class="nav-link">首页</a>
              <a href="#" data-nav="course" class="nav-link active">课程</a>
              <a href="#" data-nav="graph" class="nav-link">知识图谱</a>
              <a href="#" data-nav="dashboard" class="nav-link">学情</a>
            </nav>
          </div>
        </header>
        <div class="container">
          <h2 style="margin-bottom:20px">课程目录</h2>
          ${Object.entries(modules).map(([key, mod]) => {
            const modDays = days.filter(d => d.module === key);
            return `
              <div class="module-section">
                <h3>${mod.order}. ${mod.name}</h3>
                <div class="day-grid">
                  ${modDays.map(d => {
                    const done = !!this.progress.completed?.[d.day];
                    const mastery = this.getKnowledgeMastery(d);
                    return `
                      <div class="day-card ${done ? 'done' : ''}" onclick="app.startQuiz('${d.day}')">
                        <div class="day-num">${d.day}</div>
                        <div class="day-name">${d.title}</div>
                        <div class="day-mastery">
                          <div class="mini-bar"><div class="mini-fill" style="width:${mastery}%"></div></div>
                          <span>${mastery}%</span>
                        </div>
                      </div>`;
                  }).join('')}
                </div>
              </div>`;
          }).join('')}
        </div>
        <footer><p>ChemLab-G9 · V1.6</p></footer>
      </div>`;
  }

  renderQuiz() {
    if (!this.currentQuiz || this.quizIndex >= this.currentQuiz.length) return this.renderResult();
    const q = this.currentQuiz[this.quizIndex];
    const total = this.currentQuiz.length;
    const answered = this.quizAnswers[q.id];
    return `
      <div class="page quiz-page">
        <header>
          <div class="container header-inner">
            <div class="logo">ChemLab-G9</div>
            <div class="quiz-header">
              <span>${this.quizIndex + 1}/${total}</span>
              <div class="progress-bar"><div class="progress-fill" style="width:${(this.quizIndex + 1) / total * 100}%"></div></div>
            </div>
          </div>
        </header>
        <div class="container quiz-container">
          <div class="question-card">
            <div class="q-meta">
              <span class="q-type">${q.type === 'choice' ? '选择题' : q.type === 'fill' ? '填空题' : '计算题'}</span>
              <span class="q-diff diff-${q.difficulty}">${q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难'}</span>
              <span class="q-know">${q.knowledge?.[0] || ''}</span>
            </div>
            <div class="q-prompt">${q.prompt}</div>
            ${q.type === 'choice' ? `
              <div class="q-options">
                ${(q.options || []).map((opt, i) => {
                  const letter = ['A','B','C','D'][i];
                  const isSelected = answered ? this.quizAnswers[q.id]?.selected === i : false;
                  const showResult = answered !== undefined;
                  const isCorrectOpt = opt.startsWith(q.answer || '');
                  let cls = 'q-opt';
                  if (showResult) {
                    if (isCorrectOpt) cls += ' correct';
                    else if (isSelected) cls += ' wrong';
                  } else if (isSelected) cls += ' selected';
                  return `<div class="${cls}" data-idx="${i}" onclick="app.answerQuiz(${i})">${opt}</div>`;
                }).join('')}
              </div>
            ` : `
              <div class="q-input-area">
                <input type="text" class="q-input" placeholder="请输入答案..." />
                <button class="btn-submit" onclick="app.submitFillAnswer(this)">提交</button>
              </div>
              ${answered !== undefined ? `
                <div class="q-feedback ${answered.correct ? 'correct' : 'wrong'}">
                  ${answered.correct ? '正确！' : '错误。'}
                  <div class="q-explanation">${q.explanation || ''}</div>
                </div>
              ` : ''}
            `}
            ${answered !== undefined ? `
              <div class="q-explanation">${q.explanation || ''}</div>
              <button class="btn-next" onclick="app.answerQuiz(0)">
                ${this.quizIndex < total - 1 ? '下一题' : '查看结果'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>`;
  }

  submitFillAnswer(btn) {
    const input = btn.previousElementSibling;
    const val = input.value.trim();
    if (!val) return;
    const q = this.currentQuiz[this.quizIndex];
    const isCorrect = val.toLowerCase() === (q.answer || '').toLowerCase();
    this.quizAnswers[q.id] = { selected: -1, correct: isCorrect, input: val };
    (q.knowledge || []).forEach(k => this.recordAnswer(k, isCorrect));
    this.saveProgress();
    this.quizIndex++;
    if (this.quizIndex >= this.currentQuiz.length) {
      this.currentPage = 'result';
    }
    this.render();
  }

  renderResult() {
    const score = this.getQuizScore();
    const total = this.currentQuiz?.length || 0;
    const correct = Object.values(this.quizAnswers).filter(a => a.correct).length;
    return `
      <div class="page result-page">
        <div class="container">
          <div class="result-card">
            <div class="result-icon">${score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}</div>
            <h2>测试完成！</h2>
            <div class="result-score">${score}分</div>
            <p>答对 ${correct}/${total} 题</p>
            <div class="result-breakdown">
              <div class="rb-item"><span>正确率</span><strong>${score}%</strong></div>
              <div class="rb-item"><span>用时</span><strong>${this.quizIndex}题</strong></div>
            </div>
            <div class="result-actions">
              <button class="btn-primary" onclick="app.goCourse()">返回课程</button>
              <button class="btn-secondary" onclick="app.startQuiz('${this.currentDay?.day}')">重做</button>
              <button class="btn-secondary" onclick="app.goDashboard()">查看学情</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  renderGraph() {
    const nodes = this.knowledgeGraph.nodes;
    const edges = this.knowledgeGraph.edges;
    const size = Math.min(window.innerWidth - 40, 900);
    const cx = size / 2, cy = size / 2, r = size * 0.38;
    const angles = nodes.map((_, i) => (i / nodes.length) * 2 * Math.PI - Math.PI / 2);
    const positions = nodes.map((_, i) => ({
      x: cx + r * Math.cos(angles[i]),
      y: cy + r * Math.sin(angles[i]),
    }));
    const nodeMap = new Map(nodes.map((n, i) => [n.id, { ...n, ...positions[i] }]));
    const svgEdges = edges.map(e => {
      const from = nodeMap.get(e.from), to = nodeMap.get(e.to);
      if (!from || !to) return null;
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#e2e8f0" stroke-width="1"/>`;
    }).filter(Boolean).join('');
    const svgNodes = nodes.map((n, i) => {
      const pos = positions[i];
      const mastery = this.getMastery(n.id);
      const color = mastery >= 0.8 ? '#2e9e63' : mastery >= 0.5 ? '#f59e0b' : '#ef4444';
      const r2 = 28 + mastery * 12;
      return `<circle cx="${pos.x}" cy="${pos.y}" r="${r2}" fill="${color}" opacity="0.85" class="kg-node" data-id="${n.id}" title="${n.name} (${mastery}%)"/>
        <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" fill="white" font-size="9" pointer-events="none">${n.name}</text>`;
    }).join('');
    return `
      <div class="page graph-page">
        <header>
          <div class="container header-inner">
            <div class="logo">ChemLab-G9</div>
            <nav>
              <a href="#" data-nav="home" class="nav-link">首页</a>
              <a href="#" data-nav="course" class="nav-link">课程</a>
              <a href="#" data-nav="graph" class="nav-link active">知识图谱</a>
              <a href="#" data-nav="dashboard" class="nav-link">学情</a>
            </nav>
          </div>
        </header>
        <div class="container">
          <h2 style="margin-bottom:8px">知识图谱</h2>
          <p style="color:var(--muted);margin-bottom:16px;font-size:14px">节点大小=掌握度，颜色=掌握等级（绿≥80% 黄≥50% 红<50%）</p>
          <div class="kg-container">
            <svg width="${size}" height="${size + 60}" viewBox="0 0 ${size} ${size + 60}">${svgEdges}${svgNodes}</svg>
          </div>
          <div class="kg-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#2e9e63"></span>掌握 ≥80%</div>
            <div class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>掌握 ≥50%</div>
            <div class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>掌握 &lt;50%</div>
          </div>
        </div>
      </div>`;
  }

  renderDashboard() {
    const nodes = this.knowledgeGraph.nodes;
    const mastered = nodes.filter(n => this.getMastery(n.id) >= 0.8).length;
    const learning = nodes.filter(n => { const m = this.getMastery(n.id); return m > 0 && m < 0.8; }).length;
    const weak = nodes.filter(n => this.getMastery(n.id) === 0).length;
    const totalQuizzes = Object.keys(this.progress.completed || {}).length;
    const avgScore = totalQuizzes > 0 ? Math.round(Object.values(this.progress.quizScores || {}).reduce((a,b)=>a+b,0) / totalQuizzes) : 0;

    const skillBars = nodes.filter(n => this.getMastery(n.id) > 0)
      .map(n => ({ id: n.id, name: n.name, score: Math.round(this.getMastery(n.id) * 100) }))
      .sort((a, b) => a.score - b.score)
      .slice(-15);

    return `
      <div class="page dashboard-page">
        <header>
          <div class="container header-inner">
            <div class="logo">ChemLab-G9</div>
            <nav>
              <a href="#" data-nav="home" class="nav-link">首页</a>
              <a href="#" data-nav="course" class="nav-link">课程</a>
              <a href="#" data-nav="graph" class="nav-link">知识图谱</a>
              <a href="#" data-nav="dashboard" class="nav-link active">学情</a>
            </nav>
          </div>
        </header>
        <div class="container">
          <h2 style="margin-bottom:20px">学情诊断</h2>
          <div class="dash-stats">
            <div class="dash-stat"><span class="num">${totalQuizzes}</span><span class="label">已完成测试</span></div>
            <div class="dash-stat"><span class="num">${avgScore}%</span><span class="label">平均正确率</span></div>
            <div class="dash-stat"><span class="num">${mastered}</span><span class="label">已掌握知识点</span></div>
            <div class="dash-stat"><span class="num">${learning + weak}</span><span class="label">待强化知识点</span></div>
          </div>
          <div class="dash-grid">
            <div class="dash-card">
              <h3>知识点掌握度</h3>
              <div class="skill-bars">
                ${skillBars.map(s => `
                  <div class="skill-row">
                    <span class="skill-name">${s.name}</span>
                    <div class="skill-bar"><div class="skill-fill" style="width:${s.score}%;background:${s.score>=80?'#2e9e63':s.score>=50?'#f59e0b':'#ef4444'}"></div></div>
                    <span class="skill-score">${s.score}%</span>
                  </div>`).join('')}
              </div>
            </div>
            <div class="dash-card">
              <h3>推荐学习</h3>
              <div class="recommend-list">
                ${nodes.filter(n => this.getMastery(n.id) < 0.5).slice(0, 8).map(n => `
                  <div class="rec-item" onclick="app.startQuizByNode('${n.id}')">
                    <span class="rec-name">${n.name}</span>
                    <span class="rec-score" style="color:${this.getMastery(n.id)>=0.5?'#f59e0b':'#ef4444'}">${Math.round(this.getMastery(n.id)*100)}%</span>
                  </div>`).join('') || '<p style="color:var(--muted)">所有知识点已掌握！</p>'}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  startQuizByNode(nodeId) {
    const qs = (this.questionByKnowledge[nodeId] || []).slice(0, 10);
    if (!qs.length) return;
    this.currentQuiz = qs;
    this.quizIndex = 0;
    this.quizAnswers = {};
    this.currentPage = 'quiz';
    this.render();
  }

  bindEvents() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const page = el.dataset.nav;
        this.currentPage = page;
        this.render();
      });
    });
    document.querySelectorAll('.kg-node').forEach(el => {
      el.addEventListener('click', () => this.startQuizByNode(el.dataset.id));
    });
  }

  getKnowledgeMastery(day) {
    const knowIds = day.knowledgePoints || [];
    if (!knowIds.length) return 0;
    const scores = knowIds.map(k => this.getMastery(k));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 100);
  }

  getTotalMastery() {
    const nodes = this.knowledgeGraph.nodes;
    if (!nodes.length) return 0;
    const avg = nodes.reduce((s, n) => s + this.getMastery(n.id), 0) / nodes.length;
    return Math.round(avg * 100);
  }
}

const app = new ChemLabApp();
window.app = app;

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  app.init('').catch(() => {
    document.getElementById('app-root').innerHTML = '<div class="container"><h2>数据加载失败，请刷新重试</h2></div>';
  });
});
