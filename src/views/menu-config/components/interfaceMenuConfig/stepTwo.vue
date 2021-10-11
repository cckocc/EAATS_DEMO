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
          <!-- <el-select v-if="node.nodeType === 'extra'" v-model="node.agreementTermId" placeholder="请选择" filterable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.fileName"
              :value="item.id"
            />
          </el-select> -->
          <div v-if="node.nodeType === 'extra'" class="extra-container" @dblclick="dblclick(node)">
            <el-select v-if="node.showSelect" v-model="node.agreementTermId" placeholder="请选择" filterable clearable @change="val => onChange(val, node)">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.fileName"
                :value="item.id"
              />
            </el-select>
            <span v-else>{{ optionsFilter(node.agreementTermId) }}</span>
          </div>
        </template>
        <template v-slot:title="{ node }">
          <div v-if="node.nodeType === 'extra'">
            <span class="tips">注意：需先在协议条款页面上传条款文档</span>
            <el-button type="primary" @click="showDialog">{{ node.name }}</el-button>
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
          <span v-if="node.nodeType === 'extra'">{{ optionsFilter(node.agreementTermId) }}</span>
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
        <el-form-item label="服务条款">
          <el-select v-model="dialogObj.form.agreementTermId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in options"
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
        visible: false,
        title: '服务条款配置',
        form: {
          agreementTermId: null
        }
      },
      options: [],
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: '服务条款配置',
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
        const waitNodeList = []
        extraNodelist.forEach(e => {
          const obj = {
            agreementTermId: e[0].agreementTermId,
            cassMenuConfigDraft: e[0].cassMenuConfigDraft
          }
          if (obj.agreementTermId) {
            waitNodeList.push(obj)
          }
        })
        // console.log(waitNodeList)
        const params = {
          recordId: this.currentRow.id,
          agreementTermRefDraft: waitNodeList
        }
        menuConfigApi.saveProtocolClauseConfig(params).then(res => {
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
      })
    },
    cancel() {
      this.$emit('close')
    },
    getProtocolClauseConfig() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getProtocolClauseConfig(params).then(res => {
        if (res.code === 'ACK') {
          const arr = []
          res.data.forEach(e => {
            Object.assign(e, { showSelect: false })
            arr.push([e])
          })
          this.extraColumnObj.list = arr
          // console.log(this.extraColumnObj.list)
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    optionsFilter(agreementTermId) {
      let fileName = null
      if (this.options.length > 0) {
        // fileName = agreementTermId ? this.options.find(e => agreementTermId === e.id).fileName : agreementTermId
        if (agreementTermId) {
          const findOption = this.options.find(e => agreementTermId === e.id)
          fileName = findOption ? findOption.fileName : agreementTermId
        } else {
          fileName = agreementTermId
        }
      }
      return fileName
    },
    onChange(val, node) {
      // console.log(val, node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id) {
            td.agreementTermId = val
          }
          return td
        })
        return tr
      })
    },
    dblclick(node) {
      // console.log(node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id) {
            td.showSelect = true
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
    showDialog() {
      if (this.$refs.tableTree.getCheckedNodeList().length === 0) {
        this.$message({
          type: 'info',
          message: `请先勾选需要配置服务条款的接口`
        })
        return
      }
      this.dialogObj.visible = true
    },
    closeDialog() {
      this.dialogObj.visible = false
    },
    onConfirm() {
      // console.log(this.$refs.tableTree.getCheckedNodeList())
      // console.log(this.$refs.tableTree.getExtraNodeList())
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      const checkedLeafList = checkedList.filter(e => e.isLeafFlg === 'YES')
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          const findIndex = checkedLeafList.findIndex(node => node.id === td.cassMenuConfigDraft.id)
          if (findIndex > -1) {
            td.agreementTermId = this.dialogObj.form.agreementTermId
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
  .extra-container {
    width: 100%;
    min-height: 20px;
  }
  .tips {
    display: block;
    font-weight: 400;
    color: #ff1313;
    font-size: 13px;
    margin-bottom: 5px;
    color: red;
  }
</style>
