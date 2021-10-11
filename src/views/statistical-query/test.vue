<template>
  <div class="main-body">
    <div class="main-body-top">
      <el-form
        ref="searchForm"
        label-position="top"
        :model="mainObj.searchForm"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="服务编号">
              <el-input v-model.trim="mainObj.searchForm.applyOrdNo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构名称">
              <el-input v-model="mainObj.searchForm.instName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口名称">
              <el-input v-model.trim="mainObj.searchForm.serviceName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="提交时间">
              <el-date-picker
                v-model="mainObj.searchForm.submitTs"
                suffix-icon="el-icon-date"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="--起始时间--"
                end-placeholder="--结束时间--"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核时间">
              <el-date-picker
                v-model="mainObj.searchForm.auditTs"
                suffix-icon="el-icon-date"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="--起始时间--"
                end-placeholder="--结束时间--"
                style="width: 100%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人">
              <el-input v-model="mainObj.searchForm.auditUserName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body-bottom">
      <div class="main-body-bottom-btn">
        <div class="main-body-bottom-btn-left">
          <el-button
            type="text"
            size="mini"
            @click="exportExcel"
          ><svg-icon icon-class="download-excel" />导出Excel</el-button>
        </div>
        <div class="main-body-bottom-btn-right">
          <el-dropdown trigger="click" :hide-on-click="false">
            <svg-icon class="button-icon" icon-class="config" />
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="columnCheckedList2" @change="onChangeColumnChecked">
                <el-dropdown-item v-for="(item, i) in timeAuditList2" :key="i + 'check'">
                  <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="mainObj.list"
          style="width: 100%"
          fit
          stripe
          border
          highlight-current-row
        >
          <template v-for="head in head">
            <el-table-column v-if="columnCheckedList2.includes(head.value)" :key="head.prop" :label="head.label" :prop="head.value" align="left" width="200" />
          </template>
          <template v-for="column in mainObj.columns">
            <el-table-column v-if="columnCheckedList2.includes(column.value)" :key="column.prop" :label="column.label" :prop="column.value" align="left" :width="column.width" />
          </template>
          <template v-for="(item, key) in mainObj.headList">
            <el-table-column v-if="columnCheckedList2.includes(item.value)" :key="item.value" :label="item.label" align="center" min-width="500">
              <el-table-column :prop="item.property0" :label="item.label1" align="left" min-width="170" />
              <el-table-column :prop="item.property1" label="审核部门" align="left" min-width="100" />
              <el-table-column :prop="item.property2" label="审核人" align="left" min-width="100" />
              <el-table-column :prop="item.property3" label="与上一节点时间差(工作时间)" align="left" min-width="200" />
            </el-table-column>
          </template>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="mainObj.currentPage"
          :page-sizes="mainObj.pagesizes"
          :page-size="mainObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mainObj.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getTestList, exportExcelInTestPage } from '@/api/statQuery'
const defaultMainObj = {
  list: [],
  columns: [],
  headList: [],
  searchForm: {
    serviceName: '',
    instName: '',
    submitTs: null,
    auditTs: null,
    auditUserName: '',
    applyOrdNo: '',
    serviceType: ''
  },
  currentPage: 1,
  pageSize: 20,
  pagesizes: [20, 50, 100],
  total: 0
}
export default {
  components: {},
  props: {},
  data() {
    return {
      columnCheckedList2: [],
      timeAuditList2: [],
      test: [
        { value: 'submitTime', label: '申请单提交时间', width: '180' }
      ],
      head: [
        {
          label: '服务编号',
          value: 'applyOrdNo'
        },
        {
          label: '机构名称',
          value: 'instName'
        },
        {
          label: '接口名称',
          value: 'serviceName'
        }
      ],
      head2: [
        {
          label: '审核阶段',
          value: 'audit',
          label1: '审核结束时间',
          property0: 'auditTime1',
          property1: 'auditDept1',
          property2: 'auditName1',
          property3: 'cost1'
        },
        {
          label: '测试阶段',
          value: 'test',
          label1: '测试结束时间',
          property0: 'auditTime2',
          property1: 'auditDept2',
          property2: 'auditName2',
          property3: 'cost2'
        },
        {
          label: '报告审核阶段',
          value: 'report',
          label1: '报告审核结束时间',
          property0: 'auditTime3',
          property1: 'auditDept3',
          property2: 'auditName3',
          property3: 'cost3'
        }
      ],
      mainObj: {
        list: [],
        columns: [],
        headList: [],
        searchForm: Object.assign({}, defaultMainObj.searchForm),
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0
      }
    }
  },
  created() {
    this.fetchData()
    this.timeAuditList2 = [...this.head, ...this.test, ...this.head2]
    this.columnCheckedList2 = []
    this.timeAuditList2.forEach(e => {
      this.columnCheckedList2.push(e.value)
    })
  },
  mounted() {},
  methods: {
    fetchData() {
      this.mainObj.columns = this.test
      this.mainObj.headList = this.head2
      const params = {
        applyOrdNo: this.mainObj.searchForm.applyOrdNo,
        serviceName: this.mainObj.searchForm.serviceName,
        instName: this.mainObj.searchForm.instName,
        auditUserName: this.mainObj.searchForm.auditUserName,
        startSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[0] : '',
        endSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[1] : '',
        startAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[0] : '',
        endAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[1] : '',
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      getTestList(params).then(res => {
        if (res.code == 'ACK') {
          // console.log(res, 'res');
          this.mainObj.list = res.data ? res.data.list : []
          this.mainObj.total = res.data ? res.data.totalRecord : 0
        }
      })
    },
    onChangeColumnChecked(val) {
      console.log(val)
    },
    onSearch() { // 搜索功能
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset(formName) {
      this.mainObj.searchForm = Object.assign({}, defaultMainObj.searchForm)
      this.onSearch()
    },
    handleSizeChange(val) {
      console.log(val, 'val')
      this.mainObj.pageSize = val
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    // 导出excel
    async exportExcel() {
      const data = {
        applyOrdNo: this.mainObj.searchForm.applyOrdNo,
        serviceName: this.mainObj.searchForm.serviceName,
        instName: this.mainObj.searchForm.instName,
        auditUserName: this.mainObj.searchForm.auditUserName,
        startSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[0] : '',
        endSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[1] : '',
        startAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[0] : '',
        endAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[1] : '',
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }

      try {
        const result = await exportExcelInTestPage(data)
        if (result.status === 200) {
          var name = ''
          const blob = new Blob([result.data])
          if (this.mainObj.searchForm !== '') {
            name = '审核时间节点统计' + '.xlsx' // 下载后文件名
          } else {
            name = '审核时间节点统计' + '.csv' // 下载后文件名
          }

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, name)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = name
            document.body.appendChild(link)
            link.click()
          }
        } else {
          this.$message.error('下载失败！')
        }
      } catch (error) {
        this.$message.error('下载失败！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .el-table {
//   /deep/thead {
//     color: #303030 !important;
//   }
// }
// .el-button.el-button--mini {
//   line-height: 16px !important;
// }
// .el-button--text {
//   color: #333;
//   svg {
//     margin-right: 5px;
//   }
// }
// .button-icon {
//   width: 24px;
//   height: 24px;
//   cursor: pointer;
// }
</style>
