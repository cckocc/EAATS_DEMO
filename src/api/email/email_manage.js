import request from '@/utils/request'

// 邮箱订阅管理API

// 查询
export function getQuerySubscription(data) {
  return request({
    url: '/emailContacts/subscription/querySubscription',
    method: 'post',
    data
  })
}

// 禁用/激活 自动邮件
export function reqDisActEmail(data) {
  return request({
    url: '/auto/email/edit/switchAutoEmailStatus',
    method: 'post',
    data
  })
}

// 获取手动、自动邮件列表 getAutoEmalList
export function getAutoEmalList(data) {
  return request({
    url: '/auto/email/get/getEmailList',
    method: 'post',
    data
  })
}
// 调用查看详细发送情况接口 getHandEmailDetailList
export function getHandEmailDetailList(data) {
  return request({
    url: '/auto/email/get/getManualEmailSendDetails',
    method: 'post',
    data
  })
}
// 查询订阅邮件类型类型模板 getEmailTypeList
export function getEmailTypeList(data) {
  return request({
    url: '/email/template/get/getEmailTemplateList',
    method: 'post',
    data
  })
}
// 保存邮件模板
export function saveTemplate(data) {
  return request({
    url: '/email/template/add/addEmailTemplate',
    method: 'post',
    data
  })
}
// 根据id查询邮件模板详细信息
export function getTemplateDetialInfo(data) {
  return request({
    url: '/email/template/get/getEmailTemplateInfo',
    method: 'post',
    data
  })
}

// 新建邮件
export function newSwitchAutoEmail(data) {
  return request({
    url: '/email/template/get/getEmailTemplateInfo',
    method: 'post',
    data
  })
}
// 查询自动邮件节点信息
export function getEmailTemplateInfo(data) {
  return request({
    url: '/auto/email/get/getNodeList',
    method: 'post',
    data
  })
}

// 查询手动邮件联系人机构端
export function getPeopleTree(data) {
  return request({
    url: '/emailContacts/manage/getPeopleTree',
    method: 'post',
    data
  })
}
// 查询手动邮件联系人 （场务端）
export function getPeopleTreeNoInst(data) {
  return request({
    url: '/emailContacts/manage/getPeopleTreeNoInst',
    method: 'post',
    data
  })
}

// /cass/mgt/email/template/delete/deleteEmailTemplate
// 删除订阅邮件类型模板
export function deleteEmailTemplate(data) {
  return request({
    url: '/email/template/delete/deleteEmailTemplate',
    method: 'post',
    data
  })
}
// 新建订阅邮件类型模板
export function addEmailTemplate(data) {
  return request({
    url: '/email/template/add/addEmailTemplate',
    method: 'post',
    data
  })
}
// 编辑订阅邮件类型模板
export function editEmailTemplate(data) {
  return request({
    url: '/email/template/edit/editEmailTemplate',
    method: 'post',
    data
  })
}
// /auto/email/save/addEmail
// 新建邮件
export function addEmailNext(data) {
  return request({
    url: '/auto/email/save/addEmail',
    method: 'post',
    data
  })
}

// 新建/发布_邮件
export function addEmailMessage(data) {
  return request({
    url: '/auto/email/save/addEmailMessage',
    method: 'post',
    data
  })
}

// 新建自动邮件
export function addOrEditAutoEmailManage(data) {
  return request({
    url: '/auto/email/save/addOrEditAutoEmailManage',
    method: 'post',
    data
  })
}

// 编辑-订阅信息
export function editSubscription(data) {
  return request({
    url: '/emailContacts/subscription/editSubscription',
    method: 'post',
    data
  })
}

export function getEmailInfo(data) {
  return request({
    url: '/auto/email/get/getEmailInfo',
    method: 'post',
    data
  })
}

// 订阅邮件类型
export function getTemplateList(data) {
  return request({
    url: '/email/template/get/getSubscriptionEmailTemplateListNoPage',
    method: 'post',
    data
  })
}

// 手动/自动邮箱回显富文本
export function getEmailTemplateInfoPage2(data) {
  return request({
    url: '/auto/email/get/getEmailTemplateInfoPage',
    method: 'post',
    data
  })
}

// /auto/email/save/addOrEditManualEmailManage
// 新建/保存手动邮件第一步
export function addOrEditManualEmailManage(data) {
  return request({
    url: '/auto/email/save/addOrEditManualEmailManage',
    method: 'post',
    data
  })
}

// 查询-当前用户,订阅节点的展示状态
export function queryConfigShow(data) {
  return request({
    url: '/emailContacts/subscription/queryConfigShow',
    method: 'post',
    data
  })
}

export function editConfigShow(data) {
  return request({
    url: '/emailContacts/subscription/editConfigShow',
    method: 'post',
    data
  })
}

// 手动邮件详情表导出接口
export function detailDownload(data) {
  return request({
    url: '/auto/email/download',
    method: 'post',
    data
  })
}

// 保存或者发布_邮件_第二步
export function saveOrReleaseEmail(data) {
  return request({
    url: '/auto/email/save/saveOrReleaseEmail',
    method: 'post',
    data
  })
}

// 插入元素
export function reqInsertElements(data) {
  return request({
    url: '/emailAtomic/getAtomic',
    method: 'post',
    data
  })
}

// 搜索当前树
export function getSearchPeopleTree(data) {
  return request({
    url: '/emailContacts/manage/getConditionsSearchPeopleTree',
    method: 'post',
    data
  })
}
// 删除节点
export function delTreeNode(data) {
  return request({
    url: '/emailContacts/manage/deletePeopleTree',
    method: 'post',
    data
  })
}
// 获取联系人中未订阅消息的人
export function getNoDYPeopleList(data) {
  return request({
    url: '/emailContacts/manage/getPeopleTreeNoDy',
    method: 'post',
    data
  })
}

export default {
  reqInsertElements,
  reqDisActEmail,
  getAutoEmalList,
  getHandEmailDetailList,
  getEmailTypeList,
  saveTemplate,
  getEmailTemplateInfo,
  getPeopleTree,
  deleteEmailTemplate,
  addEmailTemplate,
  editEmailTemplate,
  addEmailNext,
  getQuerySubscription,
  editSubscription,
  getEmailInfo,
  getEmailTemplateInfoPage2,
  queryConfigShow,
  editConfigShow,
  detailDownload,
  saveOrReleaseEmail,
  getSearchPeopleTree,
  getNoDYPeopleList
}
