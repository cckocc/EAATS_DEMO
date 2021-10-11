import request from '@/utils/request'

// 查询用户列表
export function fetchList(data) {
  return request({
    url: '/agency/sys/user/mgt/search/user/info',
    method: 'post',
    data
  })
}

// 新增用户
export function addUserInfo(data) {
  return request({
    url: '/agency/sys/user/mgt/save',
    method: 'post',
    data
  })
}

// 修改用户信息
export function userInfoSave(data, type) {
  const url = type === 'add' ? '/agency/sys/user/mgt/save' : '/agency/sys/user/mgt/update/user/info'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: '/agency/sys/user/mgt/get/user/info/userId',
    method: 'get',
    params
  })
}

// 停用用户
export function disableUser(params) {
  return request({
    url: '/agency/sys/user/mgt/disable/userId',
    method: 'get',
    params
  })
}

// 启用用户
export function enableUser(params) {
  return request({
    url: '/agency/sys/user/mgt/enable/userId',
    method: 'get',
    params
  })
}

// 重置密码
export function resetPassword(params) {
  return request({
    url: '/agency/sys/user/mgt/reset/pwd/userId',
    method: 'get',
    params
  })
}

// 审核用户
export function auditUser(data) {
  return request({
    url: '/agency/sys/user/mgt/auditUserInfo',
    method: 'post',
    data
  })
}

export default {
  fetchList,
  addUserInfo,
  userInfoSave,
  getUserInfo,
  disableUser,
  enableUser,
  resetPassword,
  auditUser
}
