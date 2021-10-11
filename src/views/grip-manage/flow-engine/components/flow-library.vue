<template>
  <div>
    <div class="flow-lib">
      <div class="flow-lib-search">
        <el-input
          v-model="mainObj.searchForm.modelName"
          size="mini"
          type="primary"
          placeholder="查找流程"
        >
          <el-button
            slot="append"
            type="primary"
            size="mini"
            clearable
            @click="onSearch"
          >搜索</el-button>
        </el-input>
      </div>
      <div class="flow-lib-wrap">
        <div v-for="item in mainObj.list" :key="item.id" class="item" @click="onOperate('edit', item.id)">
          <div class="item-border" :style="{backgroundColor: colorFilter(item)}" />
          <div class="item-title">{{ item.modelName }}</div>
          <div class="item-minor">
            <span>版本：{{ item.flowVersion }}</span>
            <span class="ml20">流程状态：{{ item.flowStatus.text }}</span>
          </div>
          <div class="item-content">{{ item.flowRemark }}</div>
        </div>
        <div class="item add">
          <el-button type="text" @click="onOperate('add')"><svg-icon icon-class="add" />添加流程</el-button>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="mainObj.currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="mainObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mainObj.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增/编辑/查看弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      :modal-append-to-body="false"
      destroy-on-close
      width="678px"
      @close="dialogObj.visible = false"
    >
      <el-form
        ref="dialogForm"
        :model="dialogObj.form"
        :rules="dialogObj.rules"
        :disabled="dialogObj.form.flowStatus.name === 'EFFECT'"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="流程类型" prop="flowAuditType">
          <el-select
            v-model="dialogObj.form.flowAuditType"
            style="width: 100%;"
            placeholder="请选择"
            :disabled="dialogObj.type === 'edit'"
          >
            <el-option
              v-for="item in flowTypeOptions"
              :key="item.code"
              :label="item.text"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程名称" prop="modelName">
          <el-input
            v-model="dialogObj.form.modelName"
            maxlength="300"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="流程状态">
          <el-input
            v-model="dialogObj.form.flowStatus.text"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="dialogObj.type === 'edit'" label="版本" prop="flowVersion">
          <el-input
            v-model="dialogObj.form.flowVersion"
            v-limitBytes="20"
            placeholder="请输入"
            disabled
            clearable
          />
        </el-form-item>
        <el-form-item label="流程简介">
          <el-input
            v-model="dialogObj.form.flowRemark"
            type="textarea"
            placeholder="请输入"
            maxlength="2000"
            show-word-limit
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-if="dialogObj.type !== 'add'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('view')"
        >查看</el-button>
        <el-button
          v-if="dialogObj.type !== 'add'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('delete')"
        >删除</el-button>
        <el-button
          v-if="dialogObj.type !== 'add' && dialogObj.form.flowAuditType && dialogObj.form.flowAuditType !== 'oldDataAudit'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('copy')"
        >复制</el-button>
        <el-button
          v-if="dialogObj.form.flowStatus.name === 'SAVEING'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('submit')"
        >{{ dialogObj.type === 'add' ? '创建新模型' : '编辑' }}</el-button>
        <el-button
          class="button-default"
          @click="dialogObj.visible = false"
        >取消</el-button>
        <el-button
          v-if="dialogObj.type === 'edit' && dialogObj.form.flowStatus.name === 'SAVEING'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('publish')"
        >发布</el-button>
      </div>
    </el-dialog>
    <!-- 流程图iframe -->
    <el-dialog
      :close-on-click-modal="false"
      :title="iframeDialogObj.title"
      :visible.sync="iframeDialogObj.visible"
      :modal-append-to-body="false"
      fullscreen
      destroy-on-close
      @close="iframeDialogObj.visible = false"
    >
      <iframe id="flow-iframe" :src="iframeDialogObj.url" />
    </el-dialog>
  </div>
</template>

<script>
import flowApi from '@/api/grip-manage/flowApi'

