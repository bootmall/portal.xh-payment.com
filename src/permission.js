import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import common from '@/utils/common' // 验权
import { Message } from 'element-ui'
NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge
function hasPermission(roles, permissionRoles) {
  // console.log('src hasPermission ',roles)
  if(!roles) return false
  if (roles && roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login','logout', '/authredirect', '/register', '/resetPassword', '/401', '/404']// 不重定向白名单
const whiteListRouteName = ['login','logout', 'authredirect', 'register', 'resetPassword']// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (common.getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    } else {
      // console.log('store.getters.permissions',store.getters.user_permissions,store.getters.roles,store.getters.user,common.getPermissions())
      if (typeof store.getters.user_permissions !== 'undefined' && store.getters.user_permissions.length === 0) { // 判断当前用户是否已拉取完user_info信息
        console.log('need GetUserInfo');
        store.dispatch('GetUserInfo').then(
            res => { // 拉取user_info
              const roles = res.permissions
              store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
                if(store.getters.addRouters.length>0){
                  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                  next({ ...to }) // hack方法 确保addRoutes已完成
                }else{
                  store.dispatch('FedLogOut').then(() => {
                    Message.error('权限验证失败,请重新登录:1')
                    next({ path: '/login' })
                  })
                }

              })
            },
            res => { // reject
              console.log('profile err',res);
                // Message.error('验证失败,请重新登录:2')
              store.dispatch('FedLogOut').then(() => {
                let errMsg = '权限验证失败'
                if(res.message) errMsg=res.message
                Message.error(errMsg)
                 next({ path: '/login' })
              })
            }
        ).catch((err) => {
          consoel.log('GetUserInfo err and FedLogOut',res,err);
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录:2')
            // next({ path: '/login' })
          })
        })
      }
      else {
        // console.log('local role check,','to:',to, 'need role: ',to.meta.role,'has roles:',store.getters.roles);
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.user_permissions, to.meta.name)
        ) {
          // console.log('has role data and to');
          next()//
        } else {
          // console.log('no role and go 401');
          next({ path: '/401', query: { noGoBack: true }})
          //NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
        // 可删
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1
      || typeof to.name != 'undefined' && whiteListRouteName.indexOf(to.name) !== -1

    ) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
