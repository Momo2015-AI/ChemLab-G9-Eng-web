/**
 * ChemLab portal router.
 * Existing detailed learning routes remain available; top-level portal routes
 * provide a consistent LMS-style navigation layer.
 */
const ROUTES = new Set([
  'home','course','lab','knowledge-map','assessment','progress','ai-tutor',
  'dashboard','graph','quiz','experiment','experiment-result','result','remediation','knowledge-detail'
]);
const hasWindow=()=>typeof window!=='undefined';
function parseHash(hash=hasWindow()?window.location.hash:''){
  const value=hash.replace(/^#\/?/,'')||'home';
  const [page,...parts]=value.split('/');
  return {page:ROUTES.has(page)?page:'home',params:parts};
}
export function createRouter({render,onRoute}={}){
  let started=false;
  const handleRoute=()=>{const route=parseHash();onRoute?.(route);render?.(route)};
  return {
    start(){if(started||!hasWindow())return;started=true;window.addEventListener('hashchange',handleRoute);handleRoute()},
    navigate(page,...params){const safe=ROUTES.has(page)?page:'home';const suffix=params.filter(Boolean).join('/');if(!hasWindow())return;window.location.hash=suffix?`${safe}/${suffix}`:safe},
    current(){return parseHash()},
    stop(){if(hasWindow())window.removeEventListener('hashchange',handleRoute);started=false}
  };
}
export {parseHash,ROUTES};
