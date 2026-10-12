(()=>{'use strict';
const M=window.Meeting,root=document.getElementById('approval-root');if(!M||!root)return;
const view=root.dataset.view,resourcePage='后台-资源申请审批.html',outcomePage='后台-审批中心.html',params=new URLSearchParams(location.search);
if(view==='outcomes'&&(params.has('spaceRequest')||['#mt-space-requests','#resources'].includes(location.hash))){location.replace(resourcePage+location.search);return;}
if(view==='resources'&&params.has('outcome')){location.replace(outcomePage+location.search+'#outcomes');return;}
const A=window.ApprovalCenter={view,state:{tab:'wait',type:'',query:'',status:'',page:1,pageSize:6}},Q=id=>document.getElementById(id);
const legacyKey='agri-approvals',spaceKey='agri-space-applications-v8',E=M.e,call=(fn,...args)=>`ApprovalCenter.${fn}(${args.map(x=>JSON.stringify(x)).join(',')})`;
const badge=s=>'<span class="tag '+({'待审批':'wait','通过':'ok','驳回':'back','拒绝':'no'}[s]||'gray')+'">'+E(s)+'</span>';
const text=v=>v===undefined||v===null||v===''?'—':String(v);
const status=s=>({'申请中':'待审批','可用':'通过','已通过':'通过','已驳回':'驳回','已拒绝':'拒绝'}[s]||s);
const legacy=()=>M.read(legacyKey,null)||JSON.parse(JSON.stringify(window.ApprovalSeeds)),spaces=()=>M.read(spaceKey,[]);
A.rows=()=>{
 if(view==='outcomes')return M.records().map(r=>({key:String(r.id),id:r.id,name:r.name,type:r.kind==='model'?'成果模型':'成果数据',who:r.applicant,org:r.spaceName,time:r.time,status:status(r.status),raw:r}));
 const s=legacy(),spaceRows=spaces(),spaceIds=new Set(spaceRows.map(r=>String(r.id))),dedup=new Map();
 ['WAIT','WAIT2','DONE'].forEach(k=>(s[k]||[]).forEach(r=>{if(!spaceIds.has(String(r.no)))dedup.set(String(r.no),{key:'legacy:'+r.no,id:r.no,source:'legacy',name:r.res,type:r.type,who:r.who,org:r.org,time:r.at,status:status(r.st),raw:r});}));
 spaceRows.forEach(r=>dedup.set('space:'+r.id,{key:'space:'+r.id,id:r.id,source:'space',name:r.name,type:'创建科研开发空间',who:r.who||r.applicant,org:r.team,time:r.time||r.at,status:status(r.state),raw:r}));
 return [...dedup.values()];
};
A.filtered=()=>A.rows().filter(r=>(!A.state.type||r.type===A.state.type)&&(!A.state.query||[r.id,r.name,r.who,r.org].some(x=>String(x??'').toLowerCase().includes(A.state.query.toLowerCase()))));
A.list=()=>A.filtered().filter(r=>(A.state.tab==='wait'?r.status==='待审批':r.status!=='待审批')&&(A.state.tab==='wait'||!A.state.status||r.status===A.state.status)).sort((a,b)=>String(b.time||'').localeCompare(String(a.time||'')));
A.render=()=>{
 const filtered=A.filtered(),rows=A.list(),pages=Math.max(1,Math.ceil(rows.length/A.state.pageSize));A.state.page=Math.max(1,Math.min(A.state.page,pages));
 ['wait','done'].forEach(tab=>{const n=Q('approval-'+tab);n.classList.toggle('active',A.state.tab===tab);n.setAttribute('aria-selected',String(A.state.tab===tab));Q('approval-'+tab+'-count').textContent=filtered.filter(r=>tab==='wait'?r.status==='待审批':r.status!=='待审批').length;});
 Q('approval-result-filter').hidden=A.state.tab==='wait';
 Q('approval-rows').innerHTML=rows.slice((A.state.page-1)*A.state.pageSize,A.state.page*A.state.pageSize).map(r=>{
  const actions=M.link('查看',call('viewRecord',r.key))+(r.status==='待审批'?M.link(view==='outcomes'?'审批验收':'审批',call('review',r.key)):'');
  const first=view==='outcomes'?'<td class="resource-cell"><strong>'+E(r.name)+'</strong><small>'+E(r.id)+'</small></td><td>'+E(r.type)+'<small>'+E(r.raw.metadata?.version||'—')+'</small></td>':'<td class="nowrap t-code">'+E(r.id)+'</td><td class="nowrap">'+E(r.type)+'</td><td class="resource-cell">'+E(text(r.name))+'</td>';
  return '<tr>'+first+'<td>'+E(text(r.who))+'<small>'+E(r.org||'')+'</small></td><td class="nowrap">'+E(text(r.time))+'</td><td>'+badge(r.status)+'</td><td><div class="mt-actions">'+actions+'</div></td></tr>';
 }).join('')||'<tr><td class="approval-empty" colspan="'+(view==='outcomes'?6:7)+'">'+(A.state.query||A.state.type||(A.state.tab==='done'&&A.state.status)?'暂无符合筛选条件的记录':A.state.tab==='wait'?(view==='outcomes'?'暂无待验收的成果':'暂无待审批的资源申请'):'暂无已办审批记录')+'</td></tr>';
 Q('approval-total').textContent='共 '+rows.length+' 条';Q('approval-page-info').textContent=A.state.page+' / '+pages;
 Q('approval-prev').disabled=A.state.page<=1;Q('approval-next').disabled=A.state.page>=pages;
};
const grid=fields=>'<div class="mt-grid approval-detail">'+fields.map(([label,value])=>'<div><small class="mt-note">'+E(label)+'</small><p>'+E(text(value))+'</p></div>').join('')+'</div>';
A.detail=r=>{
 const d=r.raw;
 if(r.source==='legacy')return grid([['申请编号',r.id],['申请类型',r.type],['申请人',d.who],['所属机构',d.org],['申请资源',d.res],['用途说明',d.use],['提交时间',d.at],['审批状态',r.status]])+'<h3 class="mt-section">审批记录</h3>'+((d.rounds||[]).map(x=>'<div class="mt-timeline"><strong>'+E(x.r)+'</strong> · '+E(x.by)+' · '+E(x.t)+'<p>'+E(x.note)+'</p></div>').join('')||'<p class="mt-note">暂无审批记录</p>');
 return grid([['申请编号',r.id],['审批状态',r.status],['空间名称',d.name],['所属团队',d.team],['研究用途',d.desc],['关联模型',d.model||'未关联模型'],['开发镜像',d.image],['运行环境',d.compute?.runtime],['系统环境',d.compute?.detail],['开发工具',d.ide],['CPU / 内存',text(d.cpu)+' 核 / '+text(d.ram)+' GB'],['GPU',text(d.gpu)+' 张 · 单卡显存 '+text(d.gpuMemory)+' GB'],['研究存储 / 系统盘',text(d.storage)+' GB / '+text(d.systemDisk)+' GB'],['审批意见',d.reviewNote||'尚未审批']]);
};
A.viewRecord=key=>{const r=A.rows().find(x=>x.key===key);if(!r){M.toast('未找到该审批记录');return;}if(view==='outcomes'){M.viewOutcome(r.id);return;}
 M.dialog('资源申请详情',A.detail(r),M.btn('关闭','Meeting.close()')+(r.status==='待审批'?M.btn('审批',call('review',key),true):''));
};
A.review=key=>{const r=A.rows().find(x=>x.key===key);if(!r||r.status!=='待审批'){M.toast('该申请已处理，请查看最新审批记录');A.render();return;}if(view==='outcomes'){M.review(r.id);return;}
 M.dialog('资源申请审批',A.detail(r)+'<form id="approval-review-form">'+M.field('resource-decision','审批结果','','select',['通过','驳回','拒绝'])+M.field('resource-opinion','审批意见','','textarea')+'<p id="approval-review-error" class="mt-error" role="alert"></p></form>',M.btn('取消','Meeting.close()')+'<button class="mt-btn primary" type="submit" form="approval-review-form">确认审批</button>');
 if(r.source==='legacy')Q('mt-resource-opinion').maxLength=500;
 Q('approval-review-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),decision=f.get('resource-decision'),opinion=String(f.get('resource-opinion')||'').trim();if(!['通过','驳回','拒绝'].includes(decision)||!opinion){Q('approval-review-error').textContent='请选择审批结果并填写审批意见';return;}A.commit(key,decision,opinion);};
};
A.commit=(key,decision,opinion)=>{
 if(!['通过','驳回','拒绝'].includes(decision)||!String(opinion||'').trim())return false;
 opinion=String(opinion).trim();const current=A.rows().find(x=>x.key===key);if(!current||current.status!=='待审批'){M.toast('该申请已处理，请查看最新审批记录');M.close();A.render();return false;}
 let saved=false;
 if(current.source==='legacy'){
  const s=legacy(),r=['WAIT','WAIT2'].flatMap(k=>s[k]||[]).find(x=>String(x.no)===String(current.id));if(!r)return false;
  r.st=decision;r.rounds=r.rounds||[];r.rounds.push({r:decision,by:'张明',t:M.date(),note:opinion});s.WAIT=(s.WAIT||[]).filter(x=>String(x.no)!==String(r.no));s.WAIT2=(s.WAIT2||[]).filter(x=>String(x.no)!==String(r.no));s.DONE=[r,...(s.DONE||[]).filter(x=>String(x.no)!==String(r.no))];saved=M.write(legacyKey,s);
  if(saved){const log=M.read('agri-audit',[]);log.unshift({时间:new Date().toLocaleString('zh-CN'),操作人:'张明',操作:decision,对象:r.no,结果:'成功'});M.write('agri-audit',log);}
 }else if(current.source==='space'){
  const rows=spaces(),r=rows.find(x=>String(x.id)===String(current.id));if(!r)return false;
  r.state=decision==='通过'?'可用':decision==='驳回'?'已驳回':'已拒绝';r.reviewNote=opinion;r.instance=decision==='通过'?'已停止':'未开通';r.progress='审批'+decision+'：'+opinion;saved=M.write(spaceKey,rows);
 }
 if(saved){M.close();A.render();M.toast('审批结果已保存');}return saved;
};
Q('approval-filters').onsubmit=e=>{e.preventDefault();A.state.type=Q('approval-type').value;A.state.query=Q('approval-query').value.trim();A.state.status=Q('approval-status').value;A.state.page=1;A.render();};
Q('approval-reset').onclick=()=>{['approval-type','approval-query','approval-status'].forEach(id=>Q(id).value='');Object.assign(A.state,{type:'',query:'',status:'',page:1});A.render();};
['approval-type','approval-status'].forEach(id=>Q(id).onchange=()=>Q('approval-filters').requestSubmit());
['wait','done'].forEach(tab=>Q('approval-'+tab).onclick=()=>{A.state.tab=tab;A.state.page=1;A.render();});
Q('approval-page-size').onchange=e=>{A.state.pageSize=Number(e.target.value);A.state.page=1;A.render();};
Q('approval-prev').onclick=()=>{A.state.page--;A.render();};Q('approval-next').onclick=()=>{A.state.page++;A.render();};
document.addEventListener('click',e=>{const box=document.querySelector('.u-box'),menu=Q('userMenu');if(menu&&box&&!box.contains(e.target)){menu.classList.remove('open');document.querySelector('.u-name')?.setAttribute('aria-expanded','false');}});
M.refreshReview=A.render;M.refreshSpaces=A.render;
M.viewSpace=id=>A.viewRecord('space:'+id);M.reviewSpace=id=>A.review('space:'+id);
window.addEventListener('storage',e=>{if([legacyKey,spaceKey,M.key,null].includes(e.key))A.render();});A.render();
if(view==='outcomes'&&params.has('outcome')){const id=params.get('outcome'),r=A.rows().find(x=>x.key===id);if(r)(r.status==='待审批'?A.review:A.viewRecord)(id);else M.toast('未找到该成果记录，请在审批列表中查询');}
if(view==='resources'&&params.has('spaceRequest'))A.viewRecord('space:'+params.get('spaceRequest'));
})();
