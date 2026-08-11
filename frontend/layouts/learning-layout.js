export function createLearningLayout(content = '') {
  return `
    <section class="learning-layout">
      <nav class="learning-navigation">
        <span>章节</span>
        <span>知识点</span>
        <span>实验</span>
        <span>评价</span>
      </nav>
      <main class="learning-content">
        ${content}
      </main>
    </section>
  `;
}
