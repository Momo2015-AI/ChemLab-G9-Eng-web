const NAV_ITEMS=[['home','首页','home'],['course','课程学习','course'],['lab','虚拟实验','lab'],['knowledge-map','知识地图','knowledge'],['assessment','训练中心','assessment'],['progress','学习报告','progress'],['ai-tutor','AI 化学导师','ai']];
const ICONS={home:'frontend/icons/home.svg',course:'frontend/icons/course.svg',lab:'frontend/icons/flask.svg',knowledge:'frontend/icons/atom.svg',assessment:'frontend/icons/chart.svg',progress:'frontend/icons/chart.svg',ai:'frontend/icons/robot.svg'};
const LABELS={home:'首页',course:'课程学习',lab:'虚拟实验','knowledge-map':'知识地图',assessment:'训练中心',progress:'学习报告','ai-tutor':'AI 化学导师',dashboard:'学习驾驶舱',graph:'知识图谱',quiz:'训练题',experiment:'实验','experiment-result':'实验结果',result:'学习结果',remediation:'针对性补救'};
function icon(name){return `<img class="chem-nav-icon" src="${ICONS[name]||ICONS.home}" alt="" aria-hidden="true">`}
function breadcrumb(route){
  const page=route?.page||'home';
  const label=LABELS[page]||'学习中心';
  return page==='home'?'<span class="chem-breadcrumb-current">首页</span>':`<button class="chem-breadcrumb-home" data-nav="home" type="button">首页</button><span class="chem-breadcrumb-sep">›</span><span class="chem-breadcrumb-current">${label}</span>`;
}
export function mountPortalShell(root){
  if(!root)return null;
  root.className='chem-portal-root';
  root.innerHTML=`<div class="chem-shell"><div class="chem-sidebar-scrim" data-close-nav aria-hidden="true"></div><aside class="chem-sidebar" aria-label="ChemLab 主导航"><button class="chem-brand" data-nav="home" aria-label="返回 ChemLab 首页"><img class="chem-brand-mark" src="frontend/icons/flask.svg" alt=""><span><strong>ChemLab</strong><small>Grade 9 Chemistry</small></span></button><div class="chem-sidebar-label">LEARNING</div><nav class="chem-nav" aria-label="学习模块">${NAV_ITEMS.map(([route,label,iconName])=>`<button class="chem-nav-item" data-nav="${route}" type="button">${icon(iconName)}<span>${label}</span></button>`).join('')}</nav><div class="chem-term-switch" aria-label="教材册次"><div class="chem-term-label">TEXTBOOK</div><div class="chem-term-options"><button type="button" class="chem-term-item active" data-term="upper">上册</button><button type="button" class="chem-term-item" data-term="lower">下册</button></div></div><div class="chem-sidebar-bottom"><div class="chem-status-card"><span class="chem-status-dot"></span><span>学习系统正常</span></div></div></aside><div class="chem-workspace"><header class="chem-header"><button class="chem-menu-toggle" type="button" aria-label="打开导航" aria-expanded="false">☰</button><div class="chem-header-title"><span class="chem-mobile-title">ChemLab</span><span class="chem-breadcrumb">首页</span></div><div class="chem-header-actions"><div class="chem-header-terms" aria-label="教材册次"><button type="button" class="chem-header-term active" data-term="upper">上册</button><button type="button" class="chem-header-term" data-term="lower">下册</button></div><button class="chem-search" type="button" data-nav="home" title="返回学习中心">⌕ <span>学习中心</span></button><button class="chem-ai-button" type="button" data-nav="ai-tutor">✦ AI Tutor</button></div></header><main id="chem-page-root" class="chem-page-root" tabindex="-1"><div class="chem-loading" role="status">ChemLab 正在启动…</div></main><footer class="chem-footer"><button type="button" class="chem-footer-home" data-nav="home">⌂ 返回首页</button><span>⚡ Chemistry Learning Runtime</span><span>Knowledge · Experiment · Assessment · Mastery</span></footer></div></div>`;
  const closeMenu=()=>{root.querySelector('.chem-sidebar')?.classList.remove('open');root.querySelector('.chem-sidebar-scrim')?.classList.remove('visible');root.querySelector('.chem-menu-toggle')?.setAttribute('aria-expanded','false')};
  const navigate=route=>{window.location.hash=route;closeMenu()};
  root.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.nav)));
  const setTerm=term=>{
    root.querySelectorAll('[data-term]').forEach(button=>button.classList.toggle('active',button.dataset.term===term));
    root.dataset.textbookTerm=term;
    if(typeof window!=='undefined') window.chemLabTextbookTerm=term;
    window.dispatchEvent(new CustomEvent('chemlab:term-change',{detail:{term}}));
  };
  root.querySelectorAll('[data-term]').forEach(button=>button.addEventListener('click',()=>setTerm(button.dataset.term)));
  root.querySelector('[data-close-nav]')?.addEventListener('click',closeMenu);
  root.querySelector('.chem-menu-toggle')?.addEventListener('click',()=>{const sidebar=root.querySelector('.chem-sidebar');const button=root.querySelector('.chem-menu-toggle');const open=sidebar?.classList.toggle('open');root.querySelector('.chem-sidebar-scrim')?.classList.toggle('visible',Boolean(open));button?.setAttribute('aria-expanded',String(Boolean(open)))});
  setTerm('upper');
  return root.querySelector('#chem-page-root');
}
export function syncPortalNavigation(root,route){if(!root)return;root.querySelectorAll('.chem-nav-item[data-nav]').forEach(item=>item.classList.toggle('active',item.dataset.nav===route?.page));const crumb=root.querySelector('.chem-breadcrumb');if(crumb)crumb.innerHTML=breadcrumb(route);crumb?.querySelectorAll('[data-nav]').forEach(button=>button.addEventListener('click',()=>{window.location.hash=button.dataset.nav}));}
