<template>
  <!-- 手动发送邮件 -->
  <div class="hand_send_email">
    <el-card>
      <el-form ref="form" :model="form" label-width="110px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="邮件模板名称">
              <el-input v-model="form.emailName" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="邮件状态">
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
          <el-col :span="7">
            <el-form-item label="操作人">
              <el-input v-model="form.lastMntOpName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="邮件发送时间">
              <el-date-picker
                v-model="form.sendTime"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="-- 起始时间 --"
                end-placeholder="-- 结束时间 --"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订阅邮件类型">
              <el-select
                v-model="form.subscriptionId"
                clearable
                placeholder="--请选择--"
              >
                <el-option
                  v-for="item in emailTypeList"
                  :key="item.templateId"
                  :label="item.templateName"
                  :value="item.templateId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <!-- <el-form-item> -->
            <el-button
              type="primary"
              style="margin-left: 37px"
              @click="handleFilter()"
              >查询</el-button
            >
            <el-button @click="onReset()">重置</el-button>
            <!-- </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin: 20px 0px">
      <div style="background-color: transparent; height: 20px" />
      <el-button type="primary" @click="newEmailNotice">
        <img
          src="~@/assets/style/email_noti.svg"
          style="vertical-align: middle"
          alt=""
        />
        新建邮件通知
      </el-button>
      <el-button type="primary" @click="newAddEmail">
        <img
          src="~@/assets/style/email_templete.svg"
          style="vertical-align: middle"
          alt=""
        />
        订阅邮件类型维护
      </el-button>

      <el-table
        v-loading="handSendStatus"
        :data="handSendTempleteData"
        style="width: 100%; margin-top: 20px"
        :header-cell-style="{ background: '#F6F7FB', color: '#606266' }"
      >
        <el-table-column
          fixed
          prop="emailName"
          label="邮件模板名称"
          width="300"
        />
        <el-table-column
          prop="subscriptionEmailType"
          label="订阅邮件类型"
          width="182"
        >
          <template slot-scope="scope">
            {{
              scope.row.subscriptionEmailType
                ? scope.row.subscriptionEmailType
                : '无'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="邮件发送时间" width="196">
          <template slot-scope="scope">
            <span>{{ scope.row.sendTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendStatus" label="邮件状态" width="182">
          <template slot-scope="scope">
            <div>
              <!-- <el-button v-if="scope.row.status" type="text" @click="openModifyDialog(scope.row.accepterId,scope.row.id,scope.row.formId)">{{ scope.row.accepter }} -->
              <el-button v-if="scope.row.sendStatus === '10'" type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="" />
                已发送
              </el-button>
              <el-button v-else-if="scope.row.sendStatus === '20'" type="text">
                <img src="~@/assets/style/nonpass_icon.svg" alt="" />
                待发送
              </el-button>
              <el-button v-else type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="" />
                已保存
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastMntOpName" label="操作人" width="124" />
        <el-table-column fixed="right" label="操作" width="174" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="checkClick(scope.row, 'view')"
              >查看</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              :disabled="scope.row.sendStatus === '10'"
              type="text"
              @click="checkClick(scope.row, 'editor')"
              >编辑</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              :disabled="scope.row.sendStatus !== '10'"
              type="text"
              @click="openSendDetailDialog(scope.row)"
              >发送详情</el-button
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
    <!-- 查看发送详情列表 -->
    <el-dialog
      title="发送详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1043px"
    >
      <component :is="bindComponent" ref="viewSendDetail" />
    </el-dialog>
  </div>
</template>

<script>
import { getAutoEmalList, getTemplateList } from '@/api/email/email_manage'
export default {
  name: 'HandSendEmail',
  components: {
    SendDetail: () => import('./sendDetail'),
  },
  data() {
    return {
      emailTypeList: [],
      handSendStatus: false,
      form: {
        // 后期需要根据后台接口返回修改的数据：
        emailName: '',
        sendStatus: '',
        lastMntOpName: '',
        sendTime: [],
        startTime: '',
        endTime: '',
        emailType: '1',
        subscriptionId: '',
      },
      searchForm: {
        emailName: '',
        sendStatus: '',
        lastMntOpName: '',
        sendTime: [],
        startTime: '',
        endTime: '',
        emailType: '1',
        subscriptionId: '',
      },
      total: 0,
      pageForm: {
        pageSize: 0,
        page: 1,
      },
      // 邮件状态列表
      statusList: [
        { value: '30', label: '已保存' },
        { value: '10', label: '已发送' },
        { value: '20', label: '待发送' },
      ],
      // 手动发送邮件
      handSendTempleteData: [],

      // 发送详情对话框
      dialogVisible: false,

      // 动态组件
      bindComponent: 'SendDetail',
    }
  },
  created() {
    this.getTemplateTyep()
    this.handleFilter()
  },
  methods: {
    getTemplateTyep() {
      getTemplateList()
        .then((res) => {
          const { code, data } = res
          if (code === 'ACK') {
            this.emailTypeList = data.concat([
              { templateId: 0, templateName: '无' },
            ])
          }
        })
        .catch()
    },
    // 查询
    handleFilter() {
      this.pageForm.page = 1
      // 时间选择赋值
      if (this.form.sendTime && this.form.sendTime.length > 0) {
        this.form.startTime = this.form.sendTime[0]
        this.form.endTime = this.form.sendTime[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
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
      this.form.sendTime = []
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.subscriptionId = ''
      this.handleFilter()
    },

    // 查看按钮
    checkClick(row, str) {
      this.$emit('newAddEmail', {
        id: 4,
        title: '手动发送邮件查看',
        type: 'hand',
        from: str,
        data: row,
      })
    },

    // 编辑按钮
    editPage() {
      console.log('编辑')
    },

    // 发送详情对话框
    openSendDetailDialog(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        console.log('assad', this.$refs.viewSendDetail)
        this.$refs.viewSendDetail.routerCreated(row)
      })
    },
    newAddEmail() {
      this.$emit('newAddEmail', {
        id: 2,
        title: '订阅模板类模板维护',
      })
    },

    newEmailNotice() {
      this.$emit('newAddEmail', {
        id: 4,
        from: 'add',
        type: 'hand',
        title: '新建邮件通知',
      })
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
}

.hand_send_email .el-range-editor--medium.el-input__inner {
  width: 380px;
  height: 30px;
}

.hand_send_email ::v-deep .el-table__fixed {
  height: 100% !important;
}
</style>
