import request from '@/utils/request'

// 场务端 通知公告 删除
export function deleteNotice(params) {
  return request({
    url: '/notice/deleteNotice',
    method: 'delete',
    params
  })
}

// 场务端 通知公告 新增
export function addNotice(data) {
  return request({
    url: '/notice/releaseNotice',
    method: 'post',
    data
  })
}

// 场务端 通知公告 修改
export function updateNotice(data) {
  return request({
    url: '/notice/updateNotice',
    method: 'post',
    data
  })
}

// 场务端 通知公告 查询
export function searchNotice(data) {
  return request({
    url: '/notice/getNoticeByPaging',
    method: 'post',
    data
  })
}

// 场务端 交易中心成员管理 查询
export function gripUserInfo(data) {
  return request({
    url: '/grip/sys/user/mgt/search/user/info',
    method: 'post',
    data
  })
}

// 场务端 交易中心成员管理 新增
export function gripUserSave(data, type) {
  const url = type === 'add' ? '/grip/sys/user/mgt/save' : '/grip/sys/user/mgt/update/user/info'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 场务端 交易中心成员管理 新增
export function gripUserSupervisor(params) {
  return request({
    url: '/grip/sys/user/mgt/user/supervisor',
    method: 'get',
    params
  })
}

// 场务端 交易中心成员管理 获取用户角色
export function gripUserRole(params) {
  return request({
    url: '/grip/sys/user/mgt/role',
    method: 'get',
    params
  })
}

// 场务端 交易中心成员管理 禁用
export function gripDisableUser(params) {
  return request({
    url: '/grip/sys/user/mgt/disable/userId',
    method: 'get',
    params
  })
}

// 场务端 交易中心成员管理 启用
export function gripEnableUser(params) {
  return request({
    url: '/grip/sys/user/mgt/enable/userId',
    method: 'get',
    params
  })
}

// 场务端 交易中心成员管理 重置密码
export function gripResetPwd(params) {
  return request({
    url: '/grip/sys/user/mgt/reset/pwd/userId',
    method: 'get',
    params
  })
}

// 场务端 交易中心成员管理 修改
export function gripUpdateUser(data) {
  return request({
    url: '/grip/sys/user/mgt/update/user/info',
    method: 'post',
    data
  })
}

// 获取用户类型
export function getUserType(params) {
  return request({
    url: '/common/func/enum/userType',
    method: 'get',
    params
  })
}

// 交易中心成员管理 获取已选中的权限列表
export function getUserAuthority(params) {
  return request({
    url: '/grip/sys/user/mgt/user/perm',
    method: 'get',
    params
  })
}

// 交易中心成员管理 保存权限列表
export function saveUserAuthority(data) {
  return request({
    url: '/grip/sys/user/mgt/save/user/authority',
    method: 'post',
    data
  })
}

// 交易中心成员管理 获取查询时的用户角色
export function getCommonRoleType(params) {
  return request({
    url: '/common/func/enum/roleType',
    method: 'get',
    params
  })
}

// 场务端 通知公告 上传文件
export function noticeUploadFile(data) {
  return request({
    url: '/system/file/uploadFile/uploadCarouselFile',
    method: 'post',
    data
  })
}

// 发布跑马灯——删除
export function noticeDeleteFile(params) {
  return request({
    url: '/image/mgt/carousel/single/delete',
    method: 'get',
    params
  })
}

// 场务端 通知公告 根据id获取详情
export function noticeSearchById(params) {
  return request({
    url: '/notice/searchById',
    method: 'get',
    params
  })
}

// 场务端 通知公告 根据关键词查询
export function noticeSearchByKeywords(data) {
  return request({
    url: '/notice/searchByKeywords',
    method: 'post',
    data
  })
}

// 交易中心成员管理 获取用户信息
export function getUserInfoById(params) {
  return request({
    url: '/grip/sys/user/mgt/get/user/info/userId',
    method: 'get',
    params
  })
}

// 机构成员管理 用户列表
export function agencySearch(data) {
  return request({
    url: '/grip/agency/mgt/user/search',
    method: 'post',
    data
  })
}

export function agencyUpdate(data) {
  return request({
    url: '/grip/agency/mgt/user/update',
    method: 'post',
    data
  })
}

export function agencyResetPass(params) {
  return request({
    url: '/grip/agency/mgt/user/reset/pwd/',
    method: 'get',
    params
  })
}

export function agencyUserInfo(params) {
  return request({
    url: '/grip/agency/mgt/user/info',
    method: 'get',
    params
  })
}

// 场务端审核机构用户
export function gripAuditOrgUser(data) {
  return request({
    url: '/grip/agency/mgt/user/gripAuditUserInfo',
    method: 'post',
    data
  })
}

export function agencyEnableUser(params) {
  return request({
    url: '/grip/agency/mgt/user/enable/userId',
    method: 'get',
    params
  })
}

export function agencyDisableUser(params) {
  return request({
    url: '/grip/agency/mgt/user/disable/userId',
    method: 'get',
    params
  })
}

export function agencyUserSave(data, type) {
  const url = type === 'add' ? '/grip/agency/mgt/user/add' : '/grip/agency/mgt/user/update'
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 机构信息审核
export function auditAgencySearch(data) {
  return request({
    url: '/gripReviewAgency/selectAllInfo',
    method: 'post',
    data
  })
}

export function auditAgencyDetail(params) {
  return request({
    url: '/gripReviewAgency/selectReviewDetailById',
    method: 'get',
    params
  })
}

export function auditAgency(data) {
  return request({
    url: '/gripReviewAgency/auditAgency',
    method: 'post',
    data
  })
}

export function getInitPerm(params) {
  return request({
    url: '/common/func/user/perm',
    method: 'get',
    params
  })
}

export function getInitPermByUser(params) {
  return request({
    url: '/grip/sys/user/mgt/get/user/authority/list',
    method: 'get',
    params
  })
}

export function previewNotice(data) {
  return request({
    url: '/notice/previewNotice',
    method: 'POST',
    data
  })
}

export function getOrgList(params) {
  return request({
    url: '/grip/agency/mgt/user/info/search/',
    method: 'get',
    params
  })
}

export function institutionSearch(data) {
  return request({
    url: '/institution/info/manage/search',
    method: 'post',
    data
  })
}

export function getInstiStatus(params) {
  return request({
    url: '/institution/info/manage/enum',
    method: 'get',
    params
  })
}

export function getInstiDetail(params) {
  return request({
    url: '/institution/info/manage/info',
    method: 'get',
    params
  })
}

export function insitiSave(data, type) {
  const url = type === 'add' ? '/institution/info/manage/add' : '/institution/info/manage/update'
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function disableSwitch(params) {
  return request({
    url: `/institution/info/manage/disable/agency`,
    method: 'get',
    params
  })
}

export function activateSwitch(params) {
  return request({
    url: `/institution/info/manage/activate/agency`,
    method: 'post',
    params
  })
}

export function getLoginUser(params) {
  return request({
    url: '/get/curr/user',
    method: 'get',
    params
  })
}

export function saveImg(data) {
  return request({
    url: '/image/mgt/carousel/all/add',
    method: 'post',
    data
  })
}

export function getCurrentDepart(params) {
  return request({
    url: '/common/func/user/department',
    method: 'get',
    params
  })
}

// 查询所有轮播图
export function getAllCarousel(data) {
  return request({
    url: '/image/mgt/carousel/all/select',
    method: 'post',
    data
  })
}

// 根据ID查询轮播图
export function getSingleCarousel(data) {
  return request({
    url: '/image/mgt/carousel/single/select',
    method: 'post',
    data
  })
}

export function getNewsNum(params) {
  return request({
    url: '/message/new/num',
    method: 'get',
    params
  })
}

export function getNewsList(params) {
  return request({
    url: '/message/list',
    method: 'get',
    params
  })
}

export function getNewsTest(params) {
  return request({
    url: '/message/test',
    method: 'get',
    params
  })
}

// 场务端 获取验收测试时间配置
export function getInterfaceTime(data) {
  return request({
    url: '/interfaceNum/selectInterfaceTime',
    method: 'POST',
    data
  })
}

// 场务端 更新验收测试时间配置
export function updateInterfaceTime(data) {
  return request({
    url: '/interfaceNum/updateInterfaceTime',
    method: 'POST',
    data
  })
}

// 场务端验收测试时间配置 获取接口所占数量设置
export function getShowTable(data) {
  return request({
    url: '/interfaceNum/showTable',
    method: 'POST',
    data
  })
}

// 场务端验收测试时间配置 接口所占数量设置更新
export function updateInterfaceTable(data) {
  return request({
    url: '/interfaceNum/updateInterfaceTable',
    method: 'POST',
    data
  })
}

// 流程查看-接口上线-审核
export function auditDoOnline(data) {
  return request({
    url: '/grip/process/await/audit/online/audit/do',
    method: 'post',
    data
  })
}

// 通用查询-执行sql
export function execSql(data) {
  return request({
    url: '/exec/execSql',
    method: 'post',
    data: data
  })
}

// 场务应急-信息商导入
export function importExcelIIQ(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/import/IIQ',
    method: 'post',
    data: data
  })
}

// 场务应急-信息商查询
export function selectAllIIQ(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/selectAll/IIQ',
    method: 'post',
    data: data
  })
}

