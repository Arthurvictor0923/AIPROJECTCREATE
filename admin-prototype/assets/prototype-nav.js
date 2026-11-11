(function(){
'use strict';
function init(){
 const file=window.PROTOTYPE_PORTAL_PREVIEW?'index.html':decodeURIComponent(location.pathname.split('/').pop()),admin=file.startsWith('后台-')||file==='index.html';
 const header=document.querySelector('header.site-header.prototype-header');if(!header)return;
 header.dataset.system=admin?'admin':'portal';
 const main=header.querySelector('.main-nav'),toggle=header.querySelector('.menu-toggle');
 let menu=document.getElementById(toggle?.getAttribute('aria-controls'));
 if(menu){menu.classList.add('prototype-mobile');const extras=admin?'':Array.from(menu.children).filter(n=>n.matches('[data-bdh-login],[data-bdh-me],[data-bdh-logout],[data-consult],[data-consult-1020]')).map(n=>n.outerHTML).join('');menu.innerHTML=main.innerHTML+extras;menu.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));menu.hidden=true;menu.classList.remove('open');}
 if(!admin){
  const actions=header.querySelector('.header-actions');
  if(!actions.querySelector('[data-consult],[data-consult-1020]')){const a=document.createElement('a');a.href='合作咨询.html';a.className='button button-primary';a.textContent='合作咨询';a.dataset.consult1020='';actions.insertBefore(a,toggle);}
  if(menu&&!menu.querySelector('[data-consult],[data-consult-1020]')){const a=document.createElement('a');a.href='合作咨询.html';a.textContent='合作咨询';a.dataset.consult1020='';menu.append(a);}
  if(file==='门户-领导数据看板.html'&&menu){const a=document.createElement('a');a.href='个人中心-高保真原型.html';a.textContent='个人中心';menu.append(a);}
  const sync=()=>{const O=window.PortalOrg;header.querySelectorAll('a').forEach(a=>{if(decodeURIComponent(a.getAttribute('href')||'').startsWith('门户-领导数据看板.html'))a.hidden=O?!O.canViewDashboard():false;});if(O?.isLogged()){header.querySelectorAll('.bdh-name,.username').forEach(n=>n.textContent=O.current().name);}};
  sync();window.addEventListener('portal-account-change',sync);window.addEventListener('portal-org-change',sync);
 }
 function close(){if(menu){menu.hidden=true;menu.classList.remove('open');}toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','打开菜单');}
 // Capture once before historical menu handlers, preventing a second toggle.
 window.addEventListener('click',ev=>{if(toggle?.contains(ev.target)){ev.preventDefault();ev.stopImmediatePropagation();const open=menu?.hidden;if(menu){menu.hidden=!open;menu.classList.toggle('open',open);}toggle.setAttribute('aria-expanded',String(!!open));toggle.setAttribute('aria-label',open?'关闭菜单':'打开菜单');return;}
  if(ev.target.closest('[data-prototype-user]')){ev.preventDefault();ev.stopImmediatePropagation();const u=header.querySelector('#userMenu');u?.classList.toggle('open');header.querySelectorAll('[data-prototype-user]').forEach(b=>b.setAttribute('aria-expanded',String(u?.classList.contains('open'))));return;}
  if(menu?.contains(ev.target)&&ev.target.closest('a'))close();if(!header.contains(ev.target)){close();header.querySelector('#userMenu')?.classList.remove('open');}
 },true);
 window.addEventListener('keydown',ev=>{if(ev.key==='Escape'){close();header.querySelector('#userMenu')?.classList.remove('open');}});
 window.addEventListener('resize',close);
 if(admin){
  const nav=[['工作台总览','index.html'],['课题管理','后台-课题工作台.html'],['审批中心','后台-审批中心.html'],['运营管理','后台-模型管理.html'],['平台能力','后台-时空数据管理.html'],['合作与组织','后台-管理设置.html']];
  const labels=nav.map(x=>x[0]),links=main.querySelectorAll('a');links.forEach((a,i)=>{a.textContent=labels[i];a.href=nav[i][1];a.dataset.pxOwn='1';});if(menu)menu.innerHTML=main.innerHTML;
  document.querySelectorAll('.admin-side a').forEach(a=>{const t=a.textContent.trim();const mapping={'工作台总览':'index.html','消息中心':'后台-消息中心.html','个人资料':'后台-个人资料.html','账号安全':'后台-账号安全.html','课题管理工作台':'后台-课题工作台.html','课题指南管理':'后台-课题指南管理.html','科研人员推荐':'后台-科研人员推荐.html','课题管理':'后台-课题管理.html','成果验收审批':'后台-审批中心.html','资源申请审批':'后台-资源申请审批.html','门户管理':'后台-门户管理-首页内容.html','模型管理':'后台-模型管理.html','数据集管理':'后台-数据集管理.html','案例管理':'后台-案例管理.html','需求管理':'后台-需求管理.html','科研空间管理':'后台-科研空间管理.html'};if(mapping[t]){a.href=mapping[t];a.removeAttribute('onclick');a.dataset.pxOwn='1';}});
  if(['后台-时空数据管理.html','后台-地图引擎.html','后台-能力共享.html'].includes(file)){
   const side=document.querySelector('.admin-side');if(side){side.querySelectorAll('.mt-subsystems').forEach(n=>n.remove());const old=Array.from(side.children).filter(n=>!n.classList.contains('side-title'));side.innerHTML='<div class="side-title">平台能力</div>';for(const [label,target] of [['时空数据管理','后台-时空数据管理.html'],['地图引擎','后台-地图引擎.html'],['能力共享','后台-能力共享.html']]){const a=document.createElement('a');a.className='snav'+(file===target?' active':'');a.href=target;a.textContent=label;a.dataset.pxOwn='1';if(file===target)a.setAttribute('aria-current','page');side.append(a);if(file===target){const wrap=document.createElement('div');wrap.className='platform-detail-nav';old.forEach(n=>wrap.append(n));side.append(wrap);}}}
  }
 }else if(file.startsWith('关于平台-')){
  const side=document.querySelector('aside.side');if(side){side.classList.add('prototype-about-side');side.innerHTML='<div class="side-title">关于平台</div>'+[['平台介绍','平台介绍'],['使用帮助','使用帮助'],['开发者接入','开发者接入'],['部署说明','部署说明'],['联系支持','联系支持']].map(([t,s])=>{const current=file==='关于平台-'+s+'.html'||(s==='使用帮助'&&file==='关于平台-数据使用指南.html');return '<a href="关于平台-'+s+'.html"'+(current?' class="active" aria-current="page"':'')+'>'+t+'</a>';}).join('');}
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
