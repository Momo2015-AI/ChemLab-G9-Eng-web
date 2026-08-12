export function renderCoursePortal({ root, lessons = [], onLesson = id => { window.location.hash = `course/${id}` }, onHome = () => { window.location.hash = 'home'; } } = {}) {
  if (!root) return;
  root.innerHTML = `<section class="portal-page">
    <div class="portal-hero"><div><div class="portal-eyebrow">COURSE CENTER</div><h1 class="portal-title">九年级化学课程</h1><p class="portal-subtitle">按照“课程 → 知识 → 实验 → 训练 → 掌握”的学习路径组织全部课程。</p></div><div class="portal-actions"><button class="portal-btn" data-home>⌂ 首页</button></div></div>
    <div class="portal-grid"><article class="portal-card full"><h2>课程进度</h2><p class="portal-muted">选择一个学习单元继续。</p><div class="portal-progress"><span style="width:72%"></span></div><span class="portal-chip good">学习中</span><span class="portal-chip">九年级</span></article>
    <article class="portal-card wide"><h2>学习单元</h2><div class="portal-list">${lessons.length ? lessons.map((l,i)=>`<button data-lesson="${l.day || l.id || String(i+1).padStart(2,'0')}"><strong>${l.title || `课程 ${i+1}`}</strong><br><span class="portal-muted">${l.description || '知识点 · 实验 · 训练'}</span></button>`).join('') : '<p class="portal-muted">课程内容正在加载。</p>'}</div></article>
    <article class="portal-card"><h3>学习路径</h3><p class="portal-muted">每个单元完成后进入实验和针对性训练。</p><span class="portal-chip">Knowledge</span><span class="portal-chip">Lab</span><span class="portal-chip">Practice</span></article></div>
  </section>`;
  root.querySelector('[data-home]')?.addEventListener('click', onHome);
  root.querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', () => onLesson(b.dataset.lesson)));
}