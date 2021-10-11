<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="AlternateQueryForm"
          label-position="top"
          :model="AlternateQueryForm"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="接口名称">
                <el-input
                  v-model="AlternateQueryForm.dimensionName"
                  class="fixed_width"
                  placeholder="请输入接口名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机构名称">
                <el-input
                  v-model="AlternateQueryForm.instiName"
                  class="fixed_width"
                  placeholder="请输入机构名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提交日期">
                <el-date-picker
                  v-model="AlternateQueryForm.submitTime"
                  suffix-icon="el-icon-date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%;"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="服务单号">
                <el-input
                  v-model="AlternateQueryForm.applyOrdNo"
                  class="fixed_width"
                  placeholder="请输入服务单号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望验收日期">
                <el-date-picker
                  v-model="AlternateQueryForm.expectedDate"
                  suffix-icon="el-icon-date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%;"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最早可选验收日期">
                <el-date-picker
                  v-model="AlternateQueryForm.earliestOptionalDate"
                  suffix-icon="el-icon-date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%;"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="实际验收日期">
                <el-date-picker
                  v-model="AlternateQueryForm.actualDate"
                  suffix-icon="el-icon-date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%;"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-top: 30px;">
                <el-button type="primary" @click="handleFilter()">查询</el-button>
                <el-button @click="onReset()"> 重置 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
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
            :data="tableData"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
            :max-height="height"
          >
            <el-table-column prop="instnName" label="机构名称" />
            <el-table-column prop="dimensionName" label="接口名称" width="200" />
            <el-table-column prop="subApplyNo" label="服务单号" width="200">
              <template slot-scope="scope">
                <span v-if="!scope.row.subApplyNo || scope.row.subApplyNo.indexOf('init-') > -1">{{ scope.row.subApplyNo }}</span>
                <span
                  v-else
                  class="link-type"
                  @click="jumpToProcessCheck(scope.row)"
                >{{ scope.row.subApplyNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="submitTime"
              label="申请单提交日期"
              width="130"
            />
            <el-table-column
              width="110"
              prop="expectedDate"
              label="期望验收日期"
            />
            <el-table-column
              width="140"
              prop="earliestOptionalDate"
              label="最早可选验收日期"
            />
            <el-table-column prop="actualDate" label="实际验收日期" width="110" />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pagesizes"
            :page-size="pageSize"
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
  reqAlternateQueryResult,
  reqExportAlternate
} from '@/api/statisticalQuery/statistic'
import checkPermission from '@/utils/permission'
import { downloadFile } from '@/utils'

export default {
  name: 'AlternateQuery',
  data() {
    return {
      height: 200,
      AlternateQueryForm: {
        dimensionName: '',
        instiName: '',
        submitTime: null,
        submitStartTime: '',
        submitEndTime: '',
        applyOrdNo: '',
        expectedDate: null,
        expectStartTime: '',
        expectEndTime: '',
        earliestOptionalDate: null,
        optionalStartTime: '',
        optionalEndTime: '',
        actualDate: null,
        actualStartTime: '',
        actualEndTime: ''
      },
      searchForm: {
        dimensionName: '',
        instiName: '',
        submitTime: null,
        submitStartTime: '',
        submitEndTime: '',
        applyOrdNo: '',
        expectedDate: null,
        expectStartTime: '',
        expectEndTime: '',
        earliestOptionalDate: null,
        optionalStartTime: '',
        optionalEndTime: '',
        actualDate: null,
        actualStartTime: '',
        actualEndTime: ''
      },
      institutionType: '', // 机构类型 00-市场机构 10-信息商

      loading: false,
      tableData: [],

      currentPage: 1,
      pageSize: 10,
      pagesizes: [10, 20, 30, 40],
      total: 0
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
      console.log('row', row)
      if (!this.checkPermission(['GRIP_processView']) || !this.checkPermission(['GRIP_processView_search'])) {
        this.$message({
          type: 'info',
          message: `您没有查看申请单的权限`
        })
        return
      }
      this.$router.push({
        name: 'ProcessView',
        params: {
          tabActiveName: 'allList',
          searchObj: {
            subApplyId: row.subApplyNo
          },
          institutionType: this.menuInstType
        }
      })
      console.log('row.subApplyNo', row.subApplyNo)
    },

    handleFilter() {
      this.currentPage = 1
      this.searchForm = JSON.parse(JSON.stringify(this.AlternateQueryForm))
      this.onQuery(this.searchForm)
    },
    async onQuery() {
      this.loading = true
      const params = {
        dimensionName: this.searchForm.dimensionName,
        instiName: this.searchForm.instiName,
        applyOrdNo: this.searchForm.applyOrdNo,
        submitStartTime: this.searchForm.submitTime ? this.searchForm.submitTime[0] : '',
        submitEndTime: this.searchForm.submitTime ? this.searchForm.submitTime[1] : '',
        expectStartTime: this.searchForm.expectedDate ? this.searchForm.expectedDate[0] : '',
        expectEndTime: this.searchForm.expectedDate ? this.searchForm.expectedDate[1] : '',
        optionalStartTime: this.searchForm.earliestOptionalDate ? this.searchForm.earliestOptionalDate[0] : '',
        optionalEndTime: this.searchForm.earliestOptionalDate ? this.searchForm.earliestOptionalDate[1] : '',
        actualStartTime: this.searchForm.actualDate ? this.searchForm.actualDate[0] : '',
        actualEndTime: this.searchForm.actualDate ? this.searchForm.actualDate[1] : '',
        instiId: '',
        institutionType: this.institutionType,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await reqAlternateQueryResult(params)
      if (res.code === 'ACK') {
        this.loading = false
        this.tableData = res.data.list
        this.total = res.data.totalRecord
      } else {
        this.loading = false
      }
      console.log('候补查询', res)
    },

    onReset() {
      Object.keys(this.AlternateQueryForm).forEach((item) => {
        if (typeof this.AlternateQueryForm[item] === 'string') {
          this.AlternateQueryForm[item] = ''
        }
        if (
          typeof this.AlternateQueryForm[item] === 'object' &&
          Array.isArray(this.AlternateQueryForm[item])
        ) {
          this.AlternateQueryForm[item] = []
        }
        if (
          Object.prototype.toString.call(this.AlternateQueryForm[item]) ===
          '[object object]'
        ) {
          this.AlternateQueryForm[item] = {}
        }
      })
      this.currentPage = 1
      this.pageSize = 10
      this.handleFilter()
    },

    // 导出EXCEL
    async outputExcel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        dimensionName: this.searchForm.dimensionName,
        instiName: this.searchForm.instiName,
        applyOrdNo: this.searchForm.applyOrdNo,
        submitStartTime: this.searchForm.submitTime ? this.searchForm.submitTime[0] : '',
        submitEndTime: this.searchForm.submitTime ? this.searchForm.submitTime[1] : '',
        expectStartTime: this.searchForm.expectedDate ? this.searchForm.expectedDate[0] : '',
        expectEndTime: this.searchForm.expectedDate ? this.searchForm.expectedDate[1] : '',
        optionalStartTime: this.searchForm.earliestOptionalDate ? this.searchForm.earliestOptionalDate[0] : '',
        optionalEndTime: this.searchForm.earliestOptionalDate ? this.searchForm.earliestOptionalDate[1] : '',
        actualStartTime: this.searchForm.earliestOptionalDate ? this.searchForm.actualDate[0] : '',
        actualEndTime: this.searchForm.earliestOptionalDate ? this.searchForm.actualDate[1] : '',
        instiId: '',
        institutionType: this.institutionType,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      reqExportAlternate(params).then(res => {
        if (res.status === 200) {
          loading.close()
          const name = '场务端候补查询' + '.xlsx'
          downloadFile(res.data, name)
        } else {
          loading.close()
          this.$message.warning('请使用快速导出')
        }
      })
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(val, 'val')
      this.pageSize = val
      this.onQuery()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.onQuery()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
