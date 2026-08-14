/** Golden Lesson home entry — Lesson 01 is the canonical first-course experience. */
const GOLDEN_LESSON_ID = 'lesson-01-material-changes-properties';

export function renderHome({ root, data = {}, onCourse, onDashboard, onGraph, onRemediation } = {}) {
  if (!root) return;
  const stats = data.stats || {};
  const lessons = Array.isArray(data.lessons) ? data.lessons : [];
  const firstLesson = lessons.find(lesson => lesson.canonicalId === GOLDEN_LESSON_ID || lesson.id === GOLDEN_LESSON_ID) || (data.term === 'lower' ? null : { canonicalId: GOLDEN_LESSON_ID, id: GOLDEN_LESSON_ID, day: '01', title: '物质的变化和性质', description: '从观察现象到证据推理，建立化学学习的第一套思维框架。' });
  const firstLessonId = firstLesson?.canonicalId || firstLesson?.id || GOLDEN_LESSON_ID;
  root.innerHTML = `
    <section class="page home-page">
      <header class="page-header">
        <span class="eyebrow">ChemLab-G9 · Golden Lesson v1.0</span>
        <h1>${escapeHtml(data.title || '九年级化学智能学习中心')}</h1>
        <p>${escapeHtml(data.subtitle || '学习 → 理解 → 实验 → 练习 → 诊断 → 补救 → 掌握')}</p>
      </header>
      ${firstLesson ? `<section class="golden-lesson-entry" aria-label="精品首课">
        <div class="golden-lesson-entry__meta"><span>GOLDEN LESSON · 01</span><span>95% MASTERY</span></div>
        <div class="golden-lesson-entry__number" aria-hidden="true">01</div>
        <div class="golden-lesson-entry__body">
          <h2>第一课：${escapeHtml(firstLesson.title)}</h2>
          <p>${escapeHtml(firstLesson.description || '从观察现象到证据推理，建立化学学习的第一套思维框架。')}</p>
          <div class="golden-lesson-entry__flow"><span>01 学习</span><b>→</b><span>02 实验</span><b>→</b><span>03 练习</span><b>→</b><span>04 诊断</span><b>→</b><span>05 掌握</span></div>
          <button type="button" data-golden-lesson>开始第一课</button>
        </div>
      </section>` : '<section class="golden-lesson-entry" aria-label="下册课程建设中"><div class="golden-lesson-entry__body"><h2>下册课程正在接入</h2><p>当前还没有可运行的下册 canonical 课程，已为你保留课程入口。</p></div></section>'}
      <section class="home-learning-path" aria-label="学习流程">
        <div class="section-heading"><span>LEARNING FLOW</span><h2>按这个顺序学习</h2><p>每一课沿着同一条学习路径推进，避免在不同模块之间来回跳转。</p></div>
        <div class="learning-flow-grid">
          <article class="learning-flow-card"><span class="learning-flow-number">01</span><strong>学习理解</strong><small>概念、现象、模型与关键结论</small></article>
          <article class="learning-flow-card"><span class="learning-flow-number">02</span><strong>实验探究</strong><small>观察现象，建立证据与解释</small></article>
          <article class="learning-flow-card"><span class="learning-flow-number">03</span><strong>基础练习</strong><small>从识别到应用，逐步巩固</small></article>
          <article class="learning-flow-card"><span class="learning-flow-number">04</span><strong>诊断与补救</strong><small>发现错误原因，针对性再学习</small></article>
          <article class="learning-flow-card"><span class="learning-flow-number">05</span><strong>Unseen Mastery</strong><small>新题验证是否达到 95%</small></article>
          <article class="learning-flow-card"><span class="learning-flow-number">06</span><strong>Transfer</strong><small>陌生情境验证真正迁移</small></article>
        </div>
      </section>
      <section class="learning-center-list" aria-label="课程目录">
        <div class="section-heading"><span>CURRICULUM · ${data.term === 'lower' ? '下册' : '上册'}</span><h2>学习单元</h2><p>只显示已经建立 canonical 内容的课程；旧版课程不再作为当前学习入口。</p></div>
        ${lessons.length ? `<div class="lesson-grid">${lessons.map((lesson, index) => `
          <button type="button" class="lesson-card" data-lesson-id="${escapeHtml(lesson.canonicalId || lesson.id)}">
            <span class="lesson-card-number">${String(Number(lesson.day || index + 1)).padStart(2, '0')}</span>
            <strong>${escapeHtml(lesson.title || lesson.id || 'Lesson')}</strong>
            <small>${lesson.completed ? '已完成' : '开始学习'}</small>
          </button>`).join('')}</div>` : '<p>课程内容正在准备中。</p>'}
      </section>
      <section class="home-support-grid" aria-label="学习支持">
        <button type="button" class="support-card" data-course><span class="support-number">→</span><strong>继续课程</strong><small>按当前学习进度进入下一课</small></button>
        <button type="button" class="support-card" data-dashboard><span class="support-number">◎</span><strong>学习报告</strong><small>查看掌握度、完成度与学习记录</small></button>
        <button type="button" class="support-card" data-graph><span class="support-number">⌘</span><strong>知识地图</strong><small>查看知识点之间的关联</small></button>
        ${data.hasRemediation ? '<button type="button" class="support-card" data-remediation><span class="support-number">↻</span><strong>针对性补救</strong><small>回到尚未掌握的知识点</small></button>' : ''}
      </section>
      <section class="home-stats" aria-label="学习数据">
        <div><strong>${Number(stats.completed || 0)}</strong><span>已完成课程</span></div>
        <div><strong>${Number(stats.mastery || 0)}%</strong><span>当前掌握度</span></div>
        <div><strong>${Number(stats.questions || 0)}</strong><span>已答题</span></div>
      </section>
    </section>`;
  root.querySelector('[data-course]')?.addEventListener('click', () => onCourse?.());
  root.querySelector('[data-golden-lesson]')?.addEventListener('click', () => onCourse?.(firstLessonId));
  root.querySelector('[data-dashboard]')?.addEventListener('click', () => onDashboard?.());
  root.querySelector('[data-graph]')?.addEventListener('click', () => onGraph?.());
  root.querySelector('[data-remediation]')?.addEventListener('click', () => onRemediation?.());
  root.querySelectorAll('[data-lesson-id]').forEach(button => button.addEventListener('click', () => onCourse?.(button.dataset.lessonId)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
