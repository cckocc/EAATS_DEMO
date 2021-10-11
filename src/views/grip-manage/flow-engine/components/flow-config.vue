<template>
  <div style="position: relative">
    <el-tabs
      v-model="institutionType"
      type="card"
      class="custom-tabs"
      @tab-click="tabClick"
    >
      <el-tab-pane label="市场机构" name="00" />
      <el-tab-pane label="信息商" name="10" />
    </el-tabs>
    <div class="btn-wrap">
      <el-button
        v-if="isEdit"
        type="primary"
        @click="checkedAllNodes"
      >全选</el-button>
      <el-button v-if="isEdit" type="primary" @click="save">保存</el-button>
      <el-button v-if="isEdit" type="primary" @click="cancel">取消</el-button>
      <el-button
        v-if="!isEdit"
        type="primary"
        @click="isEdit = true"
      >编辑</el-button>
    </div>
    <tableTree
      v-if="isEdit"
      ref="tableTree"
      :origin-data="originData"
      :table-columns="tableColumns"
      :height="autoHeight"
      :extra-column-obj="extraColumnObj"
      extra-column
      show-checkbox
    >
      <template v-slot:node="{ node }">
        <div
          v-if="node.nodeType === 'extra'"
          class="extra-container"
          @dblclick="dblclick(node)"
        >
          <el-select
            v-if="node.showSelect"
            v-model="node.modelID"
            placeholder="请选择"
            filterable
            clearable
            @change="(val) => onChange(val, node)"
          >
            <el-option
              v-for="item in calculateModel(node)"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <span v-else>{{ optionsFilter(node) }}</span>
        </div>
      </template>
      <template v-slot:title="{ node }">
        <div v-if="node.nodeType === 'extra'">
          <el-button
            class="newline-btn"
            type="primary"
            @click="showDialog(node)"
          >{{ node.name }}</el-button>
        </div>
      </template>
    </tableTree>
    <tableTree
      v-else
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
    <!-- 批量设置弹窗 -->
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
      <el-form ref="dialogForm" :model="dialogObj.form" label-width="100px">
        <el-form-item label="请选择流程">
          <el-select
            v-model="dialogObj.form.modelID"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in calculateModel(dialogObj.node)"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" class="button-primary" @click="onConfirm">
          确定
        </el-button>
        <el-button class="button-default" @click="closeDialog">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import flowApi from '@/api/grip-manage/flowApi'

