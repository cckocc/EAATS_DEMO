<template>
  <div>
    <div class="main">
      <div class="font-header">常见问题列表</div>
      <div class="header">
        <div class="header-left">
          <el-input
            v-model.trim="input"
            v-limitBytes="300"
            placeholder="请输入关键字"
            class="left-input"
            clearable
          />
          <el-button
            type="primary"
            class="left-btn"
            @click="onSearch"
          >筛选</el-button>
        </div>
        <div class="header-right">
          <el-button
            type="primary"
            icon="el-icon-circle-plus el-icon--right"
            class="btn"
            @click="onOperate('add')"
          >新增</el-button>
        </div>
      </div>
      <div class="body">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%"
          border
          highlight-current-row
          :header-row-style="{height: '42px'}"
          :header-cell-style="{padding: 0}"
          :row-style="{height: '42px'}"
          :cell-style="{padding: 0}"
        >
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="标题"
            min-width="270"
          />
          <el-table-column
            show-overflow-tooltip
            prop="type"
            label="问题类型"
            min-width="120"
          />
          <el-table-column
            show-overflow-tooltip
            prop="content"
            label="内容"
            min-width="200"
          />
          <el-table-column
            show-overflow-tooltip
            prop="date"
            label="发布时间"
            min-width="150"
          />
          <el-table-column
            show-overflow-tooltip
            prop="people"
            label="发布人"
            min-width="100"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="onOperate('view', scope.row)"
              >查看</el-button>
              <el-button
                type="text"
                @click="onOperate('modify', scope.row)"
              >修改</el-button>
              <el-button
                type="text"
                @click="onOperate('delete', scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!--新增-->
      <el-dialog
        :visible.sync="dialogFormVisible"
        class="dialog"
        @close="resetForm('addForm')"
      >
        <label
          slot="title"
          class="notice-title"
        >常见问题新增</label>
        <el-form
          ref="addForm"
          :model="addForm"
          label-position="left"
          :rules="rules"
        >
          <el-form-item
            :label-width="formLabelWidth"
            prop="title"
          >
            <label slot="label">问题标题</label>
            <el-input
              v-model="addForm.title"
              v-limitBytes="300"
              autocomplete="off"
              style="width:309px"
            />
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            prop="type"
          >
            <label slot="label">问题类型</label>
            <el-select
              v-model="addForm.type"
              multiple
              placeholder="--请选择--"
              style="width:309px"
            >
              <el-option
                label="服务开通"
                value="服务开通"
              />
              <el-option
                label="验收测试"
                value="验收测试"
              />
              <el-option
                label="生产问题"
                value="生产问题"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="问题内容"
            class="tiny-item"
            :label-width="formLabelWidth"
            prop="content"
          >
            <tinymce
              ref="addTiny"
              v-model="addForm.content"
              :height="300"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <div class="footer-content">
            <el-button
              v-preventReClick
              type="primary"
              @click="onOperate('submitAdd')"
            >发 布</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <!--查看-->
      <el-dialog
        :visible.sync="dialogViewVisible"
        class="dialog"
      >
        <label
          slot="title"
          class="notice-title"
        >常见问题查看</label>
        <el-form
          :model="form"
          label-position="left"
        >
          <el-form-item :label-width="formLabelWidth">
            <label slot="label">问题标题</label>
            <el-input
              v-model="form.title"
              autocomplete="off"
              style="width:309px;"
              maxlength="100"
              disabled
            />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <label slot="label">问题类型</label>
            <el-select
              v-model="form.type"
              multiple
              placeholder="--请选择--"
              style="width:309px;"
              disabled
            >
              <el-option
                label="服务开通"
                value="1"
              />
              <el-option
                label="验收测试"
                value="2"
              />
              <el-option
                label="生产问题"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="问题内容"
            class="tiny-item"
            :label-width="formLabelWidth"
          >
            <tinymce
              ref="viewTiny"
              v-model="form.content"
              :read-only="true"
              :height="300"
            />
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--修改-->
      <el-dialog
        :visible.sync="dialogModifyVisible"
        class="dialog"
      >
        <label
          slot="title"
          class="notice-title"
        >常见问题修改</label>
        <el-form
          ref="updateForm"
          :model="form"
          label-position="left"
          :rules="rules"
        >
          <el-form-item
            :label-width="formLabelWidth"
            prop="title"
          >
            <label slot="label">问题标题</label>
            <el-input
              v-model="form.title"
              autocomplete="off"
              style="width:309px;"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            prop="type"
          >
            <label slot="label">问题类型</label>
            <el-select
              v-model="form.type"
              multiple
              placeholder="--请选择--"
              style="width:309px;"
            >
              <el-option
                label="服务开通"
                value="服务开通"
              />
              <el-option
                label="验收测试"
                value="验收测试"
              />
              <el-option
                label="生产问题"
                value="生产问题"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="问题内容"
            class="tiny-item"
            :label-width="formLabelWidth"
            prop="content"
          >
            <tinymce
              ref="updateTiny"
              v-model="form.content"
              :height="300"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <div class="footer-content">
            <el-button
              v-preventReClick
              type="primary"
              @click="onOperate('submitModify')"
            >发 布</el-button>
            <el-button @click="dialogModifyVisible = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { isNull } from '@/utils/index.js'
