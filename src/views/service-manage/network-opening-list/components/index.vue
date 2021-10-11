<template>
  <div>
    <el-dialog
      :title="title"
      :visible="visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      width="1200px"
      @close="close"
    >
      <el-form
        v-if="!isView"
        ref="networkOpeningForm"
        :model="networkOpeningDialogObj.form"
        :disabled="operationType === 'detail'"
        label-position="top"
      >
        <el-form-item
          v-for="(item, index) in networkOpeningDialogObj.form.list"
          :key="item.dimensionId"
          :label="`${operationType === 'detail' ? '' : $t('networkOpening.dialog.sourceAddressPart1')}【${item.dimensionName}】${$t('networkOpening.dialog.sourceAddressPart2')}`"
          :prop="`list.${index}.sourceAddress`"
          :rules="networkOpeningDialogObj.rules.sourceAddress"
        >
          <el-input
            v-model="item.sourceAddress"
            v-limitBytes="300"
            :placeholder="$t('networkOpening.dialog.sourceAddressPlaceholder')"
            clearable
          />
        </el-form-item>
      </el-form>
      <div v-else>
        <el-form
          ref="auditForm"
          :model="auditObj.form"
        >
          <el-form-item
            v-if="operationType === 'audit'"
            :label="$t('networkOpening.dialog.whetherOpenNetwork')"
            prop="status"
            :rules="auditObj.rules.status"
          >
            <el-radio-group v-model="auditObj.form.status">
              <el-radio :label="true">{{ $t('networkOpening.dialog.yes') }}</el-radio>
              <el-radio :label="false">{{ $t('networkOpening.dialog.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-table
            :data="auditObj.form.list"
            :span-method="objectSpanMethod"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              prop="applyOrdNo"
              :label="$t('networkOpening.dialog.serviceCode')"
              width="200"
            />
            <el-table-column
              prop="dimensionName"
              :label="$t('networkOpening.dialog.dimensionName')"
              width="200"
            />
            <el-table-column
              prop="addressOrigin"
              :label="$t('networkOpening.dialog.exportIPAddress')"
              width="120"
            />
            <template v-if="operationType === 'audit' && auditObj.form.status">
              <el-table-column
                show-overflow-tooltip
                :label="$t('networkOpening.dialog.targetAddress')"
                min-width="200"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    :prop="`list.${scope.$index}.addressContent`"
                    :rules="auditObj.rules.addressContent"
                  >
                    <el-input
                      v-model="scope.row.addressContent"
                      type="textarea"
                      :placeholder="$t('common.placeholder.required')"
                      maxlength="500"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      clearable
                      show-word-limit
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                key="addressContent-audit"
                :label="$t('networkOpening.dialog.serviceContent')"
                width="200"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    :prop="`list.${scope.$index}.addressTarget`"
                    :rules="auditObj.rules.addressTarget"
                  >
                    <el-input
                      v-model="scope.row.addressTarget"
                      v-limitBytes="300"
                      :placeholder="$t('common.placeholder.required')"
                      clearable
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                key="addressTarget-detail"
                prop="addressContent"
                :label="$t('networkOpening.dialog.targetAddress')"
                min-width="200"
              >
                <template slot-scope="scope">
                  {{ auditObj.form.status !== false ? scope.row.addressContent : '' }}
                </template>
              </el-table-column>
              <el-table-column
                key="addressContent-detail"
                prop="addressTarget"
                :label="$t('networkOpening.dialog.serviceContent')"
                width="200"
              >
                <template slot-scope="scope">
                  {{ auditObj.form.status !== false ? scope.row.addressTarget : '' }}
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          v-if="operationType === 'add' || operationType === 'edit'"
          v-preventReClick
          type="primary"
          @click="submit"
        >{{ $t('common.button.confirm2') }}</el-button>
        <el-button
          v-if="operationType === 'audit'"
          v-preventReClick
          type="primary"
          @click="onCheck"
        >{{ $t('common.button.confirm2') }}</el-button>
        <el-button @click="close">{{ $t('common.button.cancel') }}</el-button>
        <el-button
          v-if="serviceObj.goBackButtonFlag"
          type="primary"
          @click="showRollback"
        >
          {{ $t('common.button.goBack') }}
        </el-button>
      </div>
    </el-dialog>
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
        <el-form-item :label="$t('networkOpening.dialog.backTo')" prop="targeTaskId">
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
</template>
<script>
import networkOpeningApi from '@/api/interface-service/networkOpeningApi'
import { auditProcessView, getProcessViewDetail, getRollbackNode, rollbackNode } from '@/api/interface-service/processViewApi'
export default {
  name: 'NetworkOpening',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rowObj: {
      type: Object,
      default: () => ({})
    },
    operationType: {
      type: String,
      default: 'add'
    },
    subApplyNoList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      serviceObj: {},
      networkOpeningDialogObj: {
        form: {
          list: []
        },
        rules: {
          sourceAddress: [
            { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
          ]
        }
      },
      // 审核
      auditObj: {
        form: {
          status: null,
          list: []
        },
        rules: {
          status: [
            { required: true, message: this.$t('common.message.required'), trigger: 'change' }
          ],
          addressTarget: [
            { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
          ],
          addressContent: [
            { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
          ]
        }
      },
      // 回退
      rollbackDialogObj: {
        visible: false,
        title: this.$t('networkOpening.dialog.auditGoBack'),
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
    userInfo() {
      return this.$store.getters.userInfo
    },
    isGripUser() {
      return this.userInfo.userInnerType.name === 'GRIP'
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    },
    title() {
      const titleArr = [
        {
          label: this.$t('networkOpening.dialog.titleStatus.application'),
          value: 'add'
        },
        {
          label: this.$t('networkOpening.dialog.titleStatus.edit'),
          value: 'edit'
        },
        {
          label: this.$t('networkOpening.dialog.titleStatus.detail'),
          value: 'detail'
        },
        {
          label: this.$t('networkOpening.dialog.titleStatus.audit'),
          value: 'audit'
        }
      ]
      const item = titleArr.find(e => e.value === this.operationType)
      return this.$t('networkOpening.dialog.networkOpen') + (item ? item.label : '')
    }
  },
  watch: {
    visible(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        if (this.operationType === 'add') {
          this.networkOpeningDialogObj.form.list = this.$parent.networkOpeningObj.formList
        } else {
          this.getProcessViewDetail()
        }
      }
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 2) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },
    close() {
      this.$emit('close')
    },
    async getProcessViewDetail() {
      console.log(this.rowObj)
      let applyOrdNo = null
      if (this.isGripUser) {
        applyOrdNo = this.rowObj.isMainOrder ? this.rowObj.applyId : this.rowObj.subApplyId
      } else {
        applyOrdNo = this.rowObj.isMainOrder ? this.rowObj.applyOrdNo : this.rowObj.subApplyId
      }
      const form = new FormData()
      form.append('awaitFlag', this.operationType === 'audit' ? 'true' : 'false')
      form.append('subApplyId', applyOrdNo)
      form.append('currAuditUserId', this.userInfo.id)
      const processRes = await getProcessViewDetail(form)
      this.serviceObj = processRes.data
      this.serviceObj.isMainOrder = this.rowObj.isMainOrder
      this.getDetail(applyOrdNo)
    },
    getDetail(applyOrdNo) {
      console.log('网络开通详情')
      if (this.isGripUser) {
        const params = {
          id: applyOrdNo
        }
        params.type = this.operationType === 'audit' ? '1' : '0'
        networkOpeningApi.getGripNetworkOpeningDetail(params, this.isGripUser).then(res => {
          const list = []
          res.data.forEach(son => {
            const commonObj = {
              applyOrdNo: son.networkOpenApplyRef.applyOrdNo,
              dimensionName: son.networkOpenApplyRef.dimensionName,
              addressOrigin: son.networkOpenApplyRef.addressOrigin,
              addressTarget: son.networkOpenApplyRef.addressTarget,
              addressContent: son.networkOpenApplyRef.addressContent,
              rowSpan: 1
            }
            if (son.networkInfoRefDto.length === 0) {
              list.push(Object.assign({}, commonObj))
            }
            son.networkInfoRefDto.forEach((e, i) => {
              list.push(Object.assign({}, commonObj, e, { rowSpan: i === 0 ? son.networkInfoRefDto.length : 0 }))
            })
          })
          this.auditObj.form.list = list
          this.auditObj.form.status = null
          if (this.operationType === 'audit') {
            this.$nextTick(() => {
              this.$refs.auditForm.clearValidate()
            })
          }
        })
      } else {
        if (this.operationType === 'detail') {
          const params = {
            id: applyOrdNo
          }
          networkOpeningApi.getOrgNetworkOpeningDetail(params).then(res => {
            const list = []
            res.data.forEach(son => {
              const commonObj = {
                applyOrdNo: son.networkOpenApplyRef.applyOrdNo,
                dimensionName: son.networkOpenApplyRef.dimensionName,
                addressOrigin: son.networkOpenApplyRef.addressOrigin,
                addressTarget: son.networkOpenApplyRef.addressTarget,
                addressContent: son.networkOpenApplyRef.addressContent,
                rowSpan: 1
              }
              if (son.networkInfoRefDto.length === 0) {
                list.push(Object.assign({}, commonObj))
              }
              son.networkInfoRefDto.forEach((e, i) => {
                list.push(Object.assign({}, commonObj, e, { rowSpan: i === 0 ? son.networkInfoRefDto.length : 0 }))
              })
            })
            this.auditObj.form.list = list
          })
        } else {
          const params = {
            applyOrdNo: applyOrdNo
          }
          networkOpeningApi.getOrgNetworkOpeningEdit(params).then(res => {
            this.networkOpeningDialogObj.form.list = res.data
          })
        }
      }
    },
    submit() {
      this.$refs.networkOpeningForm.validate(valid => {
        if (valid) {
          const params = {
            subApplyOrdNoList: this.subApplyNoList,
            networkOpeningVoList: this.networkOpeningDialogObj.form.list
          }
          if (this.operationType === 'add') {
            params.institutionType = this.$parent.institutionType
            params.bizType = this.$parent.parentType
            params.subApplyOrdNoList = this.$parent.mainObj.subApplyNoList
          } else {
            params.institutionType = this.rowObj.institutionType
            params.bizType = this.rowObj.procType
            params.subApplyOrdNoList = [this.rowObj.subApplyId]
          }
          console.log(params)
          networkOpeningApi.applyNetworkOpening(params, this.operationType).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.close()
            if (this.operationType === 'add') {
              this.$router.push({
                name: 'MyService',
                params: {
                  isCurrentByMe: true
                }
              })
            } else {
              this.$parent.isCurrentByMe = true
              this.$parent.fetchData()
              this.$parent.refreshSonList()
            }
          })
        }
      })
    },
    /**
     * @method: 审核
     * @param {type} true: 通过, false: 拒绝
     * @return {无}
     */
    onCheck() {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          const networkOpenApplyDtoList = []
          this.auditObj.form.list.forEach(e => {
            networkOpenApplyDtoList.push({
              addressOrigin: e.addressOrigin,
              addressTarget: e.addressTarget,
              addressContent: e.addressContent
            })
          })
          const params = {
            pass: this.auditObj.form.status,
            auidtUserId: this.userInfo.id,
            applyNo: this.rowObj.subApplyId,
            auditId: this.rowObj.flowAuditId,
            taskId: this.rowObj.taskId,
            networkOpenApplyDtoList: networkOpenApplyDtoList
          }
          auditProcessView(params).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.close()
            this.$parent.fetchData()
            this.$parent.refreshSonList()
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
            this.rollbackDialogObj.visible = false
            this.close()
            this.$parent.fetchData()
            this.$parent.refreshSonList()
          })
        }
      })
    }
  }
}
</script>
