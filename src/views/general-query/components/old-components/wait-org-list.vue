<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          inline
        >
          <el-form-item label="机构名称">
            <el-input v-model="mainObj.searchForm.agencyName" placeholder="请输入" clearable />
          </el-form-item>
          <!-- <el-form-item label="机构类型">
            <el-select
              v-model="mainObj.searchForm.infoFlag"
              placeholder="--全部--"
              clearable
            >
              <el-option
                label="市场机构"
                :value="false"
              />
              <el-option
                label="信息商"
                :value="true"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >查询</el-button>
            <el-button size="mini" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              @click="onOperate('dealMultiple')"
            >处理</el-button>
            <el-button
              type="primary"
              @click="onOperate('dealAll')"
            >一键处理</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="tableRef"
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              show-overflow-tooltip
              prop="agencyName"
              label="机构名称"
              min-width="500"
            />
            <el-table-column
              show-overflow-tooltip
              prop="count"
              label="未处理申请单条数"
              min-width="200"
            />
            <el-table-column
              label="操作"
              align="center"
              width="80"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="onOperate('dealSingle', scope.row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="mainObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mainObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWaitOrgList, dealWaitOrgList } from '@/api/gripManageApi'

const defaultSearchForm = {
  agencyName: '',
  infoFlag: null
}
export default {
  data() {
    return {
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        agencyName: this.mainObj.searchForm.agencyName,
        infoFlag: this.mainObj.searchForm.infoFlag
      }
      getWaitOrgList(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        }
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    },
    onDeal(agencyIdList, wholeFlag = false) {
      this.$confirm('确认处理吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'info',
          message: '后台正在加紧处理中，请耐心等待片刻！'
        })
        const params = {
          wholeFlag: wholeFlag,
          agencyIdList: agencyIdList
        }
        dealWaitOrgList(params).then(res => {
          // this.$message({
          //   type: 'success',
          //   message: res.message
          // })
          // this.fetchData()
        })
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'dealSingle') {
        this.onDeal([row.agencyId])
      } else if (type === 'dealMultiple') {
        if (this.$refs.tableRef.selection.length === 0) {
          this.$message({
            type: 'info',
            message: '请选择数据'
          })
        } else {
          const agencyIdList = this.$refs.tableRef.selection.map(e => e.agencyId)
          this.onDeal(agencyIdList)
        }
      } else if (type === 'dealAll') {
        this.onDeal([], true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
