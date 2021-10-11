import request from '@/utils/request'

// 获取机构基础信息
export function fetchInfo(params) {
  return request({
    url: '/agency/search/simpleinfo',
    method: 'get',
    params
  })
}

// 修改机构基础信息
export function updateInfo(data) {
  return request({
    url: '/agency/add/simpleinfo',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/system/file/uploadFile/upload/tourist',
    method: 'post',
    data
  })
}

// 下载文件
export function fileDownload(id) {
  return request({
    url: '/system/file/download/tourist',
    method: 'get',
    params: {
      fileId: id
    },
    responseType: 'blob'
  })
}

// 机构接口信息查询
export function interfaceInfo(data) {
  return request({
    url: '/institution/interface/search/listInfo',
    method: 'post',
    data
  })
}

// 获取产品类型/市场可枚举值
export function getProductMarket(data) {
  return request({
    url: '/institution/myservice/productmarket/search',
    method: 'post',
    data
  })
}

// 获取中国外汇交易中心系统接入开发机构管理办法
export function getCluseContent() {
  return request({
    url: '/agency/queryClause',
    method: 'get'
  })
}

export default {
  fetchInfo,
  updateInfo,
  uploadFile,
  fileDownload,
  interfaceInfo,
  getProductMarket,
  getCluseContent
}
