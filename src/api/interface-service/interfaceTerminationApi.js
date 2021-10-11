import request from '@/utils/request'

// 权限变更-获取接口树
export function getMenuConfigItem(data) {
  return request({
    url: '/permChange/getMenuConfigItem/market',
    method: 'post',
    data
  })
}

// 权限变更-保存申请权限校验
export function checkSaveApplyPermission(data) {
  return request({
    url: `/permChange/save/applyPermission/check`,
    method: 'post',
    data
  })
}

// 权限变更-保存申请权限
export function saveApplyPermission(data) {
  return request({
    url: `/permChange/save/applyPermission`,
    method: 'post',
    data
  })
}

// 权限变更-保存基础信息
export function submitPermChange(data) {
  return request({
    url: `/permChange/submit`,
    method: 'post',
    data
  })
}

// 权限变更-查看
export function permChangeDetail(params) {
  return request({
    url: `/permChange/detail`,
    method: 'get',
    params
  })
}

export default {
  getMenuConfigItem,
  checkSaveApplyPermission,
  saveApplyPermission,
  submitPermChange,
  permChangeDetail
}
