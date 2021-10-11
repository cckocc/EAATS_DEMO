<template>
  <div class="hand_send_email">
    <el-card class="top_card">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="订阅邮件类型名称">
          <el-input v-model="form.templateName" style="width:280px" />
        </el-form-item>
        <el-form-item label="更新人">
          <el-input v-model="form.lastMntOpName" style="width:280px" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" style="margin-left:30px" @click="handleFilter()">查询</el-button>
          <el-button size="mini" @click="onReset()">重置</el-button>
          <el-button size="mini" @click="cancelFun()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin:15px 0px 20px 0px">
      <el-button type="primary" @click="newAddType()">
        <img src="~@/assets/style/sub_temp.svg" style="vertical-align: bottom;" alt="">
        新建订阅邮件类型模板
      </el-button>

      <el-table
        v-loading="templateStatus"
        :header-cell-style="{background:'#F6F7FB',color:'#606266'}"
        :data="emailTempleteData"
        style="width: 100%;margin-top:20px"
      >
        <el-table-column
          prop="templateName"
          label="邮件模板名称"
        />
        <el-table-column
          prop="lastMntTs"
          label="模板更新时间"
        />
        <el-table-column
          prop="lastMntOpName"
          label="操作人"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleClick(scope.row,'view')">查看</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" @click="handleClick(scope.row,'editor')">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" @click="DeleteClick(scope.row)">删除</el-button>
            <!-- <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="DeleteClick(scope.row)"
            >
              <el-button slot="reference" type="text" >删除</el-button>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="display:flex;justify-content:flex-end;margin-top:17px"
        :current-page="pageQuery.page"
        :page-sizes="[ 10,20,30,40]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getEmailTypeList, getTemplateDetialInfo, deleteEmailTemplate } from '@/api/email/email_manage'
export default {
  name: 'AutomaticallySendEmail',
  data() {
    return {
      form: {
        templateName: '',
        lastMntOpName: ''
      },
      searchForm: {
        templateName: '',
        lastMntOpName: ''
      },
      // 邮件订阅模板表格数据
      emailTempleteData: [],
      templateStatus: false,
      // 分页数据
      total: 0,
      currentPage: 1,
      pageQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 新建订阅邮件类型模板按钮
    newAddType() {
      this.$emit('newAddEmail', {
        id: 3,
        title: '新建订阅邮件类型模板'
      })
    },

    // 查询
    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.onQuery(this.searchForm)
    },
    // 查询订阅邮件类型类型模板
    async onQuery(searchForm) {
      this.templateStatus = true
      try {
        // 传参
        const res = await getEmailTypeList({ ...searchForm, ...this.pageQuery })
        if (res.code === 'ACK') {
          this.templateStatus = false
          this.emailTempleteData = res.data.list
          this.total = res.data.totalRecord
        }
      } catch (error) {
        this.templateStatus = false
        console.log(error)
      }
    },

    // 重置
    onReset() {
      this.form.templateName = ''
      this.form.lastMntOpName = ''
      this.handleFilter()
    },

    cancelFun() {
      this.$emit('newAddEmail', { id: 5, title: '订阅模板类型通知取消' })
    },

    // 查看
    handleClick(row, str) {
      this.$store.dispatch('email/getComponentInfo', {
        key: 'theme',
        value: row
      })
      getTemplateDetialInfo(row).then(res => {
        if (res.code === 'ACK') {
          this.$emit('newAddEmail', {
            id: 3,
            title: '新建订阅邮件类型模板',
            from: str,
            param: res.data
          })
        } else {
          console.log('查看模板详细信息--失败')
        }
      })
    },
    async DeleteClick(row) {
      this.$confirm('确定删除吗？', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteEmailTemplate(row).then(res => {
          if (res.code === 'ACK') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handleFilter()
          }
        // console.log(res)
        })
      })
    },

    // 分页参数方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-card.top_card ::v-deep .el-card__body{
  padding: 20px 20px 0px 20px;
}
</style>
