(function () {
  'use strict';
  const accounts = window.PrototypeAccounts;
  const workbench = 'index.html';
  const topics = '后台-课题中心.html';
  const approval = '后台-审批中心.html';
  const settings = '后台-管理设置.html';
  const model = '后台-模型管理.html';
  const spaces = '后台-科研空间管理.html';
  const capability = '后台-时空数据管理.html';

  const menuGroups = {
    '工作台总览': {'工作台总览':workbench},
    '课题管理': {
      '课题管理工作台':topics+'#workbench', '课题指南管理':topics+'#guides',
      '科研人员推荐':'后台-科研人员推荐.html', '课题管理':topics+'#projects',
    },
    '审批中心': {'成果验收审批':approval+'#outcomes', '资源申请审批':approval+'#resources'},
    '运营管理': {
      '门户管理':'后台-门户管理.html', '模型管理':model,
      '数据集管理':'后台-数据集管理.html', '案例管理':'后台-案例管理.html',
      '需求管理':'后台-需求管理.html', '科研空间管理':spaces,
    },
    '平台能力': {'时空数据管理':capability, '地图引擎':'后台-地图引擎.html', '能力共享':'后台-能力共享.html'},
    '合作与组织': {
      '合作咨询':settings+'#cooperation', '机构管理':settings+'#institutions',
      '人员管理':settings+'#members', '团队管理':settings+'#teams', '角色管理':settings+'#roles',
    },
  };
  const partial = {
    R2:{
      '工作台总览':['工作台总览'], '课题管理':['课题指南管理'],
      '审批中心':Object.keys(menuGroups['审批中心']), '运营管理':Object.keys(menuGroups['运营管理']),
      '合作与组织':Object.keys(menuGroups['合作与组织']),
    },
    R3:{
      '工作台总览':['工作台总览'], '课题管理':Object.keys(menuGroups['课题管理']),
      '审批中心':Object.keys(menuGroups['审批中心']), '运营管理':['科研空间管理'],
    },
  };
  const all = Object.fromEntries(Object.entries(menuGroups).map(([group,items])=>[group,Object.keys(items)]));
  const menu = (code = accounts.backendAccount().code) => partial[code] || (['R1','R7'].includes(code) ? all : {});
  function canVisitGroup(group, page, code) {
    return menu(code)[group]?.includes(page) || false;
  }

  const aliases = {
    '后台-课题工作台.html':topics+'#workbench', '后台-课题指南管理.html':topics+'#guides',
    '后台-课题管理.html':topics+'#projects', '后台-资源申请审批.html':approval+'#resources',
    '后台-成果验收审批.html':approval+'#outcomes',
    '后台-消息中心.html':'后台-个人中心.html#messages', '后台-个人资料.html':'后台-个人中心.html#profile',
    '后台-账号安全.html':'后台-个人中心.html#security',
  };
  const operations = Object.keys(menuGroups['运营管理']);
  const operationFiles = Object.values(menuGroups['运营管理']);
  const platforms = Object.keys(menuGroups['平台能力']);
  const platformFiles = Object.values(menuGroups['平台能力']);
  const organization = {cooperation:'合作咨询',institutions:'机构管理',members:'人员管理',teams:'团队管理',roles:'角色管理'};

  function resolve(href) {
    let url;
    try { url = new URL(href, location.href); }
    catch { return null; }
    if (!['http:','https:','file:'].includes(url.protocol)) return null;
    let file = decodeURIComponent(url.pathname.split('/').pop());
    if (!file.startsWith('后台-')) return null;
    let fragment = decodeURIComponent(url.hash.slice(1));
    if (aliases[file]) {
      const [canonical,panel] = aliases[file].split('#');
      file = canonical;
      fragment = panel + (url.search || '');
    }
    const tab = fragment.split(/[/?]/)[0];
    let group, page;
    if (file === workbench) {
      group = page = '工作台总览';
    } else if ([topics,'后台-科研人员推荐.html'].includes(file)) {
      group = '课题管理';
      if (file !== topics || tab === 'recommend') page = '科研人员推荐';
      else if (/^guides?$/.test(tab)) page = '课题指南管理';
      else if (/^projects?$/.test(tab)) page = '课题管理';
      else page = '课题管理工作台';
    } else if (file === approval) {
      group = '审批中心';
      page = tab === 'resources' || ['request','spaceRequest','demand'].some(key=>url.searchParams.has(key))
        ? '资源申请审批' : '成果验收审批';
    } else if (file === settings) {
      group = '合作与组织';
      page = organization[tab] || '合作咨询';
    } else if (operationFiles.includes(file) || /^后台-门户管理-/.test(file)) {
      group = '运营管理';
      page = operations[operationFiles.indexOf(file)] || '门户管理';
    } else if (platformFiles.includes(file)) {
      group = '平台能力';
      page = platforms[platformFiles.indexOf(file)];
    }
    const changes = /(?:^|[/?&=-])(?:edit|new|create|configure|review|handle|publish|stage)(?:$|[/?&#=-])/i;
    const edits = file !== approval && (changes.test(fragment) || changes.test(url.search));
    return {group,page,file,fragment,edits};
  }
  function canVisit(href, code = accounts.backendAccount().code) {
    const route = resolve(href);
    if (!route) return true;
    if (route.edits && code === 'R7') return false;
    return !route.group || canVisitGroup(route.group,route.page,code);
  }
  function fallback(href, code = accounts.backendAccount().code) {
    const route = resolve(href);
    const page = route?.edits && canVisitGroup(route.group,route.page,code) ? route.page : menu(code)[route?.group]?.[0];
    return page ? menuGroups[route.group][page] : workbench;
  }

  const labelText = element => (element.textContent || element.getAttribute('aria-label') || element.title || '').replace(/[＋+…›←→]/g,'').trim();
  const modifiesLabel = /^(?:新增|新建|创建|编辑|修改|保存|提交|删除|批量(?:删除|编辑|操作|绑定|解绑|处理|下架|上架)|(?:确认)?(?:处理|办理|审批验收|审批|验收|配置|调整配置|重启|停止实例|启动实例|删除实例|释放|部署|上架|下架|发布|启用|停用)|绑定|解绑|关联成员|添加成员|管理成员|关联机构|再次构建|构建镜像|构建|替换|上传|复制(?:角色|版本|资源)|导出|下载|撤回|关闭需求|结束需求|结束研究|重置密码|标记已读)/;
  const readonlyLabel = /^(?:查看|预览|查询|搜索|筛选|重置筛选|重置|清空|刷新|全部|返回|关闭$|取消$)|(?:列表|管理|中心|记录|日志|状态|详情|按钮说明|指南|配置说明)$/;
  const modifiesAction = /(?:^|[-:.])(?:edit|delete|remove|save|submit|create|new|upload|publish|deploy|restart|start|stop|release|build|approve|reject|refuse|copy-role|unbind|bind|mutate|export|download|handle)(?:$|[-:(.])|(?:^|\.)review(?:Space)?\(/i;
  function isWriteControl(element) {
    if (element.closest('.prototype-account-picker,.main-nav,.admin-side,.mtdev-group,.mtdev-drawer')) return false;
    if (element.hasAttribute('download')) return true;
    const label = labelText(element);
    if (readonlyLabel.test(label) && !/^(?:批量|删除|导出|下载|重置密码)/.test(label)) return false;
    if (modifiesLabel.test(label)) return true;
    const action = [
      element.dataset.action,element.dataset.act,element.dataset.op,element.dataset.operate,
      element.getAttribute('onclick'),element.getAttribute('form'),
    ].filter(Boolean).join('\n');
    if (action.split('\n').some(value=>modifiesAction.test(value))) return true;
    return element.getAttribute('type') === 'file' ||
      /^(detail(?:Config|Toggle|Restart|Delete)|new(?:Model|Dataset|Demand|Project|Role)|export(?:Summary|Detail)|approval-review)/i.test(element.id);
  }
  const navNodes = '.site-header a,.admin-side a,[data-nav]';
  const controlNodes = 'button,a,input[type="submit"],input[type="file"],[role="button"]';
  const primaryNav = '.main-nav,.site-header nav,.site-header [id*="mobile" i]';
  function navigationAllowed(element) {
    const href = element.getAttribute('href');
    if (href && !canVisit(href)) return false;
    const text = labelText(element);
    if (element.closest(primaryNav) && menuGroups[text]) return !!menu()[text];
    if (element.closest('.admin-side')) {
      const route = resolve(location.href);
      if (route?.group && Object.hasOwn(menuGroups[route.group],text)) return canVisitGroup(route.group,text);
    }
    return true;
  }
  function refresh() {
    for (const anchor of document.querySelectorAll(navNodes)) {
      const label = labelText(anchor);
      const primary = anchor.closest(primaryNav) && menuGroups[label];
      if (primary && menu()[label]) {
        const dest = menuGroups[label][menu()[label][0]];
        if (anchor.getAttribute('href') !== dest) anchor.setAttribute('href',dest);
      }
      accounts.hide(anchor,!navigationAllowed(anchor));
    }
    const readOnly = !accounts.backendCanWrite();
    for (const node of document.querySelectorAll(controlNodes)) {
      if (node.matches(navNodes)) continue;
      const href = node.getAttribute('href');
      accounts.hide(node,readOnly && isWriteControl(node) || !!href && !canVisit(href));
    }
    const name = accounts.backendAccount().name;
    document.querySelectorAll('header .u-name,header .bdh-name,header .username,header [data-prototype-role-name]').forEach(node=>{
      const text = [...node.childNodes].find(child=>child.nodeType===3&&child.textContent.trim());
      if (text && text.textContent.trim()!==name) text.textContent = name;
      else if (!text && !node.childElementCount && node.textContent!==name) node.textContent = name;
    });
  }
  function guardLocation() {
    if (canVisit(location.href)) return true;
    location.replace(fallback(location.href));
    return false;
  }

  window.BackendRoleAccess = {menu,canVisit,canVisitGroup,backendCanWrite:accounts.backendCanWrite};
  if (!guardLocation()) return;
  window.addEventListener('hashchange',event=>{
    if (!guardLocation()) event.stopImmediatePropagation();
  },true);
  window.addEventListener('popstate',event=>{
    if (!guardLocation()) event.stopImmediatePropagation();
  },true);

  window.addEventListener('click',event=>{
    const element = event.target.closest?.(controlNodes);
    if (!element) return;
    const href = element.getAttribute('href');
    if (element.hasAttribute('data-role-hidden') || href && !canVisit(href) ||
        !accounts.backendCanWrite() && isWriteControl(element)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
  window.addEventListener('submit',event=>{
    if (accounts.backendCanWrite()) return;
    const form = event.target;
    const submitter = event.submitter || form.querySelector('[type="submit"]');
    if (submitter && isWriteControl(submitter) ||
        form.closest('dialog,.modal,.modal-mask') && !form.matches('[id*="filter" i],[id*="search" i]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  function init() {
    accounts.mountPicker('backend',id=>{
      if (!accounts.backendRoles.some(role=>role.id===id)) return;
      localStorage.setItem(accounts.backendSession,id);
      if (canVisit(location.href)) location.reload();
      else location.replace(fallback(location.href));
    });
    refresh();
    let queued = false;
    const observer = new MutationObserver(()=>{
      if (queued) return;
      queued = true;
      requestAnimationFrame(()=>{
        queued = false;
        if (guardLocation()) refresh();
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('storage',event=>{
      if (event.key === accounts.backendSession) location.reload();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

