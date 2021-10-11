<template>
  <!-- 自动邮件列表页面 -->
  <div class="hand_send_email">
    <el-card>
      <el-form ref="form" :model="form" label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="邮件模板名称">
              <el-input v-model="form.emailName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模板状态">
              <el-select
                v-model="form.sendStatus"
                clearable
                placeholder="-- 请选择 --"
              >
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input v-model="form.lastMntOpName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              style="margin-left: 37px"
              @click="handleFilter()"
              >查询</el-button
            >
            <el-button @click="onReset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin: 15px 0px">
      <el-button type="primary" @click="linkNotice">
        <img
          src="~@/assets/style/email_noti.svg"
          style="vertical-align: middle"
          alt=""
        />
        新建邮件通知
      </el-button>

      <el-table
        v-loading="handSendStatus"
        :data="handSendTempleteData"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column fixed prop="emailName" label="邮件模板名称" />
        <el-table-column prop="lastMntTs" label="更新时间" />
        <el-table-column prop="sendStatus" label="状态">
          <template slot-scope="scope">
            <div>
              <!-- <el-button v-if="scope.row.status" type="text" @click="openModifyDialog(scope.row.accepterId,scope.row.id,scope.row.formId)">{{ scope.row.accepter }} -->
              <el-button v-if="scope.row.sendStatus === '30'" type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="" />
                已保存
              </el-button>
              <el-button v-else-if="scope.row.sendStatus === '40'" type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="" />
                已生效
              </el-button>
              <el-button v-else-if="scope.row.sendStatus === '50'" type="text">
                <img src="~@/assets/style/nonpassing.svg" alt="" />
                禁用
              </el-button>
              <el-button v-else type="text"> 暂无 </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastMntOpName" label="操作人">
          <template slot-scope="scope">
            <span v-if="scope.row.lastMntOpName">{{
              scope.row.lastMntOpName
            }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="checkClick(scope.row, 'view')"
              >查看</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              type="text"
              :disabled="scope.row.sendStatus === '50'"
              @click="checkClick(scope.row, 'editor')"
              >编辑</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              v-if="scope.row.sendStatus === '30'"
              type="text"
              @click="disabledUse(scope.row, 50)"
              >禁用</el-button
            >
            <el-button
              v-else-if="scope.row.sendStatus === '40'"
              type="text"
              @click="disabledUse(scope.row, 50)"
              >禁用</el-button
            >
            <el-button
              v-else-if="scope.row.sendStatus === '50'"
              type="text"
              @click="disabledUse(scope.row, 30)"
              >激活</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="display: flex; justify-content: flex-end; margin-top: 17px"
        :current-page="pageForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { reqDisActEmail, getAutoEmalList } from '@/api/email/email_manage'
export default {
  name: 'AutomaticallySendEmail',
  data() {
    return {
      // 区分查询和列表，form存储前端缓存的数据，避免输入数据未点击查询直接下一页的情况
      handSendStatus: false,
      form: {
        // 后期需要根据后台接口返回修改的数据：
        emailName: '',
        sendStatus: '',
        lastMntOpid: '',
        emailType: '2',
      },
      searchForm: {
        emailName: '',
        sendStatus: '',
        lastMntOpid: '',
        emailType: '2',
      },
      pageForm: {
        pageSize: 0,
        page: 1,
      },
      total: 0,
      // 邮件状态列表
      statusList: [
        { value: '30', label: '已保存' },
        { value: '40', label: '已生效' },
        { value: '50', label: '禁用' },
      ],
      // 手动发送邮件  列表数据
      handSendTempleteData: [],
    }
  },
  created() {
    // 调用列表接口加载初始列表
    this.handleFilter()
  },
  methods: {
    linkNotice() {
      this.$emit('newAddEmail', {
        id: 1,
        from: 'add',
        title: '新建邮件通知',
      })
    },
    // 查询
    handleFilter() {
      this.pageForm.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.handSendStatus = true
      try {
        // 传参
        const res = await getAutoEmalList({ ...searchForm, ...this.pageForm })
        if (res.code === 'ACK') {
          this.handSendStatus = false
          this.handSendTempleteData = res.data.list
          this.total = res.data.totalRecord
        }
      } catch (error) {
        this.handSendStatus = false
        console.log(error)
      }
    },
    // 重置
    onReset() {
      this.form.emailName = ''
      this.form.sendStatus = ''
      this.form.lastMntOpName = ''
      this.handleFilter()
    },
    checkClick(scope, str) {
      this.$emit('newAddEmail', {
        id: 1,
        title: '查看自动邮件通知',
        type: 'auto',
        from: str,
        data: scope,
      })
    },
    editPage(scope) {
      console.log('编辑', scope)
    },
    async disabledUse(scope, numTotal) {
      try {
        const res = await reqDisActEmail({ ...scope, sendStatus: numTotal })
        const { code, message } = res
        if (code === 'ACK') {
          this.$message({
            type: 'success',
            message: message,
          })
          this.handleFilter()
        }
      } catch (error) {
        console.log('error========>', error)
      }
    },
    sendDetail(scope) {
      console.log('查看详情', scope)
    },
    // 分页参数方法
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageForm.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hand_send_email {
  .el-range-editor--medium.el-input__inner {
    width: 281px;
    // height: 30px;
  }

  .el-input .el-input__inner {
    width: 300px;
  }

  .el-button.el-button--default {
    color: #000;
  }

  .el-select > .el-input {
    width: 300px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
