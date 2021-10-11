const state = {
  componentInfo: {}
}

const mutations = {
  COMPONENT_INFO: (state, comInfo) => {
    state.componentInfo = comInfo
  }
}

const actions = {
  getComponentInfo({ commit }, comInfo) {
    commit('COMPONENT_INFO', comInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
