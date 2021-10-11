// 流程引擎
import request from '@/utils/request'

// 流程库列表-获取
export function getFlowLibList(data) {
  return request({
    url: '/proc/flow/model/search',
    method: 'post',
    data
  })
}

// 流程库类型-获取
export function getFlowTypeList(data) {
  return request({
    url: '/proc/flow/model/get/model/flowType',
    method: 'post',
    data
  })
}

// 流程库-新增
export function addFlowLib(data) {
  return request({
    url: '/proc/flow/model/rest/models',
    method: 'post',
    data
  })
}

// 流程库-编辑
export function editFlowLib(data) {
  return request({
    url: '/proc/flow/model/modify/rest/models',
    method: 'post',
    data
  })
}

// 流程库基本信息-获取
export function getFlowLibDetail(params) {
  return request({
    url: '/proc/flow/model/get/model/base/info',
    method: 'get',
    params
  })
}

// 流程库流程图-保存
export function saveFlowLib(modelId, data) {
  return request({
    url: `/proc/flow/model/rest/models/${modelId}/editor/json`,
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    data
  })
}

// 流程库-发布
export function publishFlowLib(modelId) {
  return request({
    url: `/proc/flow/model/publish/${modelId}/model`,
    method: 'post'
  })
}

// 流程库-删除
export function deleteFlowLib(modelId) {
  return request({
    url: `/proc/flow/model/delete/${modelId}/model`,
    method: 'post'
  })
}

// 流程库-复制
export function copyFlowLib(modelId) {
  return request({
    url: `/proc/flow/model/copy/${modelId}/model`,
    method: 'post'
  })
}

// 流程配置-获取全部有效模型
export function getAllFlowConfigModel(data) {
  return request({
    url: '/proc/flow/conf/get/all/effect/audit/model',
    method: 'post',
    data
  })
}

// 流程配置-获取菜单树
export function getFlowConfigMenu(institutionType) {
  const nameObj = {
    '00': 'market',
    '10': 'iiq'
  }
  return request({
    url: `/proc/flow/conf/get/${nameObj[institutionType]}/manageMenu`,
    method: 'post'
  })
}

// 流程配置-获取审核流程配置
export function getFlowConfigData(institutionType) {
  const nameObj = {
    '00': 'market',
    '10': 'iiq'
  }
  return request({
    url: `/proc/flow/conf/get/${nameObj[institutionType]}/manageMenu/conf`,
    method: 'post'
  })
}

// 流程配置-保存接口菜单审核流程
export function saveFlowConfig(data, institutionType) {
  const nameObj = {
    '00': 'market',
    '10': 'iiq'
  }
  return request({
    url: `/proc/flow/conf/save/${nameObj[institutionType]}/menuNode/audit/model`,
    method: 'post',
    data
  })
}

export default {
  getFlowLibList,
  getFlowTypeList,
  addFlowLib,
  editFlowLib,
  getFlowLibDetail,
  saveFlowLib,
  publishFlowLib,
  deleteFlowLib,
  copyFlowLib,
  getAllFlowConfigModel,
  getFlowConfigMenu,
  getFlowConfigData,
  saveFlowConfig
}
