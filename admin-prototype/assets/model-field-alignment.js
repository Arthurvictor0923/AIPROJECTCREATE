/* Align authoring with the portal's existing classification and description. */
(()=>{
 const F=ResourceFields;
 // Recover full metadata for previously accepted records without overwriting edits.
 const reviews=F.read('bdh-outcome-review-1010',[]);
 for(const r of ROWS){const outcome=reviews.find(x=>x.id===r.outcomeId&&x.status==='已通过');if(!outcome||r.submittedMetadata)continue;const full=F.modelFromOutcome(outcome,r);for(const [k,v]of Object.entries(full))if(r[k]===undefined||r[k]===null||r[k]===''||Array.isArray(r[k])&&!r[k].length)r[k]=v;}
 const form=$('newModelForm');
 const oldOpen=openModal;openModal=()=>{oldOpen();if(!uplRead()&&!MV.uploadKind){form.dataset.cover='';}};
 const validate=uplValidate;uplValidate=()=>{if(!validate())return false;if(!MV.uploadKind&&!$('newModelType').value)return toast('请选择模型类型'),false;return true;};
 const snapshot=uplSnapshot;uplSnapshot=()=>({...snapshot(),cover:form.dataset.cover||''});
 const restore=uplRestore;uplRestore=t=>{restore(t);form.dataset.cover=t.form.cover||'';};
 const options={'业务分类':['产量预测','长势监测','病虫害识别','补贴核查','土壤养分','作物与地块识别','变化监测'],'技术任务':['图像分类','目标检测','语义分割','回归估测','时序预测'],'适用作物':['水稻','玉米','大豆','小麦','林草湿地']};
 for(const wrap of form.querySelectorAll('.fld')){const label=wrap.querySelector('label')?.textContent.replace(/\*/g,'').trim(),control=wrap.querySelector('.msel');if(!control||!options[label])continue;control.onclick=()=>{const v=F.field({metaFields:{[label]:{tags:control.innerHTML}}},label);PX.modal(label,'<div class="px-checks">'+options[label].map(x=>'<label><input type="checkbox" name="tags" value="'+F.esc(x)+'" '+(v.includes(x)?'checked':'')+'>'+F.esc(x)+'</label>').join('')+'</div>',fd=>{control.innerHTML=fd.getAll('tags').map(x=>'<span class="pick">'+F.esc(x)+'</span>').join('')||'<span>请选择，可多选</span>';});};}
 const cover=form.querySelector('.cover-up');if(cover){const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg';input.hidden=true;input.id='newCoverFile';cover.after(input);cover.onclick=()=>input.click();input.onchange=()=>{const file=input.files[0];if(!file)return;if(file.size>5*1024*1024||!['image/png','image/jpeg'].includes(file.type)){toast('请选择不超过 5 MB 的 JPG 或 PNG 图片');return;}const reader=new FileReader();reader.onload=()=>{form.dataset.cover=reader.result;cover.innerHTML='<img src="'+reader.result+'" alt="模型封面" style="max-width:100%;height:100px;object-fit:cover"><span>更换封面</span>';};reader.readAsDataURL(file);};}
 const publishReason=MV.publishReason;MV.publishReason=key=>{const reason=publishReason(key);if(reason)return reason;const r=ROWS.find(x=>x.key===key);if(r.up==='on')return '';if(!r.modelType)return '请先编辑模型资料，选择模型类型';if(!r.summary&&!F.field(r,'模型简介'))return '请先编辑模型资料，填写模型简介';return '';};
 persist();renderTable();
})();
