<template>
  <div>
    <el-tabs v-model="institutionType" class="custom-minor-tabs" @tab-click="tabClick">
      <el-tab-pane label="市场机构" name="00" />
      <el-tab-pane label="信息商" name="10" />
    </el-tabs>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          inline
        >
          <el-form-item label="目标地址名称">
            <el-input v-model.trim="mainObj.searchForm.addressTarget" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker
              v-model="mainObj.searchForm.updateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="--起始时间--"
              end-placeholder="--结束时间--"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input v-model.trim="mainObj.searchForm.lastMntUserName" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >查询</el-button>
            <el-button size="mini" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              icon="el-icon-circle-plus el-icon--right"
              @click="onOperate('add')"
            >新增</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              show-overflow-tooltip
              prop="addressTarget"
              label="目标地址名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="lastMntTs"
              label="更新时间"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="loginName"
              label="更新人"
              align="center"
              min-width="130"
            />
            <el-table-column
              label="操作"
              align="center"
              width="140"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="onOperate('detail', scope.row)">查看</el-button>
                <el-button type="text" @click="onOperate('edit', scope.row)">编辑</el-button>
                <el-button type="text" @click="onOperate('delete', scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
    </div>
    <!-- 新增/编辑/查看弹窗 -->
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      width="1000px"
    >
      <el-form
        ref="dialogForm"
        :model="dialogObj.form"
        :rules="dialogObj.type === 'detail' ? null : dialogObj.rules"
        :disabled="dialogObj.type === 'detail'"
        label-width="160px"
        label-position="left"
      >
        <el-form-item label="目标地址名称" prop="addressTarget">
          <el-input
            v-model="dialogObj.form.addressTarget"
            v-limitBytes="300"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          :rules="dialogObj.rules.ids"
          prop="ids.length"
          label=""
          label-width="160px"
        >
          <el-form>
            <el-button
              v-if="dialogObj.type !== 'detail'"
              type="primary"
              @click="onOperate('configInterface')"
            >配置接口</el-button>
            <el-button
              v-else
              type="primary"
              @click="onOperate('configInterface')"
            >查看接口</el-button>
          </el-form>
          <el-input v-model="dialogObj.form.ids.length" style="display: none;" />
        </el-form-item>
        <el-form-item label="目标地址内容" prop="addressContent">
          <el-input
            v-model="dialogObj.form.addressContent"
            type="textarea"
            placeholder="请输入"
            maxlength="500"
            :autosize="{ minRows: 2, maxRows: 6 }"
            clearable
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <el-dialog
        width="1200px"
        :title="dialogObj.innerTitle"
        :visible.sync="dialogObj.innerVisible"
        append-to-body
      >
        <tableTree
          ref="tableTree"
          :origin-data="dialogObj.nodeList"
          :table-columns="dialogObj.headList"
          :disabled="dialogObj.type === 'detail'"
          :default-ids="dialogObj.tempTreeIds"
          show-checkbox
        />
        <div slot="footer">
          <el-button
            v-if="dialogObj.type !== 'detail'"
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('submitConfig')"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="dialogObj.innerVisible = false"
          >取消</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button
          v-if="dialogObj.type !== 'detail'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('submit')"
        >保存</el-button>
        <el-button
          class="button-default"
          @click="dialogObj.visible = false"
        >{{ dialogObj.type === 'detail' ? '返回' : '取消' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicDataConfigApi from '@/api/grip-manage/basicDataConfigApi'

const defaultSearchForm = {
  addressTarget: '',
  lastMntUserName: '',
  updateTime: ''
}
const defaultDialogForm = {
  ids: [],
  addressTarget: '',
  addressContent: ''
}
export default {
  data() {
    const validateIds = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      institutionType: '00',
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      dialogObj: {
        visible: false,
        title: '',
        innerVisible: false,
        innerTitle: '',
        type: '',
        form: Object.assign({}, defaultDialogForm),
        rules: {
          addressTarget: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          addressContent: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          ids: [
            { required: true, validator: validateIds, trigger: 'change' }
          ]
        },
        nodeList: [],
        headList: [],
        tempTreeIds: []
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    tabClick(tab, event) {
      console.log(tab, event)
      this.onReset()
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
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        addressTarget: this.mainObj.searchForm.addressTarget,
        lastMntUserName: this.mainObj.searchForm.lastMntUserName,
        institutionType: this.institutionType,
        startTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[0]} 00:00:00`
          : null,
        endTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[1]} 23:59:59`
          : null
      }
      basicDataConfigApi.getNetworkOpeningConfigList(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        }
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    },
    getTreeNode() {
      const params = {
        basicDataType: '20',
        institutionType: this.institutionType
      }
      if (this.dialogObj.type === 'detail') {
        this.dialogObj.innerTitle = '查看接口'
      } else {
        this.dialogObj.innerTitle = '配置接口'
      }
      if (this.dialogObj.type !== 'add') {
        params.id = this.dialogObj.form.addressId
      }
      basicDataConfigApi.getTreeNodes(params).then(res => {
        console.log(res.data)
        this.dialogObj.headList = res.data.headList
        this.dialogObj.nodeList = res.data.nodeList
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.dialogObj.visible = true
        this.dialogObj.type = type
        this.dialogObj.title = '新增'
        this.dialogObj.form = Object.assign({}, defaultDialogForm)
        this.dialogObj.tempTreeIds = []
        this.$nextTick(() => {
          this.$refs.dialogForm.clearValidate()
        })
      } else if (type === 'edit') {
        this.dialogObj.visible = true
        this.dialogObj.type = type
        this.dialogObj.title = '编辑'
        this.dialogObj.form = Object.assign({}, defaultDialogForm, row)
        this.dialogObj.tempTreeIds = []
        const params = {
          addressId: row.addressId
        }
        basicDataConfigApi.getNetworkOpeningConfigDetail(params).then(res => {
          this.dialogObj.form.ids = res.data.checkedMenuConfigNodeList
          this.$nextTick(() => {
            this.$refs.dialogForm.clearValidate()
          })
        })
      } else if (type === 'detail') {
        this.dialogObj.visible = true
        this.dialogObj.type = type
        this.dialogObj.title = '查看'
        this.dialogObj.form = Object.assign({}, defaultDialogForm, row)
        this.dialogObj.tempTreeIds = []
        this.$nextTick(() => {
          this.$refs.dialogForm.clearValidate()
        })
      } else if (type === 'delete') {
        this.$confirm('删除之后所配置的接口在网络开通申请中将不能自动回显目标地址，需场务用户手动输入，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            addressId: row.addressId
          }
          basicDataConfigApi.deleteNetworkOpeningConfig(params).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          })
        })
      } else if (type === 'configInterface') {
        this.dialogObj.innerVisible = true
        this.getTreeNode()
      } else if (type === 'submit') {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            if (this.dialogObj.form.ids.length === 0) {
              this.$message({
                type: 'info',
                message: '请至少选择一个接口'
              })
              return
            }
            const params = {
              addressTarget: this.dialogObj.form.addressTarget,
              addressContent: this.dialogObj.form.addressContent,
              checkedMenuConfigNodeList: this.dialogObj.form.ids,
              institutionType: this.institutionType
            }
            if (this.dialogObj.type === 'edit') {
              params.addressId = this.dialogObj.form.addressId
            }
            console.log(params)
            basicDataConfigApi.saveNetworkOpeningConfig(params, this.dialogObj.type).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.dialogObj.visible = false
              }
            })
          }
        })
      } else if (type === 'submitConfig') {
        console.log(this.$refs.tableTree.getCheckedNodeList())
        const checkedList = this.$refs.tableTree.getCheckedNodeList()
        this.dialogObj.tempTreeIds = checkedList.map((e) => e.id) || []
        const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
        const checkedLeafIdList = checkedLeafList.map(e => e.id)
        console.log(checkedLeafIdList)
        this.dialogObj.form.ids = checkedLeafIdList
        this.dialogObj.innerVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