import {
  addQuestion,
  fetchQuestionList,
  modifyQuestion,
  deleteQuestion,
  viewQuestion
} from '@/api/faq'
export default {
  name: 'MemberManage',
  components: {
    Tinymce
  },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '该项必填，请补充', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '该项必填，请补充', trigger: 'change' }
        ],
        content: [
          { required: true, message: '该项必填，请补充', trigger: 'blur' }
        ]
      },
      totalRecords: 0,
      currentPage: 1,
      pageList: [20, 50, 100],
      pageSize: 20,
      dialogFormVisible: false,
      dialogViewVisible: false,
      dialogModifyVisible: false,
      addForm: {
        title: '',
        type: [],
        content: '',
        id: ''
      },
      form: {
        title: '',
        type: [],
        content: '',
        id: ''
      },
      formLabelWidth: '100px',
      value: '',
      input: '',
      fileinput: '',
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.fetchData()
    },
    onSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    submitUpload() {
      console.log('Tijiao')
    },
    fetchData() {
      const params = {
        keywords: this.input,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      fetchQuestionList(params).then(response => {
        if (response.code === 'ACK') {
          this.totalRecords = response.data.totalRecord
        }
        if (!isNull(response.data.list)) {
          this.tableData = []
          for (var item in response.data.list) {
            this.totalRecords = response.data.totalRecord
            let content = response.data.list[item].questContent
            content = content.replace(/&lt;/g, '<')
            content = content.replace(/&gt;/g, '>')
            content = content.replace(/&nbsp;/g, ' ')
            content = content.replace(/&amp;/g, '&')
            // content = content.replace(/&/g, '/')
            // content = content.replace(/&quot;/g, '"')
            content = content.replace(/&copy;/g, '©')
            var tempItem = {
              title: response.data.list[item].questTitle,
              type: response.data.list[item].questType,
              content: content,
              date: response.data.list[item].createTs,
              people: response.data.list[item].publishUserName,
              id: response.data.list[item].id
            }
            this.tableData.push(tempItem)
          }
        }
      })
    },
    onOperate(type, row) {
      if (type === 'view') {
        // 查看问题
        this.dialogViewVisible = true
        try {
          if (this.$refs.viewTiny) {
            this.$refs.viewTiny.setContent('')
          }
        } catch (e) {
          console.log(e)
        }
        this.form.id = row.id
        viewQuestion(this.form.id).then(response => {
          this.form.title = response.data.questTitle
          this.form.type = response.data.questType.split('、')
          this.form.content = response.data.questContentText
          let html = this.form.content
          html = html.replace(/&lt;/g, '<')
          html = html.replace(/&gt;/g, '>')
          html = html.replace(/&nbsp;/g, ' ')
          html = html.replace(/&amp;/g, '&')
          // html = html.replace(/&/g, '/')
          // html = html.replace(/&quot;/g, '"')
          html = html.replace(/&copy;/g, '©')
          try {
            if (this.$refs.viewTiny) {
              this.$refs.viewTiny.setContent(html)
            }
          } catch (e) {
            console.log(e)
          }
        })
      } else if (type === 'modify') {
        this.dialogModifyVisible = true
        this.form.id = row.id
        viewQuestion(this.form.id).then(response => {
          this.form.title = response.data.questTitle
          this.form.type = response.data.questType.split('、')
          this.form.content = response.data.questContentText
          let html = this.form.content
          html = html.replace(/&lt;/g, '<')
          html = html.replace(/&gt;/g, '>')
          html = html.replace(/&nbsp;/g, ' ')
          html = html.replace(/&amp;/g, '&')
          // html = html.replace(/&/g, '/')
          // html = html.replace(/&quot;/g, '"')
          html = html.replace(/&copy;/g, '©')
          try {
            if (this.$refs.updateTiny) {
              this.$refs.updateTiny.setContent(html)
            }
          } catch (e) {
            console.log(e)
          }
        })
        // let html = this.form.content
        // html = html.replace(/&lt;/g, '<')
        // html = html.replace(/&gt;/g, '>')
        // try {
        //   if (this.$refs.updateTiny) {
        //     this.$refs.updateTiny.setContent(html)
        //   }
        // } catch (e) {
        //   console.log(e)
        // }
      } else if (type === 'submitModify') {
        // 提交修改
        this.$refs['updateForm'].validate(valid => {
          if (valid) {
            var temp = this.form.type.join('、')
            const params = {
              id: this.form.id,
              questTile: this.form.title,
              questType: temp,
              questContentText: this.form.content
            }
            modifyQuestion(params).then(response => {
              this.dialogModifyVisible = false
              this.fetchData()
            })
          }
        })
      } else if (type === 'delete') {
        // 删除问题
        this.form.id = row.id
        deleteQuestion(this.form.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      } else if (type === 'add') {
        this.dialogFormVisible = true
        this.resetForm('addForm')
        try {
          if (this.$refs.addTiny) {
            this.$refs.addTiny.setContent('')
          }
        } catch (e) {
          console.log(e)
        }
      } else if (type === 'submitAdd') {
        // 提交新增
        this.$refs['addForm'].validate(valid => {
          if (valid) {
            var temp = this.addForm.type.join('、')
            const params = {
              questTile: this.addForm.title,
              questType: temp,
              questContentText: this.addForm.content
            }
            addQuestion(params).then(response => {
              this.dialogFormVisible = false
              this.fetchData()
            })
          } else {
            console.log('error')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1196px;

.main {
  display: flex;
  flex-direction: column;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;

  .font-header {
    padding: 0 0 15px 10px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
  }

  .header {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-bottom: none;
    padding: 17px 20px 15px 11px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;

      .left-input {
        width: 300px;
      }

      .left-btn {
        margin-left: 20px;
        height: 30px;
        padding: 5px 10px;
      }
    }

    .btn {
      height: 30px;
      padding: 5px;
      ::v-deep span {
        margin-right: 5px;
      }
    }
  }

  .body {
    background: rgba(255, 255, 255, 1);
    border-bottom: none;
    padding: 0 0 0 0;
    display: flex;

    ::v-deep.el-table th {
      background-color: #f6f7fb;
    }

    ::v-deep.el-table th {
      background-color: #f6f7fb;

      .cell {
        color: rgba(48, 48, 48, 1);
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: bold;
      }
    }
  }

  .block {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-top: none;
    padding: 20px 23px 20px 10px;
    display: flex;
    justify-content: flex-end;
  }

  .dialog {
    font-family: Microsoft YaHei;
    .notice-title {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 26px;
      color: rgba(48, 48, 48, 1);
      opacity: 1;
    }
    ::v-deep .el-form-item__label {
      font-size: 15px;
      font-weight: 400;
      color: #303030;
      label {
        font-weight: 400;
      }
    }
    .tiny-item {
      ::v-deep .el-form-item__content {
        width: 100%;
        margin-left: 0 !important;
        margin-top: 40px;
      }
    }
    ::v-deep .el-dialog__header {
      border-bottom: 1px solid rgba(209, 213, 222, 1);
      opacity: 1;
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
    }

    ::v-deep .el-dialog__footer {
      background-color: #ffffff;
    }
  }
}
</style>
