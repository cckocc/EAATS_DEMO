<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="processForm"
          label-position="top"
          :model="processForm"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="服务单号">
                <el-input
                  v-model="processForm.applyNo"
                  class="fixed_width"
                  placeholder="请输入服务单号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上线时间">
                <el-date-picker
                  v-model="processForm.onlineOverTime"
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
              <el-form-item label="验收通过时间">
                <el-date-picker
                  v-model="processForm.testOverTime"
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
              <el-form-item label="服务开通（权限变更）通过时间">
                <el-date-picker
                  v-model="processForm.startOverTime"
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
              <el-form-item label="Api账号">
                <el-input
                  v-model="processForm.api"
                  class="fixed_width"
                  placeholder="请输入Api账号"
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
        </el-form></div>
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
            <el-button type="text" @click="quicklyOutput()">
              <img
                src="~@/assets/style/doc_icon.svg"
                alt=""
                style="vertical-align: middle"
              >
              快速导出</el-button>
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
            :data="tableDataList"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
            :header-cell-class-name="headerCellClassName"
            :cell-class-name="cellClassName"
            :max-height="height"
          >
            <el-table-column align="center" :min-width="columnCheckedList.length*200">
              <template #header>
                <SearhTreeSlot
                  :origin-data="[]"
                  :table-columns="TableheadList"
                  :extra-column-obj="extraColumnObj"
                  :show-extra-column="columnCheckedList"
                  :parent-children-obj="parentChildrenObj"
                  extra-column
                />
              </template>
              <template slot-scope="scope">
                <SearhTreeSlot
                  :origin-data="scope.row.processQueryNodeList"
                  :table-columns="TableheadList"
                  :is-show-table-head="false"
                  :extra-column-obj="scope.row.extraColumnObj"
                  :parent-children-obj="parentChildrenObj"
                  :show-extra-column="columnCheckedList"
                  extra-column
                />
              </template>
            </el-table-column>
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
    <!-- 接口筛选对话框 -->
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
  reqQueryProcessAgency,
  reqExportProcessAgency
} from '@/api/statisticalQuery/statistic'

import { downloadFile } from '@/utils'

import SearhTreeSlot from '@/views/statistical-query/components-slot/search_tree_slot.vue'
import { reqGetProductTree, reqRebackProductTreeStatic } from '@/api/email/contact'

