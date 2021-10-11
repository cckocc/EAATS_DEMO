<template>
  <div class="display_information_audit">
    <el-card class="top_card">
      <el-form
        ref="formInline"
        :label-position="labelPosition"
        :model="formInline"
        class="form_style"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="机构名称">
              <el-input
                v-model="formInline.cnFullName"
                clearable
                class="fixed_width"
                placeholder="请填写机构名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提交时间">
              <el-date-picker
                v-model="formInline.createTs"
                clearable
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态">
              <el-select
                v-model="formInline.audtStatus"
                clearable
                filterable
                style="width:400px;"
                placeholder="请选择审核状态"
              >
                <el-option
                  v-for="item in audtStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                @click="handleFilter()"
              >查询</el-button>
              <el-button size="mini" @click="onReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="bottom_card">
      <el-table
        v-loading="loading"
        :data="examTableData"
        style="width: 100%"
        :header-cell-style="{ background: '#eee', color: '#606266' }"
      >
        <el-table-column prop="cnFullName" label="机构名称" />
        <el-table-column prop="audtStatus" label="审核状态">
          <template slot-scope="scope">
            <div>
              <el-button v-if="scope.row.audtStatus === '00'" type="text">
                <img src="~@/assets/style/exam_icon.svg" alt="">
                待审核
              </el-button>
              <el-button v-else-if="scope.row.audtStatus === '10'" type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="">
                通过
              </el-button>
              <el-button v-else-if="scope.row.audtStatus === '90'" type="text">
                <img src="~@/assets/style/refuse_icon.svg" alt="">
                拒绝
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="submitter" label="提交人" />
        <el-table-column prop="createTs" label="提交时间" />
        <el-table-column prop="reviewer" label="审核人">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.audtStatus === '00'" type="text" />
              <span v-else type="text">
                {{ scope.row.reviewer }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="audtDate" label="审核时间">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.audtStatus === '00'" type="text" />
              <span v-else type="text">
                {{ scope.row.audtDate }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- v-if="scope.row.auditPer === 'true'" -->
            <el-button
              v-if="scope.row.auditPer === true"
              type="text"
              :disabled="scope.row.audtStatus !== '00'"
              @click="openExamDialog(scope.$index, scope.row)"
            >审核</el-button>
            <el-divider
              v-if="scope.row.auditPer === true"
              direction="vertical"
            />
            <el-button
              type="text"
              @click="checkExamDialog(scope.$index, scope.row)"
            >查看</el-button>
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

    <!-- 审核对话框 -->
    <el-dialog
      v-if="examDialogVisible"
      title="审核"
      width="1043px"
      :visible.sync="examDialogVisible"
      class="view-dialog"
      :modal="true"
      append-to-body
      @close="examDialogVisible = false"
    >
      <div class="org-wrap">
        <img
          src="~@/assets/style/docu_icon .svg"
          style="vertical-align: bottom"
        >
        <span>{{ examObject.cnFullName }}</span>
      </div>
      <table>
        <tr>
          <td>社会信用代码</td>
          <td>{{ examObject.cfetsInstnCd }}</td>
          <td>成立日期</td>
          <td>{{ examObject.esDate }}</td>
        </tr>
        <tr>
          <td>注册资本</td>
          <td>
            {{
              examObject.registCaptial
                ? examObject.registCaptial + '万元人民币'
                : ''
            }}
          </td>
          <td>人员规模</td>
          <td>
            {{ examObject.staffScale ? examObject.staffScale + '人' : '' }}
          </td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>{{ examObject.contact }}</td>
          <td>联系邮箱</td>
          <td>{{ examObject.conEmail }}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{ examObject.conMobile }}</td>
          <td>提交人</td>
          <td>
            {{ examObject.submitter }}
          </td>
        </tr>

        <tr>
          <td>提交时间</td>
          <td>{{ examObject.createTs }}</td>
          <td>附件内容</td>
          <td>
            <el-popover
              v-if="fileList.length > 0"
              trigger="hover"
              placement="right"
              width="500"
            >
              <p>附件内容</p>
              <el-link
                v-for="(file, fileIndex) in fileList"
                :key="fileIndex"
                :underline="false"
                style="display: block"
                type="primary"
                @click="downLoadFile(file)"
              >
                <!-- {{file}} -->
                {{ file.fileName }}
              </el-link>
              <el-button
                slot="reference"
                class="reference_file"
              >点击下载附件</el-button>
            </el-popover>
          </td>
        </tr>
        <tr>
          <td>公司地址</td>
          <td colspan="6">{{ examObject.comAddress }}</td>
        </tr>
      </table>
      <div class="feedback_box">
        <div class="feedback">审核反馈</div>
        <el-form ref="feedbackForm" :model="feedbackForm">
          <el-form-item prop="remark">
            <el-input
              v-model="feedbackForm.remark"
              type="textarea"
              maxlength="500"
              autosize
              placeholder="请输入反馈内容"
            />
          </el-form-item>
          <el-form-item class="bt_btn">
            <el-button type="primary" @click="passClick()">通过</el-button>
            <el-button type="primary" @click="refuseClick()">拒绝</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog
      v-if="checkDialogVisible"
      title="查看"
      :visible.sync="checkDialogVisible"
      width="1043px"
      class="view-dialog"
      :modal="true"
      append-to-body
      @close="checkDialogVisible = false"
    >
      <div class="org-wrap">
        <img
          src="~@/assets/style/docu_icon .svg"
          style="vertical-align: bottom"
        >
        <span>{{ examObject.cnFullName }}</span>
      </div>
      <table>
        <tr>
          <td>社会信用代码</td>
          <td>{{ examObject.cfetsInstnCd }}</td>
          <td>成立日期</td>
          <td>{{ examObject.esDate }}</td>
        </tr>
        <tr>
          <td>注册资本</td>
          <td>
            {{
              examObject.registCaptial
                ? examObject.registCaptial + '万元人民币'
                : ''
            }}
          </td>
          <td>人员规模</td>
          <td>
            {{ examObject.staffScale ? examObject.staffScale + '人' : '' }}
          </td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>{{ examObject.contact }}</td>
          <td>联系邮箱</td>
          <td>{{ examObject.conEmail }}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{ examObject.conMobile }}</td>
          <td>提交人</td>
          <td>
            {{ examObject.submitter }}
          </td>
        </tr>

        <tr>
          <td>提交时间</td>
          <td>{{ examObject.createTs }}</td>
          <td>附件内容</td>
          <td>
            <el-popover
              v-if="fileList.length > 0"
              trigger="hover"
              placement="right"
              width="500"
            >
              <p>附件内容</p>
              <el-link
                v-for="(file, fileIndex) in fileList"
                :key="fileIndex"
                :underline="false"
                style="display: block"
                type="primary"
                @click="downLoadFile(file)"
              >
                {{ file.fileName }}
              </el-link>
              <el-button
                slot="reference"
                class="reference_file"
              >点击下载附件</el-button>
            </el-popover>
          </td>
        </tr>
        <tr>
          <td>公司地址</td>
          <td colspan="6">{{ examObject.comAddress }}</td>
        </tr>
      </table>
      <div class="feedback_box">
        <div class="feedback">审核反馈</div>
        <el-form ref="feedbackFormCheck" :model="feedbackFormCheck">
          <el-form-item prop="remark">
            <el-input
              v-for="(item, index) in feedbackFormCheck.remarkList"
              :key="index"
              v-model="item.remark"
              readonly
              type="textarea"
              autosize
              placeholder="请输入反馈内容"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqGetExamList,
  reqGetInstiInfo,
  reqOptionExam,
  reqDownLoadFiles
} from '@/api/isvManagement/isv_manage.js'
// import { getToken } from '@/utils/auth'
// import axios from 'axios'
import { downloadFile } from '@/utils/index'

