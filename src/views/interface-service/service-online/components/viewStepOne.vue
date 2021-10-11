<template>
  <div>
    <div v-if="isView" class="form-body-content">
      <div class="modal-main-body">
        <div class="form-title">
          <span>{{ $t('interfaceOnline.requestedPermissionList') }}</span>
        </div>
        <tableTree
          :origin-data="stepOneObj.originData"
          :table-columns="stepOneObj.tableColumns"
        />
      </div>
    </div>
    <div v-else class="form-body-content">
      <div class="modal-main-body">
        <tableTree
          ref="tableTree"
          :origin-data="stepOneObj.originData"
          :table-columns="stepOneObj.tableColumns"
          show-checkbox
          is-fold
        />
      </div>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep('0')"
      >
        {{ $t('common.button.nextPage') }}
      </el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="nextStep('1')"
      >
        {{ $t('interfaceOnline.button.saveApplicationForm') }}
      </el-button>
      <el-button
        @click="cancel"
      >
        {{ $t('common.button.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import serviceOnlineApi from '@/api/interface-service/serviceOnlineApi'
import { parseTime } from '@/utils/index'
export default {
  props: {
    operationType: {
      type: String,
      default: 'add'
    },
    parentType: {
      type: String,
      default: ''
    },
    institutionType: {
      type: String,
      default: ''
    },
    subApplyNoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.serviceOnlineObj.commonObj.applyOrdNo
    },
    stepOneObj() {
      return this.$store.state.service.serviceOnlineObj.stepOneObj
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('接口上线第一步apply')
    if (this.isView) {
      console.log('detail')
    } else {
      this.getMenuConfig()
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    /**
     * @method: 下一步
     * @param {String} operateType 0-下一步、1-保存
     */
    nextStep(operateType) {
      if (this.isView) {
        this.$emit('changeSteps', 2)
      } else {
        const checkedList = this.$refs.tableTree.getCheckedNodeList()
        if (checkedList.length === 0) {
          this.$message({
            type: 'info',
            message: this.$t('interfaceOnline.message.atLeastOneItemChecked')
          })
          return
        }
        const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
        const checkedLeafIdList = checkedLeafList.map(e => e.id)
        const params = {
          applyOrdNo: this.applyOrdNo,
          bizProcId: this.parentType,
          institutionType: this.institutionType,
          checkedNodeIdList: checkedLeafIdList,
          operateType: operateType,
          subApplyNoList: this.subApplyNoList
        }
        serviceOnlineApi.saveApplyPermission(params).then(res => {
          console.log(res)
          if (res.code !== 'ACK') {
            this.$message({
              type: 'error',
              message: res.message
            })
            return
          }
          const urgencyContact = {
            userName: null,
            depart: null,
            position: null,
            telNo: null,
            phoneNo: null,
            faxNo: null,
            email: null
          }
          const onlineBasicInfoList = res.data.onlineBasicInfoList.map(e => {
            e.signAgreementFlg = e.signAgreementFlg ? e.signAgreementFlg.name : 'NO'
            e.signDigitalFlg = e.signDigitalFlg ? e.signDigitalFlg.name : 'NO'
            e.permChangeFlg = e.permChangeFlg ? e.permChangeFlg.name : 'NO'
            e.onlineTs = e.onlineTs ? parseTime(e.onlineTs, '{yyyy}-{mm}-{dd}') : e.onlineTs
            e.urgencyContact = e.urgencyContact ? e.urgencyContact : Object.assign({}, urgencyContact)
            e.serviceOnlineApiInfo = e.serviceOnlineApiInfo ? e.serviceOnlineApiInfo : []
            e.agreementTermDtoList = e.agreementTermDtoList ? e.agreementTermDtoList : []
            e.agreementTermDtoList.map(file => {
              file.name = file.fileName
              return file
            })
            e.digitalCertificateDtoList = e.digitalCertificateDtoList ? e.digitalCertificateDtoList : []
            e.digitalCertificateDtoList.map(file => {
              file.name = file.fileName
              return file
            })
            e.onlineFiles = e.onlineFiles ? e.onlineFiles : []
            e.onlineFiles.map(file => {
              file.name = file.fileName
              return file
            })
            e.onlineFiles2 = e.onlineFiles2 ? e.onlineFiles2 : []
            e.onlineFiles2.map(file => {
              file.name = file.fileName
              return file
            })
            return e
          })
          const onlineFileList = res.data.onlineFileList ? res.data.onlineFileList : []
          onlineFileList.map(e => {
            e.name = e.fileName
            return e
          })
          const stepTwoObj = {
            instName: res.data.instName,
            onlineBasicInfoList: onlineBasicInfoList,
            onlineFileList: onlineFileList
          }
          this.$store.dispatch('service/setServiceOnlineData', {
            commonObj: {
              applyOrdNo: res.data.applyOrdNo
            },
            stepTwoObj: stepTwoObj
          })
          if (operateType === '0') {
            this.$emit('changeSteps', 2)
          } else {
            this.$message({
              type: 'success',
              message: res.message
            })
          }
        })
      }
    },
    // 获取菜单配置项
    getMenuConfig() {
      const params = {
        bizProcId: this.parentType,
        menuInstiType: this.institutionType,
        subApplyNoList: this.subApplyNoList
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOnlineApi.getMenuConfigItem(params).then(res => {
        const originData = res.data.nodeList
        const tableColumns = res.data.headList
        this.$store.dispatch(
          'service/setServiceOnlineData',
          {
            stepOneObj: {
              originData: originData,
              tableColumns: tableColumns
            }
          }
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
