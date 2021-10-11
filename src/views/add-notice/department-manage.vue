<template>
  <div>
    <div class="main-body">
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              icon="el-icon-circle-plus el-icon--right"
              @click="showDialog('add')"
            >新增部门</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="mainObj.departmentList"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column show-overflow-tooltip prop="name" label="部门名称" />
            <el-table-column show-overflow-tooltip prop="updateTs" label="更新日期" />
            <el-table-column show-overflow-tooltip prop="updateUserName" label="更新人" />
            <el-table-column label="操作" width="410px">
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  @click="showDialog('modify',scope.row)"
                >修改</el-button>
                <el-divider direction="vertical" />
                <el-button
                  v-preventReClick
                  type="text"
                  @click="showAudit('MARKET', scope.row, '市场机构审核权限查看')"
                >市场机构审核权限查看</el-button>
                <el-divider direction="vertical" />
                <el-button
                  v-preventReClick
                  type="text"
                  @click="showAudit('IIQ', scope.row, '信息商审核权限查看')"
                >信息商审核权限查看</el-button>
                <el-divider direction="vertical" />
                <el-button
                  v-preventReClick
                  type="text"
                  @click="deleteDepartment(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.searchCondition.page"
            :page-size="mainObj.searchCondition.pageSize"
            :page-sizes="mainObj.pagesizes"
            :total="mainObj.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--新增/修改-->
    <el-dialog
      :title="departmentDialog.title"
      :visible.sync="departmentDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      width="478px"
      @close="handleDialogClose"
    >
      <el-form
        ref="departmentForm"
        :model="departmentDialog.form"
        :rules="departmentDialog.rules"
        label-width="160px"
        label-position="right"
      >
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="departmentDialog.form.departmentName" :placeholder="placeholder" :maxlength="50" clearable @focus="blurSearchFor()" @blur="blurSear()" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="saveDepartment"
          >确定</el-button>
          <el-button class="button-default" @click="departmentDialog.visible = false">取消</el-button>
        </span>
      </div>
    </el-dialog>
    <!--接口审核权限-->
    <el-dialog
      :title="auditDialog.title"
      :visible.sync="auditDialog.visible"
      width="1200px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="audit-dialog"
    >
      <el-tabs v-model="auditDialog.activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in auditDialog.tabNameList"
          :key="index"
          :label="item.text"
          :name="item.name"
        >
          <tableTree
            v-if="auditDialog.activeName === item.name"
            :ref="item.name"
            v-loading="auditDialog.loading"
            :disabled="true"
            :height="auditDialog.autoHeight"
            :origin-data="auditDialog.originData"
            :table-columns="auditDialog.tableColumns"
            show-checkbox
          />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            class="button-default"
            @click="auditDialog.visible = false"
          >关闭</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'

export default {
  data() {
    return {
      placeholder: '请输入部门名称',
      departmentDialog: {
        title: '新增部门',
        type: '',
        visible: false,
        form: {
          id: '',
          departmentName: ''
        },
        rules: {
          departmentName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
        }
      },
      mainObj: {
        searchCondition: {
          page: 1,
          pageSize: 20
        },
        pagesizes: [20, 50, 100],
        total: 0,
        departmentList: []
      },
      auditDialog: {
        visible: false,
        title: '',
        activeName: '',
        tabNameList: [],
        type: '',
        departmentId: '',
        originData: [],
        tableColumns: [],
        loading: true,
        disabled: true,
        autoHeight: 100
      }
    }
  },
  created() {
    this.fetchData()
    this.$nextTick(() => {
      this.auditDialog.autoHeight = this.$root.$el.clientHeight - 380
      window.onresize = () => {
        this.auditDialog.autoHeight = this.$root.$el.clientHeight - 380
      }
    })
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    // 获取焦点时触发
    blurSearchFor() {
      console.log(this.placeholder)
      if (this.placeholder === '请输入部门名称') {
        this.placeholder = ''
      }
    },
    // 失去焦点时触发
    blurSear() {
      this.placeholder = '请输入部门名称'
    },
    showDialog(operation, row) {
      if (operation === 'add') {
        this.departmentDialog.title = '新增部门'
      } else {
        this.departmentDialog.title = '修改部门'
        this.$nextTick(() => {
          this.departmentDialog.form.id = row.id
          this.departmentDialog.form.departmentName = row.name
        })
      }
      this.departmentDialog.type = operation
      this.departmentDialog.visible = true
    },
    async showAudit(type, row, title) {
      this.auditDialog.type = type
      this.auditDialog.title = title
      this.auditDialog.departmentId = row.id
      const result = await gripManageApi.getDepartmentAuditTabs({ instiType: type })
      this.auditDialog.tabNameList = result.data
      this.auditDialog.activeName = result.data[0].name
      // 打开dialog不会触发tabclick,手动初始化
      this.getTabData(
        result.data[0].name,
        this.auditDialog.type,
        this.auditDialog.departmentId
      )

      this.auditDialog.visible = true
    },
    handleTabClick(tab) {
      this.getTabData(
        tab.name,
        this.auditDialog.type,
        this.auditDialog.departmentId
      )
    },
    async getTabData(name, type, departmentId) {
      this.auditDialog.loading = true
      let result
      if (type === 'MARKET') {
        result = await gripManageApi.getDepartmentMarketTableData({
          departmentId,
          teamMenuTypeList: [name]
        })
      } else if (type === 'IIQ') {
        result = await gripManageApi.getDepartmentIIQTableData({
          departmentId,
          teamMenuTypeList: [name]
        })
      }
      const { code, data } = result
      if (code === 'ACK') {
        const table = data.find((element) => element.type === name)
        this.auditDialog.originData = table.value.nodeList
        this.auditDialog.tableColumns = table.value.headList
        this.auditDialog.loading = false
      }
    },
    handleDialogClose() {
      this.$refs.departmentForm.resetFields()
    },
    async saveDepartment() {
      this.$refs.departmentForm.validate(async valid => {
        if (valid) {
          var result
          if (this.departmentDialog.type === 'add') {
            result = await gripManageApi.addDepartment(this.departmentDialog.form)
          } else {
            result = await gripManageApi.modifyDepartment(this.departmentDialog.form)
          }
          const { code, message } = result
          if (code === 'ACK') {
            this.$message.success(message)
            this.fetchData()
            this.departmentDialog.visible = false
          }
        }
      })
    },
    async deleteDepartment(row) {
      const result = await this.$confirm('确定删除该部门吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
      })
      if (result === 'confirm') {
        const result = await gripManageApi.deleteDepartment({ departmentId: row.id })
        const { code, message } = result
        if (code === 'ACK') {
          this.$message.success(message)
          this.fetchData()
        } else {
          this.$message.error(message)
        }
      }
    },
    async fetchData() {
      const result = await gripManageApi.getDepartmentList(this.mainObj.searchCondition)
      const { code, data } = result
      if (code === 'ACK') {
        this.mainObj.departmentList = data.list
        this.mainObj.total = data.totalRecord
      }
    },
    handleSizeChange(val) {
      this.mainObj.searchCondition.pageSize = val
      this.mainObj.searchCondition.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.searchCondition.page = val
      this.fetchData()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-checkbox{
    padding-top:5px;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color: #409eff;
}

::v-deep .el-checkbox__input.is-disabled+span.el-checkbox__label{
  color: black;
}
</style>