const defaultDialogForm = {
  flowAuditType: null,
  modelName: '',
  flowVersion: '',
  flowRemark: '',
  flowStatus: {
    code: '00',
    name: 'SAVEING',
    text: '保存中'
  }
}
export default {
  data() {
    return {
      mainObj: {
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: {
          modelName: ''
        }
      },
      flowTypeOptions: [],
      dialogObj: {
        visible: false,
        title: '',
        type: '',
        form: Object.assign({}, defaultDialogForm),
        rules: {
          flowAuditType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          modelName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          flowVersion: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          flowRemark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      },
      iframeDialogObj: {
        visible: false,
        title: '流程图',
        url: ''
      }
    }
  },
  created() {
    this.getFlowTypeList()
    this.onSearch()
  },
  mounted() {
    window.addEventListener('message', this.messageDo, false)
  },
  destroyed() {
    window.removeEventListener('message', this.messageDo, false)
  },
  methods: {
    messageDo(event) {
      console.log(event)
      console.log(event.data)
      if (event.data && event.data.modeltype && event.data.type !== 'webpackOk' && event.data.type !== 'webpackInvalid') {
        var str = []
        for (var p in event.data) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(event.data[p]))
        }
        flowApi.saveFlowLib(this.dialogObj.form.id, str.join('&')
        ).then(res => {
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.fetchData()
            this.iframeDialogObj.visible = false
          }
        })
      }
    },
    colorFilter(item) {
      const colorOptions = [
        // {
        //   code: '00',
        //   name: 'FLOW_PROCESS_SERVICE_OPEN',
        //   text: '服务开通审核',
        //   color: '#FF6062'
        // },
        // {
        //   code: '50',
        //   name: 'FLOW_PROCESS_NETWORK_OPENING',
        //   text: '网络开通审核',
        //   color: '#49B8D5'
        // },
        // {
        //   code: '10',
        //   name: 'FLOW_PROCESS_ACCEPTANCE_TEST',
        //   text: '验收测试审核',
        //   color: '#1F95FE'
        // },
        // {
        //   code: '20',
        //   name: 'FLOW_PROCESS_INTERFACE_ONLINE',
        //   text: '接口上线审核',
        //   color: '#486EF8'
        // },
        // {
        //   code: '40',
        //   name: 'FLOW_PROCESS_PERM_CHANGE',
        //   text: '权限变更审核',
        //   color: '#FA8628'
        // },
        // {
        //   code: 'ISV00',
        //   name: 'FLOW_PROCESS_SERVICE_OPEN_ISV',
        //   text: 'ISV服务开通审核',
        //   color: '#FF6062'
        // },
        // {
        //   code: 'ISV10',
        //   name: 'FLOW_PROCESS_ACCEPTANCE_TEST_ISV',
        //   text: 'ISV验收测试审核',
        //   color: '#1F95FE'
        // },
        {
          code: 'serviceAudit',
          name: 'SERVICE_AUDIT',
          text: '服务审核',
          color: '#46AD13'
        },
        {
          code: 'registeredAudit',
          name: 'REGISTERED_AUDIT',
          text: '注册审核',
          color: '#46AD13'
        },
        {
          code: 'instinfoAudit',
          name: 'INSTINFO_AUDIT',
          text: '机构信息审核',
          color: '#46AD13'
        },
        {
          code: 'isvKanbanAudit',
          name: 'ISVKANBAN_AUDIT',
          text: 'ISV看板审核',
          color: '#46AD13'
        },
        {
          code: 'otherAudit',
          name: 'OTHER_AUDIT',
          text: '其他审核',
          color: '#46AD13'
        }
      ]
      const colorItem = colorOptions.find(e => e.code === item.flowAuditType.code)
      return item.flowStatus.name === 'DELETE' ? '#797979' : colorItem ? colorItem.color : ''
    },
    // 获取流程类型枚举值
    getFlowTypeList() {
      const params = {
        modelName: this.modelName
      }
      flowApi.getFlowTypeList(params).then(res => {
        this.flowTypeOptions = res.data
      })
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    // 获取流程列表
    fetchData() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        modelName: this.mainObj.searchForm.modelName
      }
      flowApi.getFlowLibList(params).then(res => {
        this.mainObj.list = res.data.list
        this.mainObj.total = res.data.totalRecord
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.dialogObj.visible = true
        this.dialogObj.type = type
        this.dialogObj.title = '新增'
        this.dialogObj.form = Object.assign({}, defaultDialogForm)
        this.$nextTick(() => {
          this.$refs.dialogForm.clearValidate()
        })
      } else if (type === 'edit') {
        this.dialogObj.visible = true
        this.dialogObj.type = type
        this.dialogObj.title = '编辑'
        const params = {
          id: row
        }
        flowApi.getFlowLibDetail(params).then(res => {
          this.dialogObj.form = Object.assign({}, res.data)
          this.dialogObj.form.flowAuditType = this.dialogObj.form.flowAuditType.code
          this.$nextTick(() => {
            this.$refs.dialogForm.clearValidate()
          })
        })
      } else if (type === 'view') {
        console.log(this.dialogObj)
        setTimeout(() => {
          this.iframeDialogObj.visible = true
          this.iframeDialogObj.url = `/modeler/#/processes/${this.dialogObj.form.flowId}?time=${new Date().getTime()}`
        }, 1000)
      } else if (type === 'submit') {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            if (this.dialogObj.type === 'add') {
              const params = {
                flowAuditType: this.dialogObj.form.flowAuditType,
                modelName: this.dialogObj.form.modelName,
                flowRemark: this.dialogObj.form.flowRemark
              }
              flowApi.addFlowLib(params).then(res => {
                if (res.code === 'ACK') {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.fetchData()
                  this.dialogObj.visible = false
                  this.dialogObj.form.id = res.data.flowModelID
                  setTimeout(() => {
                    this.iframeDialogObj.visible = true
                    this.iframeDialogObj.url = `/modeler/#/editor/${res.data.id}`
                  }, 1000)
                }
              })
            } else if (this.dialogObj.type === 'edit') {
              const params = {
                flowAuditType: this.dialogObj.form.flowAuditType,
                modelName: this.dialogObj.form.modelName,
                flowRemark: this.dialogObj.form.flowRemark,
                flowVersion: this.dialogObj.form.flowVersion,
                flowModelID: this.dialogObj.form.flowId,
                id: this.dialogObj.form.id
              }
              flowApi.editFlowLib(params).then(res => {
                if (res.code === 'ACK') {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.fetchData()
                  this.dialogObj.visible = false
                  setTimeout(() => {
                    this.iframeDialogObj.visible = true
                    this.iframeDialogObj.url = `/modeler/#/editor/${this.dialogObj.form.flowId}?time=${new Date().getTime()}`
                  }, 1000)
                }
              })
            }
          }
        })
      } else if (type === 'publish') {
        this.$confirm('确定要发布吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowApi.publishFlowLib(this.dialogObj.form.id).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
              this.dialogObj.visible = false
            }
          })
        })
      } else if (type === 'delete') {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowApi.deleteFlowLib(this.dialogObj.form.id).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
              this.dialogObj.visible = false
            }
          })
        })
      } else if (type === 'copy') {
        this.$confirm('确定要复制吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          flowApi.copyFlowLib(this.dialogObj.form.id).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
              this.onOperate('edit', res.data.flowModelID)
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .flow-lib {
    // &-search {
    //   ::v-deep .el-input-group__append, .el-input-group__prepend {
    //     color: #fff;
    //     background-color: #2C76D1;
    //   }
    // }
    &-wrap {
      display: flex;
      flex-wrap: wrap;
      & .item {
        position: relative;
        padding: 30px;
        margin: 24px 24px 0 0;
        width: 287px;
        min-height: 200px;
        background: #fff;
        border: 1px solid #DFDFDF;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        color: #333333;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &:hover {
          box-shadow: 0px 0px 20px rgba(0, 118, 253, 0.3);
          color: #0050B3;
        }
        &.add {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &-border {
          position: absolute;
          left: 0;
          top: 30px;
          width: 6px;
          height: 50px;
          background: #1F95FE;
        }
        &-title {
          font-size: 18px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          word-break: break-word;
          word-wrap: break-word;
        }
        &-minor {
          margin-top: 12px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
        &-content {
          margin-top: 16px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #8C8C8C;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
          word-wrap: break-word;
        }
      }
    }
  }

  #flow-iframe {
    width: 100%;
    height: 98%;
  }
</style>
