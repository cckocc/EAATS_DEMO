const statisticCompents = {
  // 场务端
  StatisticSubscriptionManage: [
    {
      title: '审核时间节点统计',
      name: 'Audit',
      componentName: 'Audit',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },
    {
      title: '市场机构统计',
      name: 'MarketInstiStatistic',
      componentName: 'MarketInstiStatistic',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },
    {
      title: '信息商统计',
      name: 'InformationStatistic',
      componentName: 'InformationStatistic',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },
    {
      title: 'ISV统计',
      name: 'ISVStatistic',
      componentName: 'ISVStatistic',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },
    {
      title: '候补查询',
      name: 'AlternateQuery',
      componentName: 'AlternateQuery',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']
    },
  ],

  NoPermission: [
    {
      title: '无权限访问',
      name: 'NoPermission',
      componentName: 'EmailSubscriptionManage'
    }
  ]
}

export default { ...statisticCompents }
