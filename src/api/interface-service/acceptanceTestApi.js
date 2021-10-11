import request from '@/utils/request'

// 校验申请权限
export function checkApplyPermission(data) {
  return request({
    url: '/acceptanceTest/check/applyPermission',
    method: 'post',
    data
  })
}
// 保存申请权限
// 获取formId以供后续接口调用
export function saveApplyPermission(data) {
  return request({
    url: '/acceptanceTest/save/applyPermission',
    method: 'post',
    data
  })
}
// [验收测试-时间选择]
// 根据日期和申请单，查询验收人
export function reqAccepter(data) {
  return request({
    url: '/accepter/test/query/timing',
    method: 'post',
    data
  })
}

// 获取菜单配置项
export function getMenuConfigItem(data) {
  return request({
    url: '/acceptanceTest/getMenuConfigItem',
    method: 'post',
    data
  })
}
// 保存API环境-返回自查清单
export function saveApiContent(data) {
  return request({
    url: '/acceptanceTest/save/apiContent',
    method: 'post',
    data
  })
}
// 保存基础信息
export function saveBaseInfo(data) {
  return request({
    url: '/acceptanceTest/save/baseInfo',
    method: 'post',
    data
  })
}
// 保存自查清单
export function saveSelfCheck(data) {
  return request({
    url: '/acceptanceTest/save/selfCheck',
    method: 'post',
    data
  })
}
// 保存接口服务内容
export function saveServiceContent(data) {
  return request({
    url: 'acceptanceTest/save/serviceContent',
    method: 'post',
    data
  })
}
// 获取验收测试时间配置及剩余库存
export function getTimeAndStock(params) {
  return request({
    url: '/acceptanceTest/get/time',
    method: 'get',
    params
  })
}

// 选择验收测试开始时间
export function selectStartTime(data) {
  return request({
    url: '/acceptanceTest/check/start/time',
    method: 'post',
    data
  })
}

// 选择验收测试开始时间
export function selectEndTime(data) {
  return request({
    url: '/acceptanceTest/check/end/time',
    method: 'post',
    data
  })
}
// 验收测试-详情
export function getAcceptanceTestDetail(params) {
  return request({
    url: '/acceptanceTest/detail',
    method: 'get',
    params
  })
}
// 流程查看-测试报告审核详情
export function getTestReportDetail(params) {
  return request({
    url: '/grip/acceptanceTest/report/detail',
    method: 'get',
    params
  })
}
// 上传内部测试报告
export function uploadReport(data) {
  return request({
    url: '/acceptanceTest/uploadFile/upload/internal/report',
    method: 'post',
    data
  })
}
// 下载模板
export function downloadTemplate(params) {
  return request({
    // url: `/acceptanceTest/download/report?formId=${params.formId}&&fileName=${params.fileName}`,
    url: `/acceptanceTest/download/report`,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 下载测试报告模板
export function downloadTestReport(params) {
  return request({
    url: '/acceptanceTest/download/testReport',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 导出验收申请单
export function downloadAcceptanceTestForm(params) {
  return request({
    url: '/acceptanceTest/fill',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 导出验收json
export function downloadAcceptanceTestJson(params) {
  return request({
    url: '/acceptanceTest/export/eaats/json',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 验收测试-场务端-上传测试报告
export function uploadGripReport(data) {
  return request({
    url: '/grip/acceptanceTest/uploadFile/upload/report/v2',
    method: 'post',
    data
  })
}
// 验收测试-场务端-审核
export function AuditGripAcceptanceTest(data) {
  return request({
    url: '/grip/acceptanceTest/audit/test',
    method: 'post',
    data
  })
}
// 验收测试-场务端-测试报告审核
export function AuditGripTestAcceptanceTest(data) {
  return request({
    url: '/grip/acceptanceTest/audit/report',
    method: 'post',
    data
  })
}
// 取消选择时间 - 将开始时间与结束时间全清空 且将剩余数量释放
export function cancelTime(data) {
  return request({
    url: '/acceptanceTest/cancel/time',
    method: 'post',
    data
  })
}
// 验收测试-查看原因
export function getAcceptanceTestReason(params) {
  return request({
    url: '/acceptanceTest/view/reason',
    method: 'get',
    params
  })
}
// 我的服务-查看-详情
export function getAcceptanceDetail(params) {
  return request({
    url: '/acceptanceTest/single/detail',
    method: 'get',
    params
  })
}

// 机构端，展示已发布的评分模板信息
export function reqShowScoreTempleteMsg() {
  return request({
    url: '/accepter/grade/statistics/query/insti/gradeRecord',
    method: 'post'
  })
}

// 机构端，新增评分记录
export function reqIncreaseScoreRecord(data) {
  return request({
    url: '/accepter/grade/statistics/saveGradeRecord',
    method: 'post',
    data
  })
}

// 验收测试-时间选择
// /accepter/test/candidateUpdate
export function candidateUpdate(data) {
  return request({
    url: '/accepter/test/candidateUpdate',
    method: 'post',
    data
  })
}

export default {
  getAcceptanceDetail,
  checkApplyPermission,
  saveApplyPermission,
  getMenuConfigItem,
  saveApiContent,
  saveBaseInfo,
  saveSelfCheck,
  saveServiceContent,
  getTimeAndStock,
  selectStartTime,
  selectEndTime,
  uploadReport,
  downloadTemplate,
  downloadTestReport,
  getAcceptanceTestDetail,
  downloadAcceptanceTestForm,
  downloadAcceptanceTestJson,
  uploadGripReport,
  AuditGripAcceptanceTest,
  AuditGripTestAcceptanceTest,
  getAcceptanceTestReason,
  getTestReportDetail,
  cancelTime,
  reqShowScoreTempleteMsg,
  reqIncreaseScoreRecord,
  candidateUpdate
}
