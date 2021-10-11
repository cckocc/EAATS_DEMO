import request from '@/utils/request'

export function addQuestion(data) { // 场务端新增问题
  return request({
    url: '/faq/add',
    method: 'post',
    data
  })
}
export function fetchQuestionList(data) { // 场务端展示数据
  return request({
    url: '/faq/list',
    method: 'post',
    data
  })
}
export function modifyQuestion(data) { // 场务端修改问题
  return request({
    url: '/faq/edit',
    method: 'post',
    data
  })
}
export function deleteQuestion(id) { // 场务端删除问题
  return request({
    url: '/faq/delete',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function viewQuestion(id) { // 场务端查看问题
  return request({
    url: '/faq/listone',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function fetchtypelist(data) { // 获取问题列表
  return request({
    url: '/agency/faq/typelist',
    method: 'post',
    data
  })
}
export function viewDetail(id) { // 机构端查看问题
  return request({
    url: '/agency/faq/listone',
    method: 'get',
    params: {
      id: id
    }
  })
}

// 获取在线客服iframe的url
export function getOnlineServiceUrl(params) {
  return request({
    url: '/ideal/get/url',
    method: 'get',
    params
  })
}
