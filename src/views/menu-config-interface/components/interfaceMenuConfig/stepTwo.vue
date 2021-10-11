<template>
  <div>
    <div>
      <tableTree
        v-if="operationType === 'edit'"
        ref="tableTree"
        :origin-data="originData"
        :table-columns="tableColumns"
        :height="autoHeight"
        :extra-column-obj="extraColumnObj"
        extra-column
        show-checkbox
      >
        <template v-slot:node="{ node }">
          <div v-if="node.nodeType === 'extra' && node.extraType === 'service'" class="extra-container" @dblclick="dblclick(node)">
            <el-select v-if="node.showSelect" v-model="node.agreementTermId" placeholder="请选择" filterable clearable @change="val => onChange(val, node)">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.fileName"
                :value="item.id"
              />
            </el-select>
            <span v-else>{{ optionsFilter(node) }}</span>
          </div>
          <div v-if="node.nodeType === 'extra' && node.extraType === 'digital'" class="extra-container" @dblclick="dblclick(node)">
            <el-select v-if="node.showDigitalSelect" v-model="node.digitalCertificateId" placeholder="请选择" filterable clearable @change="val => onChange(val, node)">
              <el-option
                v-for="item in diaitalConfigOptions"
                :key="item.id"
                :label="item.fileName"
                :value="item.id"
              />
            </el-select>
            <span v-else>{{ optionsFilter(node) }}</span>
          </div>
        </template>
        <template v-slot:title="{ node }">
          <div v-if="node.nodeType === 'extra' && node.extraType === 'service'">
            <span class="tips">注意：需先在协议条款页面上传文档</span>
            <el-button type="primary" @click="showDialog(node)">{{ node.name }}</el-button>
          </div>
          <div v-if="node.nodeType === 'extra' && node.extraType === 'digital'">
            <span class="tips">注意：需先在数字证书配置页面上传文档</span>
            <el-button type="primary" @click="showDialog(node)">{{ node.name }}</el-button>
          </div>
        </template>
      </tableTree>
      <tableTree
        v-if="operationType === 'detail'"
        ref="tableTree"
        :origin-data="originData"
        :table-columns="tableColumns"
        :height="autoHeight"
        :extra-column-obj="extraColumnObj"
        extra-column
      >
        <template v-slot:node="{ node }">
          <span v-if="node.nodeType === 'extra'">{{ optionsFilter(node) }}</span>
        </template>
      </tableTree>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="prevStepSave"
      >
        上一步
      </el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStepSave"
      >
        下一步
      </el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >
        返回列表页
      </el-button>
      <el-button
        v-if="operationType === 'edit'"
        v-preventReClick
        type="primary"
        @click="save(true)"
      >
        保存
      </el-button>
    </div>
    <!-- 批量设置服务条款弹窗 -->
    <el-dialog
      width="658px"
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      append-to-body
      @close="closeDialog"
    >
      <el-form ref="form" :model="dialogObj.form" label-width="80px">
        <el-form-item v-if="dialogObj.extraType === 'service'" label="服务条款">
          <el-select v-model="dialogObj.form.agreementTermId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.fileName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="dialogObj.extraType === 'digital'" label="数字证书">
          <el-select v-model="dialogObj.form.digitalCertificateId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in diaitalConfigOptions"
              :key="item.id"
              :label="item.fileName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="onConfirm"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
