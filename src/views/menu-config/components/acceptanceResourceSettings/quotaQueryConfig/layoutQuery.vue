<template>
  <!-- 场务端验收排布统计查询 -->
  <div class="layout-statistics-query">
    <div class="content">
      <div style="float: left; margin: 20px auto 20px">
        <div
          style="
            width: 130px;
            display: flex;
            margin-bottom: 20px;
            cursor: pointer;
          "
          @click="getOutputExcel"
        >
          <img
            src="~@/assets/style/doc_icon.svg"
            style="
              width: 16px;
              height: 16px;
              margin-right: 8px;
              margin-left: 20px;
            "
            alt=""
          />
          <span style="height: 16px"> 导出Excel</span>
        </div>

        <div class="table_box">
          <div class="table_heade">
            <span>
              <img
                class="arrow"
                src="~@/assets/style/layoutStatisticsQuery/ysyy_arrow_left_n.svg"
                @click="JumpToLastWeek"
              />
              <span class="cycle"> {{ start }}-{{ end }} </span>
              <img
                class="arrow"
                src="~@/assets/style/layoutStatisticsQuery/ysyy_arrow_left_n(1).svg"
                @click="JumpToNextWeek"
              />
            </span>
            <div
              class="main-body-bottom-btn-right"
              style="position: absolute; top: 13px; right: 20px"
            >
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
                      v-for="item in uploadTypeList"
                      :key="item.value"
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
          <div class="table_content">
            <el-table
              :data="personList"
              :span-method="objectSpanMethod"
              :cell-class-name="addClass"
              :header-cell-class-name="addHeaderClass"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="验收人员"
                width="180"
                align="center"
              />
              <el-table-column
                v-if="isShowObj['1']"
                prop="one"
                :label="'周一(' + addDay(0) + ')'"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.one"
                    :class="[
                      scope.row.one.split('-')[0] === 'vip' ||
                      scope.row.one.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.one === '普通-待排' ? 'cell-font-color-to' : '',
                    ]"
                    >{{ scope.row.one }}</span
                  >
                  <!-- -->
                  <span v-else>- </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['2']"
                prop="two"
                :label="'周二(' + addDay(1) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.two"
                    :class="[
                      scope.row.two.split('-')[0] === 'vip' ||
                      scope.row.two.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.two === '普通-待排' ? 'cell-font-color-to' : '',
                    ]"
                    >{{ scope.row.two }}</span
                  >
                  <!-- row.seven === '普通-待排' -->
                  <!-- -->
                  <span v-else>- </span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['3']"
                prop="three"
                :label="'周三(' + addDay(2) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.three"
                    :class="[
                      scope.row.three.split('-')[0] === 'vip' ||
                      scope.row.three.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.three === '普通-待排'
                        ? 'cell-font-color-to'
                        : '',
                    ]"
                    >{{ scope.row.three }}</span
                  >
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['4']"
                prop="four"
                :label="'周四(' + addDay(3) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.four"
                    :class="[
                      scope.row.four.split('-')[0] === 'vip' ||
                      scope.row.four.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.four === '普通-待排'
                        ? 'cell-font-color-to'
                        : '',
                    ]"
                    >{{ scope.row.four }}</span
                  >
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['5']"
                prop="five"
                :label="'周五(' + addDay(4) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.five"
                    :class="[
                      scope.row.five.split('-')[0] === 'vip' ||
                      scope.row.five.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.five === '普通-待排'
                        ? 'cell-font-color-to'
                        : '',
                    ]"
                    >{{ scope.row.five }}</span
                  >
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['6']"
                prop="six"
                :label="'周六(' + addDay(5) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.six"
                    :class="[
                      scope.row.six.split('-')[0] === 'vip' ||
                      scope.row.six.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      scope.row.six === '普通-待排' ? 'cell-font-color-to' : '',
                    ]"
                    >{{ scope.row.six }}</span
                  >
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isShowObj['7']"
                prop="seven"
                :label="'周日(' + addDay(6) + ')'"
                align="center"
                ><template slot-scope="scope">
                  <span
                    v-if="scope.row.seven"
                    :class="[
                      scope.row.seven.split('-')[0] === 'vip' ||
                      scope.row.seven.split('-')[0] === 'VIP'
                        ? 'cell-font-color'
                        : '',
                      ,
                      scope.row.seven === '普通-待排'
                        ? 'cell-font-color-to'
                        : '',
                    ]"
                    >{{ scope.row.seven }}</span
                  >
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLayoutList } from '@/api/acceptance/resourceController'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'LayoutStatisticsQuery',
  data() {
    return {
      layoutList: [],
      start: '',
      end: '',
      weekForm: {
        selectWeek: [],
      },
      layoutListQuery: {
        startTime: '',
        endTime: '',
        startPage: '',
        endPage: '',
      },
      needMergeArr: [
        'name',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
      ], // 有合并项的列
      rowMergeArrs: {},
      personList: [],
      columnCheckedList: ['1', '2', '3', '4', '5', '6', '7'],
      isShowObj: {},
      uploadTypeList: [
        {
          label: '周一',
          value: '1',
        },
        {
          label: '周二',
          value: '2',
        },
        {
          label: '周三',
          value: '3',
        },
        {
          label: '周四',
          value: '4',
        },
        {
          label: '周五',
          value: '5',
        },
        {
          label: '周六',
          value: '6',
        },
        {
          label: '周日',
          value: '7',
        },
      ],
    }
  },
  created() {
    this.routerLinkCreated()
    this.onChangeColumnChecked()
  },
  mounted() {
    this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.personList)
  },
  methods: {
    addHeaderClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 0) {
        return 'hearder-cell-bg-next'
      }
    },
    addClass({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'name') {
        return 'cell-one'
      }
      if (column.property === 'one') {
        if (
          row.one &&
          (row.one.split('-')[0] === 'vip' || row.one.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.one && row.one === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'two') {
        if (
          row.two &&
          (row.two.split('-')[0] === 'vip' || row.two.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.two && row.two === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'three') {
        if (
          row.three &&
          (row.three.split('-')[0] === 'vip' ||
            row.three.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.three && row.three === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'four') {
        if (
          row.four &&
          (row.four.split('-')[0] === 'vip' || row.four.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.four && row.four === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'five') {
        if (
          row.five &&
          (row.five.split('-')[0] === 'vip' || row.five.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.five && row.five === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'six') {
        if (
          row.six &&
          (row.six.split('-')[0] === 'vip' || row.six.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.six && row.six === '普通-待排') {
          return 'cell-grey-to'
        }
      }
      if (column.property === 'seven') {
        if (
          row.seven &&
          (row.seven.split('-')[0] === 'vip' ||
            row.seven.split('-')[0] === 'VIP')
        ) {
          return 'cell-grey'
        }
        if (row.seven && row.seven === '普通-待排') {
          return 'cell-grey-to'
        }
      }
    },
    // 设置
    enterSettings() {
      console.log('设置')
    },
    onChangeColumnChecked(val) {
      this.uploadTypeList.forEach((item) => {
        this.isShowObj[item.value] = true
      })
      Object.keys(this.isShowObj).forEach((item) => {
        if (this.columnCheckedList.indexOf(item) !== -1) {
          this.isShowObj[item] = true
        } else {
          this.isShowObj[item] = false
        }
      })
      this.personList = JSON.parse(JSON.stringify(this.personList))
    },
    // 增加日期
    addDay(day) {
      var dateStart = new Date(this.layoutListQuery.startTime)
      dateStart.setDate(dateStart.getDate() + day)
      var resultTime =
        dateStart.getFullYear() +
        '-' +
        (dateStart.getMonth() + 1) +
        '-' +
        dateStart.getDate()
      return resultTime
    },
    // 跳转该页面方法
    routerLinkCreated() {
      var dateStart = new Date()
      // 本周一的日期
      dateStart.setDate(dateStart.getDate() - dateStart.getDay() + 1)
      this.layoutListQuery.startTime =
        dateStart.getFullYear() +
        '-' +
        (dateStart.getMonth() + 1) +
        '-' +
        dateStart.getDate()
      console.log('开始日期', dateStart.getDate())
      this.layoutListQuery.startTime =
        dateStart.getFullYear() +
        '-' +
        this.addZero(dateStart.getMonth() + 1) +
        '-' +
        this.addZero(dateStart.getDate())
      this.start =
        dateStart.getFullYear() +
        '年' +
        (dateStart.getMonth() + 1) +
        '月' +
        dateStart.getDate() +
        '日'
      // 本周末日期
      var dateEnd = new Date(this.layoutListQuery.startTime)
      dateEnd.setDate(dateEnd.getDate() + 6)
      this.layoutListQuery.endTime =
        dateEnd.getFullYear() +
        '-' +
        this.addZero(dateEnd.getMonth() + 1) +
        '-' +
        this.addZero(dateEnd.getDate())
      this.end =
        dateEnd.getFullYear() +
        '年' +
        (dateEnd.getMonth() + 1) +
        '月' +
        dateEnd.getDate() +
        '日'
      this.GetInitLayoutList()
    },
    addZero(day) {
      if (Number(day) < 10) {
        return '0' + day
      } else {
        return '' + day
      }
    },
    // 获取验收排布查询统计列表
    async GetInitLayoutList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      const res = await getLayoutList(this.layoutListQuery)
      if (res.code === 'ACK') {
        loading.close()
        this.personList = res.data
      }
    },

    // 导出excel
    async getOutputExcel() {
      console.log('导出excel')
      axios({
        method: 'post',
        url: `/cass/mgt/arrangement/statistics/download`,
        headers: {
          'X-Auth-Token': getToken(),
        },
        responseType: 'blob',
        data: {
          // endTime: '2021-03-14',
          // startTime: '2021-03-08'
          endTime: this.layoutListQuery.endTime,
          startTime: this.layoutListQuery.startTime,
        },
      })
        .then((res) => {
          var name = ''
          // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
          if (
            this.layoutListQuery.endTime !== '' &&
            this.layoutListQuery.startTime !== ''
          ) {
            name = '验收排布统计表' + '.xlsx' // 下载后文件名
            // name = '验收排布统计表' + new Date().getTime() + '.xls' // 下载后文件名
          } else {
            name = '验收排布统计表' + '.csv' // 下载后文件名
            // name = '验收排布统计表' + new Date().getTime() + '.csv' // 下载后文件名
          }
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, name)
          } else {
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob) // 创建下载的链接
            // console.log(href)
            // window.open(href)
            downloadElement.href = href
            downloadElement.download = name
            document.body.appendChild(downloadElement)
            downloadElement.onclick = function () {
              document.body.removeChild(downloadElement)
            }
            downloadElement.click()
            // downloadElement.click(); // 点击下载
            // document.body.removeChild(downloadElement); // 下载完成移除元素
            // window.URL.revokeObjectURL(href); // 释放掉blob对象
          }
        })
        .catch((error) => {
          console.log(error)
        })
      console.log('导出完成')
    },
    mergeAction(val, rowIndex, colData) {
      const _row = this.rowMergeArrs[val].rowArr[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return [_row, _col]
    },
    rowMergeHandle(arr, data) {
      if (!Array.isArray(arr) && !arr.length) return false
      if (!Array.isArray(data) && !data.length) return false
      const needMerge = {}
      arr.forEach((i) => {
        needMerge[i] = {
          rowArr: [],
          rowMergeNum: 0,
        }
        data.forEach((item, index) => {
          if (index === 0) {
            needMerge[i].rowArr.push(1)
            needMerge[i].rowMergeNum = 0
          } else {
            if (item[i] === data[index - 1][i]) {
              needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1
              needMerge[i].rowArr.push(0)
            } else {
              needMerge[i].rowArr.push(1)
              needMerge[i].rowMergeNum = index
            }
          }
        })
      })
      return needMerge
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (column.property === 'name')
      //   return this.mergeAction('name', rowIndex, column);
      // if (column.property === 'one')
      //   return this.mergeAction('one', rowIndex, column);
      // if (column.property === 'two')
      //   return this.mergeAction('two', rowIndex, column);
      // if (column.property === 'three')
      //   return this.mergeAction('three', rowIndex, column);
      // if (column.property === 'four')
      //   return this.mergeAction('four', rowIndex, column);
      // if (column.property === 'five')
      //   return this.mergeAction('five', rowIndex, column);
      // if (column.property === 'six')
      //   return this.mergeAction('five', rowIndex, column);
      // if (column.property === 'seven')
      //   return this.mergeAction('seven', rowIndex, column);
      if (column.property === 'name') {
        // 控制列合并行 //先看第一列怎么合并
        if (rowIndex === row.rowIndex) {
          return {
            rowspan: row.num,
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'one') {
        if (row.mergeNumArr[1] === 0) {
          return false
        } // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[1]) {
          return {
            rowspan: row.mergeNumArr[1],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'two') {
        if (row.mergeNumArr[2] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[2]) {
          return {
            rowspan: row.mergeNumArr[2],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'three') {
        if (row.mergeNumArr[3] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[3]) {
          return {
            rowspan: row.mergeNumArr[3],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'four') {
        if (row.mergeNumArr[4] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[4]) {
          return {
            rowspan: row.mergeNumArr[4],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'five') {
        if (row.mergeNumArr[5] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[5]) {
          return {
            rowspan: row.mergeNumArr[5],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'six') {
        if (row.mergeNumArr[6] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[6]) {
          return {
            rowspan: row.mergeNumArr[6],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      } else if (column.property === 'seven') {
        if (row.mergeNumArr[7] === 0) return false // 避免第一行重复合并
        if (rowIndex === row.mergeStartRowArr[7]) {
          return {
            rowspan: row.mergeNumArr[7],
            colspan: 1,
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          }
        }
      }
    },

    JumpToLastWeek() {
      var startDate = new Date(this.layoutListQuery.startTime)
      startDate.setDate(startDate.getDate() - 7)
      this.layoutListQuery.startTime =
        startDate.getFullYear() +
        '-' +
        this.addZero(startDate.getMonth() + 1) +
        '-' +
        this.addZero(startDate.getDate())
      this.start =
        startDate.getFullYear() +
        '年' +
        this.addZero(startDate.getMonth() + 1) +
        '月' +
        this.addZero(startDate.getDate()) +
        '日'
      var endDate = new Date(this.layoutListQuery.endTime)
      endDate.setDate(endDate.getDate() - 7)
      this.layoutListQuery.endTime =
        endDate.getFullYear() +
        '-' +
        this.addZero(endDate.getMonth() + 1) +
        '-' +
        this.addZero(endDate.getDate())
      this.end =
        endDate.getFullYear() +
        '年' +
        this.addZero(endDate.getMonth() + 1) +
        '月' +
        this.addZero(endDate.getDate()) +
        '日'

      this.GetInitLayoutList()
    },
    JumpToNextWeek() {
      //   appendZero(obj) {
      //   if (obj < 10) {
      //     return '0' + obj
      //   } else {
      //     return obj
      //   }
      // }
      var startDate = new Date(this.layoutListQuery.startTime)
      startDate.setDate(startDate.getDate() + 7)
      this.layoutListQuery.startTime =
        startDate.getFullYear() +
        '-' +
        this.addZero(startDate.getMonth() + 1) +
        '-' +
        this.addZero(startDate.getDate())
      this.start =
        startDate.getFullYear() +
        '年' +
        this.addZero(startDate.getMonth() + 1) +
        '月' +
        this.addZero(startDate.getDate()) +
        '日'
      var endDate = new Date(this.layoutListQuery.endTime)
      endDate.setDate(endDate.getDate() + 7)
      this.layoutListQuery.endTime =
        endDate.getFullYear() +
        '-' +
        this.addZero(endDate.getMonth() + 1) +
        '-' +
        this.addZero(endDate.getDate())
      this.end =
        endDate.getFullYear() +
        '年' +
        this.addZero(endDate.getMonth() + 1) +
        '月' +
        this.addZero(endDate.getDate()) +
        '日'
      this.GetInitLayoutList()
    },
  },
}
</script>

<style>
</style>
<style lang='scss'>
.layout-statistics-query {
  .table_box {
    width: 1220px;

    .table_heade {
      text-align: center;
      position: relative;
      height: 50px;
      border: 1px solid #dfdfdf;
      border-bottom: none;
      background-color: #ffffff;
      img.arrow {
        position: absolute;
        height: 24px;
        width: 24px;
        top: 13px;
      }
      .cycle {
        width: 189px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        opacity: 1;
        margin-left: 24px;
      }
    }
  }
  .el-table--border th {
    background: #f6f7fb;
    opacity: 1;
  }
}

.radio_column {
  display: flex;
  flex-direction: column;
}

.radio_column ::v-deep .is-bordered + .el-checkbox {
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 10px;
}

.self_popover ::v-deep .el-popover {
  min-width: auto;
}

.cell-grey {
  background-color: rgb(255, 251, 231);
}
.cell-grey-to {
  background-color: rgb(242, 246, 255);
}
.cell-font-color {
  color: rgb(226, 176, 10);
  font-weight: 500;
}
.cell-font-color-to {
  color: #0050b3;
  font-weight: 500;
}
.cell-one {
  background-color: #f6f7fb;
}
.hearder-cell-bg {
  background-color: #f6f7fb;
}
.hearder-cell-bg-next {
  background-color: #ffffff !important;
}
</style>