// 场务应急-信息商发布
export function publishExcelIIQ(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/publish/IIQ',
    method: 'post',
    data: data
  })
}

// 场务应急-市场机构导入
export function importExcelMarket(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/import/MARKET',
    method: 'post',
    data: data
  })
}

// 场务应急-市场机构查询
export function selectAllMarket(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/selectAll/MARKET',
    method: 'post',
    data: data
  })
}

// 场务应急-市场机构发布
export function publishExcelMarket(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/publish/MARKET',
    method: 'post',
    data: data
  })
}

// 场务应急-市场机构发布
export function importSixCode(data) {
  return request({
    url: '/manage/menu/emergencyMeasure/import/SixCode',
    method: 'post',
    data: data
  })
}

// 场务应急-导入ISV看板
export function importIsv(data) {
  return request({
    url: '/certificate/import/ISVKanban',
    method: 'post',
    data
  })
}

// 场务应急-导入机构信息
export function importOrg(data) {
  return request({
    url: '/excel/analysis/instiHistoryDispose',
    method: 'post',
    data
  })
}

// 场务应急-导入流程图
export function importFlowChart(data) {
  return request({
    url: '/proc/flow/model/file/import',
    method: 'post',
    data
  })
}

// 场务应急-导出全部流程图
export function exportAllFlowChart() {
  return request({
    url: '/proc/flow/model/file/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 查询注册服务条款
export function getUserProtocol(params) {
  return request({
    url: '/notice/userProtocol',
    method: 'get',
    params: params
  })
}

// 修改注册服务条款
export function modifyUserProtocol(data) {
  return request({
    url: '/notice/modifyUserProtocol',
    method: 'post',
    data: data
  })
}

// 查询隐私政策
export function getUserPrivacy(params) {
  return request({
    url: '/notice/privatePolicy',
    method: 'get',
    params: params
  })
}

// 修改隐私政策
export function modifyUserPrivacy(data) {
  return request({
    url: '/notice/modifyPersonalProtocol',
    method: 'post',
    data: data
  })
}

// 查询业务概览
export function getBusiness(params) {
  return request({
    url: '/notice/businessOverview',
    method: 'get',
    params: params
  })
}

// 修改业务概览
export function modifyBusiness(data) {
  return request({
    url: '/notice/modifyBusinessOverview',
    method: 'post',
    data: data
  })
}

// 消息提醒
export function getNews(params) {
  return request({
    url: '/common/func/new/message/flag',
    method: 'get',
    params: params
  })
}

// 查询部门
export function getDepartmentList(data) {
  return request({
    url: 'grip/sys/user/mgt/department/search',
    method: 'post',
    data
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: 'grip/sys/user/mgt/department/add',
    method: 'post',
    data
  })
}

// 修改部门
export function modifyDepartment(data) {
  return request({
    url: 'grip/sys/user/mgt/department/modify',
    method: 'post',
    data
  })
}

// 所有部门 (部门下拉菜单-小组管理权限)
export function getAllDepartmentFromGroup() {
  return request({
    url: 'grip/sys/user/mgt/team/enum/department',
    method: 'get'
  })
}

// 所有部门 (部门下拉菜单-场务用户管理权限)
export function getAllDepartmentFromUser() {
  return request({
    url: 'grip/sys/user/mgt/get/department',
    method: 'get'
  })
}

// 小组列表查询
export function getGroupList(data) {
  return request({
    url: 'grip/sys/user/mgt/team/search',
    method: 'post',
    data
  })
}

// 小组列表查询
export function getGroupDetail(params) {
  return request({
    url: 'grip/sys/user/mgt/team/details',
    method: 'get',
    params
  })
}

// 小组新增/修改
export function addUpdateGroupMember(data) {
  return request({
    url: 'grip/sys/user/mgt/team/add/modify',
    method: 'post',
    data
  })
}

// 获取部门成员
export function getAllDepartmentUser(data) {
  return request({
    url: 'grip/sys/user/mgt/team/department/user',
    method: 'post',
    data
  })
}

// 获取部门的全部小组
export function getGroupListByDepartmentId(params) {
  return request({
    url: 'grip/sys/user/mgt/get/department/team',
    method: 'get',
    params
  })
}

// 删除小组
export function deleteGroup(params) {
  return request({
    url: 'grip/sys/user/mgt/team/delete',
    method: 'post',
    params
  })
}

// 删除部门
export function deleteDepartment(params) {
  return request({
    url: 'grip/sys/user/mgt/department/delete',
    method: 'post',
    params
  })
}

// 获取小组审核页面的tab
export function getGroupAuditTabs(params) {
  return request({
    url: 'grip/sys/user/mgt/team/get/tab/info',
    method: 'post',
    params
  })
}

// 获取市场机构表格数据
export function getMarketTableData(data) {
  return request({
    url: 'grip/sys/user/mgt/team/market/menu/view',
    method: 'post',
    data
  })
}

// 获取信息商表格数据
export function getIIQTableData(data) {
  return request({
    url: 'grip/sys/user/mgt/team/iiq/menu/view',
    method: 'post',
    data
  })
}

// 保存市场机构的小组审核数据
export function saveMarketGroupAuditData(data) {
  return request({
    url: 'grip/sys/user/mgt/team/save/market/menu/audit/list',
    method: 'post',
    data
  })
}

// 保存信息商的小组审核数据
export function saveIIQGroupAuditData(data) {
  return request({
    url: 'grip/sys/user/mgt/team/save/iiq/menu/audit/list',
    method: 'post',
    data
  })
}

// 场务用户树形列表
export function getGripUserTree(params) {
  return request({
    url: 'grip/sys/user/mgt/get/department/team/user',
    method: 'get',
    params
  })
}

// 保存批量权限配置的数据
export function savePermissionBatchData(data) {
  return request({
    url: 'grip/sys/user/mgt/save/user/authority/batch',
    method: 'post',
    data
  })
}

// 验证小组下是否有用户
export function validateGroupUserExist(params) {
  return request({
    url: 'grip/sys/user/mgt/team/validate/team/user/exit',
    method: 'get',
    params
  })
}

// 获取部门审核页面的tab
export function getDepartmentAuditTabs(params) {
  return request({
    url: 'grip/sys/user/mgt/department/get/tab/info',
    method: 'post',
    params
  })
}

// 获取部门的市场机构表格数据
export function getDepartmentMarketTableData(data) {
  return request({
    url: 'grip/sys/user/mgt/department/market/menu/view',
    method: 'post',
    data
  })
}

// 获取部门的信息商表格数据
export function getDepartmentIIQTableData(data) {
  return request({
    url: 'grip/sys/user/mgt/department/iiq/menu/view',
    method: 'post',
    data
  })
}

// 查询验证码
export function getCodeList(data) {
  return request({
    url: 'grip/sys/user/mgt/get/code/byUserArea',
    method: 'post',
    data
  })
}

// 待处理机构列表-获取列表
export function getWaitOrgList(data) {
  return request({
    url: '/old/data/list',
    method: 'post',
    data
  })
}

// 待处理机构列表-处理
export function dealWaitOrgList(data) {
  return request({
    url: '/old/data/handler',
    method: 'post',
    timeout: 24 * 60 * 60 * 1000,
    data
  })
}

// 申请单处理详情-获取列表
export function getFormProcessDetail(data) {
  return request({
    url: '/old/data/list/result',
    method: 'post',
    data
  })
}

// 申请单处理详情-新增
export function addFormProcessDetail(data) {
  return request({
    url: '/old/data/add/result',
    method: 'post',
    data
  })
}

export default {
  getNews,
  modifyBusiness,
  getBusiness,
  modifyUserPrivacy,
  getUserPrivacy,
  modifyUserProtocol,
  getUserProtocol,
  importSixCode,
  importIsv,
  importOrg,
  importFlowChart,
  exportAllFlowChart,
  importExcelMarket,
  selectAllMarket,
  publishExcelMarket,
  publishExcelIIQ,
  selectAllIIQ,
  importExcelIIQ,
  execSql,
  noticeDeleteFile,
  getNewsTest,
  getNewsList,
  getNewsNum,
  getSingleCarousel,
  getAllCarousel,
  getCurrentDepart,
  saveImg,
  getLoginUser,
  insitiSave,
  disableSwitch,
  activateSwitch,
  getInstiDetail,
  getInstiStatus,
  institutionSearch,
  getOrgList,
  previewNotice,
  getInitPermByUser,
  getInitPerm,
  noticeSearchByKeywords,
  auditAgency,
  auditAgencyDetail,
  auditAgencySearch,
  agencyUserSave,
  agencyDisableUser,
  gripAuditOrgUser,
  agencyEnableUser,
  agencyUserInfo,
  agencyResetPass,
  agencySearch,
  noticeSearchById,
  getUserInfoById,
  noticeUploadFile,
  getCommonRoleType,
  saveUserAuthority,
  getUserAuthority,
  getUserType,
  gripUpdateUser,
  gripResetPwd,
  gripDisableUser,
  gripEnableUser,
  gripUserRole,
  gripUserSupervisor,
  deleteNotice,
  addNotice,
  updateNotice,
  searchNotice,
  gripUserInfo,
  gripUserSave,
  getInterfaceTime,
  updateInterfaceTime,
  getShowTable,
  updateInterfaceTable,
  auditDoOnline,
  getDepartmentList,
  addDepartment,
  modifyDepartment,
  getAllDepartmentFromGroup,
  getAllDepartmentFromUser,
  getGroupList,
  getGroupDetail,
  addUpdateGroupMember,
  getAllDepartmentUser,
  deleteGroup,
  deleteDepartment,
  getGroupListByDepartmentId,
  getGroupAuditTabs,
  getMarketTableData,
  getIIQTableData,
  saveMarketGroupAuditData,
  saveIIQGroupAuditData,
  getGripUserTree,
  savePermissionBatchData,
  validateGroupUserExist,
  getDepartmentAuditTabs,
  getDepartmentMarketTableData,
  getDepartmentIIQTableData,
  getCodeList,
  getWaitOrgList,
  dealWaitOrgList,
  getFormProcessDetail,
  addFormProcessDetail
}
