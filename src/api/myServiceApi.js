import request from '@/utils/request'

// 我的服务-获取主列表
export function getMyServiceList(data) {
  return request({
    url: '/institution/myservice/search',
    method: 'post',
    data
  })
}

// 我的服务-获取子列表
export function getMyServiceSonList(data) {
  return request({
    url: '/institution/myservice/searchDown',
    method: 'post',
    data
  })
}

// 我的服务-撤销
export function recallMyService(params) {
  return request({
    url: '/institution/myservice/recall',
    method: 'post',
    params
  })
}

// 我的服务-删除
export function deleteMyService(data) {
  return request({
    url: '/institution/myservice/delete',
    method: 'post',
    data
  })
}

// 流程查看弹窗
export function getProcessView(params) {
  return request({
    url: '/institution/myservice/processview',
    method: 'post',
    params
  })
}

// 审核详情
export function getProcessList(params) {
  return request({
    url: '/grip/process/audit/detail',
    method: 'get',
    params
  })
}

// 验收测试/接口上线-待操作流程列表查询
export function getWaitProcessList(data) {
  return request({
    url: '/grip/proc/wait/operate/list',
    method: 'post',
    data
  })
}

// 网络开通-待操作流程列表查询
export function getWaitNetworkList(data) {
  return request({
    url: '/networkOpening/networkList',
    method: 'post',
    data
  })
}

// 权限变更-待操作流程列表查询
export function getWaitInterfaceTerminationList(data) {
  return request({
    url: '/permChange/list',
    method: 'post',
    data
  })
}

// 获取机构用户信息
export function getOrgUserInfo(params) {
  return request({
    url: '/grip/agency/mgt/user/info/login',
    method: 'get',
    params
  })
}

// 获取系统接入开发机构列表
export function getDevInstiUserList(params) {
  return request({
    url: `/devInstiUserList`,
    method: 'get',
    params
  })
}

// 验收测试-校验
export function checkAcceptanceTest(data) {
  return request({
    url: '/acceptanceTest/getMenuConfigItem/check',
    method: 'post',
    data
  })
}

// 接口上线-校验
export function checkInterfaceOnline(data) {
  return request({
    url: '/interfaceOnline/getMenuConfigItem/check',
    method: 'post',
    data
  })
}

// 权限变更-校验
export function checkPermissionChange(data) {
  return request({
    url: '/permChange/getMenuConfigItem/market/check',
    method: 'post',
    data
  })
}

// 我的服务-测试信息查看
export function getTestInfoDetail(params) {
  return request({
    url: '/getTestInformationInfo',
    method: 'get',
    params
  })
}

export default {
  getMyServiceList,
  getMyServiceSonList,
  recallMyService,
  deleteMyService,
  getProcessView,
  getProcessList,
  getWaitProcessList,
  getWaitNetworkList,
  getWaitInterfaceTerminationList,
  getOrgUserInfo,
  getDevInstiUserList,
  checkAcceptanceTest,
  checkInterfaceOnline,
  checkPermissionChange,
  getTestInfoDetail
}
