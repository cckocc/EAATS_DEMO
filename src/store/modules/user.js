import { login, logout, getInfo } from '@/api/user'
// import { loginDo } from '@/api/insideLink'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { generateRoles } from '@/utils'
import router, { resetRouter } from '@/router'
import store from '@/store'
import { getPublicKey } from '@/api/common'
const state = {
  token: getToken(),
  tempToken: null,
  name: '',
  userId: '',
  introduction: '',
  roles: [],
  changeOrganinfoflag: '',
  userInfo: {},
  isVisitor: false,
  institutionTypeList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TEMP_TOKEN: (state, token) => {
    state.tempToken = token
  },
  SET_TOKEN_AGAIN: (state, token) => {
    state.token = token
    setToken(token)
    state.tempToken = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_BASEINFOFLAG: (state, changeBaseInfoFlag) => { // 机构管理员修改按钮判断
    state.changeBaseInfoFlag = changeBaseInfoFlag
  },
  SET_USERINFO: (state, userInfo) => { // 机构管理员修改按钮判断
    state.userInfo = userInfo
  },
  SET_PUBLICKEY: (state, publicKey) => { // 公钥
    state.publicKey = publicKey
  },
  SET_IS_VISITOR: (state, isVisitor) => {
    state.isVisitor = isVisitor
  },
  SET_INSTITUTION_TYPE_LIST: (state, data) => {
    // 10-信息商 00-本币市场成员 05-外汇市场成员 15-系统接入开发机构
    let arr = []
    if (data.includes('00') || data.includes('05')) {
      arr.push('00')
    }
    if (data.includes('10')) {
      arr.push('10')
    }
    if (data.includes('15')) {
      arr = ['00', '10']
    }
    state.institutionTypeList = arr
  }
}

const actions = {
  setPublicKey({ commit, state }, publicKey) {
    commit('SET_PUBLICKEY', publicKey)
  },
  setTokenAgain({ commit }, token) {
    commit('SET_TOKEN_AGAIN', token)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password, phoneCode, phoneNo, phoneNoAreaCode, email, verifyType, emailCode, loginType, loginSource, isvLogin } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, phoneCode, phoneNo, phoneNoAreaCode, email, verifyType, emailCode, loginType, loginSource: loginSource, isvLogin }).then(response => {
        if (response.code === 'ACK') {
          const { data, token } = response
          if (!data.isRead || data.isRead === '1') {
            commit('SET_TOKEN', token)
            setToken(token)
          } else {
            commit('SET_TEMP_TOKEN', token)
          }
          resolve(data)
        } else {
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  // loginDo({ commit }, param) {
  //   return new Promise((resolve, reject) => {
  //     loginDo({ param: param }).then(response => {
  //       if (response.code === 'ACK') {
  //         const { data } = response
  //         commit('SET_NAME', null)
  //         commit('SET_TOKEN', data.token)
  //         setToken(data.token)
  //         resolve(data)
  //       } else {
  //         resolve(response)
  //       }
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPublicKey().then(res => {
        const publickKey = res.data
        commit('SET_PUBLICKEY', publickKey)
      })
      getInfo().then(response => {
        const { data } = response
        // console.log(data)
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roleType, loginName, id, permDetailDtoList, changeBaseInfoFlag, instnIdentity } = data

        // roles must be a non-empty array
        if (!roleType || roleType == null) {
          reject('getInfo: roles must be a non-null array!')
        }
        // const roles = [roleType.code]
        const roles = generateRoles(permDetailDtoList)
        // data.roles = ['admin']
        // commit('SET_ROLES', ['admin'])
        data.roles = roles
        commit('SET_ROLES', roles)
        commit('SET_NAME', loginName)
        commit('SET_USERID', id)
        commit('SET_BASEINFOFLAG', changeBaseInfoFlag)
        commit('SET_USERINFO', data)
        commit('SET_IS_VISITOR', false)
        commit('SET_INSTITUTION_TYPE_LIST', instnIdentity || [])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(async() => {
        await router.push('/home')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        commit('SET_USERID', '')
        commit('SET_BASEINFOFLAG', '')
        commit('SET_USERINFO', {})
        commit('SET_IS_VISITOR', false)
        removeToken()
        resetRouter()

        // Generate guest routes immediately after logging out
        const roles = ['visitors']
        const accessRoutes = await store.dispatch('permission/generateVisitorRoutes', roles, { root: true })
        router.addRoutes(accessRoutes)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_IS_VISITOR', false)
      removeToken()
      resolve()
    })
  },

  setIsVisitor({ commit }, isVisitor) {
    return new Promise(resolve => {
      commit('SET_IS_VISITOR', isVisitor)
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
