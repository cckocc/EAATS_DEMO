<template>
  <div class="main-body">
    <div class="form-steps">
      <div v-if="operationType === 'add' || operationType === 'edit'" class="form-steps-order">
        <div style="color: red;display: flex;align-items: center;">
          <img class="mr5" src="@/assets/icon/notice.png" alt="">{{ $t('acceptanceTest.orgTip') }}
        </div>
      </div>
      <div v-if="operationType !== 'add'" class="form-steps-order">
        <div class="form-steps-order-left">
          <img src="@/assets/icon/service-icon.png" alt="service-icon.png">
          <span>{{ operationType | operationTypeFilter }}</span>
        </div>
        <div class="form-steps-order-right">{{ $t('acceptanceTest.serviceCode') }}：{{ applyOrdNo }}</div>
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
          :label="$t('acceptanceTest.marketMembers')"
          name="00"
          disabled
        />
        <el-tab-pane
          v-if="institutionType === '10' && institutionTypeList.includes('10')"
          :label="$t('acceptanceTest.informationVendors')"
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
          :sub-apply-no-list="urlParams.subApplyNoList"
          :still-apply-flag="urlParams.stillApplyFlag"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepTwo
          v-show="activeIndex === 2"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :sub-apply-no-list="urlParams.subApplyNoList"
          @changeSteps="changeSteps"
          @cancel="cancel"
        />
        <ViewStepThree
          v-show="activeIndex === 3"
          :institution-type="institutionType"
          :parent-type="parentType"
          :operation-type="operationType"
          :sub-apply-no-list="urlParams.subApplyNoList"
          :url-param="urlParams"
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
            :label="$t('acceptanceTest.auditFeedback')"
            prop="auditFeedback"
          >
            <el-input
              v-model="auditObj.form.auditFeedback"
              type="textarea"
              maxlength="500"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
            <span class="red-color">
              {{ $t('acceptanceTest.auditFeedbackMsg') }}
            </span>
          </el-form-item>
          <el-form-item
            v-if="serviceObj.subAuditStatus && serviceObj.subAuditStatus.name === 'TESTING'"
            :label="$t('acceptanceTest.testReportUpload')"
            prop="fileList.length"
            :rules="auditObj.rules.ids"
          >
            <el-upload
              ref="upload"
              action="fakeaction"
              :accept="auditObj.accept"
              :file-list="auditObj.form.fileList"
              :auto-upload="false"
              :on-change="onChangeFile"
              :on-remove="onRemoveFile"
            >
              <el-button slot="trigger" size="small" type="primary">{{ $t('acceptanceTest.button.selectFiles') }}</el-button>
              <div slot="tip" class="el-upload__tip">{{ $t('acceptanceTest.testReportFileUploadTip') }}</div>
            </el-upload>
            <el-input v-model="auditObj.form.fileList.length" style="display: none;" />
          </el-form-item>
          <div v-else class="mb20">
            <div
              v-for="item in auditObj.formList"
              :key="item.formId"
            >
              <div class="form-title">{{ item.name }}</div>
              {{ $t('acceptanceTest.testReport') }}<el-button type="text" @click="onPreview(item)">{{ item.testReportFileName }}</el-button>
            </div>
          </div>
        </el-form>
        <div class="text-center">
          <el-button
            v-preventReClick
            type="success"
            :disabled="stepThreeObj.formList && stepThreeObj.formList.length > 0 && stepThreeObj.formList[0].cassAccepterQuotaAllocationId === 'beAnAlternate'"
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
      <div v-if="operationType === 'detail' && serviceObj.isSonOrder && ((serviceObj.subAuditStatus && ['1020', '1070', '1040'].includes(serviceObj.subAuditStatus.code)) || auditObj.formList.length > 0)" class="form-body-content">
        <template v-if="serviceObj.subAuditStatus && ['1020', '1070', '1040'].includes(serviceObj.subAuditStatus.code)">
          <h3>{{ $t('acceptanceTest.auditFeedback') }}</h3>
          <p>{{ serviceObj.auditFeedback }}</p>
          <p>{{ $t('myService.dialog.processView.auditStatus') }}：{{ serviceObj.subAuditStatus.text }}</p>
          <p>{{ $t('myService.dialog.processView.reviewer') }}：{{ serviceObj.auditUserConcat }}</p>
        </template>
        <template v-if="auditObj.formList.length > 0">
          <div
            v-for="item in auditObj.formList"
            :key="item.formId"
          >
            <div class="form-title">{{ item.name }}</div>
            {{ $t('acceptanceTest.testReport') }}<el-button type="text" @click="onPreview(item)">{{ item.testReportFileName }}</el-button>
          </div>
        </template>
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
          <el-form-item :label="$t('acceptanceTest.backTo')" prop="targeTaskId">
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
import ViewStepOne from './components/ViewStepOne'
import ViewStepTwo from './components/ViewStepTwo'
import ViewStepThree from './components/ViewStepThree'
import { auditProcessView, getProcessViewDetail, getRollbackNode, rollbackNode } from '@/api/interface-service/processViewApi'
import { getAcceptanceTestDetail, uploadGripReport } from '@/api/interface-service/acceptanceTestApi'
import { downloadAuthen } from '@/api/file'
import { downloadFile } from '@/utils/index'
import globalOptions from '@/utils/globalOptionsValue'
export default {
  name: 'AcceptanceTest',
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
        callback(new Error(this.$t('acceptanceTest.message.auditFeedbackRequired')))
      } else {
        callback()
      }
    }
    const validateIds = (rule, value, callback) => {
      if (this.auditObj.isStatus && value === 0) {
        callback(new Error(this.$t('common.message.required')))
      } else {
        callback()
      }
    }
    return {
      stepsList: [this.$t('acceptanceTest.requestForAccess'), this.$t('acceptanceTest.selfCheckList'), this.$t('acceptanceTest.basicInformation')],
      activeIndex: 1,
      institutionType: '',
      isShouldShow: false,
      serviceObj: {},
      // 审核
      auditObj: {
        form: {
          auditFeedback: '',
          remark: '',
          fileList: []
        },
        rules: {
          auditFeedback: [
            { validator: validateAuditFeedback, trigger: 'blur' }
          ],
          ids: [
            { required: true, validator: validateIds, trigger: 'change' }
          ]
        },
        accept: '.PDF',
        formList: []
      },
      // 回退
      rollbackDialogObj: {
        visible: false,
        title: this.$t('acceptanceTest.auditGoBack'),
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
    ...mapGetters([
      'userInfo'
    ]),
    applyOrdNo() {
      return this.$store.state.service.acceptanceTestObj.commonObj.applyOrdNo
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
    },
    stepThreeObj() {
      return this.$store.state.service.acceptanceTestObj.stepThreeObj
    }
  },
  created() {
    console.log('验收测试index')
    if (this.operationType === 'add') {
      this.$store.dispatch(
        'service/setAcceptanceTestData',
        {
          commonObj: {
            applyOrdNo: null,
            checkedFormKeys: []
          }
        }
      ).then(() => {
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
            name: 'AcceptanceTestList',
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
      this.serviceObj = processRes.data
      this.serviceObj.isMainOrder = this.urlParams.isMainOrder
      this.serviceObj.isSonOrder = this.serviceObj.isMainOrder ? processRes.data.applyId === processRes.data.subApplyId : true
      // this.serviceObj.isSonOrder = processRes.data.applyId === this.urlParams.subApplyId || !this.serviceObj.isMainOrder
      this.institutionType = processRes.data.institutionType
      const applyOrdNo = this.serviceObj.isMainOrder ? processRes.data.applyId : processRes.data.subApplyId
      this.getDetail(applyOrdNo)
    },
    getDetail(applyOrdNo) {
      const params = {
        applyNo: applyOrdNo
      }
      getAcceptanceTestDetail(params).then(res => {
        console.log('验收测试详情')
        console.log(res)
        const data = res.data
        if (this.serviceObj.subAuditStatus && this.serviceObj.subAuditStatus.name === 'TESTING' && this.operationType === 'audit') {
          if (data.reportVOList[0].testReportFileId) {
            const reportVOList = data.reportVOList.filter(e => e.testReportFileId !== null)
            if (reportVOList.length > 0) {
              this.auditObj.form.fileList = [{
                name: reportVOList[0].testReportFileName,
                fileName: reportVOList[0].testReportFileName,
                fileId: reportVOList[0].testReportFileId
              }]
            }
          }
        } else {
          this.auditObj.formList = data.reportVOList.filter(e => e.testReportFileName)
        }
        this.$store.dispatch(
          'service/setAcceptanceTestData',
          {
            commonObj: {
              applyOrdNo: this.urlParams.subApplyId,
              checkedFormKeys: []
            },
            stepOneObj: {
              originData: data.menuTree.nodeList,
              tableColumns: data.menuTree.headList
            },
            stepTwoObj: {
              formList: data.selfCheckDisplayList
            },
            stepThreeObj: {
              formList: data.baseInfoList
            }
          }
        ).then(() => {
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
      this.$refs.auditForm.validate((valid, props) => {
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
        } else {
          console.log(props)
          if (props['fileList.length']) {
            this.$message({
              type: 'info',
              message: this.$t('acceptanceTest.message.incomplete')
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
    },
    onChangeFile(file, fileList) {
      console.log(file, fileList)
      const currentFile = fileList[fileList.length - 1]
      const isLtSize = currentFile.size / 1024 / 1024 <= 50
      if (!isLtSize) {
        this.$message({
          message: this.$t('acceptanceTest.message.fileSizeLimit'),
          type: 'info'
        })
        fileList.splice(fileList.length - 1, 1)
        return
      }
      const fileName = currentFile.name
      const formData = new FormData()
      formData.append('file', currentFile.raw)
      formData.append('formId', this.applyOrdNo)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      uploadGripReport(formData).then(res => {
        this.$message({
          message: `${fileName} ${this.$t('')}`,
          type: 'success'
        })
        // 当多余一个的时候替换文件
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        this.auditObj.form.fileList = fileList
      }).catch(() => {
        fileList.splice(fileList.length - 1, 1)
      }).finally(() => {
        loading.close()
      })
    },
    onRemoveFile(file, fileList) {
      console.log(file, fileList)
      this.auditObj.form.fileList = []
    },
    onPreview(file) {
      console.log('preview:' + file)
      const fileObj = {
        fileId: file.testReportFileId,
        fileName: file.testReportFileName
      }
      this.downloadFile(fileObj)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.fileName, fileObj.type)
        this.$message({
          type: 'success',
          message: this.$t('acceptanceTest.message.downloadSuccess')
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: this.$t('acceptanceTest.message.downloadFail')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
