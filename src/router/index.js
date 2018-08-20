import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {path: '/login', name: 'vue_login', component: _import("login/index"),view: "login/index", hidden: true},
  {path: '/authredirect', component: _import("login/authredirect"),view: "login/authredirect", hidden: true},
  {path: '/404', component: _import("errorPage/404"),view: "errorPage/404", hidden: true},
  {path: '/empty', component: _import("layout/empty"),view: "layout/empty", hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'index',
    name: 'vue_dashboard',
    meta: {title: '首页', icon: 'dashboard', noCache: true},
    children: [{
      path: 'index',
      component: _import("dashboard/index"),view: "dashboard/index",
      name: 'vue_dashboard_index',
      meta: {title: '首页', icon: 'dashboard', noCache: true}
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/order',
    component: Layout,
    redirect: 'my_order',
    name: 'vue_order',
    meta: {title: '订单管理', icon: 'excel', role: ['merchant', 'agent', 'admin']},
    children: [
      //  agent user只能查询自己的订单
      {path: 'myorder', component: _import("order/mylist"),view: "order/mylist", name: 'vue_my_order', meta: {title: '我的收款', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      //   agent user只能查询自己的订单
      {path: 'my_remit', component: _import("remit/mylist"),view: "remit/mylist", name: 'vue_my_remit', meta: {title: '我的结算', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      {path: 'merchant_check_remit', component: _import("remit/merchant_check_list"),view: "remit/merchant_check_list", name: 'vue_merchant_check_remit', meta: {title: '结算审核', icon: 'excel', role: ['merchant'], noCache: true}},
      //  通过admin登陆可以查询全部用户的订单
      {path: 'order', component: _import("order/list"),view: "order/list", name: 'vue_admin_order_list', meta: {title: '收款订单', icon: 'excel', role: ['admin'], noCache: true}},
      //  通过admin登陆可以查询全部用户的订单
      {path: 'remit', component: _import("remit/list"),view: "remit/list", name: 'vue_admin_remit_list', meta: {title: '结算订单', icon: 'excel', role: ['admin'], noCache: true}},
    ]
  },
  {
    path: '/financial',
    component: Layout,
    redirect: 'list',
    name: 'vue_financial',
    meta: {title: '我的订单', icon: 'excel', role: ['merchant', 'agent']},
    children: [
      //  收支明细
      {path: 'list', component: _import("financial/list"),view: "financial/list", name: 'vue_financial_list', meta: {title: '收支明细', icon: 'excel', role: ['admin'], noCache: true}},
        {path: 'my_list', component: _import("financial/mylist"),view: "financial/mylist", name: 'vue_financial_my_list', meta: {title: '我的收支明细', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
    ]
  },
  {
    path: '/channel',
    component: Layout,
    redirect: 'list',
    name: 'vue_channel',

    meta: {title: '渠道管理', icon: 'excel', role: ['admin']},
    children: [
      //  只能有管理人员管理渠道
      {path: 'list', component: _import("admin/channel/list"),view: "admin/channel/list", name: 'vue_channel_list', meta: {title: '渠道管理', icon: 'excel', role: ['admin'], noCache: true}},
      // //  只能管理人员管理渠道号
      {path: 'account_list', component: _import("admin/channel/account"),view: "admin/channel/account", name: 'vue_channel_account', meta: {title: '渠道号管理', icon: 'excel', role: ['admin'], noCache: true}},
      //  todo
      {path: 'balance', component: _import("admin/channel/balance"),view: "admin/channel/balance", name: 'vue_channel_balance', meta: {title: '渠道号余额', icon: 'excel', role: ['admin'], noCache: true}},
    ]
  },
  {
    path: '/add_remit',
    component: Layout,
    redirect: 'list',
    name: 'vue_single',
    meta: {title: '充提款', icon: 'excel', role: ['merchant', 'agent', 'admin']},
    children: [
      //商户、代理都可以进行逐笔录入
      {path: 'single', component: _import("remit/singleremit"),view: "remit/singleremit", name: 'vue_add_remit_single', meta: {title: '逐笔提款', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      //  商户 代理都可以批量提交
      {path: 'batch', component: _import("remit/batchremit"),view: "remit/batchremit", name: 'vue_add_remit_batch', meta: {title: '批量提款', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      //  商户 代理都可以在线充值
      {path: 'recharge', component: _import("order/add"),view: "order/add", name: 'vue_add_remit_recharge', meta: {title: '在线充值', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
    ]
  },
  {
    path: '/trade_statistic',
    component: Layout,
    redirect: 'index',
    name: 'vue_trade_statistic',

    meta: {title: '统计报表', icon: 'excel', role: ['merchant', 'agent', 'admin']},
    children: [
      //  代理交易(收款)明细 根据收款订单表统计所有代理的交易成功金额和笔数，按日统计，每日凌晨进行生成前日报表数据 管理平台使用
      {path: 'index', component: _import("admin/report/agent_daily_recharge"),view: "admin/report/agent_daily_recharge", name: 'vue_trade_statistic_index', meta: {title: '代理交易(收款)明细(每天)', icon: 'excel', role: [ 'admin'], noCache: true}},

      // 收支统计管理-管理平台使用 根据帐变表数据对代理、商户的收入支出类型进行统计，按日统计，每日凌晨进行生成前日报表数据 管理平台使用
      {path: 'finacial', component: _import("report/daily_financial"),view: "report/daily_financial", name: 'vue_trade_statistic_finacial', meta: {title: '收支统计管理(每天)', icon: 'excel', role: ['admin'], noCache: true}},

      //商户交易量统计  根据商户统计各自商户的收款总金额和笔数 代理使用 实时
      {path: 'agent', component: _import("account/merchant/account_recharge_sum"),view: "account/merchant/account_recharge_sum", name: 'vue_agent_trade_statistic', meta: {title: '代理交易明细', icon: 'excel', role: ['agent'], noCache: true}},

      // 渠道号交易统计 根据各渠道号的支付类型进行统计各自类型的交易量 管理平台使用 实时
      {path: 'channel_account', component: _import("admin/report/channel_recharge"),view: "admin/report/channel_recharge", name: 'vue_channel_account_trade_statistic', meta: {title: '渠道号交易统计(实时)', icon: 'excel', role: ['admin'], noCache: true}},

      //渠道号利润  分别计算收款、结算利润 按每个渠道号每日统计 每日凌晨进行生成前日报表数据 管理平台使用
      {path: 'profit', component: _import("admin/report/channel_daily_profit"),view: "admin/report/channel_daily_profit", name: 'vue_channel_account_trade_profit', meta: {title: '渠道号利润(每天)', icon: 'excel', role: ['admin'], noCache: true}},
      //渠道号对账 每日凌晨进行生成前日报表数据
      {path: 'reconciliations', component: _import("admin/report/channel_daily_reconciliations"),view: "admin/report/channel_daily_reconciliations", name: 'vue_channel_daily_reconciliations', meta: {title: '渠道号对账(每天)', icon: 'excel', role: ['admin'], noCache: true}},

      // 统计充值数据汇总 todo 需求搞不清楚
      // {path: 'index', component: _import("layout/empty"),view: "layout/empty", name: 'vue_merchant_recharge_index', meta: {title: '充值汇总', icon: 'excel', role: ['merchant','agent'], noCache: true}},

    ]
  },

  {
    path: '/account',
    component: Layout,
    redirect: 'index',
    name: 'vue_account',

    meta: {title: '账户管理', icon: 'excel', role: ['merchant', 'agent', 'admin']},
    children: [
      //管理各自账号的子账号 只有主账号才有权限管理
      {path: 'index', component: _import("account/child/childlist"),view: "account/child/childlist", name: 'vue_account_index', meta: {title: '子账号管理', icon: 'excel', role: ['merchant', 'agent', 'admin'], noCache: true}},
      //   暂时不做
      // {path: 'bind_bank', component: _import("layout/empty"),view: "layout/empty", name: 'vue_bind_bank', meta: {title: '绑定银行卡-暂不开发', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      // 用于api接口使用
      {path: 'merchant_key', component: _import("layout/empty"),view: "layout/empty", name: 'vue_merchant_key', meta: {title: '商户Key值', icon: 'excel', role: ['merchant', 'agent'], noCache: true},hidden:true},
      // google令牌绑定
      {path: 'th2fa', component: _import("layout/empty"),view: "layout/empty", name: 'vue_th2fa', meta: {title: '安全令牌', icon: 'excel', role: ['merchant', 'agent', 'admin'], noCache: true},hidden:true},
    ]
  },
  // 管理员使用
  {
    path: '/merchant',
    component: Layout,
    redirect: 'list',
    name: 'vue_merchant',
    meta: {title: '商户管理', icon: 'excel', role: ['admin']},
    children: [
      //   添加商户功能入口需要移到商户管理页面
      {path: 'merchant_add', component: _import("admin/user/edit"),view: "admin/user/edit", name: 'vue_merchant_add', meta: {title: '新增商户', icon: 'excel', role: ['admin'], noCache: true},hidden:true},
      {path: 'list', component: _import("admin/user/list"),view: "admin/user/list", name: 'vue_merchant_list', meta: {title: '商户管理', icon: 'excel', role: ['admin'], noCache: true}},
      {path: 'merchant_detail', component: _import("admin/user/detail"),view: "admin/user/detail", name: 'vue_merchant_detail', meta: {title: '商户详情', icon: 'excel', role: ['admin'], noCache: false},hidden:true},

    ]
  },
  // 管理员使用
  {
    path: '/admin',
    component: Layout,
    redirect: 'track',
    name: 'vue_risk',
    meta: {title: '风控管理', icon: 'excel', role: ['admin']},
    children: [
      //   调单记录 对充值和出款的订单相关问题进行跟踪记录
      {path: 'track', component: _import("admin/track/list"),view: "admin/track/list", name: 'vue_track_add', meta: {title: '调单记录', icon: 'excel', role: ['admin'], noCache: true}},
      //操作记录
      {path: 'operation', component: _import("admin/log/userLog"),view: "admin/log/userLog", name: 'vue_operation', meta: {title: '操作记录', icon: 'excel', role: ['admin'], noCache: true}},
    ]
  },
  // 代理使用
  {
    path: '/agent',
    component: Layout,
    redirect: 'sub_account_list',
    name: 'vue_agent',
    meta: {title: '下级管理', icon: 'excel', role: ['agent']},
    children: [
      //   添加商户功能入口需要移到商户管理页面 没法添加收付款的渠道等功能
      {path: 'sub_account_add', component: _import("account/merchant/account_add"),view: "account/merchant/account_add", name: 'vue_sub_account_add', meta: {title: '新增商户', icon: 'excel', role: ['agent'], noCache: true},hidden:true},
      // 和管理员的功能相似，没有切换渠道，没法编辑收付款的渠道等功能
      {path: 'sub_account_list', component: _import("account/merchant/account_list"),view: "account/merchant/account_list", name: 'vue_sub_account_list', meta: {title: '下级管理', icon: 'excel', role: ['agent'], noCache: true}},
      // 只能是代理查询下级或下下级的收款订单
      {path: 'sub_account_orders', component: _import("account/merchant/account_order"),view: "account/merchant/account_order", name: 'vue_sub_account_orders', meta: {title: '下级收款订单', icon: 'excel', role: ['agent'], noCache: true}},
      // 只能是代理查询下级或下下级的结算订单
      {path: 'sub_account_remits', component: _import("account/merchant/account_remit"),view: "account/merchant/account_remit", name: 'vue_sub_account_remits', meta: {title: '下级结算订单', icon: 'excel', role: ['agent'], noCache: true}},
      // 只能是代理查询下级或下下级的收支明细
      {path: 'sub_account_financial', component: _import("account/merchant/account_financial"),view: "account/merchant/account_financial", name: 'vue_sub_account_financial', meta: {title: '下级收支明细', icon: 'excel', role: ['agent'], noCache: true}},
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: 'list',
    name: 'vue_system',

    meta: {title: '系统管理', icon: 'excel', role: ['merchant', 'agent', 'admin']},
    children: [

      // 管理系统权限项
      {path: 'permissions', component: _import("admin/permission/list"),view: "admin/permission/list", name: 'vue_auth_permissions', meta: {title: '资源管理', icon: 'excel', role: ['admin'], noCache: true}},
      //管理角色
      {path: 'roles', component: _import("admin/role/list"),view: "admin/role/list", name: 'vue_auth_roles', meta: {title: '角色管理', icon: 'excel', role: ['admin'], noCache: true}},
      {path: 'assign', component: _import("admin/assign/assign"),view: "admin/assign/assign", name: 'vue_auth_assign', meta: {title: '角色授权', icon: 'excel', role: ['admin'], noCache: true},hidden: true},
      // 系统配置项的管理 当前已知 api止付配置
      {path: 'setting', component: _import("admin/siteConfig/list"),view: "admin/siteConfig/list", name: 'vue_setting', meta: {title: '系统配置', icon: 'excel', role: ['admin'], noCache: true}},
      // 系统公告
      {path: 'notice', component: _import("admin/system/notice"),view: "system/notice", name: 'vue_notice', meta: {title: '系统公告', icon: 'excel', role: ['admin'], noCache: true}},
      {path: 'api_log', component: _import("admin/log/apiLog"),view: "admin/log/apiLog", name: 'vue_api_log', meta: {title: '接口日志', icon: 'excel', role: ['admin'], noCache: true}},
      {path: 'system_log', component: _import("admin/log/systemLog"),view: "admin/log/systemLog", name: 'vue_system_log', meta: {title: '系统错误日志', icon: 'excel', role: ['admin'], noCache: true}},
    ]

},
  {
    path: '/amount_limitation',
    component: Layout,
    redirect: 'list',
    name: 'vue_amount_limitation',

    meta: {title: '其他', icon: 'excel', role: ['merchant', 'agent']},
    children: [
      // 静态页面
      {path: 'limit', component: _import("system/bankQuota"),view: "system/bankQuota", name: 'vue_amount_limitation_index', meta: {title: '限额对照表', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
      // 接口文档和SDK
      {path: 'index', component: _import("system/document"),view: "system/document", name: 'vue_document', meta: {title: '接口文档', icon: 'excel', role: ['merchant', 'agent'], noCache: true}},
    ]
  },


  {path: '*', redirect: '/404', hidden: true,meta: {title: '404'}}
]