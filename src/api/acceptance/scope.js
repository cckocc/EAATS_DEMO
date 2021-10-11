import request from '@/utils/request'

// 删除选项接口
export function delConfigRowFunction(data) {
  return request({
    url: '/accepter/grade/config/deleteOptions',
    method: 'post',
    data
  })
}
// 全量发布
export function publishModelFunction() {
  return request({
    url: '/accepter/grade/config/publishAll',
    method: 'post'
  })
}

// 查询已发布问题模板记录
export function getOnlineViewList() {
  return request({
    url: '/accepter/grade/statistics/query/insti/gradeRecord',
    method: 'post'
  })
}

// 查询问题模板预览需要数据 getViewList
export function getViewList() {
  return request({
    url: '/accepter/grade/config/query/gradeInfo',
    method: 'post'
  })
}

// 查询问题
export function getQuestonist() {
  return request({
    url: '/accepter/grade/config/query/all',
    method: 'post'
  })
}

// 保存评分问题模板
export function saveQuestion(data) {
  return request({
    url: '/accepter/grade/config/save',
    method: 'post',
    data
  })
}

// 删除问题
export function delQuestion(data) {
  return request({
    url: '/accepter/grade/config/delete',
    method: 'post',
    data
  })
}
// 编辑问题
export function editQuestion(data) {
  return request({
    url: '/accepter/grade/config/edit',
    method: 'post',
    data
  })
}

// 获取选项配置列表
export function getConfigList(data) {
  return request({
    url: '/accepter/grade/config/queryOptions',
    method: 'post',
    data
  })
}

// 提交选项配置列表
export function editConfig(data) {
  return request({
    url: '/accepter/grade/config/editOptions',
    method: 'post',
    data
  })
}

export function saveConfigFunction(data) {
  return request({
    url: '/accepter/grade/config/saveOptions',
    method: 'post',
    data
  })
}

export default {
  getQuestonist,
  saveQuestion,
  getConfigList
}
