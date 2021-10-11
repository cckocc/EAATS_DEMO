import request from '@/utils/request'

// 获取菜单配置项
export function getMenuConfig(data) {
  return request({
    url: `/getMenuConfigItem`,
    method: 'post',
    data
  })
}

// 获取市场机构-所有市场
export function getMarketMarket(params) {
  return request({
    url: `/manage/menu/config/select/cacheMarket`,
    method: 'get',
    params
  })
}

// 获取市场机构-所有接口用途
export function getMarketUsage(params) {
  return request({
    url: `/manage/menu/config/select/cacheUsage`,
    method: 'get',
    params
  })
}

// 获取市场机构-所有接口产品
export function getMarketProduct(params) {
  return request({
    url: `/manage/menu/config/select/cacheProduct`,
    method: 'get',
    params
  })
}

// 获取信息商-所有产品类型
export function getInformationProduct(params) {
  return request({
    url: `/manage/menu/config/select/cacheType`,
    method: 'get',
    params
  })
}

// 根据市场查询接口用途
export function getUsagesByMarkets(data) {
  return request({
    url: `/manage/menu/config/select/getUsagesByMarkets`,
    method: 'post',
    data
  })
}

// 根据接口用途查询市场
export function getMarketsByUsages(data) {
  return request({
    url: `/manage/menu/config/select/getMarketsByUsages`,
    method: 'post',
    data
  })
}

// 保存申请权限
export function saveApplyPermission(data) {
  return request({
    url: `/saveApplyPermission`,
    method: 'post',
    data
  })
}

// 保存基础信息
export function saveBasicInfo(data) {
  return request({
    url: `/saveBasicInfo`,
    method: 'post',
    data
  })
}

// 保存自身条件评估
export function saveSelfConditionAssess(data) {
  return request({
    url: `/saveSelfConditionAssess`,
    method: 'post',
    data
  })
}

// 服务开通-详情
export function getServiceOpeningDetail(params) {
  return request({
    url: `/getServiceApplyInfo`,
    method: 'get',
    params
  })
}

export default {
  getMenuConfig,
  getMarketMarket,
  getMarketUsage,
  getMarketProduct,
  getInformationProduct,
  getUsagesByMarkets,
  getMarketsByUsages,
  saveApplyPermission,
  saveBasicInfo,
  saveSelfConditionAssess,
  getServiceOpeningDetail
}