export default {
  name: 'DisplayInformationAudit',
  data() {
    return {
      labelPosition: 'left',
      formInline: {
        cnFullName: '',
        createTs: [],
        audtStatus: ''
      },
      searchForm: {
        cnFullName: '',
        createTs: [],
        audtStatus: ''
      },

      // 加载状态
      loading: false,

      // 审核状态下拉框
      audtStatusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '00',
          label: '待审核'
        },
        {
          value: '10',
          label: '通过'
        },
        {
          value: '90',
          label: '拒绝'
        }
      ],

      // 展示审核信息表格
      examTableData: [],

      // 分页信息
      total: 100,
      pageQuery: {
        page: 0,
        pageSize: 10
      },

      // 审核对话框
      examDialogVisible: false,
      examObject: {},
      feedbackForm: {
        remark: ''
      },
      fileList: [],
      // 查看对话框
      checkDialogVisible: false,
      feedbackFormCheck: {
        remarkList: []
      }
    }
  },

  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.pageQuery.page = 1
      if (
        this.formInline.createTs === null ||
        this.formInline.createTs.length === 0
      ) {
        this.formInline.createTs = ['', '']
      }
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.loading = true
      try {
        const res = await reqGetExamList({
          // ...this.searchForm,
          cnFullName: this.formInline.cnFullName,
          audtStatus: this.formInline.audtStatus,
          ...this.pageQuery,
          starDate: this.formInline.createTs[0],
          endDate: this.formInline.createTs[1]
        })
        if (res.code === 'ACK') {
          // this.$message({
          //   type: 'success',
          //   message: res.message
          // })
          this.examTableData = res.data.list
          this.total = res.data.totalRecord
        }
        this.loading = false
        // console.log('获取展示信息审核列表', res)
      } catch (error) {
        this.loading = false
        console.log(error)
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

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },

    // 审核弹框
    async openExamDialog(index, row) {
      this.examDialogVisible = true
      this.feedbackForm.remark = ''
      // console.log('审核前', index, row)

      const res = await reqGetInstiInfo(row)
      if (res.code === 'ACK') {
        // this.$message({
        //   type: 'success',
        //   message: res.message
        // })
        this.examObject = res.data

        this.feedbackForm.remark = res.data.remark
        this.fileList = res.data.filed
      }
      // console.log('获取该项审核信息', res)
    },

    // 查看弹框
    async checkExamDialog(index, row) {
      this.checkDialogVisible = true
      // this.feedbackForm.remark = ''
      // console.log('审核前', index, row)

      const res = await reqGetInstiInfo(row)
      if (res.code === 'ACK') {
        // this.$message({
        //   type: 'success',
        //   message: res.message
        // })
        this.examObject = res.data
        this.feedbackFormCheck.remarkList = res.data.remarkList
        this.fileList = res.data.filed
      }
      // console.log('获取该项审核信息===>查看', res)
    },

    // refuseClick(feedbackForm) {
    //   this.$refs[feedbackForm].validate(async(valid) => {
    //     console.log('表单数据', feedbackForm)
    //     if (valid) {
    //       try {
    //         const res = await reqOptionExam({ audtStatus: '90', remark: this.feedbackForm.remark, cnFullId: this.examObject.cnFullId, id: this.examObject.id })
    //         if (res.code === 'ACK') {
    //           this.$message({
    //             type: 'success',
    //             message: res.message
    //           })
    //           this.handleFilter()
    //         }
    //         console.log('拒绝操作====》', res)
    //       } catch (error) {
    //         console.log(error)
    //       }
    //       this.examDialogVisible = false
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },

    async refuseClick() {
      if (this.feedbackForm.remark) {
        try {
          const res = await reqOptionExam({
            audtStatus: '90',
            remark: this.feedbackForm.remark,
            cnFullId: this.examObject.cnFullId,
            id: this.examObject.id
          })
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.handleFilter()
          }
          // console.log('拒绝操作====》', res)
        } catch (error) {
          console.log(error)
        }
        this.examDialogVisible = false
      } else {
        this.$message({
          type: 'warning',
          message: '请输入审核反馈内容'
        })
      }
    },

    async passClick() {
      this.examDialogVisible = false
      try {
        const res = await reqOptionExam({
          audtStatus: '10',
          remark: this.feedbackForm.remark,
          cnFullId: this.examObject.cnFullId,
          id: this.examObject.id
        })
        if (res.code === 'ACK') {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.handleFilter()
        }
        // console.log('通过操作====》', res)
      } catch (error) {
        console.log(error)
      }
      this.examDialogVisible = false
    },

    // 点击下载附件
    // downLoadFile(file) {
    //   console.log('file', file)
    //   reqDownLoadFiles(file.id).then((res) => {
    //     this.download(res.data, file.fileName)
    //     console.log('xiazai', res.data, file.fileName)
    //   })
    // },
    // download(data, filename) {
    //   if (!data) {
    //     return
    //   }
    //   const url = window.URL.createObjectURL(new Blob([data]))
    //   const link = document.createElement('a')
    //   link.style.display = 'none'
    //   link.href = url
    //   link.setAttribute('download', filename)

    //   document.body.appendChild(link)
    //   link.click()
    // },
    downLoadFile(file) {
      console.log('文件', file)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      reqDownLoadFiles(file.id)
        .then((res) => {
          console.log('下载文件', res)
          loading.close()
          downloadFile(res.data, file.fileName, res.data.type)
          this.$message({
            type: 'success',
            message: '下载成功!'
          })
        })
        .catch(() => {
          loading.close()
          this.$message({
            type: 'error',
            message: '下载失败!'
          })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.query_inline_form {
  height: 30px;
}

.top_card {
  margin: 8px 0px 24px 0px;
}

.bottom_card {
  margin-bottom: 20px;
}

.outer_box {
  padding: 0;
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  list-style: none;
}

.item_label {
  width: 100px;
  padding-left: 10px;
  background-color: #f6f7fb;
  box-sizing: border-box;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}

.item_value {
  flex: 1;
  padding-left: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  // white-space: pre-line;
  // word-wrap: break-word;
  // word-break: break-all;
  // // overflow: hidden;
}

.insti_name_box {
  display: flex;
}
.insti_name {
  // width: 80px;
  height: 20px;
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  line-height: 34px;
  color: #333333;
  opacity: 1;
  margin-bottom: 26px;
}

.feedback {
  // width: 72px;
  height: 24px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 24px;
  color: #303030;
  opacity: 1;
  margin: 40px 0px 20px 0px;
  border-left: 4px solid #2c76d1;
  padding-left: 10px;
}

.dialog_footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.bt_btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

::v-deep .reference_file.el-button.el-button--default {
  height: 20px;
  line-height: 8px;
  padding: 0px;
  border: none;
  color: #2c76d1;
  font-size: 15px;
}

::v-deep .el-textarea__inner {
  resize: none;
}

::v-deep .el-range-editor.el-input__inner {
  width: 400px;
  height: 30px;
}
::v-deep .el-button.is-disabled,
.el-button.is-disabled:hover,
.el-button.is-disabled:focus {
  color: #fff;
}

.el-form-item.el-form-item--medium ::v-deep .el-form-item__content {
  display: flex;
}

::v-deep .el-input.fixed_width .el-input__inner {
  width: 400px;
}
.form_style {
  height: 60px;
}
</style>
