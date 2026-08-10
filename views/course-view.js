/** V1.7 Course View — rendering only. */
export function renderCourse({ root, lesson = {}, onSelect } = {}) {
  if (!root) return;
  const knowledge = Array.isArray(lesson.knowledge) ? lesson.knowledge : [];
  root.innerHTML = `
    <section class="page course-page">
      <header class="page-header">
        <h1>${escapeHtml(lesson.title || lesson.id || 'Lesson')}</h1>
        <p>${escapeHtml(lesson.description || '')}</p>
      </header>
      <div class="knowledge-list">
        ${knowledge.map((item, index) => `
          <button type="button" data-knowledge-index="${index}">
            ${escapeHtml(item.title || item.name || item.id || `Knowledge ${index + 1}`)}
          </button>`).join('')}
      </div>
    </section>`;
  if (typeof onSelect === 'function') {
    root.querySelectorAll('[data-knowledge-index]').forEach(button => {
      button.addEventListener('click', () => onSelect(Number(button.dataset.knowledgeIndex)));
    });
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
