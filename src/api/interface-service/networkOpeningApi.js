import request from '@/utils/request'

// 网络开通-校验申请
export function verifyNetworkOpening(data) {
  return request({
    url: '/networkOpening/whetherToPassTheCheck',
    method: 'post',
    data
  })
}

// 网络开通-新增/编辑网络开通申请
export function applyNetworkOpening(data, type) {
  const urlObj = {
    'add': '/networkOpening/addNetworkApply',
    'edit': '/networkOpening/editNetworkApply'
  }
  return request({
    url: urlObj[type],
    method: 'post',
    data
  })
}

// 网络开通-机构端获取编辑回显
export function getOrgNetworkOpeningEdit(data) {
  return request({
    url: '/networkOpening/getNetworkApplyInfo',
    method: 'post',
    data
  })
}

// 网络开通-机构端获取详情
export function getOrgNetworkOpeningDetail(data) {
  return request({
    url: '/networkOpening/getNetworkApplyInfo2',
    method: 'post',
    data
  })
}

// 网络开通-场务端获取详情
export function getGripNetworkOpeningDetail(data) {
  return request({
    url: '/processView/networkAudit/get/networkInfo',
    method: 'post',
    data
  })
}

export default {
  verifyNetworkOpening,
  applyNetworkOpening,
  getOrgNetworkOpeningEdit,
  getOrgNetworkOpeningDetail,
  getGripNetworkOpeningDetail
}
