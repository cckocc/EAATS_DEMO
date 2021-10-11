import request from '@/utils/request'

// 机构端注册
export function register(data) {
  return request({
    url: '/register/do',
    method: 'post',
    data
  })
}

// 机构类型枚举
export function getOrgTypeList() {
  return request({
    url: '/register/enum/instiType',
    method: 'post'
  })
}

// 搜索机构名称
export function searchOrgByName() {
  return request({
    url: '/register/initInstName',
    method: 'post'
  })
}

// 搜索机构名称
export function getOrgKeyInfoById(data) {
  return request({
    url: '/register/queryInstnIdentity',
    method: 'post',
    data
  })
}

export default {
  register,
  getOrgTypeList,
  searchOrgByName,
  getOrgKeyInfoById
}
