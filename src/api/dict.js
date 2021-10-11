import request from '@/utils/request'

export function getVersion() {
  return request({
    url: '/proto/dict/version',
    method: 'get'
  })
}

// 根据报文类型查询字典
export function queryByType(data) {
  return request({
    url: '/proto/dict/message/type',
    method: 'post',
    params: data
  })
}

// 根据组件名查询字典
export function queryByComponent(data) {
  return request({
    url: '/proto/dict/component',
    method: 'post',
    params: data
  })
}

// 根据域名查询字典
export function queryByFieldName(data) {
  return request({
    url: '/proto/dict/field/name',
    method: 'post',
    params: data
  })
}
// 根据域号和版本查询域
export function queryByFieldNumber(data) {
  return request({
    url: '/proto/dict/fieldnumber',
    method: 'post',
    params: data
  })
}
// 根据注释查询字典
export function queryByComments(data) {
  return request({
    url: '/proto/dict/comments',
    method: 'post',
    params: data
  })
}
// 应用层-类别id查询消息列表
export function queryComponentList(data) {
  return request({
    url: '/proto/dict/component/component',
    method: 'post',
    params: data
  })
}

// 下拉框components-根据组件名称查询components
export function queryComponentByName(data) {
  return request({
    url: '/proto/dict/comp/category',
    method: 'post',
    params: data
  })
}

// 下拉框DataTypes-datatypes
export function queryDatatypes() {
  return request({
    url: '/proto/dict/datatypes/dt',
    method: 'post'
  })
}

// 下拉框messagesum-根据消息类别排序查询messages
export function queryByCategory(data) {
  return request({
    url: '/proto/dict/mess/category',
    method: 'post',
    params: data
  })
}

// 下拉框messagesum-根据消息名称排序查询messages
export function queryByMessageName(data) {
  return request({
    url: '/proto/dict/mess/name',
    method: 'post',
    params: data
  })
}

// 下拉框messagesum-根据消息类型排序查询messages
export function queryByMessageType(data) {
  return request({
    url: '/proto/dict/mess/type',
    method: 'post',
    params: data
  })
}

// 根据messageid查询字典
export function queryByMessageId(data) {
  return request({
    url: '/proto/dict/message/mid',
    method: 'post',
    params: data
  })
}

// [field]根据fieldid查询父comparent
export function queryFieldParentComparent(data) {
  return request({
    url: '/proto/dict/fid/parentcomp',
    method: 'post',
    params: data
  })
}

// [field]根据fieldid查询父message
export function queryFieldParentMessage(data) {
  return request({
    url: '/proto/dict/fid/parentmesg',
    method: 'post',
    params: data
  })
}

// [comp]根据componentID查询父comparent
export function queryComponentParentComparent(data) {
  return request({
    url: '/proto/dict/cid/parentcomp',
    method: 'post',
    params: data
  })
}

// [comp]根据componentID查询父message
export function queryComponentParentMessage(data) {
  return request({
    url: '/proto/dict/cid/parentmesg',
    method: 'post',
    params: data
  })
}

// 应用层-第二层列表
export function queryAlltrade(data) {
  return request({
    url: '/proto/dict/app/alltrade',
    method: 'post',
    params: data
  })
}

// 根据版本查询所有
export function queryAllByVersion(data) {
  return request({
    url: '/proto/dict/version/all',
    method: 'post',
    params: data
  })
}

// 会话层messages下拉框
export function querySessionMessage(data) {
  return request({
    url: '/proto/dict/sess/message',
    method: 'post',
    params: data
  })
}

// 会话层components下拉框
export function querySessionComponent(data) {
  return request({
    url: '/proto/dict/sess/component',
    method: 'post',
    params: data
  })
}