export default {
  name: 'Process',
  components: {
    SearhTreeSlot
  },
  data() {
    return {
      height: 200,
      processForm: {
        applyNo: '',
        onlineOverTime: [],
        onlineOverStartTime: '',
        onlineOverEndTime: '',

        testOverTime: [],
        testOverStartTime: '',
        testOverEndTime: '',
        startOverTime: [],
        startOverStartTime: '',
        startOverEndTime: '',
        api: '',

        displayIsvFlag: ''
      },

      searchForm: {
        applyNo: '',
        onlineOverTime: [],
        onlineOverStartTime: '',
        onlineOverEndTime: '',

        testOverTime: [],
        testOverStartTime: '',
        testOverEndTime: '',
        startOverTime: [],
        startOverStartTime: '',
        startOverEndTime: '',
        api: '',

        displayIsvFlag: ''
      },

      // 是否是ISV
      isvAccoutList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],

      leafNodeIdList: [],

      columnCheckedList: ['接口产品', '服务内容', '接口用途', '接口服务', '市场', 'onlineIsvAgencyName', 'api', 'onlineOverTime',
        'onlineApplyNo', 'acceptanceTestIsvAgencyName', 'testOverTime', 'testApplyNo', 'openIsvAgencyName', 'startOverTime', 'startApplyNo'],
      overallQueryList: [
        // { label: '机构名称', value: 'agencyName', width: '170' },
        // { label: '是否是ISV', value: 'isvFlag', width: '170' },
        // { label: '接口产品', value: '接口产品', width: '170' },
        // { label: '服务内容', value: '服务内容', width: '170' },
        // { label: '市场', value: '市场', width: '170' },
        // { label: '接口用途', value: '接口用途', width: '170' },
        // { label: '接口服务', value: '接口服务', width: '170' },
        { label: 'ISV机构(上线)', value: 'onlineIsvAgencyName', width: '170' },
        { label: 'API账号', value: 'api', width: '170' },
        { label: '上线时间', value: 'onlineOverTime', width: '170' },
        { label: '上线服务单号', value: 'onlineApplyNo', width: '170' },
        { label: 'ISV机构(验收)', value: 'acceptanceTestIsvAgencyName', width: '170' },
        { label: '验收通过时间', value: 'testOverTime', width: '170' },
        { label: '验收服务单号', value: 'testApplyNo', width: '170' },
        { label: 'ISV机构(服务开通)', value: 'openIsvAgencyName', width: '170' },
        { label: '服务开通(权限变更)通过时间', value: 'startOverTime', width: '170' },
        { label: '服务开通(权限变更)服务单号', value: 'startApplyNo', width: '170' }
      ],
      // 多级表头父子关系
      parentChildrenObj: [
        { parent: '接口服务', child: ['接口产品', '服务内容'] }
      ],

      title: '接口筛选',
      dialogTableVisible: false,
      tableLoading: false,
      originData: [],
      tableColumns: [],

      menuInstType: '00',
      loading: false,
      tableDataList: [],
      TableheadList: [],
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV机构(上线)',
            rowspan: 1,
            colspan: 1,
            value: 'onlineIsvAgencyName'
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'API账号',
            rowspan: 1,
            colspan: 1,
            value: 'api'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '上线时间',
            rowspan: 1,
            colspan: 1,
            value: 'onlineOverTime'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '上线服务单号',
            rowspan: 1,
            colspan: 1,
            value: 'onlineApplyNo'
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV机构(验收)',
            rowspan: 1,
            colspan: 1,
            value: 'acceptanceTestIsvAgencyName'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '验收通过时间',
            rowspan: 1,
            colspan: 1,
            value: 'testOverTime'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '验收服务单号',
            rowspan: 1,
            colspan: 1,
            value: 'testApplyNo'
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV机构(服务开通)',
            rowspan: 1,
            colspan: 1,
            value: 'openIsvAgencyName'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '服务开通(权限变更)通过时间',
            rowspan: 1,
            colspan: 1,
            value: 'startOverTime'
          },
          {
            id: null,
            nodeType: 'extra',
            name: '服务开通(权限变更)服务单号',
            rowspan: 1,
            colspan: 1,
            value: 'startApplyNo'
          }
        ],
        list: []
      },

      currentPage: 1,
      pageSize: 5,
      pagesizes: [5, 10, 20, 50, 100],
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
    // 查询
    handleFilter() {
      this.currentPage = 1

      if (
        this.processForm.onlineOverTime === null ||
        this.processForm.onlineOverTime.length === 0
      ) {
        this.processForm.onlineOverTime = ['', '']
      }

      if (
        this.processForm.testOverTime === null ||
        this.processForm.testOverTime.length === 0
      ) {
        this.processForm.testOverTime = ['', '']
      }

      if (
        this.processForm.startOverTime === null ||
        this.processForm.startOverTime.length === 0
      ) {
        this.processForm.startOverTime = ['', '']
      }

      this.searchForm = JSON.parse(JSON.stringify(this.processForm))
      this.onQuery(this.searchForm)
    },
    async onQuery() {
      this.loading = true
      const params = {
        agencyId: '',
        api: this.processForm.api,
        applyNo: this.processForm.applyNo,
        displayIsvFlag: this.processForm.displayIsvFlag,
        leafNodeIdList: this.leafNodeIdList,
        // menuType: this.menuInstType,
        onlineOverStartTime: this.processForm.onlineOverTime[0],
        onlineOverEndTime: this.processForm.onlineOverTime[1],
        testOverStartTime: this.processForm.testOverTime[0],
        testOverEndTime: this.processForm.testOverTime[1],
        startOverStartTime: this.processForm.startOverTime[0],
        startOverEndTime: this.processForm.startOverTime[1],
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await reqQueryProcessAgency(params)
      if (res.code === 'ACK') {
        this.tableDataList = res.data.bodyData.list
        this.tableDataList &&
          this.tableDataList.forEach((e) => {
            var extraInfoList = this.lookForNode(e.processQueryNodeList)
            // console.log(22222222, extraInfoList)
            e.extraColumnObj = {
              columns: [
                {
                  id: null,
                  nodeType: 'extra',
                  name: 'ISV机构(上线)',
                  rowspan: 1,
                  colspan: 1,
                  value: 'onlineIsvAgencyName'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: 'API账号',
                  rowspan: 1,
                  colspan: 1,
                  value: 'api'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '上线时间',
                  rowspan: 1,
                  colspan: 1,
                  value: 'onlineOverTime'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '上线服务单号',
                  rowspan: 1,
                  colspan: 1,
                  value: 'onlineApplyNo'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: 'ISV机构(验收)',
                  rowspan: 1,
                  colspan: 1,
                  value: 'acceptanceTestIsvAgencyName'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '验收通过时间',
                  rowspan: 1,
                  colspan: 1,
                  value: 'testOverTime'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '验收服务单号',
                  rowspan: 1,
                  colspan: 1,
                  value: 'testApplyNo'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: 'ISV机构(服务开通)',
                  rowspan: 1,
                  colspan: 1,
                  value: 'openIsvAgencyName'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '服务开通(权限变更)通过时间',
                  rowspan: 1,
                  colspan: 1,
                  value: 'startOverTime'
                },
                {
                  id: null,
                  nodeType: 'extra',
                  name: '服务开通(权限变更)服务单号',
                  rowspan: 1,
                  colspan: 1,
                  value: 'startApplyNo'
                }
              ],
              list: extraInfoList
            }
          })
        this.TableheadList = res.data.headList
        this.total = res.data.bodyData.totalRecord
        this.loading = false
        console.log('场务端信息商流程查询', res)
      } else {
        this.loading = false
        console.log('查询失败')
      }
    },
    lookForNode(arr) {
      if (arr && arr.length > 0) {
        var newArr = []
        // 定义递归方法
        const loop = (arr) => {
          arr.forEach((item) => {
            if (
              Array.isArray(item.chidrenList) &&
            item.chidrenList.length === 0
            ) {
              var onlineIsvAgencyNameList = []
              var apiList = []
              var onlineOverTimeList = []
              var onlineApplyNoList = []
              var acceptanceTestIsvAgencyNameList = []
              var testOverTimeList = []
              var testApplyNoList = []
              var openIsvAgencyNameList = []
              var startOverTimeList = []
              var startApplyNoList = []

              if (item.extraInfoList && item.extraInfoList.length > 0) {
                item.extraInfoList.forEach((extra) => {
                  // extra.chidrenList = []
                  onlineIsvAgencyNameList.push(extra.onlineIsvAgencyName)
                  apiList.push(extra.api)
                  onlineOverTimeList.push(extra.onlineOverTime)
                  onlineApplyNoList.push(extra.onlineApplyNo)
                  acceptanceTestIsvAgencyNameList.push(
                    extra.acceptanceTestIsvAgencyName
                  )
                  testOverTimeList.push(extra.testOverTime)
                  testApplyNoList.push(extra.testApplyNo)
                  openIsvAgencyNameList.push(extra.openIsvAgencyName)
                  startOverTimeList.push(extra.startOverTime)
                  startApplyNoList.push(extra.startApplyNo)
                  // extra.list = sss
                })
              }

              const nodeList = [
                { thName: 'onlineIsvAgencyName', list: onlineIsvAgencyNameList },
                { thName: 'api', list: apiList },
                { thName: 'onlineOverTime', list: onlineOverTimeList },
                { thName: 'onlineApplyNo', list: onlineApplyNoList },
                { thName: 'acceptanceTestIsvAgencyName', list: acceptanceTestIsvAgencyNameList },
                { thName: 'testOverTime', list: testOverTimeList },
                { thName: 'testApplyNo', list: testApplyNoList },
                { thName: 'openIsvAgencyName', list: openIsvAgencyNameList },
                { thName: 'startOverTime', list: startOverTimeList },
                { thName: 'startApplyNo', list: startApplyNoList }
              ]
              newArr.push(nodeList)
            } else if (
              Array.isArray(item.chidrenList) &&
            item.chidrenList.length > 0
            ) {
              loop(item.chidrenList)
            }
          })
        }
        //  执行递归
        loop(arr)
        return newArr
      } else {
        return []
      }
    },

    // 重置
    onReset() {
      Object.keys(this.processForm).forEach((item) => {
        if (typeof this.processForm[item] === 'string') {
          this.processForm[item] = ''
        } else if (
          typeof this.processForm[item] === 'object' &&
          Array.isArray(this.processForm[item])
        ) {
          this.processForm[item] = []
        } else if (
          Object.prototype.toString.call(this.processForm[item]) ===
          '[object,object]'
        ) {
          this.processForm[item] = {}
        }
      })
      this.leafNodeIdList = []
      this.pageSize = 20
      this.currentPage = 1
      console.log(
        '打印重置信息',
        this.processForm,
        this.leafNodeIdList,
        this.pageSize,
        this.currentPage
      )
      this.handleFilter()
    },

    quicklyOutput() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        agencyId: '',
        api: this.processForm.api,
        applyNo: this.processForm.applyNo,
        displayIsvFlag: this.processForm.displayIsvFlag,
        leafNodeIdList: this.leafNodeIdList,
        // menuType: this.menuInstType,
        onlineOverStartTime: this.processForm.onlineOverTime[0],
        onlineOverEndTime: this.processForm.onlineOverTime[1],
        testOverStartTime: this.processForm.testOverTime[0],
        testOverEndTime: this.processForm.testOverTime[1],
        startOverStartTime: this.processForm.startOverTime[0],
        startOverEndTime: this.processForm.startOverTime[1],
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 1
      }
      reqExportProcessAgency(params).then(res => {
        if (res.status === 200) {
          const name = '机构端市场机构统计流程查询' + '.xlsx'
          loading.close()
          downloadFile(res.data, name)
        } else {
          this.$message.error('下载失败!')
          loading.close()
        }
      })
    },
    // 导出Excel
    async outputExcel() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        agencyId: '',
        api: this.processForm.api,
        applyNo: this.processForm.applyNo,
        displayIsvFlag: this.processForm.displayIsvFlag,
        leafNodeIdList: this.leafNodeIdList,
        // menuType: this.menuInstType,
        onlineOverStartTime: this.processForm.onlineOverTime[0],
        onlineOverEndTime: this.processForm.onlineOverTime[1],
        testOverStartTime: this.processForm.testOverTime[0],
        testOverEndTime: this.processForm.testOverTime[1],
        startOverStartTime: this.processForm.startOverTime[0],
        startOverEndTime: this.processForm.startOverTime[1],
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 0
      }
      reqExportProcessAgency(params).then(res => {
        if (res.status === 200) {
          const name = '机构端市场机构统计流程查询' + '.xlsx'
          loading.close()
          downloadFile(res.data, name)
        } else {
          this.$message.warning('请使用快速导出')
          loading.close()
        }
      })
    },

    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 0 ? 'custom-header' : ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 0 ? 'custom-cell' : ''
    },

    onChangeColumnChecked() {},

    //

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

    // 接口筛选对话框取消
    cancelSelectInterface() {
      this.dialogTableVisible = false
    },

    // 接口筛选对话框确定
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
        menuInstType: '00'
      }
      // 回显保存状态——调接口
      const { code, data } = await reqRebackProductTreeStatic(params)
      if (code === 'ACK') {
        this.originData = data.nodeList
        this.tableColumns = data.headList
        this.tableLoading = false
      }
    },

    // 获取树节点
    getMenu(str) {
      str = this.menuInstType
      console.log('str', str)
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
