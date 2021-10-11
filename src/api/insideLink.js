import request from '@/utils/request'

// 自动登录
export function loginDo(data) {
  return request({
    url: '/cmss/fxsp/user/login/do',
    method: 'post',
    data
  })
}

// 机构绑定
export function orgBindDo(data) {
  return request({
    url: '/cmss/fxsp/inst/bind/do',
    method: 'post',
    data
  })
}

// 用户绑定
export function bindDo(data) {
  return request({
    url: '/cmss/fxsp/user/bind/do',
    method: 'post',
    data
  })
}
