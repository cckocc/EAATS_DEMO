<template>
  <div class="main-body">
    <div class="main-body-bottom">
      <div class="main-body-bottom-btn">
        <div class="main-body-bottom-btn-left">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-folder-add"
            @click="showUploadDialog"
          >资源上传</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="mainObj.list"
          stripe
          border
          highlight-current-row
          :header-row-class-name="tableRowClassName"
          :header-row-style="{height: '42px'}"
          :header-cell-style="{padding: 0}"
          :row-style="{height: '42px'}"
          :cell-style="{padding: 0}"
        >
          <el-table-column
            show-overflow-tooltip
            prop="fileName"
            label="文件"
            min-width="70%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleClick(scope.row)"
              >{{ scope.row.fileName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publishName"
            label="发布人"
            min-width="10%"
          />
          <el-table-column
            show-overflow-tooltip
            prop="publishTs"
            label="发布时间"
            min-width="14%"
          />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            min-width="6%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteCSV(scope.row)"
              >删除</el-button>
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

    <el-dialog
      class="upload-dialog"
      :close-on-click-modal="false"
      title="资源上传"
      :visible.sync="dialogObj.visible"
      :modal-append-to-body="false"
      width="810px"
      destroy-on-close
    >
      <el-form
        ref="dialogForm"
        :model="dialogObj.form"
        :rules="rules"
        label-width="17%"
        label-position="left"
        inline
      >
        <el-form-item
          label="协议标准源文件"
          prop="file"
        >
          <el-input
            v-model="dialogObj.form.file"
            :disabled="true"
          />
          <el-upload
            ref="upload"
            class="upload-demo"
            action="fakeaction"
            :show-file-list="false"
            accept=".zip"
            :http-request="httpRequestPosi"
          >
            <el-button
              slot="trigger"
              class="upload-btn"
              type="primary"
              @click="resubmit"
            >
              选择文件
            </el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >*注：上传文件格式为.zip格式文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            :disabled="uploadSub"
            @click="uploadSubmit('dialogForm')"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="dialogObj.visible = false,uploadSub = false"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadResourceApi from '@/api/uploadResourceApi'
export default {
  name: 'MemberManage',
  data() {
    return {
      activeName: 'first',
      uploadSub: false,
      mainObj: {
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dialogObj: {
        visible: false,
        form: {
          file: ''
        },
        formFile: new FormData()
      },
      rules: {
        file: [
          { required: true, message: '协议标准源文件不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      value: '',
      input: '',
      fileinput: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.mainObj.currentPage = val
      this.fetchData()
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    showUploadDialog() {
      this.dialogObj.visible = true
      // this.resetForm('dialogForm')
      this.dialogObj.form.file = null
    },
    resubmit() {
      this.uploadSub = false
    },
    uploadSubmit() {
      this.uploadSub = true
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          const form = this.dialogObj.formFile
          uploadResourceApi.csvImport(form).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: '文件上传成功',
                type: 'success'
              })
              this.uploadSub = false
              this.dialogObj.visible = false
              this.fetchData()
            }
          })
        }
      })
    },
    // 删除文件
    deleteCSV(row) {
      const params = {
        publishTs: row.publishTs
      }
      this.$confirm('是否删除当前该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          uploadResourceApi.deleteCSV(row.publishTs).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: '文件删除成功',
                type: 'success'
              })
              this.fetchData()
            } else if (res.code === 'NACK') {
              this.$message({
                type: 'warning',
                message: res.message
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    httpRequestPosi(uploadfile) {
      const file = uploadfile.file
      this.dialogObj.form.file = file.name
      this.dialogObj.formFile = new FormData() // 创建form对象
      this.dialogObj.formFile.append('file', file)
      // let form = this.dialogObj.formFile
      // uploadResourceApi.csvImport(form).then(res => {
      //   if(res.code === 'ACK') {
      //     this.dialogObj.form.file = file.name
      //     this.$message({
      //       message: '文件上传成功',
      //       type: 'success'
      //     })
      //   }
      // })
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    },
    fetchData() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      uploadResourceApi.searchCSV(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = JSON.parse(JSON.stringify(res.data.list))
          this.mainObj.total = res.data.totalRecord
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1218px;
.protocol-panel {
  display: flex;
  background-color: #fff;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(223, 223, 223, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);

  .header {
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 18px 20px;

    .btn {
      width: 100px;
      height: 30px;
      padding: 0;
    }
  }

  .body {
    background: rgba(255, 255, 255, 1);
    border-bottom: none;
    padding: 0 0 0 0;
    display: flex;
    .right-table {
      width: 100%;
      ::v-deep .el-table--border {
        border-right: none;
        border-left: none;
      }
      ::v-deep.el-table--border {
        td:last-child {
          border-right: none;
        }
      }
      ::v-deep .header-row-th {
        th {
          font-size: 15px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 20px;
          color: rgba(48, 48, 48, 1);
        }
      }
    }
    ::v-deep.el-table th {
      background-color: #f6f7fb;
    }
    ::v-deep.el-table th {
      &:last-child {
        border-right: none;
      }
      background-color: #f6f7fb;
    }
  }

  .block {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-top: none;
    width: 100%;
    padding: 20px 23px 20px 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.upload-dialog {
  font-size: 14px;
  color: #303030;
  font-family: Microsoft YaHei;
  ::v-deep .el-dialog__body {
    padding: 40px 40px 10px;
  }
  .el-form-item {
    width: 100%;
    display: flex;
    ::v-deep .el-form-item__label {
      font-size: 14px;
      color: #303030;
      font-weight: 400;
    }
    ::v-deep .el-form-item__content {
      display: flex;
      width: 85%;
    }
  }
  .el-input {
    width: 40%;
    &.is-disabled {
      ::v-deep .el-input__inner {
        background: #fff;
        color: #303030;
      }
    }
  }
  .upload-demo {
    display: flex;
    .upload-btn {
      background: rgba(241, 242, 243, 1);
      width: 68px;
      font-size: 14px;
      color: #206cc9;
      border: 1px solid #e6e6e6;
      border-left: none;
      height: 30px;
      padding: 0 6px;
    }
    .el-upload__tip {
      margin-top: 3px;
      margin-left: 10px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-dialog__footer {
    padding: 10px 20px 40px;
    background-color: #ffffff;
  }
}
</style>

