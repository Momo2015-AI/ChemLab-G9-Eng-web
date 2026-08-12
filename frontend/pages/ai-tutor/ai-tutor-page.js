export function renderAITutorPage(root) {
  if (!root) return;
  root.innerHTML = `
    <section class="page chem-ai-page">
      <header class="page-header">
        <span class="eyebrow">ChemAI · V2.0 Experience Layer</span>
        <h1>AI 化学导师</h1>
        <p>围绕知识点、实验与错因，为下一阶段 AI Tutor Engine 提供统一交互入口。</p>
      </header>
      <section class="chem-ai-grid">
        <article class="glow-card chem-ai-chat">
          <div class="chem-ai-chat-head"><strong>✦ ChemAI</strong><span>学习上下文已连接</span></div>
          <div class="chem-ai-message"><span class="chem-ai-avatar">AI</span><div><strong>你好，我是 ChemAI。</strong><p>你可以从“为什么”“怎么判断”“实验现象说明什么”开始提问。</p></div></div>
          <div class="chem-ai-input"><span>输入你的化学问题…</span><button type="button" disabled>发送</button></div>
        </article>
        <aside class="glow-card chem-ai-context"><h2>学习上下文</h2><div><span>当前课程</span><strong>九年级化学</strong></div><div><span>知识图谱</span><strong>已连接</strong></div><div><span>掌握模型</span><strong>Evidence Driven</strong></div><div><span>下一阶段</span><strong>AI Tutor Engine</strong></div></aside>
      </section>
    </section>`;
}
