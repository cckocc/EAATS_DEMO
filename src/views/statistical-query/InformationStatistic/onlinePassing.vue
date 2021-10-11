<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="OnlinePassForm"
          label-position="top"
          :model="OnlinePassForm"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="服务单号">
                <el-input
                  v-model="OnlinePassForm.applyNo"
                  class="fixed_width"
                  placeholder="请输入服务单号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机构名称">
                <el-input
                  v-model="OnlinePassForm.agencyName"
                  class="fixed_width"
                  placeholder="请输入机构名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上线时间">
                <el-date-picker
                  v-model="OnlinePassForm.onlineOverTime"
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
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="验收通过时间">
                <el-date-picker
                  v-model="OnlinePassForm.testOverTime"
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
              <el-form-item label="服务开通（权限变更）通过时间">
                <el-date-picker
                  v-model="OnlinePassForm.startOverTime"
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
              <el-form-item label="Api账号">
                <el-input
                  v-model="OnlinePassForm.api"
                  class="fixed_width"
                  placeholder="请输入Api账号"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item>
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
            <el-table-column
              v-if="columnCheckedList.indexOf('agencyName') >= 0"
              show-overflow-tooltip
              prop="agencyName"
              label="机构名称"
              align="center"
              width="150"
            />
            <el-table-column
              v-if="columnCheckedList.indexOf('api') >= 0"
              prop="api"
              label="api账号"
              align="center"
              width="150"
            />

            <el-table-column align="center" :min-width="columnCheckedList.length*200">
              <template #header>
                <SearhTreeSlot
                  :origin-data="[]"
                  :show-extra-column="columnCheckedList"
                  :table-columns="TableheadList"
                  :extra-column-obj="extraColumnObj"
                  extra-column
                />
              </template>
              <template slot-scope="scope">
                <SearhTreeSlot
                  :show-extra-column="columnCheckedList"
                  :origin-data="scope.row.onlinePassNodeList"
                  :table-columns="TableheadList"
                  :is-show-table-head="false"
                  :extra-column-obj="scope.row.extraColumnObj"
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
  reqQueryOnlineInsti,
  reqExportOnlineInsti
} from '@/api/statisticalQuery/statistic'

import { downloadFile } from '@/utils'

import SearhTreeSlot from '../components-slot/search_tree_slot'
import { reqGetProductTree, reqRebackProductTreeStatic } from '@/api/email/contact'

