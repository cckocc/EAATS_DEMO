import request from '@/utils/request'

// 获取验收测试列表
export function getTestList(data) {
  return request({
    url: `/statistic/test/list`,
    method: 'post',
    data
  })
}

// 获取其他资源列表
export function getOtherList(data) {
  return request({
    url: `/statistic/apply/list`,
    method: 'post',
    data
  })
}

export function exportExcelInOtherPage(data) {
  return request({
    url: `/statistic/download/apply`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function exportExcelInTestPage(data) {
  return request({
    url: `/statistic/download/test`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
