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
              <el-col :span="7">
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
              </el-col>
              <el-col :span="7">
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
              <el-col :span="7">
                <el-form-item label="问题描述" prop="userName">
                  <el-input v-model="mainObj.searchForm.userName" placeholder="请输入关键字" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
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
        <div class="btn-panel">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            class="top-btn add-btn"
            @click="onOperate('add')"
          >新增</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="top-btn delete-btn"
            @click="onOperate('delete')"
          >删除</el-button>
        </div>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column show-overflow-tooltip prop="label1" label="问题类型" min-width="180" />
          <el-table-column show-overflow-tooltip prop="label2" label="问题描述" min-width="150" />
          <el-table-column show-overflow-tooltip prop="label5" label="提交时间" min-width="170" />
          <el-table-column show-overflow-tooltip prop="label6" label="提交人" min-width="140" />
          <el-table-column label="流程状态" align="center" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="onOperate('peocessView', scope.row)">流程查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="190" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="onOperate('solution', scope.row)">详情</el-button>
              <el-button type="text" @click="onOperate('feedback', scope.row)">满意度反馈</el-button>
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
      <!-- 流程查看 -->
      <el-dialog
        class="view-dialog"
        :close-on-click-modal="false"
        title="流程查看"
        :visible.sync="viewDialog.visible"
        width="658px"
        :modal-append-to-body="false"
      >
        <div class="view-body">
          <div class="step step01">
            <div class="icon-title">
              <div class="icon">
                <img src="@/assets/icon/process_01.png">
              </div>
              <div class="title">
                <span>已提交反馈</span>
                <span>2020-04-20 11:12:09</span>
              </div>
            </div>
            <div class="dot">
              <span v-for="index of 3" />
            </div>
          </div>
          <div class="step step02">
            <div class="icon-title">
              <div class="icon">
                <img v-if="false" src="@/assets/icon/process_false_02.png">
                <img v-else src="@/assets/icon/process_02.png">
              </div>
              <div class="title">
                <span>已受理</span>
                <span>2020-04-20 11:12:09</span>
              </div>
            </div>
            <div class="dot">
              <span v-for="index of 3" />
            </div>
          </div>
          <div class="step step03">
            <div class="icon-title">
              <div class="icon">
                <img src="@/assets/icon/process_03.png">
              </div>
              <div class="title">
                <span>待受理</span>
                <span>2020-04-20 11:12:09</span>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 详情弹窗 -->
      <el-dialog
        class="solution-dialog"
        :close-on-click-modal="false"
        title="详情"
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
              <td class="bg-color">邮箱</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
          </table>
        </div>
        <div>
          <p class="group-title">问题提交</p>
          <table class="detail-table basice-table" border style="border-collapse:collapse; margin-bottom: 10px">
            <colgroup>
              <col width="13%">
              <col width="37%">
              <col width="13%">
              <col width="37%">
            </colgroup>
            <tr>
              <td class="bg-color">问题类型</td>
              <td>{{ detailDialog.form.note }}</td>
              <td class="bg-color">标题</td>
              <td>{{ detailDialog.form.note }}</td>
            </tr>
          </table>
          <div class="solution-panel">
            <table class="detail-table basice-table" border="0" style="border-collapse:collapse; border: 1px solid #fff">
              <colgroup>
                <col width="13%">
                <col width="37%">
                <col width="13%">
                <col width="37%">
              </colgroup>
              <tr>
                <td class="bg-color">问题类型</td>
                <td colspan="3">{{ detailDialog.form.note }}</td>
              </tr>
              <tr>
                <td class="bg-color">附件</td>
                <td colspan="3">{{ detailDialog.form.note }}</td>
              </tr>
              <tr>
                <td class="bg-color">提交人</td>
                <td>{{ detailDialog.form.note }}</td>
                <td class="bg-color">提交时间</td>
                <td>{{ detailDialog.form.note }}</td>
              </tr>
            </table>
            <div class="sperate" />
            <table class="detail-table basice-table" style="border-collapse:collapse">
              <colgroup>
                <col width="13%">
                <col width="37%">
                <col width="13%">
                <col width="37%">
              </colgroup>
              <tr>
                <td class="bg-color-orange">解答</td>
                <td>{{ detailDialog.form.note }}</td>
                <td class="bg-color-orange">附件</td>
                <td>{{ detailDialog.form.note }}</td>
              </tr>
              <tr>
                <td class="bg-color-orange">解答人</td>
                <td>{{ detailDialog.form.note }}</td>
                <td class="bg-color-orange">解答时间</td>
                <td>{{ detailDialog.form.note }}</td>
              </tr>
              <tr>
                <td colspan="4">{{ detailDialog.form.note }}</td>
              </tr>
            </table>
          </div>
        </div>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addProblem = !addProblem"
        >问题追加</el-button>
        <div v-if="addProblem" class="qa-panel">
          <el-form
            ref="solutionForm"
            :model="solutionDialog.form"
            :rules="rules"
            label-width="80px"
            label-position="left"
            inline
          >
            <el-form-item label="解答" prop="answer" class="answer-textarea">
              <el-input v-model="solutionDialog.form.answer" type="textarea" placeholder="" style="height: 64px" />
            </el-form-item>
            <el-form-item label="附件" prop="fileIdList">
              <UploadFiles
                ref="upload"
                v-model="solutionDialog.fileIdList"
                :limit="20"
                :tips="tips"
                :accept="accept"
              />
            </el-form-item>
            <el-form-item label="提交人" prop="note">
              <el-input v-model="solutionDialog.form.note" placeholder="" />
            </el-form-item>
            <el-form-item label="提交时间" prop="date">
              <el-input v-model="solutionDialog.form.date" placeholder="" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <span slot="footer">
            <el-button v-preventReClick type="primary" class="button-primary" @click="onOperate('solutionSubmit')">确定</el-button>
            <el-button class="button-default" @click="solutionDialog.visible = false, addProblem = false">取消</el-button>
          </span>
          <div class="tips">
            <span>注：内容待确定</span>
            <span>咨询电话：4009787878-5-1(电话待确认)</span>
          </div>
        </div>
      </el-dialog>
      <!-- 满意度反馈 -->
      <el-dialog
        class="detail-dialog"
        :close-on-click-modal="false"
        :title="detailDialog.title"
        :visible.sync="detailDialog.visible"
        width="1040px"
        :modal-append-to-body="false"
      >
        <el-form
          ref="feedForm"
          :model="detailDialog.form"
          :rules="rules"
          label-width="100px"
          label-position="left"
          inline
        >
          <el-form-item label="问题是否解决 " prop="typeList">
            <el-checkbox-group v-model="detailDialog.form.typeList" :max="1" @change="typeChange">
              <el-checkbox
                v-for="item in isNoOption"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <hr class="hr">
          <span class="satisfy">问题满意度</span>
          <el-form-item label="回答速度" prop="typeList" class="answer-speed">
            <el-checkbox-group v-model="detailDialog.form.answerSpeed" :max="1" @change="typeChange">
              <el-checkbox
                v-for="item in feedOption"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="协调及配合度 " prop="typeList">
            <el-checkbox-group v-model="detailDialog.form.cooprate" :max="1" @change="typeChange">
              <el-checkbox
                v-for="item in feedOption"
                :key="item.value"
                :label="item.value"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <hr class="hr">
          <el-form-item label="改进建议" class="textarea" prop="describe">
            <el-input v-model="detailDialog.form.describe" type="textarea" placeholder="" style="height: 180px" />
          </el-form-item>
          <div class="dialog-footer">
            <el-form-item>
              <el-button @click="detailDialog.visible = false">取消</el-button>
              <el-button type="primary" @click="onOperate()">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
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
      multipleSelection: '',
      addProblem: false,
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
      isNoOption: [
        { label: '是', value: '01' },
        { label: '否', value: '02' }
      ],
      userStatus: '',
      solutionDialog: {
        visible: false,
        title: '',
        fileIdList: [],
        form: {
          note: '',
          answer: '',
          date: ''
        }
      },
      feedOption: globalOptions.feedOption,
      detailDialog: {
        visible: false,
        title: '',
        form: {
          typeList: [],
          answerSpeed: '',
          cooprate: ''
        }
      },
      viewDialog: {
        visible: false
      },
      rules: {
        answer: [{ required: true, message: '不能为空！', trigger: 'blur' }],
        fileIdList: [{ required: true, validator: validateFile, trigger: 'change' }],
        note: [{ required: true, message: '不能为空！', trigger: 'blur' }],
        date: [{ required: true, message: '不能为空！', trigger: 'blur' }]
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
    typeChange(val) {
      console.log(val)
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
    handleSizeChange(val) {
      this.mainObj.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onOperate(type, row) {
      if (type === 'solution') {
        this.solutionDialog.visible = true
        this.solutionDialog.title = '详情'
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
      } else if (type === 'feedback') {
        this.detailDialog.visible = true
        this.detailDialog.title = '满意度详情'
      } else if (type === 'peocessView') {
        this.viewDialog.visible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  $mainWidth: 1220px;
  .solution-dialog{
    font-family: Microsoft YaHei;
    color: rgb(48,48,48);
    .solution-panel {
      height:260px;
      overflow: auto;
      margin-bottom: 20px;
      .sperate {
        border-left:1px solid rgba(233,233,233,1);
        border-right:1px solid rgba(233,233,233,1);
        height:5px;
        background:rgba(255,233,194,1);
      }
    }
    ::v-deep.el-dialog__body {
      padding: 20px 25px 0;
    }
    ::v-deep .el-dialog__footer{
      background: #FFF;
    }
    .el-form {
      margin-left: 10px;
      ::v-deep .el-form-item__label {
        font-size: 15px;
        font-weight: 400;
        color: #303030;
      }
      ::v-deep.el-form-item__content {
        width: 390px;
      }
      .answer-textarea {
        ::v-deep.el-form-item__content {
          width: 90%;
        }
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
      min-height:262px;
      background:#FBFCFF;
      border:1px solid rgba(233,233,233,1);
      margin-top: 20px;
      padding-top: 20px;
      padding-bottom: 0;
      margin-bottom: 20px;
      .el-form-item {
        width: 100%;
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

    .view-dialog {
      ::v-deep .el-dialog__body {
        padding: 30px;
      }
      .view-body {
        width:601px;
        height:342px;
        padding: 20px 80px;
        background:rgba(250,251,253,1);
        border:1px dashed rgba(223,223,223,1);
        .step {
          .icon-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon {
              width: 48px;
              height: 48px;
              border:1px dashed rgba(223,223,223,1);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .title {
              display: flex;
              flex-direction: column;
              margin-left: 20px;
              span {
                color: #303030;
                font-size: 16px;
                &:nth-child(1) {
                  font-weight: 700;
                  margin-bottom: 7px;
                }
              }
            }
          }
          .dot {
            display: flex;
            flex-direction: column;
            width: 48px;
            align-items: center;
            span {
              height: 5px;
              width: 5px;
              border-radius: 50%;
              margin-top: 5px;
              background-color: #14BF85;
              &:nth-child(1) {
                margin-top: 18px;
              }
              &:last-child {
                margin-bottom: 22px;
              }
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
    .btn-panel {
      padding: 20px;
      .top-btn {
        height: 30px;
        width: 67px;
        padding: 0;
      }
      .add-btn {
      }
      .delete-btn {
      }
      .el-button--danger {
        color: #FB7878;
        background:rgba(255,252,252,1);
        border:1px solid #FB7878;
        border-radius: 0;
        &:hover, &:focus {
          color: #fff;
          background:#FB7878;
          border:1px solid #FB7878;
        }
      }
    }

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
      border-top: 1px solid #dfe6ec;
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
    color: #303030;
    font-family:Microsoft YaHei;
    .el-form {
      .el-form-item {
        ::v-deep.el-form-item__label {
          font-size:14px;
          font-weight:400;
        }
      }
    }
    .el-form-item {
      margin-bottom: 18px;
      margin-right: 0;
    }
    .dialog-footer {
      text-align: center;
      .tips {
        display: flex;
        font-size:15px;
        font-weight:400;
        flex-direction: column;
        text-align: left;
        padding: 20px 0;
        span {
          display: inline-block;
          &:nth-child(2) {
            margin-top: 10px;
          }
        }
      }
    }
  }
  .detail-dialog {
    .hr {
      height:1px;
      border: none;
      border-top:1px solid rgba(209,213,222,1);
      margin-bottom: 20px;
      margin-top: 0;
    }
    .satisfy {
      font-size:16px;
      font-weight:bold;
      color: #303030;
      margin-bottom: 20px;
      display: inline-block;
    }
    .answer-speed {
      margin-bottom: 10px;
    }
    ::v-deep .el-dialog__body {
      padding: 30px;
    }
    .el-form-item {
      width: 100%;
    }
    .textarea {
      ::v-deep.el-form-item__content {
        width: 100%;
        margin-top: 15px;
      }
      ::v-deep.el-textarea__inner {
        width: 100%;
        min-height: 100%!important;
        resize: none;
      }
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
    .bg-color-orange {
      background: #FFFBEE;
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
