<template>
  <div>
    <div class="main">
      <div class="header">
        <el-form
          ref="searchForm"
          class="top-form"
          :model="mainObj.searchForm"
          label-width="80px"
          label-position="left"
          inline
        >
          <div class="top-main">
            <el-row>
              <el-col :span="8">
                <el-form-item label="机构名称" prop="userName">
                  <el-input v-model="mainObj.searchForm.userName" />
                </el-form-item>
                <el-form-item label="提交时间" class="date-input" prop="userName">
                  <el-date-picker
                    v-model="mainObj.searchForm.auditDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="--起始时间--"
                    end-placeholder="--结束时间--"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="width250" label="统一社会信用代码" prop="userName" label-width="120px">
                  <el-input v-model="mainObj.searchForm.userName" />
                </el-form-item>
                <el-form-item label="问题描述" prop="userName">
                  <el-input v-model="mainObj.searchForm.userName" placeholder="请输入关键字" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="问题类型" prop="processStatus">
                  <el-select v-model="mainObj.searchForm.processStatus" multiple placeholder="--全部--" clearable>
                    <el-option
                      v-for="item in processOptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="onSearch">筛选</el-button>
                  <el-button size="mini" @click="onReset('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div class="body">
        <el-table
          :data="tableData"
          class="process-table"
          stripe
          border
          highlight-current-row
          :header-row-style="{height: '42px'}"
          :header-cell-style="{padding: 0}"
          :row-style="{height: '42px'}"
          :cell-style="{padding: 0}"
        >
          <el-table-column show-overflow-tooltip prop="label1" label="机构名称" min-width="180" />
          <el-table-column show-overflow-tooltip prop="label2" label="统一社会信用代码" min-width="150" />
          <el-table-column show-overflow-tooltip prop="label3" label="问题类型" align="center" min-width="100" />
          <el-table-column show-overflow-tooltip prop="label4" label="问题描述" min-width="180" />
          <el-table-column show-overflow-tooltip prop="label5" label="提交时间" min-width="170" />
          <el-table-column show-overflow-tooltip prop="label6" label="提交人" min-width="140" />
          <el-table-column label="流程状态" align="center" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="onOperate('peocessView', scope.row)">流程查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="190" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="onOperate('solution', scope.row)">问题受理</el-button>
              <el-button type="text" @click="onOperate('detail', scope.row)">满意度详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="mainObj.currentPage"
          :page-size="mainObj.pageSize"
          :page-sizes="[20,50,100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mainObj.totalRecord"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 问题受理弹窗 -->
      <el-dialog
        class="solution-dialog"
        :close-on-click-modal="false"
        :title="solutionDialog.title"
        :visible.sync="solutionDialog.visible"
        width="1040px"
        :modal-append-to-body="false"
      >
        <div>
          <p class="group-title">基础信息</p>
          <table class="detail-table basice-table" border style="border-collapse:collapse">
            <colgroup>
              <col width="13%">
              <col width="12%">
              <col width="17%">
              <col width="12%">
              <col width="17%">
              <col width="12%">
              <col width="17%">
            </colgroup>
            <tr>
              <td class="bg-color">问题是否解决</td>
              <td colspan="2">{{ detailDialog.form.note }}</td>
              <td colspan="4" style="padding-left: 0">
                <div class="code-color">统一社会信用代码</div>
                <div>{{ detailDialog.form.note }}</div>
              </td>
            </tr>
            <tr>
              <td class="bg-color">通讯地址</td>
              <td colspan="6">{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td class="bg-color">联系人</td>
              <td class="bg-color">姓名</td>
              <td>{{ detailDialog.form.note }}</td>
              <td class="bg-color">手机</td>
              <td>{{ detailDialog.form.note }}</td>
              <td class="bg-color" />
              <td>{{ detailDialog.form.note }}</td>
            </tr>
          </table>
        </div>
        <div>
          <p class="group-title">问题提交</p>
          <table class="detail-table basice-table" border style="border-collapse:collapse">
            <colgroup>
              <col width="13%">
              <col width="87%">
            </colgroup>
            <tr>
              <td class="bg-color">问题类型</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td class="bg-color">问题描述</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td class="bg-color">附件</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
          </table>
        </div>
        <div class="qa-panel">
          <div class="qa-title">
            <img src="@/assets/icon/qa-icon.png" style="width: 27px; height: 27px">
            <p class="title">问题解答</p>
          </div>
          <el-form
            ref="solutionForm"
            :model="solutionDialog.form"
            :rules="rules"
            label-width="80px"
            label-position="left"
            inline
          >
            <el-form-item label="解答" prop="answer">
              <el-input v-model="solutionDialog.form.answer" type="textarea" placeholder="" style="height: 94px" />
            </el-form-item>
            <el-form-item label="文件上传" prop="fileIdList">
              <UploadFiles
                ref="upload"
                v-model="solutionDialog.fileIdList"
                :limit="20"
                :tips="tips"
                :accept="accept"
              />
            </el-form-item>
            <el-form-item label="注" prop="note">
              <el-input v-model="solutionDialog.form.note" type="textarea" placeholder="" style="height: 74px" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <span slot="footer">
            <el-button v-preventReClick type="primary" class="button-primary" @click="onOperate('solutionSubmit')">确定</el-button>
            <el-button class="button-default" @click="solutionDialog.visible = false">取消</el-button>
          </span>
        </div>
      </el-dialog>
      <!-- 满意度详情 -->
      <el-dialog
        class="detail-dialog"
        :close-on-click-modal="false"
        :title="detailDialog.title"
        :visible.sync="detailDialog.visible"
        width="1040px"
        :modal-append-to-body="false"
      >
        <div>
          <table class="detail-table" border style="border-collapse:collapse">
            <colgroup>
              <col width="16%">
              <col width="14%">
              <col width="80%">
            </colgroup>
            <tr>
              <td class="bg-color">问题是否解决</td>
              <td colspan="2">{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td rowspan="2" class="bg-color">问题满意度</td>
              <td class="bg-color">回复速度</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td class="bg-color">协调及配合度</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
            <tr>
              <td class="bg-color">改进建议</td>
              <td colspan="2">{{ detailDialog.form.note }}</td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import globalOptions from '@/utils/globalOptionsValue'
import UploadFiles from '@/components/UploadFiles'
// import { isNull } from '@/utils/index.js'
import { mapGetters } from 'vuex'
import { fetchList, addUserInfo } from '@/api/userManageApi'
// import { } from '@/utils/validate'
export default {
  name: 'MemberManage',
  components: {
    UploadFiles
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (this.solutionDialog.fileIdList === 0) {
        callback(new Error('请上传附件'))
      } else {
        callback()
      }
    }
    return {
      accept: '.pdf,.doc,.jpg,.xsl',
      tips: '*注：上传文件格式为.pdf、.doc、.jpg、.xsl格式文件',
      smsCode: '',
      tabActiveName: 'audit',
      showAuditBtn: true,
      showDetailBtn: true,
      editPass: false,
      editPhone: false,
      editEmail: false,
      mainObj: {
        currentPage: 1,
        totalRecord: 0,
        pagesize: 20,
        searchForm: {
          userName: '',
          userStatus: ''
        }
      },
      phoneCode: globalOptions.phoneCode,
      serveiceOptions: globalOptions.serveiceOptions,
      processOptions: globalOptions.processOptions,
      marketOptions: globalOptions.marketOptions,
      userStatus: '',
      solutionDialog: {
        visible: false,
        title: '',
        fileIdList: [],
        form: {
          note: '',
          answer: ''
        }
      },
      detailDialog: {
        visible: false,
        title: '',
        form: {
          note: '',
          answer: ''
        }
      },
      rules: {
        answer: [{ required: true, message: '不能为空！', trigger: 'blur' }],
        fileIdList: [{ required: true, validator: validateFile, trigger: 'change' }],
        note: [{ required: true, message: '不能为空！', trigger: 'blur' }]
      },
      tableData: [
        {
          label1: '流程查看数据',
          label2: '流程查看数据',
          label3: '待审核',
          label4: '流程查看数据',
          label5: '流程查看数据',
          label6: '流程查看数据',
          processStatus: '待审核'
        },
        {
          label1: '流程查看数据',
          label2: '流程查看数据',
          label3: '审核中',
          label4: '流程查看数据',
          label5: '流程查看数据',
          label6: '流程查看数据',
          processStatus: '审核中'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    // this.fetchData()
  },
  methods: {
    validTel(str) {
      var reg = /^\d{7,8}$/
      return reg.test(str)
    },
    validTelArea(str) {
      var reg = /\b0\d{2,3}\b/
      return reg.test(str)
    },
    fetchData() { // 查询所有用户信息
      const params = {
        page: this.mainObj.currentPage,
        pagesize: this.mainObj.pagesize,
        auditDateEnd: this.mainObj.searchForm.auditDate ? this.mainObj.searchForm.auditDate[1] : '',
        auditDateStart: this.mainObj.searchForm.auditDate ? this.mainObj.searchForm.auditDate[0] : ''
      }
      fetchList(params).then(res => {
        if (res === 'ACK') {
          this.searchForm.totalRecord = res.data.totalRecord
        }
      })
    },
    handleTabClick(row) {
      console.log(row)
    },
    onSearch() {
      this.mainObj.currentPage = 1
      const params = {
        loginName: this.mainObj.searchForm.userName,
        userStatus: this.mainObj.searchForm.userStatus,
        page: this.mainObj.currentPage,
        pagesize: this.mainObj.pagesize
      }
      fetchList(params).then(response => {
        if (response.data.list != null) {
          var tempTableData = []
          for (var item in response.data.list) {
            const tempItem = {
              userName: response.data.list[item].loginName,
              userStatus: response.data.list[item].userStatus.text,
              userType: response.data.list[item].userType,
              phoneNo: response.data.list[item].phoneNo,
              phoneNoAreaCode: response.data.list[item].phoneNoAreaCode
            }
            tempTableData.push(tempItem)
          }
          this.tableData = tempTableData
        }
        this.searchForm.totalRecord = response.data.totalRecord
      })
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.fetchData()
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    onOperate(type, row) {
      if (type === 'solution') {
        this.solutionDialog.visible = true
        this.solutionDialog.title = '问题受理'
      } else if (type === 'solutionSubmit') { // 新增用户
        this.$refs['solutionForm'].validate(valid => {
          if (valid) {
            const params = {
              answer: this.solutionDialog.form.answer,
              note: this.solutionDialog.form.note,
              fileId: this.solutionDialog.form.fileIdList
            }
            addUserInfo(params).then(response => {
              if (response.code === 'ACK') {
                this.dialogObj.addVisible = false
                this.fetchData()
              } else if (response.code === 'VALIDATION') { // 后端验证
                if ('loginName' in response.data) {
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'answer')).validateState = 'error'
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'answer')).validateMessage = response.data.answer
                }
                if ('sName' in response.data) {
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'note')).validateState = 'error'
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'note')).validateMessage = response.data.note
                }
                if ('telNo' in response.data) {
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'fileIdList')).validateState = 'error'
                  this.$refs['solutionForm'].fields.find((item) => (item.prop === 'fileIdList')).validateMessage = response.data.fileIdList
                }
              }
            })
          } else { // 前端验证出错
            console.log('error submit!!')
            return false
          }
        })
      } else if (type === 'detail') {
        this.detailDialog.visible = true
        this.detailDialog.title = '满意度详情'
      } else if (type === 'peocessView') {
        // this.dialogObj.visible = true
        // this.dialogObj.title = '查看'
        // getUserInfo(row.id).then(response => {
        //   this.dialogObj.form = response.data
        // })
      }
    },
    handleSizeChange(val) {
      this.mainObj.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
  $mainWidth: 1220px;
  .solution-dialog{
    font-family: Microsoft YaHei;
    color: rgb(48,48,48);
    ::v-deep.el-dialog__body {
      padding: 20px 25px 0;
    }
    ::v-deep .el-dialog__footer{
      background: #FBFCFF;
    }
    .el-form {
      margin-left: 10px;
      ::v-deep .el-form-item__label {
        font-size: 15px;
        font-weight: 400;
        color: #303030;
      }
      ::v-deep.el-form-item__content {
        width: 91%;
      }
      .el-textarea {
        ::v-deep.el-textarea__inner {
          min-height: 100%!important;
          resize: none;
        }
      }
    }
    .group-title {
      font-weight: 700;
      border-left: 3px solid #2c76d1;
      padding-left: 6px;
      font-size: 16px;
      line-height: 18px;
      color: #303030;
    }
    .qa-panel {
      height:380px;
      background:#FBFCFF;
      margin-top: 20px;
      margin-left: -27px;
      margin-right: -27px;
      padding: 0 25px;
      border-top: 1px dashed #D1D5DE;
      .qa-title {
        display: flex;
        padding: 10px 0;
        align-items: center;
        .title {
          font-weight: 700;
          padding-left: 6px;
          font-size: 16px;
          line-height: 18px;
        }
      }
    }
  }
  .main {
    display: flex;
    background-color: #E7EDF5;
    flex-direction: column;
    width: $mainWidth;
    margin: 28px auto;
    height: 100%;

    .header {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(223, 223, 223, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
      border-bottom: none;
      padding: 18px 18px 0;
      .el-form-item {
        margin-bottom: 18px;
      }
      .top-main {
        ::v-deep .el-input__inner {
          width: 250px;
        }
        .width250 {
          ::v-deep .el-input__inner {
            width: 200px;
          }
        }
        ::v-deep .el-form-item__label{
          font-size:14px;
          font-family:Microsoft YaHei;
          font-weight:400;
        }
        .date-input {
          .el-date-editor {
            width: 250px;
            height: 30px;
            border-radius: 0;
            ::v-deep .el-range__icon {
              line-height: 23px;
            }
            ::v-deep .el-range-separator {
              line-height: 23px;
            }
            ::v-deep .el-range__close-icon {
              line-height: 23px;
            }
          }
        }
      }
    }
  }

  .body {
    margin-top: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    border-bottom: none;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;

    ::v-deep.el-table th {
      background-color: #F6F7FB;
      .cell {
        color:rgba(48,48,48,1);
        font-size:15px;
        font-family:Microsoft YaHei;
        font-weight:bold;
      }
    }
    ::v-deep.el-table th {
      background-color: #F6F7FB;
    }
    ::v-deep .el-table--border{
      border:none;
    }
  }

  .block {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-top: none;
    padding: 15px 10px 15px 10px;
    display: flex;
    justify-content: flex-end;
  }

  .el-dialog {
    // ::v-deep .el-dialog__body {
    //   font-size: 15px!important;
    //   color: #303030!important;
    // }
    .edit-panel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .edit-disable {
        ::v-deep .el-input__inner {
          border: none;
          padding: 0;
        }
      }

      .el-input {
        width: 86%;
      }

      .el-icon {
        color: #2C76D1;
        line-height: 36px;
      }
    }

    .el-form-item {
      margin-bottom: 18px;
    }

    .el-form-item,
    .el-select {
      width: 100%;
    }

    .dialog-footer {
      text-align: center;
    }
    .message-code {
      .el-input {
        width: 63%;
      }

      .el-button {
        height: 29px;
        line-height: 0;
        margin-left: 10px;
      }
    }
  }
  .detail-dialog {
    ::v-deep .el-dialog__body {
      padding: 30px;
    }
  }
  .detail-table {
    border: 1px solid rgba(233,233,233,1);
    width: 100%;
    tr {
      height: 42px;
    }
    td {
      border: 1px solid #e9e9e9;
      padding-left: 10px;
      font-size:15px;
      font-weight:400;
      color: #303030;
    }
    .bg-color {
      background:rgba(246,247,251,1);
    }
    .code-color {
      background:rgba(246,247,251,1);
      border-right: 1px solid rgba(233,233,233,1);
      width: 26%;
      height: 42px;
      text-align: center;
      line-height: 42px;
    }
  }
</style>
