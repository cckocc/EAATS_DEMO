import request from '@/utils/request'

// 获取所有菜单-权限变更
export function getApiMenuConfigItem(data) {
  return request({
    url: '/interfaceOnline/perm/getMenuConfigItem',
    method: 'post',
    data
  })
}

// 获取所有菜单
export function getMenuConfigItem(data) {
  return request({
    url: '/interfaceOnline/getMenuConfigItem',
    method: 'post',
    data
  })
}

// 接口上线-申请权限
export function saveApplyPermission(data) {
  return request({
    url: '/interfaceOnline/saveApplyPermission',
    method: 'post',
    data
  })
}
// 接口上线-保存基础信息
export function saveBaseInfo(data) {
  return request({
    url: '/interfaceOnline/saveBaseInfo',
    method: 'post',
    data
  })
}

// 接口上线-详情
export function getServiceOnlineDetail(params, type) {
  const url = type === '20' ? '/interfaceOnline/perm/getServiceApplyInfo' : '/interfaceOnline/getServiceApplyInfo'
  return request({
    url: url,
    method: 'get',
    params
  })
}

// 接口上线-是否最后一个审核人
export function getLastAuditUserFlag(params) {
  return request({
    url: '/grip/process/await/audit/validate/last/task',
    method: 'get',
    params
  })
}

export default {
  getApiMenuConfigItem,
  getMenuConfigItem,
  saveApplyPermission,
  saveBaseInfo,
  getServiceOnlineDetail,
  getLastAuditUserFlag
}
