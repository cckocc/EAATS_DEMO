const emailCompents = {
  newEmail: [
    {
      title: '新建自动邮件通知',
      name: 'newEmail',
      componentName: 'AutoEmail'
    }
  ],
  handEmail: [
    {
      title: '新建手动邮件通知',
      name: 'handEmail',
      componentName: 'handEmail'
    }
  ],
  handSendEmail: [
    {
      title: '自动邮件通知',
      name: 'autoEmailSendNotice',
      componentName: 'autoEmailSendNotice',
      isPermission: ['GRIP_MENU_MAIL_NOTIFICATION_CONF_AUTO', 'admin']
    },
    {
      title: '手动发送邮件',
      name: 'handSendEmail',
      componentName: 'handSendEmail',
      isPermission: ['GRIP_MENU_MAIL_NOTIFICATION_CONF_MANUAL', 'admin']
    }
  ],
  mewAutoEmailNotice: [
    {
      title: '新建自动邮件通知',
      name: 'mewAutoEmailNotice',
      componentName: 'mewAutoEmailNotice'
    }
  ],
  subscribeEmail: [
    {
      title: '订阅邮件类型通知',
      name: 'subscribeEmail',
      componentName: 'subscribeEmail'
    }
  ],
  emialTypeTemplate: [
    {
      title: '新建订阅邮件类型模板',
      name: 'emialTypeTemplate',
      componentName: 'emialTypeTemplate'
    }
  ],
  addHandsendNotice: [
    {
      title: '新建手动邮件通知',
      name: 'addHandsendNotice',
      componentName: 'addHandsendNotice'
    }
  ]
}

export default { ...emailCompents }
