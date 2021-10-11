import request from '@/utils/request'

// 协议条款配置-查询列表
export function getProtocolClauseConfigList(data) {
  return request({
    url: '/agreement/ext/list',
    method: 'post',
    data
  })
}

// 协议条款配置-新增
export function addProtocolClauseConfig(data) {
  return request({
    url: '/agreement/ext/add',
    method: 'post',
    data
  })
}

// 协议条款配置-更新
export function updateProtocolClauseConfig(data) {
  return request({
    url: '/agreement/ext/update',
    method: 'post',
    data
  })
}

// 协议条款配置-删除
export function deleteProtocolClauseConfig(data) {
  return request({
    url: '/agreement/exitRecord/delete',
    method: 'post',
    data
  })
}

// 协议条款配置-查询版本记录
export function getProtocolClauseConfigHistory(data) {
  return request({
    url: '/agreement/exitRecord/list',
    method: 'post',
    data
  })
}

// 接口菜单配置-导出
export function exportInterfaceMenuConfig(params) {
  return request({
    url: '/manage/menu/config/download/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 接口菜单配置-导入
export function importInterfaceMenuConfig(params) {
  let url = ''
  if (params.type === '00') {
    url = '/manage/menu/config/uploadFile/excelMarket/import'
  } else if (params.type === '10') {
    url = '/manage/menu/config/uploadFile/excel/import'
  }
  return request({
    url: url,
    method: 'post',
    data: params.data
  })
}

// 接口菜单配置-查询列表
export function getInterfaceMenuConfigList(params) {
  return request({
    url: '/manage/menu/config/findRecord',
    method: 'get',
    params
  })
}

// 接口菜单配置-发布
export function publishInterfaceMenuConfig(params) {
  return request({
    url: '/manage/menu/config/publish',
    method: 'get',
    params
  })
}

// 接口菜单配置-删除
export function deleteInterfaceMenuConfig(params) {
  return request({
    url: '/manage/menu/config/delete',
    method: 'get',
    params
  })
}

// 接口菜单配置-查询树
export function getInterfaceMenuConfigTree(data) {
  return request({
    url: '/manage/menu/config/manageMenu',
    method: 'post',
    data
  })
}

// 接口菜单配置-查询树详情
export function getMenuConfigDetail(data) {
  return request({
    url: '/manage/menu/config/preview',
    method: 'post',
    data
  })
}

// 接口菜单配置-隐藏和显示节点
export function toggleMenuConfigNode(data) {
  return request({
    url: '/manage/menu/configure/hideMenuNodeOrNot',
    method: 'post',
    data
  })
}

// 接口菜单配置-预览隐藏后的节点
export function previewMenuConfigNode(data) {
  return request({
    url: '/manage/menu/configure/previewMenuConfigNode',
    method: 'post',
    data
  })
}

// 接口菜单配置-查询协议条款配置
export function getProtocolClauseConfig(params) {
  return request({
    url: '/manage/menu/configure/getAgreementTermRefList',
    method: 'get',
    params
  })
}

// 接口菜单配置-保存协议条款配置
export function saveProtocolClauseConfig(data) {
  return request({
    url: '/manage/menu/configure/saveAgreementTermRef',
    method: 'post',
    data
  })
}

// 展示维度配置-查询表头列枚举值
export function getDimensionThList(data) {
  return request({
    url: '/manage/menu/config/searchHeadInfo',
    method: 'post',
    data
  })
}

// 展示维度配置-查看
export function getDimensionDetail(params) {
  return request({
    url: '/manage/menu/configure/showDimensionsNames',
    method: 'get',
    params
  })
}

// 展示维度配置-维度配置验收测试表头信息查询
export function getDimensionTableThList(data) {
  return request({
    url: '/manage/menu/config/searchTestHeadInfo',
    method: 'post',
    data
  })
}

// 查询市场枚举值
export function getMarketList(params) {
  return request({
    url: '/manage/menu/configure/dimension/marketList',
    method: 'get',
    params
  })
}

// 展示维度配置-查询
export function getDimensionConfig(params) {
  return request({
    url: '/manage/menu/configure/showDimensions',
    method: 'get',
    params
  })
}

// 验收测试配置-查询详情
export function getTestScope(params) {
  return request({
    url: '/manage/menu/configure/get/testScope',
    method: 'get',
    params
  })
}

// 验收测试配置-查询验收单列表
export function getFormList(params) {
  return request({
    url: '/manage/menu/configure/get/form',
    method: 'get',
    params
  })
}

// 验收测试配置--保存
export function saveTestScope(data) {
  return request({
    url: '/manage/menu/configure/save/testScope',
    method: 'post',
    data
  })
}

// 验收测试列配置-保存
export function saveDimensions(data) {
  return request({
    url: '/manage/menu/configure/saveDimensions',
    method: 'post',
    data
  })
}

// 展示维度配置-保存
export function saveDimensionConfig(data) {
  return request({
    url: '/manage/menu/configure/saveDimensionName',
    method: 'post',
    data
  })
}

// 接口菜单配置-编辑完成
export function editFinishMenuConfig(params) {
  return request({
    url: '/manage/menu/config/editFinish',
    method: 'get',
    params
  })
}

// 接口菜单配置-升级
export function upgradeMenuConfig(params) {
  return request({
    url: '/manage/menu/config/record/copy',
    method: 'get',
    params
  })
}

// 验收人员管理-新增验收人
export function addAccepter(data) {
  return request({
    url: '/accepter/manage/save',
    method: 'post',
    data
  })
}

// 接口菜单配置-获取流程审核类型
export function getProcessList(instiType) {
  return request({
    url: '/manage/menu/configure/get/process/type',
    method: 'get',
    params: { instiType }
  })
}

// 接口菜单配置-获取部门和小组
export function getGroupList() {
  return request({
    url: '/manage/menu/configure/get/department/team',
    method: 'get'
  })
}

// 接口菜单配置-配置小组
export function editGroup(data) {
  return request({
    url: '/manage/menu/configure/save/department/menu/ref',
    method: 'post',
    data
  })
}

// 验收单配置列表
export function getAcceptanceCertificateList(params) {
  return request({
    url: '/acceptance/form/config/list',
    method: 'get',
    params
  })
}

// 验收单配置版本列表
export function getAcceptanceVersionList(params) {
  return request({
    url: '/acceptance/form/config/version/list',
    method: 'get',
    params
  })
}

// 验收单升级
export function acceptanceUpgrade(params) {
  return request({
    url: `/acceptance/form/config/upgrade`,
    method: 'get',
    params
  })
}

// 删除验收单
export function deleteAcceptance(params) {
  return request({
    url: `/acceptance/form/config/delete`,
    method: 'get',
    params
  })
}

// 删除验收单版本
export function deleteAcceptanceVersion(params) {
  return request({
    url: `/acceptance/form/config/version/delete`,
    method: 'get',
    params
  })
}

// 新增验收单版本
export function addModifyAcceptanceVersion(data) {
  return request({
    url: '/acceptance/form/config/version/save',
    method: 'post',
    data
  })
}

// 获取验收单版本详情
export function getAcceptanceVersionDetail(params) {
  return request({
    url: '/acceptance/form/config/version/form/detail',
    method: 'get',
    params
  })
}

// 保存验收单关联接口信息(step2)
export function saveAcceptanceInterfaceData(data) {
  return request({
    url: '/acceptance/form/config/version/interface/ref/save',
    method: 'post',
    data
  })
}

// 获取验收单关联接口信息(step2,单独点击步骤条触发)
export function getAcceptanceInterfaceData(params) {
  return request({
    url: '/acceptance/form/config/version/interface/ref/update/detail',
    method: 'get',
    params
  })
}

// 查看验收单的接口验收菜单(step3，包含扩展列的数据)
export function viewAcceptanceInterfaceData(params) {
  return request({
    url: '/acceptance/form/config/version/interface/ref/detail',
    method: 'get',
    params
  })
}

// 保存验收单的接口验收菜单(step3)
export function saveAcceptanceTestScopeData(data) {
  return request({
    url: '/acceptance/form/config/version/test/scope/save',
    method: 'post',
    data
  })
}

// 获取验收单的接口验收菜单(step3，单独点击步骤条触发)
export function getAcceptanceTestScopeData(params) {
  return request({
    url: '/acceptance/form/config/version/test/scope/update/detail',
    method: 'get',
    params
  })
}

// 查看验收单的接口验收菜单(step3，包含扩展列的数据)
export function viewAcceptanceTestScopeData(params) {
  return request({
    url: '/acceptance/form/config/version/test/scope/detail',
    method: 'post',
    params
  })
}

// 获取自查清单数据(step4)
export function getSelfCheckData(params) {
  return request({
    url: '/acceptance/form/config/detail/selfCheck',
    method: 'get',
    params
  })
}

// 获取自查清单数据文件(step4)
export function downloadSelfCheckData(params) {
  return request({
    url: '/acceptance/form/config/download/selfCheck',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function downloadSelfCheckKey(params) {
  return request({
    url: '/acceptance/form/config/download/key',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 上传自查清单文件
export function uploadSelfCheckFile(data) {
  return request({
    url: '/acceptance/form/config/upload/selfCheck',
    method: 'post',
    data
  })
}

// 上传自查清单json
export function uploadSelfCheckJson(data) {
  return request({
    url: '/acceptance/form/config/save/file/selfCheck',
    method: 'post',
    data
  })
}

// 下载验收菜单规则文件
export function downloadTestScopeRuls(params) {
  return request({
    url: '/acceptance/form/config/download/testScope/rule',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 下载验收菜单规则文件
export function publishAcceptance(params) {
  return request({
    url: '/acceptance/form/config/publish',
    method: 'get',
    params
  })
}

// 数字证书配置-查询列表
export function getDigitalCertificateConfigList(data) {
  return request({
    url: '/digitalCertificate/getList',
    method: 'post',
    data
  })
}

// 数字证书配置-新增
export function addDigitalCertificateConfig(data) {
  return request({
    url: '/digitalCertificate/add',
    method: 'post',
    data
  })
}

// 数字证书配置-删除
export function deleteDigitalCertificateConfig(data) {
  return request({
    url: '/digitalCertificate/delete',
    method: 'post',
    data
  })
}

// 数字证书配置-历史
export function getDigitalCertificateConfigHistory(data) {
  return request({
    url: '/digitalCertificate/get',
    method: 'post',
    data
  })
}

// 数字证书配置-更新
export function updateDigitalCertificateConfig(data) {
  return request({
    url: '/digitalCertificate/update',
    method: 'post',
    data
  })
}

// 菜单配置 - 数字证书查询
export function getDigitalCertificateConfig(params) {
  return request({
    url: '/manage/menu/configure/getDigitalCertificateRefList',
    method: 'get',
    params
  })
}

// 菜单配置 - 数字证书保存
export function saveDigitalCertificateConfig(data) {
  return request({
    url: '/manage/menu/configure/saveDigitalCertificateRef',
    method: 'post',
    data
  })
}

export default {
  addAccepter,
  getProtocolClauseConfigList,
  addProtocolClauseConfig,
  updateProtocolClauseConfig,
  deleteProtocolClauseConfig,
  getProtocolClauseConfigHistory,
  exportInterfaceMenuConfig,
  importInterfaceMenuConfig,
  getInterfaceMenuConfigList,
  publishInterfaceMenuConfig,
  deleteInterfaceMenuConfig,
  getInterfaceMenuConfigTree,
  getMenuConfigDetail,
  toggleMenuConfigNode,
  previewMenuConfigNode,
  getProtocolClauseConfig,
  saveProtocolClauseConfig,
  getDimensionThList,
  getDimensionDetail,
  getDimensionTableThList,
  getMarketList,
  getDimensionConfig,
  getTestScope,
  getFormList,
  saveTestScope,
  saveDimensionConfig,
  saveDimensions,
  editFinishMenuConfig,
  upgradeMenuConfig,
  getProcessList,
  getGroupList,
  editGroup,
  getAcceptanceCertificateList,
  getAcceptanceVersionList,
  acceptanceUpgrade,
  deleteAcceptance,
  addModifyAcceptanceVersion,
  getAcceptanceVersionDetail,
  saveAcceptanceInterfaceData,
  saveAcceptanceTestScopeData,
  getSelfCheckData,
  downloadSelfCheckData,
  getAcceptanceInterfaceData,
  getAcceptanceTestScopeData,
  uploadSelfCheckFile,
  viewAcceptanceTestScopeData,
  viewAcceptanceInterfaceData,
  deleteAcceptanceVersion,
  downloadTestScopeRuls,
  publishAcceptance,
  downloadSelfCheckKey,
  uploadSelfCheckJson,
  getDigitalCertificateConfigList,
  addDigitalCertificateConfig,
  deleteDigitalCertificateConfig,
  getDigitalCertificateConfigHistory,
  updateDigitalCertificateConfig,
  getDigitalCertificateConfig,
  saveDigitalCertificateConfig
}
