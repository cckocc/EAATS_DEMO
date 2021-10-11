import request from '@/utils/request'

export function getUserInfo(userId, port) {
  return request({
    url: `/${port}/sys/user/center/info?userId=${userId}`,
    method: 'post'
  })
}

export function bindingEmail(data, port) {
  return request({
    url: `/${port}/sys/user/center/update/email`,
    method: 'post',
    data
  })
}

export function bindingPhone(data, port) {
  return request({
    url: `/${port}/sys/user/center/update/phone`,
    method: 'post',
    data
  })
}
export function updatePwd(data, port) {
  return request({
    url: `/${port}/sys/user/center/update/pwd`,
    method: 'post',
    data
  })
}

export function updateName(data, port) {
  return request({
    url: `/${port}/sys/user/center/update/name`,
    method: 'post',
    data
  })
}
