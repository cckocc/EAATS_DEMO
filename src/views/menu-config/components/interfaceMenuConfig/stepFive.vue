<template>
  <div>
    <div class="btn-group">
      <el-button
        v-if="operationType === 'edit'"
        type="primary"
        @click="onOperate('hide')"
      >
        隐藏
      </el-button>
      <el-button
        v-if="operationType === 'edit'"
        type="primary"
        @click="onOperate('show')"
      >
        取消隐藏
      </el-button>
      <el-button
        type="primary"
        @click="onOperate('preview')"
      >
        预览
      </el-button>
      <el-button
        v-if="operationType === 'edit'"
        type="primary"
        @click="onOperate('reset')"
      >
        重置
      </el-button>
    </div>
    <div>
      <tableTree
        ref="tableTree"
        :origin-data="originData"
        :table-columns="tableColumns"
        :height="autoHeight"
        :show-checkbox="operationType === 'edit'"
        :disabled-checkbox-node-level="2"
        check-strictly
        show-checkbox-and-slot
      >
        <!-- <template v-slot:node="{ node }">
          <span v-if="operationType === 'detail'">{{ node.nodeName }}</span>
          <i v-if="node.cassHideFlag === 'YES'" style="position: absolute; top: 2px; right: 2px;" class="el-icon-view" />
        </template> -->
        <template v-slot:node="{ node }">
          <div v-if="node.cassHideFlag === 'YES'" class="hide-flag">
            <div class="hide-flag-bg" />
            <!-- <i class="el-icon-view hide-flag-text" /> -->
            <svg-icon class="hide-flag-text" icon-class="eye-crossed" />
          </div>
          <span v-if="operationType === 'detail'">{{ node.nodeName }}</span>
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
    <!-- 预览隐藏后的树 -->
    <el-dialog
      width="1220px"
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      append-to-body
      @close="closeDialog"
    >
      <div>
        <tableTree
          :origin-data="dialogObj.originData"
          :table-columns="dialogObj.tableColumns"
        />
      </div>
      <div slot="footer" class="text-center">
        <span slot="footer">
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
        title: '预览',
        originData: [],
        tableColumns: []
      }
    }
  },
  created() {
    this.onSearch()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 440
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
      if (this.institutionType === '00') {
        this.$emit('changeSteps', 4)
      } else if (this.institutionType === '10') {
        this.$emit('changeSteps', 2)
      }
    },
    nextStep() {
      if (this.institutionType === '00') {
        this.$emit('changeSteps', 6)
      } else if (this.institutionType === '10') {
        this.$emit('changeSteps', 4)
      }
    },
    save(isShowMessage) {
      return new Promise((resolve, reject) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const nodeList = this.$refs.tableTree.getTreeData()
        const params = {
          recordId: this.currentRow.id,
          cassHideFlag: '1',
          nodeList: nodeList
        }
        menuConfigApi.toggleMenuConfigNode(params).then(res => {
          loading.close()
          if (res.code === 'ACK') {
            if (isShowMessage) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            this.onSearch()
            resolve()
          }
        }).catch(() => {
          loading.close()
        })
      })
    },
    cancel() {
      this.$emit('close')
    },
    onSearch() {
      this.getInterfaceMenuConfigTree()
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
    closeDialog() {
      this.dialogObj.visible = false
    },
    onOperate(type) {
      console.log(type)
      if (type === 'hide') {
        const checkedNodelist = this.$refs.tableTree.getCheckedNodeList()
        // console.log(checkedNodelist)
        // const waitNodeList = checkedNodelist.filter(e => e.cassHideFlag === 'NO')
        if (checkedNodelist.length === 0) {
          this.$message({
            type: 'info',
            message: `请先勾选要隐藏的单元格`
          })
          return
        }
        const hasFlag = checkedNodelist.some(e => e.cassHideFlag === 'YES')
        if (hasFlag) {
          this.$message({
            type: 'info',
            message: `您所勾选的单元格已隐藏，请勿重复勾选`
          })
        } else {
          this.$refs.tableTree.changeNodeValue(this.$refs.tableTree.getCheckedNodeList().map(e => e.id), 'cassHideFlag', 'YES')
        }
        // const params = {
        //   recordId: this.currentRow.id,
        //   cassHideFlag: '1',
        //   checkedMenuConfigNodeIdList: checkedNodelist.map(e => e.id)
        // }
        // menuConfigApi.toggleMenuConfigNode(params).then(res => {
        //   if (res.code === 'ACK') {
        //     this.$message({
        //       message: res.message,
        //       type: 'success'
        //     })
        //     this.onSearch()
        //   }
        // })
      } else if (type === 'show') {
        const checkedNodelist = this.$refs.tableTree.getCheckedNodeList()
        // console.log(checkedNodelist)
        // const waitNodeList = checkedNodelist.filter(e => e.cassHideFlag === 'YES')
        if (checkedNodelist.length === 0) {
          this.$message({
            type: 'info',
            message: `请先勾选要取消隐藏的单元格`
          })
          return
        }
        const hasFlag = checkedNodelist.some(e => e.cassHideFlag === 'NO')
        if (hasFlag) {
          this.$message({
            type: 'info',
            message: `您所勾选的单元格已取消隐藏，请勿重复勾选`
          })
        } else {
          this.$refs.tableTree.changeNodeValue(this.$refs.tableTree.getCheckedNodeList().map(e => e.id), 'cassHideFlag', 'NO')
        }
        // const params = {
        //   recordId: this.currentRow.id,
        //   cassHideFlag: '0',
        //   checkedMenuConfigNodeIdList: checkedNodelist.map(e => e.id)
        // }
        // menuConfigApi.toggleMenuConfigNode(params).then(res => {
        //   if (res.code === 'ACK') {
        //     this.$message({
        //       message: res.message,
        //       type: 'success'
        //     })
        //     this.onSearch()
        //   }
        // })
      } else if (type === 'preview') {
        const nodeList = this.$refs.tableTree.getTreeData()
        const params = {
          recordId: this.currentRow.id,
          nodeList: nodeList,
          hideFlag: '10'
        }
        menuConfigApi.previewMenuConfigNode(params).then(res => {
          // console.log(res)
          if (res.code === 'ACK') {
            this.dialogObj.originData = res.data.nodeList
            this.dialogObj.tableColumns = res.data.headList
            this.dialogObj.visible = true
          }
        })
      } else if (type === 'reset') {
        // this.onSearch()
        this.$refs.tableTree.resetCheckedNode(this.$refs.tableTree.getCheckedNodeList().map(e => e.id))
      }
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
  .hide-flag {
    position: absolute;
    top: 0;
    right: 0;
    &-bg {
      width: 0;
      height: 0;
      border-top: 36px solid yellow;
      border-left: 36px solid transparent;
    }
    &-text {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
</style>
