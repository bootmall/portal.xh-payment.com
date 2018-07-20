import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {

  if (route.name) {
    // console.log('store hasPermission',roles,route,route.path,route.name,route.meta.role)
    if(!roles) return false
    return roles.some(role => route.name == role)
  } else {
    // console.log('store hasPermission can not find meta',route)
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    let hasPer = hasPermission(roles, route)
    // console.log('filterAsyncRouter',route.name,hasPer)
    if (hasPer) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      // console.log('filterAsyncRouter ok',roles,route)
      return true
    }else{
      // console.log('filterAsyncRouter fail....',roles,route.name)
    }
    return false
  })

  // console.log('filterAsyncRouter accessedRouters',accessedRouters)
  return accessedRouters
}

function getAsyncRouterName(asyncRouterMap) {
  asyncRouterMap = constantRouterMap.concat(asyncRouterMap)
  for(let i=0;i<asyncRouterMap.length;i++){
    // console.log(asyncRouterMap[i])
    let route = asyncRouterMap[i]
    if(typeof route.meta=='undefined') route.meta = {}
    // console.log(JSON.stringify([route.name,route.path,route.meta.title,route.view,[],route.meta.role],[])+',')
    if(typeof asyncRouterMap[i].children!='undefined'){
      for(let k=0;k<asyncRouterMap[i].children.length;k++){
        let subRoute = asyncRouterMap[i].children[k]
        subRoute.path = route.path+'/'+subRoute.path
        // console.log(JSON.stringify([subRoute.name,subRoute.path,subRoute.meta.title,subRoute.view,[],subRoute.meta.role,route.name])+',')
      }
    }
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      // console.log('GenerateRoutes',data)
      return new Promise(resolve => {
        const { roles } = data
        // let accessedRouters
        // if (roles && roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        let accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // let accessedRouters = asyncRouterMap
        // }


        // getAsyncRouterName(asyncRouterMap)
        // console.log('got accessedRouters, SET_ROUTERS',accessedRouters);
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
