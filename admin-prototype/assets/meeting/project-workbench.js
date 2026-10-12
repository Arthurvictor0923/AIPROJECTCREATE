/* Project manager workbench. Demonstration records are isolated from business stores. */
(() => {
'use strict';
const M=window.Meeting,$=id=>document.getElementById(id),e=M.e;
const requestKey='agri-space-applications-v8';
const demoProjects=MeetingSeeds.projects.map(p=>({...p,st:p.st==='拟立项'&&p.to<'2026-10-11'?'在研':p.st}));
const demoOutcomes=[
 {id:'EX-CG-001',projectCode:'BH2026-013',name:'水稻估产模型',kind:'model',version:'v2.3',status:'已通过',applicant:'李伟',time:'2026-09-18 10:20',files:[{name:'rice_yield_v2.3.pkl'},{name:'evaluation_report.pdf'}],history:[{action:'通过',by:'张明',time:'2026-09-19 09:30',note:'模型材料与运行结果已核对。'}]},
 {id:'EX-CG-002',projectCode:'BH2026-013',name:'建三江水稻生长观测数据集',kind:'dataset',version:'v1.0',status:'已通过',applicant:'王强',time:'2026-09-20 14:30',files:[{name:'rice_observation.csv'},{name:'字段说明.pdf'}],history:[{action:'通过',by:'张明',time:'2026-09-21 10:00',note:'数据材料与字段说明已核对。'}]},
 {id:'EX-CG-003',projectCode:'BH2026-013',name:'寒地水稻栽培试验数据',kind:'dataset',version:'v1.0',status:'待审批',applicant:'王强',time:'2026-10-10 10:30',files:[{name:'cultivation_observations.csv'},{name:'数据说明.pdf'}],history:[]},
 {id:'EX-CG-004',projectCode:'BH2025-008',name:'大豆耐逆性表型观测数据',kind:'dataset',version:'v1.0',status:'已通过',applicant:'刘洋',time:'2026-09-26 09:15',files:[{name:'soybean_phenotype.csv'}],history:[{action:'通过',by:'张明',time:'2026-09-27 10:20',note:'已核对成果材料。'}]},
 {id:'EX-CG-005',projectCode:'BH2025-008',name:'大豆耐逆性分析模型',kind:'model',version:'v1.1',status:'待审批',applicant:'刘洋',time:'2026-10-09 15:40',files:[{name:'soybean_model_v1.1.tar'},{name:'模型说明.pdf'}],history:[]},
 {id:'EX-CG-006',projectCode:'BH2026-021',name:'黑土地碳汇样本数据',kind:'dataset',version:'v1.0',status:'已驳回',applicant:'张明',time:'2026-10-08 11:20',files:[{name:'blacksoil_samples.csv'},{name:'样本说明.pdf'}],history:[{action:'驳回',by:'张明',time:'2026-10-09 09:20',note:'请核对样本字段与说明文件中的单位是否一致，修正后重新提交。'}]}
];
const demoSpaces=[
 {id:'RS-2026-001',no:'RS-2026-001',projectCode:'BH2026-013',name:'水稻估产研究',who:'李伟',st:'run',cpu:16,gpu:1,mem:64,quota:500,kind:'instance'},
 {id:'RS-2026-005',no:'RS-2026-005',projectCode:'BH2026-022',name:'农田长势分析',who:'赵敏',st:'err',cpu:4,gpu:0,mem:16,quota:100,kind:'instance'},
 {id:'RS-2026-009',no:'RS-2026-009',projectCode:'BH2026-021',name:'农田遥感分析',who:'吴丹',st:'stop',cpu:16,gpu:1,mem:64,quota:500,kind:'instance'},
 {id:'EX-SP-001',projectCode:'BH2026-013',name:'水稻栽培模型训练',who:'王强',team:'农业智能计算组',state:'申请中',instance:'未开通',cpu:16,gpu:1,ram:64,storage:500,systemDisk:100,time:'2026-10-10 14:20',compute:{runtime:'Python 3.11'},image:'PyTorch 2.3 / CUDA 12.1',ide:'JupyterLab',desc:'开展寒地水稻栽培模型训练与验证。',kind:'request'}
];
const initialSource=new URLSearchParams(location.search).get('data');
const state={source:initialSource==='demo'?'demo':initialSource==='current'||M.records().length||M.read(requestKey,[]).length?'current':'demo',year:'all',guide:'all',query:'',projectTab:'attention',taskTab:'all',page:1,pageSize:5,detailProject:null,detailTab:'tasks'};
const unique=(rows,key)=>{const seen=new Set();return rows.filter(r=>{const v=String(r[key]??'');if(!v||seen.has(v))return false;seen.add(v);return true;});};
const yearOf=p=>String(p.year||String(p.code).match(/20\d{2}/)?.[0]||'未标注');
const projectCode=r=>r.projectCode||r.metadata?.projectCode||'';
const codeArg=v=>encodeURIComponent(String(v));
const action=(a,v,label,cls='wb-text-btn')=>`<button type="button" class="${cls}" data-pm-action="${a}" data-value="${e(v)}">${label}</button>`;
const link=(url,label,cls='wb-button')=>`<a class="${cls}" href="${e(url)}">${label}</a>`;
const empty=t=>`<div class="wb-empty">${t||'暂无记录'}</div>`;
function badge(s){const cls={'在研':'running','拟立项':'proposed','待审批':'waiting','已通过':'approved','已驳回':'returned','已拒绝':'returned','申请中':'waiting','异常':'returned','运行中':'running'}[s]||'';return `<span class="wb-status ${cls}">${e(s)}</span>`;}
function spaceState(s){return s.kind==='request'?(s.state==='可用'?s.instance||'可用':s.state):({run:'运行中',stop:'已停止',err:'异常',boot:'重启中'}[s.st]||s.st||'—');}
function loadData(){
 const projects=unique(state.source==='demo'?demoProjects:M.read(M.projectsKey,MeetingSeeds.projects),'code');
 const outcomes=unique(state.source==='demo'?demoOutcomes:M.records().map(r=>({...r,projectCode:projectCode(r),version:r.metadata?.version||r.version||'',files:r.files||[],history:r.history||[]})),'id');
 const instances=(window.BackendState?BackendState.spaces().filter(s=>!s.requestId):window.ProjectSpaceSeeds||[]).map(s=>({...s,...M.read('agri-space:'+s.no,{}),id:s.no,kind:'instance'})).filter(s=>s.st!=='deleted');
 const requests=M.read(requestKey,[]).map(s=>({...s,id:String(s.id),projectCode:projectCode(s),kind:'request'}));
 const spaces=unique(state.source==='demo'?demoSpaces:[...instances,...requests],'id');
 return {projects,outcomes,spaces};
}
const kinds={review:{label:'成果待验收',short:'成果验收',action:'查看材料',color:'green'},returned:{label:'成果已驳回',short:'退回跟进',action:'查看意见',color:'amber'},request:{label:'科研空间申请',short:'空间申请',action:'查看申请',color:'blue'},issue:{label:'研究空间异常',short:'空间异常',action:'查看空间',color:'red'}};
function tasksFor(all){
 const tasks=[];
 all.outcomes.forEach(r=>{const kind=r.status==='待审批'?'review':r.status==='已驳回'?'returned':'';if(kind)tasks.push({id:'outcome:'+r.id,recordId:r.id,kind,projectCode:r.projectCode,name:r.name,who:r.applicant,time:r.time||'',record:r});});
 all.spaces.forEach(s=>{const st=spaceState(s),kind=st==='申请中'?'request':st==='异常'?'issue':'';if(kind)tasks.push({id:'space:'+s.id,recordId:s.id,kind,projectCode:projectCode(s),name:s.name,who:s.who||s.applicant||s.team||'',time:s.time||s.at||'',record:s});});
 return tasks;
}
function scoped(){
 const all=loadData(),q=state.query.trim().toLowerCase();
 const projects=all.projects.filter(p=>(state.year==='all'||yearOf(p)===state.year)&&(state.guide==='all'||p.guide===state.guide)&&(!q||[p.code,p.name,p.who,p.org,p.team].join(' ').toLowerCase().includes(q)));
 const codes=new Set(projects.map(p=>p.code)),allCodes=new Set(all.projects.map(p=>p.code));
 const restricted=state.year!=='all'||state.guide!=='all'||!!q;
 const allTasks=tasksFor(all),tasks=allTasks.filter(t=>codes.has(t.projectCode)||(!restricted&&!allCodes.has(t.projectCode)));
 return {all,projects,tasks,restricted,unlinked:allTasks.filter(t=>!allCodes.has(t.projectCode))};
}
function enrich(p,all=loadData()){
 const outcomes=all.outcomes.filter(r=>r.projectCode===p.code),spaces=all.spaces.filter(r=>projectCode(r)===p.code),tasks=tasksFor({outcomes,spaces});
 return {...p,outcomes,spaces,tasks,approved:outcomes.filter(r=>r.status==='已通过'),models:outcomes.filter(r=>r.kind==='model'),datasets:outcomes.filter(r=>r.kind==='dataset')};
}
function projectRows(){const d=scoped();return d.projects.map(p=>enrich(p,d.all)).filter(p=>state.taskTab==='all'||p.tasks.some(t=>t.kind===state.taskTab)).filter(p=>state.projectTab==='all'||state.projectTab==='attention'&&p.tasks.length||state.projectTab==='research'&&p.st==='在研'||state.projectTab==='noOutcome'&&p.st==='在研'&&!p.outcomes.length||state.projectTab==='closed'&&p.st==='已结题');}
function filters(){
 const p=loadData().projects,years=[...new Set(p.map(yearOf))].sort().reverse();if(!years.includes(state.year))state.year='all';
 $('pm-year').innerHTML='<option value="all">全部年度</option>'+years.map(v=>`<option value="${e(v)}">${e(v)} 年</option>`).join('');$('pm-year').value=state.year;
 const guides=[...new Set(p.filter(x=>state.year==='all'||yearOf(x)===state.year).map(x=>x.guide).filter(Boolean))];if(!guides.includes(state.guide))state.guide='all';
 $('pm-guide').innerHTML='<option value="all">全部指南</option>'+guides.map(g=>`<option value="${e(g)}">${e(g)}</option>`).join('');$('pm-guide').value=state.guide;
}
function render(){
 const d=scoped();$('wb-demo-label').hidden=state.source!=='demo';$('pm-mode-note').textContent=state.source==='demo'?'演示数据 · 不写入业务记录':'当前浏览器保存的业务记录';
 document.querySelectorAll('[data-pm-action="source"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.value===state.source));
 $('pm-scope').textContent=`${d.projects.length} 个课题 · ${d.projects.filter(p=>p.st==='在研').length} 个在研${state.taskTab==='all'?'':' · '+kinds[state.taskTab].short}`;
 $('pm-queue-cards').innerHTML=Object.entries(kinds).map(([key,k])=>`<button type="button" class="pm-queue-card ${k.color} ${state.taskTab===key?'selected':''}" data-pm-action="queue" data-value="${key}" aria-pressed="${state.taskTab===key}"><span class="pm-queue-icon">${icon(key)}</span><span class="pm-queue-copy"><span>${k.label}</span><small>${{review:'查看材料，进入验收',returned:'核对退回意见与提交记录',request:'查看研究环境与资源需求',issue:'定位具体空间，协调处理'}[key]}</small></span><strong>${d.tasks.filter(t=>t.kind===key).length}<small>项</small></strong></button>`).join('');
 $('pm-unlinked').hidden=!d.unlinked.length;$('pm-unlinked').innerHTML=action('unlinked','',`${d.unlinked.length} 项事项未关联课题`)+(d.restricted?'<span>，未计入当前筛选</span>':'');
 renderProjects(d);renderTasks(d);
 $('pm-updated').textContent='更新于 '+new Date().toLocaleTimeString('zh-CN',{hour12:false,hour:'2-digit',minute:'2-digit',timeZone:'Asia/Shanghai'});
}
function icon(type){const paths={review:'<path d="M8 3H5v18h14V3h-3M9 2h6v4H9zM8 11h8M8 15h5"/>',returned:'<path d="M8 7H4l4-4M4 7h10a6 6 0 0 1 0 12h-3M8 13v8M4 17h8"/>',request:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M8 10h8M12 7v6"/>',issue:'<path d="m12 3 10 18H2L12 3zM12 9v5M12 17h.01"/>'};return `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${paths[type]}</svg>`;}
function projectTaskTags(p){return Object.entries(kinds).map(([k,x])=>{const n=p.tasks.filter(t=>t.kind===k).length;return n?`<button class="pm-task-tag ${x.color}" data-pm-action="project-tasks" data-value="${e(p.code)}">${x.short} ${n}</button>`:'';}).join('')||'<span class="pm-quiet">暂无待处理事项</span>';}
function renderProjects(d=scoped()){
 const rows=projectRows(),pages=Math.max(1,Math.ceil(rows.length/state.pageSize));state.page=Math.max(1,Math.min(state.page,pages));
 document.querySelectorAll('[data-pm-action="project-filter"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.value===state.projectTab));
 const counts={attention:d.projects.filter(p=>enrich(p,d.all).tasks.length).length,all:d.projects.length,research:d.projects.filter(p=>p.st==='在研').length,noOutcome:d.projects.filter(p=>p.st==='在研'&&!d.all.outcomes.some(r=>r.projectCode===p.code)).length,closed:d.projects.filter(p=>p.st==='已结题').length};
 document.querySelectorAll('[data-pm-count]').forEach(n=>n.textContent=counts[n.dataset.pmCount]);
 $('pm-project-rows').innerHTML=rows.slice((state.page-1)*state.pageSize,state.page*state.pageSize).map(p=>`<tr><td><div class="pm-project-name">${action('project',p.code,e(p.name),'title')}${badge(p.st)}</div><small>${e(p.code)} · ${e(p.type)}</small><div class="pm-responsible">${e(p.who||'未填写负责人')}<span> · ${e(p.org||'未填写单位')}</span></div></td><td><div class="pm-resource-cell">${p.spaces.length?action('project-spaces',p.code,`${p.spaces.length} 个研究空间`):'<span class="pm-quiet">暂无关联空间</span>'}<small>${p.spaces.filter(s=>spaceState(s)==='运行中').length?`${p.spaces.filter(s=>spaceState(s)==='运行中').length} 个运行中`:''}</small></div></td><td>${p.outcomes.length?action('project-outcomes',p.code,`${p.outcomes.length} 项成果`):'<span class="pm-quiet">暂无关联成果</span>'}<small>${p.outcomes.length?`${p.approved.length} 项验收通过`:''}</small></td><td><div class="pm-task-tags">${projectTaskTags(p)}</div></td><td>${action('project',p.code,'跟进 ›')}</td></tr>`).join('')||'<tr><td colspan="5" class="wb-empty">当前筛选下暂无课题</td></tr>';
 $('pm-total').textContent=`共 ${rows.length} 个课题`;$('pm-page-label').textContent=`${state.page} / ${pages}`;$('pm-prev').disabled=state.page===1;$('pm-next').disabled=state.page===pages;
}
function taskCard(t,d){const p=d.all.projects.find(p=>p.code===t.projectCode),k=kinds[t.kind];return `<article class="pm-task-item"><div class="pm-task-type ${k.color}">${k.short}</div><h3>${action(t.kind==='review'||t.kind==='returned'?'outcome':'space',t.recordId,e(t.name),'pm-task-title')}</h3><p>${p?action('project',p.code,e(p.name),'pm-task-project'):'<span class="pm-quiet">未关联课题</span>'}</p><div class="pm-task-bottom"><span>${e(p?.who||t.who||'—')}${t.time?' · '+e(String(t.time).slice(0,10)):''}</span>${action(t.kind==='review'||t.kind==='returned'?'outcome':'space',t.recordId,k.action+' ›')}</div></article>`;}
function renderTasks(d=scoped()){
 const tasks=d.tasks.filter(t=>state.taskTab==='all'||t.kind===state.taskTab);
 $('pm-task-title').textContent=state.taskTab==='all'?'事项清单':kinds[state.taskTab].label;
 $('pm-task-count').textContent=tasks.length+' 项';$('pm-task-all').hidden=state.taskTab==='all';
 $('pm-task-list').innerHTML=tasks.map(t=>taskCard(t,d)).join('')||empty('当前范围没有此类事项');
}
function open(title,sub,body){$('wb-drawer-title').textContent=title;$('wb-drawer-sub').textContent=sub;$('wb-drawer-body').innerHTML=body;if(!$('wb-drawer').open)$('wb-drawer').showModal();$('wb-drawer-body').scrollTop=0;}
function pairs(list){return '<dl class="wb-detail-grid">'+list.map(([k,v])=>`<div><dt>${e(k)}</dt><dd>${e(v??'—')}</dd></div>`).join('')+'</dl>';}
function outcomeTable(rows){return rows.length?`<div class="wb-table-wrap"><table class="wb-table"><thead><tr><th>成果 / 版本</th><th>提交人 / 时间</th><th>验收状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${e(r.name)}<small>${r.kind==='model'?'模型':'数据'} · ${e(r.version||'—')}</small></td><td>${e(r.applicant||'—')}<small>${e(r.time||'—')}</small></td><td>${badge(r.status)}</td><td>${action('outcome',r.id,r.status==='已驳回'?'查看意见':'查看材料')}</td></tr>`).join('')}</tbody></table></div>`:empty('暂无关联成果记录');}
function spaceTable(rows){return rows.length?`<div class="wb-table-wrap"><table class="wb-table"><thead><tr><th>科研空间</th><th>运行 / 申请状态</th><th>计算与存储</th><th>操作</th></tr></thead><tbody>${rows.map(s=>`<tr><td>${e(s.name)}<small>${e(s.who||s.applicant||s.team||'—')}</small></td><td>${badge(spaceState(s))}</td><td>${e(s.cpu??'—')} 核 · ${e(s.gpu??'—')} GPU<small>内存 ${e(s.mem??s.ram??'—')} GB · 存储 ${e(s.quota??s.storage??'—')} GB</small></td><td>${action('space',s.id,'查看')}</td></tr>`).join('')}</tbody></table></div>`:empty('暂无已关联的研究空间');}
function viewProject(code,tab='tasks'){
 const d=scoped(),raw=d.all.projects.find(p=>p.code===code);if(!raw)return;const p=enrich(raw,d.all);state.detailProject=code;state.detailTab=tab;
 const tabs=[['tasks','待跟进事项',p.tasks.length],['outcomes','成果与验收',p.outcomes.length],['spaces','研究资源',p.spaces.length],['profile','课题档案','']];
 let body=`<div class="pm-owner-card"><div class="pm-owner-avatar">${e((p.who||'—')[0])}</div><div><strong>${e(p.who||'未填写负责人')}</strong><span>课题负责人</span><p>${e(p.org||'未填写单位')}${p.team?' · '+e(p.team):''}</p></div>${badge(p.st)}</div><div class="pm-detail-tabs" role="tablist">${tabs.map(([k,n,c])=>`<button role="tab" aria-selected="${tab===k}" data-pm-action="detail-tab" data-value="${k}">${n}${c!==''?` <small>${c}</small>`:''}</button>`).join('')}</div>`;
 if(tab==='tasks')body+=p.tasks.length?p.tasks.map(t=>taskCard(t,d)).join(''):empty('此课题暂无待处理事项');
 if(tab==='outcomes')body+=outcomeTable(p.outcomes);
 if(tab==='spaces')body+=spaceTable(p.spaces);
 if(tab==='profile')body+=pairs([['课题编号',p.code],['年度',yearOf(p)],['所属指南',p.guide],['课题类型',p.type],['课题方向',p.direction||'未设置'],['科研团队',p.team||'未关联'],['公示开始',p.from||'—'],['公示结束',p.to||'—']])+(state.source==='current'?`<div class="wb-drawer-actions">${link('后台-课题管理.html?project='+codeArg(code)+'&action=edit','编辑课题')}${link('后台-课题管理.html?project='+codeArg(code)+'&action=status','调整课题状态','wb-button primary')}</div>`:'');
 open(p.name,(state.source==='demo'?'演示数据 · ':'')+p.code,body);
}
function viewOutcome(id){
 const d=loadData(),r=d.outcomes.find(r=>r.id===id);if(!r)return;const p=d.projects.find(p=>p.code===r.projectCode);
 const latest=(r.history||[]).filter(h=>/驳回|拒绝/.test(h.action)).slice(-1)[0];
 let body=pairs([['所属课题',p?.name||'未关联课题'],['课题负责人',p?.who||'—'],['成果类型',r.kind==='model'?'模型':'数据'],['版本',r.version||'—'],['提交人',r.applicant||'—'],['提交时间',r.time||'—']]);
 body+=`<div class="pm-record-status">${badge(r.status)}</div>`;
 if(r.status==='已驳回')body+=`<section class="pm-review-note"><h3>退回意见</h3><p>${e(latest?.note||'当前记录未保存退回意见')}</p><small>${e(latest?.by||'')} ${e(latest?.time||'')}</small></section>`;
 body+='<h3 class="wb-detail-title">成果材料</h3>'+((r.files||[]).length?'<ul class="pm-files">'+r.files.map((f,i)=>`<li><span>${e(f.name)}</span>${state.source==='current'&&f.blobId?action('download',id+'|'+i,'下载材料'):''}</li>`).join('')+'</ul>':empty('暂无材料记录'));
 if(r.history?.length)body+='<h3 class="wb-detail-title">验收记录</h3><div class="pm-history">'+r.history.map(h=>`<article><b>${e(h.action)}</b><span>${e(h.by)} · ${e(h.time)}</span><p>${e(h.note||'—')}</p></article>`).join('')+'</div>';
 body+='<div class="wb-drawer-actions">'+(p?action('project-outcomes',p.code,'查看课题全部成果','wb-button'):'')+(state.source==='current'?link('后台-审批中心.html?outcome='+codeArg(r.id)+'#outcomes',r.status==='待审批'?'进入成果验收':'进入审批记录','wb-button primary'):'')+'</div>';
 open(r.name,(state.source==='demo'?'演示数据 · ':'')+r.id,body);
}
function viewSpace(id){
 const d=loadData(),s=d.spaces.find(s=>String(s.id)===String(id));if(!s)return;const p=d.projects.find(p=>p.code===projectCode(s));
 let body=pairs([['所属课题',p?.name||'未关联课题'],['课题负责人',p?.who||'—'],['空间负责人 / 申请人',s.who||s.applicant||s.team||'—'],['当前状态',spaceState(s)],['CPU',`${s.cpu??'—'} 核`],['GPU',`${s.gpu??'—'} 张`],['内存',`${s.mem??s.ram??'—'} GB`],['研究存储',`${s.quota??s.storage??'—'} GB`]]);
 if(s.kind==='request')body+='<h3 class="wb-detail-title">开发环境与研究用途</h3>'+pairs([['运行环境',s.compute?.runtime||'—'],['开发镜像',s.image||'—'],['开发工具',s.ide||'—'],['研究用途',s.desc||'—']]);
 body+='<div class="wb-drawer-actions">'+(p?action('project-spaces',p.code,'查看课题研究资源','wb-button'):'')+(state.source==='current'?link(s.kind==='request'?'后台-资源申请审批.html?spaceRequest='+codeArg(s.id):'后台-科研空间详情.html?space='+codeArg(s.no||s.id),s.kind==='request'?'查看空间申请':'进入科研空间管理','wb-button primary'):'')+'</div>';
 open(s.name,(state.source==='demo'?'演示数据 · ':'')+(s.no||s.id),body);
}
function viewUnlinked(){const d=scoped();open('未关联课题的事项',`${d.unlinked.length} 项 · 按现有记录展示`,d.unlinked.map(t=>taskCard(t,d)).join('')||empty());}
function exportCSV(){const rows=[['课题执行跟进',state.source==='demo'?'演示数据':'当前记录'],['年度',state.year==='all'?'全部':state.year],['指南',state.guide==='all'?'全部':state.guide],[],['课题编号','课题名称','负责人','单位','状态','关联空间','成果提交','验收通过','待跟进事项'],...projectRows().map(p=>[p.code,p.name,p.who,p.org,p.st,p.spaces.length,p.outcomes.length,p.approved.length,p.tasks.map(t=>kinds[t.kind].short+'：'+t.name).join('；')])];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/^[=+@\-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='课题跟进清单-'+(state.source==='demo'?'演示数据':'当前记录')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-pm-action]');if(!b)return;const a=b.dataset.pmAction,v=b.dataset.value;
 if(a==='source'){state.source=v;state.year='all';state.guide='all';state.query='';state.page=1;state.projectTab='attention';state.taskTab='all';$('pm-search').value='';$('wb-drawer').close();const u=new URL(location.href);u.searchParams.set('data',v);history.replaceState(null,'',u);filters();render();}
 else if(a==='queue'){state.taskTab=v;state.projectTab='attention';state.page=1;render();$('pm-task-panel').scrollIntoView({behavior:'smooth',block:'nearest'});}
 else if(a==='all-tasks'){state.taskTab='all';render();}
 else if(a==='project-filter'){state.projectTab=v;state.taskTab='all';state.page=1;render();}
 else if(a==='project')viewProject(v);
 else if(a==='project-tasks')viewProject(v,'tasks');
 else if(a==='project-outcomes')viewProject(v,'outcomes');
 else if(a==='project-spaces')viewProject(v,'spaces');
 else if(a==='detail-tab')viewProject(state.detailProject,v);
 else if(a==='outcome')viewOutcome(v);
 else if(a==='space')viewSpace(v);
 else if(a==='download'){const cut=v.lastIndexOf('|');M.downloadMaterial(v.slice(0,cut),Number(v.slice(cut+1)));}
 else if(a==='page'){state.page+=Number(v);renderProjects();}
 else if(a==='unlinked')viewUnlinked();
 else if(a==='close')$('wb-drawer').close();
 else if(a==='export')exportCSV();
 else if(a==='refresh'){filters();render();M.toast('工作台已刷新');}
});
$('pm-year').onchange=ev=>{state.year=ev.target.value;state.page=1;filters();render();};
$('pm-guide').onchange=ev=>{state.guide=ev.target.value;state.page=1;render();};
$('pm-search').oninput=ev=>{state.query=ev.target.value;state.page=1;render();};
$('pm-page-size').onchange=ev=>{state.pageSize=Number(ev.target.value);state.page=1;renderProjects();};
$('wb-drawer').addEventListener('click',ev=>{if(ev.target===$('wb-drawer')){const r=$('wb-drawer').getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right)$('wb-drawer').close();}});
window.addEventListener('storage',()=>{if(state.source==='current'){filters();render();}});
window.addEventListener('pageshow',()=>{if(state.source==='current'){filters();render();}});
window.ProjectManagerBoard={state,loadData,scoped,tasksFor,projectRows,enrich,spaceState,render,filters,viewProject,viewOutcome,viewSpace,viewUnlinked,exportCSV,demoProjects,demoOutcomes,demoSpaces};
filters();render();
})();
