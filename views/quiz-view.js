/**
 * V1.7 Quiz View — full quiz with progress bar, options, feedback, and results.
 */

export function renderQuiz({ root, data = {} } = {}) {
  if (!root) return;
  const { question = null, index = 0, total = 0, answered = false, selected = null,
          quizAnswers = {}, questions = [] } = data;

  if (!question) {
    root.innerHTML = '<section class="page quiz-page"><div class="container"><p class="loading">加载中...</p></div></section>';
    return;
  }

  const options = Array.isArray(question.options) ? question.options : [];
  const letterLabels = ['A', 'B', 'C', 'D'];
  const qTypeLabels = { 'single-choice': '选择题', 'multiple-choice': '多选题', 'short-answer': '填空题' };
  const diffLabels = { easy: '简单', medium: '中等', hard: '困难' };
  const answeredKey = quizAnswers?.[question.id];
  const showResult = answered || answeredKey !== undefined;

  const optionsHtml = question.type === 'single-choice' || question.type === 'multiple-choice'
    ? options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrectOpt = opt === (question.answer || '');
        let cls = 'q-opt';
        if (showResult) {
          if (isCorrectOpt) cls += ' correct';
          else if (isSelected) cls += ' wrong';
        } else if (isSelected) cls += ' selected';
        return `<div class="${cls}" data-idx="${i}">${letterLabels[i]}. ${esc(opt)}</div>`;
      }).join('')
    : `<div class="q-input-area">
        <input type="text" class="q-input" placeholder="请输入答案..." data-input />
        <button class="btn-submit" data-submit>提交</button>
       </div>
       ${showResult ? `<div class="q-feedback ${answeredKey?.correct ? 'correct' : 'wrong'}">
         ${answeredKey?.correct ? '正确！' : '错误。'}
         <div class="q-explanation">${esc(question.explanation || '')}</div>
       </div>` : ''}`;

  const progressBar = total > 1
    ? `<div class="quiz-progress-bar"><div class="container">
        <div class="progress-bar"><div class="progress-fill" style="width:${(index + 1) / total * 100}%"></div></div>
        <span class="quiz-count">${index + 1}/${total}</span>
      </div></div>` : '';

  const nextBtn = showResult && index < total - 1
    ? `<button class="btn-next" data-next>下一题</button>`
    : showResult
      ? `<button class="btn-next" data-next>查看结果</button>`
      : '';

  root.innerHTML = `
    <div class="page quiz-page">
      <header>
        <div class="container header-inner">
          <div class="logo" data-action="go-home">ChemLab-G9</div>
          <nav>
            <a href="#home" class="nav-link" data-nav="home">首页</a>
            <a href="#course" class="nav-link active" data-nav="course">课程</a>
            <a href="#graph" class="nav-link" data-nav="graph">知识图谱</a>
            <a href="#dashboard" class="nav-link" data-nav="dashboard">学情</a>
          </nav>
        </div>
      </header>
      ${progressBar}
      <div class="container quiz-container">
        <div class="question-card">
          <div class="q-meta">
            <span class="q-type">${qTypeLabels[question.type] || question.type || '选择题'}</span>
            <span class="q-diff diff-${question.difficulty || 'medium'}">${diffLabels[question.difficulty] || question.difficulty || '中等'}</span>
            <span class="q-know">${(question.knowledge || question.knowledgePoints || [])[0] || ''}</span>
          </div>
          <div class="q-prompt">${esc(question.prompt || question.stem || '')}</div>
          <div class="q-options">${optionsHtml}</div>
          ${nextBtn}
          ${showResult && question.explanation ? `<div class="q-explanation">${esc(question.explanation)}</div>` : ''}
        </div>
      </div>
    </div>`;
}

export function renderQuizResult({ root, data = {} } = {}) {
  if (!root) return;
  const { score = 0, correct = 0, total = 0, onRetry, onDashboard } = data;
  const icon = score >= 80 ? '\u{1F389}' : score >= 60 ? '\u{1F44D}' : '\u{1F4AA}';
  root.innerHTML = `
    <div class="page result-page">
      <div class="container">
        <div class="result-card">
          <div class="result-icon">${icon}</div>
          <h2>测试完成！</h2>
          <div class="result-score">${score}分</div>
          <p>答对 ${correct}/${total} 题</p>
          <div class="result-breakdown">
            <div class="rb-item"><span>正确率</span><strong>${score}%</strong></div>
            <div class="rb-item"><span>用时</span><strong>${total}题</strong></div>
          </div>
          <div class="result-actions">
            <button class="btn-primary" data-action="retry">重做</button>
            <button class="btn-secondary" data-action="dashboard">查看学情</button>
          </div>
        </div>
      </div>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
