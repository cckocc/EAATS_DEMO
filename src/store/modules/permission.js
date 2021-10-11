import { asyncRoutes, constantRoutes } from '@/router'
import visitorRouters from '@/router/modules/visitor'
import Cookies from 'js-cookie'
import i18n from '@/lang'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  const language = Cookies.get('language')
  const isEn = language === 'en'
  if (route.meta) {
    const isPermission = !route.meta.roles || roles.some(role => route.meta.roles.includes(role))
    const finalPermission = isEn ? (!route.meta.enHidden && isPermission) : isPermission
    return finalPermission
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    console.log('路由：' + routes)
    // state.addRoutes = routes
    routes = routes.map(first => {
      if (first.meta && first.meta.title) {
        first.meta.title = i18n.t(first.meta.title)
      }
      if (first.children) {
        first.children.map(second => {
          if (second.meta && second.meta.title) {
            second.meta.title = i18n.t(second.meta.title)
          }
          return second
        })
        return first
      }
    })
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateVisitorRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // const navRouters = visitorRouters
      const accessedRoutes = filterAsyncRoutes(visitorRouters, roles)
      // commit('SET_ROUTES', navRouters)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
