<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="isvForm"
          label-position="top"
          :model="isvForm"
          inline
        >
          <el-form-item label="接口产品">
            <el-input
              v-model="isvForm.interfaceProduct"
              placeholder="请输入接口产品"
              clearable
            />
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input
              v-model="isvForm.isvInstiName"
              placeholder="请输入机构名称"
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
          <div class="main-body-bottom-btn-right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button type="text">
                <svg-icon class="button-icon" icon-class="config" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox-group v-model="columnCheckedList">
                  <el-dropdown-item
                    v-for="item in overallQueryList"
                    :key="item.prop"
                  >
                    <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
                  </el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="table">
          <el-table
            :loading="loading"
            :data="isvTableData"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column
              v-for="item in checkedColumns"
              :key="item.prop"
              show-overflow-tooltip
              :prop="item.prop"
              :label="item.label"
              :fixed="item.fixed"
              :min-width="item.minWidth"
            >
            <!--
            <template slot-scope="scope">
              <template v-if="item.prop === 'procType'">
                {{ scope.row.procType | procTypeFilter }}
              </template>
            </template>
           -->
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
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
  reqQueryISVCondition,
  reqExportISVExcel
} from '@/api/statisticalQuery/statistic'

import { downloadFile } from '@/utils/index'

export default {
  name: 'ISVStatistic',
  data() {
    return {
      isvForm: {
        interfaceProduct: '',
        isvInstiName: ''
      },
      searchForm: {
        interfaceProduct: '',
        isvInstiName: ''
      },

      columnCheckedList: [],
      overallQueryList: [
        {
          prop: 'isvInstiName',
          label: 'ISV机构名称',
          minWidth: '226',
          fixed: 'left'
        },
        {
          prop: 'interfaceProduct',
          label: '接口产品',
          minWidth: '158'
        },
        {
          prop: 'testCount',
          label: '验收总次数',
          minWidth: '158'
        },
        {
          prop: 'testPassCount',
          label: '验收通过次数',
          minWidth: '158'
        },
        {
          prop: 'testFailCount',
          label: '验收失败次数',
          minWidth: '158'
        },
        {
          prop: 'openCount',
          label: '服务开通次数',
          minWidth: '158'
        },
        {
          prop: 'onlineCount',
          label: '接口上线次数',
          minWidth: '158'
        }
      ],

      isvTableData: [],
      loading: false,

      currentPage: 1,
      pageSize: 20,
      total: 0
    }
  },
  computed: {
    checkedColumns() {
      return this.overallQueryList.filter((e) =>
        this.columnCheckedList.includes(e.prop)
      )
    }
  },
  created() {
    this.columnCheckedList = JSON.parse(
      JSON.stringify(this.overallQueryList)
    ).map((e) => e.prop)

    this.handleFilter()
  },

  methods: {
    // 查询
    handleFilter() {
      this.currentPage = 1
      this.searchForm = JSON.parse(JSON.stringify(this.isvForm))
      this.onQuery(this.searchForm)
    },
    async onQuery() {
      this.loading = true
      const params = {
        interfaceProduct: this.searchForm.interfaceProduct,
        isvInstiName: this.searchForm.isvInstiName,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await reqQueryISVCondition(params)
      console.log('res==>isv统计', res)
      if (res.code === 'ACK') {
        this.total = res.data.totalRecord
        this.isvTableData = res.data.list
        this.loading = false
      } // 需要合并行数
    },

    // 重置
    onReset() {
      Object.keys(this.isvForm).forEach((item) => {
        if (typeof this.isvForm[item] === 'string') {
          this.isvForm[item] = ''
        }
        if (
          typeof this.isvForm[item] === 'object' &&
          Array.isArray(this.isvForm[item])
        ) {
          this.isvForm[item] = []
        }
        if (
          Object.prototype.toString.call(this.isvForm[item]) ===
          '[object object]'
        ) {
          this.isvForm[item] = {}
        }
      })

      this.currentPage = 1
      this.pageSize = 20
      this.handleFilter()
      console.log('打印重置信息', this.isvForm, this.pageSize, this.currentPage)
    },

    quicklyOutput() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        interfaceProduct: this.searchForm.interfaceProduct,
        isvInstiName: this.searchForm.isvInstiName,
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 1
      }
      reqExportISVExcel(params).then(res => {
        if (res.status === 200) {
          const name = '场务端ISV统计' + '.xlsx'
          downloadFile(res.data, name)
          loading.close()
        } else {
          loading.close()
          this.$message.error('下载失败!')
        }
      })
    },
    // 导出
    async outputExcel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        interfaceProduct: this.searchForm.interfaceProduct,
        isvInstiName: this.searchForm.isvInstiName,
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 0
      }
      reqExportISVExcel(params).then(res => {
        if (res.status === 200) {
          const name = '场务端ISV统计' + '.xlsx'
          downloadFile(res.data, name)
          loading.close()
        } else {
          loading.close()
          this.$message.warning('请使用快速导出')
        }
      })
    },

    // 分页
    handleSizeChange(val) {
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
