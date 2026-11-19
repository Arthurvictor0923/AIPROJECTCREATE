(function () {
  'use strict';

  const settingsKey = 'bdh_org_team_prototype_20261016_v1';
  const backendSession = 'bdh-backend-preview-account-v1';
  const roles = [
    {code:'R1', id:'u-admin', label:'平台超管', name:'平台超管', login:'admin.demo', kind:'admin'},
    {code:'R2', id:'u-business-admin', label:'平台业务管理员', name:'平台业务管理员', login:'business.admin', kind:'admin'},
    {code:'R3', id:'u-project-admin', label:'课题管理员', name:'课题管理员', login:'project.admin', kind:'admin'},
    {code:'R4', id:'u-zhang', label:'科研负责人', name:'张研究员', login:'zhang.research', kind:'leader', orgId:'org-hla', org:'黑龙江省农业科学院'},
    {code:'R5', id:'u-li', label:'科研成员', name:'李晓', login:'li.xiao', kind:'member', ownerId:'u-zhang', orgId:'org-hla', org:'黑龙江省农业科学院'},
    {code:'R6', id:'u-enterprise', label:'企业成员', name:'陈宇', login:'chenyu', kind:'enterprise', orgId:'o2', org:'北大荒农垦集团'},
    {code:'R7', id:'u-executive', label:'领导', name:'领导', login:'executive.demo', kind:'executive'},
  ];
  const businessRoles = new Set(['R1','R2','R3']);
  const backendRoles = roles.filter(role => businessRoles.has(role.code) || role.code === 'R7');
  const accountById = id => roles.find(role => role.id === id);
  const modes = new Set(['deny','review','direct']);
  const initial = {
    R4:{data:'review', model:'review', space:'review', demand:'review'},
    R5:{data:'deny', model:'review', space:'deny', demand:'review'},
    R6:{data:'deny', model:'review', space:'deny', demand:'review'},
  };
  const enterpriseRoleId = 'role-enterprise-standard';
  const enterpriseRoleName = '企业成员 · 模型审批授权';
  const enterpriseRoleDescription = '模型使用需申请，获批后在模型运行台使用。需求发布走审批。';
  const modelApplicationKey = 'bdh-model-applications-v1';
  const read = (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const portalAccount = () => window.PortalOrg?.isLogged() ? PortalOrg.current() : null;
  const portalCode = () => accountById(portalAccount()?.id)?.code;
  const portalReadOnly = () => portalCode() === 'R7';
  const backendAccount = () => backendRoles.find(role => role.id === localStorage.getItem(backendSession)) || backendRoles[0];
  const backendCanWrite = () => businessRoles.has(backendAccount().code);

  function upgradeEnterpriseRole(settings) {
    if (!Array.isArray(settings?.roles)) return false;
    const role = settings.roles.find(item => item?.id === enterpriseRoleId);
    if (role?.name !== '企业成员 · 模型直接授权' || role.permissions?.model !== 'direct') return false;
    role.name = enterpriseRoleName;
    if (role.description === '模型直接使用，需求发布走审批。') role.description = enterpriseRoleDescription;
    role.permissions.model = 'review';
    return true;
  }
  function loadSettings() {
    const settings = read(settingsKey);
    if (upgradeEnterpriseRole(settings)) {
      try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch {}
    }
    return settings;
  }

  function isOnlineModelApplication(record) {
    return !!record && record.applicationKind !== 'commercial' &&
      (record.capability === 'model-online-use' || /业务分析与应用|在线使用/.test(record.purpose || ''));
  }
  function modelApplicationState(model, version, account) {
    const applications = read(modelApplicationKey, []);
    if (!Array.isArray(applications)) return null;
    let pending = false;
    for (const record of applications) {
      if (!isOnlineModelApplication(record) || record.applicantId !== account.id ||
          record.name !== model.name || record.version !== version) continue;
      if (['已通过','approved'].includes(record.status)) return 'approved';
      if (['审核中','待审核','待审批','pending'].includes(record.status)) pending = true;
    }
    return pending ? 'pending' : null;
  }

  function matchingPeople(settings, account) {
    return ['heads','members','enterprises'].flatMap(key =>
      (Array.isArray(settings?.[key]) ? settings[key] : []).filter(person => person?.account === account?.login)
    );
  }
  function effectiveRole(settings, account) {
    if (!Array.isArray(settings?.roles) || !account?.login) return null;
    const matches = matchingPeople(settings, account);
    if (matches.length !== 1) return null;
    const person = matches[0];
    let roleId = person.roleId;
    if (!roleId) {
      const org = settings.orgs?.find(item => item.id === person.orgId);
      const platformRoles = new Set((settings.platformRoles || []).map(item => item.id));
      const mappings = new Set((person.platformRoleIds || [])
        .filter(id => platformRoles.has(id))
        .map(id => org?.roleBindings?.[id])
        .filter(Boolean));
      if (mappings.size !== 1) return null;
      [roleId] = mappings;
    }
    return settings.roles.find(role => role.id === roleId) || null;
  }

  function grant(module) {
    const account = portalAccount();
    const code = portalCode();
    if (!account || portalReadOnly()) return 'deny';
    const settings = loadSettings();
    const mode = settings && (settings.previewAccountsVersion || matchingPeople(settings,account).length)
      ? effectiveRole(settings, account)?.permissions?.[module]
      : initial[code]?.[module];
    return modes.has(mode) ? mode : 'deny';
  }

  function connectPortal(org) {
    const db = org.read();
    let changed = false;
    for (const role of roles) {
      const saved = db.accounts.find(account => account.id === role.id);
      if (saved) {
        if (saved.kind !== role.kind) {
          saved.kind = role.kind;
          changed = true;
        }
        if (role.id === 'u-admin' && saved.name === '平台管理员') {
          saved.name = role.name;
          changed = true;
        }
      } else {
        db.accounts.push({
          id:role.id, name:role.name, login:role.login, kind:role.kind,
          orgId:role.orgId || 'org-platform', org:role.org || '平台管理', ownerId:role.ownerId || null,
        });
        changed = true;
      }
    }
    if (changed) localStorage.setItem(org.KEY, JSON.stringify(db));
    const savedSession = localStorage.getItem(org.SESSION);
    if (savedSession && !accountById(savedSession)) {
      const previous = db.accounts.find(account=>account.id===savedSession);
      const representative = previous && roles.find(role=>role.kind===previous.kind);
      if (representative) localStorage.setItem(org.SESSION,representative.id);
      else localStorage.removeItem(org.SESSION);
    }

    const roleLabel = org.roleLabel;
    org.roleLabel = account => accountById(account?.id)?.label || roleLabel(account);
    const myTeams = org.myTeams;
    org.myTeams = () => {
      if (!org.isLogged()) return [];
      const account = org.current();
      const list = myTeams.call(org);
      return account.kind === 'leader' ? list.filter(team => team.ownerId === account.id) :
        account.kind === 'member' ? list : [];
    };
    const canViewTeam = org.canViewTeam;
    const canManageTeam = org.canManageTeam;
    const canViewSpace = org.canViewSpace;
    const canManageSpace = org.canManageSpace;
    const isLeader = org.isLeader;
    org.isLeader = () => org.isLogged() && isLeader();
    org.canViewTeam = id => org.myTeams().some(team => team.id === id) && canViewTeam.call(org,id);
    org.canManageTeam = id => org.isLeader() && canManageTeam.call(org,id);
    org.canViewSpace = id => org.canViewTeam(org.spaceTeam(id)?.id) && canViewSpace.call(org,id);
    org.canManageSpace = id => org.isLeader() && canManageSpace.call(org,id);
    const oldSpaceRole = org.spaceRole;
    org.spaceRole = id => org.canViewSpace(id) ?
      (oldSpaceRole ? oldSpaceRole.call(org,id) : org.canManageSpace(id) ? '负责人' : '成员') : null;
    org.canViewDashboard = () => backendRoles.some(role => role.code === portalCode());
  }

  function seedSettings(settings) {
    const upgraded = upgradeEnterpriseRole(settings);
    if (settings.previewAccountsVersion === 1) return upgraded;
    for (const [key,code,orgId,platformRole,headId] of [
      ['heads','R4','o5','central-head',null],
      ['members','R5','o5','central-member','u-zhang'],
    ]) {
      const role = roles.find(item => item.code === code);
      if (!settings[key].some(item => item.account === role.login)) {
        settings[key].push({
          id:role.id, name:role.name, account:role.login, orgId,
          ...(headId ? {headId} : {}), platformRoleIds:[platformRole],
        });
      }
    }
    const enterprise = settings.enterprises.find(person => person.account === 'chenyu');
    const defaults = settings.orgs.find(item => item.id === enterprise?.orgId)?.roleBindings;
    if (enterprise && !enterprise.roleId && !defaults?.['central-enterprise']) {
      if (!settings.roles.some(role => role.id === enterpriseRoleId)) {
        settings.roles.push({id:enterpriseRoleId,name:enterpriseRoleName,description:enterpriseRoleDescription,permissions:{...initial.R6}});
      }
      enterprise.roleId = enterpriseRoleId;
    }
    settings.previewAccountsVersion = 1;
    return true;
  }

  function mountPicker(side, selectAccount) {
    if (!document.body) return;
    const portal = side === 'portal';
    const id = portal ? 'portalPreview' : 'backendPreview';
    let picker = document.getElementById(id);
    if (!picker) {
      picker = document.createElement('aside');
      picker.id = id;
      picker.className = 'prototype-account-picker';
      document.body.append(picker);
    }
    if (!document.getElementById('prototypeAccountStyle')) {
      const style = document.createElement('style');
      style.id = 'prototypeAccountStyle';
      style.textContent = '.prototype-account-picker{position:fixed;left:16px;bottom:16px;z-index:900;display:flex;align-items:center;padding:8px 11px;border:1px solid #c9ddd3;border-radius:8px;background:#fff;color:#24584b;box-shadow:0 3px 18px #123c2720;font:12px/1.5 "Microsoft YaHei",sans-serif}.prototype-account-picker label{display:flex;align-items:center;gap:8px}.prototype-account-picker select{max-width:220px;height:30px;padding:0 6px;border:1px solid #c9ddd3;border-radius:4px;background:white;color:#24584b;font:inherit}.pc-demo,[data-role-hidden],[data-portal-board][hidden],[data-portal-board-area][hidden],#portalBoardDenied[hidden]{display:none!important}#portalBoardDenied{max-width:780px;margin:70px auto;padding:48px 24px;text-align:center;background:#fff;border:1px solid #dce7df;border-radius:8px}body.fullscreen .prototype-account-picker{display:none}@media print{.prototype-account-picker{display:none}}';
      document.head.append(style);
    }
    const selectId = portal ? 'otPreviewAccount' : 'backendPreviewAccount';
    let select = document.getElementById(selectId);
    if (!select) {
      const label = document.createElement('label');
      label.htmlFor = selectId;
      label.textContent = '切换演示账号';
      select = document.createElement('select');
      select.id = selectId;
      label.append(select);
      picker.replaceChildren(label);
    }
    const choices = (portal ? roles : backendRoles).map(role => {
      const name = portal ? window.PortalOrg?.account(role.id)?.name : role.name;
      return [name && role.label !== name ? role.label+' · '+name : role.label,role.id];
    });
    if (portal) choices.unshift(['游客（未登录）','']);
    const signature = JSON.stringify(choices);
    if (select.dataset.roles !== signature) {
      select.replaceChildren(...choices.map(([label,id])=>new Option(label,id)));
      select.dataset.roles = signature;
    }
    select.value = portal ? portalAccount()?.id || '' : backendAccount().id;
    select.onchange = () => selectAccount(select.value);
  }

  function mountPortalPicker() {
    const org = window.PortalOrg;
    if (!org) return;
    mountPicker('portal', id => {
      if (id) org.select(id);
      else org.signOut();
      const file = decodeURIComponent(location.pathname.split('/').pop());
      if (!id && file.startsWith('个人中心')) location.replace('index.html');
      else location.reload();
    });
  }

  const hide = (element, hidden) => {
    if (!element) return;
    if (hidden) element.setAttribute('data-role-hidden','');
    else element.removeAttribute('data-role-hidden');
  };
  loadSettings();
  window.PrototypeAccounts = {
    roles, backendRoles, settingsKey, backendSession, backendAccount, backendCanWrite,
    portalAccount, portalCode, portalReadOnly, grant, hide, connectPortal, seedSettings,
    effectiveRole, mountPicker, mountPortalPicker, modelApplicationKey, isOnlineModelApplication, modelApplicationState,
  };
})();

