import i18n from '@/lang'
import Vue from 'vue'
import Router from 'vue-router'
// import rolesOption from './roles'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: () => import('@/views/add-notice/privacy-policy'),
    meta: {
      title: i18n.t('route.privacyPolicy')
    }
  },
  {
    path: '/service-online-print',
    name: 'serviceOnlinePrint',
    component: () => import('@/views/interface-service/my-service/components/serviceOnlinePrint'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: i18n.t('route.home'), hiddenBread: true }
      },
      {
        path: 'login',
        component: () => import('@/views/login/index'),
        name: 'login',
        hidden: true,
        meta: { title: i18n.t('route.login'), hiddenBread: true }
      },
      {
        path: 'register',
        component: () => import('@/views/register/index'),
        name: 'register',
        hidden: true,
        meta: { title: i18n.t('route.register'), hiddenBread: true }
      },
      {
        path: 'forget',
        component: () => import('@/views/forget/index'),
        name: 'forget',
        hidden: true,
        meta: { title: i18n.t('route.retrievePassword') }
      },
      {
        path: 'reset-password',
        component: () => import('@/views/reset-password/index'),
        name: 'reset-password',
        hidden: true,
        meta: { title: i18n.t('route.modifyPassword') }
      }
    ]
  },
  {
    path: '/inside',
    component: Layout,
    redirect: '/inside',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/insideLink/index'),
        name: 'insideLink',
        meta: { title: '跳转' }
      },
      {
        path: 'inside-success',
        component: () => import('@/views/insideLink/success'),
        name: 'inside-success',
        meta: { title: '成功' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/service-manage',
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    meta: {
      title: '',
      notAllowed: true,
      roles: ['COMMON_serviceApplication']
    },
    children: [
      {
        path: 'network-opening-list',
        component: () => import('@/views/service-manage/network-opening-list/index'),
        name: 'NetworkOpeningList',
        hidden: true,
        meta: { title: i18n.t('enum.serveiceOptions.networkOpeningApply'), roles: ['COMMON_serviceApplication_open'] }
      },
      {
        path: 'interface-online-list',
        component: () => import('@/views/service-manage/interface-online-list/index'),
        name: 'InterfaceOnlineList',
        hidden: true,
        meta: { title: i18n.t('enum.serveiceOptions.interfaceOnline'), roles: ['COMMON_serviceApplication_online'] }
      },
      {
        path: 'acceptance-test-list',
        component: () => import('@/views/service-manage/acceptance-test-list/index'),
        name: 'AcceptanceTestList',
        hidden: true,
        meta: { title: i18n.t('enum.serveiceOptions.acceptanceTest'), roles: ['COMMON_serviceApplication_test'] }
      },
      {
        path: 'permission-change-list',
        component: () => import('@/views/service-manage/permission-change-list/index'),
        name: 'PermissionChangeList',
        hidden: true,
        meta: { title: i18n.t('enum.serveiceOptions.permissionChange'), roles: ['COMMON_serviceApplication_termination'] }
      },
      {
        path: 'service-opening',
        component: () => import('@/views/interface-service/service-opening'),
        name: 'ServiceOpening',
        meta: { title: i18n.t('enum.serveiceOptions.serviceOpening'), roles: ['COMMON_serviceApplication_open'] }
      },
      {
        path: 'acceptance-test',
        component: () => import('@/views/interface-service/acceptance-test/index'),
        name: 'AcceptanceTest',
        meta: { title: i18n.t('enum.serveiceOptions.acceptanceTest'), roles: ['COMMON_serviceApplication_test'] }
      },
      {
        path: 'service-online',
        component: () => import('@/views/interface-service/service-online'),
        name: 'ServiceOnline',
        meta: { title: i18n.t('enum.serveiceOptions.interfaceOnline'), roles: ['COMMON_serviceApplication_online'] }
      },
      {
        path: 'permission-change',
        component: () => import('@/views/interface-service/permission-change'),
        name: 'PermissionChange',
        meta: { title: i18n.t('enum.serveiceOptions.permissionChange'), roles: ['COMMON_serviceApplication_termination'] }
      }
    ]
  },
  {
    path: '/service-application',
    component: Layout,
    redirect: '/service-application/service-opening',
    meta: { title: i18n.t('route.interfaceService.index'), roles: ['COMMON_serviceApplication'] },
    visitor: false,
    alwaysShow: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/service-manage/index'),
        name: 'ServiceManage',
        meta: { title: i18n.t('route.interfaceService.serviceApply'), roles: ['COMMON_serviceApplication'] }
      },
      {
        path: 'my-service',
        component: () => import('@/views/interface-service/my-service'),
        name: 'MyService',
        meta: {
          title: i18n.t('route.interfaceService.myService'),
          roles: ['COMMON_serviceApplication_my_service']
        }
      }
    ]
  },
  {
    path: '/service-support',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '接口支持',
      notAllowed: true,
      enHidden: true,
      roles: ['COMMON_serviceSupport']
    },
    children: [
      // {
      //   path: 'common-problem',
      //   component: () =>
      //     import('@/views/interface-support/common-problem/index'),
      //   name: 'CommonProblem',
      //   meta: {
      //     title: '常见问题',
      //     roles: ['COMMON_serviceSupport_common_problem']
      //   }
      // },
      /* {
        path: 'initiate-service-support',
        component: () => import('@/views/interface-support/initiate-service-support/index'),
        name: 'IitiateServiceSupport',
        meta: { title: '发起服务支持' /!* notAllowed: true  roles: ['AGENCY_serviceSupport_common_problem'] *!/ }
      },
      {
        path: 'my-service-support',
        component: () => import('@/views/interface-support/my-service-support/index'),
        name: 'MyServiceSupport',
        meta: { title: '我的服务支持' /!* notAllowed: true  roles: ['AGENCY_serviceSupport_common_problem'] *!/ }
      },*/
      {
        path: 'contact-way',
        component: () => import('@/views/interface-support/contact-way/index'),
        name: 'contact-way',
        meta: {
          title: '业务概览',
          // notAllowed: true,
          roles: ['COMMON_serviceSupport_contact_information']
        }
      },
      // {
      //   path: 'online-service',
      //   component: () => import('@/views/interface-support/online-service/index'),
      //   name: 'online-service',
      //   meta: {
      //     title: '在线客服',
      //     // notAllowed: true,
      //     roles: ['COMMON_serviceSupport_online_service']
      //   }
      // },

      // 2.1.2版本isv模块菜单隐藏
      {
        path: 'jgIsv_kanban',
        component: () => import('@/views/isv-management/jgIsv_kanban/index'),
        name: 'JgIsvKanban',
        meta: {
          title: 'ISV看板'
          // notAllowed: true
          // roles: ['GRIP_MENU_ISV_MANGER_CONFIG']
        }
      }
      // {
      //   path: '/jgIsv_manage/jgIsv_certificate_manage',
      //   component: () => import('@/views/isv-management/jgIsv_manage/jgIsv_certificate_manage'),
      //   name: 'JgIsvCertificateManage',
      //   meta: {
      //     title: 'ISV证书查询'
      //     // notAllowed: true
      //     // roles: ['GRIP_MENU_ISV_CERTIS']
      //   }
      // }
    ]
  },
  {
    path: '/download',
    component: Layout,
    alwaysShow: true,
    redirect: 'noRedirect',
    meta: {
      title: '接口资源',
      notAllowed: true,
      enHidden: true,
      roles: ['COMMON_serviceResource']
    },
    children: [
      // {
      //   path: 'development-guidance',
      //   component: () => import('@/views/download/development-guidance/index'),
      //   name: 'GuidanceDocument',
      //   meta: {
      //     title: '开发指引',
      //     roles: ['COMMON_serviceResource_development_guide']
      //   }
      // },
      {
        path: 'protocol-standard',
        component: () => import('@/views/download/protocol-standard/index'),
        name: 'ProtocolStandard',
        meta: {
          title: '协议标准',
          roles: ['COMMON_serviceResource_protocol_standard']
        }
      },
      {
        path: 'resources-download',
        component: () => import('@/views/download/resources-download/index'),
        name: 'ResourcesDownload',
        meta: {
          title: '资源下载',
          roles: ['COMMON_serviceResource_download']
        }
      },
      {
        clickType: 1,
        path: 'development-tutorials',
        name: 'DevelopmentTutorials',
        meta: {
          title: '指引查看',
          roles: ['COMMON_serviceResource_guide_look']
        }
      },
      {
        clickType: 2,
        path: 'tutorials-download',
        name: 'TutorialsDownload',
        meta: {
          title: '指引下载',
          roles: ['COMMON_serviceResource_guide_download']
        }
      }
    ]
  },
  {
    path: '/standard-more',
    component: Layout,
    redirect: '/standard-more/standard-more',
    hidden: true,
    // meta: {
    //   title: '标准与规范',
    //   notAllowed: true
    // },
    children: [
      {
        path: 'standard-more',
        component: () => import('@/views/notice/standard-more'),
        name: 'standardMore',
        meta: { title: i18n.t('home.standardsAndSpecifications') }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      notAllowed: true,
      roles: ['COMMON_noticeMgt']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/notice/index'),
        name: 'notice',
        meta: { title: i18n.t('route.notice.index'), roles: ['COMMON_noticeMgt'] }
      },
      {
        path: 'detail',
        hidden: true,
        component: () => import('@/views/singleArticle/index'),
        name: 'singleArticle',
        meta: { title: i18n.t('route.notice.articleList') }
      }
    ]
  },
  // {
  //   path: '/field-management-copy',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   alwaysShow: true,
  //   visitor: false,
  //   meta: { title: '场务管理', roles: ['GRIP_gripMgt'] },
  //   children: [
  //     {
  //       path: 'menu-config',
  //       component: () => import('@/views/menu-config/index'),
  //       name: 'MenuConfig',
  //       meta: {
  //         title: '验收资源配置',
  //         roles: ['GRIP_MENU_ACCEPTANCECONF']
  //       }
  //     },
  //     {
  //       path: 'email-notification',
  //       component: () => import('@/views/email-notification/index'),
  //       name: 'EmailNotification',
  //       meta: {
  //         title: '邮件通知',
  //         roles: ['ssss']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/field-management',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    visitor: false,
    meta: { title: '场务管理', roles: ['GRIP_gripMgt'] },
    children: [
      {
        path: 'grip-org-manage',
        component: () => import('@/views/grip-manage/org-manage/index.vue'),
        name: 'GripOrgManage',
        meta: {
          title: '机构管理',
          roles: ['GRIP_agencyMgt']
        }
      },
      {
        path: 'trade-member-manage',
        component: () => import('@/views/add-notice/trade-member-manage'),
        name: 'TradeMemberManage',
        meta: {
          title: '场务用户管理',
          roles: ['GRIP_gripMgtUser_1']
        }
      },
      {
        path: 'process-view',
        component: () => import('@/views/process-view/index'),
        name: 'ProcessView',
        meta: { title: '流程查看', roles: ['GRIP_processView'] }
      },
      {
        path: 'announcement',
        component: () => import('@/views/add-notice/index'),
        name: 'Announcement',
        meta: {
          title: '通知公告',
          roles: ['GRIP_noticeMgt']
        },
        children: [
          {
            path: 'release-marquee',
            component: () => import('@/views/add-notice/release-marquee'),
            name: 'ReleaseMarquee',
            meta: {
              title: '发布跑马灯',
              roles: ['GRIP_noticeMgt']
            }
          }
        ]
      },
      {
        path: 'upload-resource',
        component: () => import('@/views/upload-resource/index'),
        name: 'index',
        meta: { title: '资源上传', roles: ['GRIP_resourcesUpload'] }
      },
      {
        path: 'grip-common-problem',
        component: () => import('@/views/service-support/grip-common-problem'),
        name: 'GripCommonProblem',
        meta: { title: '接口支持', roles: ['GRIP_serviceSupport'] }
      },
      /* {
        path: 'grip-service-solutions',
        component: () => import('@/views/service-support/grip-service-solutions'),
        name: 'GripServiceSolutions',
        meta: { title: '服务支持解答' /!* roles: ['GRIP_acceptanceTest'] *!/ }
      },*/
      {
        path: 'basic-data-manage',
        component: () => import('@/views/grip-manage/basic-data-manage/index'),
        name: 'BasicDataManage',
        meta: {
          title: '基础数据配置',
          roles: ['GRIP_BASIC_INFORMATION_CONF']
        }
      },
      {
        path: 'flow-engine',
        component: () => import('@/views/grip-manage/flow-engine/index'),
        name: 'FlowEngine',
        meta: {
          title: '流程引擎',
          roles: ['GRIP_procFlowMgt']
        }
      },
      {
        path: 'menu-config-interface',
        component: () => import('@/views/menu-config-interface/index'),
        name: 'MenuConfigInterface',
        meta: {
          title: '菜单配置',
          roles: ['GRIP_menuConfig']
        }
      },
      // 如需跳转背景和验收资源配置相同请将path写成（private_）具体请看
      // src/layout/components/nav/navItem.vue @methods resolvePath @param{ to-router } string 方法
      {
        path: 'menu-config',
        component: () => import('@/views/menu-config/index'),
        name: 'MenuConfig',
        meta: {
          title: '验收资源配置',
          roles: ['GRIP_MENU_ACCEPTANCECONF']
        }
      },
      {
        path: 'email-notification',
        component: () => import('@/views/email-notification/index'),
        name: 'EmailNotification',
        meta: {
          title: '邮件通知配置',
          roles: ['GRIP_MENU_MAIL_NOTIFICATION_CONF']
        }
      },
      {
        path: 'private_contact-manage',
        component: () => import('@/views/contact-manage/index'),
        name: 'ContactManage',
        meta: {
          title: '联系人与邮件订阅管理',
          roles: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE']
        }
      },

      // 2.1.2版本isv模块菜单隐藏
      {
        path: 'isv-management',
        component: () => import('@/views/isv-management/index'),
        name: 'ISVManagement',
        meta: {
          title: 'ISV管理',
          roles: ['GRIP_MENU_ISV_MANGER_CONFIG']
        }
      },

      {
        path: 'statistical-query',
        component: () => import('@/views/statistical-query/index'),
        name: 'StatisticalQuery',
        meta: { title: '统计查询', roles: ['GRIP_statistic_search'] }
        // meta: { title: '统计查询' }
      },
      // {
      //   path: 'grip-emergency',
      //   component: () => import('@/views/grip-emergency/index'),
      //   name: 'grip-emergency',
      //   meta: {
      //     title: '场务应急',
      //     // roles: ['GRIP_gripEmergency']
      //     roles: ['GRIP_externalDevGuideDesign']
      //   }
      // },
      {
        path: 'general-query',
        component: () => import('@/views/general-query/index'),
        name: 'general-query',
        meta: {
          title: '场务应急',
          roles: ['GRIP_fieldEmergency']
        }
      },
      {
        clickType: 3,
        path: 'external-dev-guide-design',
        component: () => import('@/views/external-dev-guide-design/index'),
        name: 'external-dev-guide-design',
        meta: {
          title: '对外接口开发指引设计',
          roles: ['GRIP_externalDevGuideDesign']
        }
      }
    ]
  },
  {
    path: '/user-manage',
    component: Layout,
    redirect: '/user-manage/index',
    hidden: true,
    meta: {
      roles: ['AGENCY_systemMgtUser'],
      enHidden: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/organ-manage/user-manage'),
        name: 'userManage',
        meta: { title: '用户管理' }
      }
    ]
  },

  {
    path: '/jg-statistic-query',
    component: Layout,
    redirect: '/jg-statistic-query/index',
    hidden: true,
    meta: {
      enHidden: true
      // roles: ['AGENCY_systemMgtUser']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/jg-statistic-query'),
        name: 'StatisticQuery',
        meta: { title: '统计查询' }
      }
    ]
  },

  {
    path: 'contact-manage',
    component: () => import('@/views/contact-manage/index'),
    name: 'ContactManage',
    meta: {
      title: '联系人管理'
      // roles: ['GRIP_contactManage']
    }
  },
  {
    path: '/personal-center',
    component: Layout,
    redirect: '/personal-center/index',
    hidden: false,
    meta: {
      roles: ['AGENCY_userCenter', 'GRIP_userCenter'],
      enHidden: false
    },
    children: [
      {
        path: 'persion_index',
        component: () => import('@/views/personal-center'),
        name: 'PersonalCenter',
        meta: { title: '个人中心' }
      },
      // src\views\contact-manage\index.vue
      {
        path: 'index',
        component: () => import('@/views/contact-manage/index.vue'),
        // component: () => import('@/views/personal-center'),
        name: 'PersonalCenter',
        meta: { title: i18n.t('header.personalCenter') }
      }
    ]
  },
  {
    path: '/organ-basicinfo',
    component: Layout,
    redirect: '/organ-basicinfo/organ-basicinfo',
    hidden: true,
    meta: {
      roles: ['AGENCY_institutionBaseInfo'],
      enHidden: true
    },
    children: [
      {
        path: 'organ-basicinfo',
        component: () => import('@/views/organ-manage/organ-basicinfo'),
        name: 'organBasicinfo',
        meta: { title: '机构信息' }
      },
      // {
      //   path: 'edit-organ-basicinfo',
      //   component: () => import('@/views/organ-manage/edit-organ-basicinfo'),
      //   name: 'editOrganBasicinfo',
      //   hidden: true,
      //   meta: { title: '机构信息' }
      // },
      // 2.1.2版本isv模块菜单隐藏
      {
        path: 'jgIsv_manage',
        component: () => import('@/views/isv-management/jgIsv_manage/index'),
        name: 'jgIsv_manage',
        hidden: true,
        meta: {
          title: 'ISV管理'
          // notAllowed: true
          // roles: ['COMMON_serviceSupport_contact_information']
        }
      }
    ]
  },

  {
    path: '/hidden-path',
    component: Layout,
    // redirect: '/hidden-path/long/more/plus',
    redirect: '/',
    hidden: true,
    children: [
      {
        path: 'long/more/plus',
        component: () => import('@/views/sql-execute/index'),
        name: 'sql-execute',
        hidden: true,
        meta: { title: '留言' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/home', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
