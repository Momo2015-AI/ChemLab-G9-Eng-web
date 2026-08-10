/**
 * V1.7 Course View — module sections with day cards and mastery indicators.
 */

import { MODULE_CONFIG, computeDayMastery } from './constants.js';

export function renderCourse({ root, data = {} } = {}) {
  if (!root) return;
  const { manifest = null, lessons = [], progress = {} } = data;
  const modules = manifest?.modules || {};
  const days = manifest?.days || [];

  const moduleHtml = Object.entries(modules).map(([key, mod]) => {
    const modDays = days.filter(d => d.module === key);
    return `<div class="module-section">
      <h3>${mod.order}. ${esc(mod.name)}</h3>
      <div class="day-grid">
        ${modDays.map(d => {
          const done = !!progress?.completed?.[d.day];
          const kp = d.knowledgePoints || [];
          const mastery = computeDayMastery(d, progress);
          return `<div class="day-card ${done ? 'done' : ''}" data-action="start-quiz" data-day="${d.day}">
            <div class="day-num">${d.day}</div>
            <div class="day-name">${esc(d.title)}</div>
            <div class="day-mastery">
              <div class="mini-bar"><div class="mini-fill" style="width:${mastery}%"></div></div>
              <span>${mastery}%</span>
            </div>
            ${d.experiments?.length ? `<div class="day-exp"><span class="badge-exp">实验</span></div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="page course-page">
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
      <div class="container">
        <h2 style="margin-bottom:20px">课程目录</h2>
        ${moduleHtml}
      </div>
      <footer><p>ChemLab-G9 · V1.7</p></footer>
    </div>`;
}

function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
