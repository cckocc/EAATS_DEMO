import request from '@/utils/request'
export function importExcel(data) {
  return request({
    url: '/manage/menu/config/uploadFile/excel/import',
    method: 'post',
    data
  })
}

export function getAddTree(params) {
  return request({
    url: '/manage/menu/config/getTree',
    method: 'get',
    params
  })
}

export function getUUid(params) {
  return request({
    url: '/manage/menu/config/generateUUid',
    method: 'get',
    params
  })
}

export function publishTree(data) {
  return request({
    url: '/manage/menu/config/publish',
    method: 'post',
    data
  })
}

export function selectTree(params) {
  return request({
    url: '/manage/menu/config/select/allByType',
    method: 'get',
    params
  })
}

export function importMerketExcel(data) {
  return request({
    url: '/manage/menu/config/uploadFile/excelMarket/import',
    method: 'post',
    data
  })
}