export default {
  data() {
    return {
      institutionType: '00',
      isEdit: false,
      autoHeight: 100,
      options: [],
      allModelList: [],
      tableColumns: [],
      originData: [],
      extraColumnObj: {
        columns: [],
        list: []
      },
      dialogObj: {
        visible: false,
        title: '',
        node: {},
        form: {
          modelID: null
        }
      }
    }
  },
  created() {
    this.getAllFlowConfigModel()
    this.initSearch()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 380
  },
  methods: {
    initSearch() {
      this.getFlowConfigData()
      this.getFlowConfigMenu()
    },
    tabClick(tab) {
      console.log(tab)
      this.initSearch()
    },
    optionsFilter(node) {
      let text = null
      const modelID = node.modelID
      const options = this.calculateModel(node)
      if (options.length > 0) {
        if (modelID) {
          const findOption = options.find((e) => modelID === e.key)
          text = findOption ? findOption.value : modelID
        } else {
          text = modelID
        }
      }
      return text
    },
    calculateModel(node) {
      const findItem = this.allModelList.find(
        (e) => e.flowType.name === node.serviceName
      )
      return findItem ? findItem.dataList : []
    },
    // 获取全部有效模型
    getAllFlowConfigModel() {
      flowApi.getAllFlowConfigModel().then((res) => {
        console.log(res.data)
        this.allModelList = res.data
      })
    },
    // 获取菜单树
    getFlowConfigMenu() {
      flowApi.getFlowConfigMenu(this.institutionType).then((res) => {
        console.log(res.data)
        this.originData = res.data.nodeList
        this.tableColumns = res.data.headList
      })
    },
    // 获取审核流程配置
    getFlowConfigData() {
      flowApi.getFlowConfigData(this.institutionType).then((res) => {
        console.log(res.data)
        const extraColumns = []
        const extraList = []
        res.data.forEach((e, i) => {
          const extraObj = {
            id: e.id,
            nodeType: 'extra',
            serviceName: e.flowType.name,
            name: e.flowType.text,
            rowSpan: e.rowSpan,
            colSpan: e.colSpan
          }
          extraColumns.push(extraObj)
          e.menuFlowAuditSubResponseDtoList.forEach((item, index) => {
            const obj = Object.assign({}, item, {
              showSelect: false,
              serviceName: e.flowType.name
            })
            if (i === 0) {
              extraList.push([obj])
            } else {
              extraList[index].push(obj)
            }
          })
        })
        this.extraColumnObj.columns = extraColumns
        this.extraColumnObj.list = extraList
      })
    },
    onChange(val, node) {
      console.log(val, node)
      this.extraColumnObj.list.map((tr) => {
        tr.map((td) => {
          if (
            td.leafNodeId === node.leafNodeId &&
            td.serviceName === node.serviceName
          ) {
            td.modelID = val
          }
          return td
        })
        return tr
      })
    },
    dblclick(node) {
      console.log(node)
      this.extraColumnObj.list.map((tr) => {
        tr.map((td) => {
          if (
            td.leafNodeId === node.leafNodeId &&
            td.serviceName === node.serviceName
          ) {
            td.showSelect = true
          }
          return td
        })
        return tr
      })
    },
    showDialog(node) {
      console.log(node)
      this.dialogObj.form.modelID = null
      if (this.$refs.tableTree.getCheckedNodeList().length === 0) {
        this.$message({
          type: 'info',
          message: `请先勾选需要配置${node.name}的接口`
        })
        return
      }
      this.dialogObj.title = node.name + '批量配置流程'
      this.dialogObj.node = node
      this.dialogObj.visible = true
    },
    closeDialog() {
      this.dialogObj.visible = false
    },
    checkedAllNodes() {
      this.$refs.tableTree.checkedAllNodes()
    },
    onConfirm() {
      // console.log(this.$refs.tableTree.getCheckedNodeList())
      // console.log(this.$refs.tableTree.getExtraNodeList())
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      const checkedLeafList = checkedList.filter(
        (e) => e.isLeafFlg.name === 'YES'
      )
      this.extraColumnObj.list.map((tr) => {
        tr.map((td) => {
          const findIndex = checkedLeafList.findIndex(
            (node) => node.id === td.leafNodeId
          )
          if (
            findIndex > -1 &&
            td.serviceName === this.dialogObj.node.serviceName
          ) {
            td.modelID = this.dialogObj.form.modelID
          }
          return td
        })
        return tr
      })
      this.closeDialog()
    },
    cancel() {
      this.isEdit = false
      this.initSearch()
    },
    save() {
      const extraNodelist = this.$refs.tableTree.getExtraNodeList()
      const waitNodeList = []
      const errorList = []
      extraNodelist.forEach((e, i) => {
        e.forEach((item, index) => {
          if (i === 0) {
            const obj = {
              flowType: item.serviceName,
              auditSaveSubDtoList: [
                {
                  modelID: item.modelID,
                  nodeId: item.leafNodeId
                }
              ]
            }
            waitNodeList.push(obj)
            errorList.push(!item.modelID)
          } else {
            waitNodeList[index].auditSaveSubDtoList.push({
              modelID: item.modelID,
              nodeId: item.leafNodeId
            })
            errorList[index] = errorList[index] || !item.modelID
          }
        })
      })
      if (errorList.includes(true)) {
        const indexs = []
        errorList.forEach((e, i) => {
          if (e) {
            indexs.push(i)
          }
        })
        const errorExtraColumnList = this.extraColumnObj.columns.filter((e, i) => indexs.includes(i))
        const errorExtraColumnListStr = errorExtraColumnList.map(e => e.name).toString()
        this.$message({
          message: `${errorExtraColumnListStr}列存在接口未配置流程图`,
          type: 'info'
        })
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        bizMenuNodeRefReviewAuditSaveDtoList: waitNodeList,
        institutionType: this.institutionType
      }
      console.log(params)
      flowApi
        .saveFlowConfig(params, this.institutionType)
        .then((res) => {
          loading.close()
          if (res.code === 'ACK') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.initSearch()
          }
        })
        .catch(() => {
          loading.close()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-wrap {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
.newline-btn {
  height: auto;
  white-space: normal;
}
</style>
