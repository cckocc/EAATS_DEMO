<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="networkForm"
          label-position="top"
          :model="networkForm"
          inline
        >
          <el-form-item label="服务单号">
            <el-input
              v-model="networkForm.applyOrdNo"
              placeholder="服务单号"
              clearable
            />
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input
              v-model="networkForm.instiName"
              placeholder="机构名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="网络开通时间">
            <el-date-picker
              v-model="networkForm.openTime"
              suffix-icon="el-icon-date"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%;"
              clearable
            />
          </el-form-item>
          <el-form-item style="margin-top: 30px;">
            <el-button type="primary" @click="handleFilter()">查询</el-button>
            <el-button @click="onReset()"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button type="text" @click="outputExcel()">
              <img
                src="~@/assets/style/doc_icon.svg"
                alt=""
                style="vertical-align: middle"
              >
              导出Excel</el-button>
            <!-- <el-button type="text" @click="quicklyOutput()">
              <img
                src="~@/assets/style/doc_icon.svg"
                alt=""
                style="vertical-align: middle"
              >
              快速导出</el-button> -->
          </div>
        </div>
        <div class="table">
          <el-table
            v-loading="loading"
            :data="networkdata"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
            :max-height="height"
          >
            <el-table-column prop="instiName" label="机构名称" width="180" />
            <el-table-column prop="productMarket" label="接口产品" width="180" />
            <el-table-column prop="addressOrigin" label="源地址" />
            <el-table-column prop="addressContent" label="目标地址" />
            <el-table-column prop="passingTime" label="网络开通时间" />
            <el-table-column prop="applyOrdNo" label="服务单号">
              <template slot-scope="scope">
                <span v-if="!scope.row.applyOrdNo || scope.row.applyOrdNo.indexOf('init-') > -1">{{ scope.row.applyOrdNo }}</span>
                <span
                  v-else
                  class="link-type"
                  @click="jumpToProcessCheck(scope.row)"
                >{{ scope.row.applyOrdNo }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="pageQuery.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reqQueryNetwork,
  reqExportExcel
} from '@/api/statisticalQuery/statistic'
import { downloadFile } from '@/utils'
import checkPermission from '@/utils/permission'

export default {
  name: 'NetworkOpeningComponent',
  data() {
    return {
      height: 200,
      networkForm: {
        applyOrdNo: '',
        instiName: '',
        openTime: null,
        startTime: '',
        endTime: ''
      },
      searchForm: {
        applyOrdNo: '',
        instiName: '',
        openTime: null,
        startTime: '',
        endTime: ''
      },

      loading: false,
      networkdata: [],

      total: 0,
      pageQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.handleFilter()
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$root.$el.clientHeight - 300
    })
  },
  methods: {
    checkPermission,
    // 点击服务单号跳转到流程查看页面
    jumpToProcessCheck(row) {
      if (!this.checkPermission(['GRIP_processView']) || !this.checkPermission(['GRIP_processView_search'])) {
        this.$message({
          type: 'info',
          message: `您没有查看申请单的权限`
        })
        return
      }
      console.log('row', row)
      this.$router.push({
        name: 'ProcessView',
        params: {
          tabActiveName: 'allList',
          searchObj: {
            subApplyId: row.applyOrdNo
          },
          institutionType: this.menuInstType
        }
      })
    },
    // 查询
    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.networkForm))
      this.onQuery(this.searchForm)
    },
    async onQuery(networkForm) {
      console.log('打印networkForm', networkForm)
      this.loading = true
      reqQueryNetwork({
        applyOrdNo: this.networkForm.applyOrdNo,
        instiName: this.networkForm.instiName,
        startTime: this.searchForm.openTime ? this.searchForm.openTime[0] : '',
        endTime: this.searchForm.openTime ? this.searchForm.openTime[1] : '',
        institutionType: '10',
        ...this.pageQuery
      })
        .then((res) => {
          if (res.code === 'ACK') {
            // this.$message({
            //   type: 'success',
            //   message: res.message,
            // })
            this.networkdata = res.data.list
            this.total = res.data.totalRecord
            this.loading = false
          }
          console.log('查询network结果', res)
        })
        .catch((err) => {
          this.networkdata = []
          this.total = 0
          this.loading = false
          console.log(err)
        })
    },

    // 重置
    onReset() {
      Object.keys(this.networkForm).forEach((item) => {
        this.networkForm[item] = ''
      })
      this.handleFilter()
    },

    // 快速导出
    quicklyOutput() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        applyOrdNo: this.networkForm.applyOrdNo,
        instiName: this.networkForm.instiName,
        startTime: this.searchForm.openTime ? this.searchForm.openTime[0] : '',
        endTime: this.searchForm.openTime ? this.searchForm.openTime[1] : '',
        institutionType: '10',
        isQuick: 1
      }
      reqExportExcel(params).then(res => {
        if (res.status === 200) {
          loading.close()
          const name = '网络开通' + '.xlsx'
          downloadFile(res.data, name)
        } else {
          loading.close()
          this.$message.error('下载失败!')
        }
      })
    },
    // 导出
    outputExcel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        applyOrdNo: this.networkForm.applyOrdNo,
        instiName: this.networkForm.instiName,
        startTime: this.searchForm.openTime ? this.searchForm.openTime[0] : '',
        endTime: this.searchForm.openTime ? this.searchForm.openTime[1] : '',
        institutionType: '10',
        isQuick: 0
      }
      reqExportExcel(params).then(res => {
        if (res.status === 200) {
          loading.close()
          const name = '网络开通' + '.xlsx'
          downloadFile(res.data, name)
        } else {
          loading.close()
          this.$message.warning('请使用快速导出')
        }
      })
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (
        JSON.stringify(this.searchForm) === JSON.stringify(this.networkForm)
      ) {
        this.onQuery(this.networkForm)
      } else {
        this.networkForm = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (
        JSON.stringify(this.searchForm) === JSON.stringify(this.networkForm)
      ) {
        this.onQuery(this.networkForm)
      } else {
        this.networkForm = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
