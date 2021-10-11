<template>
  <div class="audit_config">
    <el-card class="table_card">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          prop="id"
          label="分类"
          width="180"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.id === '7'">isv审核</span>
            <span v-if="scope.row.id === 'INST00'||scope.row.id === 'INST05'||scope.row.id === 'INST10'||scope.row.id === 'INST15'||scope.row.id === 'INST18'">机构审核</span>
            <span v-if="scope.row.id === 'USER00'||scope.row.id === 'USER05'||scope.row.id === 'USER10'||scope.row.id === 'USER15'">用户审核</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditType.text"
          label="审核类别"
        />
        <el-table-column
          prop="departGroupNameList"
          label="所需审核部门/小组"
        >
          <template slot-scope="scope">
            {{ scope.row.departGroupNameList.join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="moreFlag" label="是否任意一个审核通过">
          <template slot-scope="scope">
            <span v-if="scope.row.moreFlag === '1'">是</span>
            <span v-if="scope.row.moreFlag === '0'">否</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="lastMntOpName"
          label="最后修改人"
        />
        <el-table-column
          prop="lastMntTs"
          label="最后修改时间"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click.native.prevent="editRow(scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-if="dialogVisible" title="编辑配置信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="dialogForm">
        <el-form-item label="审核类别" :label-width="formLabelWidth">
          <el-select
            v-model="dialogForm.auditType"
            clearable
            disabled
            placeholder="请选择所需审核类别"
          >
            <el-option
              v-for="item in auditTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所需审核部门" :label-width="formLabelWidth">
          <el-select
            v-model="dialogForm.departmentName"
            multiple
            filterable
            placeholder="请选择所需审核部门"
          >
            <el-option-group
              v-for="(group, index) in departmentOptions"
              :key="index"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="group.label +'——'+ item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否审核通过" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.moreFlag" style="width: 100%" :disabled="disabledFlag">
            <el-option
              v-for="item in passingStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="submitEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqQueryAudit, reqEditAuditForm, reqEditAuditConfig } from '@/api/statisticalQuery/statistic'

export default {
  name: 'AuditConfig',
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,

      auditTypeList: [],
      departmentOptions: [],
      passingStatusList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],

      dialogVisible: false,
      formLabelWidth: '120px',
      dialogForm: {
        auditType: '',
        departmentName: '',
        moreFlag: ''
      },
      id: '',
      disabledFlag: false
    }
  },

  created() {
    this.initPage()
  },

  methods: {
    async initPage() {
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      const res = await reqQueryAudit(params)
      if (res.code === 'ACK') {
        this.tableData = res.data.list
      }
      console.log('审核配置', res)
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 1,
            colspan: 1
          }
        } else if (rowIndex === 1) {
          return {
            rowspan: 5,
            colspan: 1
          }
        } else if (rowIndex === 6) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    async editRow(row) {
      this.dialogVisible = true
      if (row.id !== '7') {
        this.disabledFlag = true
      } else {
        this.disabledFlag = false
      }
      const res = await reqEditAuditForm({ id: row.id })
      // console.log('编辑审核', res)
      if (res.code === 'ACK') {
        this.id = res.data.id
        this.dialogForm.auditType = res.data.auditType.text
        this.dialogForm.departmentName = res.data.departGroupIdList
        this.dialogForm.moreFlag = res.data.moreFlag
        this.departmentOptions = res.data.Options
      }
    },

    cancelEdit() {
      this.dialogVisible = false
    },

    async submitEdit() {
      console.log('departmentName', this.dialogForm.departmentName)
      if (this.dialogForm.departmentName && this.dialogForm.departmentName.length === 0) {
        this.$message({
          message: '请选择所需审核部门',
          type: 'warning'
        })
      } else {
        const params = {
          id: this.id,
          departGroupIdList: this.dialogForm.departmentName,
          moreFlag: this.dialogForm.moreFlag
        }
        const res = await reqEditAuditConfig(params)
        this.dialogVisible = false
      }

      this.initPage()
    }

  }
}
</script>

<style scoped lang = "scss">
.table_card{
  margin: 20px 0px;
}

::v-deep .el-select {
  width: 100%;
}
</style>
