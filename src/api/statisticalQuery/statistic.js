import request from '@/utils/request'

// --------------------------统计查询 / 网络开通--------------------

// 查询
export function reqQueryNetwork(data) {
  return request({
    url: '/statistic/network/list',
    method: 'post',
    data
  })
}

// 导出表格
export function reqExportExcel(data) {
  return request({
    url: '/statistic/download/network',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// --------------------------统计查询 / 总体查询-------------------
// 场务端——市场机构
// 查询
export function reqQueryOverall(data) {
  return request({
    url: '/statistic/overall/query/market',
    method: 'post',
    data
  })
}
// 导出Excel
export function reqExportMarketExcel(data) {
  return request({
    url: '/statistic/overall/export/market',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 场务端——信息商
// 查询
export function reqQueryInstiOverall(data) {
  return request({
    url: '/statistic/overall/query/info',
    method: 'post',
    data
  })
}
// 导出Excel
export function reqExportInstiExcel(data) {
  return request({
    url: '/statistic/overall/export/info',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 机构端——市场机构
// 查询
export function reqQueryMarketOverall(data) {
  return request({
    url: '/agency/statistic/overall/query/market',
    method: 'post',
    data
  })
}
// 导出Excel
export function reqExportJgMarketExcel(data) {
  return request({
    url: '/agency/statistic/overall/export/market',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 机构端——信息商
// 查询
export function reqQueryJgInstiOverall(data) {
  return request({
    url: '/agency/statistic/overall/query/info',
    method: 'post',
    data
  })
}
// 导出Excel
export function reqExportJgInstiExcel(data) {
  return request({
    url: '/agency/statistic/overall/export/info',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// --------------------------统计查询 / 流程查询-------------------
// 场务端——市场机构统计
// 查询
export function reqQueryProcess(data) {
  return request({
    url: '/statistic/proc/query/market',
    method: 'post',
    data
  })
}

// 导出
export function reqExportProcess(data) {
  return request({
    url: '/statistic/proc/export/market',
    method: 'post',
    responseType: 'blob',
    isToJson: true,
    data
  })
}

// 场务端——信息商统计
// 查询
export function reqQueryProcessInsti(data) {
  return request({
    url: '/statistic/proc/query/info',
    method: 'post',
    data
  })
}

// 导出
export function reqExportProcessInsti(data) {
  return request({
    url: '/statistic/proc/export/info',
    method: 'post',
    responseType: 'blob',
    isToJson: true,
    data
  })
}

// 机构端-市场机构统计
// 查询
export function reqQueryProcessAgency(data) {
  return request({
    url: '/agency/statistic/proc/query/market',
    method: 'post',
    data
  })
}

// 导出
export function reqExportProcessAgency(data) {
  return request({
    url: '/agency/statistic/proc/export/market',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 机构端-信息商统计
// 查询
export function reqQueryProcessAgencyInsti(data) {
  return request({
    url: '/agency/statistic/proc/query/info',
    method: 'post',
    data
  })
}

// 导出
export function reqExportProcessAgencyInsti(data) {
  return request({
    url: '/agency/statistic/proc/export/info',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// --------------------------统计查询 / 上线通过查询-------------------
// 场务端-市场机构统计
// 查询
export function reqQueryOnlineMarket(data) {
  return request({
    url: '/statistic/online/pass/market',
    method: 'post',
    data
  })
}

// 导出
export function reqExportOnlineMarket(data) {
  return request({
    url: '/statistic/online/export/market',
    method: 'post',
    responseType: 'blob',
    isToJson: true,
    data
  })
}

// 场务端-信息商统计
// 查询
export function reqQueryOnlineInsti(data) {
  return request({
    url: '/statistic/online/pass/info',
    method: 'post',
    data
  })
}

// 导出
export function reqExportOnlineInsti(data) {
  return request({
    url: '/statistic/online/export/info',
    method: 'post',
    responseType: 'blob',
    isToJson: true,
    data
  })
}

// 机构端-市场机构统计
// 查询
export function reqQueryOnlineAgency(data) {
  return request({
    url: '/agency/statistic/online/pass/market',
    method: 'post',
    data
  })
}

// 导出
export function reqExportOnlineAgency(data) {
  return request({
    url: '/agency/statistic/online/export/market',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 机构端-信息商统计
// 查询
export function reqQueryOnlineAgencyInsti(data) {
  return request({
    url: '/agency/statistic/online/pass/info',
    method: 'post',
    data
  })
}

// 导出
export function reqExportOnlineAgencyInsti(data) {
  return request({
    url: '/agency/statistic/online/export/info',
    method: 'post',
    responseType: 'blob',
    data
  })
}

//  ------------------- 配置审核 -------------------
// 查询
export function reqQueryAudit(data) {
  return request({
    url: '/cassAuditConfig/auditList',
    method: 'post',
    data
  })
}

// 保存
export function reqEditAuditConfig(data) {
  return request({
    url: '/cassAuditConfig/auditUpdate',
    method: 'post',
    data
  })
}

//  初始化部门列表
export function reqGetDepartList(data) {
  return request({
    url: '/cassAuditConfig/getAllDepartment',
    method: 'post',
    data
  })
}

// 点编辑获取表格内的数据
export function reqEditAuditForm(data) {
  return request({
    url: '/cassAuditConfig/queryById',
    method: 'post',
    data
  })
}

// ------------------------------------   ISV统计  ---------------------------------------
// 查询
export function reqQueryISVCondition(data) {
  return request({
    url: '/statistic/isv/query',
    method: 'post',
    data
  })
}

// 导出
export function reqExportISVExcel(data) {
  return request({
    url: '/statistic/isv/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// ------------------------------------   候补查询  ---------------------------------------
// 查询
export function reqAlternateQueryResult(data) {
  return request({
    url: '/service/alternate/query/alternate',
    method: 'post',
    data
  })
}

// 导出
export function reqExportAlternate(data) {
  return request({
    url: '/service/alternate/export/alternate',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export default {
  reqQueryNetwork,
  reqExportExcel,

  reqQueryOverall,
  reqExportMarketExcel,

  reqQueryInstiOverall,
  reqExportInstiExcel,

  reqQueryMarketOverall,
  reqExportJgMarketExcel,

  reqQueryJgInstiOverall,
  reqExportJgInstiExcel,

  reqQueryProcess,
  reqExportProcess,

  reqQueryProcessInsti,
  reqExportProcessInsti,

  reqQueryProcessAgency,
  reqExportProcessAgency,

  reqQueryProcessAgencyInsti,
  reqExportProcessAgencyInsti,

  reqQueryOnlineMarket,
  reqExportOnlineMarket,

  reqQueryOnlineInsti,
  reqExportOnlineInsti,

  reqQueryOnlineAgency,
  reqExportOnlineAgency,

  reqQueryOnlineAgencyInsti,
  reqExportOnlineAgencyInsti,

  reqQueryAudit,
  reqEditAuditConfig,
  reqGetDepartList,
  reqEditAuditForm,

  reqQueryISVCondition,
  reqExportISVExcel,
  reqAlternateQueryResult,
  reqExportAlternate

}
