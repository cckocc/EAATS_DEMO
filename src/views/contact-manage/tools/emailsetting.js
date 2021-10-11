import i18n from '@/lang'
const emailCompents = {
  EmailSubscriptionManage: [
    {
      title: '机构收件人管理',
      name: 'ContactManagement',
      componentName: 'ContactManagement',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },

    {
      title: '机构订阅管理',
      name: 'InstitutionalSubscriptionManagement',
      componentName: 'InstitutionalSubscriptionManagement',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_SUBSCRIPTION', 'admin']
    },
    {
      title: '场务订阅管理',
      name: 'GripSubscriptionManagement',
      componentName: 'GripSubscriptionManagement',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_GRIP_SUBSCRIPTION', 'admin']
    }
  ],
  EmailSubscriptionManageOrgan: [
    {
      title: i18n.t('header.personalCenter'),
      name: 'PersonalCenterOrg',
      componentName: 'PersonalCenter'
    },
    {
      title: '联系人管理',
      name: 'ContactManagementOrg',
      componentName: 'ContactManagement'
    },
    {
      title: '邮箱订阅管理',
      name: 'EmailSubscriptionManageOrg',
      componentName: 'EmailSubscriptionManage'
    }
  ],
  NoPermission: [
    {
      title: '无权限访问',
      name: 'NoPermission',
      componentName: 'EmailSubscriptionManage'
    }
  ]
}

export default { ...emailCompents }
