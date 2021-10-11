// 基础数据配置
import request from '@/utils/request'

// 基础信息配置-查询树
export function getTreeNodes(data) {
  return request({
    url: '/baseManagement/get/getNodeTree',
    method: 'post',
    data
  })
}

// 网络开通目标地址配置-获取列表
export function getNetworkOpeningConfigList(data) {
  return request({
    url: '/baseManagement/networkGoalAddressConf/get/getGoalAddressList',
    method: 'post',
    data
  })
}

// 网络开通目标地址配置-新增/编辑
export function saveNetworkOpeningConfig(data, type) {
  const url = type === 'add' ? '/baseManagement/networkGoalAddressConf/add/addGoalAddress' : '/baseManagement/networkGoalAddressConf/update/updateGoalAddress'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 网络开通目标地址配置-删除
export function deleteNetworkOpeningConfig(data) {
  return request({
    url: '/baseManagement/networkGoalAddressConf/delete/deleteGoalAddress',
    method: 'post',
    data
  })
}

// 网络开通目标地址配置-获取详情
export function getNetworkOpeningConfigDetail(data) {
  return request({
    url: '/baseManagement/networkGoalAddressConf/get/getGoalAddressInfo',
    method: 'post',
    data
  })
}

// 防火墙配置-获取列表
export function getFirewallConfigList(data) {
  return request({
    url: '/baseManagement/firewallConf/get/getFirewallList',
    method: 'post',
    data
  })
}

// 防火墙配置-新增/编辑
export function saveFirewallConfig(data, type) {
  const url = type === 'add' ? 'baseManagement/firewallConf/add/addFirewall' : '/baseManagement/firewallConf/update/updateFirewall'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 防火墙配置-删除
export function deleteFirewallConfig(data) {
  return request({
    url: '/baseManagement/firewallConf/delete/deleteFirewall',
    method: 'post',
    data
  })
}

// 防火墙配置-获取详情
export function getFirewallConfigDetail(data) {
  return request({
    url: '/baseManagement/firewallConf/get/getFirewallInfo',
    method: 'post',
    data
  })
}

// 测试信息配置-获取列表
export function getTestInfoConfigList(data) {
  return request({
    url: '/baseManagement/testInformationConf/get/getTestInformationList',
    method: 'post',
    data
  })
}

// 测试信息配置-新增/编辑
export function saveTestInfoConfig(data, type) {
  const url = type === 'add' ? 'baseManagement/testInformationConf/add/addTestInformation' : '/baseManagement/testInformationConf/update/updateTestInformation'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 测试信息配置-删除
export function deleteTestInfoConfig(data) {
  return request({
    url: '/baseManagement/testInformationConf/delete/deleteTestInformation',
    method: 'post',
    data
  })
}

// 测试信息配置-获取详情
export function getTestInfoConfigDetail(data) {
  return request({
    url: '/baseManagement/testInformationConf/get/getTestInformationInfo',
    method: 'post',
    data
  })
}

// 服务简介配置-获取
export function getServiceIntro(data) {
  return request({
    url: '/service/introduction/get/introductionInfo',
    method: 'post',
    data
  })
}

// 服务简介配置-发布
export function updateServiceIntro(data) {
  return request({
    url: '/service/introduction/release/introductionInfo',
    method: 'post',
    data
  })
}
// 机构端服务简介-获取
export function getOrgServiceIntro(data) {
  return request({
    url: '/get/introductionInfo',
    method: 'post',
    data
  })
}

export default {
  getTreeNodes,
  getNetworkOpeningConfigList,
  saveNetworkOpeningConfig,
  deleteNetworkOpeningConfig,
  getNetworkOpeningConfigDetail,
  getFirewallConfigList,
  saveFirewallConfig,
  deleteFirewallConfig,
  getFirewallConfigDetail,
  getTestInfoConfigList,
  saveTestInfoConfig,
  deleteTestInfoConfig,
  getTestInfoConfigDetail,
  getServiceIntro,
  updateServiceIntro,
  getOrgServiceIntro
}
