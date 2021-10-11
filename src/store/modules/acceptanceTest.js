import { setNodeStatus } from '@/utils'

const state = {
  menuConfigData: [],
  menuConfigDataOrigin: [],
  stepTwoObj: [], // 基础信息数据
  stepThreeObj: [], // 服务内容数据
  stepFourObj: [], // API运行环境数据
  stepFiveObj: [], // 自查清单数据
  isHasApiContent: true, // 是否有API运行环境 默认为true
  commonObj: {
    applyOrdNo: '',
    enName: '',
    formId: '',
    name: ''
  }
}
const mutations = {
  SET_MENU_CONFIG_DATA: (state, data) => {
    state.menuConfigData = JSON.parse(JSON.stringify(data))
  },
  SET_MENU_CONFIG_DATA_ORIGIN: (state, data) => {
    state.menuConfigDataOrigin = JSON.parse(JSON.stringify(data))
  },
  SET_STEP_TWO_OBJ: (state, data) => {
    state.stepTwoObj = data
  },
  SET_STEP_THREE_OBJ: (state, data) => {
    state.stepThreeObj = data
  },
  SET_STEP_FOUR_OBJ: (state, data) => {
    state.stepFourObj = data
  },
  SET_STEP_FIVE_OBJ: (state, data) => {
    state.stepFiveObj = data
  },
  SET_IS_HAS_API_CONTENT: (state, data) => {
    state.isHasApiContent = data
  },
  SET_COMMON_OBJ: (state, data) => {
    state.commonObj = data
  },
  SET_CLEAR_ALL_STEP_OBJ: (state, data) => {
    state.stepTwoObj = data
    state.stepThreeObj = data
    state.stepFourObj = data
    state.stepFiveObj = data
  },
  SET_NODE_STATUS: (state, data) => {
    const { node, val } = data
    setNodeStatus(state.menuConfigData, node, val)
  }
}

const actions = {
  setMenuConfigData({ commit }, data) {
    commit('SET_MENU_CONFIG_DATA', data)
  },
  setMenuConfigDataOrigin({ commit }, data) {
    commit('SET_MENU_CONFIG_DATA_ORIGIN', data)
  },
  setStepTwoObj({ commit }, data) {
    commit('SET_STEP_TWO_OBJ', data)
  },
  setStepThreeObj({ commit }, data) {
    commit('SET_STEP_THREE_OBJ', data)
  },
  setStepFourObj({ commit }, data) {
    commit('SET_STEP_FOUR_OBJ', data)
  },
  setStepFiveObj({ commit }, data) {
    commit('SET_STEP_FIVE_OBJ', data)
  },
  setIsHasApiContent({ commit }, data) {
    commit('SET_IS_HAS_API_CONTENT', data)
  },
  setCommonObj({ commit }, data) {
    commit('SET_COMMON_OBJ', data)
  },
  setClearAllStepObj({ commit }, data) {
    commit('SET_CLEAR_ALL_STEP_OBJ', data)
  },
  setNodeStatus({ commit }, data) {
    return new Promise(resolve => {
      commit('SET_NODE_STATUS', data)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
