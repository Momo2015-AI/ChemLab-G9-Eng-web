const NAV_ITEMS = [
  ['home', '首页', 'home'],
  ['course', '课程学习', 'course'],
  ['experiment', '虚拟实验', 'lab'],
  ['graph', '知识地图', 'knowledge'],
  ['quiz', '训练中心', 'assessment'],
  ['dashboard', '学习报告', 'progress'],
  ['ai-tutor', 'AI 化学导师', 'ai'],
];

const ICONS = {
  home: 'frontend/icons/home.svg',
  course: 'frontend/icons/course.svg',
  lab: 'frontend/icons/flask.svg',
  knowledge: 'frontend/icons/atom.svg',
  assessment: 'frontend/icons/chart.svg',
  progress: 'frontend/icons/chart.svg',
  ai: 'frontend/icons/robot.svg',
};

function icon(name) {
  return `<img class="chem-nav-icon" src="${ICONS[name] || ICONS.home}" alt="" aria-hidden="true">`;
}

export function mountPortalShell(root) {
  if (!root) return null;
  root.className = 'chem-portal-root';
  root.innerHTML = `
    <div class="chem-shell">
      <aside class="chem-sidebar" aria-label="ChemLab 主导航">
        <button class="chem-brand" data-nav="home" aria-label="返回 ChemLab 首页">
          <span class="chem-brand-mark">⚗</span>
          <span><strong>ChemLab</strong><small>Grade 9 Chemistry</small></span>
        </button>
        <div class="chem-sidebar-label">LEARNING</div>
        <nav class="chem-nav">
          ${NAV_ITEMS.map(([route, label, iconName]) => `<button class="chem-nav-item" data-nav="${route}">${icon(iconName)}<span>${label}</span></button>`).join('')}
        </nav>
        <div class="chem-sidebar-bottom">
          <button class="chem-nav-item" data-nav="settings">${icon('home')}<span>设置</span></button>
          <div class="chem-status-card"><span class="chem-status-dot"></span><span>学习系统正常</span></div>
        </div>
      </aside>
      <div class="chem-workspace">
        <header class="chem-header">
          <div class="chem-header-title"><span class="chem-mobile-title">ChemLab</span><span class="chem-breadcrumb">九年级化学 · 智能学习平台</span></div>
          <div class="chem-header-actions">
            <button class="chem-search" type="button" data-nav="home" title="返回学习中心">⌕ <span>学习中心</span></button>
            <button class="chem-ai-button" type="button" data-nav="ai-tutor">✦ AI Tutor</button>
          </div>
        </header>
        <main id="chem-page-root" class="chem-page-root" tabindex="-1">
          <div class="chem-loading">ChemLab 正在启动…</div>
        </main>
        <footer class="chem-footer">
          <span>⚡ Chemistry Learning Runtime</span><span>Knowledge · Experiment · Assessment · Mastery</span>
        </footer>
      </div>
    </div>`;

  const pageRoot = root.querySelector('#chem-page-root');
  root.querySelectorAll('[data-nav]').forEach(button => {
    button.addEventListener('click', () => {
      const route = button.dataset.nav;
      if (route === 'settings') return;
      window.location.hash = route === 'home' ? 'home' : route;
    });
  });

  return pageRoot;
}

export function syncPortalNavigation(root, route) {
  if (!root) return;
  root.querySelectorAll('.chem-nav-item[data-nav]').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === route?.page);
  });
}
