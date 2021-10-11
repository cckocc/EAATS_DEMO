import registerApi from '@/api/register'
import gripManageApi from '@/api/gripManageApi'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      operateUserId: null,
      orgOptions: [], // 所有机构枚举值
      allRoleTypeOptions: [], // 所有用户角色枚举值
      needRoleTypeOptions: [], // 需要的用户角色枚举值
      allOrgTypeOptions: [], // 所有机构身份枚举值
      needOrgTypeOptions: [], // 需要的机构身份枚举值
      inOrgTypeOptions: [], // 该机构身份枚举值
      adminUniteOrgTypeOptions: [], // 管理员并集的机构身份枚举值
      adminOrgTypeOptions: [], // 当前管理员的机构身份枚举值
      disabledOrgTypeList: [] // 需要置灰的机构身份
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getOrgTypeList()
    this.getOrgList()
    // this.getCommonRoleType()
  },
  methods: {
    // 获取全部机构枚举值
    getOrgList() {
      registerApi.searchOrgByName().then(res => {
        this.orgOptions = res.data
      })
    },
    // 获取全部用户角色枚举值
    getCommonRoleType() {
      const params = {
        type: 1
      }
      gripManageApi.getCommonRoleType(params).then(res => {
        this.allRoleTypeOptions = res.data
      })
    },
    // 获取系统所有机构身份
    async getOrgTypeList() {
      const { data } = await registerApi.getOrgTypeList()
      this.allOrgTypeOptions = data.map(e => {
        e.disabled = false
        return e
      })
      if (this.userInfo.userInnerType && this.userInfo.userInnerType.name !== 'GRIP') {
        this.adminOrgTypeOptions = this.allOrgTypeOptions.filter(e => this.userInfo.instnIdentity.includes(e.code))
      }
    },
    // 用户角色变动时重置机构身份枚举值和机构身份
    onChangeRoleType(val) {
      if (val === 'AGENCY_ADMIN') {
        this.needOrgTypeOptions = JSON.parse(JSON.stringify(this.inOrgTypeOptions))
      } else if (val === 'AGENCY_USER') {
        this.needOrgTypeOptions = JSON.parse(JSON.stringify(this.adminUniteOrgTypeOptions))
      }
      this.handleOrgType()
    },
    // 机构变动时获取机构身份和相应角色以及重置这两个值
    onChangeOrg(val, isReset = true) {
      return new Promise((resolve, reject) => {
        const params = {
          instnId: val
        }
        registerApi.getOrgKeyInfoById(params).then(res => {
          let { roleType, instnIdentityList, instnAdminIdentityList } = res.data
          roleType = roleType || []
          instnIdentityList = instnIdentityList || []
          instnAdminIdentityList = instnAdminIdentityList || []
          this.needRoleTypeOptions = roleType
          this.inOrgTypeOptions = instnIdentityList.map(e => {
            e.disabled = false
            return e
          })
          this.adminUniteOrgTypeOptions = instnAdminIdentityList.map(e => {
            e.disabled = false
            return e
          })
          if (isReset) {
            this.handleRoleTypeAndOrgType()
          } else {
            this.onChangeRoleType(this.userDialogObj.form.roleType)
          }
          resolve()
        })
      })
    },
    // 机构身份复选框组切换
    orgTypeChange(value = []) {
      const mutexType = '15'
      if (value.length === 0) {
        this.needOrgTypeOptions.map(e => {
          e.disabled = false
          return e
        })
      } else {
        if (value.includes(mutexType)) {
          this.needOrgTypeOptions.map(e => {
            if (e.code !== mutexType) {
              e.disabled = true
            }
            return e
          })
        } else {
          this.needOrgTypeOptions.map(e => {
            if (e.code === mutexType) {
              e.disabled = true
            }
            return e
          })
        }
      }
      // 永久置灰某些选项
      this.needOrgTypeOptions.map(e => {
        e.disabled = this.disabledOrgTypeList.includes(e.code) ? true : e.disabled
        return e
      })
      console.log(this.needOrgTypeOptions)
    }
  }
}
