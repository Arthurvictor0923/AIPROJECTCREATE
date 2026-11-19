/* 智慧农业平台 · 全项目字段与交互说明 · 2026-11-18
   按页面及当前业务视图提供说明。 */
(function(){
  'use strict';
  var BRAND = '#005653';
  var DOCS = {};

  /* ========================== 渲染层（通用） ============================ */
  var CSS = [
    '.mtdev-group{position:fixed;right:24px;bottom:24px;z-index:960;display:flex;gap:8px;width:max-content;cursor:grab;user-select:none;transition:opacity .2s}',
    'body:has(dialog[open]) .mtdev-group,.mtdev-group.mtdev-dim{opacity:0;pointer-events:none}',
    '.mtdev-btn{display:flex;align-items:center;gap:6px;height:38px;padding:0 16px;border-radius:19px;font-size:14px;font-weight:500;white-space:nowrap;border:1px solid transparent;font-family:inherit;cursor:pointer;transition:all .2s}',
    '.mtdev-btn.guide{background:' + BRAND + ';color:#fff;box-shadow:0 4px 12px rgba(0,86,83,.28)}',
    '.mtdev-btn.guide:hover{background:#0a6b66;transform:translateY(-1px)}',
    '.mtdev-btn.field{background:#edf6f2;color:' + BRAND + ';border-color:#c6ddd4;box-shadow:0 4px 12px rgba(0,86,83,.12)}',
    '.mtdev-btn.field:hover{background:#dceee6;transform:translateY(-1px)}',
    '.mtdev-mask{display:none;position:fixed;inset:0;background:rgba(10,30,28,.45);z-index:12000;align-items:center;justify-content:center}',
    '.mtdev-mask.on{display:flex}',
    '.mtdev-drawer{background:#fff;border-radius:8px;width:780px;max-width:92vw;max-height:84vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(6,40,38,.28)}',
    '.mtdev-hd{display:flex;align-items:center;gap:10px;padding:16px 22px;border-bottom:1px solid #dce5e9;background:#f4f8f5;flex-shrink:0}',
    '.mtdev-hd b{font-size:16px;color:#10213a;flex:1;font-weight:600}',
    '.mtdev-hd .p{font-size:12px;color:#526078;white-space:nowrap}',
    '.mtdev-x{font-size:16px;color:#526078;background:none;border:0;cursor:pointer;padding:2px 8px;border-radius:4px;line-height:1.4}',
    '.mtdev-x:hover{color:#10213a;background:#e6efeb}',
    '.mtdev-bd{padding:20px 22px;overflow-y:auto;flex:1;color:#10213a;font-size:13.5px;line-height:1.7}',
    '.mtdev-tabs{display:flex;flex-wrap:wrap;gap:2px;border-bottom:1px solid #dce5e9;margin:-4px 0 16px}',
    '.mtdev-tab{background:none;border:0;font-family:inherit;padding:8px 14px;font-size:13.5px;color:#526078;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}',
    '.mtdev-tab:hover{color:' + BRAND + '}',
    '.mtdev-tab.on{color:' + BRAND + ';border-bottom-color:' + BRAND + ';font-weight:600}',
    '.mtdev-sec{margin-bottom:22px}', '.mtdev-sec:last-child{margin-bottom:2px}',
    '.mtdev-sec h4{margin:0 0 10px;font-size:14px;color:#10213a;font-weight:600}',
    '.mtdev-intro{background:#f4f8f5;border-left:3px solid ' + BRAND + ';padding:12px 14px;border-radius:0 6px 6px 0;margin-bottom:18px;color:#31445c}',
    '.mtdev-tw{overflow-x:auto;border:1px solid #dce5e9;border-radius:6px}',
    '.mtdev-tw table{width:100%;border-collapse:collapse;font-size:12.5px;table-layout:auto}',
    '.mtdev-tw-fx table{table-layout:fixed}',
    '.mtdev-tw-fx .mtdev-tag{white-space:normal}',
    '.mtdev-tw th,.mtdev-tw td{padding:8px 11px;text-align:left;border-bottom:1px solid #eef3f1;vertical-align:top;white-space:normal;word-break:break-word;overflow-wrap:anywhere}',
    '.mtdev-tw th{background:#f4f8f5;color:#526078;font-weight:600;white-space:nowrap;position:sticky;top:0}',
    '.mtdev-tw tr:last-child td{border-bottom:0}',
    '.mtdev-tw td:first-child{font-weight:600;color:#10213a}',
    '.mtdev-tw td code,.mtdev-code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;background:#f4f8f5;border:1px solid #e4ecea;border-radius:3px;padding:0 4px;font-size:12px;color:#0a4b48;word-break:break-all;overflow-wrap:anywhere}',
    '.mtdev-note{margin-top:8px;font-size:12px;color:#526078;line-height:1.65}',
    '.mtdev-tag{display:inline-block;padding:1px 6px;border-radius:3px;font-size:11px;font-weight:600;white-space:nowrap}',
    '.mtdev-tag.do{background:#e6f4ec;color:#1a7f5a}',
    '.mtdev-tag.no{background:#fdecea;color:#c0392b}',
    '.mtdev-tag.req{background:#fdecea;color:#c0392b}',
    '.mtdev-tag.mid{background:#eaf0fb;color:#3b6fb6}',
    '.mtdev-tag.info{background:#edf6f2;color:' + BRAND + '}',
    '.mtdev-tag.opt{background:#f0f2f5;color:#526078}',
    '.mtdev-tag.warn{background:#fdf4e3;color:#b7791f}',
    '.mtdev-flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:2px 0 14px}',
    '.mtdev-flow i{font-style:normal;background:#edf6f2;color:' + BRAND + ';border:1px solid #c6ddd4;border-radius:14px;padding:3px 10px;font-size:12px}',
    '.mtdev-flow s{text-decoration:none;color:#7d8c9c;font-size:12px}'
  ].join('');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* 单元格状态标记：以 {{tag}} 开头时渲染为彩色标签
     tag ∈ do 可用·免申请（绿） / mid 需申请（蓝） / opt 不显示·不适用（灰） / warn 注意（黄） / no 禁用（红） / info 品牌色 */
  function cellHTML(c) {
    var s = (c == null ? '' : String(c));
    var m = /^\{\{(\w+)\}\}([\s\S]*)$/.exec(s);
    if (m) return '<span class="mtdev-tag ' + m[1] + '">' + m[2] + '</span>';
    return s;
  }

  function tableHTML(sec) {
    var h = '<div class="mtdev-tw' + (sec.w ? ' mtdev-tw-fx' : '') + '"><table>';
    if (sec.w) {
      h += '<colgroup>';
      sec.w.forEach(function (w) { h += '<col style="width:' + w + '">'; });
      h += '</colgroup>';
    }
    h += '<thead><tr>';
    sec.head.forEach(function (c) { h += '<th>' + c + '</th>'; });
    h += '</tr></thead><tbody>';
    sec.rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (c) { h += '<td>' + cellHTML(c) + '</td>'; });
      h += '</tr>';
    });
    return h + '</tbody></table></div>' + (sec.note ? '<p class="mtdev-note">' + sec.note + '</p>' : '');
  }

  function tabBody(tab) {
    var h = '';
    (tab.sections || []).forEach(function (s) {
      h += '<div class="mtdev-sec"><h4>' + s.title + '</h4>' + tableHTML(s) + '</div>';
    });
    return h;
  }

  function drawerHTML(overlayId, bodyId, titleId) {
    return '<div class="mtdev-mask" id="' + overlayId + '">' +
      '<div class="mtdev-drawer" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '">' +
      '<div class="mtdev-hd"><b id="' + titleId + '"></b><span class="p">2026-11-18 更新</span>' +
      '<button class="mtdev-x" type="button" aria-label="关闭说明" title="关闭（Esc）">✕</button></div>' +
      '<div class="mtdev-bd" id="' + bodyId + '"></div></div></div>';
  }

  function renderDrawer(mask, doc, title, tabs, prefix, foot) {
    mask.querySelector('.mtdev-hd b').textContent = title + ' — ' + doc.name;
    var body = mask.querySelector('.mtdev-bd');
    var html = '<div class="mtdev-intro">' + doc.intro + '</div><div class="mtdev-tabs" role="tablist" aria-label="' + title + '">';
    tabs.forEach(function (tab, i) {
      html += '<button type="button" class="mtdev-tab" id="' + prefix + 'Tab' + i + '" role="tab" aria-controls="' + prefix + i + '">' + esc(tab.label) + '</button>';
    });
    html += '</div>';
    tabs.forEach(function (tab, i) {
      html += '<div class="mtdev-tabpane" id="' + prefix + i + '" role="tabpanel" aria-labelledby="' + prefix + 'Tab' + i + '">' + tabBody(tab) + '</div>';
    });
    body.innerHTML = html + (foot || '');
    bindTabs(body);
  }

  function selectTab(body, index) {
    body.querySelectorAll('.mtdev-tab').forEach(function (tab, i) {
      tab.classList.toggle('on', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    body.querySelectorAll('.mtdev-tabpane').forEach(function (pane, i) {
      pane.style.display = i === index ? '' : 'none';
    });
  }

  function bindTabs(body) {
    var tabs = Array.from(body.querySelectorAll('.mtdev-tab'));
    tabs.forEach(function (tab, index) {
      tab.onclick = function () { selectTab(body, index); };
      tab.onkeydown = function (event) {
        var next = index;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(body, next);
        tabs[next].focus();
      };
    });
    selectTab(body, 0);
    body.scrollTop = 0;
  }


  /* 悬浮按钮组与抽屉头部可拖拽（拖完抑制一次点击，避免误触） */
  function draggable(el, handle, onMove) {
    handle = handle || el;
    var st = null;
    handle.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || (e.target.closest && e.target.closest('.mtdev-x'))) return;
      var r = el.getBoundingClientRect();
      st = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, w: r.width, h: r.height, moved: false };
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!st) return;
      var dx = e.clientX - st.sx, dy = e.clientY - st.sy;
      if (!st.moved && Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
      if (!st.moved) return;
      if (el.style.position !== 'fixed') {
        el.style.position = 'fixed'; el.style.margin = '0';
        el.style.left = st.ox + 'px'; el.style.top = st.oy + 'px';
        el.style.right = 'auto'; el.style.bottom = 'auto';
      }
      var mx = Math.max(0, window.innerWidth - st.w), my = Math.max(0, window.innerHeight - st.h);
      el.style.left = Math.min(mx, Math.max(0, st.ox + dx)) + 'px';
      el.style.top = Math.min(my, Math.max(0, st.oy + dy)) + 'px';
      if (onMove) onMove();
    });
    document.addEventListener('mouseup', function () {
      if (!st) return;
      if (st.moved) {
        var sup = function (ev) { ev.preventDefault(); ev.stopPropagation(); document.removeEventListener('click', sup, true); };
        document.addEventListener('click', sup, true);
      }
      st = null;
    });
  }


  DOCS = {
  "__default__": {
    "name": "页面说明",
    "intro": "请选择当前页面的字段说明或交互演示指引。",
    "field": [
      {
        "label": "说明范围",
        "sections": [
          {
            "title": "说明范围",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "当前页面",
                "按本页已有内容",
                "字段与操作以当前页面及所属模块说明为准。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "说明入口",
        "sections": [
          {
            "title": "说明入口",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "打开说明",
                "右下角字段说明 / 交互演示指引",
                "切换页签查看，点击关闭、遮罩或按 Esc 关闭。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-模型管理.html": {
    "name": "模型管理",
    "intro": "模型元数据创建、版本管理、介绍编辑、构建部署和上架在同一页面串联。创建与上架前编辑的字段按阶段分别说明。",
    "field": [
      {
        "label": "新建模型元数据",
        "sections": [
          {
            "title": "新建模型元数据",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "模型编号",
                "系统自动生成，只读",
                "新建元数据时生成；成果接入保留其对应关系。"
              ],
              [
                "模型名称、版本号",
                "文本，必填",
                "版本号手工填写；新建版本归属同一模型合集。"
              ],
              [
                "模型简称",
                "文本，选填",
                "便于识别模型。"
              ],
              [
                "模型类型",
                "必选",
                "基础与农业增强模型 / 农业专业模型 / 农业机理模型；对应门户模型类型筛选。"
              ],
              [
                "提供方、模型封面",
                "文本 / 封面文件",
                "创建时按表单星号填写，供后续列表与详情展示。"
              ],
              [
                "业务分类、技术任务、适用作物",
                "多选标签",
                "对应模型中心业务能力、技术任务、作物筛选。"
              ],
              [
                "来源模型",
                "可搜索选择，选填",
                "关联模型衍生关系；不套用其他模型的元数据模板。"
              ],
              [
                "镜像分类",
                "必选",
                "sensing 感知类 / decision 决策类 / simulation 仿真类 / llm 大模型类。"
              ],
              [
                "是否需要 GPU",
                "布尔选择，必选",
                "描述镜像是否依赖 GPU；按选择联动当前推荐算力字段。"
              ],
              [
                "构建材料",
                "镜像压缩包 / Dockerfile 构建包",
                "按材料类型限制文件；上传完成后自动进入构建。"
              ],
              [
                "推荐算力及运行环境",
                "CPU、内存、存储、GPU 及运行环境等",
                "在原有推荐算力区域维护；不增加新的“运行硬件”字段。"
              ],
              [
                "推理精度",
                "下拉，选填",
                "未指定时不强制补填。"
              ],
              [
                "成果来源、权属归属、授权范围",
                "文本 / 多行文本",
                "授权范围最多 500 字；权属与提供方分别维护。"
              ],
              [
                "新增版本的更新说明",
                "多行文本，最多 1000 字",
                "新增版本时填写，后续由版本行的更新说明入口查看。"
              ]
            ],
            "note": "新建元数据卡片不包含模型简介、模型概述、业务能力介绍或使用说明编辑。先创建元数据并上传构建，再进入编辑页完善上架前的介绍内容。"
          }
        ]
      },
      {
        "label": "编辑模型介绍",
        "sections": [
          {
            "title": "编辑模型介绍",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "模型简介",
                "编辑页“模型介绍”中的文本",
                "创建后完善，用于前台列表摘要；不移入新建元数据卡片。"
              ],
              [
                "模型概述、业务能力",
                "现有介绍编辑区域",
                "创建后在编辑页维护；保存后同步模型详情介绍。"
              ],
              [
                "使用说明",
                "二级弹窗中的结构化内容",
                "入口位于模型介绍标题区域；与介绍正文关联保存。"
              ],
              [
                "请求内容类型",
                "JSON / form-data",
                "与入参规范一起描述模型调用内容。"
              ],
              [
                "入参",
                "参数名称、类型、必填、参数说明",
                "支持增删行；入参类型可包含 file。"
              ],
              [
                "出参",
                "参数名称、类型、参数说明",
                "支持增删行。"
              ],
              [
                "输入示例、输出示例",
                "示例文本 + 文件 / 图片 + 附件说明",
                "规范与示例分别维护；文件内容随记录保存。"
              ],
              [
                "对外提供",
                "现有编辑页的服务说明内容",
                "与模型详情的对外提供信息对应。"
              ],
              [
                "成果来源与权属",
                "编辑已有元数据",
                "成果接入时保留提交者填写的介绍、使用说明及调试记录，后台继续核对。"
              ]
            ]
          }
        ]
      },
      {
        "label": "构建与部署",
        "sections": [
          {
            "title": "构建与部署",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "构建材料、Dockerfile",
                "文件 / 文本查看",
                "上传即构建；最近一次构建可查看过程和结果，支持再次构建。"
              ],
              [
                "当前镜像",
                "本版本最近一次成功构建结果",
                "列表的镜像名对应当前版本可用镜像。再次构建失败时继续保留原可用镜像。"
              ],
              [
                "服务名称",
                "必填，3–50 位小写字母、数字或连字符",
                "配置保存后用于本版本部署。"
              ],
              [
                "部署镜像、镜像地址",
                "当前成功构建镜像，只读",
                "完成构建后才可配置和部署。"
              ],
              [
                "启动目录、启动命令",
                "文本，选填",
                "留空使用镜像默认工作目录和启动命令。"
              ],
              [
                "服务端口",
                "必填，可用半角或全角逗号分隔",
                "端口范围 1–65535，保存配置后才可以发起部署。"
              ],
              [
                "暴露端口",
                "选填，多个端口用逗号分隔",
                "与服务端口分开记录。"
              ],
              [
                "是否开启试用",
                "是 / 否",
                "部署配置与前台试用入口联动，仍受当前服务与账号权限校验。"
              ],
              [
                "实例资源",
                "CPU、内存、临时存储、GPU 类型及数量、副本数",
                "按表单给定单位、数值范围填写。"
              ],
              [
                "高级配置",
                "健康检查、环境变量、请求超时等",
                "沿用配置表单的可选项；环境变量名称不可重复。"
              ],
              [
                "部署记录",
                "最近一次任务、过程、结果及已保存配置",
                "配置与部署分开；保存配置不会自行开始部署。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "记录来源",
                "下拉",
                "全部 / 成果提交 / 本地新建"
              ],
              [
                "上架状态",
                "下拉",
                "全部 / 已上架 / 未上架 / 已下架"
              ],
              [
                "每页条数",
                "下拉",
                "10条/页 / 20条/页 / 50条/页"
              ],
              [
                "模型类型",
                "下拉",
                "请选择模型类型 / 基础与农业增强模型 / 农业专业模型 / 农业机理模型"
              ],
              [
                "版本更新说明",
                "多行文本",
                "最多 1000 字"
              ],
              [
                "镜像分类",
                "下拉",
                "请选择镜像分类 / sensing — 感知类算子 / decision — 决策类算子 / simulation — 仿真类算子 / llm — 大模型类算子"
              ],
              [
                "推荐算力卡型",
                "下拉",
                "NVIDIA A100 40GB / NVIDIA V100 32GB / NVIDIA RTX 4090 24GB / NVIDIA T4 16GB / CPU 推理（无 GPU）"
              ],
              [
                "推理精度（选填）",
                "下拉",
                "未指定（可不填） / FP16 / FP32 / INT8"
              ],
              [
                "授权范围*",
                "多行文本",
                "最多 500 字"
              ],
              [
                "是否需要 GPU",
                "下拉",
                "请选择 / 否 / 是"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "新建与版本",
        "sections": [
          {
            "title": "新建与版本",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "新建模型",
                "新建模型 → 填写元数据和材料 → 上传",
                "上传完成后构建；简介和介绍在创建后的编辑页填写。"
              ],
              [
                "上传中断",
                "恢复上传记录并重新选择原文件",
                "恢复当前上传任务；不将介绍内容新增为上传必填项。"
              ],
              [
                "管理模型合集",
                "列表“管理” → 版本清单",
                "查看同模型各版本；新增版本需填写版本号和更新说明。"
              ],
              [
                "编辑介绍",
                "版本行“编辑”",
                "编辑基础资料及模型介绍、输入输出规范与示例；保存同一模型版本。"
              ],
              [
                "更新说明",
                "管理 → 版本列表 → 更新说明",
                "查看该版本保存的更新说明。"
              ]
            ]
          }
        ]
      },
      {
        "label": "构建与部署",
        "sections": [
          {
            "title": "构建与部署",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "构建",
                "查看构建记录 / 再次构建",
                "查看最近一次构建；成功替换当前镜像，失败保留旧镜像。"
              ],
              [
                "配置",
                "构建成功后点“配置”",
                "填写并保存部署配置；配置和部署是两个动作。"
              ],
              [
                "部署",
                "点“部署”确认执行",
                "按已保存配置部署，展示进度和结果；更新部署失败保留原部署。"
              ],
              [
                "部署记录",
                "版本操作 → 部署记录",
                "查看最近一次任务的运行过程和结果。"
              ]
            ]
          }
        ]
      },
      {
        "label": "上架和删除",
        "sections": [
          {
            "title": "上架和删除",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "上架",
                "完善资料、构建部署满足条件后点“上架”",
                "展示校验原因或确认上架；同一模型同时仅一个版本上架，允许多个版本部署。"
              ],
              [
                "已上架版本",
                "编辑 / 下架",
                "上架后仅编辑元数据信息；构建材料和部署修改需先下架。"
              ],
              [
                "主版本",
                "查看模型列表",
                "有上架版本时取上架版本；无上架版本时按当前最新版本展示。"
              ],
              [
                "删除版本",
                "更多 → 删除 → 确认",
                "按确认框说明删除当前版本；其他版本保留，最后一个版本删除后移除合集。"
              ],
              [
                "前后台联动",
                "返回门户模型列表与详情",
                "已上架版本同步类型、简介、介绍、规范与示例；下架后不在公开目录展示。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-数据集管理.html": {
    "name": "数据集管理",
    "intro": "列表、新建和详情编辑已整合。数据基本信息、介绍与预览共用同一数据记录。",
    "field": [
      {
        "label": "列表与接入来源",
        "sections": [
          {
            "title": "列表与接入来源",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "关键词、接入来源、地理信息、归属单位、上架状态",
                "筛选条件",
                "关键词匹配数据集名称 / ID；查询和重置作用于当前列表。"
              ],
              [
                "接入来源",
                "科研成果 / 时空数据管理 / 手动新建",
                "新建默认手动新建；编辑时保留或调整该来源。接入来源选项随当前来源切换，不另加“数据来源”字段。"
              ],
              [
                "上架状态",
                "已上架 / 未上架 / 已下架",
                "与详情操作同步；待完善提示反映当前资料内容。"
              ]
            ]
          }
        ]
      },
      {
        "label": "数据基本信息",
        "sections": [
          {
            "title": "数据基本信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "数据名称",
                "文本，必填",
                "作为列表标题及详情名称；后台数据集 ID 自动生成。"
              ],
              [
                "是否包含地理信息数据",
                "布尔：是 / 否；新建默认否",
                "只判断是否提供地理信息查询功能。门户当前入口名称为“影像查询”；不作为数据分类，也不决定预览方式。"
              ],
              [
                "研究方向",
                "多选，选填",
                "AI 数智基础、作物模型、资源环境、精准感控、智能装备、规模化应用；对应数据中心筛选。"
              ],
              [
                "作物",
                "多选，选填",
                "沿用作物选项，可保留已有记录的作物值。"
              ],
              [
                "覆盖年份",
                "年份，选填",
                "填写时校验四位年份；用于时间筛选。"
              ],
              [
                "覆盖区域",
                "区划选择器，可多选",
                "可跨地区选择；保存区域代码及展示名称；全国（不限）与具体区域选择互斥。"
              ],
              [
                "提供方 / 归属单位、权属归属",
                "文本",
                "分别描述提供单位和权属主体。"
              ],
              [
                "关联专题",
                "下拉选择",
                "用于数据中心专题归类。"
              ],
              [
                "数据格式",
                "按文件识别",
                "文件类型与标注情况构成发布展示的标签。"
              ],
              [
                "标注情况",
                "下拉：有标注 / 无标注 / 未说明",
                "与文件格式共同生成展示标签。标签仅包含这两类内容。"
              ],
              [
                "数据简介",
                "多行文本，最多 1000 字",
                "用于列表的一句简介；数据介绍在后续内容编辑区维护。"
              ],
              [
                "数据封面",
                "图片上传、预览、移除",
                "沿用当前表单支持的图片格式。"
              ],
              [
                "成果文件 / 数据文件",
                "文件列表",
                "保留文件名称及文件内容引用，用于管理、审批和样例选择。"
              ]
            ],
            "note": "当前数据基本信息中没有“数据形态”、数据版本号、数据规模或重复的“数据集元数据卡片”。"
          }
        ]
      },
      {
        "label": "数据介绍与预览",
        "sections": [
          {
            "title": "数据介绍与预览",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "数据概述、适用方向",
                "多行内容",
                "在“数据介绍”中编辑，保存后同步到详情展示。"
              ],
              [
                "关键参数",
                "可增删行：参数名称、参数值、单位",
                "单位选填；保留参数原有含义，不重复生成固定元数据卡片。"
              ],
              [
                "结构文件",
                "从已上传成果文件选择，选填",
                "用于展示字段结构；可与样例文件使用同一文件。"
              ],
              [
                "样例数据文件",
                "从已上传成果文件选择",
                "可解析的表格文件展示字段及样例行。"
              ],
              [
                "预览材料",
                "单独上传文件 / 图片",
                "不能直接表格展示的内容使用额外提交的预览材料。材料与真实成果文件分别保存。"
              ],
              [
                "预览方式、预览说明",
                "结构 / 样例行，或图片、文件、地图",
                "表格样例按可用文件解析，非结构化数据另传预览材料。可识别的经纬度空间样例可用地图方式。"
              ],
              [
                "前台展示",
                "介绍内容 + 保存的样例",
                "审批和后台编辑保留样例内容，前台读取同一数据记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "接入来源",
                "下拉",
                "全部 / 科研成果 / 时空数据管理 / 手动新建"
              ],
              [
                "上架状态",
                "下拉",
                "全部 / 已上架 / 未上架 / 已下架"
              ],
              [
                "每页条数",
                "下拉",
                "12条/页 / 24条/页 / 48条/页"
              ],
              [
                "是否包含地理信息数据",
                "下拉",
                "全部 / 是 / 否"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "数据集操作",
        "sections": [
          {
            "title": "数据集操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "新建",
                "新建数据集 → 填基本信息 → 上传文件 → 创建",
                "名称与数据文件必需；创建后进入编辑，继续完善介绍和预览。"
              ],
              [
                "查看 / 编辑",
                "列表行操作",
                "进入同页详情；编辑保存更新原记录，不产生额外版本。"
              ],
              [
                "区划选择",
                "覆盖区域 → 选择 / 搜索 → 应用区域",
                "支持跨地区多选；取消不提交本次选择。"
              ],
              [
                "介绍编辑",
                "数据介绍 → 内容及关键参数 → 保存",
                "关键参数支持增删；已存在基本信息不在额外元数据卡片重复维护。"
              ],
              [
                "样例预览",
                "数据预览 → 选择已有文件或上传预览材料",
                "保存样例内容；改变地理信息布尔值不改变预览方式。"
              ],
              [
                "上架",
                "点击上架",
                "按当前完整性校验提示完善后上架；已上架内容同步数据中心。"
              ],
              [
                "下架",
                "点击下架 → 确认",
                "更新为已下架，后台可继续查看并重新上架。"
              ],
              [
                "删除",
                "点击删除 → 输入数据集 ID 确认",
                "确认输入的 ID 与当前记录匹配后移除。"
              ],
              [
                "内容预览",
                "详情 → 内容预览",
                "在弹窗核对当前介绍、关键参数及样例展示。"
              ],
              [
                "原始文件",
                "详情 → 原始文件清单 → 下载",
                "有实际文件内容时下载；仅有示例文件记录时提示可用性。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-审批中心.html": {
    "name": "审批中心 · 成果验收审批",
    "intro": "受理前端正式提交的模型和数据成果，查看内容与提交端一致。",
    "field": [
      {
        "label": "审批记录",
        "sections": [
          {
            "title": "审批记录",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "待审批 / 已办审批",
                "列表 Tab",
                "办理后进入已办列表，保留申请与审批内容。"
              ],
              [
                "申请人、所属团队、提交时间",
                "提交人、科研空间、提交时间",
                "对应本次成果记录；个人中心来源按记录展示。"
              ],
              [
                "审批结果",
                "通过 / 驳回 / 拒绝",
                "在当前审批表单选择；保持与提交端状态展示对应。"
              ],
              [
                "审批意见",
                "必填多行文本",
                "选择审批结果后填写，保存于审批记录，提交人可查。"
              ],
              [
                "审批记录",
                "审批人、时间、结果、意见",
                "展示本次办理信息及已有记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "成果材料与提交",
        "sections": [
          {
            "title": "成果材料与提交",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "成果类型",
                "成果模型 / 成果数据",
                "审批按提交的成果类型展示不同材料。"
              ],
              [
                "关联课题、来源模型",
                "关联选择",
                "科研空间提交带出空间内模型；个人中心按可选模型关联。"
              ],
              [
                "成果模型基本信息",
                "名称、版本、类型、业务分类、任务、作物、提供方、权属等",
                "保持与后台接收字段一致；个人中心按单条成果记录管理。"
              ],
              [
                "成果模型介绍",
                "简介、概述、业务能力、输入输出规范与示例",
                "在成果材料中填写用于验收及后续展示，审批接入时保留。后台本地新建仍先建元数据、再编辑介绍。"
              ],
              [
                "模型文件",
                "镜像压缩包",
                "个人中心上传模型使用镜像包，上传后在记录行部署、调试、提交。"
              ],
              [
                "调试记录",
                "输入、输出、日志、通过结果及材料关联",
                "正式提交模型成果前须通过调试；审批中心可查看该记录并核对说明。"
              ],
              [
                "数据文件及说明",
                "数据基本信息、数据介绍、数据预览",
                "沿用同一套数据字段与布局；不要求数据版本号或数据规模。"
              ],
              [
                "提交时间、提交人、成果状态",
                "系统记录",
                "个人中心展示审批进展；空间成果区主要展示提交记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "数据基本信息",
        "sections": [
          {
            "title": "数据基本信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "数据名称",
                "文本，必填",
                "作为列表标题及详情名称；后台数据集 ID 自动生成。"
              ],
              [
                "是否包含地理信息数据",
                "布尔：是 / 否；新建默认否",
                "只判断是否提供地理信息查询功能。门户当前入口名称为“影像查询”；不作为数据分类，也不决定预览方式。"
              ],
              [
                "研究方向",
                "多选，选填",
                "AI 数智基础、作物模型、资源环境、精准感控、智能装备、规模化应用；对应数据中心筛选。"
              ],
              [
                "作物",
                "多选，选填",
                "沿用作物选项，可保留已有记录的作物值。"
              ],
              [
                "覆盖年份",
                "年份，选填",
                "填写时校验四位年份；用于时间筛选。"
              ],
              [
                "覆盖区域",
                "区划选择器，可多选",
                "可跨地区选择；保存区域代码及展示名称；全国（不限）与具体区域选择互斥。"
              ],
              [
                "提供方 / 归属单位、权属归属",
                "文本",
                "分别描述提供单位和权属主体。"
              ],
              [
                "关联专题",
                "下拉选择",
                "用于数据中心专题归类。"
              ],
              [
                "数据格式",
                "从已上传文件自动识别",
                "按文件格式汇总去重；不是手工增加的业务分类。"
              ],
              [
                "标注情况",
                "下拉：有标注 / 无标注 / 未说明",
                "与文件格式共同生成展示标签。标签仅包含这两类内容。"
              ],
              [
                "数据简介",
                "多行文本，最多 1000 字",
                "用于列表的一句简介；数据介绍在后续内容编辑区维护。"
              ],
              [
                "数据封面",
                "图片上传、预览、移除",
                "沿用当前表单支持的图片格式。"
              ],
              [
                "成果文件 / 数据文件",
                "文件列表",
                "保留文件名称及文件内容引用，用于管理、审批和样例选择。"
              ]
            ],
            "note": "当前数据基本信息中没有“数据形态”、数据版本号、数据规模或重复的“数据集元数据卡片”。"
          }
        ]
      },
      {
        "label": "数据介绍与预览",
        "sections": [
          {
            "title": "数据介绍与预览",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "数据概述、适用方向",
                "多行内容",
                "在“数据介绍”中编辑，保存后同步到详情展示。"
              ],
              [
                "关键参数",
                "可增删行：参数名称、参数值、单位",
                "单位选填；保留参数原有含义，不重复生成固定元数据卡片。"
              ],
              [
                "结构文件",
                "从已上传成果文件选择，选填",
                "用于展示字段结构；可与样例文件使用同一文件。"
              ],
              [
                "样例数据文件",
                "从已上传成果文件选择",
                "可解析的表格文件展示字段及样例行。"
              ],
              [
                "预览材料",
                "单独上传文件 / 图片",
                "不能直接表格展示的内容使用额外提交的预览材料。材料与真实成果文件分别保存。"
              ],
              [
                "预览方式、预览说明",
                "只读提交材料",
                "核对提交人选择的预览方式及说明，随成果同步给数据集管理。"
              ],
              [
                "前台展示",
                "介绍内容 + 保存的样例",
                "审批和后台编辑保留样例内容，前台读取同一数据记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "模型调试核验",
        "sections": [
          {
            "title": "模型调试核验",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "是否通过调试",
                "调试结果",
                "模型验收查看已提交材料对应的通过结果。"
              ],
              [
                "调试入参、出参、日志",
                "只读材料",
                "与模型介绍中的使用说明、输入输出规范进行核对。"
              ],
              [
                "模型类型、简介、规范与示例",
                "来源成果材料",
                "通过后连同权属和来源信息进入模型管理；不在审批时重填。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "成果类型",
                "下拉",
                "全部类型 / 成果模型 / 成果数据"
              ],
              [
                "审批结果",
                "下拉",
                "全部结果 / 通过 / 驳回 / 拒绝"
              ],
              [
                "每页条数",
                "下拉",
                "每页 6 条 / 每页 10 条 / 每页 20 条"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "成果验收交互",
        "sections": [
          {
            "title": "成果验收交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "类型、关键词、审批结果 → 查询 / 重置",
                "定位当前成果记录；审批结果主要用于已办记录。"
              ],
              [
                "查看",
                "成果记录 → 查看",
                "核对基本信息、原始材料、模型使用说明或数据预览及审批历史。"
              ],
              [
                "验收模型",
                "审批验收 → 调试记录",
                "查看入参、出参、日志及问题提示。对照模型使用说明核对后办理。"
              ],
              [
                "通过",
                "选择通过并提交",
                "保留原材料，接入模型 / 数据集管理，后续另行编辑与上架。"
              ],
              [
                "驳回 / 拒绝",
                "选择结果、填写意见并提交",
                "回写申请端结果；按当前状态提供后续操作。"
              ],
              [
                "已办审批",
                "已办审批 → 选择结果 / 查看",
                "按审批结果筛选，并查看审批意见和材料。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-资源申请审批.html": {
    "name": "审批中心 · 资源申请审批",
    "intro": "在审批中心办理数据、模型、算力、科研开发空间及需求发布申请。",
    "field": [
      {
        "label": "审批记录",
        "sections": [
          {
            "title": "审批记录",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "待审批 / 已办审批",
                "列表 Tab",
                "办理后进入已办列表，保留申请与审批内容。"
              ],
              [
                "申请人、所属团队、提交时间",
                "来源申请记录",
                "查看原提交对象的身份和范围。"
              ],
              [
                "审批结果",
                "通过 / 驳回 / 拒绝",
                "在当前审批表单选择；保持与提交端状态展示对应。"
              ],
              [
                "审批意见",
                "必填，最多 500 字",
                "通过、驳回和拒绝均需填写意见，记录审批人和办理时间。"
              ],
              [
                "审批记录",
                "审批人、时间、结果、意见",
                "展示本次办理信息及已有记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "申请分类与材料",
        "sections": [
          {
            "title": "申请分类与材料",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "数据使用申请",
                "申请编号、数据资源、申请人、机构 / 范围及用途说明",
                "查看申请记录。前台数据申请同时包含数据使用承诺。"
              ],
              [
                "模型使用申请",
                "申请模型、版本、用途及说明",
                "选择科研用途时申请端可补充科研相关资料。"
              ],
              [
                "算力申请",
                "空间、所需 CPU / 内存 / GPU / 存储等",
                "展示申请端提交的配置。"
              ],
              [
                "创建科研开发空间",
                "空间、团队、用途、关联模型及开发环境、资源与挂载数据",
                "审阅 CPU、内存、GPU、单卡显存与存储配置。"
              ],
              [
                "需求发布申请",
                "需求信息、需求说明、发布方与联系方式、审批记录",
                "保留涉及作物、已有资料、逐条工作、交付成果及时间等已填内容。"
              ],
              [
                "预计使用时长（空间申请）",
                "申请端可选安排信息",
                "只展示申请者填写的天数，不据此自动回收算力或结束研究。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "申请类型",
                "下拉",
                "全部类型 / 数据使用申请 / 模型使用申请 / 算力申请 / 创建科研开发空间 / 需求发布申请"
              ],
              [
                "审批结果",
                "下拉",
                "全部结果 / 通过 / 驳回 / 拒绝"
              ],
              [
                "每页条数",
                "下拉",
                "每页 6 条 / 每页 10 条 / 每页 20 条"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "资源审批交互",
        "sections": [
          {
            "title": "资源审批交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "类型、关键词、审批结果 → 查询 / 重置",
                "更新待审批或已办列表。"
              ],
              [
                "查看申请",
                "查看",
                "按类型展示对应字段及提交内容。"
              ],
              [
                "办理",
                "待审批 → 审批 → 选择结果、填写意见 → 提交",
                "刷新待审批与已办列表；已办记录可查看原始材料和意见。"
              ],
              [
                "空间通过",
                "通过创建科研空间申请",
                "申请端可进入对应空间，显示实例开通状态。"
              ],
              [
                "需求通过",
                "申请类型选择“需求发布申请” → 审批 → 通过",
                "需求中心可浏览通过的需求。个人中心“我的需求”查看审批意见。"
              ],
              [
                "查看已办",
                "已办审批 → 查看",
                "查看当次材料与办理结果。"
              ],
              [
                "需求未通过",
                "需求发布申请 → 选择驳回或拒绝",
                "已办保留具体审批结果与意见，门户“我的需求”显示“未通过”，可编辑后重新提交。"
              ],
              [
                "需求审批内容导航",
                "需求审批弹窗 → 填写审批意见",
                "从需求材料定位到审批表单。已办详情可查看审批记录。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-管理设置.html": {
    "name": "合作与组织",
    "intro": "合作咨询、机构、人员、团队与角色在本页分模块管理。角色权限按配置生效，账号归属与团队成员关系分别维护。",
    "field": [
      {
        "label": "合作咨询字段",
        "sections": [
          {
            "title": "合作咨询字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "合作方向",
                "科研合作 / 企业合作 / 其他合作",
                "示范基地属于科研或企业合作的支持内容，没有独立“示范基地合作”选项。"
              ],
              [
                "单位名称",
                "必填，最多 80 字",
                "填写单位全称。"
              ],
              [
                "联系人",
                "必填，最多 30 字",
                "本次咨询联系人。"
              ],
              [
                "联系电话",
                "必填，最多 30 字",
                "支持手机或固定电话。"
              ],
              [
                "电子邮箱",
                "选填，最多 100 字",
                "填写时按邮箱格式校验。"
              ],
              [
                "咨询内容",
                "必填，最多 2000 字",
                "描述合作意向、场景或问题。"
              ],
              [
                "同意联系",
                "必选确认",
                "同意平台就本次咨询使用所填联系方式。"
              ],
              [
                "处理状态",
                "待联系 / 联系中 / 已处理",
                "由后台处理记录维护。"
              ],
              [
                "处理记录",
                "必填，最多 2000 字",
                "记录联系与处理情况，仅供后台查看。"
              ]
            ]
          }
        ]
      },
      {
        "label": "机构与人员",
        "sections": [
          {
            "title": "机构与人员",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "机构名称、机构简介",
                "名称必填最多 100 字；简介选填最多 500 字",
                "新增或编辑机构基础资料。"
              ],
              [
                "中台角色清单",
                "动态下拉，可刷新",
                "使用接入的中台角色；加载失败保留上次清单并提示重新获取。"
              ],
              [
                "默认角色映射",
                "中台角色 + 默认权限角色",
                "机构自行增删映射行；同一中台角色不可重复配置；不要求每个机构都有所有角色。"
              ],
              [
                "人员角色、机构、归属情况、负责人",
                "关键词和筛选条件",
                "关键词匹配姓名或账号。普通成员筛选时可继续按负责人和归属情况细分。"
              ],
              [
                "姓名、职称、专业领域、研究方向",
                "基础资料",
                "姓名必填最多 50 字，其他现有资料项最多 100 字；企业人员按其实际字段显示。"
              ],
              [
                "机构默认 / 单独绑定",
                "开关式二选一",
                "选择机构默认时按映射继承；单独绑定时选择平台权限角色。"
              ],
              [
                "批量关联 / 解绑机构",
                "人员选择 + 目标机构 / 解绑确认",
                "显示所选人员和关系影响，按当前确认提示办理。"
              ],
              [
                "管理成员",
                "选择成员账号",
                "从科研负责人行统一维护关联成员，保存前查看关系影响。"
              ],
              [
                "机构类型",
                "机构基本信息",
                "新增、编辑机构时按表单选择；人员机构信息随当前关联显示。"
              ]
            ]
          }
        ]
      },
      {
        "label": "团队与角色",
        "sections": [
          {
            "title": "团队与角色",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "团队名称、简介、所属机构、负责人",
                "团队基础信息",
                "新建时确定归属；编辑按现有表单允许范围维护。"
              ],
              [
                "团队成员",
                "关联成员列表",
                "普通成员从负责人名下账号选择；同负责人可建立多个团队。"
              ],
              [
                "角色名称、角色说明",
                "名称必填最多 50 字；说明选填最多 150 字",
                "名称不可重复；角色可由多个机构和人员复用。"
              ],
              [
                "四个模块的权限",
                "数据中心、模型中心、科研开发空间、需求中心",
                "各选禁止授权、审批授权或直接授权；保存后影响绑定对象。"
              ],
              [
                "角色绑定情况",
                "机构数、单独绑定人数",
                "查看角色实际使用范围，删除时按当前引用限制处理。"
              ]
            ]
          }
        ]
      },
      {
        "label": "账号与功能权限",
        "sections": [
          {
            "title": "账号与功能权限",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "中台菜单权限",
                "控制可见菜单",
                "平台业务按钮另按功能权限及资源范围判断。"
              ],
              [
                "机构默认角色",
                "中台角色 → 平台权限角色映射",
                "中台角色从动态清单获取；每个机构按需添加映射，不固定为两个角色。"
              ],
              [
                "个人角色绑定方式",
                "机构默认 / 单独绑定",
                "单独绑定时选用指定权限角色；机构默认时依据人员所属机构及中台角色匹配。"
              ],
              [
                "数据、模型、科研空间、需求",
                "审批授权 / 直接授权 / 禁止授权",
                "分别对应申请审批、符合业务校验后直接操作、禁止该业务操作。"
              ],
              [
                "机构、负责人、团队、空间成员",
                "实际归属与参与范围",
                "功能权限不扩大可管理的团队、成员和资源范围。"
              ],
              [
                "具体资源授权",
                "模型或数据及用途的授权记录",
                "与角色功能配置一起判断，不按角色名称或页面跳转推断授权。"
              ],
              [
                "预览账号",
                "原型演示控件",
                "切换演示当前账号；正式账号及权限由服务端提供并校验。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "合作方向",
                "下拉",
                "全部方向 / 科研合作 / 企业合作 / 其他合作"
              ],
              [
                "每页条数",
                "下拉",
                "5 条/页 / 10 条/页 / 20 条/页"
              ],
              [
                "处理状态",
                "下拉",
                "待联系 / 联系中 / 已处理"
              ],
              [
                "处理记录",
                "多行文本",
                "最多 2000 字"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "合作咨询",
        "sections": [
          {
            "title": "合作咨询",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "合作咨询",
                "合作咨询 → 查询 / 查看 / 处理",
                "与前台咨询记录同步，保存状态和处理记录。"
              ]
            ]
          }
        ]
      },
      {
        "label": "机构管理",
        "sections": [
          {
            "title": "机构管理",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "机构",
                "机构管理 → 新增 / 编辑 / 查看",
                "维护基础资料及默认角色映射。"
              ],
              [
                "映射编辑",
                "刷新角色清单 → 添加映射 → 选择双方角色",
                "只保存本机构需要的映射；删除行后不再继承该项默认角色。"
              ],
              [
                "批量配置机构角色",
                "勾选机构 → 批量绑定角色",
                "为所选机构配置中台角色与平台权限角色映射。"
              ]
            ]
          }
        ]
      },
      {
        "label": "人员管理",
        "sections": [
          {
            "title": "人员管理",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "人员资料",
                "人员管理 → 查看 / 编辑",
                "维护姓名等基础资料和绑定方式；不新增账号创建或重置密码入口。"
              ],
              [
                "批量关联",
                "勾选人员或打开批量选择 → 关联 / 解绑机构",
                "支持检索、筛选、已选清单及影响确认。"
              ],
              [
                "管理成员",
                "科研负责人行 → 管理成员",
                "在同一面板增减名下成员；按实际关系提示确认后保存。"
              ],
              [
                "角色绑定",
                "切换机构默认 / 单独绑定 → 保存",
                "展示生效来源及权限；不按负责人 / 成员名称自动推定免审批。"
              ],
              [
                "普通成员归属",
                "人员管理 → 调整归属 / 解绑负责人",
                "按成员现有归属显示操作，确认后保存到该成员。"
              ]
            ]
          }
        ]
      },
      {
        "label": "团队管理",
        "sections": [
          {
            "title": "团队管理",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "团队",
                "团队管理 → 新增 / 编辑 / 删除、添加 / 移除成员",
                "保留账号，维护团队关系；删除按现有确认和关联限制执行。"
              ]
            ]
          }
        ]
      },
      {
        "label": "角色管理",
        "sections": [
          {
            "title": "角色管理",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "角色",
                "角色管理 → 新增 / 编辑 / 复制 / 删除",
                "为四个模块逐项配置权限；复制形成新角色，编辑影响当前绑定对象。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-需求管理.html": {
    "name": "需求管理 · 列表",
    "intro": "查询和维护当前后台需求记录，通过行操作进入详情或编辑。",
    "field": [
      {
        "label": "列表字段",
        "sections": [
          {
            "title": "列表字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "需求名称、需求编号、发布单位",
                "名称与归属",
                "名称下显示系统编号，点击名称进入详情。"
              ],
              [
                "需求方向、所需服务",
                "筛选单选 / 记录可多选",
                "所需服务列优先展示前两项，完整内容可在详情核对。"
              ],
              [
                "状态",
                "未发布 / 待审核 / 未通过 / 发布中 / 已结束",
                "待审核在审批中心办理，已结束记录仍可在后台查询。"
              ],
              [
                "关键词、更新时间",
                "文本 / 日期范围",
                "支持按名称、编号、单位等搜索。结束日期应等于或晚于开始日期。"
              ],
              [
                "每页条数",
                "5 / 10 / 20，默认 10",
                "支持翻页及输入目标页码。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "列表操作",
        "sections": [
          {
            "title": "列表操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "查询 / 重置",
                "调整关键词、方向、服务、状态或日期 → 查询",
                "刷新结果并回到第一页，重置后恢复默认筛选。"
              ],
              [
                "查看、编辑、新增",
                "名称 / 查看 / 编辑 / 新增需求",
                "在当前模块打开对应视图。"
              ],
              [
                "发布",
                "未发布记录 → 发布",
                "校验完整发布材料。缺项时打开编辑并定位对应字段。"
              ],
              [
                "结束",
                "发布中记录 → 结束 → 确认",
                "更新为已结束。"
              ],
              [
                "删除",
                "删除 → 确认",
                "在当前后台记录中移除该条需求。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-需求管理-新增.html": {
    "name": "需求管理 · 新增需求",
    "intro": "后台运营录入当前需求，可先保存草稿或填写完整后发布。",
    "field": [
      {
        "label": "需求表单",
        "sections": [
          {
            "title": "需求表单",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "需求名称、需求编号",
                "名称必填；编号系统生成",
                "编辑时编号用于识别原记录。"
              ],
              [
                "需求方向、所需服务",
                "可多选，发布时分别至少选一项",
                "列表筛选每次选择一个方向或服务。"
              ],
              [
                "发布单位、需求简述",
                "发布时必填；简述最多 500 字",
                "简述显示在后台详情摘要。"
              ],
              [
                "希望解决的问题、已有资料、需要完成的工作、预期交付成果",
                "4 个富文本区，各最多 1000 字",
                "后台发布时四项均需填文字。门户提交的“已有资料”为选填。"
              ],
              [
                "期望交付时间",
                "选填文本",
                "记录预期时间或双方协商说明。"
              ],
              [
                "联系人、联系电话、联系邮箱",
                "发布时必填联系人，电话或邮箱至少一项",
                "填邮箱时校验邮箱格式。"
              ],
              [
                "状态",
                "未发布 / 待审核 / 未通过 / 发布中 / 已结束",
                "新增时由保存方式确定，编辑视图只读显示。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "编辑内容",
        "sections": [
          {
            "title": "编辑内容",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "选择方向与服务",
                "打开下拉，勾选选项",
                "所选项显示为标签，可逐项移除。"
              ],
              [
                "编辑具体说明",
                "分项富文本工具栏",
                "可编辑文字、列表、链接、图片和表格。链接为 http 或 https，图片支持 PNG、JPG、GIF 或 WebP。"
              ],
              [
                "检查校验",
                "保存或发起发布时",
                "缺项或超长时提示并聚焦相应字段。"
              ]
            ]
          }
        ]
      },
      {
        "label": "保存与发布",
        "sections": [
          {
            "title": "保存与发布",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "保存草稿",
                "填写名称 → 保存草稿",
                "符合长度和格式校验后返回列表，状态为未发布。"
              ],
              [
                "保存并发布",
                "补足发布必填项 → 保存并发布",
                "校验成功后形成发布中记录。"
              ],
              [
                "取消",
                "取消或返回列表",
                "回到需求列表。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-需求管理-编辑.html": {
    "name": "需求管理 · 编辑需求",
    "intro": "维护指定需求的原有资料。",
    "field": [
      {
        "label": "需求表单",
        "sections": [
          {
            "title": "需求表单",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "需求名称、需求编号",
                "名称必填；编号系统生成",
                "编辑时编号用于识别原记录。"
              ],
              [
                "需求方向、所需服务",
                "可多选，发布时分别至少选一项",
                "列表筛选每次选择一个方向或服务。"
              ],
              [
                "发布单位、需求简述",
                "发布时必填；简述最多 500 字",
                "简述显示在后台详情摘要。"
              ],
              [
                "希望解决的问题、已有资料、需要完成的工作、预期交付成果",
                "4 个富文本区，各最多 1000 字",
                "后台发布时四项均需填文字。门户提交的“已有资料”为选填。"
              ],
              [
                "期望交付时间",
                "选填文本",
                "记录预期时间或双方协商说明。"
              ],
              [
                "联系人、联系电话、联系邮箱",
                "发布时必填联系人，电话或邮箱至少一项",
                "填邮箱时校验邮箱格式。"
              ],
              [
                "状态",
                "未发布 / 待审核 / 未通过 / 发布中 / 已结束",
                "新增时由保存方式确定，编辑视图只读显示。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "编辑内容",
        "sections": [
          {
            "title": "编辑内容",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "选择方向与服务",
                "打开下拉，勾选选项",
                "所选项显示为标签，可逐项移除。"
              ],
              [
                "编辑具体说明",
                "分项富文本工具栏",
                "可编辑文字、列表、链接、图片和表格。链接为 http 或 https，图片支持 PNG、JPG、GIF 或 WebP。"
              ],
              [
                "检查校验",
                "保存或发起发布时",
                "缺项或超长时提示并聚焦相应字段。"
              ]
            ]
          }
        ]
      },
      {
        "label": "保存更新",
        "sections": [
          {
            "title": "保存更新",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "编辑回填",
                "从列表或详情点击“编辑”",
                "显示原需求资料、编号及状态。"
              ],
              [
                "保存更新",
                "修改 → 保存更新",
                "更新同一条记录；从详情进入时返回该详情。"
              ],
              [
                "待发布资料补齐",
                "未发布 → 行操作“发布”提示缺项",
                "按提示补齐并保存，再从列表发布。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-需求管理-详情.html": {
    "name": "需求管理 · 需求详情",
    "intro": "查看当前需求说明、发布信息与联系方式。",
    "field": [
      {
        "label": "详情字段",
        "sections": [
          {
            "title": "详情字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "标题、编号、状态、方向、所需服务",
                "只读信息",
                "按当前记录展示，其中状态与列表一致。"
              ],
              [
                "简述、四项需求说明、期望交付时间",
                "摘要、图文和文本",
                "查看原保存内容，空值显示占位。"
              ],
              [
                "发布单位、联系人、电话、邮箱、更新时间",
                "只读元数据",
                "用于核对发布方和记录更新时间。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "详情操作",
        "sections": [
          {
            "title": "详情操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "返回列表",
                "返回列表",
                "恢复列表视图和筛选。"
              ],
              [
                "编辑",
                "编辑",
                "打开该需求的编辑视图，保存后返回当前详情。"
              ],
              [
                "发布或结束",
                "未发布时发布；发布中时结束",
                "其余状态可查看详情；待审核由审批中心办理。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-案例管理.html": {
    "name": "案例管理 · 列表",
    "intro": "按名称、关联模型和展示状态定位案例。",
    "field": [
      {
        "label": "列表字段",
        "sections": [
          {
            "title": "列表字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "封面、案例名称、关联模型",
                "案例资料",
                "显示封面、名称及模型，点击案例名称可查看。"
              ],
              [
                "展示顺序、展示状态、更新时间",
                "顺序值 / 展示或隐藏 / 日期",
                "按顺序排列，展示状态可在列表中修改。"
              ],
              [
                "查询",
                "关键词、关联模型、展示状态",
                "筛选当前案例列表。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "案例列表操作",
        "sections": [
          {
            "title": "案例列表操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "查询和分页",
                "填写筛选项 → 查询 / 重置",
                "筛选或恢复默认列表，按当前结果翻页。"
              ],
              [
                "新增、查看和编辑",
                "新增案例或行操作",
                "进入当前模块里的对应视图。"
              ],
              [
                "展示或隐藏",
                "行操作的状态按钮",
                "切换该案例的展示状态。"
              ],
              [
                "删除",
                "删除 → 确认",
                "删除该条案例。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-案例管理-新增.html": {
    "name": "案例管理 · 新增案例",
    "intro": "新增一个关联模型的案例。",
    "field": [
      {
        "label": "案例资料",
        "sections": [
          {
            "title": "案例资料",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "案例名称",
                "必填文本",
                "作为列表及详情标题。"
              ],
              [
                "关联模型",
                "必选，可按名称或编号检索",
                "选择联想结果，保存关联模型及编号。"
              ],
              [
                "封面",
                "新增必填；JPG / PNG，最多 5 MB",
                "支持选图预览。编辑时可保留当前图片，或更换封面。"
              ],
              [
                "显示顺序",
                "数值 ≥ 0，新建默认 10",
                "列表按顺序值升序排列。"
              ],
              [
                "图文说明",
                "必填富文本",
                "可按业务问题、处理过程、应用效果填写。"
              ],
              [
                "展示状态",
                "展示 / 隐藏，新建默认隐藏",
                "列表可切换展示状态，编辑时可调整该记录的状态。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "新增操作",
        "sections": [
          {
            "title": "新增操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "填写案例",
                "填写名称，从联想列表选模型，上传封面并填写图文说明",
                "校验选择的模型、图片尺寸限制和图文是否已填写。"
              ],
              [
                "保存",
                "保存",
                "保存成功后返回列表，可查看新增案例。"
              ],
              [
                "取消",
                "取消 / 返回列表",
                "返回案例列表。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-案例管理-编辑.html": {
    "name": "案例管理 · 编辑案例",
    "intro": "编辑当前案例的展示信息、关联模型和图文。",
    "field": [
      {
        "label": "案例资料",
        "sections": [
          {
            "title": "案例资料",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "案例名称",
                "必填文本",
                "作为列表及详情标题。"
              ],
              [
                "关联模型",
                "必选，可按名称或编号检索",
                "选择联想结果，保存关联模型及编号。"
              ],
              [
                "封面",
                "新增必填；JPG / PNG，最多 5 MB",
                "支持选图预览。编辑时可保留当前图片，或更换封面。"
              ],
              [
                "显示顺序",
                "数值 ≥ 0，新建默认 10",
                "列表按顺序值升序排列。"
              ],
              [
                "图文说明",
                "必填富文本",
                "可按业务问题、处理过程、应用效果填写。"
              ],
              [
                "展示状态",
                "展示 / 隐藏，新建默认隐藏",
                "列表可切换展示状态，编辑时可调整该记录的状态。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "编辑操作",
        "sections": [
          {
            "title": "编辑操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "编辑资料",
                "更换封面、选择模型、修改图文或展示状态",
                "回填原记录，按需更新。"
              ],
              [
                "保存更新",
                "保存更新",
                "保存到当前案例并返回列表。"
              ],
              [
                "取消",
                "取消 / 返回列表",
                "返回案例列表。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-案例管理-详情.html": {
    "name": "案例管理 · 案例详情",
    "intro": "查看当前案例的基本资料、关联模型和图文说明。",
    "field": [
      {
        "label": "案例详情字段",
        "sections": [
          {
            "title": "案例详情字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "案例名称、封面、关联模型",
                "只读内容",
                "与列表同一记录。"
              ],
              [
                "图文说明、展示状态及顺序",
                "只读内容",
                "显示已保存的案例配置和正文。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "详情操作",
        "sections": [
          {
            "title": "详情操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "编辑",
                "编辑",
                "打开当前案例编辑视图。"
              ],
              [
                "返回",
                "返回列表",
                "回到案例管理列表。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-门户管理-通知公告.html": {
    "name": "门户管理 · 通知公告",
    "intro": "首页自动展示最近 3 条已发布公告。",
    "field": [
      {
        "label": "列表字段",
        "sections": [
          {
            "title": "列表字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "公告标题",
                "系统列表项",
                "点击标题查看内容。"
              ],
              [
                "状态",
                "已发布 / 未发布 / 已下架",
                "查询条件和公告行状态一致。"
              ],
              [
                "发布时间、更新时间",
                "时间",
                "用于核对发布或最近一次更新。"
              ],
              [
                "关键词",
                "标题搜索",
                "可与状态组合查询。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "公告列表操作",
        "sections": [
          {
            "title": "公告列表操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "输入标题、选择状态 → 查询",
                "显示对应公告记录。"
              ],
              [
                "查看 / 新建 / 编辑",
                "标题或行操作、新建公告",
                "在当前门户管理模块打开对应视图。"
              ],
              [
                "发布 / 下架",
                "公告行的相应操作",
                "发布后进入首页候选；下架后从已发布范围移出。"
              ],
              [
                "查看首页",
                "查看首页",
                "查看门户首页内容配置。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-通知公告-新增.html": {
    "name": "门户管理 · 新建公告",
    "intro": "填写公告资料并选择保存方式。",
    "field": [
      {
        "label": "公告资料",
        "sections": [
          {
            "title": "公告资料",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "公告标题",
                "必填文本，最多 100 字",
                "用于公告列表和门户首页。"
              ],
              [
                "公告摘要",
                "选填，最多 300 字",
                "用于门户公告摘要。"
              ],
              [
                "公告正文",
                "必填富文本",
                "编辑公告内容，支持图文。"
              ],
              [
                "附件",
                "选传，多文件，单个最多 50 MB",
                "PDF、Word 或图片。详情显示已附文件，可下载实际文件。"
              ],
              [
                "状态、发布时间、更新时间",
                "未发布 / 已发布 / 已下架",
                "保存只更新资料，发布后记录发布时间。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "新建公告",
        "sections": [
          {
            "title": "新建公告",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "编辑资料",
                "填写标题与正文，可上传附件",
                "已选附件在本页可移除。"
              ],
              [
                "保存",
                "保存",
                "保存为未发布，返回通知公告列表。"
              ],
              [
                "保存并发布",
                "保存并发布",
                "校验通过后更新为已发布，按发布时间参与门户首页展示。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-通知公告-编辑.html": {
    "name": "门户管理 · 编辑公告",
    "intro": "维护指定公告的内容和附件。",
    "field": [
      {
        "label": "公告资料",
        "sections": [
          {
            "title": "公告资料",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "公告标题",
                "必填文本，最多 100 字",
                "用于公告列表和门户首页。"
              ],
              [
                "公告摘要",
                "选填，最多 300 字",
                "用于门户公告摘要。"
              ],
              [
                "公告正文",
                "必填富文本",
                "编辑公告内容，支持图文。"
              ],
              [
                "附件",
                "选传，多文件，单个最多 50 MB",
                "PDF、Word 或图片。详情显示已附文件，可下载实际文件。"
              ],
              [
                "状态、发布时间、更新时间",
                "未发布 / 已发布 / 已下架",
                "保存只更新资料，发布后记录发布时间。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "编辑公告",
        "sections": [
          {
            "title": "编辑公告",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "编辑资料",
                "编辑公告及附件",
                "回填已保存内容。上传或移除附件后保存。"
              ],
              [
                "保存",
                "保存",
                "更新资料并返回列表。"
              ],
              [
                "保存并发布",
                "保存并发布",
                "保存并以已发布状态展示。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-通知公告-详情.html": {
    "name": "门户管理 · 公告详情",
    "intro": "查看公告内容、状态和附件。",
    "field": [
      {
        "label": "详情字段",
        "sections": [
          {
            "title": "详情字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "标题、摘要、正文",
                "只读公告内容",
                "展示该公告所保存内容。"
              ],
              [
                "状态、发布时间、更新时间",
                "只读元数据",
                "核对发布状态及时间。"
              ],
              [
                "附件",
                "文件名称及下载入口",
                "实际提供的文件可下载。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "详情操作",
        "sections": [
          {
            "title": "详情操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "下载",
                "点击附件“下载”",
                "获取已关联附件。"
              ],
              [
                "编辑 / 返回",
                "编辑或返回列表",
                "编辑当前公告或回到通知公告列表。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-门户管理-首页内容.html": {
    "name": "门户管理 · 首页内容",
    "intro": "按现有七个配置分区维护首页。资源内容沿用原记录，栏目配置只处理当前可编辑的展示内容。",
    "field": [
      {
        "label": "首页配置",
        "sections": [
          {
            "title": "首页配置",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "首屏轮播",
                "5 张图，各自更换",
                "各屏按首页既有顺序展示，编辑仅更换图片。"
              ],
              [
                "特色数据集",
                "3 张卡片",
                "每张选择数据集、编辑首页简介及展示图；选择新数据集时带出其默认内容。"
              ],
              [
                "特色模型",
                "单个模型、单张展示图片",
                "在候选模型中选择。模型文案以字段名和内容配对维护。"
              ],
              [
                "应用案例",
                "最多选 2 项",
                "按已选案例配置展示。"
              ],
              [
                "课题指南",
                "栏目文案、展示图",
                "指南本身在课题指南管理维护。"
              ],
              [
                "栏目文案",
                "栏目名称、栏目标题、栏目说明",
                "名称最多 32 字、标题最多 48 字，说明选填，最多 140 字。"
              ],
              [
                "示范基地",
                "名称、图片",
                "修改当前基地的名称和展示图。"
              ],
              [
                "合作伙伴",
                "单位名称、类别、展示状态",
                "可从已有单位中选取或直接填写，合作伙伴单独保存。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "首页维护",
        "sections": [
          {
            "title": "首页维护",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "切换栏目",
                "首页内容的栏目 Tab",
                "展示各栏目的配置及预览。"
              ],
              [
                "替换图片",
                "首屏、数据卡片、特色模型或指南 → 更换图片",
                "选择图片后预览，保存时更新对应栏目配置。"
              ],
              [
                "编辑模型说明",
                "特色模型 → 编辑文案说明",
                "可添加删除键值行，非空行的字段名与内容成对填写。"
              ],
              [
                "合作伙伴",
                "新增 / 编辑合作伙伴",
                "选已有单位或直接输入名称，填写展示信息并保存。"
              ],
              [
                "预览",
                "预览首页",
                "在预览窗口检查当前栏目配置。"
              ],
              [
                "公告管理",
                "左侧“通知公告”",
                "进入公告列表。已发布公告按时间进入门户首页。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-课题指南管理.html": {
    "name": "课题指南管理",
    "intro": "维护指南正文、附件及多项研究方向，并控制发布或撤回。",
    "field": [
      {
        "label": "基本信息",
        "sections": [
          {
            "title": "基本信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "指南名称、年度、批次",
                "基本信息",
                "新增或编辑指南时填写；年度、批次使用表单选项。"
              ],
              [
                "指南正文、附件",
                "富文本 / 文件",
                "按基本信息页签维护。开放课题可查看已发布指南和附件。"
              ]
            ]
          }
        ]
      },
      {
        "label": "指南状态与方向标签",
        "sections": [
          {
            "title": "指南状态与方向标签",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "发布状态",
                "草稿 / 已发布 / 已撤回",
                "查询条件与指南行状态一致。"
              ],
              [
                "方向名称",
                "文本",
                "每个方向独立维护。"
              ],
              [
                "业务能力、适用作物、技术任务",
                "标签多选",
                "使用模型中心相应标签，为人员推荐提供匹配依据。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "年度",
                "下拉",
                "全部 / 2026 / 2025 / 2024"
              ],
              [
                "发布状态",
                "下拉",
                "全部 / 已发布 / 草稿 / 已撤回"
              ],
              [
                "每页条数",
                "下拉",
                "5条/页 / 10条/页 / 20条/页 / 50条/页"
              ],
              [
                "批次",
                "下拉",
                "第一批 / 第二批 / 第三批"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "指南维护",
        "sections": [
          {
            "title": "指南维护",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "年度、发布状态、关键词",
                "查询当前指南并分页。"
              ],
              [
                "新增 / 编辑",
                "新增指南 / 行内编辑",
                "打开指南编辑区，填写名称、年度、批次及正文。"
              ],
              [
                "方向",
                "指南抽屉 → ＋ 添加方向",
                "为每个方向生成独立页签，填写方向名称并选择模型中心标签。可切回基本信息，确认后可删除方向。"
              ],
              [
                "附件",
                "上传附件",
                "保存指南相关材料。"
              ],
              [
                "保存",
                "保存",
                "保存当前指南及各方向内容。"
              ],
              [
                "发布 / 撤回",
                "行内发布 / 撤回",
                "更新状态，前台展示已发布内容。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-课题管理.html": {
    "name": "课题管理",
    "intro": "维护课题资料、归属、关联指南和执行状态。",
    "field": [
      {
        "label": "课题字段",
        "sections": [
          {
            "title": "课题字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "课题编号、课题名称",
                "必填；编辑时编号只读",
                "编号识别同一课题。"
              ],
              [
                "关联指南",
                "必选",
                "从可用指南数据选择。"
              ],
              [
                "机构、团队负责人",
                "依次必选",
                "先选机构，再从该机构的负责人清单选择。更换机构会刷新负责人选项。"
              ],
              [
                "课题类型",
                "重点 / 面上 / 青年",
                "用于列表筛选及课题展示。"
              ],
              [
                "课题方向",
                "软件 / 算法方向、硬件方向",
                "创建或编辑时选择。"
              ],
              [
                "公示开始、公示结束",
                "必填日期",
                "结束不能早于开始。"
              ],
              [
                "课题状态、调整原因",
                "拟立项 / 在研 / 已结题 / 未立项 / 已终止",
                "调整状态时选择状态、填写原因。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "课题维护",
        "sections": [
          {
            "title": "课题维护",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "年度、所属指南、类型、状态和关键词",
                "定位课题并查看分页。"
              ],
              [
                "新增 / 编辑",
                "新增课题 / 行内编辑",
                "维护课题编号、名称、指南、类型、方向和公示期。机构与团队负责人按顺序选择。"
              ],
              [
                "查看",
                "课题名称 / 查看",
                "核对课题资料与负责人归属，返回列表可继续办理。"
              ],
              [
                "调整状态",
                "行内调整状态",
                "选择当前支持的课题状态并记录原因。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-科研人员推荐.html": {
    "name": "科研人员推荐",
    "intro": "按所选指南及研究方向查看推荐人员，也可浏览全部科研人员。",
    "field": [
      {
        "label": "筛选与人员信息",
        "sections": [
          {
            "title": "筛选与人员信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "年度、课题指南、研究方向",
                "级联筛选",
                "方向来自所选指南的方向配置。"
              ],
              [
                "姓名或单位关键词",
                "文本搜索",
                "缩小人员范围。"
              ],
              [
                "姓名、职称、单位、专业标签",
                "人员资料",
                "来自科研人员记录。"
              ],
              [
                "匹配依据、关联团队、联系方式",
                "推荐与关联信息",
                "展示当前方向对应的匹配内容，不新增评分规则。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "年度",
                "下拉",
                "2026年 / 2025年 / 2024年"
              ],
              [
                "研究方向",
                "随指南变化",
                "选择年度后更新指南，选择指南后更新方向。"
              ],
              [
                "每页条数",
                "下拉",
                "5条/页 / 10条/页 / 20条/页 / 50条/页"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "推荐查询",
        "sections": [
          {
            "title": "推荐查询",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "筛选",
                "选择年度、指南和方向 → 查询",
                "按当前条件更新推荐列表。"
              ],
              [
                "范围切换",
                "推荐人员 / 全部科研人员",
                "推荐结果依赖所选方向，可在全部科研人员中按姓名、单位查找。"
              ],
              [
                "查看资料",
                "行内查看资料",
                "打开该人员资料与相关信息。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-课题工作台.html": {
    "name": "课题管理工作台",
    "intro": "面向课题执行跟进，聚合具体待办、研究资源和成果交付。",
    "field": [
      {
        "label": "课题跟进内容",
        "sections": [
          {
            "title": "课题跟进内容",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "年度、所属指南、关键词",
                "筛选条件",
                "限定当前课题及事项清单。"
              ],
              [
                "成果待验收、成果已驳回、空间申请、空间异常",
                "待跟进事项",
                "来自相应流程的当前记录，点击查看具体事项。"
              ],
              [
                "有待跟进事项、在研、在研暂无成果、已结题、全部",
                "课题列表分组",
                "显示对应课题数量和记录。"
              ],
              [
                "课题及负责人、研究资源、成果交付、待跟进事项",
                "课题行信息",
                "用于定位具体课题需要跟进的环节。"
              ],
              [
                "演示数据 / 当前记录",
                "原型数据源切换",
                "演示数据与当前操作记录分开查看。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "年度",
                "下拉",
                "全部年度 / 2026 年 / 2025 年"
              ],
              [
                "每页课题数量",
                "下拉",
                "5 / 10 / 20"
              ],
              [
                "每页条数",
                "下拉",
                "5 / 10 / 20"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "课题跟进交互",
        "sections": [
          {
            "title": "课题跟进交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "定位事项",
                "顶部事项卡 / 课题行跟进",
                "打开该事项或对应业务入口。"
              ],
              [
                "查看关联",
                "研究空间、成果数量、课题名称",
                "查看当前课题的具体资源与材料。"
              ],
              [
                "筛选 / 分组",
                "筛选条件及列表分组",
                "更新课题范围及分页。"
              ],
              [
                "刷新",
                "刷新",
                "重新读取当前来源记录。"
              ],
              [
                "导出",
                "导出跟进清单",
                "导出当前范围清单，不新增年度绩效口径。"
              ],
              [
                "导出跟进清单",
                "导出跟进清单",
                "按当前所选年度、指南及筛选范围导出。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "index.html": {
    "name": "工作台总览",
    "intro": "展示平台运行和需要处理的事项，并跳转对应管理模块。",
    "field": [
      {
        "label": "工作台内容",
        "sections": [
          {
            "title": "工作台内容",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "顶部指标卡",
                "当前模型、数据、科研团队等汇总",
                "卡片名称与统计对象使用页面现有配置。"
              ],
              [
                "待处理事项",
                "申请事项、申请人、团队、提交时间、状态",
                "按当前 Tab 展示对应待办。"
              ],
              [
                "科研空间运行情况",
                "空间名称、异常情况、发现时间",
                "定位具体实例与异常。"
              ],
              [
                "算力与存储",
                "当前资源汇总",
                "展示既有运行数据，不增加使用到期规则。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "每页条数",
                "下拉",
                "4条/页 / 5条/页 / 10条/页 / 20条/页 / 50条/页"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "工作台入口",
        "sections": [
          {
            "title": "工作台入口",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "待办切换",
                "待处理事项 Tab",
                "展示对应事项清单。"
              ],
              [
                "办理",
                "待处理事项 → 查看 / 办理",
                "按记录类型定位资源申请、需求发布申请或成果验收等对应页面。"
              ],
              [
                "空间异常",
                "异常行操作",
                "打开对应空间详情处理。"
              ],
              [
                "指标入口",
                "指标卡的现有链接",
                "进入相应资源管理模块。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-科研空间管理.html": {
    "name": "科研空间管理 · 列表",
    "intro": "管理员查看空间运行并操作实例，研究状态与实例运行状态分别处理。",
    "field": [
      {
        "label": "空间管理信息",
        "sections": [
          {
            "title": "空间管理信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "空间编号、名称、所属团队、负责人",
                "基础信息",
                "来自已创建空间。"
              ],
              [
                "实例状态",
                "运行中 / 已停止 / 异常 / 重启中 / 已删除",
                "根据实例状态计算允许的行操作。"
              ],
              [
                "配置",
                "CPU、内存、GPU、存储及现有实例配置",
                "调整时显示原值与当前可选范围。"
              ],
              [
                "调整原因、调整完成后启动实例",
                "文本 / 开关",
                "在调整配置弹窗填写与选择。"
              ],
              [
                "挂载资源、研究文件、成果、协作成员",
                "关联内容",
                "详情只展示当前空间范围。"
              ],
              [
                "资源使用",
                "现有监测内容",
                "不新增自动到期回收。"
              ],
              [
                "重启确认、删除确认编号",
                "确认控件",
                "重启需确认任务可中断；删除需匹配空间编号。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "实例状态",
                "下拉",
                "全部 / 运行中 / 已停止 / 异常 / 重启中 / 已删除"
              ],
              [
                "每页条数",
                "下拉",
                "5条/页 / 10条/页 / 20条/页 / 50条/页"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "实例操作",
        "sections": [
          {
            "title": "实例操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "查询 / 详情",
                "关键词、实例状态 → 查询；点击空间名称或详情",
                "关键词匹配编号、名称或负责人，打开对应空间详情。"
              ],
              [
                "调整配置",
                "调整配置 → 修改规格、原因及启动选项 → 确认",
                "按当前限制执行配置调整。"
              ],
              [
                "启动 / 停止",
                "实例行或详情操作 → 确认",
                "更新运行状态并反馈执行结果。"
              ],
              [
                "重启",
                "重启 → 确认任务可中断",
                "确认后执行重启。"
              ],
              [
                "删除",
                "删除实例 → 输入空间编号",
                "满足当前限制并确认后删除指定实例。"
              ],
              [
                "资源查看",
                "挂载数据 / 模型、研究成果的查看入口",
                "打开对应资源记录。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-科研空间详情.html": {
    "name": "科研空间管理 · 详情",
    "intro": "管理员查看空间运行并操作实例，研究状态与实例运行状态分别处理。",
    "field": [
      {
        "label": "空间管理信息",
        "sections": [
          {
            "title": "空间管理信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "空间编号、名称、所属团队、负责人",
                "基础信息",
                "来自已创建空间。"
              ],
              [
                "实例状态",
                "运行中 / 已停止 / 异常 / 重启中等当前状态",
                "与启动、停止、重启过程同步。"
              ],
              [
                "配置",
                "当前值与修改后的 CPU、GPU、内存和存储配额",
                "规格为整数，GPU 从 0 起，其余为正数，存储配额不能低于已用，不能超过可分配资源。"
              ],
              [
                "调整原因、调整完成后启动实例",
                "选填文本 / 默认勾选",
                "保存规格时按所选配置决定保存后的运行状态。"
              ],
              [
                "挂载资源、研究文件、成果、协作成员",
                "关联内容",
                "详情只展示当前空间范围。"
              ],
              [
                "资源使用",
                "现有监测内容",
                "不新增自动到期回收。"
              ],
              [
                "重启确认、删除确认编号",
                "确认控件",
                "重启需确认任务可中断；删除需匹配空间编号。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "实例操作",
        "sections": [
          {
            "title": "实例操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "查询 / 详情",
                "返回列表",
                "保留列表筛选，再选择其他空间。"
              ],
              [
                "调整配置",
                "调整配置 → 修改规格、原因及启动选项 → 确认",
                "按当前限制执行配置调整。"
              ],
              [
                "启动 / 停止",
                "实例行或详情操作 → 确认",
                "更新运行状态并反馈执行结果。"
              ],
              [
                "重启",
                "重启 → 确认任务可中断",
                "确认后执行重启。"
              ],
              [
                "删除",
                "删除实例 → 输入空间编号",
                "与当前实例编号一致才能确认，状态更新到已删除。"
              ],
              [
                "资源查看",
                "挂载数据 / 模型、研究成果的查看入口",
                "打开对应资源记录。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-能力共享.html": {
    "name": "能力共享",
    "intro": "管理模型部署接口与外部注册接口，发布服务、配置授权并维护接口文档。",
    "field": [
      {
        "label": "接口管理",
        "sections": [
          {
            "title": "接口管理",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "接口来源",
                "模型部署 / 外部注册",
                "部署接口来自模型当前部署，外部接口由注册表单维护。"
              ],
              [
                "接口名称、接口说明",
                "名称必填 / 说明选填",
                "部署来源可编辑名称说明，来源和调用参数由模型维护。"
              ],
              [
                "关联模型 / 版本",
                "外部注册必选",
                "从当前可选接口接入模型中选择；服务发布后绑定按页面限制只读。"
              ],
              [
                "上游接口地址、请求方式",
                "必填 URL；GET / POST / PUT / PATCH / DELETE",
                "协议与端口从地址识别。"
              ],
              [
                "内容类型",
                "JSON / form-data",
                "与入参定义对应。"
              ],
              [
                "上游认证方式",
                "无需认证 / Bearer Token / 自定义请求头",
                "认证请求头名称和凭据按所选方式联动。"
              ],
              [
                "请求超时",
                "秒数",
                "按当前注册表单范围校验。"
              ],
              [
                "使用说明、入参、出参、示例",
                "结构化接口资料",
                "使用说明必填；参数行按实际类型和必填标记校验。"
              ],
              [
                "上游协议与端口、Path 入参",
                "由地址识别 / 地址占位参数",
                "上游地址中的各参数名须与 Path 入参定义一致。"
              ]
            ]
          }
        ]
      },
      {
        "label": "服务、授权与文档",
        "sections": [
          {
            "title": "服务、授权与文档",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "已登记接口、关联模型 / 版本",
                "发布时选择接口并带出绑定",
                "候选来源于当前可发布接口；模型关系不在发布时另填。"
              ],
              [
                "服务名称、服务说明",
                "名称必填 / 说明选填",
                "用于服务展示。"
              ],
              [
                "开放功能",
                "在线使用 / 试用",
                "按当前接口、模型和运行状态允许开启。"
              ],
              [
                "授权对象、资源、免审批使用",
                "按现有授权面板配置",
                "以具体对象及资源为范围；不自动扩大为全部模型的免审批。"
              ],
              [
                "文档名称、文档文件",
                "上传或替换时必填",
                "PDF、Word、TXT、Markdown；保留当前文件及下载入口。"
              ]
            ]
          }
        ]
      },
      {
        "label": "页面控件取值",
        "sections": [
          {
            "title": "页面控件取值",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "接口来源",
                "下拉",
                "全部 / 模型部署 / 外部注册"
              ],
              [
                "服务关联",
                "下拉",
                "全部 / 已关联 / 未关联"
              ],
              [
                "每页条数",
                "下拉",
                "10 / 20 / 50"
              ]
            ],
            "note": "仅记录当前页面已有的选项和长度限制；业务必填与联动规则见相应业务页签。"
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "接口管理",
        "sections": [
          {
            "title": "接口管理",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "接口查询",
                "来源、服务关联、关键词与分页",
                "定位模型部署或外部注册接口。"
              ],
              [
                "注册 / 编辑",
                "注册接口或行内编辑",
                "填写关联模型及请求配置，保存后形成接口记录。"
              ],
              [
                "调试",
                "接口行 → 调试 → 输入参数 / 凭据",
                "当前原型展示配置的返回示例，不发送真实上游请求。"
              ]
            ]
          }
        ]
      },
      {
        "label": "服务发布",
        "sections": [
          {
            "title": "服务发布",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "发布服务",
                "服务发布 → 选择接口 → 配置功能 → 保存",
                "使用接口已有绑定，形成服务开放配置。"
              ],
              [
                "开放开关",
                "在线使用 / 试用开关",
                "按服务和运行状态更新可用入口；开放中调用配置按页面保持只读。"
              ]
            ]
          }
        ]
      },
      {
        "label": "服务授权",
        "sections": [
          {
            "title": "服务授权",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "授权",
                "服务授权 → 选择对象与资源 → 保存",
                "更新指定范围的免审批使用配置。"
              ]
            ]
          }
        ]
      },
      {
        "label": "接口文档",
        "sections": [
          {
            "title": "接口文档",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "接口文档",
                "上传 / 替换 / 下载 / 删除",
                "维护实际文档文件；替换保留当前文档记录。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-时空数据管理.html": {
    "name": "时空数据管理",
    "intro": "本页为既有平台能力的复用说明，沿用当前说明页范围。",
    "field": [
      {
        "label": "复用能力说明",
        "sections": [
          {
            "title": "复用能力说明",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "能力分类",
                "数据检索、数据同步、数据集成、数据开发、数据资产、数据源管理",
                "点击对应二级项查看说明。"
              ],
              [
                "说明内容",
                "能力描述与接入说明",
                "当前页面没有新增业务录入表单。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "说明页交互",
        "sections": [
          {
            "title": "说明页交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "分类切换",
                "点击左侧二级能力项",
                "显示对应说明内容。"
              ],
              [
                "模块导航",
                "平台能力下其他入口",
                "进入该模块现有页面。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-地图引擎.html": {
    "name": "地图引擎",
    "intro": "本页为既有平台能力的复用说明，沿用当前说明页范围。",
    "field": [
      {
        "label": "复用能力说明",
        "sections": [
          {
            "title": "复用能力说明",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "能力分类",
                "地图资源、服务发布、视图管理、样式管理",
                "点击对应二级项查看现有说明。"
              ],
              [
                "说明内容",
                "能力描述与接入说明",
                "当前页面没有新增业务录入表单。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "说明页交互",
        "sections": [
          {
            "title": "说明页交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "分类切换",
                "点击左侧二级能力项",
                "显示对应说明内容。"
              ],
              [
                "模块导航",
                "平台能力下其他入口",
                "进入该模块现有页面。"
              ],
              [
                "默认内容",
                "进入平台能力 → 地图引擎",
                "显示地图资源说明，可切换服务发布、视图管理、样式管理。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-消息中心.html": {
    "name": "消息中心",
    "intro": "查看后台消息及未读状态。",
    "field": [
      {
        "label": "消息内容",
        "sections": [
          {
            "title": "消息内容",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "消息标题、摘要、时间",
                "标题、分类、接收时间和正文",
                "列表显示标题、分类和接收时间，详情查看正文。"
              ],
              [
                "已读状态",
                "未读 / 已读",
                "按查看与标记动作更新。"
              ],
              [
                "关键词",
                "文本",
                "实时匹配消息标题，可与已读状态联用。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "消息操作",
        "sections": [
          {
            "title": "消息操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "范围",
                "全部消息 / 未读消息 / 已读消息",
                "筛选对应消息。"
              ],
              [
                "查看",
                "行内查看",
                "消息标记为已读，详情显示正文。有处理链接时可点击“前往处理”。"
              ],
              [
                "批量已读",
                "全部标为已读",
                "更新当前消息已读状态。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-个人资料.html": {
    "name": "个人资料",
    "intro": "维护当前后台账号的个人基本资料。",
    "field": [
      {
        "label": "基本信息",
        "sections": [
          {
            "title": "基本信息",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "姓名",
                "必填文本",
                "保存后同步页头姓名及账号安全的当前会话。"
              ],
              [
                "账号",
                "只读账号",
                "显示当前登录账号。"
              ],
              [
                "所属机构、岗位、联系电话",
                "选填文本",
                "维护当前资料信息。"
              ],
              [
                "电子邮箱",
                "选填邮箱",
                "填写时校验邮件格式，更新后同步账号安全。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "资料操作",
        "sections": [
          {
            "title": "资料操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "修改",
                "编辑可用字段",
                "只改变当前资料表单。"
              ],
              [
                "保存",
                "保存资料",
                "校验并保存当前账号资料，当前页面更新页头显示。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-账号安全.html": {
    "name": "账号安全",
    "intro": "处理当前账号的安全设置和退出登录。",
    "field": [
      {
        "label": "登录与安全",
        "sections": [
          {
            "title": "登录与安全",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "联系邮箱",
                "邮箱；设置时必填",
                "保存后同步个人资料的电子邮箱。"
              ],
              [
                "当前会话",
                "当前浏览器与显示姓名",
                "展示当前演示会话。"
              ],
              [
                "最近安全操作",
                "时间、操作内容",
                "展示已记录的邮箱更新。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "账号安全操作",
        "sections": [
          {
            "title": "账号安全操作",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "设置邮箱",
                "设置邮箱 → 填写并保存",
                "校验邮箱格式，成功后刷新邮箱及操作记录。"
              ],
              [
                "返回工作台",
                "返回工作台",
                "回到后台工作台总览。"
              ],
              [
                "退出",
                "页头账号菜单 → 退出登录",
                "回到后台登录页。"
              ]
            ]
          }
        ]
      }
    ]
  },
  "后台-登录.html": {
    "name": "管理员登录",
    "intro": "当前原型通过演示账号进入后台，不代表正式认证接口。",
    "field": [
      {
        "label": "登录字段",
        "sections": [
          {
            "title": "登录字段",
            "head": [
              "字段 / 内容",
              "类型 / 取值",
              "规则与用途"
            ],
            "rows": [
              [
                "账号",
                "必填文本",
                "填写演示账号。"
              ],
              [
                "演示密码",
                "必填密码输入",
                "填写演示值即可操作。"
              ]
            ]
          }
        ]
      }
    ],
    "guide": [
      {
        "label": "登录交互",
        "sections": [
          {
            "title": "登录交互",
            "head": [
              "场景",
              "操作入口",
              "结果与限制"
            ],
            "rows": [
              [
                "进入后台",
                "填写演示信息 → 进入工作台",
                "进入后台工作台总览。"
              ]
            ]
          }
        ]
      }
    ]
  }
};

  var VIEW_DOCS = {
  "后台-个人中心.html": {
    "default": "后台-消息中心.html",
    "messages": "后台-消息中心.html",
    "profile": "后台-个人资料.html",
    "security": "后台-账号安全.html"
  },
  "后台-审批中心.html": {
    "default": "后台-审批中心.html",
    "outcomes": "后台-审批中心.html",
    "resources": "后台-资源申请审批.html"
  },
  "后台-课题中心.html": {
    "default": "后台-课题工作台.html",
    "workbench": "后台-课题工作台.html",
    "guides": "后台-课题指南管理.html",
    "researchers": "后台-科研人员推荐.html",
    "projects": "后台-课题管理.html"
  },
  "后台-门户管理.html": {
    "default": "后台-门户管理-首页内容.html",
    "home": "后台-门户管理-首页内容.html",
    "notices": "后台-门户管理-通知公告.html",
    "new": "后台-通知公告-新增.html",
    "edit": "后台-通知公告-编辑.html",
    "detail": "后台-通知公告-详情.html"
  },
  "后台-案例管理.html": {
    "default": "后台-案例管理.html",
    "list": "后台-案例管理.html",
    "new": "后台-案例管理-新增.html",
    "edit": "后台-案例管理-编辑.html",
    "detail": "后台-案例管理-详情.html"
  },
  "后台-需求管理.html": {
    "default": "后台-需求管理.html",
    "list": "后台-需求管理.html",
    "new": "后台-需求管理-新增.html",
    "edit": "后台-需求管理-编辑.html",
    "detail": "后台-需求管理-详情.html"
  },
  "后台-科研空间管理.html": {
    "default": "后台-科研空间管理.html",
    "list": "后台-科研空间管理.html",
    "space": "后台-科研空间详情.html"
  }
};

  function pageDocKey() {
    var file = decodeURIComponent(location.pathname.split('/').pop() || '') || 'index.html';
    var routes = VIEW_DOCS[file];
    if (!routes) return file;
    if (file === '后台-审批中心.html') {
      var approval = document.getElementById('approval-root');
      if (approval && routes[approval.dataset.view]) return routes[approval.dataset.view];
    }
    var view = location.hash.slice(1).split(/[?/=]/)[0];
    return Object.prototype.hasOwnProperty.call(routes, view) ? routes[view] : routes.default;
  }

  function inject() {
    if (document.querySelector('.mtdev-group')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.setAttribute('data-devdoc-version', '2026-11-18');
    wrap.innerHTML =
      drawerHTML('mtdevFieldMask', 'mtdevFieldBody', 'mtdevFieldTitle') +
      drawerHTML('mtdevGuideMask', 'mtdevGuideBody', 'mtdevGuideTitle') +
      '<div class="mtdev-group">' +
      '<button class="mtdev-btn field" type="button" aria-haspopup="dialog" aria-controls="mtdevFieldMask">📋 字段说明</button>' +
      '<button class="mtdev-btn guide" type="button" aria-haspopup="dialog" aria-controls="mtdevGuideMask">🧪 交互演示指引</button>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (event) { event.stopPropagation(); });

    var group = wrap.querySelector('.mtdev-group');
    var fieldMask = wrap.querySelector('#mtdevFieldMask');
    var guideMask = wrap.querySelector('#mtdevGuideMask');
    var activeMask, opener, activeKey;

    function syncDocs() {
      var next = pageDocKey();
      if (activeKey === next) return;
      activeKey = next;
      wrap.dataset.devdocPage = next;
      var doc = DOCS[next] || DOCS.__default__;
      var foot = '<p class="mtdev-note">表单校验以原型当前操作为准。示例数据、模拟任务及账号切换用于原型演示。</p>';
      renderDrawer(fieldMask, doc, '📋 字段说明', doc.field, 'mtdevF', foot);
      renderDrawer(guideMask, doc, '🧪 交互演示指引', doc.guide, 'mtdevG');
      if (activeMask) activeMask.querySelector('.mtdev-x').focus({ preventScroll: true });
    }

    function close() {
      if (!activeMask) return;
      activeMask.classList.remove('on');
      activeMask = null;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    }

    function attach(mask, trigger) {
      trigger.onclick = function () {
        syncDocs();
        close();
        opener = trigger;
        activeMask = mask;
        var body = mask.querySelector('.mtdev-bd');
        selectTab(body, 0);
        body.scrollTop = 0;
        mask.classList.add('on');
        mask.querySelector('.mtdev-x').focus({ preventScroll: true });
      };
      mask.querySelector('.mtdev-x').onclick = close;
      mask.onclick = function (event) { if (event.target === mask) close(); };
      mask.onkeydown = function (event) {
        if (event.key !== 'Tab') return;
        var first = mask.querySelector('.mtdev-x');
        var last = mask.querySelector('.mtdev-tab.on');
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      draggable(mask.querySelector('.mtdev-drawer'), mask.querySelector('.mtdev-hd'));
    }

    attach(fieldMask, group.querySelector('.mtdev-btn.field'));
    attach(guideMask, group.querySelector('.mtdev-btn.guide'));
    syncDocs();
    window.addEventListener('hashchange', syncDocs);
    window.addEventListener('popstate', syncDocs);
    window.addEventListener('approval:viewchange', syncDocs);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });
    draggable(group);

    /* Avoid covering the host application's full-screen dialog controls. */
    setInterval(function () {
      var overlays = document.querySelectorAll('[class*=mask],[class*=overlay],[class*=backdrop],[class*=modal]');
      var covered = Array.from(overlays).some(function (element) {
        if (/mtdev/.test(element.className || '')) return false;
        var style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
        var box = element.getBoundingClientRect();
        return box.width > window.innerWidth * 0.9 && box.height > window.innerHeight * 0.9;
      });
      group.classList.toggle('mtdev-dim', covered);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
