import request from '@/utils/request'

// 验收人员配置-查询所有可验收人员
export function getPersonList(data) {
  return request({
    url: '/accepter/manage/search/accepterInfo',
    method: 'post',
    data
  })
}

// 验收人员应急修改列表
export function getEmergencyList(data) {
  return request({
    url: '/accepter/emergency/query',
    method: 'post',
    data
  })
}

// 验收人员应急修改弹窗下拉框列表
export function getModifyPersonList(data) {
  return request({
    url: '/accepter/emergency/initName',
    method: 'post',
    data
  })
}

// 验收人员应急修改确认按钮
export function editEmergency(data) {
  return request({
    url: '/accepter/emergency/edit',
    method: 'post',
    data
  })
}

// 验收人员应急修改验收单下拉框
export function getFormIdList() {
  return request({
    url: '/accepter/emergency/initFormName',
    method: 'post'
  })
}

// 验收人员配置支持接收单列表
export function getAccepterFormList(data) {
  return request({
    url: '/accepter/manage/query/accepterFromConf?id=' + data,
    method: 'post'
  })
}

// 保存验收人信息
export function editPersonForm(data) {
  return request({
    url: '/accepter/manage/edit',
    method: 'post',
    data
  })
}

// /accepter/manage/query/accepter
// 根据id查验收人信息

export function reqGetAccepterMessage(data) {
  return request({
    url: '/accepter/manage/query/accepter?id=' + data,
    method: 'post'
  })
}

// 删除验收人
export function delAccepter(data) {
  return request({
    url: '/accepter/manage/del/accepter?id=' + data,
    method: 'post'
  })
}

// 添加验收人员列表
export function getAuthPerson(data) {
  return request({
    url: '/accepter/manage/query/auth',
    method: 'post',
    data
  })
}

// 添加验收人员接口
export function addAccepterFun(data) {
  return request({
    url: '/accepter/manage/save',
    method: 'post',
    data
  })
}

export default {
  getPersonList,
  getEmergencyList,
  getModifyPersonList,
  editEmergency,
  getAccepterFormList,
  editPersonForm,
  delAccepter,
  getAuthPerson,
  reqGetAccepterMessage
}
