const statisticCompents = {

  // 机构端
  StatisticSubscriptionManageOrgan: [
    {
      title: '市场机构统计',
      name: 'JgMarketInstiStatistic',
      componentName: 'JgMarketInstiStatistic',
      type: '00',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']

    },
    {
      title: '信息商统计',
      name: 'JgInformationStatistic',
      componentName: 'JgInformationStatistic',
      // type: '10',
      isPermission: ['GRIP_MENU_CONTACTS_SUBSCRIPTION_MANAGE_INST_RECIPIENTS', 'admin']

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

export default { ...statisticCompents }
