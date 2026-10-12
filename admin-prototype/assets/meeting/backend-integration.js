/* Backend collection integration: same record, same state, explicit navigation. */
(()=>{'use strict';
const M=window.Meeting;if(!M)return;
const F=M.file,P=window.PX,Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)],qs=new URLSearchParams(location.search),E=M.e;
const I=window.BackendIntegration={};
const bind=(n,fn)=>{if(!n)return;n.removeAttribute('onclick');n.dataset.pxOwn='1';n.onclick=ev=>{ev.preventDefault();fn(ev);};};
const go=(f,p={})=>location.href=f+(Object.keys(p).length?'?'+new URLSearchParams(p):'');
const fields=root=>[...root.querySelectorAll('input:not([type=file]),select,textarea,[contenteditable=true],.tagsel,.msel')];
const capture=root=>fields(root).map((n,i)=>({i,id:n.id,value:n.matches('[contenteditable=true],.tagsel,.msel')?n.innerHTML:n.value,html:n.matches('[contenteditable=true],.tagsel,.msel'),checked:n.checked}));
const restore=(root,values)=>{const nodes=fields(root);(values||[]).forEach(v=>{const n=v.id?document.getElementById(v.id):nodes[v.i];if(!n||!root.contains(n))return;if(v.html)n.innerHTML=M.safeHTML(v.value);else if(n.type==='checkbox'||n.type==='radio')n.checked=!!v.checked;else n.value=v.value??'';});};
const set=(id,v)=>{const n=document.getElementById(id);if(n)n.value=v??'';};
const val=id=>document.getElementById(id)?.value?.trim()||'';
const grid=rows=>'<div class="mt-grid">'+rows.map(([k,v])=>'<div><small class="mt-note">'+E(k)+'</small><p>'+E(v??'—')+'</p></div>').join('')+'</div>';
const modelList=()=>M.read('bdh-model-catalog-v1',[]);
const dsList=()=>M.read('agri-datasets',MeetingSeeds.datasets);
I.uploads=(root,key,load=false)=>{
 const slots=[...root.querySelectorAll('*')];slots.forEach((n,i)=>n.dataset.integrationSlot=i);
 if(load)(M.read(key,[])||[]).forEach(s=>{const n=slots[s.slot];if(!n)return;n.querySelectorAll(':scope>.px-upload').forEach(x=>x.remove());n.insertAdjacentHTML('beforeend',M.safeHTML(s.html));n.querySelectorAll(':scope>.px-upload>button').forEach(b=>bind(b,()=>b.parentElement.remove()));});
 return ()=>M.write(key,[...new Set(QA('main .px-upload').map(n=>n.parentElement))].filter(n=>root.contains(n)).map(n=>({slot:+n.dataset.integrationSlot,html:[...n.querySelectorAll(':scope>.px-upload')].map(x=>x.outerHTML).join('')})));
};

