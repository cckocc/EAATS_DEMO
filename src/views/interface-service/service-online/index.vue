<template>
  <div class="main-body">
    <div class="form-steps">
      <div v-if="operationType !== 'add'" class="form-steps-order">
        <div class="form-steps-order-left">
          <img src="@/assets/icon/service-icon.png" alt="service-icon.png">
          <span>{{ operationType | operationTypeFilter }}</span>
        </div>
        <div class="form-steps-order-right">{{ $t('interfaceOnline.serviceCode') }}：{{ applyOrdNo }}</div>
      </div>
      <Steps :steps-list="stepsList" :active-index="activeIndex" />
    </div>
    <div>
      <el-tabs
        v-model="institutionType"
        class="custom-minor-tabs"
      >
        <el-tab-pane
          v-if="institutionType === '00' && institutionTypeList.includes('00')"
          :label="$t('interfaceOnline.marketMembers')"
          name="00"
          disabled
        />
        <el-tab-pane
          v-if="institutionType === '10' && institutionTypeList.includes('10')"
          :label="$t('interfaceOnline.informationVendors')"
          name="10"
          disabled
        />
      </el-tabs>
      <div v-if="isShouldShow" class="mt10">
        <apiViewStepOne
          v-if="parentType === '20'"
          v-show="activeIndex === 1"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :sub-apply-no-list="urlParams.subApplyNoList"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepOne
          v-else
          v-show="activeIndex === 1"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :sub-apply-no-list="urlParams.subApplyNoList"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepTwo
          v-show="activeIndex === 2"
          ref="stepTwo"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :service-obj="serviceObj"
          :sub-apply-no-list="urlParams.subApplyNoList"
          :is-grip-user="isGripUser"
          :is-last-audit-user="auditObj.isLastAuditUser"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
      </div>
      <div v-if="operationType === 'audit'" class="form-body-content">
        <el-form
          ref="auditForm"
          :model="auditObj.form"
          :rules="auditObj.rules"
        >
          <el-form-item
            :label="$t('interfaceOnline.auditFeedback') + '：'"
            prop="auditFeedback"
          >
            <el-input
              v-model="auditObj.form.auditFeedback"
              type="textarea"
              maxlength="500"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
            <span class="red-color">
              {{ $t('interfaceOnline.auditFeedbackNote') }}
            </span>
          </el-form-item>
        </el-form>
        <div class="text-center">
          <el-button
            v-preventReClick
            type="success"
            @click="onCheck(true)"
          >
            {{ $t('common.button.pass') }}
          </el-button>
          <el-button
            v-if="!isAdmin"
            v-preventReClick
            type="danger"
            @click="onCheck(false)"
          >
            {{ $t('common.button.reject') }}
          </el-button>
          <el-button
            v-if="serviceObj.goBackButtonFlag"
            type="primary"
            @click="showRollback"
          >
            {{ $t('common.button.goBack') }}
          </el-button>
        </div>
      </div>
      <el-dialog
        width="800px"
        :title="rollbackDialogObj.title"
        :visible.sync="rollbackDialogObj.visible"
      >
        <el-form
          ref="rollbackForm"
          :model="rollbackDialogObj.form"
          :rules="rollbackDialogObj.rules"
          label-width="100px"
          label-position="left"
        >
          <el-form-item :label="$t('interfaceOnline.backTo')" prop="targeTaskId">
            <el-radio-group v-model="rollbackDialogObj.form.targeTaskId">
              <div
                v-for="item in rollbackDialogObj.options"
                :key="item.id"
                class="mb10"
              >
                <el-radio :label="item.id">{{ item.name }}</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="onRollback"
          >{{ $t('common.button.confirm2') }}</el-button>
          <el-button
            @click="rollbackDialogObj.visible = false"
          >{{ $t('common.button.cancel') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Steps from '@/components/Steps'
import apiViewStepOne from './components/apiViewStepOne'
import ViewStepOne from './components/viewStepOne'
import ViewStepTwo from './components/viewStepTwo'
import { getProcessViewDetail, getRollbackNode, rollbackNode } from '@/api/interface-service/processViewApi'
import { auditDoOnline } from '@/api/gripManageApi'
import { getLastAuditUserFlag, getServiceOnlineDetail } from '@/api/interface-service/serviceOnlineApi'
import { parseTime } from '@/utils/index'
import globalOptions from '@/utils/globalOptionsValue'
export default {
  name: 'ServiceOnline',
  components: {
    Steps,
    apiViewStepOne,
    ViewStepOne,
    ViewStepTwo
  },
  filters: {
    operationTypeFilter(val) {
      return val ? globalOptions.operationTypeOptions.find(e => e.value === val).label : null
    }
  },
  data() {
    const validateAuditFeedback = (rule, value, callback) => {
      if (!this.auditObj.isStatus && value === '') {
        callback(new Error(this.$t('interfaceOnline.message.auditFeedbackRequired')))
      } else {
        callback()
      }
    }
    return {
      stepsList: [this.$t('interfaceOnline.requestForAccess'), this.$t('interfaceOnline.basicInformationAndDataUpload')],
      activeIndex: 1,
      institutionType: '',
      isShouldShow: false,
      serviceObj: {},
      // 审核
      auditObj: {
        status: true,
        isLastAuditUser: false,
        form: {
          auditFeedback: '',
          remark: ''
        },
        rules: {
          auditFeedback: [
            { validator: validateAuditFeedback, trigger: 'blur' }
          ]
        }
      },
      // 回退
      rollbackDialogObj: {
        visible: false,
        title: this.$t('interfaceOnline.auditGoBack'),
        options: [],
        form: {
          targeTaskId: null
        },
        rules: {
          targeTaskId: [
            { required: true, message: this.$t('common.message.required'), trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    applyOrdNo() {
      return this.$store.state.service.serviceOnlineObj.commonObj.applyOrdNo
    },
    isGripUser() {
      return this.userInfo.userInnerType.name === 'GRIP'
    },
    isAdmin() {
      return this.userInfo.roleType.name === 'SUPER_ADMINISTRATOR'
    },
    institutionTypeList() {
      return this.$store.state.user.institutionTypeList
    },
    urlParams() {
      return JSON.parse(decodeURIComponent(this.$route.query.params))
    },
    parentType() {
      return this.urlParams.parentType
    },
    operationType() {
      return this.urlParams.operationType
    },
    stepTwoObj() {
      return this.$store.state.service.serviceOnlineObj.stepTwoObj
    }
  },
  created() {
    console.log('接口上线index')
    if (this.operationType === 'add') {
      this.$store.dispatch('service/setServiceOnlineData', {
        commonObj: {
          applyOrdNo: null
        }
      }).then(() => {
        this.isShouldShow = true
        this.institutionType = this.urlParams.institutionType
      })
    } else {
      this.getProcessViewDetail()
    }
  },
  methods: {
    changeSteps(index) {
      this.activeIndex = index
    },
    cancel() {
      if (this.isGripUser) {
        this.$router.push({
          name: 'ProcessView'
        })
      } else {
        if (this.operationType === 'add') {
          this.$router.push({
            name: 'InterfaceOnlineList',
            query: {
              parentType: this.parentType
            }
          })
        } else {
          this.$router.push({
            name: 'MyService'
          })
        }
      }
    },
    async getProcessViewDetail() {
      const form = new FormData()
      form.append('awaitFlag', this.operationType === 'audit' ? 'true' : 'false')
      form.append('subApplyId', this.urlParams.subApplyId)
      form.append('currAuditUserId', this.userInfo.id)
      const processRes = await getProcessViewDetail(form)
      console.log(this.urlParams)
      this.serviceObj = processRes.data
      this.serviceObj.isMainOrder = this.urlParams.isMainOrder
      this.institutionType = processRes.data.institutionType
      const applyOrdNo = this.serviceObj.isMainOrder ? processRes.data.applyId : processRes.data.subApplyId
      if (this.operationType === 'audit') {
        const params = {
          taskId: processRes.data.taskId,
          auditId: this.serviceObj.flowAuditId
        }
        getLastAuditUserFlag(params).then(res => {
          this.auditObj.isLastAuditUser = this.isAdmin || res.data
          this.getDetail(applyOrdNo)
        })
      } else {
        this.getDetail(applyOrdNo)
      }
    },
    getDetail(applyOrdNo) {
      const params = {
        applyOrdNo: applyOrdNo,
        institutionType: this.institutionType
      }
      if (this.operationType === 'audit') {
        params.viewType = 'audit'
      } else {
        params.viewType = 'view'
      }
      getServiceOnlineDetail(params, this.parentType).then(res => {
        console.log('接口上线详情')
        console.log(res)
        const data = res.data
        const onlineBasicInfoList = data.onlineBasicInfoList.map(e => {
          e.signAgreementFlg = e.signAgreementFlg ? e.signAgreementFlg.name : 'NO'
          e.signDigitalFlg = e.signDigitalFlg ? e.signDigitalFlg.name : 'NO'
          e.permChangeFlg = e.permChangeFlg ? e.permChangeFlg.name : 'NO'
          e.onlineTs = e.onlineTs ? parseTime(e.onlineTs, '{yyyy}-{mm}-{dd}') : e.onlineTs
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
        const onlineFileList = data.onlineFileList ? data.onlineFileList : []
        onlineFileList.map(e => {
          e.name = e.fileName
          return e
        })
        let stepOneObj = {}
        if (this.parentType === '20') {
          stepOneObj = {
            originData: data.permChangeTreeVO.bodyData,
            tableColumns: data.permChangeTreeVO.headList
          }
        } else {
          stepOneObj = {
            originData: data.menuManageTreeDto.nodeList,
            tableColumns: data.menuManageTreeDto.headList
          }
        }
        const stepTwoObj = {
          instName: data.instName,
          menuVersion: data.menuVersion,
          onlineBasicInfoList: onlineBasicInfoList,
          onlineFileList: onlineFileList
        }
        this.$store.dispatch('service/setServiceOnlineData', {
          commonObj: {
            applyOrdNo: this.urlParams.subApplyId
          },
          stepOneObj: stepOneObj,
          stepTwoObj: stepTwoObj
        }).then(() => {
          this.isShouldShow = true
        })
      })
    },
    /**
     * @method: 审核
     * @param {type} true: 通过, false: 拒绝
     * @return {无}
     */
    onCheck(type) {
      this.auditObj.isStatus = type
      const that = this
      if (!type) {
        that.$refs.stepTwo.$refs.stepTwoForm.clearValidate()
      }
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          if (type) {
            that.$refs.stepTwo.$refs.stepTwoForm.validate((validin, prop) => {
              if (validin) {
                const onlineApiInfoList = []
                const onlineBasicInfoList = JSON.parse(JSON.stringify(this.stepTwoObj.onlineBasicInfoList))
                onlineBasicInfoList.forEach((e, index) => {
                  e.serviceOnlineApiInfo.map(api => {
                    api.apiActList = api.apiActList.map((apiAct, apiActIndex) => {
                      apiAct.orderNum = apiActIndex
                      return apiAct
                    })
                    return api
                  })
                  onlineApiInfoList.push(...e.serviceOnlineApiInfo)
                })

                const params = {
                  pass: type,
                  auditFeedback: this.auditObj.form.auditFeedback,
                  remark: this.auditObj.form.remark,
                  auidtUserId: this.userInfo.id,
                  applyNo: this.serviceObj.subApplyId,
                  auditId: this.serviceObj.flowAuditId,
                  taskId: this.serviceObj.taskId,
                  onlineApiInfoList: onlineApiInfoList
                }
                console.log(onlineApiInfoList)
                const sameNameFlag = onlineApiInfoList.some(e => {
                  const apiActNameList = new Set()
                  e.apiActList.forEach(api => {
                    apiActNameList.add(api.apiActName ? api.apiActName : Symbol())
                  })
                  return apiActNameList.size < e.apiActList.length && !e.apiActList[0].purpose
                })
                if (sameNameFlag) {
                  this.$message({
                    type: 'info',
                    message: this.$t('interfaceOnline.message.apiAccountNotBeDuplicate')
                  })
                  return
                }
                // 是否最后一个审核人
                if (that.auditObj.isLastAuditUser) {
                  this.$confirm(this.$t('interfaceOnline.message.apiAccountCompleteConfirm'), this.$t('common.message.tips'), {
                    confirmButtonText: this.$t('common.button.confirm2'),
                    cancelButtonText: this.$t('common.button.cancel'),
                    type: 'warning'
                  }).then(() => {
                    console.log(params)
                    auditDoOnline(params).then(res => {
                      console.warn('审核： ', res)
                      this.$message({
                        type: 'success',
                        message: res.message
                      })
                      this.cancel()
                    })
                  })
                } else {
                  console.log(params)
                  auditDoOnline(params).then(res => {
                    console.warn('审核： ', res)
                    this.$message({
                      type: 'success',
                      message: res.message
                    })
                    this.cancel()
                  })
                }
              } else {
                this.$message({
                  type: 'info',
                  message: this.$t('interfaceOnline.message.apiAccountIncomplete')
                })
                const errArr = []
                for (var key in prop) {
                  console.log(key)
                  const index = key.split('.')[1]
                  errArr.push(Number(index))
                }
                const activeNames = that.$refs.stepTwo.activeNames
                activeNames.push(...errArr)
                that.$refs.stepTwo.activeNames = [...new Set(activeNames)]
              }
            })
          } else {
            const onlineApiInfoList = []
            const onlineBasicInfoList = JSON.parse(JSON.stringify(this.stepTwoObj.onlineBasicInfoList))
            onlineBasicInfoList.forEach((e, index) => {
              onlineApiInfoList.push(...e.serviceOnlineApiInfo)
            })
            const params = {
              pass: type,
              auditFeedback: this.auditObj.form.auditFeedback,
              remark: this.auditObj.form.remark,
              auidtUserId: this.userInfo.id,
              applyNo: this.serviceObj.subApplyId,
              auditId: this.serviceObj.flowAuditId,
              taskId: this.serviceObj.taskId,
              onlineApiInfoList: onlineApiInfoList
            }
            console.log(params)
            auditDoOnline(params).then(res => {
              console.warn('审核： ', res)
              this.$message({
                type: 'success',
                message: res.message
              })
              this.cancel()
            })
          }
        }
      })
    },
    showRollback() {
      this.rollbackDialogObj.form.targeTaskId = null
      const params = {
        auditId: this.serviceObj.flowAuditId,
        taskId: this.serviceObj.taskId
      }
      getRollbackNode(params).then(res => {
        this.rollbackDialogObj.visible = true
        this.rollbackDialogObj.options = res.data
        this.$nextTick(() => {
          this.$refs.rollbackForm.clearValidate()
        })
      })
    },
    onRollback() {
      this.$refs.rollbackForm.validate(valid => {
        if (valid) {
          const params = {
            targeTaskId: this.rollbackDialogObj.form.targeTaskId,
            auidtUserId: this.userInfo.id,
            auditId: this.serviceObj.flowAuditId,
            taskId: this.serviceObj.taskId
          }
          rollbackNode(params).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.$router.push({
              name: 'ProcessView'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
