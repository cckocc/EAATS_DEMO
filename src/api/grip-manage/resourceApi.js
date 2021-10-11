import request from '@/utils/request'
// 资源上传

// 查询 资源上传列表
export function getResourceUploadList(data) {
  return request({
    url: '/resource/upload/list',
    method: 'post',
    data
  })
}

// 通过id获取文件列表
export function getFileListById(params) {
  return request({
    url: '/resource/upload/file/list',
    method: 'get',
    params
  })
}

// 上传/更新 资源文件
export function uploadResourceUploadFile(data, type) {
  const url = type === 'resourceUpload' ? '/resource/upload/save' : 'resource/upload/update'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 删除 文件
export function deleteResourceUploadFile(params) {
  return request({
    url: '/resource/upload/delete',
    method: 'get',
    params
  })
}

// 查询 接口类型列表
export function getInterfaceTypeList(params) {
  return request({
    url: '/resource/node-type/list',
    method: 'get',
    params
  })
}

// 保存 接口类型
export function saveInterfaceType(data) {
  return request({
    url: '/resource/node-type/save',
    method: 'post',
    data
  })
}

// 查询 版本记录列表
export function getVersionRecordList(params) {
  return request({
    url: '/resource/upload/version',
    method: 'get',
    params
  })
}

// 查询 更多查看列表
export function getMoreViewList(params) {
  return request({
    url: '/resource/upload/more',
    method: 'get',
    params
  })
}

// 查询 查看节点树
export function getNodesView(params) {
  return request({
    url: '/resource/node-type/nodes/view',
    method: 'get',
    params
  })
}

// 查询 编辑节点树
export function getNodesEdit(data) {
  return request({
    url: '/resource/node-type/nodes/edit',
    method: 'post',
    data
  })
}

// 查询 编辑节点树
export function saveNodesEdit(data) {
  return request({
    url: '/resource/node-type/nodes/save',
    method: 'post',
    data
  })
}

// 查询 公告
export function getNotoce(params) {
  return request({
    url: '/resource/notice/view',
    method: 'get',
    params
  })
}

// 查询 编辑节点树
export function saveNotoce(data) {
  return request({
    url: '/resource/notice/save',
    method: 'post',
    data
  })
}

// 移动资源
export function moveResource(params) {
  return request({
    url: '/resource/upload/move',
    method: 'get',
    params
  })
}

export default {
  getResourceUploadList,
  getFileListById,
  uploadResourceUploadFile,
  deleteResourceUploadFile,
  getInterfaceTypeList,
  saveInterfaceType,
  getVersionRecordList,
  getMoreViewList,
  getNodesView,
  getNodesEdit,
  saveNodesEdit,
  getNotoce,
  saveNotoce,
  moveResource
}
