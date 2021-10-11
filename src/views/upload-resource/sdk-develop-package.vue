<template>
  <div class="protocol-panel">
    <el-row>
      <el-col :span="24">
        <div class="header">
          <div>
            <el-form ref="mainObj" :model="mainObj" label-width="100px" :rules="mainRules">
              <el-form-item label="接口内容" prop="interfaceContent">
                <el-select v-model="mainObj.interfaceContent" clearable placeholder="请选择">
                  <el-option
                    v-for="item in mainObj.interfaceContentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="接口名称" prop="interfaceName">
                <el-select v-model="mainObj.interfaceName" clearable placeholder="请选择">
                  <el-option
                    v-for="item in mainObj.interfaceNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button
              type="primary"
              icon="el-icon-folder-add"
              class="btn"
              @click="showUploadDialog"
            >资源上传</el-button>
          </div>
        </div>
        <div class="body">
          <div class="right-table">
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
              <el-table-column show-overflow-tooltip prop="sdkTitle" label="文件" min-width="70%" />
              <el-table-column show-overflow-tooltip prop="publishName" label="发布人" min-width="10%" />
              <el-table-column show-overflow-tooltip prop="publishTs" label="发布时间" min-width="14%" />
              <el-table-column label="操作" align="center" fixed="right" min-width="6%">
                <template slot-scope="scope">
                  <el-button type="text" @click="onOperate('delete', scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
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
      </el-col>
    </el-row>

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
        <el-form-item label="SDK源文件" prop="file">
          <el-input v-model="dialogObj.form.file" :disabled="true" />
          <el-upload
            ref="upload"
            class="upload-demo"
            action="fakeaction"
            :show-file-list="false"
            accept=".rar"
            :http-request="httpRequestPost"
          >
            <el-button slot="trigger" class="upload-btn" type="primary">
              选择文件
            </el-button>
            <div slot="tip" class="el-upload__tip">*注：上传文件格式为.rar格式文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        title="版本号"
        :visible.sync="dialogObj.innerVisible"
        append-to-body
      >
        <el-form
          ref="dialogForm"
          :model="dialogObj.innerForm"
          :rules="rules"
          label-width="80px"
          label-position="left"
          inline
        >
          <el-form-item label="版本号" prop="versionNo">
            <el-input v-model="dialogObj.innerForm.versionNo" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <span slot="footer">
            <el-button
              v-preventReClick
              type="primary"
              class="button-primary"
              @click="uploadSubmit('dialogForm')"
            >确定</el-button>
            <el-button class="button-default" @click="dialogObj.innerVisible = false">取消</el-button>
          </span>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="dialogObj.innerVisible = true"
          >确定</el-button>
          <el-button class="button-default" @click="dialogObj.visible = false">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import uploadResourceApi from '@/api/uploadResourceApi'
import sdkDevelopPackageApi from '@/api/sdkDevelopPackageApi'
export default {
  name: 'SdkDevelopPackage',
  data() {
    const validateInterfaceContent = (rule, value, callback) => {
      if (!value) {
        callback(new Error('接口内容不能为空'))
      } else {
        callback()
      }
    }
    const validateInterfaceName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('接口名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      mainObj: {
        interfaceContent: '', // 接口内容
        interfaceName: '', // 接口名称
        interfaceContentList: [{
          value: '选项1',
          label: '接口内容名称1'
        }], // 接口内容List
        interfaceNameList: [{
          value: '选项1',
          label: '接口内容名称1'
        }], // 接口名称List
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
        innerVisible: false,
        innerForm: {
          versionNo: ''
        },
        visible: false,
        form: {
          file: ''
        },
        formFile: new FormData()
      },
      mainRules: {
        interfaceContent: [{ type: 'array', required: true, validator: validateInterfaceContent, trigger: 'change' }],
        interfaceName: [{ type: 'array', required: true, validator: validateInterfaceName, trigger: 'change' }]
      },
      rules: {
        file: [
          { required: true, message: 'SDK源文件不能为空', trigger: 'blur' }
        ],
        versionNo: [
          { required: true, message: '版本号不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      value: '',
      input: '',
      fileinput: ''
    }
  },
  mounted() {
    // this.getData()
  },
  methods: {
    onOperate(type, row) {
      if (type === 'delete') {
        this.$confirm('是否删除当前该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    getData() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      sdkDevelopPackageApi.getsdkfile(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
        }
      })
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.getData()
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    showUploadDialog() {
      this.$refs.mainObj.validate((valid) => {
        if (valid) {
          this.dialogObj.visible = true
          this.resetForm('dialogForm')
        }
      })
    },
    uploadSubmit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const form = this.dialogObj.formFile
          uploadResourceApi.sdkImport(form).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: '文件上传成功',
                type: 'success'
              })
              this.dialogObj.visible = false
            }
          })
        }
      })
    },
    httpRequestPost(uploadfile) {
      const file = uploadfile.file
      this.dialogObj.form.file = file.name
      this.dialogObj.formFile = new FormData() // 创建form对象
      this.dialogObj.formFile.append('file', file)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1218px;
.protocol-panel {
  display: flex;
  background-color: #FFF;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border:1px solid rgba(223,223,223,1);
  box-shadow:0px 3px 6px rgba(0,0,0,0.06);

  .header {
    background: #fff;
    display: flex;
    justify-content: space-between;
    margin: 18px 20px;
    .btn {
      width: 100px;
      height: 30px;
      padding: 0;
    }
    /deep/ .el-form{
      display: flex;
      /deep/.el-form-item .el-form-item__label {
        line-height: 30px;
        font-size: 15px;
        padding-right: 10px;
      }
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
        font-size:15px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        line-height:20px;
        color:rgba(48,48,48,1);
        }
      }
    }
    ::v-deep.el-table th {
      background-color: #F6F7FB;
    }
    ::v-deep.el-table th {
      &:last-child {
        border-right: none;
      }
      background-color: #F6F7FB;
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
  font-family:Microsoft YaHei;
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
      padding-right: 10px;
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
      background:rgba(241,242,243,1);
      width: 68px;
      font-size: 14px;
      color: #206CC9;
      border: 1px solid #E6E6E6;
      border-left: none;
      height:30px;
      padding:0 6px;
    }
    .el-upload__tip {
      margin-top: 3px;
      margin-left: 10px;
    }
  }
  .dialog-footer {
    display:flex;
    justify-content: center;
  }
  ::v-deep .el-dialog__footer {
    padding: 10px 20px 40px;
    background-color: #FFFFFF;
  }
}

</style>

