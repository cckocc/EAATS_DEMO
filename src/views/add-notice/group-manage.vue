<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-width="60px"
          label-position="left"
          inline
        >
          <el-form-item
            label="小组名称"
            prop="departmentTeamName"
            label-width="80px"
          >
            <el-input
              v-model.trim="mainObj.searchForm.departmentTeamName"
              v-limitBytes="20"
              class="group-name"
              clearable
            />
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
            <el-select
              v-model="mainObj.searchForm.departmentName"
              placeholder
              clearable
            >
              <el-option
                v-for="item in userDepartmentOptions"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              />
            </el-select>
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
              @click="showGroupDialog('add')"
            >新增小组</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="mainObj.groupList"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column show-overflow-tooltip prop="pName" label="部门" />
            <el-table-column show-overflow-tooltip prop="name" label="小组名称" />
            <el-table-column
              show-overflow-tooltip
              prop="teamUserName"
              label="小组成员"
            />
            <el-table-column
              show-overflow-tooltip
              prop="updateTs"
              label="更新日期"
            />
            <el-table-column
              show-overflow-tooltip
              prop="updateUserName"
              label="更新人"
            />
            <el-table-column label="操作" width="410px">
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="
                    userDepartmentId != '' && userDepartmentId != scope.row.pId
                      ? true
                      : false
                  "
                  @click="showGroupDialog('update', scope.row)"
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
                  :disabled="
                    userDepartmentId != '' && userDepartmentId != scope.row.pId
                      ? true
                      : false
                  "
                  @click="deleteGroup(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.searchForm.page"
            :page-size="mainObj.searchForm.pageSize"
            :page-sizes="mainObj.pagesizes"
            :total="mainObj.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增/修改Dialog -->
    <el-dialog
      width="780px"
      :title="groupDialog.title"
      :visible.sync="groupDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="resetGroupDialog"
    >
      <el-form
        ref="groupMgtRef"
        :model="groupDialog.groupData"
        :rules="groupDialog.rules"
        :inline="true"
      >
        <el-form-item label="小组名称" prop="teamName">
          <el-input
            v-model="groupDialog.groupData.teamName"
            :maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="所属部门"
          style="margin-left: 100px"
          prop="departmentId"
        >
          <el-select
            v-model="groupDialog.groupData.departmentId"
            placeholder="请选择部门"
            :disabled="userInfo.roleType.name !== 'SUPER_ADMINISTRATOR' || groupDialog.type === 'update'"
            @change="selectDepartment"
          >
            <el-option
              v-for="item in userDepartmentOptions"
              :key="item.code"
              :label="item.text"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-transfer
        v-model="groupDialog.groupData.teamUserList"
        :data="groupDialog.groupData.departUserList"
        :titles="['部门成员', '小组成员']"
        :props="{
          key: 'code',
          label: 'text',
        }"
        filterable
        class="transfer"
      />
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="saveGroup"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="groupDialog.visible = false"
          >取消</el-button>
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
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      userDepartmentOptions: [],
      value: '',
      userDepartmentId: '',
      mainObj: {
        groupList: [],
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        searchForm: {
          departmentTeamName: '',
          departmentName: '',
          page: 1,
          pageSize: 20
        }
      },
      groupDialog: {
        title: '新增小组',
        searchForm: {},
        visible: false,
        type: '',
        rules: {
          teamName: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请选择部门！', trigger: 'blur' }
          ]
        },
        groupData: {
          teamId: 0,
          teamName: '',
          departmentId: '',
          departUserList: [], // 左侧列表
          teamUserList: [] // 右侧列表
        }
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.loadDepartmentOptions()
    this.getUserDepartment()
    this.fetchData()
  },
  mounted() {
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
    onReset() {
      if (this.$refs['searchForm']) {
        this.$refs['searchForm'].resetFields()
      }
      this.fetchData()
    },
    onSearch() {
      this.mainObj.searchForm.page = 1
      this.fetchData()
    },
    resetGroupDialog() {
      this.groupDialog.groupData = this.$options.data().groupDialog.groupData
    },
    async showGroupDialog(operation, row) {
      await this.getUserDepartment()
      if (operation === 'add') {
        this.groupDialog.title = '新增小组'
        // 超级管理员不属于任何部门
        if (this.userInfo.roleType.name !== 'SUPER_ADMINISTRATOR') {
          const result = await gripManageApi.getAllDepartmentUser({
            departmentId: this.userDepartmentId
          })
          this.groupDialog.groupData.departUserList = result.data
        }
      } else {
        this.groupDialog.title = '修改小组'
        const result = await gripManageApi.getGroupDetail({ teamId: row.id })
        this.groupDialog.groupData = result.data
        if (this.groupDialog.groupData.teamUserList.length > 0) {
          const newTeamUserList = this.groupDialog.groupData.teamUserList.map(
            (obj) => {
              return obj.code
            }
          )
          this.groupDialog.groupData.teamUserList = newTeamUserList
        }
      }
      this.groupDialog.type = operation
      this.groupDialog.visible = true
    },
    async selectDepartment(val) {
      // 重置
      this.groupDialog.groupData.departUserList = []
      const result = await gripManageApi.getAllDepartmentUser({
        departmentId: val
      })
      this.groupDialog.groupData.departUserList = result.data
    },
    async showAudit(type, row, title) {
      this.auditDialog.type = type
      this.auditDialog.title = title
      this.auditDialog.departmentId = row.id
      const result = await gripManageApi.getGroupAuditTabs({ instiType: type })
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
    handleSizeChange(val) {
      this.mainObj.searchForm.pageSize = val
      this.mainObj.searchForm.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.searchForm.page = val
      this.fetchData()
    },
    async fetchData() {
      const result = await gripManageApi.getGroupList(this.mainObj.searchForm)
      const { code, data } = result
      if (code === 'ACK') {
        this.mainObj.groupList = data.list
        this.mainObj.total = data.totalRecord
      }
    },
    async saveGroup() {
      this.$refs.groupMgtRef.validate(async(valid) => {
        if (valid) {
          let data
          if (this.groupDialog.type === 'add') {
            data = {
              departmentId: this.groupDialog.groupData.departmentId,
              teamName: this.groupDialog.groupData.teamName,
              userIdList: this.groupDialog.groupData.teamUserList
            }
          } else if (this.groupDialog.type === 'update') {
            data = {
              departmentId: this.groupDialog.groupData.departmentId,
              teamName: this.groupDialog.groupData.teamName,
              userIdList: this.groupDialog.groupData.teamUserList,
              teamId: this.groupDialog.groupData.teamId
            }
          }
          const result = await gripManageApi.addUpdateGroupMember(data)
          const { code, message } = result
          if (code === 'ACK') {
            this.$message.success(message)
            this.fetchData()
            this.groupDialog.visible = false
          }
        }
      })
    },
    async deleteGroup(row) {
      const result = await this.$confirm('确定删除该小组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (result === 'confirm') {
        const result = await gripManageApi.deleteGroup({ teamId: row.id })
        const { code, message } = result
        if (code === 'ACK') {
          this.$message.success(message)
          this.fetchData()
        } else {
          this.$message.error(message)
        }
      }
    },
    async getUserDepartment() {
      if (this.userInfo.roleType.name !== 'SUPER_ADMINISTRATOR') {
        const result = await gripManageApi.getCurrentDepart()
        if (result.code === 'ACK') {
          this.groupDialog.groupData.departmentId = result.data.code
          this.userDepartmentId = result.data.code
        }
      }
    },
    async loadDepartmentOptions() {
      const result = await gripManageApi.getAllDepartmentFromGroup()
      this.userDepartmentOptions = result.data
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
        result = await gripManageApi.getMarketTableData({
          departmentId,
          teamMenuTypeList: [name]
        })
      } else if (type === 'IIQ') {
        result = await gripManageApi.getIIQTableData({
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
    async saveAudit() {
      this.auditDialog.loading = true
      const checkedList = this.$refs[
        this.auditDialog.activeName
      ][0].getCheckedNodeList()
      const checkedLeafList = checkedList.filter((e) => e.isLeafFlg === 'YES')
      const checkedLeafIdList = checkedLeafList.map((e) => e.id)

      const data = {
        departmentId: this.auditDialog.departmentId,
        instiType: this.auditDialog.type,
        teamMenuType: this.auditDialog.activeName,
        checkedNodeIdList: checkedLeafIdList
      }
      let result
      try {
        if (this.auditDialog.type === 'IIQ') {
          result = await gripManageApi.saveIIQGroupAuditData(data)
        } else if (this.auditDialog.type === 'MARKET') {
          result = await gripManageApi.saveMarketGroupAuditData(data)
        }
        if (result.code === 'ACK') {
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.auditDialog.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.audit-dialog {
  ::v-deep.el-tabs__header {
    height: auto;
    line-height: normal;
  }
}
.transfer {
  margin: 0 auto;
  width: 580px;

  ::v-deep.el-transfer-panel {
    width: 230px;
  }
  ::v-deep.el-transfer__button {
    display: block;
    margin: 0 0 10px 0;
  }
}
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
