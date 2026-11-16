/* Shared field mapping for the standalone prototype. No network requests. */
window.ResourceFields=(()=>{
 'use strict';
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const list=value=>Array.isArray(value)?value.filter(x=>x!==null&&x!==''):String(value??'').split(/[、,，;；]+/).map(x=>x.trim()).filter(Boolean);
 const clone=v=>JSON.parse(JSON.stringify(v));
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=html=>{const d=document.createElement('div');d.innerHTML=html||'';return d.textContent.trim();};
 const safe=html=>{const t=document.createElement('template');t.innerHTML=html||'';t.content.querySelectorAll('script,style,iframe,object,embed,link,form,input,button,svg,math').forEach(n=>n.remove());t.content.querySelectorAll('*').forEach(n=>[...n.attributes].forEach(a=>{if(/^on/i.test(a.name)||(/^(src|href)$/i.test(a.name)&&! /^(https?:|data:image\/(png|jpeg|webp|gif);base64,|#)/i.test(a.value)))n.removeAttribute(a.name);}));return t.innerHTML;};
 const field=(r,label)=>{const v=r.metaFields?.[label];if(v?.selectedValues)return v.selectedValues;if(v?.tags){const d=document.createElement('div');d.innerHTML=v.tags;d.querySelectorAll('i,button,.x').forEach(n=>n.remove());const tags=[...d.querySelectorAll('.pick,.chip,.px-chip')].map(n=>n.textContent.trim());if(tags.length)return tags;}return v?.values?.[0]??'';};
 const fileFormats=files=>[...new Set((files||[]).map(f=>{const ext=String(typeof f==='string'?f:f.name).split('.').pop().toLowerCase();return ({csv:'CSV',xls:'Excel',xlsx:'Excel',parquet:'Parquet',json:'JSON / JSONL',jsonl:'JSON / JSONL',tif:'GeoTIFF',tiff:'GeoTIFF',geojson:'GeoJSON',shp:'Shapefile',shx:'Shapefile',dbf:'Shapefile',jpg:'JPEG / PNG',jpeg:'JPEG / PNG',png:'JPEG / PNG',nc:'NetCDF',h5:'HDF5'})[ext]||ext.toUpperCase();}))];
 function dataset(value={},files=[]){const v=clone(value);v.containsGeographicData=v.containsGeographicData===true||v.containsGeographicData==='true';v.crop=list(v.crop);v.researchDirections=list(v.researchDirections);v.coverageCodes=list(v.coverageCodes);v.coverageAll=v.coverageAll===true||v.coverageAll==='true';v.format=fileFormats(files).join('、');v.annotation=v.annotation||'未说明';v.tags=[...fileFormats(files),v.annotation];delete v.version;delete v.scale;delete v.dataSource;delete v.modality;delete v.dataType;return v;}
 function modelFromOutcome(r,base={}){
  const v=r.metadata||{},meta={...base.metaFields};
  for(const [key,label]of [['business','业务分类'],['task','技术任务'],['crop','适用作物']])meta[label]={values:[list(v[key]).join('、')],selectedValues:list(v[key])};
  for(const [key,label]of [['source','成果来源'],['owner','权属归属'],['license','授权范围']])meta[label]={values:[key==='license'?(v.scope||v.license||''):v[key]||'']};
  const resources={gpuType:({'NVIDIA A100 40GB':'a100','NVIDIA V100 32GB':'v100','NVIDIA RTX 4090 24GB':'rtx4090','NVIDIA T4 16GB':'t4','CPU 推理（无 GPU）':'none'})[v.gpuType]||v.gpuType,gpuCount:Number(v.gpuCount)||0,gpuMemory:Number(v.gpuMemory)||0,cpu:Number(v.cpu)||undefined,memory:Number(v.memory)||undefined,disk:Number(v.storage)||undefined,environment:v.runtime||'',precision:v.precision||''};
  return {...base,imageCategory:v.imageCategory||null,requiresGPU:typeof v.requiresGPU==='boolean'?v.requiresGPU:null,externalProvision:clone(v.externalProvision||{}),updateNote:v.updateNote||base.updateNote||'',name:v.name||r.name,alias:v.abbr||'',owner:v.provider||'',modelType:v.modelType||'',summary:v.summary||'',business:list(v.business),task:list(v.task),crop:list(v.crop),cover:v.cover||'',intro:v.intro||'',introOverview:v.introOverview??text(v.intro),introAbility:v.introAbility||'',interfaceDoc:clone(v.interfaceDoc||r.interfaceDoc||{usage:'',content:'JSON',inputs:[],outputs:[]}),recommendedResources:resources,metaFields:meta,sourceVersionKey:read('bdh-outcome-review-1010',[]).find(x=>x.id===v.sourceVersionKey)?.acceptedAssetId||v.sourceVersionKey||null,sourceModelId:v.sourceModelId||null,sourceModelName:v.sourceModelName||null,sourceModelVersion:v.sourceModelVersion||null,sourceProjectId:v.sourceProjectId||'',sourceDemandId:v.sourceDemandId||'',sourceDemandName:v.sourceDemandName||'',submittedAt:r.time,submittedBy:r.applicant,submittedFiles:clone(r.files||[]),submittedMetadata:clone(v),debugValidation:clone(r.debugValidation||null),debugRecords:clone(r.debugRecords||[]),run:clone(r.run||null),deployment:clone(r.deployment||null),imageArtifact:clone(r.imageArtifact||r.artifact||null),readme:clone(v.readme||null),src:'res'};
 }
 function catalogModel(r,service={}){
  return {...r,alias:r.alias||field(r,'模型简称'),owner:r.owner||field(r,'提供方'),modelType:r.modelType||field(r,'模型类型'),summary:r.summary||field(r,'模型简介'),business:list(r.business?.length?r.business:field(r,'业务分类')),task:list(r.task?.length?r.task:field(r,'技术任务')),crop:list(r.crop?.length?r.crop:field(r,'适用作物')),trialEnabled:service.active?.config?.dTrial==='是'||service.active?.trial===true,published:r.up==='on'};
 }
 function portalModels(seeds){
  const rows=read('bdh-model-catalog-v1',[]);if(!rows.length)return seeds;
  const names=new Set(rows.map(r=>r.name)),out=seeds.filter(m=>!names.has(m.name));
  const groups=new Map();rows.filter(r=>!r.deleted).forEach(r=>{const key=r.modelId||r.no||r.key;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);});
  for(const versions of groups.values()){
   const r=versions.find(r=>r.up==='on');if(!r)continue;
   const base=seeds.find(m=>m.name===r.name)||{},doc=r.interfaceDoc||{usage:'',content:'JSON',inputs:[],outputs:[]};
   const inputs=(doc.inputs||[]).map(p=>p.description||p.name).filter(Boolean),outputs=(doc.outputs||[]).map(p=>p.description||p.name).filter(Boolean);
   out.push({...base,id:base.id||r.modelId||r.no,key:r.key,name:r.name,ver:r.ver,modelType:r.modelType,mtype:r.modelType,crop:list(r.crop),capabilities:list(r.business),scenes:list(r.business),type:list(r.task)[0]||'',technicalTasks:list(r.task),task:r.introAbility||'',owner:r.owner||'',author:r.owner||'',abbr:r.alias||'',summary:r.summary||'',abstract:r.introOverview||r.summary||'',overview:r.introOverview||'',business:r.introAbility||'',interfaceDoc:doc,input:inputs.join('；')||'—',output:outputs.join('；')||'—',ins:inputs,outs:outputs,upd:r.metaUpdatedAt?.slice(0,10)||r.d||'',calls:base.calls||0,ic:r.cover?'<img src="'+esc(r.cover)+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px">':base.ic||'◇',use:'平台内在线运行',open:!!r.externalProvision?.access&&r.externalProvision.access!=='否',trialEnabled:r.trialEnabled===true,published:true,trial:base.trial||{params:[],base:{},sample:'',kind:'value'},outcome:r.src!=='new',source:r.metaFields?.['成果来源']?.values?.[0]||'',rightsOwner:r.metaFields?.['权属归属']?.values?.[0]||'',_managed:true,_versions:versions.map(x=>({v:x.ver,d:x.d||'',cur:x.key===r.key,n:x.updateNote||'',row:x}))});
  }
  return out;
 }
 function registry(seeds){const rows=read('bdh-model-catalog-v1',[]);if(!rows.length)return seeds;const names=new Set(rows.map(r=>r.name)),out=seeds.filter(x=>!names.has(x.name)),groups=new Map();rows.filter(r=>!r.deleted).forEach(r=>{const id=r.modelId||r.no||r.key;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(r);});for(const [id,vs]of groups){const r=vs.find(x=>x.up==='on')||vs[0];out.push({id,name:r.name,version:r.ver,published:r.up==='on',trialEnabled:r.trialEnabled===true});}return out;}
 function portalDatasets(seeds){
  const rows=read('bdh-published-datasets-v1',read('agri-datasets-merged-20261110',[]));if(!rows.length)return seeds;
  const names=new Set(rows.map(r=>r.name)),out=seeds.filter(d=>!names.has(d.name));
  rows.filter(r=>!r.deleted&&r.pub==='on').forEach(r=>{const m=dataset(r.metadata||r,r.files||[]);out.push({...m,id:r.id,name:m.name||r.name,title:m.name||r.name,desc:m.summary||'',form:'',crop:list(m.crop),researchDirections:list(m.researchDirections),format:list(m.format),annotation:m.annotation,region:m.region||'',year:m.year||'',owner:m.provider||'',rightsOwner:m.owner||'',src:r.src==='res'?'res':'zone',zone:({'作物长势':'growth','土壤墒情':'soil','产量估测':'yield'})[m.topic]||'',upd:r.updatedAt?.slice(0,10)||r.submittedAt?.slice(0,10)||'',apply:r.apply||0,dataKind:r.src==='res'?'成果数据':'原始数据',_managed:true,published:true});});return out;
 }
 function previewKind(files=[],state={}){if(files.length)return files.some(f=>/\.(csv|tsv|xlsx?|parquet|sql|json)$/i.test(f.name||f))?'structured':'display';return state.previewType||'display';}
 async function readFile(f){
  if(f?.file)return f.file;if(!f?.blobId)return null;
  for(const name of ['agri-dataset-preview-materials','bdh-outcome-materials-1010','agri-outcome-files-v1']){
   const value=await new Promise(resolve=>{const req=indexedDB.open(name,1);req.onupgradeneeded=()=>req.transaction.abort();req.onerror=()=>resolve(null);req.onsuccess=()=>{const db=req.result;if(!db.objectStoreNames.contains('files')){db.close();resolve(null);return;}const tx=db.transaction('files'),r=tx.objectStore('files').get(f.blobId);r.onsuccess=()=>resolve(r.result?.file||r.result?.blob||null);r.onerror=()=>resolve(null);tx.oncomplete=()=>db.close();};});if(value)return value;
  }return null;
 }
 return {read,list,clone,esc,safe,field,dataset,modelFromOutcome,catalogModel,portalModels,portalDatasets,registry,readFile,previewKind};
})();
