import request from '@/utils/request'

// 验收单功能模块配置-查询验收单
export function queryAcceptanceList(data) {
  return request({
    url: '/from/config/queryNoPage',
    method: 'post',
    data
  })
}

// 验收单功能模块配置-修改等级
export function modifyLevel(data) {
  return request({
    url: '/from/config/edit/le',
    method: 'post',
    data
  })
}

// 批量保存验收功能模块信息
export function saveFunction(data) {
  return request({
    url: '/from/config/edit/le',
    method: 'post',
    data
  })
}

export default {
  queryAcceptanceList,
  modifyLevel
}
