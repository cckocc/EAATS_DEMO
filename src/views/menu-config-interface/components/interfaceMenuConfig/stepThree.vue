<template>
  <div>
    <div v-if="operationType === 'edit'" class="btn-group">
      <el-button
        v-preventReClick
        type="primary"
        @click="showDialog('serviceOpening')"
      >
        服务开通维度配置
      </el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="showDialog('serviceOnline')"
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
    </div>
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
            <div v-if="node.extraType === 'serviceOpening'">
              <template v-if="node.showSelect">
                <el-input
                  v-model="node.openDimensionName"
                  v-limitBytes="300"
                  type="textarea"
                  placeholder="请输入中文维度名称"
                  autosize
                  @change="val => onChange(val, node, 'openDimensionName')"
                />
                <el-input
                  v-model="node.openDimensionNameEn"
                  v-limitBytes="300"
                  class="mt10"
                  type="textarea"
                  placeholder="请输入英文维度名称"
                  autosize
                  @change="val => onChange(val, node, 'openDimensionNameEn')"
                />
              </template>
              <template v-else>
                <div>{{ node.openDimensionName }}</div>
                <div>{{ node.openDimensionNameEn }}</div>
              </template>
            </div>
            <div v-if="node.extraType === 'serviceOnline'">
              <template v-if="node.showSelect">
                <el-input
                  v-model="node.onlineDimensionName"
                  v-limitBytes="300"
                  type="textarea"
                  placeholder="请输入中文维度名称"
                  autosize
                  @change="val => onChange(val, node, 'onlineDimensionName')"
                />
                <el-input
                  v-model="node.onlineDimensionNameEn"
                  v-limitBytes="300"
                  class="mt10"
                  type="textarea"
                  placeholder="请输入英文维度名称"
                  autosize
                  @change="val => onChange(val, node, 'onlineDimensionNameEn')"
                />
              </template>
              <template v-else>
                <div>{{ node.onlineDimensionName }}</div>
                <div>{{ node.onlineDimensionNameEn }}</div>
              </template>
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
            <div v-if="node.extraType === 'serviceOpening'">
              <div>{{ node.openDimensionName }}</div>
              <div>{{ node.openDimensionNameEn }}</div>
            </div>
            <div v-if="node.extraType === 'serviceOnline'">
              <div>{{ node.onlineDimensionName }}</div>
              <div>{{ node.onlineDimensionNameEn }}</div>
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
          <el-input
            v-model="dialogObj.form.dimension"
            v-limitBytes="300"
            type="textarea"
            placeholder="请输入中文维度名称"
            clearable
          />
          <el-input
            v-model="dialogObj.form.dimensionEn"
            v-limitBytes="300"
            class="mt10"
            type="textarea"
            placeholder="请输入英文维度名称"
            clearable
          />
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
          dimension: '',
          dimensionEn: ''
        },
        rules: {
          dimension: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      },
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: '服务开通展示维度',
            extraType: 'serviceOpening',
            rowSpan: 1,
            colSpan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '接口上线(权限变更)展示维度',
            extraType: 'serviceOnline',
            rowSpan: 1,
            colSpan: 1
          }
        ],
        list: []
      }
    }
  },
  created() {
    this.getDimensionDetail()
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
      this.$emit('changeSteps', 2)
    },
    nextStep() {
      this.$emit('changeSteps', 4)
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
            onlineDimensionName: e[1].onlineDimensionName,
            onlineDimensionNameEn: e[1].onlineDimensionNameEn,
            openDimensionName: e[0].openDimensionName,
            openDimensionNameEn: e[0].openDimensionNameEn,
            cassMenuConfigDraft: e[0].cassMenuConfigDraft
          }
          waitNodeList.push(obj)
        })
        console.log(waitNodeList)
        const params = {
          recordId: this.currentRow.id,
          itemList: waitNodeList.map(e => {
            e.onlineDimensionName = e.onlineDimensionName ? e.onlineDimensionName.replace(/(^\s*)|(\s*$)/g, '') : e.onlineDimensionName
            e.onlineDimensionNameEn = e.onlineDimensionNameEn ? e.onlineDimensionNameEn.replace(/(^\s*)|(\s*$)/g, '') : e.onlineDimensionNameEn
            e.openDimensionName = e.openDimensionName ? e.openDimensionName.replace(/(^\s*)|(\s*$)/g, '') : e.openDimensionName
            e.openDimensionNameEn = e.openDimensionNameEn ? e.openDimensionNameEn.replace(/(^\s*)|(\s*$)/g, '') : e.openDimensionNameEn
            return e
          })
        }
        menuConfigApi.saveDimensionConfig(params).then(res => {
          loading.close()
          if (res.code === 'ACK') {
            if (isShowMessage) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            this.getDimensionDetail()
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
    getDimensionDetail() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getDimensionDetail(params).then(res => {
        if (res.code === 'ACK') {
          this.originData = res.data.treeDto.nodeList
          this.tableColumns = res.data.treeDto.headList
          const arr = []
          res.data.itemList.forEach(e => {
            const serviceOpeningObj = Object.assign({ extraType: 'serviceOpening', showSelect: false }, e)
            const serviceOnlineObj = Object.assign({ extraType: 'serviceOnline', showSelect: false }, e)
            arr.push([serviceOpeningObj, serviceOnlineObj])
          })
          this.extraColumnObj.list = arr
        }
      })
    },
    onChange(val, node, key) {
      // console.log(val, node)
      this.extraColumnObj.list.map(tr => {
        tr.map(td => {
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id && td.extraType === node.extraType) {
            td[key] = val
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
          if (td.cassMenuConfigDraft.id === node.cassMenuConfigDraft.id && td.extraType === node.extraType) {
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
            td.onlineDimensionNameEn = ''
            td.openDimensionName = ''
            td.openDimensionNameEn = ''
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
      if (type === 'serviceOpening') {
        this.dialogObj.title = '服务开通维度配置'
      } else if (type === 'serviceOnline') {
        this.dialogObj.title = '接口上线(权限变更)维度配置'
      }
      this.dialogObj.type = type
      this.dialogObj.form.dimension = ''
      this.dialogObj.form.dimensionEn = ''
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
          const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
          this.extraColumnObj.list.map(tr => {
            tr.map(td => {
              const findIndex = checkedLeafList.findIndex(node => node.id === td.cassMenuConfigDraft.id)
              if (findIndex > -1) {
                if (this.dialogObj.type === 'serviceOpening') {
                  td.openDimensionName = this.dialogObj.form.dimension
                  td.openDimensionNameEn = this.dialogObj.form.dimensionEn
                } else if (this.dialogObj.type === 'serviceOnline') {
                  td.onlineDimensionName = this.dialogObj.form.dimension
                  td.onlineDimensionNameEn = this.dialogObj.form.dimensionEn
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
</style>
