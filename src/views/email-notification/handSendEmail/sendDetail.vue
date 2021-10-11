<template>
  <!-- 发送详情按钮组件 -->
  <div class="send_detail">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="收件人邮箱">
        <el-input v-model="formInline.email" style="width:280px" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.sendStatus" clearable placeholder="-- 请选择 --" style="width:220px">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" style="margin-left:30px" @click="handleFilter()">查询</el-button>
        <el-button size="mini" @click="onReset()">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div style="display:flex;cursor: pointer;margin-bottom:10px" @click="getOutputExcel">
        <img src="~@/assets/style/doc_icon.svg" style="width:16px;height:16px;margin-right:8px" alt="">
        <span style="height:16px"> 导出Excel</span>
      </div>

      <el-table
        v-loading="detailStatus"
        :data="detailTable"
        :header-cell-style="{background:'#F6F7FB',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column
          prop="email"
          label="邮箱"
          width="200"
        />
        <el-table-column
          prop="userName"
          label="姓名"
          width="84"
        />
        <el-table-column
          prop="contactType"
          label="联系人类型"
          width="140"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.contactType === '00'">服务开通</span>
            <span v-if="scope.row.contactType === '10'">验收测试</span>
            <span v-if="scope.row.contactType === '20'">接口上线</span>
            <span v-if="scope.row.contactType === '40'">权限变更</span>
            <span v-if="scope.row.contactType === '50'">补充用户</span>
            <span v-if="scope.row.contactType === '80'">注册用户</span>
            <span v-if="scope.row.contactType === 'cw'">场务用户</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="instCnFullNm"
          label="机构"
          width="162"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.instCnFullNm !== 'cw'">{{ scope.row.instCnFullNm }}</span>
            <span v-else type="text">
              暂无机构
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNo"
          label="联系方式"
          width="160"
        />
        <el-table-column
          prop="sendStatus"
          label="状态"
          width="104"
        >
          <template slot-scope="scope">
            <div>
              <!-- <el-button v-if="scope.row.status" type="text" @click="openModifyDialog(scope.row.accepterId,scope.row.id,scope.row.formId)">{{ scope.row.accepter }} -->
              <el-button v-if="scope.row.sendStatus==='1'" type="text">
                <img src="~@/assets/style/pass_icon.svg" alt="">
                发送成功
              </el-button>
              <el-button v-else type="text">
                <img src="~@/assets/style/error_send.svg" alt="">
                发送失败
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="errorMessage"
          label="原因"
        >
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="right">
              <div slot="content" class="content_email">{{ scope.row.errorMessage }}</div>
              <span>
                {{ scope.row.errorMessage && scope.row.errorMessage.length > 20 ? scope.row.errorMessage.substring(0,20) + '...' : scope.row.errorMessage }}
              </span>
            </el-tooltip>
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
    </div>
  </div>
</template>

<script>
import { getHandEmailDetailList } from '@/api/email/email_manage'
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default {
  name: 'SendDetail',
  data() {
    return {
      formInline: {
        email: '',
        sendStatus: ''
      },
      rowInfo: {},
      searchForm: {
        email: '',
        sendStatus: ''
      },
      // 状态列表
      statusList: [
        { value: '1', label: '发送成功' },
        { value: '2', label: '发送失败' }
      ],

      // 发送详情表格数据
      detailTable: [],
      detailStatus: false,

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
    // this.email = ''
    // this.handleFilter()
    // this.sendStatus = []
  },
  methods: {
    routerCreated(row) {
      this.rowInfo = row
      this.formInline.email = ''
      this.formInline.sendStatus = ''
      this.handleFilter()
    },
    // 查询按钮
    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
    },
    // 分页参数方法
    handleSizeChange(val) {
      console.log('什么鬼啊=======》', val)
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
    onQuery(searchForm) {
      // 调用查看详细发送情况接口
      this.detailTable = []
      this.detailStatus = true
      getHandEmailDetailList({ ...this.rowInfo, ...searchForm, ...this.pageQuery }).then(res => {
        if (res.code === 'ACK') {
          this.detailTable = res.data.list
          this.total = res.data.totalRecord
          this.detailStatus = false
        } else {
          console.log('ERROR---调用查看详细发送情况接口')
        }
      }).catch(err => {
        this.detailStatus = false
        console.log(err)
      })
    },

    // 重置
    onReset() {
      this.formInline.email = ''
      this.formInline.sendStatus = ''
      this.handleFilter()
    },

    // 导出excel
    async getOutputExcel() {
      axios({
        method: 'post',
        url: `/cass/mgt/auto/email/download`,
        responseType: 'blob',
        headers: {
          'X-Auth-Token': getToken()
        },
        data: {
          ...this.rowInfo,
          ...this.searchForm,
          ...this.pageQuery
        }
      }).then((res) => {
        var name = ''
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        name = '发送详情' + '.xlsx' // 下载后文件名
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, name)
        } else {
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = name
          document.body.appendChild(downloadElement)
          downloadElement.onclick = function() {
            document.body.removeChild(downloadElement)
          }
          downloadElement.click()
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content_email{
   max-width: 1000px;
  word-wrap:break-word
}
</style>
