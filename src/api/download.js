import request from '@/utils/request'

// 获取市场机构资源下载列表
export function getInterfaceList(data) {
  return request({
    url: `/resource/upload/list`,
    method: 'post',
    data
  })
}

// 获取文件下载列表
export function getFileList(resourceVersionId) {
  return request({
    url: '/resource/upload/file/list',
    method: 'get',
    params: { resourceVersionId }
  })
}

// 获取节点树
export function getMenuConfig(data) {
  return request({
    url: `/resource/node-type/nodes/search`,
    method: 'post',
    data
  })
}

// 获取版本记录
export function getVersionList(resourceId) {
  return request({
    url: '/resource/upload/version',
    method: 'get',
    params: { resourceId }
  })
}

// 获取接口产品下拉框
export function getInterfaceProductList() {
  return request({
    url: `/manage/menu/config/select/cacheProduct`,
    method: 'get'
  })
}

// 获取公告
export function getNotice() {
  return request({
    url: `/resource/notice/view`,
    method: 'get'
  })
}

// 获取协议条款列表
export function getAgreement(params) {
  return request({
    url: '/resource/agreement-terms/list',
    method: 'get',
    params
  })
}

// 获取desc
export function getDescList(nodeTypeId) {
  return request({
    url: '/resource/node-type/desc',
    method: 'get',
    params: { nodeTypeId }
  })
}
