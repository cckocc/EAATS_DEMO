import request from '@/utils/request'

// 机构端 ISV看板 —— 下拉框
export function reqGetSelectOption(data) {
  return request({
    url: '/isvOrgan/isvKanban/kanbanSelect',
    method: 'post',
    data
  })
}

// 机构端 ISV看板 —— 根据条件查询
export function reqQueryResult(data) {
  return request({
    url: '/isvOrgan/isvKanban/initPage',
    method: 'post',
    data
  })
}

// ----------------------------------------------------    机构端 ISV管理   --------------------------------------------------
// 初始化 机构信息查询
export function reqQueryInstiInfo() {
  return request({
    url: '/isvOrgan/isv_manage/queryDetails',
    method: 'post'
  })
}

// 机构信息编辑
export function reqEditInstiInfo(data) {
  return request({
    url: '/isvOrgan/isv_manage/EditDetails',
    method: 'post',
    data
  })
}

// 机构端 接口产品树编辑
export function reqEditProductTree(data) {
  return request({
    url: '/isvOrgan/isv_manage/editTree',
    method: 'post',
    data
  })
}

// isv管理  ——  附件上传
export function reqUploadFiles(data) {
  return request({
    url: '/isvOrgan/isv_manage/uploadIsvFile',
    method: 'post',
    data
  })
}


export function reqGetInterListInsti(data) {
  return request({
    url: '/isvOrgan/isvKanban/queryDetails',
    method: 'post',
    data
  })
}
// ----------------------------------------------------    场务端 ISV管理   --------------------------------------------------
// 场务端 ISV管理 —— 获取接口产品列表
export function reqGetInterfaceList(data) {
  return request({
    url: '/isvFacility/isvKanban/kanbanSelect',
    method: 'post',
    data
  })
}

// 场务端—— 支持接口产品树
export function reqGetInterList(data) {
  return request({
    url: '/isvFacility/isvManage/queryDetail',
    method: 'post',
    data
  })
}

// 场务端 ISV管理 —— 查询
export function reqQueryInsit(data) {
  return request({
    url: '/isvFacility/isvManage/isvQuery',
    method: 'post',
    data
  })
}

// 场务端 接口产品数编辑
export function reqEditProductTreeInsti(data) {
  return request({
    url: '/isvFacility/isvManage/editTree',
    // /isvFacility/isvManage/editTree
    method: 'post',
    data
  })
}
// ----------------------------------------------------    展示信息审核   --------------------------------------------------
// 查询 —— 获取审核列表
export function reqGetExamList(data) {
  return request({
    url: '/isvFacility/isvManage/displayDetailQuery',
    method: 'post',
    data
  })
}

// 审核/查看对话框 获取该机构信息
export function reqGetInstiInfo(data) {
  return request({
    url: '/isvFacility/isvManage/displayDetailCheck',
    method: 'post',
    data
  })
}

// 提交审核操作（通过/拒绝）
export function reqOptionExam(data) {
  return request({
    url: '/isvFacility/isvManage/displayDetailExam',
    method: 'post',
    data
  })
}

// 审核附件下载
export function reqDownLoadFiles(id) {
  return request({
    url: '/isvFacility/isvManage/download',
    method: 'get',
    params: {
      fileId: id
    },
    responseType: 'blob'
  })
}

// 附件删除
export function reqDeleteFiles(data) {
  return request({
    url: '/isvOrgan/isv_manage/deleteFile',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// --------------------------------------------  ISV证书  -----------------------------------------------------
// 机构端isv证书查询
export function reqQueryCert(data) {
  return request({
    url: '/certificate/organ/certList', 
    method: 'post',
    data
  })
}

// 场务端——查询证书
export function reqQueryCertificate(data) {
  return request({
    url: '/certificate/facility/certList',
    method: 'post',
    data
  })
}

// 场务端——新增证书
export function addCertificate(data) {
  return request({
    url: '/certificate/facility/addDetail',
    method: 'post',
    data
  })
}

// 场务端——编辑证书
export function editCertificate(data) {
  return request({
    url: '/certificate/facility/editSave',
    method: 'post',
    data
  })
}

// 场务端——删除证书
export function deleteCertificate(data) {
  return request({
    url: '/certificate/facility/deleteCert',
    method: 'post',
    data
  })
}

export default {
  reqGetSelectOption,
  reqQueryResult,

  // -------确认接口
  reqQueryInstiInfo,
  reqGetInterfaceList,
  reqGetInterList,
  reqQueryInsit,
  reqGetExamList,
  reqGetInstiInfo,
  reqOptionExam,
  reqDownLoadFiles,
  reqDeleteFiles,
  reqEditInstiInfo,
  reqEditProductTree,
  reqUploadFiles,
  reqGetInterListInsti,

  reqQueryCert,
  reqQueryCertificate,
  addCertificate,
  editCertificate,
  deleteCertificate
}
