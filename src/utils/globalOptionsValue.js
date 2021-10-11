import i18n from '@/lang'
export default {
  // 用户类型
  userType: [
    {
      value: 'ALL',
      label: '全部'
    },
    {
      value: 'ENABLE',
      label: '正常'
    },
    {
      value: 'DISABLE',
      label: '禁用'
    }
  ],
  // 用户状态
  userStatus: [
    {
      value: 'ALL',
      label: '全部'
    },
    {
      value: 'ENABLE',
      label: '正常'
    },
    {
      value: 'DISABLE',
      label: '禁用'
    }
  ],
  // 用户角色
  roleType: [
    {
      value: 'ALL',
      label: '全部'
    },
    {
      value: 'SUPER_ADMINISTRATOR',
      label: '超级管理员'
    },
    {
      value: 'DISABLE',
      label: '机构管理员'
    }
  ],
  // 用户部门
  userDepartment: [
    { label: '市场一部', value: '市场一部' },
    { label: '市场二部', value: '市场二部' },
    { label: '信息统计部', value: '信息统计部' },
    { label: '清算部', value: '清算部' },
    { label: '技术开发部', value: '技术开发部' },
    { label: '工程运行部', value: '工程运行部' },
    { label: '中汇公司', value: '中汇公司' }
  ],
  MarketSubitem: [
    { label: '外汇', value: '00' },
    { label: '现劵市场', value: '01' },
    { label: '质押式回购', value: '02' },
    { label: '买断式回购', value: '03' },
    { label: '同业拆借', value: '04' },
    { label: '利率互换期权', value: '05' },
    { label: '利率上下限期权', value: '06' },
    { label: '标准债券远期', value: '07' },
    { label: '标准利率互换', value: '08' },
    { label: '利率互换', value: '09' },
    { label: '债券借贷', value: '10' },
    { label: '同业存单', value: '11' },
    { label: '预发行', value: '12' },
    { label: '同业存款', value: '13' },
    { label: '同业借款', value: '14' },
    { label: '债券指数产品', value: '15' },
    { label: '远期利率协议', value: '16' },
    { label: '信用缓释凭证', value: '17' },
    { label: '信用违约互换', value: '18' },
    { label: '做市支持成交', value: '19' },
    { label: '常备借贷便利', value: '20' },
    { label: '货币市场额度管理', value: '21' },
    { label: '本币市场基础信息', value: '22' },
    { label: '本币信息产品', value: '23' },
    { label: '本币ideal接口', value: '24' }
  ],
  // 审核状态
  auditStatus: [
    {
      code: '10',
      value: 'PASS',
      label: '通过'
    },
    {
      code: '90',
      value: 'REFUSE',
      label: '拒绝'
    },
    {
      code: '05',
      value: 'AUDIT_PROCESS',
      label: '审核中'
    },
    {
      code: '00',
      value: 'WAIT_PROCESS',
      label: '待审核'
    }
  ],
  phoneCode: [
    {
      value: '+86',
      label: '+86'
    }
  ],
  auditAllStatus: [
    {
      value: '00',
      label: '待审核'
    },
    {
      value: '05',
      label: '正常'
    },
    {
      value: '10',
      label: '拒绝'
    },
    {
      value: '15',
      label: '锁定'
    },
    {
      value: '20',
      label: '注销'
    }
  ],
  // 通告类型
  noticeType: [
    {
      value: 'BIG_NEWS',
      label: '新闻速递'
    },
    {
      value: 'BUSINESS_NOTICE',
      label: '业务通知'
    },
    {
      value: 'TEST_NOTICE',
      label: '测试通知'
    },
    {
      value: 'STANDARD_NORM',
      label: '标准与规范'
    }
  ],
  // 所有通告类型
  allNoticeType: [
    {
      value: 'ALL',
      label: '全部'
    },
    {
      value: 'BIG_NEWS',
      label: '新闻速递'
    },
    {
      value: 'BUSINESS_NOTICE',
      label: '业务通知'
    },
    {
      value: 'TEST_NOTICE',
      label: '测试通知'
    },
    {
      value: 'STANDARD_NORM',
      label: '标准与规范'
    }
  ],
  getNoticeTypeNum(item) {
    switch (item) {
      case '00':
        item = '新闻速递'
        break
      case '05':
        item = '业务测试'
        break
      case '10':
        item = '测试通知'
        break
      default:
        break
    }
    return item
  },
  marketOptions: [
    { name: '外汇', text: '外汇', value: '外汇' },
    { name: '现劵市场', text: '现劵市场', value: '现劵市场' },
    { name: '质押式回购', text: '质押式回购', value: '质押式回购' },
    { name: '买断式回购', text: '买断式回购', value: '买断式回购' },
    { name: '同业斥借', text: '同业斥借', value: '同业斥借' },
    { name: '利率互换期权', text: '利率互换期权', value: '利率互换期权' }
  ],
  // 流程查看 审核状态
  processOptions: [
    { label: '待审核', value: '00', icon: 'process-default' },
    { label: '审核中', value: '05', icon: 'process-default' },
    { label: '通过', value: '10', icon: 'process-pass' },
    { label: '拒绝', value: '90', icon: 'process-refuse' },
    { label: '申请单待审核', value: '1000', icon: 'process-default' },
    { label: '候补', value: '1005', icon: 'process-alternate' },
    { label: '测试中', value: '1010', icon: 'process-default' },
    { label: '申请单拒绝', value: '1020', icon: 'process-refuse' },
    { label: '验收失败', value: '1040', icon: 'process-refuse' },
    { label: '报告待审核', value: '1050', icon: 'process-default' },
    { label: '验收成功报告可下载', value: '1060', icon: 'process-pass' },
    { label: '报告拒绝', value: '1070', icon: 'process-refuse' },
    { label: '释放', value: '1080', icon: 'process-default' }
  ],
  // 接口信息 流程状态
  processInterOptions: [
    { label: '待审核', value: '00' },
    { label: '审核中', value: '05' },
    // { label: '拒绝', value: '06' },
    { label: '通过', value: '07' },
    { label: '流程撤回', value: '08' }
  ],
  // 服务类型
  serveiceOptions: [
    { label: i18n.t('enum.serveiceOptions.serviceOpening'), value: '00' },
    { label: i18n.t('enum.serveiceOptions.acceptanceTest'), value: '10' },
    { label: i18n.t('enum.serveiceOptions.interfaceOnline'), value: '20' },
    { label: i18n.t('enum.serveiceOptions.permissionChange'), value: '40' },
    { label: i18n.t('enum.serveiceOptions.networkOpeningApply'), value: '50' }
  ],
  problemType: [
    { label: '服务申请', value: '00' },
    { label: '验收测试', value: '05' },
    { label: '生产问题', value: '10' }
  ],
  feedOption: [
    { label: '非常满意', value: '01' },
    { label: '满意', value: '02' },
    { label: '一般', value: '03' },
    { label: '不满意', value: '04' },
    { label: '非常不满意', value: '05' }
  ],
  // 每个接口每天允许测试功能模块数量
  testQuantityNum: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '无限制', value: null }
  ],
  // 自查清单需要显示下载模板
  enNameList1: [
    { label: 'LCAPI', value: 'LC' },
    { label: 'LPAPI', value: 'LP' }
  ],
  // 下载测试报告模块数组
  enNameList2: [
    { label: 'CASH', value: 'CASH' },
    { label: 'CSWAP', value: 'CSWAP' },
    { label: 'TRD', value: 'TRD' },
    { label: 'PLEDGE', value: 'PLEDGE' },
    { label: 'DERIVATIVES', value: 'DERIVATIVES' },
    { label: 'LCAPI', value: 'LC' },
    { label: 'LPAPI', value: 'LP' }
  ],
  // 验收测试--表单审核状态
  testFormAuditStatusList: [
    { label: '待提交', btnLabel: '审核反馈', value: '0', disabled: true },
    { label: '验收单待审核', btnLabel: '审核反馈', value: '00', disabled: false },
    { label: '待测试', btnLabel: '测试反馈', value: '10', disabled: false },
    { label: '验收单审核不通过', btnLabel: '审核反馈', value: '20', disabled: true },
    { label: '测试报告待上传', btnLabel: '测试反馈', value: '30', disabled: true },
    { label: '测试不通过', btnLabel: '测试反馈', value: '40', disabled: true },
    { label: '测试报告待审核', btnLabel: '测试报告反馈', value: '50', disabled: true },
    { label: '测试报告审核通过', btnLabel: '测试报告反馈', value: '60', disabled: true },
    { label: '测试报告审核不通过', btnLabel: '测试报告反馈', value: '70', disabled: true }
  ],
  // 验收测试审核状态
  testAuditStatusList: [
    { label: '待提交', value: '30' },
    { label: '待审核', value: '00' },
    { label: '审核中', value: '05' },
    { label: '通过', value: '10' },
    { label: '撤回', value: '20' },
    { label: '拒绝', value: '90' }
  ],
  // 我的服务-流程状态
  myServiceAuditStatusList: [
    { label: i18n.t('enum.myServiceAuditStatusList.pending'), value: '30', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.review'), value: '00', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.reviewing'), value: '05', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.pass'), value: '10', icon: 'process-pass' },
    { label: i18n.t('enum.myServiceAuditStatusList.withdraw'), value: '20', icon: 'process-recall' },
    { label: i18n.t('enum.myServiceAuditStatusList.reject'), value: '90', icon: 'process-refuse' },
    { label: i18n.t('enum.myServiceAuditStatusList.pendingSubmission'), value: '1000', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.standby'), value: '1005', icon: 'process-alternate' },
    { label: i18n.t('enum.myServiceAuditStatusList.testing'), value: '1010', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.ceritificationTestingApplicationReject'), value: '1020', icon: 'process-refuse' },
    { label: i18n.t('enum.myServiceAuditStatusList.ceritificationTestingFailed'), value: '1040', icon: 'process-refuse' },
    { label: i18n.t('enum.myServiceAuditStatusList.ceritificationTestingReportPendingReview'), value: '1050', icon: 'process-default' },
    { label: i18n.t('enum.myServiceAuditStatusList.testingReportdownloadable'), value: '1060', icon: 'process-pass' },
    { label: i18n.t('enum.myServiceAuditStatusList.ceritificationTestingReportReject'), value: '1070', icon: 'process-refuse' },
    { label: i18n.t('enum.myServiceAuditStatusList.release'), value: '1080', icon: 'process-default' }
  ],
  // 审核状态枚举值
  colorOptions: [
    {
      code: '00',
      text: '待审核',
      color: ''
    },
    {
      code: '05',
      text: '正常',
      color: '#0ABC6F'
    },
    {
      code: '15',
      text: '禁用',
      color: '#A5A4A1'
    },
    {
      code: '20',
      text: '锁定',
      color: '#F66C6C'
    }
  ],
  // 业务类型包括服务类型枚举值
  procTypeOptions: [
    {
      type: '10',
      title: i18n.t('enum.procTypeOptions.newInterfaceApplication'),
      steps: [
        {
          type: '00',
          title: i18n.t('enum.serveiceOptions.serviceOpening'),
          content: '',
          index: '1',
          class: 'service-opening',
          obj: {}
        },
        {
          type: '50',
          title: i18n.t('enum.serveiceOptions.networkOpeningApply'),
          content: '',
          index: false,
          class: i18n.t('networkOpening.class'),
          obj: {}
        },
        {
          type: '10',
          title: i18n.t('enum.serveiceOptions.acceptanceTest'),
          content: '',
          index: '2',
          class: 'acceptance-test',
          obj: {}
        },
        {
          type: '20',
          title: i18n.t('enum.serveiceOptions.interfaceOnline'),
          content: '',
          index: '3',
          class: 'interface-online',
          obj: {}
        }
      ]
    },
    {
      type: '20',
      title: i18n.t('enum.procTypeOptions.permissionChangeApplication'),
      steps: [
        {
          type: '40',
          title: i18n.t('enum.serveiceOptions.permissionChange'),
          content: '',
          index: '1',
          class: 'permission-change',
          obj: {}
        },
        {
          type: '50',
          title: i18n.t('enum.serveiceOptions.networkOpeningApply'),
          content: '',
          index: false,
          class: i18n.t('networkOpening.class'),
          obj: {}
        },
        {
          type: '10',
          title: i18n.t('enum.serveiceOptions.acceptanceTest'),
          content: '',
          index: '2',
          class: 'acceptance-test',
          obj: {}
        },
        {
          type: '20',
          title: i18n.t('enum.serveiceOptions.interfaceOnline'),
          content: '',
          index: '3',
          class: 'interface-online',
          obj: {}
        }
      ]
    },
    {
      type: '30',
      title: i18n.t('enum.procTypeOptions.interfaceTestingApplication'),
      steps: [
        {
          type: '50',
          title: i18n.t('enum.serveiceOptions.networkOpeningApply'),
          content: '',
          index: false,
          class: i18n.t('networkOpening.class'),
          obj: {}
        },
        {
          type: '10',
          title: i18n.t('enum.serveiceOptions.acceptanceTest'),
          content: '',
          index: '1',
          class: 'acceptance-test',
          obj: {}
        },
        {
          type: '20',
          title: i18n.t('enum.serveiceOptions.interfaceOnline'),
          content: '',
          index: '2',
          class: 'interface-online',
          obj: {}
        }
      ]
    }
  ],
  // 操作类型
  operationTypeOptions: [
    {
      value: 'detail',
      label: i18n.t('enum.operationTypeOptions.detail')
    },
    {
      value: 'audit',
      label: i18n.t('enum.operationTypeOptions.audit')
    },
    {
      value: 'edit',
      label: i18n.t('enum.operationTypeOptions.edit')
    },
    {
      value: 'add',
      label: i18n.t('enum.operationTypeOptions.application')
    }
  ]
}