// Keep the current navigation hierarchy, including the new workbench and two approval pages.
const active=/后台-(课题|科研人员)/.test(F)?'课题管理':/后台-(审批中心|资源申请审批)/.test(F)?'审批中心':/后台-(模型|数据集|案例|需求|门户|通知公告)/.test(F)?'运营管理':null;
if(active)QA('.main-nav a').forEach(a=>a.classList.toggle('active',a.textContent.trim()===active));
QA('.brand').forEach(a=>{a.href='index.html';a.removeAttribute('onclick');});
if(/后台-(课题|科研人员)/.test(F)){
 const side=Q('.admin-side');
 if(side){let a=[...side.querySelectorAll('a')].find(a=>/课题管理工作台/.test(a.textContent));if(!a){a=document.createElement('a');a.className='snav';a.textContent='课题管理工作台';a.href='后台-课题工作台.html';side.querySelector('.side-title')?side.querySelector('.side-title').after(a):side.prepend(a);}}
}
// A selected submenu on a detail page must also provide a way back to its list.
const listMap={模型:'后台-模型管理.html',数据集:'后台-数据集管理.html',案例:'后台-案例管理.html',需求:'后台-需求管理.html',科研空间:'后台-科研空间管理.html',通知公告:'后台-门户管理-通知公告.html'};
QA('.admin-side a').forEach(a=>{if(!/^javascript:|^#$/.test(a.getAttribute('href')||''))return;for(const [k,f] of Object.entries(listMap))if(a.textContent.includes(k)&&F!==f){a.href=f;a.removeAttribute('onclick');}});
if(P){
 const old=P.action;
 P.action=(msg,el)=>{
  if(/科研开发空间列表/.test(msg))return go('后台-科研空间管理.html');
  if(/每页条数/.test(msg))return;
  if(/保存并发布/.test(msg))return P.save(true);
  return old(msg,el);
 };
 // File buttons report actual available material; no simulated download completion.
 window.openPack=()=>M.dialog('原始文件',Q('.of-list,.files-body,#fileBody')?.innerHTML||'<p>原型仅包含文件清单，未附带原始资源文件。</p>');
 if(window.dlFiles)window.dlFiles=()=>{const tr=P.last?.closest('tr'),r=window.ROWS?.find(x=>x.key===tr?.dataset.modelKey);M.dialog('模型材料',r?'<ul>'+r.files.map(f=>'<li>'+E(f)+'</li>').join('')+'</ul><p class="mt-note">原型仅包含文件清单，未附带原始模型材料。</p>':'<p>未找到关联材料。</p>');};
}
if(F==='后台-模型管理.html'&&qs.has('record')&&!qs.has('action')){
 const r=ROWS.find(r=>r.key===qs.get('record'));if(r){set('kw',r.no);P.filter();}
}
if(F==='后台-科研人员推荐.html'){
 const base=window.renderRows,all=[...REC,...ALL];
 const guideKey='agri-proto-v2:后台-课题指南管理.html:rows',guides=M.read(guideKey,BackendSeeds.guides);
 const defaultDirections=[{name:'水稻长势动态监测',tags:['长势监测','水稻','时序预测']},{name:'玉米病虫害识别',tags:['病虫害识别','玉米','图像分类']}];
 let directions=defaultDirections;
 const loadDirections=()=>{const g=guides.find(g=>g.n===val('f2'));directions=g?.directions|| (g?.n===BackendSeeds.guides[0]?.n?defaultDirections:[]);Q('#f3').innerHTML='<option value="">全部方向</option>'+directions.map(d=>'<option>'+E(d.name)+'</option>').join('');if(directions.length)Q('#f3').selectedIndex=1;};
 const loadGuides=()=>{const year=val('f1').slice(0,4);Q('#f2').innerHTML=guides.filter(g=>g.yb.startsWith(year)).map(g=>'<option>'+E(g.n)+'</option>').join('');loadDirections();};
 Q('#f1').onchange=()=>{loadGuides();renderRows();};Q('#f2').onchange=()=>{loadDirections();renderRows();};Q('#f3').onchange=()=>renderRows();
 P.filter=()=>{const q=val('kw').toLowerCase();QA('#tbody tr').forEach(tr=>tr.dataset.pxMatch=tr.textContent.toLowerCase().includes(q)?'1':'0');P.paginate(1);};
 window.renderRows=()=>{base();QA('#tbody .eye').forEach(n=>bind(n,()=>M.dialog('联系信息','<p>'+E(n.parentElement.textContent.trim())+'</p>')));P.filter();};
 window.rowsOf=()=>{if(CUR!=='rec')return all;const d=directions.filter(d=>!val('f3')||d.name===val('f3')),tags=[...new Set(d.flatMap(d=>d.tags))];return all.map(r=>({...r,matched:r.tags.filter(t=>tags.includes(t))})).filter(r=>r.matched.length).sort((a,b)=>b.matched.length-a.matched.length).map(r=>({...r,basis:r.matched.join('、')}));};
 Q('#kw').onkeydown=e=>{if(e.key==='Enter')P.filter();};
 loadGuides();renderRows();
}

// Resource and outcome approvals retain their record ID and refresh the same source data.
if(window.ApprovalCenter){
 const A=ApprovalCenter;
 if(qs.has('type')){A.state.type=qs.get('type');set('approval-type',A.state.type);}
 if(qs.get('tab')==='done')A.state.tab='done';
 if(qs.has('request')){const r=A.rows().find(r=>String(r.id)===qs.get('request'));if(r){A.state.tab=r.status==='待审批'?'wait':'done';A.render();(qs.get('action')==='review'?A.review:A.viewRecord)(r.key);}else M.toast('未找到该申请记录');}
 A.render();
}
const viewOutcome=M.viewOutcome;
M.viewOutcome=id=>{
 viewOutcome(id);const r=M.records().find(x=>x.id===id);if(!r)return;
 const code=r.projectCode||r.metadata?.projectCode,p=M.projects().find(x=>x.code===code),body=Q('#mtDialog .mt-body');
 if(body&&p)body.insertAdjacentHTML('afterbegin','<p>关联课题：<a class="mt-link" href="后台-课题管理.html?project='+encodeURIComponent(code)+'">'+E(p.name)+'</a></p>');
 if(r.status==='已通过'&&(r.acceptedAssetId||r.assetId)){
  const id=r.acceptedAssetId||r.assetId,url=r.kind==='model'?'后台-模型管理.html?record='+encodeURIComponent(id):'后台-数据集详情编辑-已完善.html?asset='+encodeURIComponent(id);
  Q('#mtDialog footer')?.insertAdjacentHTML('beforeend','<a class="mt-btn primary" href="'+url+'">查看入库资源</a>');
 }
};

// Overview actions use the actual queues from the two approval pages.
if(F==='index.html'){
 const original=window.renderTable;
 const rebuild=()=>{
  const approvals=M.read('agri-approvals',ApprovalSeeds),wait=[...(approvals.WAIT||[]),...(approvals.WAIT2||[])].filter(r=>r.st==='待审批');
  const convert=r=>({t:r.res||r.type,who:r.who,team:r.org,at:r.at,st:r.st,url:'后台-资源申请审批.html?request='+encodeURIComponent(r.no)+'&action=review'});
  const list=[['model','模型使用申请'],['data','数据使用申请'],['compute','算力申请'],['space','创建科研开发空间']].map(([id,type])=>({id,label:type==='创建科研开发空间'?'科研开发空间申请':type,rows:wait.filter(r=>r.type===type).map(convert)}));
  list.find(x=>x.id==='space').rows.push(...M.read('agri-space-applications-v8',[]).filter(s=>s.state==='申请中').map(s=>({t:s.name,who:s.who||s.applicant,team:s.team,at:s.time,st:'待审批',url:'后台-资源申请审批.html?spaceRequest='+encodeURIComponent(s.id)})));
  list.push({id:'outcomes',label:'成果验收',rows:M.records().filter(r=>r.status==='待审批').map(r=>({t:r.name,who:r.applicant,team:r.spaceName||'',at:r.time,st:r.status,url:'后台-审批中心.html?outcome='+encodeURIComponent(r.id)}))});
  list.push({id:'coop',label:'合作申请受理',rows:M.read('agri-cooperation',[]).map((r,i)=>({...r,i})).filter(r=>!['已受理','不予受理'].includes(r.status)).map(r=>({t:r.name,who:r.who,team:r.name,at:r.time,st:r.status,url:'后台-合作申请受理.html?item='+r.i}))});
  window.TAB_DATA=list.map(t=>({...t,cnt:t.rows.length}));if(!list.some(t=>t.id===CUR_TAB))window.CUR_TAB='model';
  window.renderTabs();window.renderTable();
  const numbers=QA('.kpi-val');
  const counts=[modelList().filter(r=>r.up==='on').length,dsList().filter(r=>r.pub==='on').length,BackendState.spaces().length];
  counts.forEach((n,i)=>{if(numbers[i])numbers[i].innerHTML=n+'<small>个</small>';});
 };
 window.renderTable=()=>{const rows=curTab().rows;CUR_PAGE=Math.max(1,Math.min(CUR_PAGE,Math.ceil(rows.length/PAGE_SIZE)||1));original();QA('#todoBody tr').forEach((tr,i)=>{const r=rows[(CUR_PAGE-1)*PAGE_SIZE+i],a=tr.querySelector('a');if(a&&r){a.removeAttribute('onclick');a.href=r.url;a.textContent=CUR_TAB==='coop'?'查看材料 ›':'去审批 ›';}});if(!rows.length)Q('#todoBody').innerHTML='<tr><td colspan="6" style="text-align:center;padding:30px;color:#7e928a">暂无待处理事项</td></tr>';};
 window.doRefresh=()=>{rebuild();set('updTime','更新于 '+M.date());if(Q('#updTime'))Q('#updTime').textContent='更新于 '+M.date();M.toast('已刷新');};
 const spaces=BackendState.spaces();QA('[onclick*="空间运行详情"]').forEach((b,i)=>bind(b,()=>go('后台-科研空间详情.html',{space:(spaces.filter(s=>s.st==='err')[i]||spaces[i]||spaces[0]).no})));
 rebuild();window.addEventListener('pageshow',rebuild);window.addEventListener('storage',rebuild);
}
if(F==='后台-合作申请受理.html'&&qs.has('item')){const i=+qs.get('item');if(M.read('agri-cooperation',[])[i])handle(i);}

// Space detail and controls follow the selected instance, not the first demo row.
if(F==='后台-科研空间管理.html'||F==='后台-科研空间详情.html'){
 let all=BackendState.spaces(),selected=null;
 if(F.includes('详情')){
  const no=qs.get('space')||'RS-2026-001';selected=all.find(r=>r.no===no);
  if(!selected){Q('main').innerHTML='<section class="card" style="padding:28px"><h1>该科研空间已不存在</h1><p><a href="后台-科研空间管理.html">返回科研空间列表</a></p></section>';return;}
  window.ROWS=[selected];Q('.d-hd h1').textContent=selected.name;
  Q('.d-meta').innerHTML='空间编号：<b>'+E(selected.no)+'</b> · 负责人：<b>'+E(selected.who)+'</b>'+(selected.team?' · 所属团队：<b>'+E(selected.team)+'</b>':'');
  // Only the original first sample has file/member/mount contents; do not show its data on other spaces.
  if(no!=='RS-2026-001'){
   QA('.col-l tbody').forEach(t=>t.innerHTML='<tr><td colspan="6" class="mt-empty">暂无记录</td></tr>');
   QA('.mtab em').forEach(n=>n.textContent='（0）');
   if(Q('.members'))Q('.members').innerHTML='<div class="member"><div class="mem-n">'+E(selected.who)+'</div><div class="mem-r">负责人</div></div>';
   const count=Q('.members')?.closest('.card')?.querySelector('.hd-act');if(count)count.textContent='1 人';
   window.switchMtab=a=>{QA('.mtab').forEach(n=>n.classList.toggle('cur',n===a));};
  }
  const render=()=>{
   const text=({run:'运行中',stop:'已停止',err:'异常',boot:'重启中',deleted:'已释放'})[selected.st]||selected.st;
   const badge=Q('.dev-badge');if(badge)badge.textContent=text;
   const vals=[selected.cpu+' 核',selected.gpu+' 卡',selected.mem+' GB',selected.quota+' GB'];QA('.dev-cell .v').forEach((n,i)=>{if(vals[i])n.textContent=vals[i];});
   const buttons=QA('.dev-btns button');buttons.forEach(b=>b.disabled=selected.st==='deleted');
   bind(buttons[0],()=>openConfig(selected.no));
   if(buttons[1]){buttons[1].textContent=selected.st==='run'?'停止实例':'启动实例';bind(buttons[1],()=>{if(selected.st==='run')openStop(selected.no);else M.dialog('启动实例',grid([['科研空间',selected.name],['CPU / GPU',selected.cpu+' 核 / '+selected.gpu+' 卡'],['内存',selected.mem+' GB']]),M.btn('取消','Meeting.close()')+M.btn('确认启动','BackendIntegration.startSpace()',true));});}
   bind(buttons[2],()=>openRestart(selected.no));bind(buttons[3],()=>openDelete(selected.no));
   if(Q('.f-usage .t'))Q('.f-usage .t').textContent='已使用 '+selected.sto+' GB / '+selected.quota+' GB';
   QA('.usage-row').forEach(n=>{const k=n.querySelector('.k')?.textContent,v=n.querySelector('.v');if(!v)return;if(k.includes('存储'))v.textContent=selected.sto+' GB / '+selected.quota+' GB';else if(selected.st!=='run'||no!=='RS-2026-001'){v.textContent='—';const bar=n.querySelector('.bar i');if(bar)bar.style.width='0';}});
  };
  I.startSpace=()=>{selected.st='run';BackendState.saveSpace(selected);M.close();render();};
  const ok=window.okM;window.okM=(id,msg)=>{if(!validateSpaceConfig(id))return;ok(id,msg);BackendState.saveSpace(selected);render();};
  render();
  const outcomes=QA('.col-l .card').find(n=>n.querySelector('h2')?.textContent.includes('成果'));
  if(outcomes){const rows=M.records().filter(r=>r.spaceId===no||r.spaceNo===no||(no==='RS-2026-001'&&r.id==='EX-CG-001'));const body=outcomes.querySelector('tbody');if(body)body.innerHTML=rows.map(r=>'<tr><td>'+E(r.name)+'</td><td>'+E(r.kind==='model'?'成果模型':'成果数据')+'</td><td>'+E(r.applicant)+'</td><td>'+E(r.time)+'</td><td>'+M.link('查看',`Meeting.viewOutcome('${r.id}')`)+'</td></tr>').join('')||'<tr><td colspan="5" class="mt-empty">暂无成果记录</td></tr>';}
 }else{
  window.ROWS=all;const original=window.renderRows;
  window.renderRows=()=>{original();QA('#tbody tr').forEach((tr,i)=>{const r=ROWS[i];if(!r)return;const a=tr.querySelector('.ops a');if(a){a.removeAttribute('onclick');a.href='后台-科研空间详情.html?space='+encodeURIComponent(r.no);}});P.filter();};
  const ok=window.okM;window.okM=(id,msg)=>{if(!validateSpaceConfig(id))return;ok(id,msg);ROWS.forEach(BackendState.saveSpace);ROWS=BackendState.spaces();renderRows();};
  window.renderRows();
  if(qs.has('space')){set('kw',qs.get('space'));P.filter();}
  QA('[onclick*="已刷新资源概况"]').forEach(n=>bind(n,()=>{ROWS=BackendState.spaces();renderRows();M.toast('空间状态已刷新');}));
 }
 function validateSpaceConfig(id){
  if(id!=='m-config')return true;
  const ns=QA('#cfgBody .st-i');for(let i=0;i<ns.length;i++){const n=ns[i],v=Number(n.value),tr=n.closest('tr'),max=+tr.dataset.cur+(+tr.dataset.free);if(!Number.isInteger(v)||v<(i===1?0:1)||v>max){M.toast('请输入有效配置，且不超过当前可分配资源');n.focus();return false;}}
  const used=Number(Q('#m-config .sto-used')?.textContent.replace(/[^\d.]/g,''))||0;if(+ns[3]?.value<used){M.toast('存储配额不能小于实际已用容量');return false;}return true;
 }
}

// Guide fields live in the drawer; persist the whole drawer, directions and attachments.
if(F==='后台-课题指南管理.html'){
 const drawer=Q('#drawer'),initial=drawer.innerHTML;let index=-1;
 drawer.classList.remove('open');
 const targets=()=>fields(drawer);
 window.openDrawer=i=>{
  index=Number.isInteger(i)?i:-1;drawer.innerHTML=initial;drawer.classList.add('open');
  const r=ROWS[index];set('g-name',r?.n||'');
  if(r){const parts=r.yb.split(' / ');set('g-year',parts[0]);set('g-batch',parts[1]);if(r.drawerHTML){drawer.innerHTML=r.drawerHTML;restore(drawer,r.drawerFields);}}
  else{drawer.querySelectorAll('[contenteditable=true]').forEach(n=>n.innerHTML='');drawer.querySelectorAll('.dir-card,.dir-item').forEach(n=>n.remove());drawer.querySelectorAll('.attach-item,.att-row,.file-pill').forEach(n=>n.remove());}
  drawer.querySelectorAll('[onclick*="删除该研究方向"]').forEach(n=>bind(n,()=>n.closest('.dir-card,.dir-item')?.remove()));
 };
 P.save=()=>{
  const name=val('g-name');if(!name){M.toast('请填写指南名称');return false;}
  if(ROWS.some((r,i)=>i!==index&&r.n===name)){M.toast('已存在同名指南');return false;}
  let r=ROWS[index];if(!r){r={st:'草稿',at:'—'};ROWS.unshift(r);index=0;}
  const directions=[...drawer.querySelectorAll('.dir-card')].map(n=>({name:n.querySelector('.nm,strong')?.textContent.replace(/^方向\d+[：:]/,'').trim()||'',tags:n.dataset.tags?n.dataset.tags.split(/[、,，]/).filter(Boolean):[...n.querySelectorAll('input:checked')].map(i=>i.closest('label').textContent.trim())}));
  Object.assign(r,{n:name,yb:val('g-year')+' / '+val('g-batch'),drawerHTML:drawer.innerHTML,drawerFields:capture(drawer),directions});
  if(!M.write(P.key+':rows',ROWS))return false;closeDrawer();renderRows();M.toast('指南已保存');return true;
 };
 const prev=P.action;P.action=(msg,el)=>{
  if(/添加研究方向/.test(msg))return M.dialog('添加研究方向','<form id="guide-direction-form">'+M.field('dir-name','方向名称')+M.field('dir-tags','模型方向标签')+M.field('dir-intro','研究内容','','textarea')+'</form>',M.btn('取消','Meeting.close()')+'<button form="guide-direction-form" type="submit" class="mt-btn primary">保存</button>'),Q('#guide-direction-form').onsubmit=e=>{e.preventDefault();const n=document.createElement('div');n.className='dir-card';n.dataset.tags=val('mt-dir-tags');n.innerHTML='<div style="padding:18px"><strong>'+E(val('mt-dir-name'))+'</strong><p>'+E(val('mt-dir-tags'))+'</p><p>'+E(val('mt-dir-intro'))+'</p><button type="button" class="lnk" onclick="this.closest(\'.dir-card\').remove()">删除</button></div>';el.before(n);M.close();};
  return prev(msg,el);
 };
 const ph=window.ph;window.ph=(name,el=P.last)=>{if(!/发布.*撤回/.test(name))return ph(name,el);const i=el.closest('tr').rowIndex-1,r=ROWS[i];M.dialog(r.st==='已发布'?'撤回指南':'发布指南','<p>'+E(r.n)+'</p>',M.btn('取消','Meeting.close()')+M.btn('确认',`BackendIntegration.guideStatus(${i})`,true));};
 I.guideStatus=i=>{const r=ROWS[i];r.st=r.st==='已发布'?'已撤回':'已发布';if(r.st==='已发布')r.at=M.date().slice(0,10);M.write(P.key+':rows',ROWS);M.close();renderRows();};
 Q('#kw').onkeydown=e=>{if(e.key==='Enter')P.filter();};
}

// Topic edit keeps existing team/person choices and associates an existing guide.
if(F==='后台-课题管理.html'){
 const edit=M.projectEdit;M.projectEdit=(code,mode)=>{
  edit(code,mode);if(mode==='view'||mode==='status')return;
  const r=M.projects().find(x=>x.code===code)||{},team=Q('#mt-team'),who=Q('#mt-who');
  if(r.team&&![...team.options].some(o=>o.value===r.team))team.add(new Option(r.team,r.team,true,true));
  if(r.who&&![...who.options].some(o=>o.value===r.who))who.add(new Option(r.who,r.who,true,true));
  if(code)Q('#mt-code').readOnly=true;
  const guides=M.read('agri-proto-v2:后台-课题指南管理.html:rows',[]),values=[...new Set([r.guide,...guides.map(g=>g.n),...M.projects().map(p=>p.guide)].filter(Boolean))];
  const old=Q('#mt-guide'),select=document.createElement('select');select.id=old.id;select.name=old.name;select.required=true;select.innerHTML='<option value="">请选择</option>'+values.map(v=>'<option '+(v===r.guide?'selected':'')+'>'+E(v)+'</option>').join('');old.replaceWith(select);
 };
 if(qs.has('project')&&['edit','status'].includes(qs.get('action')))M.projectEdit(qs.get('project'),qs.get('action'));
}

// Content editors keep drafts, rich text, cover previews and status with the selected record.
const family=[['需求','后台-需求管理','r-name'],['案例','后台-案例管理','c-name'],['公告','后台-门户管理-通知公告','fTitle']].find(([k])=>F.includes(k)&&!F.includes('首页内容'));
if(family&&P){
 const [kind,list,nameId]=family,key='agri-records:'+kind,rows=M.read(key,[]),rid=qs.get('item');
 if(/新增|编辑/.test(F)){
  const main=Q('main'),isNew=F.includes('新增'),r=rows.find(x=>x._id===rid);let id=rid||null;
  const name=r?.name||r?.t||r?.title||'';
  if(isNew){fields(main).forEach(n=>{if(n.matches('[contenteditable=true]'))n.innerHTML='';else if(n.tagName==='INPUT'||n.tagName==='TEXTAREA')n.value=n.id==='c-ord'?'10':'';});}
  if(r){if(r.integrationFields)restore(main,r.integrationFields);set(nameId,name);if(kind==='案例'){set('c-model',r.m);set('c-ord',r.ord);const toggle=Q('#stBtn');if(toggle){toggle.dataset.v=r.st;toggle.textContent=r.st==='on'?'展示':'隐藏';toggle.classList.toggle('ok',r.st==='on');}}if(kind==='需求'){set('r-org',r.org);set('r-dir',r.dir);set('r-svc',r.svc?.[0]);set('r-brief',r.brief);}}
  // Some original edit fields were drawn as chips rather than the new-page select.
  if(kind==='需求'&&!Q('#r-dir')){const tags=main.querySelectorAll('.tagsel');if(r){if(tags[0])tags[0].innerHTML='<span class="chip">'+E(r.dir)+'</span>';if(tags[1])tags[1].innerHTML=(r.svc||[]).map(x=>'<span class="chip">'+E(x)+'</span>').join('');}}
  const saveUploads=I.uploads(main,'agri-content-uploads:'+kind+':'+(id||'new'),!!r);
  QA('main a[href*="详情"]').forEach(a=>{if(id)a.href=a.getAttribute('href').split('?')[0]+'?item='+encodeURIComponent(id);});
  P.save=(publish=false)=>{
   const name=val(nameId);if(!name){M.toast('请填写'+(kind==='公告'?'公告标题':kind+'名称'));return false;}
   if(kind==='案例'&&!val('c-model')){M.toast('请选择关联模型');return false;}
   const a=M.read(key,[]);id=id||'new-'+Date.now();let item=a.find(x=>x._id===id);if(!item){item={_id:id,st:kind==='案例'?'off':'draft'};a.unshift(item);}
   Object.assign(item,{name,title:name,n:name,t:name,d:M.date().slice(0,10),ut:M.date(),integrationFields:capture(main),_fields:fields(main).map((n,i)=>({id:n.id,i,value:n.isContentEditable?n.innerHTML:n.value,editable:n.isContentEditable}))});
   if(publish){item.st=kind==='案例'?'on':'pub';item.pt=M.date();}
   if(kind==='案例'){item.m=val('c-model').replace(/（MDL-[^）]+）$/,'');item.model=item.m;item.ord=+val('c-ord')||0;const toggle=Q('#stBtn');if(toggle&&!isNew)item.st=toggle.dataset.v||'off';const m=modelList().find(m=>m.name===item.m);item.no=m?.no||val('c-model').match(/（(MDL-[^）]+)）$/)?.[1]||item.no||'';item.th=item.th||'field';}
   if(kind==='需求'){const tags=main.querySelectorAll('.tagsel');item.no=item.no||'REQ-'+Date.now();item.org=val('r-org');item.dir=val('r-dir')||tags[0]?.textContent.replaceAll('✕','').trim()||'';item.svc=Q('#r-svc')?[val('r-svc')].filter(Boolean):[...tags[1]?.querySelectorAll('.chip,.px-chip')||[]].map(x=>x.textContent.replaceAll('✕','').trim());item.brief=val('r-brief');}
   if(kind==='公告')item.sum=val('fSum');
   if(!M.write(key,a))return false;
   const uploadData=[...new Set(QA('main .px-upload').map(n=>n.parentElement))].map(n=>({slot:+n.dataset.integrationSlot,html:[...n.querySelectorAll(':scope>.px-upload')].map(x=>x.outerHTML).join('')}));M.write('agri-content-uploads:'+kind+':'+id,uploadData);
   go(list+'.html',{saved:id});return true;
  };
  QA('main button').filter(b=>/保存/.test(b.textContent)).forEach(b=>bind(b,()=>P.save(b.textContent.includes('发布'))));
  if(window.savePub)window.savePub=()=>P.save(true);
 }
 if(F===list+'.html'){
  window.DATA=rows;const render=window.renderRows;
  window.renderRows=()=>{render();QA('#tbody tr').forEach((tr,i)=>{const r=DATA[i];if(!r)return;const action=tr.querySelectorAll('a[href]');action.forEach(a=>{const path=a.getAttribute('href').split('?')[0];if(/\.html$/.test(path))a.href=path+'?item='+encodeURIComponent(r._id);});});P.filter();};
  renderRows();
  if(qs.has('saved'))M.toast('已保存，列表已更新');
 }
 if(/详情\.html$/.test(F)&&rid){
  const r=rows.find(x=>x._id===rid);QA('main a[href*="编辑"]').forEach(a=>a.href=a.getAttribute('href').split('?')[0]+'?item='+encodeURIComponent(rid));
  if(r){QA('main [onclick*="下架"]').forEach(b=>bind(b,()=>M.dialog('下架需求','<p>'+E(r.name)+'</p>',M.btn('取消','Meeting.close()')+M.btn('确认下架',`BackendIntegration.offContent('${kind}','${rid}','${list}.html')`,true))));}
 }
 I.offContent=(k,id,list)=>{const rows=M.read('agri-records:'+k,[]),r=rows.find(x=>x._id===id);if(r){r.st='off';r.ut=M.date();M.write('agri-records:'+k,rows);go(list);}};
}

// Dataset detail metadata and previews have one stable asset ID.
if(/^后台-数据集详情编辑/.test(F)){
 const id=qs.get('asset')||({'后台-数据集详情编辑-已完善.html':'DS20260923018','后台-数据集详情编辑-待完善.html':'DS20260923020','后台-数据集详情编辑-数据预览.html':'DS20260923019'})[F],r=dsList().find(r=>r.id===id),main=Q('main');
 if(r){
  M.editorAsset=id;const controls=M.editorControls||{},meta=M.assets()[id]||{};
  const materials=r.files||M.records().find(x=>x.id===r.outcomeId)?.files;
  if(materials){const body=Q('#fileBody')||Q('.of-table tbody');if(body)body.innerHTML=materials.map(f=>'<tr><td>'+E(f.name)+'</td><td>'+(f.size?(f.size/1024).toFixed(1)+' KB':'—')+'</td><td>已关联</td><td>—</td></tr>').join('');QA('.of-more').forEach(n=>n.hidden=true);}
  const defaults={name:r.name,summary:r.desc,version:r.version||'',provider:r.org||'',scale:r.count||'',...meta};
  Object.entries(controls).forEach(([k,n])=>{if(defaults[k]!=null)n.value=defaults[k];});
  const saved=M.read('agri-dataset-form:'+id,null);if(saved)restore(main,saved);
  const saveUploads=I.uploads(main,'agri-dataset-uploads:'+id,true);
  P.save=()=>{
   const v=M.collectMetadata();if(!v.name){M.toast('请填写数据名称');return false;}
   const rows=dsList(),item=rows.find(x=>x.id===id);if(!item){M.toast('数据集已删除，请返回列表');return false;}
   const intro=Q('#mt-backend-intro')?.textContent.trim();
   Object.assign(item,{name:v.name,desc:v.summary,version:v.version,org:v.provider,form:v.modality||item.form,count:v.scale||item.count,todo:!intro||!v.version,link:'后台-数据集详情编辑-已完善.html'});
   if(!M.write('agri-datasets',rows)||!M.write('agri-dataset-form:'+id,capture(main)))return false;M.registerAsset(id,'dataset',v);saveUploads();M.toast('数据集已保存');return true;
  };
  window.saveDraft=window.saveUpd=P.save;
  QA('main button').filter(b=>b.textContent.trim()==='保存更新'||b.textContent.trim()==='保存').forEach(b=>bind(b,()=>{if(P.save())go('后台-数据集管理.html');}));
  QA('[onclick*="进入数据预览"],[onclick*="数据类型未选择"]').forEach(b=>bind(b,()=>go('后台-数据查询.html',{asset:id,mode:/影像|栅格|遥感/.test(r.form)?'image':'table'})));
  QA('#m-pub button').filter(b=>/确认|上架/.test(b.textContent)).forEach(b=>bind(b,()=>{if(!P.save())return;const rows=dsList(),r=rows.find(x=>x.id===id);if(r.todo){M.toast('请完善介绍内容和版本号后再上架');return;}r.pub='on';M.write('agri-datasets',rows);go('后台-数据集管理.html');}));
 }
}
if(F==='后台-数据查询.html'){
 const r=dsList().find(r=>r.id===qs.get('asset'));
 if(r){const h=Q('main h1');if(h)h.textContent=r.name+' · 数据查询';QA('main a[href*="数据集"]').forEach(a=>a.href=(r.link||'后台-数据集详情编辑-已完善.html')+'?asset='+encodeURIComponent(r.id));}
 if(qs.get('mode')==='image'){const n=Q('#mode');if(n)n.selectedIndex=1;draw();}
 const original=window.draw;window.draw=()=>{const farm=val('farm'),day=val('day'),total=samples.filter(x=>(farm==='全部农场'||x.farm===farm)&&(!day||x.date===day)).length;page=Math.max(1,Math.min(page,Math.ceil(total/size)||1));original();};
 window.reset=()=>{set('farm','全部农场');set('day','');page=1;draw();};
}

if(F==='后台-数据集管理.html'){
 const originalOpen=window.openCreate;
 const form=Q('#m-create'),get=label=>[...form.querySelectorAll('.fld')].find(n=>n.querySelector('label')?.textContent.includes(label))?.querySelector('input,select,textarea');
 window.openCreate=()=>{originalOpen();Q('#upList').innerHTML='';refreshUpN();get('数据名称').value='';Q('#createIntro').value='';form.querySelectorAll('.px-upload').forEach(n=>n.remove());};
 window.createDone=()=>{
  const name=get('数据名称')?.value.trim();if(!name){M.toast('请填写数据名称');return;}
  const files=[...Q('#upList').querySelectorAll('.up-name')].map(n=>({name:n.textContent.trim()}));if(!files.length){M.toast('请选择数据文件');return;}
  const id='DS'+Date.now(),r={id,name,desc:val('createIntro'),pub:'off',todo:true,src:'manual',thumb:'',form:get('数据形态')?.value||get('数据类型')?.value||'',type:get('数据类型')?.value||'',org:get('提供方')?.value||'',count:files.length+' 个文件',files,link:'后台-数据集详情编辑-待完善.html'};
  const rows=dsList();rows.unshift(r);if(!M.write('agri-datasets',rows))return;
  M.registerAsset(id,'dataset',{name,summary:r.desc,provider:r.org,modality:r.form,region:get('区域')?.value||'',year:get('数据年份')?.value||'',owner:get('权属归属')?.value||'',scale:r.count});go(r.link,{asset:id});
 };
 const render=window.renderGrid;window.renderGrid=()=>{render();QA('#dsGrid .ds-card').forEach(n=>{const r=dsList().find(r=>r.id===n.dataset.id);if(!r)return;n.querySelectorAll('a[href*="详情编辑"]').forEach(a=>a.href=(r.link||'后台-数据集详情编辑-已完善.html')+'?asset='+encodeURIComponent(r.id));});};renderGrid();
}

// Home content saves are scoped to a card/slot, so one edit never replaces another.
if(F==='后台-门户管理-首页内容.html'){
 const key='agri-home-content-v1';let slot='',button=null,kind='',picked=null;
 const entries=()=>M.read(key,{});
 const apply=(slot,data)=>{
  const b=QA('main [data-slot]').find(b=>b.dataset.slot===slot),card=b?.closest('.pm-card');
  if(card){const n=card.querySelector('.nm'),d=card.querySelector('.ds');if(n)n.textContent=data.name;if(d)d.textContent=data.intro||data.summary||'';}
  if(slot==='hero'){const hero=Q('.pm-hero');if(hero){hero.querySelector('h3').textContent=data.title;hero.querySelector('p').textContent=data.sub;if(data.image)hero.querySelector('.pm-thumb').innerHTML='<img src="'+E(data.image)+'" style="width:100%;height:100%;object-fit:cover" alt="首屏图片">';}}
  if(slot.startsWith('card:')){const b=QA('main [onclick*="openCard"]').find(b=>b.getAttribute('onclick').includes(slot.slice(5))),c=b?.closest('.pm-card')||b?.closest('.pm-row');if(c){const n=c.querySelector('.nm'),d=c.querySelector('.ds');if(n)n.textContent=data.title;if(d)d.textContent=data.desc;if(data.image&&c.querySelector('.pm-thumb'))c.querySelector('.pm-thumb').innerHTML='<img src="'+E(data.image)+'" style="width:100%;height:100%;object-fit:cover" alt="展示图片">';}}
 };
 const assoc=window.openAssoc;window.openAssoc=b=>{assoc(b);button=b;slot=b.dataset.slot;kind=b.dataset.kind;picked=entries()[slot]||null;set('asIntro',picked?.intro||'');if(picked){Q('#asObjName').textContent=picked.name;Q('#asObjDs').textContent=picked.summary||'';}};
 bind(Q('#asSwap'),()=>{
  const records=kind==='ds'?dsList().map(r=>({id:r.id,name:r.name,summary:r.desc})):kind==='mdl'?modelList().map(r=>({id:r.key,name:r.name,summary:r.summary})):M.read('agri-records:案例',[]).map(r=>({id:r._id,name:r.name,summary:''}));
  M.dialog('选择关联内容','<form id="home-resource"><label class="mt-field">'+(kind==='ds'?'数据集':kind==='mdl'?'模型':'案例')+'<select name="resource" required>'+records.map(r=>'<option value="'+E(r.id)+'">'+E(r.name)+'</option>').join('')+'</select></label></form>',M.btn('取消','Meeting.close()')+'<button class="mt-btn primary" form="home-resource">确定</button>');
  Q('#home-resource').onsubmit=e=>{e.preventDefault();picked=records.find(r=>r.id===new FormData(e.target).get('resource'));if(!picked)return;Q('#asObjName').textContent=picked.name;Q('#asObjDs').textContent=picked.summary||'';M.close();};
 });
 const banner=window.openBanner;window.openBanner=()=>{banner();slot='hero';picked=entries()[slot]||null;if(picked){set('bnTitle',picked.title);set('bnSub',picked.sub);}};
 const card=window.openCard;window.openCard=s=>{card(s);slot='card:'+s;picked=entries()[slot]||null;if(picked){set('cdTitle',picked.title);set('cdDesc',picked.desc);}};
 window.okM=(id,msg)=>{
  const values=id==='m-assoc'?{id:picked?.id||'',name:Q('#asObjName').textContent,summary:Q('#asObjDs').textContent,intro:val('asIntro'),kind}:id==='m-banner'?{title:val('bnTitle'),sub:val('bnSub')}:{title:val('cdTitle'),desc:val('cdDesc')};
  if(id!=='m-assoc'&&!values.title){M.toast('请填写标题');return;}
  const image=Q('#'+id+' .px-upload img')?.src||picked?.image;if(image)values.image=image;
  const all=entries();all[slot]=values;if(!M.write(key,all))return;apply(slot,values);closeM(id);M.toast('首页内容已保存');
 };
 Object.entries(entries()).forEach(([s,r])=>apply(s,r));
}

// Search and date range operate on the records currently displayed.
if(P&&Q('#tbody')&&!['后台-模型管理.html','后台-数据集管理.html','后台-科研人员推荐.html'].includes(F)){
 const table=Q('#tbody').closest('table');
 const controls=()=>QA('main input,main select').filter(n=>!(n.compareDocumentPosition(table)&Node.DOCUMENT_POSITION_PRECEDING)&&!n.matches('[type=checkbox],.px-size,.pg-inp')&&!n.closest('.pager,.pagination'));
 P.filter=()=>{
  Q('#tbody .integration-empty')?.remove();
  const words=controls().filter(n=>n.type!=='date').map(n=>n.tagName==='SELECT'?n.selectedOptions[0]?.textContent:n.value).filter(v=>v&&!/全部|请选择|不限/.test(v)).map(v=>v.toLowerCase());
  QA('#tbody tr').forEach(tr=>{let text=tr.textContent.toLowerCase(),yes=words.every(w=>text.includes(w));if(I.dateRange){const [start,end]=I.dateRange,date=tr.textContent.match(/20\d{2}-\d{2}-\d{2}/)?.[0];yes=yes&&!!date&&(!start||date>=start)&&(!end||date<=end);}tr.dataset.pxMatch=yes?'1':'0';});
  P.paginate(1);const tbody=Q('#tbody');tbody.querySelector('.integration-empty')?.remove();if(![...tbody.rows].some(r=>!r.hidden)){const tr=tbody.insertRow();tr.className='integration-empty';tr.innerHTML='<td colspan="'+(table.querySelectorAll('thead th').length||8)+'" style="text-align:center;padding:28px;color:#788d84">暂无符合条件的记录</td>';}
 };
 controls().filter(n=>n.tagName==='INPUT'&&n.type!=='date').forEach(n=>n.onkeydown=e=>{if(e.key==='Enter')P.filter();});
 const reset=()=>{controls().forEach(n=>{if(n.tagName==='SELECT')n.selectedIndex=0;else n.value='';});I.dateRange=null;QA('.range .t,.date-range .t').forEach(n=>n.textContent='选择时间');P.filter();};
 QA('main button').filter(b=>b.textContent.trim()==='重置').forEach(b=>bind(b,reset));
 const action=P.action;P.action=(msg,el)=>{if(/选择.*时间区间|选择.*发布时间区间|选择.*更新时间区间/.test(msg)){return M.dialog('选择时间范围','<form id="integration-dates"><div class="mt-grid"><label class="mt-field">开始日期<input type="date" name="start"></label><label class="mt-field">结束日期<input type="date" name="end"></label></div><p id="integration-date-error" class="mt-error"></p></form>',M.btn('取消','Meeting.close()')+'<button class="mt-btn primary" form="integration-dates">确定</button>'),Q('#integration-dates').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),a=f.get('start'),b=f.get('end');if(a&&b&&a>b){Q('#integration-date-error').textContent='结束日期不能早于开始日期';return;}I.dateRange=[a,b];const n=el.querySelector('.t');if(n)n.textContent=(a||'不限')+' 至 '+(b||'不限');M.close();P.filter();};}return action(msg,el);};
 P.filter();
}
// Dialogs share Escape-to-close behavior, and refresh after back navigation.
document.addEventListener('keydown',e=>{if(e.key==='Escape')QA('.modal-mask.open,.drawer.open').forEach(n=>n.classList.remove('open'));});
window.addEventListener('pageshow',e=>{if(e.persisted&&/管理\.html$/.test(F))location.reload();});
})();
