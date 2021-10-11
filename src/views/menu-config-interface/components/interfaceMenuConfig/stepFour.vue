<template>
  <div>
    <!-- <div v-if="operationType === 'edit'" class="btn-group">
      <el-button
        v-preventReClick
        type="primary"
        @click="showDialog('mainField')"
      >
        服务开通维度配置
      </el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="showDialog('detailField')"
      >
        接口上线(权限变更)维度配置
      </el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="onReset"
      >
        重置
      </el-button>
    </div> -->
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
          <div v-if="node.nodeType === 'extra'" class="extra-container" @dblclick="dblclick(node)">
            <div v-if="node.extraType === 'mainField'">
              <el-select v-if="node.showSelect" v-model="node.formId" placeholder="请选择" filterable clearable @change="val => onChange(val, node)">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <span v-else>{{ node.formName }}</span>
            </div>
            <div v-if="node.extraType === 'detailField'">
              <div v-if="node.showSelect">
                <el-row v-for="(item, index) in node.saveDetailList" :key="index">
                  <el-col :span="20">
                    <el-input v-model="item.scopeName" v-limitBytes="300" @change="val => onChangeInput(val, node, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="text" @click="deleteInput(node, index)"><i class="el-icon-remove-outline" /></el-button>
                  </el-col>
                </el-row>
                <el-button type="text" @click="addInput(node)"><i class="el-icon-circle-plus-outline" /></el-button>
              </div>
              <div v-else class="detail-field">
                <div v-for="(item, index) in node.saveDetailList" :key="index">
                  <div>{{ item.scopeName }}</div>
                  <el-divider v-if="index < (node.saveDetailList.length - 1)" />
                </div>
              </div>
            </div>
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
          <template v-if="node.nodeType === 'extra'">
            <span v-if="node.extraType === 'mainField'">{{ node.formName }}</span>
            <div v-if="node.extraType === 'detailField'" class="detail-field">
              <div v-for="(item, index) in node.saveDetailList" :key="index">
                <div>{{ item.scopeName }}</div>
                <el-divider v-if="index < (node.saveDetailList.length - 1)" />
              </div>
            </div>
          </template>
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
    <!-- 批量设置展示维度弹窗 -->
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
      <el-form ref="form" :model="dialogObj.form" :rules="dialogObj.rules" label-width="140px" label-position="top">
        <el-form-item label="请输入维度名称" prop="dimension">
          <el-input v-model="dialogObj.form.dimension" v-limitBytes="300" type="textarea" clearable />
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
        title: '展示维度',
        type: '',
        form: {
          dimension: ''
        },
        rules: {
          dimension: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      },
      options: [],
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: '验收单',
            extraType: 'mainField',
            rowSpan: 1,
            colSpan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '验收菜单',
            extraType: 'detailField',
            rowSpan: 1,
            colSpan: 1
          }
        ],
        list: []
      }
    }
  },
  created() {
    this.getTestScope()
    this.getFormList()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 420
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
      this.$emit('changeSteps', 3)
    },
    nextStep() {
      this.$emit('changeSteps', 5)
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
          const formObj = this.options.find(option => option.id === e[0].formId)
          const obj = {
            nodeId: e[0].nodeId,
            formName: formObj ? formObj.name : null,
            formVersion: e[0].formVersion,
            formAbbr: e[0].formVersion,
            formId: e[0].formId,
            saveDetailList: e[1].saveDetailList.map((item, index) => {
              item.sort = ++index
              return item
            })
          }
          waitNodeList.push(obj)
        })
        console.log(waitNodeList)
        const params = {
          recordId: this.currentRow.id,
          saveList: waitNodeList
        }
        menuConfigApi.saveTestScope(params).then(res => {
          loading.close()
          if (res.code === 'ACK') {
            if (isShowMessage) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            this.getTestScope()
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
    getTestScope() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getTestScope(params).then(res => {
        if (res.code === 'ACK') {
          this.originData = res.data.treeDto.nodeList
          this.tableColumns = res.data.treeDto.headList
          const arr = []
          res.data.testScopeList.forEach(e => {
            e.saveDetailList = e.saveDetailList ? e.saveDetailList : []
            const mainFieldObj = Object.assign({ extraType: 'mainField', showSelect: false }, e)
            const detailFieldObj = Object.assign({ extraType: 'detailField', showSelect: false }, e)
            arr.push([mainFieldObj, detailFieldObj])
          })
          this.extraColumnObj.list = arr
        }
      })
    },
    getFormList() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getFormList(params).then(res => {
        if (res.code === 'ACK') {
          this.options = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    onChange(val, node, key) {
      console.log(val, node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.nodeId === node.nodeId && td.extraType === node.extraType) {
            td.formId = val
          }
          return td
        })
        return tr
      })
    },
    onChangeInput(val, node, index) {
      // console.log(val, node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.nodeId === node.nodeId && td.extraType === node.extraType) {
            td.saveDetailList.map((e, i) => {
              if (i === index) {
                e.scopeName = val
              }
              return e
            })
          }
          return td
        })
        return tr
      })
    },
    addInput(node) {
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.nodeId === node.nodeId && td.extraType === node.extraType) {
            td.saveDetailList.push({
              scopeName: ''
            })
          }
          return td
        })
        return tr
      })
    },
    deleteInput(node, index) {
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.nodeId === node.nodeId && td.extraType === node.extraType) {
            td.saveDetailList = td.saveDetailList.filter((e, i) => i !== index)
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
          if (td.nodeId === node.nodeId && td.extraType === node.extraType) {
            td.showSelect = true
          }
          return td
        })
        return tr
      })
    },
    onReset() {
      this.$confirm('是否确认清空所有展示维度内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$refs.tableTree.resetCheckedNode(this.$refs.tableTree.getCheckedNodeList().map(e => e.id))
        this.extraColumnObj.list.map(tr => {
          tr.map(td => {
            td.onlineDimensionName = ''
            td.openDimensionName = ''
            return td
          })
          return tr
        })
      }).catch(() => {

      })
    },
    showDialog(type) {
      if (this.$refs.tableTree.getCheckedNodeList().length === 0) {
        this.$message({
          type: 'info',
          message: `请先勾选列表接口！`
        })
        return
      }
      if (type === 'mainField') {
        this.dialogObj.title = '服务开通维度配置'
      } else if (type === 'detailField') {
        this.dialogObj.title = '接口上线(权限变更)维度配置'
      }
      this.dialogObj.type = type
      this.dialogObj.form.dimension = ''
      this.dialogObj.visible = true
    },
    closeDialog() {
      this.dialogObj.visible = false
    },
    onConfirm() {
      // console.log(this.$refs.tableTree.getCheckedNodeList())
      // console.log(this.$refs.tableTree.getExtraNodeList())
      this.$refs.form.validate((valid, prop) => {
        if (valid) {
          const checkedList = this.$refs.tableTree.getCheckedNodeList()
          const checkedLeafList = checkedList.filter(e => e.isLeafFlg === 'YES')
          this.extraColumnObj.list.map(tr => {
            tr.map(td => {
              const findIndex = checkedLeafList.findIndex(node => node.id === td.cassMenuConfigDraft.id)
              if (findIndex > -1) {
                if (this.dialogObj.type === 'mainField') {
                  td.openDimensionName = this.dialogObj.form.dimension
                } else if (this.dialogObj.type === 'detailField') {
                  td.onlineDimensionName = this.dialogObj.form.dimension
                }
              }
              return td
            })
            return tr
          })
          this.$refs.tableTree.resetCheckedNode(this.$refs.tableTree.getCheckedNodeList().map(e => e.id))
          this.closeDialog()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-group {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
  }
  .extra-container {
    width: 100%;
    min-height: 20px;
  }
  .extra-custom-btn {
    &::v-deep.el-button {
      white-space: normal;
      &.el-button--primary {
        height: auto;
      }
    }
  }
  .detail-field {
    ::v-deep .el-divider--horizontal {
      margin: 10px 0;
    }
  }
</style>
