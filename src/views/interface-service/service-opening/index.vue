<template>
  <div class="main-body">
    <div class="form-steps">
      <div v-if="operationType !== 'add'" class="form-steps-order">
        <div class="form-steps-order-left">
          <img src="@/assets/icon/service-icon.png" alt="service-icon.png">
          <span>{{ operationType | operationTypeFilter }}</span>
        </div>
        <div class="form-steps-order-right">{{ $t('serviceOpening.serviceNumber') }}：{{ applyOrdNo }}</div>
      </div>
      <Steps :steps-list="stepsList" :active-index="activeIndex" />
    </div>
    <div>
      <el-tabs
        v-model="institutionType"
        class="custom-minor-tabs"
        @tab-click="tabClick"
      >
        <el-tab-pane
          v-if="isGripUser ? institutionType === '00' : institutionTypeList.includes('00')"
          :disabled="isGripUser || activeIndex !== 1 || (operationType !== 'add')"
          :label="$t('serviceOpening.marketInstitutions')"
          name="00"
        />
        <el-tab-pane
          v-if="isGripUser ? institutionType === '10' : institutionTypeList.includes('10')"
          :disabled="activeIndex !== 1 || (operationType !== 'add')"
          :label="$t('serviceOpening.informationVendors')"
          name="10"
        />
      </el-tabs>
      <div v-if="isShouldShow" class="mt10">
        <ViewStepOne
          v-show="activeIndex === 1"
          ref="stepOneRef"
          :institution-type-list="institutionTypeList"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepTwo
          v-show="activeIndex === 2"
          :institution-type-list="institutionTypeList"
          :institution-type="institutionType"
          :operation-type="operationType"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepThree
          v-show="activeIndex === 3"
          ref="stepThree"
          :institution-type-list="institutionTypeList"
          :institution-type="institutionType"
          :operation-type="operationType"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
      </div>
      <div v-if="operationType === 'audit' && isShouldShow" class="form-body-content">
        <el-form
          ref="auditForm"
          :model="auditObj.form"
          :rules="auditObj.rules"
        >
          <el-form-item
            :label="$t('serviceOpening.auditFeedback')"
            prop="auditFeedback"
          >
            <el-input
              v-model="auditObj.form.auditFeedback"
              type="textarea"
              maxlength="500"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
            <span class="red-color">
              {{ $t('serviceOpening.contentDisplayedAfterAudit') }}
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
            v-preventReClick
            type="danger"
            @click="onCheck(false)"
          >
            {{ $t('common.button.reject') }}
          </el-button>
          <el-button
            v-if="serviceObj.goBackButtonFlag"
            v-preventReClick
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
          <el-form-item :label="$t('serviceOpening.backTo')" prop="targeTaskId">
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
            v-preventReClick
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
import ViewStepOne from './components/viewStepOne'
import ViewStepTwo from './components/viewStepTwo'
import ViewStepThree from './components/viewStepThree'
import { auditProcessView, getProcessViewDetail, getRollbackNode, rollbackNode } from '@/api/interface-service/processViewApi'
import { getServiceOpeningDetail } from '@/api/interface-service/serviceOpeningApi'
import globalOptions from '@/utils/globalOptionsValue'
export default {
  name: 'ServiceOpening',
  components: {
    Steps,
    ViewStepOne,
    ViewStepTwo,
    ViewStepThree
  },
  filters: {
    operationTypeFilter(val) {
      return val ? globalOptions.operationTypeOptions.find(e => e.value === val).label : null
    }
  },
  data() {
    const validateAuditFeedback = (rule, value, callback) => {
      if (!this.auditObj.isStatus && value === '') {
        callback(new Error(this.$t('serviceOpening.message.auditFeedbackRequired')))
      } else {
        callback()
      }
    }
    return {
      stepsList: [this.$t('serviceOpening.requestForAccess'), this.$t('serviceOpening.basicInformation'), this.$t('serviceOpening.selfConditionAssessment')],
      activeIndex: 1,
      institutionType: '',
      isShouldShow: false,
      serviceObj: {},
      // 审核
      auditObj: {
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
        title: this.$t('serviceOpening.auditGoBack'),
        options: [],
        form: {
          targeTaskId: null
        },
        rules: {
          targeTaskId: [
            { required: true, message: this.$t('common.validate.required'), trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    applyOrdNo() {
      return this.$store.state.service.serviceOpeningObj.commonObj.applyOrdNo
    },
    isGripUser() {
      return this.userInfo.userInnerType.name === 'GRIP'
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
    }
  },
  created() {
    console.log('服务开通index')
    if (this.operationType === 'add') {
      this.isShouldShow = true
      if (this.institutionTypeList.length > 0) {
        this.institutionType = this.institutionTypeList[0]
      } else {
        this.institutionType = ''
      }
    } else {
      this.getProcessViewDetail()
    }
  },
  methods: {
    tabClick(val) {
      console.log(val)
      this.institutionType = val.name
      this.$nextTick(() => {
        this.$refs.stepOneRef.showMarket = false
        this.$refs.stepOneRef.showInterface = false
        this.$refs.stepOneRef.showProduct = false
        this.$refs.stepOneRef.checkMarketList = []
        this.$refs.stepOneRef.checkInterfaceList = []
        this.$refs.stepOneRef.checkInterfaceList = []
        this.$refs.stepOneRef.checkList = []
        this.$refs.stepOneRef.getMenuConfig()
      })
    },
    changeSteps(index) {
      console.log(index)
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
            name: 'ServiceManage'
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
      this.serviceObj = processRes.data
      this.serviceObj.isMainOrder = this.urlParams.isMainOrder
      this.institutionType = processRes.data.institutionType
      const applyOrdNo = this.serviceObj.isMainOrder ? processRes.data.applyId : processRes.data.subApplyId
      this.getDetail(applyOrdNo)
    },
    getDetail(applyOrdNo) {
      const params = {
        applyOrdNo: applyOrdNo,
        instiType: this.institutionType
      }
      getServiceOpeningDetail(params).then(res => {
        console.log('服务开通详情')
        console.log(res)
        const data = res.data
        const stepThreeFlagObj = {
          cmssNodeFlag: data.cmssNodeFlag,
          cmssNodeTradAfterFlag: data.cmssNodeTradAfterFlag,
          fxspNodeFlag: data.fxspNodeFlag,
          fxspNodeTradAfterFlag: data.fxspNodeTradAfterFlag
        }
        this.$store.dispatch('service/setServiceOpeningData', {
          commonObj: {
            applyOrdNo: applyOrdNo
          },
          stepOneObj: {
            originData: data.menuManageTreeDto.nodeList,
            tableColumns: data.menuManageTreeDto.headList
          },
          stepTwoObj: data.basicInfo,
          stepThreeObj: {
            ...stepThreeFlagObj,
            form: data.assessDto
          }
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
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          const params = {
            pass: type,
            auditFeedback: this.auditObj.form.auditFeedback,
            remark: this.auditObj.form.remark,
            auidtUserId: this.userInfo.id,
            applyNo: this.serviceObj.subApplyId,
            auditId: this.serviceObj.flowAuditId,
            taskId: this.serviceObj.taskId
          }
          auditProcessView(params).then(res => {
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