export default {
  props: {
    institutionType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    },
    currentRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      autoHeight: 100,
      tableColumns: [],
      originData: [],
      dialogObj: {
        extraType: '',
        visible: false,
        title: '',
        form: {
          agreementTermId: null,
          digitalCertificateId: null
        }
      },
      options: [],
      diaitalConfigOptions: [],
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: '服务条款配置',
            extraType: 'service',
            rowSpan: 1,
            colSpan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '数字证书配置',
            extraType: 'digital',
            rowSpan: 1,
            colSpan: 1
          }
        ],
        list: []
      }
    }
  },
  created() {
    this.getInterfaceMenuConfigTree()
    this.getProtocolClauseConfigList()
    this.getProtocolClauseConfig()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 380
  },
  methods: {
    prevStepSave() {
      if (this.operationType !== 'detail') {
        this.save().then(() => {
          this.prevStep()
        })
      } else {
        this.prevStep()
      }
    },
    nextStepSave() {
      if (this.operationType !== 'detail') {
        this.save().then(() => {
          this.nextStep()
        })
      } else {
        this.nextStep()
      }
    },
    prevStep() {
      this.$emit('changeSteps', 1)
    },
    nextStep() {
      this.$emit('changeSteps', 3)
    },
    save(isShowMessage) {
      return new Promise((resolve, reject) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const extraNodelist = this.$refs.tableTree.getExtraNodeList()
        // console.log('extraNodelist', extraNodelist)
        const waitNodeList = []
        const digitalNodeList = []
        extraNodelist.forEach(e => {
          const obj = {
            agreementTermId: e[0].agreementTermId,
            cassMenuConfigDraft: e[0].cassMenuConfigDraft
          }
          if (obj.agreementTermId) {
            waitNodeList.push(obj)
          }

          const digitalObj = {
            digitalCertificateId: e[1].digitalCertificateId,
            cassMenuConfigDraft: e[1].cassMenuConfigDraft
          }
          if (digitalObj.digitalCertificateId) {
            digitalNodeList.push(digitalObj)
          }
        })
        const params = {
          recordId: this.currentRow.id,
          agreementTermRefDraft: waitNodeList
        }
        const data = {
          recordId: this.currentRow.id,
          digitalCertificateRefDraft: digitalNodeList
        }
        menuConfigApi.saveProtocolClauseConfig(params).then(res => {
          if (res.code === 'ACK') {
            menuConfigApi.saveDigitalCertificateConfig(data).then(res => {
              loading.close()
              if (res.code === 'ACK') {
                if (isShowMessage) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                }
                this.getProtocolClauseConfig()
                this.$emit('onSearch')
                resolve()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            }).catch(() => {
              loading.close()
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => {
          loading.close()
        })
      })
    },
    cancel() {
      this.$emit('close')
    },
    async getProtocolClauseConfig() {
      const params = {
        recordId: this.currentRow.id
      }
      const serviceResult = await menuConfigApi.getProtocolClauseConfig(params)
      const digitalResult = await menuConfigApi.getDigitalCertificateConfig(params)
      if (serviceResult.code !== 'ACK') {
        this.$message({ message: serviceResult.message, type: 'error' })
        return
      }
      if (digitalResult.code !== 'ACK') {
        this.$message({ message: digitalResult.message, type: 'error' })
        return
      }
      if (serviceResult.data.length !== digitalResult.data.length) {
        this.$message.error('服务条款配置与数字证书配置的数据长度不一致')
        return
      }
      const arr = []
      for (let i = 0; i < serviceResult.data.length; i++) {
        const serviceConfig = Object.assign({ extraType: 'service', showSelect: false }, serviceResult.data[i])
        const diaitalConfig = Object.assign({ extraType: 'digital', showDigitalSelect: false }, digitalResult.data[i])
        arr.push([serviceConfig, diaitalConfig])
      }
      this.extraColumnObj.list = arr
    },
    optionsFilter(node) {
      let fileName = null
      if (this.options.length > 0) {
        if (node.extraType === 'service' && node.agreementTermId) {
          const findOption = this.options.find(e => node.agreementTermId === e.id)
          fileName = findOption ? findOption.fileName : node.agreementTermId
        } else if (node.extraType === 'digital' && node.digitalCertificateId) {
          const findOption = this.diaitalConfigOptions.find(e => node.digitalCertificateId === e.id)
          fileName = findOption ? findOption.fileName : node.digitalCertificateId
        }
      }
      return fileName
    },
    onChange(val, node, column) {
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id) {
            if (node.extraType === 'service') {
              td.agreementTermId = val
            } else if (node.extraType === 'digital') {
              td.digitalCertificateId = val
            }
          }
          return td
        })
        return tr
      })
    },
    dblclick(node) {
      console.log(node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id) {
            if (node.extraType === 'service') {
              td.showSelect = true
            } else if (node.extraType === 'digital') {
              td.showDigitalSelect = true
            }
          }
          return td
        })
        return tr
      })
    },
    getProtocolClauseConfigList() {
      const params = {
        page: 1,
        pageSize: 1000
      }
      menuConfigApi.getProtocolClauseConfigList(params).then(res => {
        if (res.code === 'ACK') {
          this.options = res.data.list
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
      menuConfigApi.getDigitalCertificateConfigList(params).then(res => {
        if (res.code === 'ACK') {
          this.diaitalConfigOptions = res.data.list
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    getInterfaceMenuConfigTree() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getInterfaceMenuConfigTree(params).then(res => {
        if (res.code === 'ACK') {
          this.originData = res.data.nodeList
          this.tableColumns = res.data.headList
        }
      })
    },
    showDialog(node) {
      let message = 'service'
      if (node.extraType === 'service') {
        message = '请先勾选需要配置服务条款的接口'
        this.dialogObj.title = '服务条款配置'
      } else if (node.extraType === 'digital') {
        message = '请先勾选需要配置数字证书的接口'
        this.dialogObj.title = '数字证书配置'
      }
      if (this.$refs.tableTree.getCheckedNodeList().length === 0) {
        this.$message({
          type: 'info',
          message: message
        })
        return
      }
      this.dialogObj.extraType = node.extraType
      this.dialogObj.visible = true
    },
    closeDialog() {
      this.dialogObj.visible = false
    },
    onConfirm() {
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          const findIndex = checkedLeafList.findIndex(node => node.id === td.cassMenuConfigDraft.id)
          if (findIndex > -1 && this.dialogObj.extraType === 'service') {
            td.agreementTermId = this.dialogObj.form.agreementTermId
          } else if (findIndex > -1 && this.dialogObj.extraType === 'digital') {
            td.digitalCertificateId = this.dialogObj.form.digitalCertificateId
          }
          return td
        })
        return tr
      })
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tips {
    display: block;
    font-weight: 400;
    color: #ff1313;
    font-size: 13px;
    margin-bottom: 5px;
    color: red;
  }
</style>
