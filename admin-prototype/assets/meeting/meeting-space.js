/* meeting-space.js —— 已停用（20261014）

   原实现：往「后台-科研空间管理.html」底部注入「科研空间申请与开发环境」面板
   （科研空间/团队 · 关联模型 · 开发环境 · 计算配置 · 状态 · 查看/审批）。
   该面板属需求发散产物，与本页定位（实例运营台账）不符，已按用户要求移除。

   为什么保留文件（而不是删掉）：
     本包 36 个页面都写了 <script src="assets/meeting/meeting-space.js">，
     删文件会导致全部页面 404。改为整段短路 = 面板不再出现、页面不再报错。

   为什么可以直接停用：
     · 审批中心有自有实现 approval-center.js，已提供 viewSpace / reviewSpace /
       refreshSpaces，并接管审批中心页面，与本文件无关；
     · 科研空间详情 / 课题工作台的跳转走 project-workbench-links.js + project-workbench.js，
       自带 viewSpace，不依赖本文件；
     · 本文件在其它 34 个页面本就因 F 不匹配而首行 return，从无副作用。

   如后续确定「科研空间申请」要在后台落地，正确做法是新建独立模块页，
   不要把申请流塞进实例运营台账页。届时本文件可连同 36 处 script 引用一并清理。
*/