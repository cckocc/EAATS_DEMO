import request from '@/utils/request'

// 流程查看-全部列表查询
export function getProcessViewAllList(data) {
  return request({
    url: '/grip/process/view',
    method: 'post',
    data
  })
}

// 流程查看-待审核列表查询
export function getProcessViewWaitList(data) {
  return request({
    url: '/grip/process/await/audit/view',
    method: 'post',
    data
  })
}

// 流程查看-待审核获取子列表
export function getProcessViewWaitSonList(data) {
  return request({
    url: '/grip/process/await/audit/view/sub',
    method: 'post',
    data
  })
}

// 流程查看-获取详情
export function getProcessViewDetail(data) {
  return request({
    url: '/grip/process/await/audit/view/one',
    method: 'post',
    data
  })
}

// 流程查看-流程干预-一键通过/拒绝
export function auditProcessViewInter(data, type) {
  const nameObj = {
    true: 'pass',
    false: 'withdraw'
  }
  return request({
    url: `/grip/process/await/audit/admin/audit/do/${nameObj[type]}`,
    method: 'post',
    data
  })
}

// 流程查看-审核
export function auditProcessView(data) {
  return request({
    url: '/grip/process/await/audit/audit/do',
    method: 'post',
    data
  })
}

// 流程查看-释放
export function releaseProcessView(data) {
  return request({
    url: '/grip/acceptanceTest/quotaRelease',
    method: 'post',
    data
  })
}

// 流程查看-回撤
export function retraceProcessView(data) {
  return request({
    url: '/grip/acceptanceTest/report/retrace',
    method: 'post',
    data
  })
}

// 流程查看-测试信息查看
export function getTestInfoDetail(data) {
  return request({
    url: '/baseManagement/testInformationConf/echo/echoTestInformationInfo',
    method: 'post',
    data
  })
}

// 流程查看-测试信息提交
export function submitTestInfo(data) {
  return request({
    url: '/baseManagement/testInformationConf/save/saveTestInformationInfo',
    method: 'post',
    data
  })
}

// 流程查看-获取可回退的节点信息
export function getRollbackNode(params) {
  return request({
    url: '/grip/process/await/audit/get/back/node',
    method: 'get',
    params
  })
}

// 流程查看-回退
export function rollbackNode(data) {
  return request({
    url: '/grip/process/await/audit/back/do',
    method: 'post',
    data
  })
}

// 流程查看-批量导出JSON
export function exportJson(data) {
  return request({
    url: '/acceptanceTest/export/date/eaats/json',
    method: 'post',
    responseType: 'blob',
    isToJson: true,
    data
  })
}

// 获取验收人列表
export function getAccepterList() {
  return request({
    url: '/remaining/accepter',
    method: 'get'
  })
}

// 获取验收人列表
export function getAuditStatus(type) {
  const urlObj = {
    'true': '/register/enum/await/auditStatus',
    'false': '/register/enum/all/auditStatus'
  }
  return request({
    url: urlObj[type],
    method: 'post'
  })
}

export default {
  getProcessViewAllList,
  getProcessViewWaitList,
  getProcessViewWaitSonList,
  getProcessViewDetail,
  auditProcessViewInter,
  auditProcessView,
  releaseProcessView,
  retraceProcessView,
  getTestInfoDetail,
  submitTestInfo,
  getRollbackNode,
  rollbackNode,
  exportJson,
  getAccepterList,
  getAuditStatus
}
