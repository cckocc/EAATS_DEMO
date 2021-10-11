import request from '@/utils/request'

export function encrypt(password) {
  return request({
    url: `/common/func/encrypt/${password}`,
    method: 'get'
  })
}

// 获取公钥
export function getPublicKey() {
  return request({
    url: '/common/func/getPublicKey',
    method: 'get'
  })
}

export function recoverPassword(data) {
  return request({
    url: '/common/func/recover/password',
    method: 'post',
    data
  })
}

export function retrievePassword(data) { // 找回密码，验证码校验
  return request({
    url: '/retrieve/password/verify',
    method: 'post',
    data
  })
}

// 首次登录修改密码
export function editFirstLoginPassword(data) {
  return request({
    url: '/update/password/',
    method: 'post',
    data
  })
}

export function retrievePasswordForPerson(data) { // 找回密码-个人
  return request({
    url: '/retrieve/password/',
    method: 'post',
    data
  })
}

// 注册获取短信验证码
export function getSmsCode(data) {
  return request({
    url: '/sms/get/captcha/code',
    method: 'post',
    data
  })
}

// 登录获取短信验证码
export function getSmsCodeLogin(data) {
  return request({
    url: '/sms/get/captcha/code/login',
    method: 'post',
    data
  })
}
// 邮箱服务
export function getEmailCode(data) {
  return request({
    url: '/email/get/captcha/code',
    method: 'post',
    data
  })
}

// 判断手机是否存在
export function isExistPhoneNo(params) {
  return request({
    url: '/sms/get/sms/isExistPhoneNo',
    method: 'get',
    params
  })
}

// 判断邮箱是否存在
export function isExistEmail(params) {
  return request({
    url: '/sms/get/sms/isExistEmail',
    method: 'get',
    params
  })
}

// 找回获取邮箱验证码
export function getForgetEmailCode(data) {
  return request({
    url: '/email/get/captcha/send',
    method: 'post',
    data
  })
}

// 获取跳转链接
export function getToUrl() {
  return request({
    url: '/developmentGuidance/get/url',
    method: 'get'
  })
}

// 获取有情链接
export function getFriendUrl() {
  return request({
    url: '/links/findAll',
    method: 'post'
  })
}

// 获取T+n个工作日
export function getWorkDay(params) {
  return request({
    url: '/workday/get',
    method: 'get',
    params
  })
}

// 是否阅读最新的协议条款
export function isRead(data) {
  return request({
    url: '/agency/sys/user/mgt/edit/isRead',
    method: 'post',
    data
  })
}

// 获取用户状态
export function getUserStatus(params) {
  return request({
    url: '/common/func/enum/userStatus',
    method: 'get',
    params
  })
}
