<template>
  <div class="main-body">
    <div class="form-steps">
      <div v-if="operationType !== 'add'" class="form-steps-order">
        <div class="form-steps-order-left">
          <img src="@/assets/icon/service-icon.png" alt="service-icon.png">
          <span>{{ operationType | operationTypeFilter }}</span>
        </div>
        <div class="form-steps-order-right">{{ $t('permissionChange.serviceNumber') }}: {{ applyOrdNo }}</div>
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
          :label="$t('permissionChange.marketMembers')"
          name="00"
          disabled
        />
        <el-tab-pane
          v-if="institutionType === '10' && institutionTypeList.includes('10')"
          :label="$t('permissionChange.informationVendors')"
          name="10"
          disabled
        />
      </el-tabs>
      <div v-if="isShouldShow" class="mt10">
        <ViewStepOne
          v-show="activeIndex === 1"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :service-obj="serviceObj"
          :sub-apply-no-list="urlParams.subApplyNoList"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepTwo
          v-show="activeIndex === 2"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :service-obj="serviceObj"
          :sub-apply-no-list="urlParams.subApplyNoList"
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
            :label="$t('permissionChange.auditFeedback') + '：'"
            prop="auditFeedback"
          >
            <el-input
              v-model="auditObj.form.auditFeedback"
              type="textarea"
              maxlength="500"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
            <span class="red-color">
              {{ $t('permissionChange.contentDisplayedAfterAudit') }}
            </span>
          </el-form-item>
        </el-form>
        <div class="text-center">
          <el-button
            type="success"
            @click="onCheck(true)"
          >
            {{ $t('permissionChange.button.pass') }}
          </el-button>
          <el-button
            type="danger"
            @click="onCheck(false)"
          >
            {{ $t('permissionChange.button.reject') }}
          </el-button>
          <el-button
            v-if="serviceObj.goBackButtonFlag"
            type="primary"
            @click="showRollback"
          >
            {{ $t('permissionChange.button.goBack') }}
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
          <el-form-item :label="$t('permissionChange.backTo')" prop="targeTaskId">
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
import ViewStepOne from './components/viewStepOne'
import ViewStepTwo from './components/viewStepTwo'
import { auditProcessView, getProcessViewDetail, getRollbackNode, rollbackNode } from '@/api/interface-service/processViewApi'
import { permChangeDetail } from '@/api/interface-service/interfaceTerminationApi'
import globalOptions from '@/utils/globalOptionsValue'
export default {
  name: 'PermissionChange',
  components: {
    Steps,
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
        callback(new Error(this.$t('permissionChange.message.auditFeedbackRequired')))
      } else {
        callback()
      }
    }
    return {
      stepsList: [this.$t('permissionChange.requestForAccess'), this.$t('permissionChange.basicInformation')],
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
        title: this.$t('permissionChange.auditGoBack'),
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
    ...mapGetters(['userInfo']),
    applyOrdNo() {
      return this.$store.state.service.permissionChangeObj.commonObj.applyOrdNo
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
    console.log('权限变更index')
    if (this.operationType === 'add') {
      this.isShouldShow = true
      this.institutionType = this.urlParams.institutionType
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
            name: 'PermissionChangeList',
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
      this.getDetail(applyOrdNo)
    },
    getDetail(applyOrdNo) {
      const params = {
        applyNo: applyOrdNo
      }
      permChangeDetail(params).then(res => {
        console.log('权限变更详情')
        console.log(res)
        const data = res.data
        this.$store.dispatch('service/setPermissionChangeData', {
          commonObj: {
            applyOrdNo: this.urlParams.subApplyId
          },
          stepOneObj: {
            originData: data.permTree.bodyData,
            tableColumns: data.permTree.headList
          },
          stepTwoObj: {
            basicInfoList: data.permChangeBaseInfoList
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
