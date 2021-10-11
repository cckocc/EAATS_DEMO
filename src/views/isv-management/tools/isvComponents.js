const isvComponents = {
  // 场务端
  ISVSubscriptionManage: [
    {
      title: 'ISV管理',
      name: 'IsvManage',
      componentName: 'IsvManage',
      isPermission: ['GRIP_MENU_ISV_MSG_MANGER', 'admin']
    },
    {
      title: '展示信息审核',
      name: 'DisplayInformationAudit',
      componentName: 'DisplayInformationAudit',
      isPermission: ['GRIP_MENU_ISV_MSG_CHECK', 'admin']
    },
    {
      title: 'ISV证书管理',
      name: 'IsvCertificateManage',
      componentName: 'IsvCertificateManage',
      isPermission: ['GRIP_MENU_ISV_CERTIS', 'admin']
    }

  ],
  ISVSubscriptionManageOrgan: [
    {
      title: 'ISV看板',
      name: 'JgIsvKanban',
      componentName: 'JgIsvKanban'
    }
  ]
  // NoPermission: [
  //   {
  //     title: '无权限访问',
  //     name: 'NoPermission',
  //     componentName: 'EmailSubscriptionManage'
  //   }
  // ]
}

export default { ...isvComponents }
