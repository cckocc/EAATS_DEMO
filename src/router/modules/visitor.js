/** When your routing table is too long, you can split it into small modules **/
import i18n from '@/lang'
import Layout from '@/layout'

export const visitorRouters = [
  // {
  //   path: '/privacy-policy',
  //   name: 'privacyPolicy',
  //   component: () => import('@/views/add-notice/privacy-policy'),
  //   meta: {
  //     title: '隐私政策'
  //   }
  // },
  {
    path: '/service-application',
    component: Layout,
    meta: { title: i18n.t('route.interfaceService.index'), notAllowed: true },
    children: [
      {
        path: 'index',
        meta: { title: i18n.t('route.interfaceService.index'), notAllowed: true }
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
      enHidden: true
    },
    children: [
      // {
      //   path: 'common-problem',
      //   component: () => import('@/views/interface-support/common-problem/index'),
      //   name: 'CommonProblem',
      //   meta: { title: '常见问题' }
      // },
      {
        path: 'contact-way',
        component: () => import('@/views/interface-support/contact-way/index'),
        name: 'contact-way',
        meta: {
          title: '业务概览'
        }
      },
      // 2.1.2版本isv菜单隐藏
      {
        path: 'jgIsv_kanban',
        component: () => import('@/views/isv-management/jgIsv_kanban/index'),
        name: 'JgIsvKanban',
        meta: {
          title: 'ISV看板'
        }
      }
      // {
      //   path: 'jgIsv_certificate_manage',
      //   component: () => import('@/views/isv-management/jgIsv_manage/jgIsv_certificate_manage'),
      //   name: 'JgIsvCertificateManage',
      //   meta: {
      //     title: 'ISV证书查询'
      //   }
      // }
    ]
  },
  {
    path: '/download',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '接口资源',
      enHidden: true,
      notAllowed: true
    },
    alwaysShow: true,
    children: [
      {
        path: 'protocol-standard',
        component: () => import('@/views/download/protocol-standard/index'),
        name: 'ProtocolStandard',
        meta: {
          title: '协议标准'
        }
      }
    ]
  },
  {
    path: '/standard-more',
    component: Layout,
    hidden: true,
    redirect: '/standard-more/standard-more',
    children: [
      {
        path: 'standard-more',
        component: () => import('@/views/notice/standard-more'),
        hidden: true,
        name: 'standardMore',
        meta: { title: i18n.t('home.standardsAndSpecifications') }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    // meta: {
    //   title: i18n.t('route.notice.index')
    // },
    children: [
      {
        path: 'index',
        component: () => import('@/views/notice/index'),
        name: 'notice',
        meta: {
          title: i18n.t('route.notice.index')
        }
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
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/home', hidden: true }
]
export default visitorRouters
