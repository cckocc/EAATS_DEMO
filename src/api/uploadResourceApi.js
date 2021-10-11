import request from '@/utils/request'

// �ϴ�CSV
export function csvImport(data) {
  return request({
    url: '/proto/uploadFile/csvimport',
    method: 'post',
    data
  })
}

// �ϴ�SDK
export function sdkImport(data) {
  return request({
    url: '/system/file/uploadFile/uploadsdk',
    method: 'post',
    data
  })
}

// 资源上传 协议标准查询
export function searchCSV(data) {
  return request({
    url: '/proto/searchcsv',
    method: 'POST',
    data
  })
}

// 资源上传 协议标准删除文件
export function deleteCSV(publishTs) {
  return request({
    url: '/proto/deletecsv',
    method: 'POST',
    params: {
      publishTs: publishTs
    }
  })
}

// 获取-资源上传/资源下载-key的list
export function getResourcesKeyList() {
  return request({
    url: '/assets/search/keyInfo',
    method: 'post'
  })
}

// 上传-资源上传文件
export function uploadResourcesFile(data) {
  return request({
    url: '/assets/uploadFile/upload/file',
    method: 'post',
    data: data.data,
    params: data.params
  })
}

// 更新-资源上传文件
export function updateResourcesFile(data) {
  return request({
    url: '/assets/uploadFile/update/file',
    method: 'post',
    data: data.data,
    params: data.params
  })
}

// 获取-资源上传-单个文件版本记录
export function keyHistoryInfo(params) {
  return request({
    url: '/assets/search/keyHistoryInfo',
    method: 'post',
    params
  })
}

// 删除-资源上传-单个文件版本
export function deleteResourcesFile(params) {
  return request({
    url: '/assets/delete/key',
    method: 'post',
    params
  })
}

// 获取-资源上传-更新日志
export function getAllUpdateLog(data) {
  return request({
    url: '/assets/search/allUpdate',
    method: 'post',
    data
  })
}

export default {
  csvImport,
  sdkImport,
  searchCSV,
  deleteCSV,
  getResourcesKeyList,
  uploadResourcesFile,
  updateResourcesFile,
  keyHistoryInfo,
  deleteResourcesFile,
  getAllUpdateLog
}
