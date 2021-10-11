<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="overallForm"
          label-position="top"
          :model="overallForm"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="服务单号" prop="applyNo">
                <el-input
                  v-model="overallForm.applyNo"
                  class="fixed_width"
                  placeholder="请输入服务单号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人" prop="applyUser">
                <el-input
                  v-model="overallForm.applyUser"
                  class="fixed_width"
                  placeholder="请输入申请人用户名"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户身份" prop="agencyIdentity">
                <el-select
                  v-model="overallForm.agencyIdentity"
                  placeholder="--全部--"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    v-for="item in agencyIdentityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="流程阶段" prop="procStage">
                <el-select
                  v-model="overallForm.procStage"
                  placeholder="--全部--"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    v-for="item in procStageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核结果" prop="auditStatus">
                <el-select
                  v-model="overallForm.auditStatus"
                  placeholder="--全部--"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    v-for="item in auditStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请时间" prop="applyTime">
                <el-date-picker
                  v-model="overallForm.applyTime"
                  suffix-icon="el-icon-date"
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="--起始时间--"
                  end-placeholder="--结束时间--"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="审核结束时间" prop="procOverTime">
                <el-date-picker
                  v-model="overallForm.procOverTime"
                  suffix-icon="el-icon-date"
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="--起始时间--"
                  end-placeholder="--结束时间--"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Api账号" prop="api">
                <el-input
                  v-model="overallForm.api"
                  class="fixed_width"
                  placeholder="请输入Api账号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品类型" prop="productType">
                <el-input
                  v-model="overallForm.productType"
                  class="fixed_width"
                  placeholder="请输入产品类型"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="数据内容" prop="dataContent">
                <el-input
                  v-model="overallForm.dataContent"
                  class="fixed_width"
                  placeholder="请输入数据内容"
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
            <el-button type="text" @click="selectInterface()">
              <img
                src="@/assets/style/sjtj_icon_screen_n.svg"
                alt=""
                style="vertical-align: middle"
              >
              接口筛选
            </el-button>
          </div>
          <div class="main-body-bottom-btn-right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button type="text">
                <svg-icon class="button-icon" icon-class="config" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox-group
                  v-model="columnCheckedList"
                  @change="onChangeColumnChecked"
                >
                  <el-dropdown-item
                    v-for="item in overallQueryList"
                    :key="item.value"
                  >
                    <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
                  </el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="table">
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
            :span-method="arraySpanMethod"
            :max-height="height"
          >
            <el-table-column label="服务单号" width="220" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.applyNo || scope.row.applyNo.indexOf('init-') > -1">{{ scope.row.applyNo }}</span>
                <span
                  v-else
                  class="link-type"
                  @click="jumpToProcessCheck(scope.row)"
                >{{ scope.row.applyNo }}</span>
              </template>
            </el-table-column>

            <template v-for="item in overallQueryList">
              <el-table-column
                v-if="columnCheckedList.includes(item.value)"
                :key="item.value"
                :label="item.label"
                :prop="item.value"
                :width="item.width"
                align="center"
              />
            </template>
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
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <table-tree
        ref="tableTree"
        v-loading="tableLoading"
        :origin-data="originData"
        :table-columns="tableColumns"
        show-checkbox
        is-fold
      />
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          @click="submitSelectInterface()"
        >确定</el-button>
        <el-button
          @click="cancelSelectInterface()"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqQueryJgInstiOverall,
  reqExportJgInstiExcel
} from '@/api/statisticalQuery/statistic'

import { reqGetProductTree, reqRebackProductTreeStatic } from '@/api/email/contact'
import { downloadFile } from '@/utils'

