/* Shared local prototype records. Seed once; never replace a user's saved list. */
(()=>{'use strict';
const M=window.Meeting,S=window.BackendSeeds;
const seed=(key,rows)=>{if(M.read(key,null)===null)M.write(key,rows);};
seed(M.projectsKey,M.read('agri-proto-v2:后台-课题管理.html:rows',MeetingSeeds.projects));
seed('agri-datasets',MeetingSeeds.datasets);
seed('bdh-model-catalog-v1',S.models);
seed('agri-proto-v2:后台-课题指南管理.html:rows',S.guides);
for(const k of ['需求','案例','公告'])seed('agri-records:'+k,S[k].map((r,i)=>({...r,_id:String(i)})));
seed('agri-approvals',window.ApprovalSeeds);
seed('agri-cooperation',[{name:'智慧农业技术服务公司',who:'王经理',type:'企业入驻',time:'2026-09-23 16:20',status:'待联系',note:''},{name:'东北农业科研团队',who:'李老师',type:'科研合作',time:'2026-09-22 10:10',status:'联系中',note:'已确认合作方向，等待线下材料核验。'}]);
seed(M.key,S.outcomes.map(r=>({...r,materialType:r.files.some(f=>/\.tar$/.test(f.name))?'image':'files',metadata:{name:r.name,version:r.version,projectCode:r.projectCode},assetId:r.id==='EX-CG-001'?'row-1':r.id==='EX-CG-002'?'DS20260923018':'',sample:true})));
seed('agri-space-applications-v8',S.spaces.filter(s=>s.kind==='request'));
const map=Object.fromEntries(S.spaces.filter(s=>s.no).map(s=>[s.no,s.projectCode]));
ProjectSpaceSeeds.forEach(s=>s.projectCode=map[s.no]||s.projectCode||'');
M.projects=()=>M.read(M.projectsKey,MeetingSeeds.projects);
const projects=M.projects(),today=M.date().slice(0,10);
let changed=false;projects.forEach(p=>{if(p.st==='拟立项'&&p.to&&p.to<today){p.st='在研';changed=true;}});
if(changed)M.write(M.projectsKey,projects);
window.BackendState={
 spaces:()=>{
  const a=ProjectSpaceSeeds.map(s=>({...s,...M.read('agri-space:'+s.no,{})}));
  M.read('agri-space-applications-v8',[]).filter(s=>s.state==='可用').forEach(s=>{
   if(a.some(x=>x.no===(s.spaceNo||s.id)))return;
   const no=s.spaceNo||String(s.id);
   a.push({no,name:s.name,who:s.who||s.applicant||'',team:s.team,projectCode:s.projectCode||'',st:({'运行中':'run','异常':'err','重启中':'boot'})[s.instance]||'stop',cpu:+s.cpu||0,gpu:+s.gpu||0,mem:+s.ram||0,sto:+s.usedStorage||0,quota:+s.storage||0,requestId:s.id,...M.read('agri-space:'+no,{})});
  });
  return a.filter(s=>s.st!=='deleted');
 },
 saveSpace:r=>{
  if(!M.write('agri-space:'+r.no,r))return false;
  if(r.requestId){const a=M.read('agri-space-applications-v8',[]),s=a.find(x=>String(x.id)===String(r.requestId));if(s){Object.assign(s,{cpu:r.cpu,gpu:r.gpu,ram:r.mem,storage:r.quota,instance:({run:'运行中',stop:'已停止',err:'异常',deleted:'已释放'})[r.st]||'已停止'});M.write('agri-space-applications-v8',a);}}
  return true;
 }
};
})();
