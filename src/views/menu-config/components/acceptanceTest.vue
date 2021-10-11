<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="step-one"
    element-loading-text="正在发布，请稍后"
  >
    <div v-if="isActive">
      <el-form
        ref="searchForm"
        class="top-form"
        :model="mainObj.searchForm"
        label-width="80px"
        label-position="left"
        inline
      >
        <div class="top-main">
          <div class="top-main-left">
            <el-row>
              <el-col :span="8">
                <el-date-picker
                  v-model="mainObj.searchForm.confDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="--起始时间--"
                  end-placeholder="--结束时间--"
                  value-format="yyyy-MM-dd"
                />
              </el-col>
              <el-col :span="2" />
              <el-button
                size="mini"
                type="primary"
                :disabled="isEditor"
                @click="selectTable(mainObj.searchForm.confDate)"
              >查询</el-button>
              <el-col
                :span="8"
                style="float:right"
              >
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isEditor"
                  @click="toShowTable"
                >接口所占数量设置</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="toEditor"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="!isEditor"
                  @click="cancelTestEditor"
                >取消</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="!isEditor"
                  @click="updateTestFaceTime(mainObj.list)"
                >保存</el-button>
              </el-col>
            </el-row>
          </div>
          <el-divider />
        </div>
        <el-table
          :data="mainObj.list"
          border
          style="width: 100%"
          fit
          stripe
          highlight-current-row
          :header-row-style="{ height: '42px' }"
          :header-cell-style="{ padding: 0 }"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: 0 }"
        >
          <el-table-column
            prop="confDate"
            label="时间"
            min-width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.workDay==='1'">{{ scope.row.confDate }}</span>
              <span v-else>{{ scope.row.confDate }}<span style="color:blue">
                (非工作日)
              </span></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="allowQuantity"
            label="允许验收测试数量"
            min-width="280"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-input
                v-if="isEditor && scope.row.workDay==='1'"
                v-model="scope.row.allowQuantity"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
              /> -->
              <el-input
                v-if="isEditor && scope.row.workDay==='1'"
                v-model="scope.row.allowQuantity"
                oninput="value=value.replace(/^[^\d]/g,'')"
              />
              <span v-else>{{ scope.row.allowQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="laveQuantity"
            label="剩余可申请测试数量"
            min-width="280"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.laveQuantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div v-if="!isActive">
      <el-form
        ref="searchForm"
        class="top-form"
        label-width="80px"
        label-position="left"
        inline
      >
        <div class="top-main">
          <div class="top-main-left">
            <el-row>
              <el-col :span="8">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isEditor"
                  @click="toTest"
                >返回</el-button>
              </el-col>
              <el-col
                :span="5"
                style="float:right"
              >
                <el-button
                  size="mini"
                  type="primary"
                  @click="toEditor"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="!isEditor"
                  @click="cancelEditor"
                >取消</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="!isEditor"
                  @click="updateInterFace(tableObj.list)"
                >保存</el-button>
              </el-col>
            </el-row>
          </div>
          <el-divider />
        </div>
        <el-table
          :data="tableObj.list"
          border
          style="width: 100%"
          fit
          stripe
          highlight-current-row
          :header-row-style="{ height: '42px' }"
          :header-cell-style="{ padding: 0 }"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: 0 }"
        >
          <el-table-column
            prop="name"
            label="接口名称"
            min-width="280"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="maximumQuota"
            label="每日最多可安排名额"
            min-width="180"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-input
                v-if="isEditor"
                v-model="scope.row.maximumQuota"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
              /> -->
              <!-- <el-input
                v-if="isEditor"
                v-model="scope.row.maximumQuota"
                oninput="value=value.replace(/^0+|[^\d]/g,'')"
              /> -->
              <el-input
                v-if="isEditor"
                v-model="scope.row.maximumQuota"
                oninput="value=value.replace(/^[^\d]/g,'')"
              />
              <span v-else>{{ scope.row.maximumQuota }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="occupyQuantity"
            label="每个名额占用人员数量"
            min-width="180"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-input
                v-if="isEditor"
                v-model="scope.row.occupyQuantity"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
              /> -->
              <el-input
                v-if="isEditor"
                v-model="scope.row.occupyQuantity"
                oninput="value=value.replace(/^[^\d]/g,'')"
              />
              <span v-else>{{ scope.row.occupyQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="testQuantity"
            label="每个接口每天允许测试功能模块数量"
            min-width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-select
                v-if="isEditor"
                v-model="scope.row.testQuantity"
              >
                <el-option
                  v-for="(item,index) in testQuantityNum"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
              <span v-else>{{ scope.row.testQuantity ? scope.row.testQuantity: '无限制' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
import globalOptions from '@/utils/globalOptionsValue'
import tableTreeTd from './tableTreeTd'
import TableTree from '@/utils/table-tree'
import treeMethods from '@/utils/treeMethods'
import marketTab from './marketTab'
import {
  importExcel,
  getAddTree,
  getUUid,
  publishTree,
  selectTree,
  importMerketExcel
} from '@/api/menuConfig'
import { mapGetters } from 'vuex'
import { param, isEmpty } from '@/utils/index'

export default {
  name: 'ServiceApplication',
  components: {
    tableTreeTd,
    marketTab
  },
  data() {
    return {
      isActive: true,
      isEditor: false,
      editStatus: true,
      mainObj: {
        list: [],
        pageSize: 20,
        page: 1,
        endDate: '',
        // endDate: '',
        startDate: this.dateFormat(Date.now()),
        total: 0,
        searchForm: {
          confDate: ''
        }
      },
      testQuantityNum: globalOptions.testQuantityNum,
      tableObj: {
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      activeName: 'Market',
      loading: false,
      map: {},
      values: [],
      tableList: [],
      tableData: [], // 增加、删除、修改树节点，前端操作，发布时返回给后台
      visible: false,
      // nodeMark: [],
      top: 0,
      left: 0,
      selectedTag: {},
      selectedItem: {},
      accept: '.xlsx,.xls',
      marketData: []
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onChangeInput(val) {
      console.log(val)
    },
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' '
    },
    toShowTable() {
      this.isActive = false
      this.fetchTableData()
    },
    toTest() {
      this.isActive = true
    },
    toEditor() {
      this.isEditor = true
    },
    cancelTestEditor() {
      this.isEditor = false
      this.fetchData()
    },
    cancelEditor() {
      this.isEditor = false
      this.fetchTableData()
    },
    // 是否是周六或者周日
    weekTime(date) {
      // var dt = new Date()
      // console.log('date', date)
      if (getDay(date) == 0 || getDay(date) == 6) {
        // 0--sunday, 6--saturday
        return false
      } else {
        return true
      }
    },
    selectTable(date) {
      // console.log('date', date)
      this.mainObj.startDate = date[0]
      this.mainObj.endDate = date[1]
      this.fetchData()
    },
    updateTestFaceTime(val) {
      console.log('val', val)
      const emptyObj = val.find(e => isEmpty(e.allowQuantity))
      if (emptyObj) {
        this.$message({
          type: 'warning',
          message: `${emptyObj.confDate}允许验收测试数量不能为空`
        })
        return
      }
      gripManageApi.updateInterfaceTime(val).then(res => {
        if (res.code === 'ACK') {
          this.$alert('保存成功', '', {
            confirmButtonText: '确定',
            center: true
          })
          // this.$message({
          //   type: 'success',
          //   message: '保存成功!'
          // })
          this.fetchData()
          this.isEditor = false
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    updateInterFace(val) {
      console.log('val', val)

      gripManageApi.updateInterfaceTable(val).then(res => {
        if (res.code === 'ACK') {
          this.$alert('保存成功', '', {
            confirmButtonText: '确定'
          })
          // this.$message({
          //   type: 'success',
          //   message: '保存成功!'
          // })
          this.fetchTableData()
          this.isEditor = false
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    fetchTableData() {
      gripManageApi.getShowTable().then(res => {
        if (res.code === 'ACK') {
          this.tableObj.list = res.data
          // this.tableObj.total = res.data.totalRecord
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    fetchData() {
      const params = {
        page: this.mainObj.page,
        pageSize: this.mainObj.pageSize,
        endtime: this.mainObj.endDate,
        start: this.mainObj.startDate
      }
      gripManageApi.getInterfaceTime(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          // this.mainObj.total = res.data.totalRecord
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.step-one {
  padding: 37px;
  position: relative;
  ::v-deep.secondary-tabs {
    > .el-tabs__header {
      .el-tabs__nav {
        border-radius: 0;
        height: 41px;

        .el-tabs__item {
          color: #303030;
          font-size: 15px;

          &.is-active {
            border-top: 2px solid #2c76d1;
            font-weight: bold;
            color: #2c76d1;
          }
        }
      }
    }
  }
  .is-group {
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(48, 48, 48, 1);
  }
  .footer {
    text-align: center;
    display: block;
    margin-top: 40px;
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.contextmenu {
  margin: 0;
  width: 122px;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 10px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 0 1px 3px rgba(209, 213, 222, 0.8);
  li {
    margin: 0;
    padding: 11px 20px;
    font-size: 14px;
    color: #303030;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
