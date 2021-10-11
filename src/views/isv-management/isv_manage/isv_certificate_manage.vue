<template>
  <div class="isv_certificate">
    <el-card class="top_card">
      <el-form :inline="true" :model="formInline" class="query_inline_form">
        <el-form-item label="证书编号">
          <el-input
            v-model="formInline.certificateNum"
            clearable
            placeholder="请输入证书编号"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item label="持证人姓名">
          <el-input
            v-model="formInline.certificateUser"
            clearable
            placeholder="请输入持证人姓名"
            maxlength="300"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            style="margin-left: 30px"
            @click="handleFilter()"
            >查询</el-button
          >
          <el-button size="mini" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <el-button
        type="primary"
        style="margin-bottom: 20px"
        @click="addCertificate()"
        >新增</el-button
      >
      <el-table
        v-loading="loading"
        :data="certifData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#eee', color: '#606266' }"
      >
        <el-table-column prop="certificateNum" label="证书编号" />
        <el-table-column prop="certificateUser" label="持证人姓名" />
        <el-table-column prop="issureDt" label="发证日期" />

        <el-table-column prop="validityTime" label="有效期" />
        <el-table-column prop="lastMntTs" label="更新时间" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="editCertificateItem(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                @click="deleteCertificateItem(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="display: flex; justify-content: flex-end; margin-top: 17px"
        :current-page="pageQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑 对话框 -->
    <el-dialog
      v-if="dialogVisible"
      :title="title"
      :visible.sync="dialogVisible"
      width="10%"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules">
        <el-form-item
          label="证书编号"
          :label-width="formLabelWidth"
          prop="certificateNum"
        >
          <el-input
            v-model="dialogForm.certificateNum"
            :disabled="this.title == '编辑'"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="持证人姓名"
          :label-width="formLabelWidth"
          prop="certificateUser"
        >
          <el-input
            v-model="dialogForm.certificateUser"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="发证日期"
          :label-width="formLabelWidth"
          prop="issureDt"
        >
          <el-date-picker
            v-model="dialogForm.issureDt"
            clearable
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item
          label="有效期"
          :label-width="formLabelWidth"
          prop="validityTime"
        >
          <el-date-picker
            v-model="dialogForm.validityTime"
            type="daterange"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="submitDialog('dialogForm')"
          >确 定</el-button
        >
        <el-button @click="cancelDialog()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqQueryCertificate,
  addCertificate,
  editCertificate,
  deleteCertificate,
} from '@/api/isvManagement/isv_manage'

export default {
  name: 'IsvCertificateManage',
  data() {
    return {
      formInline: {
        certificateNum: '',
        certificateUser: '',
      },
      searchForm: {
        certificateNum: '',
        certificateUser: '',
      },

      // 分页信息
      total: 0,
      pageQuery: {
        page: 0,
        pageSize: 10,
      },

      // 查询表格信息
      certifData: [],
      loading: false,

      // 新增/编辑title
      title: '',
      dialogVisible: false,
      formLabelWidth: '100px',

      // 新增对话框
      dialogForm: {
        certificateNum: '',
        certificateUser: '',
        issureDt: '',
        validityTime: [],
      },
      rules: {
        certificateNum: [
          {
            required: true,
            message: '请输入证书编号',
            trigger: ['blur', 'change'],
          },
          {
            max: 300,
            message: '证书编号最长不超过300字符',
            trigger: ['blur', 'change'],
          },
        ],
        certificateUser: [
          {
            required: true,
            message: '请输入持证人姓名',
            trigger: ['blur', 'change'],
          },
          {
            max: 300,
            message: '持证人姓名最长不超过300字符',
            trigger: ['blur', 'change'],
          },
        ],
        issureDt: [
          { required: true, message: '请选择发证日期', trigger: 'blur' },
        ],
        validityTime: [
          { required: true, message: '请选择有效期', trigger: 'blur' },
        ],
      },

      id: '', // 主键id
    }
  },

  created() {
    // this.routerLinkCreated()
    this.handleFilter()
  },

  methods: {
    // routerLinkCreated() {
    //   this.handleFilter()
    // },

    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.loading = true
      try {
        const res = await reqQueryCertificate({
          ...searchForm,
          ...this.pageQuery,
        })
        if (res.code === 'ACK') {
          this.certifData = res.data.list
          this.total = res.data.totalRecord
        }
        this.loading = false
        // console.log('查询场务端ISV证书信息', res)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      // console.log(val)
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      // console.log(val)
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },

    onReset() {
      Object.keys(this.formInline).forEach((item) => {
        if (typeof this.formInline[item] === 'string') {
          this.formInline[item] = ''
        }
        if (
          typeof this.formInline[item] === 'object' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = []
        }
        if (
          Object.prototype.toString.call(this.formInline[item]) ===
            '[object object]' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = {}
        }
        if (item === 'page') this.formInline[item] = 1
        if (item === 'pageSize') this.formInline[item] = 10
      })
      // console.log('重置信息', this.formInline)
      this.handleFilter()
    },

    // 新增Dialog
    addCertificate() {
      this.title = '新增'
      this.dialogVisible = true
      this.dialogForm = {}
    },

    // 编辑Dialog
    editCertificateItem(index, row) {
      this.title = '编辑'
      this.dialogVisible = true
      this.dialogForm = Object.assign({}, row)
      this.dialogForm.validityTime = this.dialogForm.validityTime.split('至')
      this.id = row.id
    },

    submitDialog(dialogForm) {
      this.$refs[dialogForm].validate(async (valid) => {
        if (valid) {
          if (this.title === '新增') {
            const res = await addCertificate({
              certificateNum: this.dialogForm.certificateNum,
              certificateUser: this.dialogForm.certificateUser,
              issureDt: this.dialogForm.issureDt,
              validityStartDt:
                this.dialogForm.validityTime &&
                this.dialogForm.validityTime.length >= 2
                  ? this.dialogForm.validityTime[0]
                  : '',
              validityEndDt:
                this.dialogForm.validityTime &&
                this.dialogForm.validityTime.length >= 2
                  ? this.dialogForm.validityTime[1]
                  : '',
            })

            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message,
              })
              this.certifData.push()
              this.handleFilter()
            }
            this.dialogVisible = false
          } else if (this.title === '编辑') {
            const params = {
              id: this.id,
              certificateUser: this.dialogForm.certificateUser,
              issureDt: this.dialogForm.issureDt,
              validityStartDt:
                this.dialogForm.validityTime &&
                this.dialogForm.validityTime.length >= 2
                  ? this.dialogForm.validityTime[0]
                  : '',
              validityEndDt:
                this.dialogForm.validityTime &&
                this.dialogForm.validityTime.length >= 2
                  ? this.dialogForm.validityTime[1]
                  : '',
            }
            const res = await editCertificate(params)
            console.log(
              this.dialogForm.validityTime,
              this.dialogForm.validityTime[0]
            )
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message,
              })
              this.handleFilter()
            }
            this.dialogVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    cancelDialog() {
      this.dialogVisible = false
    },

    deleteCertificateItem(index, row) {
      this.$confirm('是否确认删除该条证书数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteCertificate(row).then((res) => {
            if (res.code === 'ACK') {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              // this.certifData.splice(index, 1)
              this.handleFilter()
            } else if (res.code === 'NACK') {
              this.$message({
                type: 'warning',
                message: res.message,
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang='scss' scoped>
.top_card {
  margin-bottom: 20px;
}

.query_inline_form {
  height: 30px;
}

.el-input ::v-deep .el-input__inner {
  width: 300px;
}

::v-deep .el-range-editor.el-input__inner {
  width: 300px;
}
</style>
