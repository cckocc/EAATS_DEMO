import request from '@/utils/request'

// 联系人管理 —— 查询
export function reqQueryMsg(data) {
  return request({
    url: '/emailContacts/manage/queryEmailContacts',
    method: 'post',
    data
  })
}

// 添加
export function reqIncreaseMsg(data) {
  return request({
    url: '/emailContacts/manage/addEmailContacts',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteMsg(data) {
  return request({
    url: 'emailContacts/manage/delEmailContacts',
    method: 'post',
    data
  })
}

// 查询-接口产品树
export function reqGetProductTree(data) {
  return request({
    url: '/emailContacts/manage/query/productTree',
    method: 'post',
    data
  })
}

// 联系人-获取产品接口树
export function reqGetProductTreeNew(data) {
  return request({
    url: '/emailContacts/manage/query/productTreeNew',
    method: 'post',
    data
  })
}

// 添加前-回显勾选产品树
export function reqRebackProductTree(data) {
  return request({
    url: '/emailContacts/manage/query/pitchOnProductTreeNew',
    method: 'post',
    data
  })
}

// 统计查询-获取回显接口产品树
export function reqRebackProductTreeStatic(data) {
  return request({
    url: '/emailContacts/manage/query/pitchOnProductTree',
    method: 'post',
    data
  })
}

// 获取邮箱验证码
export function reqGetEmailCode(data) {
  return request({
    url: '/emailContacts/manage/get/captcha/code',
    method: 'post',
    data
  })
}

// 初始化机构名称
export function initInstInfo() {
  return request({
    url: '/emailContacts/manage/initInstInfo',
    method: 'post'
  })
}
// /emailContacts/manage/menuInstType
// 获取机构身份
export function reqInstiName(data) {
  return request({
    url: '/emailContacts/manage/menuInstType',
    method: 'post',
    data
  })
}

// 点击编辑，回显勾选状态
export function reqEditReback(data) {
  return request({
    url: '/emailContacts/manage/checkState',
    method: 'post',
    data
  })
}

// 编辑
export function reqEditSave(data) {
  return request({
    url: '/emailContacts/manage/editEmailContacts',
    method: 'post',
    data
  })
}

export default {
  reqQueryMsg,
  reqIncreaseMsg,
  reqDeleteMsg,
  reqGetProductTree,

  reqGetProductTreeNew,
  reqRebackProductTree,
  reqRebackProductTreeStatic,

  reqGetEmailCode,
  initInstInfo,
  reqEditReback,
  reqEditSave
}
