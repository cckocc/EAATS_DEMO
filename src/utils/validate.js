/**
 * @param {string} value
 * @returns {Boolean}
 */
export function isNull(value) {
  return value === '' || value === null || value === undefined || value === 'null'
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const reg = /^[0-9a-zA-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^[-\_+.A-Za-z0-9]*[A-Za-z0-9\_]@([A-Za-z0-9-\_\/]+\.)+[A-Za-z0-9]+$/
  return reg.test(email)
  // const reg1 = /([-\_+.])\1{1}/
  // let result = false
  // if (reg.test(email)) {
  //   if (!reg1.test(email.split('@')[0])) {
  //     result = true
  //   }
  // }
  // return result
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export function validPassword(str) {
  // 8位以上字符,同时包含字母大小写、数字和符号
  const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\\\][#?_()+={}<>',.;"/:|`~!@$%^&*-]).{8,16}$/
  return reg.test(str)
}

export function validSocialCode(str) {
  //   GB_32100-2015_法人和其他组织统一社会信用代码编码规则.》按照编码规则:
  //   统一代码为18位，统一代码由十八位的数字或大写英文字母（不适用I、O、Z、S、V）组成，由五个部分组成：
  //   第一部分（第1位）为登记管理部门代码，9表示工商部门；(数字或大写英文字母)
  //   第二部分（第2位）为机构类别代码;(数字或大写英文字母)
  //   第三部分（第3-8位）为登记管理机关行政区划码；(数字)
  //   第四部分（第9-17位）为全国组织机构代码；(数字或大写英文字母)
  //   第五部分（第18位）为校验码(数字或大写英文字母)
  const reg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
  return reg.test(str)
}
// 校验IP地址
export function validIP(str) {
  const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
  return reg.test(str)
}
// 校验手机号码格式
export function validPhone(str) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
  // const reg = /^\d+$/g
  return reg.test(str)
}

// 校验国际手机号码
export function validInternationalPhone(str) {
  // ^((\\+86)|(86))?[1][3456789][0-9]{9}$
  const reg = /^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$/
  // const reg = /(?:\(?[0\+]\d{2,3}\)?)[\s-]?(?:(?:\(0{1,3}\))?[0\d]{1,4})[\s-](?:[\d]{7,8}|[\d]{3,4}[\s-][\d]{3,4})/
  return reg.test(str)
}

// 校验手机验证码
export function validPhoneCode(str) {
  const reg = /^\d{6}\b/
  return reg.test(str)
}

// 同时验证手机号和座机号
export function validTelephoneAndPhone(str) {
  const reg = /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/
  return reg.test(str)
}

// 校验固定电话
export function validTelephone(str) {
  const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  return reg.test(str)
}

// 校验固定电话的区号
export function validTelephoneArea(str) {
  const reg = /^\d{3,4}$/
  return reg.test(str)
}

// 校验固定电话 30位数字加-
export function validTel(str) {
  const reg = /^[0-9-]{0,30}$/
  return reg.test(str)
}
// 校验固定电话 7~8
export function validSingleTel(str) {
  var reg = /^\d{7,8}$/
  return reg.test(str)
}
// 验证纯数字
export function validNum(str) {
  const reg = /^\d+$/g
  return reg.test(str)
}

// 校验邮编
export function validPostCode(str) {
  const reg = /^\d{6}$/g
  return reg.test(str)
}

// 非全角字符及非汉字验证
export function validateCharacter(str) {
  const reg = /[^\x00-\xff]/g
  return reg.test(str)
}
// 校验字母+数字组合
export function validateLetterAndNum(str) {
  const reg = /^(?=.*\d+.*)(?=.*[a-zA-Z]+.*)[\da-zA-Z]{0,}$/g
  return reg.test(str)
}
// 校验字母或数字或字母+数字组合
export function validateLetterOrNum(str) {
  const reg = /^[\da-zA-Z]*$/g
  return reg.test(str)
}
// 校验21位数字
export function validate21Num(str) {
  const reg = /^[0-9]{21}$/g
  return reg.test(str)
}
// 校验30位数字
export function validate30Num(str) {
  const reg = /^[0-9]{0,30}$/g
  return reg.test(str)
}
// 校验6位数字
export function validate6Num(str) {
  const reg = /^[0-9]{6}$/g
  return reg.test(str)
}
// 校验正整数
export function validatePositiveInt(str) {
  const reg = /^[1-9]\d*$/g
  return reg.test(str)
}
//校验正数
export function validateInt(str) {
  const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
  return reg.test(str)
}
// 校验中英文和特殊字符，不支持空格
export function validSname(str) {
  // const reg = /^[^(\d\s)]+$/g
  const reg = /^[^(\s)]+$/g
  return reg.test(str)
}

export default {
  isNull,
  isExternal,
  validUsername,
  validURL,
  validLowerCase,
  validUpperCase,
  validAlphabets,
  validEmail,
  isString,
  isArray,
  validPassword,
  validSocialCode,
  validIP,
  validPhone,
  validPhoneCode,
  validTelephone,
  validTelephoneArea,
  validTelephoneAndPhone,
  validTel,
  validSingleTel,
  validNum,
  validPostCode,
  validateCharacter,
  validateLetterAndNum,
  validateLetterOrNum,
  validate21Num,
  validate30Num,
  validate6Num,
  validatePositiveInt,
  validSname,
  validInternationalPhone
}
