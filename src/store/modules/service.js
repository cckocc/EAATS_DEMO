// import validate from '@/utils/validate'
const state = {
  // 服务开通
  serviceOpeningObj: {
    commonObj: {
      applyOrdNo: null
    },
    stepOneObj: {
      originData: [],
      tableColumns: []
    },
    stepTwoObj: {
      instName: '',
      address: null,
      postCode: null,
      applyOrdNo: null,
      contactNumber: 0,
      contactList: []
    },
    stepThreeObj: {
      cmssNodeFlag: false,
      cmssNodeTradAfterFlag: false,
      fxspNodeFlag: false,
      fxspNodeTradAfterFlag: false,
      form: {
        applyOrdNo: '',
        infoStandardFlag: '0',
        hasRiskMechanism: '0',
        tradeStandardFlag: '0',
        qualificationFlag: '0',
        requirementsFlag: '0',
        hasHotLine: '0',
        hasBackupHotLine: '0',
        devInstitutionName: '',
        devInstitutionId: null,
        basicInfoList: [],
        hotlineInfo: '',
        contactForeignExchangeSystemFlag: '0',
        foreignCurrencyMarketFlag: '0',
        lyForeignSales: '',
        contactCurrencySystemFlag: '0',
        bondCurrencyMarketFlag: '0',
        ltLocalSales: ''
      }
    }
  },
  // 验收测试
  acceptanceTestObj: {
    commonObj: {
      applyOrdNo: null,
      checkedFormKeys: []
    },
    stepOneObj: {
      originData: [],
      tableColumns: []
    },
    stepTwoObj: {
      formList: []
    },
    stepThreeObj: {
      formList: []
    }
  },
  // 接口上线
  serviceOnlineObj: {
    commonObj: {
      applyOrdNo: null
    },
    stepOneObj: {
      originData: [],
      tableColumns: []
    },
    stepTwoObj: {
      instName: '',
      menuVersion: '',
      onlineFileList: [],
      onlineBasicInfoList: []
    }
  },
  // 权限变更
  permissionChangeObj: {
    commonObj: {
      applyOrdNo: null
    },
    stepOneObj: {
      originData: [],
      tableColumns: []
    },
    stepTwoObj: {
      basicInfoList: []
    }
  }
}

const mutations = {
  // 服务开通
  SET_SERVICE_OPENING_OBJ: (state, data) => {
    state.serviceOpeningObj = Object.assign({}, state.serviceOpeningObj, data)
  },
  // 验收测试
  SET_ACCEPTANCE_TEST_OBJ: (state, data) => {
    if (data.stepTwoObj) {
      state.acceptanceTestObj.stepTwoObj.formList = []
      const formListFormat = data.stepTwoObj.formList.map(form => {
        form.questionList.map(question => {
          question.options.map(option => {
            const rules = option.rules ? JSON.parse(option.rules) : null
            option.rulesObj = rules || {}
            option.rules = null
            option.disabled = false
            if (option.elementType === 'checkbox') {
              option.value = option.value ? JSON.parse(option.value) : []
            }
            return option
          })
          return question
        })
        return form
      })
      console.log(formListFormat)
      // data.stepTwoObj.formList = JSON.parse(JSON.stringify(formListFormat), (key, value) => {
      //   if (key === 'validator' && typeof value === 'string') {
      //     return Function('return ' + value).bind(validate)()
      //   }
      //   return value
      // })
      data.stepTwoObj.formList = formListFormat
    }
    for (const [key, value] of Object.entries(data)) {
      state.acceptanceTestObj[key] = Object.assign({}, state.acceptanceTestObj[key], value)
    }
  },
  // 接口上线
  SET_SERVICE_ONLINE_OBJ: (state, data) => {
    state.serviceOnlineObj = Object.assign({}, state.serviceOnlineObj, data)
  },
  // 权限变更
  SET_PERMISSION_CHANGE_OBJ: (state, data) => {
    state.permissionChangeObj = Object.assign({}, state.permissionChangeObj, data)
  }
}

const actions = {
  // 服务开通
  setServiceOpeningData({ commit }, data) {
    commit('SET_SERVICE_OPENING_OBJ', data)
  },
  // 验收测试
  setAcceptanceTestData({ commit }, data) {
    commit('SET_ACCEPTANCE_TEST_OBJ', data)
  },
  // 接口上线
  setServiceOnlineData({ commit }, data) {
    commit('SET_SERVICE_ONLINE_OBJ', data)
  },
  // 权限变更
  setPermissionChangeData({ commit }, data) {
    commit('SET_PERMISSION_CHANGE_OBJ', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
