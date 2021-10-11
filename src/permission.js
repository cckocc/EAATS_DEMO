import router, { resetRouter } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import i18n from '@/lang'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [
  '/login',
  '/auth-redirect',
  '/home',
  '/register',
  '/401',
  '/404',
  '/forget',
  '/reset-password',
  '/standard-more/standard-more',
  '/notice/index',
  '/notice/detail',
  '/privacy-policy',
  '/inside',
  '/inside/',
  '/service-support/common-problem',
  '/service-support/contact-way',
  '/service-support/online-service',
  '/download/protocol-standard',
  '/service-support/jgIsv_kanban',
  '/service-support/jgIsv_certificate_manage'
] // 'no redirect whitelist

const sqlUserList = ['zhzy01', 'youzhou', 'zhouxinxu']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(i18n.t(to.meta.title))

  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log(hasToken,'-222-');

  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasRoles = store.getters.name && store.getters.userInfo.loginName
      if (hasRoles) {
        if (to.name === 'sql-execute' && !sqlUserList.includes(store.getters.name)) {
          next({ path: '/' })
          NProgress.done()
        } else {
          next()
        }
      } else {
        try {
          resetRouter()
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          // console.log('打印roles', roles)

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    const isVisitor = store.getters.isVisitor
    // console.log(isVisitor,33333);
    if (isVisitor) {
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        // console.log('to.path: ', to.path)
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        // next(`/login?redirect=${to.path}`)
        console.log('去首页了 ')
        next('/home')
        NProgress.done()
      }
    } else {
      try {
        resetRouter()
        const roles = ['visitors']
        const routers = store.getters.permission_routes
        // console.log('啦啦啦： ', roles, routers, to)
        const accessRoutes = await store.dispatch(
          'permission/generateVisitorRoutes',
          roles
        )
        router.addRoutes(accessRoutes)
        await store.dispatch('user/setIsVisitor', true)
        next({ ...to, replace: true })
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next({ path: '/' })
        NProgress.done()
      }
    }
    // const roles = ['visitors']
    // const routers = store.getters.permission_routes
    // console.log('啦啦啦： ', roles, routers, to)
    // const accessRoutes = await store.dispatch(
    //   'permission/generateVisitorRoutes',
    //   roles
    // )
    // router.addRoutes(accessRoutes)
    // if (whiteList.indexOf(to.path) !== -1) {
    //   // in the free login whitelist, go directly
    //   console.log('to.path: ', to.path)
    //   next()
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   // next(`/login?redirect=${to.path}`)
    //   console.log('去首页了 ')
    //   next('/home')
    //   NProgress.done()
    // }
    // try {
    //   const roles = ['visitors']
    //   const routers = store.getters.permission_routes
    //   console.log('啦啦啦： ', roles, routers, to)
    //   if (to.path === '/inside') {
    //     const accessRoutes = await store.dispatch(
    //       'permission/generateVisitorRoutes',
    //       roles
    //     )
    //     router.addRoutes(accessRoutes)
    //     next({ path: '/inside', query: { param: to.query.param }})
    //     // NProgress.done()
    //   } else if (routers.length === 0 && to.path != '/inside') {
    //     const accessRoutes = await store.dispatch(
    //       'permission/generateVisitorRoutes',
    //       roles
    //     )
    //     router.addRoutes(accessRoutes)
    //     next({ ...to, replace: true })
    //   } else {
    //     next()
    //     NProgress.done()
    //   }
    // } catch (error) {
    //   console.log('错误了： ', error)
    //   next('/home')
    //   NProgress.done()
    // }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
