import request from '@/utils/request.js'

// 获取当前单子是否已评过分
export function getBeScore(data) {
  return request({
    url: '/grip/acceptanceTest/scoringWindow?applyNo=' + data,
    method: 'get'
  })
}
// 新增评分记录
export function addScore(data) {
  return request({
    url: '/accepter/grade/statistics/saveGradeRecord',
    method: 'post',
    data
  })
}

// 获取验收测试中第二步的日历
export function getMonthList(data) {
  return request({
    url: '/accepter/test/query/list',
    method: 'post',
    data
  })
}

// 获取评分统计查询列表
export function getScoreAndBookingList(data) {
  return request({
    url: '/accepter/grade/statistics/query',
    method: 'post',
    data
  })
}

// // 评分统计导出
// export function exportScoreStatistics(data) {
//   return request({
//     url: '/accepter/grade/statistics/download/export',
//     method: 'post',
//     data
//   })
// }

// 预约量及评分统计导出
export function exportCondition() {
  return request({
    url: '/bvass/downLoad',
    method: 'post'
  })
}
// 获取验收排布查询统计列表
export function getLayoutList(data) {
  return request({
    url: '/arrangement/statistics/init/table',
    method: 'post',
    data
  })
}
// 导出场务端验收排布查询统计列表
export function OutputExcel(data) {
  return request({
    url: '/arrangement/statistics/download',
    method: 'post'
  })
}
// 验收排布表页面
// 验收资源排布设置-页面初始化
export function initAcceptanceResource(params) {
  return request({
    url: '/acceptance/resource/init',
    method: 'get',
    params
  })
}

// 验收资源生成时间范围下拉框选择事件接口
export function reqGenerationTime(day) {
  return request({
    url: `/acceptance/resource/generationTime?day=` + day,
    method: 'post'
  })
}

// 验收资源排布设置 - 导出(导出条件筛选后的数据)
export function exportResource(day) {
  return request({
    url: `/acceptance/resource/download?day=` + day,
    method: 'post',
    day
  })
}

// 编辑时根据ID查询资源排布设置信息的接口
export function reqEditResource(id) {
  return request({
    url: `/acceptance/resource/edit?id=` + id,
    method: 'post'
  })
}

// 应急发送接口
export function reqEmergencySend(day) {
  return request({
    url: `/acceptance/resource/emergency?day=` + day,
    method: 'post'
  })
}

// 保存资源排布设置信息的接口
export function reqSaveResourceSettings(data) {
  return request({
    url: '/acceptance/resource/save',
    method: 'post',
    data
  })
}

// 验收人员下拉列表接口
export function reqAccepterDownList() {
  return request({
    url: '/bvass/dropDownList',
    method: 'get'
  })
}

// 条件查询预约量和评分统计接口
export function reqQuantityAndScore(data) {
  return request({
    url: '/bvass/query/condition',
    method: 'post',
    data
  })
}

// 查询预约量开关当前值【0-不展示，1-展示】
export function reqQuantitySwitch() {
  return request({
    url: `/bvass/reservation/switch/value`,
    method: 'get'
  })
}
// 查询评分开关当前值【0-不展示，1-展示】
export function getScoreSwitch(value) {
  return request({
    url: `/bvass/score/switch/value`,
    method: 'get'
  })
}

// 预约量是否展示接口
export function reqShowQuantityInterface(value) {
  return request({
    url: `/bvass/reservation?flag=` + value,
    method: 'post'
  })
}

// 评分是否展示接口
export function reqShowScoreInterface(value) {
  return request({
    url: `/bvass/score?flag=` + value,
    method: 'post'
  })
}

// 页面初始化时预约量和评分统计查询接口【分页查询】
export function reqInitQuantityScore(data) {
  return request({
    url: `/bvass/init`,
    method: 'post',
    data
  })
}

// 剩余名额统计页面接口
// 页面初始化时，表格初始化数据
export function ReqInitMessage(data) {
  return request({
    url: '/remaining/init',
    method: 'post',
    data
  })
}

// 场务端剩余名额统计查询-条件筛选查询
export function ReqQueryConditions(data) {
  return request({
    url: '/remaining/conditional/query',
    method: 'post',
    data
  })
}

// 场务端剩余名额统计查询-导出(导出条件筛选后的数据)
export function reqExportCondition(data) {
  return request({
    url: '/remaining/download',
    method: 'post',
    data
  })
}

// 查询所有的验收人
export function reqAllAccepters() {
  return request({
    url: '/remaining/accepter',
    method: 'get'
  })
}

// 查询所有的接口类型
export function reqAllInterfaces() {
  return request({
    url: '/remaining/interface',
    method: 'get'
  })
}

// 初始化-结果选项
export function reqResultSelect() {
  return request({
    url: '/accepter/grade/statistics/initResultName',
    method: 'post'
  })
}
export default {
  initAcceptanceResource,
  reqGenerationTime,
  exportResource,
  reqEditResource,
  reqAccepterDownList,
  reqQuantityAndScore,
  reqAllAccepters,
  reqAllInterfaces,
  reqResultSelect
}