export default {
  name: 'Process',
  components: {
    SearhTreeSlot
  },
  data() {
    return {
      height: 200,
      OnlinePassForm: {
        applyNo: '',
        agencyName: '',
        onlineOverTime: null,
        onlineOverStartTime: '',
        onlineOverEndTime: '',
        testOverTime: null,
        testOverStartTime: '',
        testOverEndTime: '',
        startOverTime: null,
        startOverStartTime: '',
        startOverEndTime: '',
        api: ''
      },
      searchForm: {
        applyNo: '',
        agencyName: '',
        onlineOverTime: null,
        onlineOverStartTime: '',
        onlineOverEndTime: '',
        testOverTime: null,
        testOverStartTime: '',
        testOverEndTime: '',
        startOverTime: null,
        startOverStartTime: '',
        startOverEndTime: '',
        api: ''
      },

      leafNodeIdList: [],

      columnCheckedList: ['agencyName', 'api', '产品类型', '数据内容', 'onlineOverTime',
        'onlineApplyNo', 'testOverTime', 'testApplyNo', 'startOverTime', 'startApplyNo'],
      overallQueryList: [
        // { label: '机构名称', value: 'agencyName', width: '170' },
        // { label: 'api账号', value: 'api', width: '170' },
        // { label: '产品类型', value: '产品类型', width: '170' },
        // { label: '数据内容', value: '数据内容', width: '170' },
        { label: '上线时间', value: 'onlineOverTime', width: '170' },
        { label: '上线服务单号', value: 'onlineApplyNo', width: '170' },
        { label: '验收通过时间', value: 'testOverTime', width: '170' },
        { label: '验收服务单号', value: 'testApplyNo', width: '170' },
        { label: '服务开通(权限变更)通过时间', value: 'startOverTime', width: '170' },
        { label: '服务开通(权限变更)服务单号', value: 'startApplyNo', width: '170' }
      ],

      title: '接口筛选',
      dialogTableVisible: false,
      tableLoading: false,
      originData: [],
      tableColumns: [],

      menuInstType: '10',
      loading: false,
      tableDataList: [],
      TableheadList: [],
      extraColumnObj: {
        columns: [
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
      this.searchForm = JSON.parse(JSON.stringify(this.OnlinePassForm))
      this.onQuery(this.searchForm)
    },
    async onQuery() {
      this.loading = true
      const params = {
        agencyId: '',
        agencyName: this.OnlinePassForm.agencyName,
        api: this.OnlinePassForm.api,
        applyNo: this.OnlinePassForm.applyNo,
        leafNodeIdList: this.leafNodeIdList,
        onlineOverStartTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[0] : '',
        onlineOverEndTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[1] : '',
        testOverStartTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[0] : '',
        testOverEndTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[1] : '',
        startOverStartTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[0] : '',
        startOverEndTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[1] : '',
        page: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await reqQueryOnlineInsti(params)
      if (res.code === 'ACK') {
        this.tableDataList = res.data.bodyData.list
        this.tableDataList.forEach((e) => {
          var extraInfoList = this.lookForNode(e.onlinePassNodeList)
          console.log(22222222, extraInfoList)
          e.extraColumnObj = {
            columns: [
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

          console.log('e.extraColumnObj', e.extraColumnObj)
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
              var onlineOverTimeList = []
              var onlineApplyNoList = []
              var testOverTimeList = []
              var testApplyNoList = []
              var startOverTimeList = []
              var startApplyNoList = []
              if (item.extraInfoList && item.extraInfoList.length > 0) {
                item.extraInfoList.forEach((extra) => {
                  // extra.chidrenList = []
                  onlineOverTimeList.push(extra.onlineOverTime)
                  onlineApplyNoList.push(extra.onlineApplyNo)

                  testOverTimeList.push(extra.testOverTime)
                  testApplyNoList.push(extra.testApplyNo)

                  startOverTimeList.push(extra.startOverTime)
                  startApplyNoList.push(extra.startApplyNo)
                  // extra.list = sss
                })
              }

              const nodeList = [
                { thName: 'onlineOverTime', list: onlineOverTimeList },
                { thName: 'onlineApplyNo', list: onlineApplyNoList },
                { thName: 'testOverTime', list: testOverTimeList },
                { thName: 'testApplyNo', list: testApplyNoList },
                { thName: 'startOverTime', list: startOverTimeList },
                { thName: 'startApplyNo', list: startApplyNoList }
              ]
              newArr.push(nodeList)
            // newArr.push(list)
            // if (item.extraInfoList.length > 0) {
            //   item.isLeafFlg = {
            //     code: '0',
            //     name: 'NO',
            //     text: '否'
            //   }
            // }
            // item.chidrenList = item.extraInfoList
            // newArr = item.extraInfoList[0].list
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
      Object.keys(this.OnlinePassForm).forEach((item) => {
        if (typeof this.OnlinePassForm[item] === 'string') {
          this.OnlinePassForm[item] = ''
        } else if (
          typeof this.OnlinePassForm[item] === 'object' &&
          Array.isArray(this.OnlinePassForm[item])
        ) {
          this.OnlinePassForm[item] = []
        } else if (
          Object.prototype.toString.call(this.OnlinePassForm[item]) ===
          '[object,object]'
        ) {
          this.OnlinePassForm[item] = {}
        }
      })
      this.leafNodeIdList = []
      this.pageSize = 20
      this.currentPage = 1
      console.log(
        '打印重置信息',
        this.OnlinePassForm,
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
        agencyName: this.OnlinePassForm.agencyName,
        api: this.OnlinePassForm.api,
        applyNo: this.OnlinePassForm.applyNo,
        leafNodeIdList: this.leafNodeIdList,
        // menuType: this.menuInstType,
        onlineOverStartTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[0] : '',
        onlineOverEndTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[1] : '',
        testOverStartTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[0] : '',
        testOverEndTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[1] : '',
        startOverStartTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[0] : '',
        startOverEndTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[1] : '',
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 1
      }
      reqExportOnlineInsti(params).then(res => {
        if (res.status === 200) {
          const name = '场务端信息商统计上线通过查询' + '.xlsx'
          downloadFile(res.data, name)
          loading.close()
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
        agencyName: this.OnlinePassForm.agencyName,
        api: this.OnlinePassForm.api,
        applyNo: this.OnlinePassForm.applyNo,
        leafNodeIdList: this.leafNodeIdList,
        // menuType: this.menuInstType,
        onlineOverStartTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[0] : '',
        onlineOverEndTime: this.searchForm.onlineOverTime ? this.searchForm.onlineOverTime[1] : '',
        testOverStartTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[0] : '',
        testOverEndTime: this.searchForm.testOverTime ? this.searchForm.testOverTime[1] : '',
        startOverStartTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[0] : '',
        startOverEndTime: this.searchForm.startOverTime ? this.searchForm.startOverTime[1] : '',
        page: this.currentPage,
        pageSize: this.pageSize,
        isQuick: 0
      }
      reqExportOnlineInsti(params).then(res => {
        const name = '场务端信息商统计上线通过查询' + '.xlsx'
        downloadFile(res.data, name)
      }).finally(() => {
        loading.close()
      })
    },

    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 2 ? 'custom-header' : ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 2 ? 'custom-cell' : ''
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