export default {
  name: 'Overall',
  data() {
    return {
      loading: false,
      height: 200,
      overallForm: {
        applyNo: '', // 服务单号
        applyUser: '', // 申请人姓名
        agencyIdentity: '', // 机构身份

        procStage: '', // 流程阶段
        auditStatus: '', // 审核结果
        applyTime: [], // 申请时间

        procOverTime: [], // 审核结束时间
        api: '', // api账号

        productType: '', // 产品类型
        dataContent: '' // 数据内容
      },
      searchForm: {
        applyNo: '', // 服务单号
        applyUser: '', // 申请人姓名
        agencyIdentity: '', // 机构身份

        procStage: '', // 流程阶段
        auditStatus: '', // 审核结果
        applyTime: [], // 申请时间

        procOverTime: [], // 审核结束时间
        api: '', // api账号

        productType: '', // 产品类型
        dataContent: '' // 数据内容
      },

      agencyIdentityList: [
        {
          value: '00',
          label: '本币市场成员'
        },
        {
          value: '05',
          label: '外汇市场成员'
        },
        {
          value: '10',
          label: '信息商'
        },
        {
          value: '15',
          label: '系统接入开发机构'
        }
      ], // 机构身份列表

      procStageList: [
        {
          value: '00',
          label: '服务开通'
        },
        {
          value: '10',
          label: '验收测试'
        },
        {
          value: '40',
          label: '权限变更'
        },
        {
          value: '20',
          label: '接口上线'
        },
        {
          value: '50',
          label: '网络开通申请'
        }
      ], // 流程阶段列表

      auditStatusList: [
        {
          value: '00',
          label: '待审核'
        },
        {
          value: '05',
          label: '审核中'
        },
        {
          value: '10',
          label: '通过'
        },
        {
          value: '90',
          label: '拒绝'
        },
        {
          value: '1000',
          label: '申请单待审核'
        },
        {
          value: '1010',
          label: '测试中'
        },
        {
          value: '1020',
          label: '申请单拒绝'
        },
        {
          value: '1050',
          label: '报告待审核'
        },
        {
          value: '1040',
          label: '验收失败'
        },
        {
          value: '1060',
          label: '验收成功报告可下载'
        },
        {
          value: '1070',
          label: '报告拒绝'
        },
        {
          value: '1005',
          label: '候补'
        },
        {
          value: '1080',
          label: '释放'
        }
      ], // 审核结果列表

      // 市场机构00 / 信息商10
      menuInstType: '10',

      // icon设置按钮下拉列表多选框
      columnCheckedList: [],
      // icon设置按钮下拉列表
      overallQueryList: [
        // { label: '服务单号', value: 'applyNo', width: '170' },
        { label: '业务类型', value: 'businessType', width: '170' },
        { label: '申请人', value: 'applyUser', width: '170' },
        { label: '用户身份', value: 'agencyIdentity', width: '170' },
        { label: '流程阶段', value: 'procStage', width: '170' },
        { label: '申请时间', value: 'applyTime', width: '170' },
        { label: '审核结束时间', value: 'procOverTime', width: '170' },
        { label: '审核结果', value: 'auditStatus', width: '170' },
        { label: 'Api账号', value: 'api', width: '170' },
        { label: '产品类型', value: 'productType', width: '170' },
        { label: '数据内容', value: 'dataContent', width: '170' }
      ],

      spanArr: [], // 用于存放每一行记录的合并数
      pos: 0,
      columnNo: 11,
      tableList: [],

      currentPage: 1,
      pageSize: 20,
      pagesizes: [20, 50, 100],
      total: 0,

      dialogTableVisible: false,
      title: '',
      tableLoading: false,
      originData: [],
      tableColumns: [],
      leafNodeIdList: [], // 叶子节点ID集合
      // 回显选中的节点idlist
      interfacesList: []
    }
  },

  created() {
    this.columnCheckedList = []
    this.overallQueryList.forEach((e) => {
      this.columnCheckedList.push(e.value)
    })
    this.handleFilter()
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$root.$el.clientHeight - 300
    })
  },
  methods: {
    // 点击服务单号跳转到流程查看页面
    jumpToProcessCheck(row) {
      console.log('row', row)
      this.$router.push({
        name: 'MyService',
        params: {
          institutionType: '10',
          searchObj: {
            id: row.applyNo
          }
        }
      })
      console.log('row.applyNo', row.applyNo)
    },
    // 查询
    handleFilter() {
      this.currentPage = 1

      if (
        this.overallForm.applyTime === null ||
        this.overallForm.applyTime.length === 0
      ) {
        this.overallForm.applyTime = ['', '']
      }
      if (
        this.overallForm.procOverTime === null ||
        this.overallForm.procOverTime.length === 0
      ) {
        this.overallForm.procOverTime = ['', '']
      }

      this.searchForm = JSON.parse(JSON.stringify(this.overallForm))
      this.onQuery(this.searchForm)
    },
    async onQuery() {
      this.loading = true
      const params = {
        applyNo: this.searchForm.applyNo,
        applyUser: this.searchForm.applyUser,
        agencyIdentity: this.searchForm.agencyIdentity,
        procStage: this.searchForm.procStage,
        auditStatus: this.searchForm.auditStatus,
        applyStartTime: this.searchForm.applyTime[0],
        applyEndTime: this.searchForm.applyTime[1],
        procOverStartTime: this.searchForm.procOverTime[0],
        procOverEndTime: this.searchForm.procOverTime[1],
        api: this.searchForm.api,
        productType: this.searchForm.productType,
        dataContent: this.searchForm.dataContent,
        page: this.currentPage,
        pageSize: this.pageSize,
        leafNodeIdList: this.leafNodeIdList
      }
      const res = await reqQueryJgInstiOverall(params)
      if (res.code === 'ACK') {
        this.loading = false
        const list = res.data.list
        const arr = []
        list.forEach((item) => {
          arr.push(Object.assign(item))
        })
        this.tableList = arr
        this.getSpanArr(arr)
        // this.total = res.data ? res.data.totalRecord : 0
        this.total = res.data.totalRecord
      } else {
        this.loading = false
      }

      console.log('总体查询', res)
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
    },

    // 重置
    onReset() {
      Object.keys(this.overallForm).forEach((item) => {
        if (typeof this.overallForm[item] === 'string') {
          this.overallForm[item] = ''
        }
        if (
          typeof this.overallForm[item] === 'object' &&
          Array.isArray(this.overallForm[item])
        ) {
          this.overallForm[item] = []
        }
        if (
          Object.prototype.toString.call(this.overallForm[item]) ===
          '[object object]'
        ) {
          this.overallForm[item] = {}
        }
      })
      this.leafNodeIdList = []
      this.pageSize = 20
      this.currentPage = 1
      console.log('重置信息', this.overallForm)
      this.handleFilter()
    },

    // 导出excel
    async outputExcel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        applyNo: this.searchForm.applyNo,
        applyUser: this.searchForm.applyUser,
        agencyIdentity: this.searchForm.agencyIdentity,
        procStage: this.searchForm.procStage,
        auditStatus: this.searchForm.auditStatus,
        applyStartTime: this.searchForm.applyTime[0],
        applyEndTime: this.searchForm.applyTime[1],
        procOverStartTime: this.searchForm.procOverTime[0],
        procOverEndTime: this.searchForm.procOverTime[1],
        api: this.searchForm.api,
        productType: this.searchForm.productType,
        dataContent: this.searchForm.dataContent,
        page: this.currentPage,
        pageSize: this.pageSize,
        leafNodeIdList: this.leafNodeIdList
      }
      reqExportJgInstiExcel(params).then(res => {
        if (res.status === 200) {
          const name = '机构端信息商统计总体查询' + '.xlsx'
          downloadFile(res.data, name)
          loading.close()
        } else {
          this.$message.warning('请使用快速导出')
          loading.close()
        }
      })
    },

    // 接口筛选
    selectInterface() {
      this.dialogTableVisible = true
      this.title = '接口筛选'
      if (this.leafNodeIdList && this.leafNodeIdList.length === 0) {
        this.getMenu()
      }
      if (this.leafNodeIdList && this.leafNodeIdList.length > 0) {
        this.rebackCheckedInterface()
      }
    },

    // 接口筛选取消
    cancelSelectInterface() {
      this.dialogTableVisible = false
    },

    // 接口筛选确定
    submitSelectInterface() {
      this.dialogTableVisible = false
      const leafNodeList = this.$refs.tableTree.getCheckedNodeList()
      console.log('选中的节点', leafNodeList)
      const arr = []
      Object.keys(leafNodeList).forEach((item) => {
        console.log('遍历选中节点的值，取出对应的对象', leafNodeList[item])
        if (
          leafNodeList[item].chidrenList &&
          leafNodeList[item].chidrenList.length === 0
        ) {
          const nodeId = leafNodeList[item].id
          arr.push(nodeId)
        }
      })
      console.log('打印过滤出的arr', arr)
      this.leafNodeIdList = arr
    },

    // 回显选中的接口数据
    async rebackCheckedInterface() {
      this.tableLoading = true
      var params = {
        interfaceIds: this.leafNodeIdList,
        menuInstType: '10'
      }
      // 回显保存状态——调接口
      const { code, data } = await reqRebackProductTreeStatic(params)
      if (code === 'ACK') {
        this.originData = data.nodeList
        this.tableColumns = data.headList
        this.tableLoading = false
      }
    },
    // // 获取树节点的方法
    getMenu(str) {
      console.log(str)
      // this.menuInstType = str
      str = this.menuInstType
      this.tableLoading = true
      var params = {
        menuInstType: str
      }
      reqGetProductTree(params)
        .then((res) => {
          this.originData = res.data.nodeList
          this.tableColumns = res.data.headList
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.tableLoading = false
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
          if (!data[i].applyNo) {
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

    // icon下拉列表点击事件
    onChangeColumnChecked(val) {
      this.columnNo = 0
      console.log(val)
      if (val.includes('applyNo')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('businessType')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('applyUser')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('agencyIdentity')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('procStage')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('applyTime')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('procOverTime')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('auditStatus')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('api')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('productType')) {
        this.columnNo = this.columnNo + 1
      }
      if (val.includes('dataContent')) {
        this.columnNo = this.columnNo + 1
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
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
