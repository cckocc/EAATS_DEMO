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
              <el-input
                v-model.trim="mainObj.searchForm.applyOrdNo"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构名称">
              <el-input v-model="mainObj.searchForm.instName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口名称">
              <el-input
                v-model.trim="mainObj.searchForm.serviceName"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="流程阶段">
              <el-select
                v-model="mainObj.searchForm.serviceType"
                placeholder="--全部--"
                clearable
                style="width: 100%;"
              >
                <el-option
                  v-for="item in serveiceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="审核人">
              <el-input v-model="mainObj.searchForm.auditUserName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
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
            <el-form-item style="margin-top: 30px;">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button @click="onReset('searchForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
              <el-checkbox-group
                v-model="columnCheckedList1"
                @change="onChangeColumnChecked"
              >
                <el-dropdown-item
                  v-for="(item, i) in timeAuditList1"
                  :key="i + 'check'"
                >
                  <el-checkbox :label="item.value">{{
                    item.label
                  }}</el-checkbox>
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
          :span-method="arraySpanMethod"
        >
          <template v-for="column1 in column1">
            <template v-if="column1.value == 'serviceType'">
              <el-table-column
                v-if="columnCheckedList1.includes(column1.value)"
                :key="column1.prop"
                :label="column1.label"
                :prop="column1.value"
                align="left"
                :width="column1.width"
              >
                <template
                  v-if="column1.value == 'serviceType'"
                  slot-scope="scope"
                >
                  <span>{{ scope.row.serviceType.text }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                v-if="columnCheckedList1.includes(column1.value)"
                :key="column1.prop"
                :label="column1.label"
                :prop="column1.value"
                align="left"
                :width="column1.width"
              />
            </template>
          </template>
          <template v-for="column2 in column2">
            <el-table-column
              v-if="columnCheckedList1.includes(column2.value)"
              :key="column2.prop"
              :label="column2.label"
              :prop="column2.value"
              align="left"
              :width="column2.width"
            />
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
import { getOtherList, exportExcelInOtherPage } from '@/api/statQuery'
import { downloadFile } from '@/utils'
import globalOptions from '@/utils/globalOptionsValue'
const defaultMainObj = {
  list: [],
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
  filters: {
    serviceTypeFilter(val) {
      const serveice = {
        SERVICE_APPLY: '服务开通',
        ACCEPTANCE_TEST: '验收测试',
        SERVICE_ONLINE: '接口上线',
        SERVICE_STOP: '接口终止',
        PERM_CHANGE: '权限变更'
      }
      return serveice[val]
    }
  },
  props: {},
  data() {
    return {
      serveiceOptions: globalOptions.serveiceOptions,
      column1: [
        { label: '服务编号', value: 'applyOrdNo', width: '200' },
        { label: '机构名称', value: 'instName', width: '170' },
        { label: '接口名称', value: 'serviceName', width: '210' },
        { value: 'serviceType', label: '流程阶段', width: '100' },
        { value: 'submitTime', label: '申请单提交时间', width: '180' },
        { value: 'endTime', label: '申请单结束时间', width: '180' },
        { value: 'costTime', label: '总花费时间(工作时间)', width: '180' }
      ],
      column2: [
        { label: '审核部门', value: 'department.auditDept', width: '100' },
        { label: '审核人', value: 'department.auditName', width: '100' },
        {
          label: '申请单审核时间',
          value: 'department.auditTime',
          width: '180'
        },
        { label: '花费时间(工作时间)', value: 'department.cost', width: '180' }
      ],
      timeAuditList1: [],
      columnCheckedList1: [],
      mainObj: {
        list: [],
        searchForm: Object.assign({}, defaultMainObj.searchForm),
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0
      },
      spanArr: [], // 用于存放每一行记录的合并数
      pos: 0,
      columnNo: 7
    }
  },
  created() {
    this.serveiceOptions = this.serveiceOptions.filter(e => e.value !== '10')
    this.fetchData()
    this.timeAuditList1 = [...this.column1, ...this.column2]
    this.columnCheckedList1 = []
    this.timeAuditList1.forEach((e) => {
      this.columnCheckedList1.push(e.value)
    })
  },
  mounted() {},
  methods: {
    fetchData() {
      const params = {
        applyOrdNo: this.mainObj.searchForm.applyOrdNo,
        serviceName: this.mainObj.searchForm.serviceName,
        instName: this.mainObj.searchForm.instName,
        serviceType: this.mainObj.searchForm.serviceType,
        auditUserName: this.mainObj.searchForm.auditUserName,
        startSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[0] : '',
        endSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[1] : '',
        startAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[0] : '',
        endAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[1] : '',
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      getOtherList(params).then((res) => {
        if (res.code === 'ACK') {
          const list = res.data.list
          const arr = []
          list.forEach((item) => {
            if (item.deptDtoList && item.deptDtoList.length > 0) {
              item.deptDtoList.forEach((o, index) => {
                if (index === 0) {
                  arr.push(Object.assign(item, { department: o }))
                } else {
                  arr.push({ department: o })
                }
              })
            } else {
              arr.push(Object.assign(item))
            }
          })
          // console.log(arr)
          this.mainObj.list = arr
          this.getSpanArr(arr)
          // this.mainObj.list = res.data ? res.data.list : []
          // console.log(this.mainObj.list, 'this.mainObj.list');
          this.mainObj.total = res.data ? res.data.totalRecord : 0
        }
      })
    },
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      // data就是我们从后台拿到的数据
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (!data[i].applyOrdNo) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
        // console.log(this.spanArr);
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < this.columnNo) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    onChangeColumnChecked(val) {
      this.columnNo = 0
      console.log(val)
      if (val.includes('applyOrdNo')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('instName')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('serviceName')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('serviceType')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('submitTime')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('endTime')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('costTime')) {
        this.columnNo = this.columnNo + 1
      }
    },
    onSearch() {
      // 搜索功能
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
        serviceType: this.mainObj.searchForm.serviceType,
        auditUserName: this.mainObj.searchForm.auditUserName,
        startSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[0] : '',
        endSubmitTs: this.mainObj.searchForm.submitTs ? this.mainObj.searchForm.submitTs[1] : '',
        startAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[0] : '',
        endAuditTs: this.mainObj.searchForm.auditTs ? this.mainObj.searchForm.auditTs[1] : '',
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }

      try {
        const result = await exportExcelInOtherPage(data)
        if (result.status === 200) {
          const name = '审核时间节点统计' + '.xlsx'
          downloadFile(result.data, name)
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
