<template>
  <!-- 评分统计查询 -->
  <div class="score_statistics_query">
    <!-- Score statistics query评分统计查询 -->
    <el-card class="box-card">
      <el-form ref="form" :model="queryScore">
        <el-row>
          <el-col :span="8">
            <el-form-item label="接口名称">
              <el-input v-model="queryScore.portName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请机构">
              <el-input v-model="queryScore.instn" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人">
              <el-input v-model="queryScore.userName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="验收人">
              <el-input v-model="queryScore.accepter" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="反馈日期">
              <el-date-picker
                v-model="queryScore.feedbackDate"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="onQuery">查询</el-button>
              <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        v-loading="load"
        :data="interfaceTable"
        border
        style="width: 100%"
      >
        <el-table-column prop="interfaceType" label="接口类型" />
        <el-table-column prop="instn" label="申请机构" />
        <el-table-column prop="applyName" label="申请人" />
        <el-table-column prop="accepter" label="验收人" />
        <el-table-column prop="date" label="反馈日期" />
        <el-table-column prop="scoreAmount" label="评分总计" />
        <el-table-column prop="options" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleClick(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="display: flex; justify-content: flex-end; margin-top: 17px"
        :current-page="queryScore.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryScore.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getScoreAndBookingList } from '@/api/acceptance/resourceController'
export default {
  name: 'ScoreStatisticsQuery',
  data() {
    return {
      load: false,
      queryScore: {
        accepter: '',
        endDate: '',
        instn: '',
        page: 1,
        pageSize: 10,
        portName: '',
        startDate: '',
        userName: '',
        feedbackDate: [],
      },
      total: 0,
      interfaceTable: [],
    }
  },

  methods: {
    // 跳转该页面方法
    routerLinkCreated() {
      this.handleFilter()
    },
    async onQuery() {
      this.load = true
      try {
        if (this.queryScore.feedbackDate.length > 0) {
          this.queryScore.startDate = this.feedbackDate[0]
          this.queryScore.endDate = this.feedbackDate[1]
        }
        const res = await getScoreAndBookingList(this.queryScore)
        console.log('预约量及评分统计详细', res)
        if (res.code === 'ACK') {
          this.interfaceTable = res.data.list
          this.total = res.data.totalRecord
          // this.pageMeg.total = res.data.totalRecord
        }
        this.load = false
      } catch (error) {
        this.load = false
        console.log(error)
      }
    },
    onReset() {
      Object.keys(this.queryScore).forEach((item) => {
        if (typeof this.queryScore[item] === 'string')
          this.queryScore[item] = ''
        if (
          typeof this.queryScore[item] === 'object' &&
          Array.isArray(this.queryScore[item])
        )
          this.queryScore[item] = []
        if (
          Object.prototype.toString.call(this.queryScore[item]) ===
            '[object object]' &&
          Array.isArray(this.queryScore[item])
        )
          this.queryScore[item] = {}
        if (item === 'page') this.queryScore[item] = 1
        if (item === 'pageSize') this.queryScore[item] = 10
      })
      console.log('重置信息', this.queryScore)
    },
    handleClick(scope) {
      console.log('scope.row', scope.row)
    },
    handleSizeChange(val) {
      this.queryScore.pageSize = val
      this.onQuery()
    },
    handleCurrentChange(val) {
      this.queryScore.page = val
      this.onQuery()
    },
    handleFilter() {
      this.queryScore.page = 1
      this.onQuery()
    },
  },
}
</script>

<style lang='scss' scoped>
.box-card {
  margin-bottom: 20px;

  .el-form ::v-deep .el-input {
    width: 180px;
  }

  .el-form ::v-deep .el-date-picker {
    width: 200px;
  }

  .el-form ::v-deep .el-button {
    border-radius: 5px;
    background-color: #2c76d1;
  }
}
</style>
