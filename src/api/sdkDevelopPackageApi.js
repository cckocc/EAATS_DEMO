import request from '@/utils/request'

export function getsdkfile(data) {
  return request({
    url: '/resmanage/guidance/select/sdk',
    method: 'post',
    data
  })
}
export function deletesdkfile(params) {
  return request({
    url: '/resmanage/guidance/delete/sdkfile',
    method: 'get',
    params
  })
}

export default {
  getsdkfile,
  deletesdkfile
}
