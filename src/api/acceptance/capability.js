import request from '@/utils/request'
// catherine
// 验收能力查询
export function acceptanceCapability(data) {
  return request({
    url: '/accepter/capacity/query',
    method: 'post',
    data
  })
}

// 验收能力导出excel
export function OutputExcel(params) {
  return request({
    url: '/accepter/capacity/download/export',
    method: 'post',
    params
  })
}

export function getFormList(data) {
  return request({
    url: '/from/config/query',
    method: 'post',
    data
  })
}

// 初始化验收单名称

export function reqGetInitFormName() {
  return request({
    url: '/accepter/emergency/initFormName',
    method: 'post'
  })
}

export default {
  acceptanceCapability,
  OutputExcel,
  getFormList,
  reqGetInitFormName
}
