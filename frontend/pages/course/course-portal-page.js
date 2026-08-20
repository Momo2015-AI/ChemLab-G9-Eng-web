const GOLDEN_LESSON_ID = 'lesson-01-material-changes-properties';

const UPPER_UNITS = [
  { id: 'unit-01-intro-chemistry', number: '01', title: '走进化学世界', description: '物质的变化、性质与化学实验基础', lessonIds: ['lesson-01-material-changes-properties', 'lesson-02-chemistry-as-experimental-science', 'lesson-04-lab-safety-operations'] },
  { id: 'unit-02-air', number: '02', title: '我们周围的空气', description: '空气组成、氧气与相关实验', lessonIds: ['lesson-05-oxygen'] },
  { id: 'unit-03-matter-structure', number: '03', title: '物质构成的奥秘', description: '分子、原子、离子与元素', lessonIds: [] },
  { id: 'unit-04-water', number: '04', title: '自然界的水', description: '水的组成、净化与爱护', lessonIds: [] },
  { id: 'unit-05-equations', number: '05', title: '化学方程式', description: '质量守恒、方程式与计算', lessonIds: [] },
  { id: 'unit-06-carbon-oxides', number: '06', title: '碳和碳的氧化物', description: '碳单质、二氧化碳与一氧化碳', lessonIds: [] },
  { id: 'unit-07-fuel', number: '07', title: '燃料及其利用', description: '燃料、能源与环境', lessonIds: [] },
];

const LOWER_UNITS = [
  { id: 'unit-08-metals', number: '08', title: '金属和金属材料', description: '金属性质、活动性与资源利用', lessonIds: [] },
  { id: 'unit-09-solutions', number: '09', title: '溶液', description: '溶解、溶液组成与浓度', lessonIds: [] },
  { id: 'unit-10-acids-bases', number: '10', title: '酸和碱', description: '酸、碱、pH与中和', lessonIds: ['lesson-03-acid-intro'] },
  { id: 'unit-11-salts-fertilizers', number: '11', title: '盐 化肥', description: '常见盐、化肥与相关实验', lessonIds: [] },
  { id: 'unit-12-life', number: '12', title: '化学与生活', description: '营养物质、材料与健康生活', lessonIds: [] },
];

export function renderCoursePortal({ root, lessons = [], term = 'upper', onLesson = id => { window.location.hash = `course/${id}` }, onHome = () => { window.location.hash = 'home'; } } = {}) {
  if (!root) return;
  const units = term === 'lower' ? LOWER_UNITS : UPPER_UNITS;
  const canonicalLessons = lessons.filter(lesson => lesson?.canonicalId || lesson?.id).map(lesson => ({ ...lesson, id: lesson.canonicalId || lesson.id }));
  const byId = new Map(canonicalLessons.map(lesson => [lesson.id, lesson]));
  const golden = term === 'upper' ? (byId.get(GOLDEN_LESSON_ID) || { id: GOLDEN_LESSON_ID, title: '物质的变化和性质', description: '从观察现象到证据推理' }) : null;
  const termLessonCount = canonicalLessons.length;

  root.innerHTML = `<section class="portal-page">
    <div class="portal-hero"><div><div class="portal-eyebrow">COURSE CENTER · ${term === 'lower' ? '下册' : '上册'}</div><h1 class="portal-title">九年级化学课程</h1><p class="portal-subtitle">按教材单元 → 课题 → 学习流程组织课程；未完成审计的旧内容不会出现在学习入口。</p></div><div class="portal-actions"><button class="portal-btn" data-home>⌂ 首页</button></div></div>
    <div class="portal-grid">
      ${golden ? `<article class="portal-card full"><h2>第一课 · 精品课</h2><p>${escapeHtml(golden.title)}</p><p class="portal-muted">${escapeHtml(golden.description)}</p><div class="lesson-card-row"><button class="lesson-card" data-golden><span class="lesson-card-number">01</span><span class="lesson-card-content"><strong>一步一步学</strong><small>从现象、概念到判断，逐步建立完整理解</small></span><span class="lesson-card-arrow">›</span></button><button class="lesson-card secondary" data-golden><span class="lesson-card-number">02</span><span class="lesson-card-content"><strong>本节课要掌握什么？</strong><small>查看学习目标与掌握标准</small></span><span class="lesson-card-arrow">›</span></button></div><div class="portal-meta"><span class="portal-chip good">${escapeHtml(golden.cardLabel || '95% 掌握')}</span><span class="portal-chip">陌生题</span><span class="portal-chip">迁移</span></div></article>` : `<article class="portal-card full"><h2>下册课程</h2><p class="portal-muted">${termLessonCount ? `下册已有 ${termLessonCount} 门课程上线，其余单元按教材顺序建设中。` : '下册课程按教材单元顺序建设中，首个单元上线前请先完成上册学习。'}</p></article>`}
      <article class="portal-card full"><h2>学习流程</h2><div class="portal-list flow-list"><div><strong>01 学习理解</strong><span>概念、现象、模型</span></div><div><strong>02 实验探究</strong><span>观察与证据</span></div><div><strong>03 基础练习</strong><span>理解 → 应用</span></div><div><strong>04 诊断与补救</strong><span>错误原因 → 再学习</span></div><div><strong>05 陌生题掌握</strong><span>95% 掌握门槛</span></div><div><strong>06 迁移</strong><span>陌生情境迁移</span></div></div></article>
      <article class="portal-card full"><h2>学习单元 · ${term === 'lower' ? '下册' : '上册'}</h2><div class="unit-grid">${units.map(unit => {
        const unitLessons = unit.lessonIds.map(id => byId.get(id)).filter(Boolean);
        const ready = unitLessons.length > 0;
        return `<article class="unit-card ${ready ? 'ready' : 'planned'}"><div class="unit-number">${unit.number}</div><div class="unit-body"><h3>${escapeHtml(unit.title)}</h3><p>${escapeHtml(unit.description)}</p>${ready ? `<div class="unit-lessons">${unitLessons.map((lesson, index) => `<button class="unit-lesson" data-lesson="${escapeHtml(lesson.id)}" ${lesson.available===false?'disabled':''}><span>${String(index + 1).padStart(2,'0')}</span><strong>${escapeHtml(lesson.title)}</strong><small>${escapeHtml(lesson.cardLabel || (lesson.completed ? '已完成' : '开始学习'))}</small></button>`).join('')}</div>` : '<span class="portal-chip">内容建设中</span>'}</div></article>`;
      }).join('')}</div></article>
    </div>
  </section>`;
  root.querySelector('[data-home]')?.addEventListener('click', onHome);
  root.querySelectorAll('[data-golden]').forEach(button => button.addEventListener('click', () => onLesson(GOLDEN_LESSON_ID)));
  root.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => onLesson(button.dataset.lesson)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
