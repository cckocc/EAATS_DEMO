<template>
  <!-- 预约量及评分统计查询 -->
  <div class="booking-quantity-score">
    <div class="content">
      <el-card class="box-card">
        <el-form ref="quantityScoreForm" :model="quantityScoreForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="验收人名">
                <el-select
                  v-model="quantityScoreForm.userId"
                  placeholder="全部"
                  filterable
                  clearable
                  remote
                >
                  <el-option v-for="(item, index) in accepterList" :key="index" :label="item.name" :value="item.userId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预约量">
                <div class="booking_input">
                  <el-input
                    v-model="quantityScoreForm.minAllocatedQuantity"
                    type="text"
                  />
                  <span class="text">至</span>
                  <el-input
                    v-model="quantityScoreForm.maxAllocatedQuantity"
                    type="text"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评分">
                <div class="score_input">
                  <input v-model="quantityScoreForm.minScore" type="text">
                  <span class="text">至</span>
                  <input v-model="quantityScoreForm.maxScore" type="text">
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="验收时间">
                <el-date-picker
                  v-model="quantityScoreForm.acceptanceTime"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :clearable="false"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" @click="handleFilter()">查询</el-button>
                <el-button @click="onReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="table-card">
        <el-form ref="form2" :model="bookingForm" class="form2">
          <el-row>
            <el-col :span="5">
              <el-form-item label="预约量是否展示给机构">
                <el-switch v-model="bookingForm.showQuantity" active-value="1" inactive-value="0" @change="openSwitch" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="评分是否展示给机构">
                <el-switch v-model="bookingForm.showScore" active-value="1" inactive-value="0" @change="openSwitchScore" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div style="display:flex;justify-content: center;margin-top:7px;cursor: pointer;" @click="outputExcel">
                <img src="~@/assets/style/doc_icon.svg" style="width:16px;height:16px;margin-right:8px;" alt="">
                <span style="height:16px"> 导出Excel</span>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!-- :cell-style="{ textAlign: 'center' }"
:header-cell-style="{textAlign: 'center'}"-->
        <el-table
          :data="acceptanceScoreList"
          style="width: 100%"
          :header-cell-style="{background:'#F5F7FA',color:'#000'}"
        >
          <el-table-column
            prop="testDate"
            label="验收时间"
            width="240"
          />
          <el-table-column
            prop="name"
            label="验收人"
          />
          <el-table-column
            prop="allocatedQuantity"
            label="预约量"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.allocatedQuantity && scope.row.allocatedQuantity!==0"> {{ scope.row.allocatedQuantity }}</span>
              <span v-else> 暂无</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="评分"
            width="300px"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.score === '' || scope.row.score === null || scope.row.score === 'undefined'">暂无</span>
              <div v-else>
                <el-row>
                  <el-col :span="16">
                    <el-rate
                      v-model="scope.row.scorePage"
                      disabled
                      text-color="#ff9900"
                      void-color="#99A8B7"
                      disabled-void-color="#99A8B7"
                      :max="5"
                      score-template="{value}"
                    />
                  </el-col>
                  <el-col :span="6">
                    <span style="color:#ff9900;font-size: 20px">{{ scope.row.score + '分' }}</span>
                    <!-- <span style="color:#ff9900;font-size: 20px">{{ scope.row.score >0 ? (scope.row.score/10).toFixed(1) + '分' :scope.row.score + '分' }}</span> -->

                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column />
        </el-table>

        <el-pagination
          style="display:flex;justify-content:flex-end;margin-top:17px"
          :current-page="pageMsg.page"
          :page-sizes="[ 10,20,30,40]"
          :page-size="pageMsg.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

      </el-card>
    </div>
  </div>
</template>

<script>
import { reqAccepterDownList, reqQuantityAndScore, reqQuantitySwitch, getScoreSwitch, reqShowScoreInterface, reqShowQuantityInterface } from '@/api/acceptance/resourceController'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'BookingQuantityScore',
  data() {
    return {
      quantityScoreForm: {
        userId: '',
        minAllocatedQuantity: '',
        maxAllocatedQuantity: '',
        minScore: '',
        maxScore: '',
        acceptanceTime: []
      },
      searchForm: {
        userId: '',
        minAllocatedQuantity: '',
        maxAllocatedQuantity: '',
        minScore: '',
        maxScore: '',
        acceptanceTime: []
      },
      isShow: false,
      bookingForm: {
        showQuantity: false,
        showScore: false
      },
      pageMsg: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      // 获取验收人员下拉框
      accepterList: [],
      acceptanceScoreList: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  created() {
    this.routerLinkCreated()
  },

  methods: {
    // 跳转该页面方法
    routerLinkCreated() {
      var now = new Date()
      var nowStr = now.getFullYear() + '-' + this.addZero(now.getMonth() + 1) + '-' + this.addZero(now.getDate())
      this.quantityScoreForm.acceptanceTime = [this.getPreMonth(now), nowStr]
      this.getQuantityInitValue()
      this.getSwitchScoreInitValue()
      this.getAccepterList()
      this.handleFilter()
    },
    addZero(day) {
      if (Number(day) < 10) {
        return '0' + day
      } else {
        return '' + day
      }
    },
    async getAccepterList() {
      const { data } = await reqAccepterDownList()
      console.log('获取验收人员列表', data)
      this.accepterList = data
    },

    // 查詢按钮
    async onQuery(searhForm) {
      console.log('searhForm===>', searhForm)
      try {
        const res = await reqQuantityAndScore({
          ...searhForm,
          ...this.pageMsg,
          startTime: searhForm.acceptanceTime &&
           searhForm.acceptanceTime.length >= 2
            ? searhForm.acceptanceTime[0]
            : '',
          endTime: searhForm.acceptanceTime &&
          searhForm.acceptanceTime.length >= 2
            ? searhForm.acceptanceTime[1]
            : ''
        })
        if (res.code === 'ACK') {
          // var oneList = [{
          //   testDate: '2012-20-1',
          //   score: 0.00
          // }, {
          //   testDate: '2012-20-1',
          //   score: 0.00
          // }]
          // this.acceptanceScoreList = oneList
          this.acceptanceScoreList = res.data.list
          if (this.quantityScoreForm.acceptanceTime !== []) {
            this.acceptanceScoreList.forEach(item => {
              item.testDate = this.quantityScoreForm.acceptanceTime[0] + '~' + this.quantityScoreForm.acceptanceTime[1]
            })
          }

          this.total = res.data.totalRecord
        }
        console.log('预约量及评分统计', res)
      } catch (error) {
        console.log(error)
      }
    },

    // 查询预约量开关当前值【0-不展示，1-展示】
    async getQuantityInitValue() {
      const res = await reqQuantitySwitch(Number(this.bookingForm.showQuantity))
      if (res.data) {
        this.bookingForm.showQuantity = res.data
      }
      console.log('预约量开关初始值', res.data)
    },

    // 预约量开关
    async  openSwitch() {
      console.log('==============>预约量开关初始值', this.bookingForm.showQuantity)
      const res = await reqShowQuantityInterface(Number(this.bookingForm.showQuantity))
      console.log('预约量开关', res)
      // this.$message({
      //   message: '保存成功',
      //   type: 'success'
      // })
    },

    // 查询评分开关当前值【0-不展示，1-展示】
    async getSwitchScoreInitValue() {
      const res = await getScoreSwitch()
      // const res = await getScoreSwitch(this.bookingForm.showScore)
      if (res.data) {
        this.bookingForm.showScore = res.data
      }
      console.log('评分开关初始值', res)
    },

    // 评分开关
    async  openSwitchScore() {
      console.log('———————————————————》评分是否展示给机构', this.bookingForm.showScore)
      const res = await reqShowScoreInterface(this.bookingForm.showScore)
      console.log('评分开关', res)
      // this.$message({
      //   message: '保存成功',
      //   type: 'success'
      // })
    },

    // 重置按钮
    onReset() {
      console.log('重置')
      // Object.keys(this.quantityScoreForm).forEach(item => {
      //   console.log(item)
      //   this.quantityScoreForm[item] = ''
      // })

      this.quantityScoreForm.userId = ''
      this.quantityScoreForm.minAllocatedQuantity = ''
      this.quantityScoreForm.maxAllocatedQuantity = ''
      this.quantityScoreForm.maxScore = ''
      this.quantityScoreForm.minScore = ''
      this.handleFilter()
    },
    getPreMonth(now) {
      var year = now.getFullYear() // 获取当前日期的年份
      var month = now.getMonth() + 1 // 获取当前日期的月份
      var day = now.getDate() + 1 // 获取当前日期的日
      // 获取当前日期中月的天数
      var year2 = year
      var month2 = parseInt(month) - 1
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      var t2 = year2 + '-' + month2 + '-' + this.addZero(day2)
      return t2
    },

    // 导出excel
    async outputExcel() {
      axios({
        method: 'post',
        url: `/cass/mgt/bvass/downLoad`,
        responseType: 'blob',
        headers: {
          'X-Auth-Token': getToken()
        },
        data: {
          ...this.quantityScoreForm,
          ...this.pageMsg,
          startTime: this.quantityScoreForm.acceptanceTime[0],
          endTime: this.quantityScoreForm.acceptanceTime[1]
        }
      }).then((res) => {
        var name = ''
        // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        if (this.quantityScoreForm !== '') {
          name = '预约量和评分统计' + '.xlsx' // 下载后文件名
        } else {
          name = '预约量和评分统计' + '.csv' // 下载后文件名
        }

        // if (this.listQueryView.exportType === '1') {
        //   name = '导出文件' + new Date().getTime() + '.xls'; // 下载后文件名
        // } else {
        //   name = '导出文件' + new Date().getTime() + '.csv'; // 下载后文件名
        // }
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
          downloadElement.onclick = function() {
            document.body.removeChild(downloadElement)
          }
          downloadElement.click()
        // downloadElement.click(); // 点击下载
        // document.body.removeChild(downloadElement); // 下载完成移除元素
        // window.URL.revokeObjectURL(href); // 释放掉blob对象
        }
      }).catch(error => {
        console.log(error)
      })
    },

    chooseScore(args, param) {
      console.log('args=======>', args, param)
    },

    handleSizeChange(val) {
      this.pageMsg.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.quantityScoreForm)) {
        this.onQuery(this.searchForm)
      } else {
        this.quantityScoreForm = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageMsg.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.quantityScoreForm)) {
        this.onQuery(this.searchForm)
      } else {
        this.quantityScoreForm = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleFilter() {
      // var numCheck = /^[+]{0,1}(\d+)$/
      var numCheck = /^[0-9]\d{0,}$/

      var scoreNumCheck = /^\d+(\.{0,1}\d+){0,1}$/

      if (this.quantityScoreForm.minAllocatedQuantity) {
        if (!numCheck.test(this.quantityScoreForm.minAllocatedQuantity)) {
          this.$message({
            message: '预约量请输入非负整数',
            type: 'warning'
          })
          return false
        }
      }

      if (this.quantityScoreForm.maxAllocatedQuantity) {
        if (!numCheck.test(this.quantityScoreForm.maxAllocatedQuantity)) {
          this.$message({
            message: '预约量请输入非负整数',
            type: 'warning'
          })
          return false
        }
      }

      if (this.quantityScoreForm.minScore) {
        if (!scoreNumCheck.test(this.quantityScoreForm.minScore)) {
          this.$message({
            message: '评分请输入非负数',
            type: 'warning'
          })
          return false
        }
      }

      if (this.quantityScoreForm.maxScore) {
        if (!scoreNumCheck.test(this.quantityScoreForm.maxScore)) {
          this.$message({
            message: '评分请输入非负数',
            type: 'warning'
          })
          return false
        }
      }

      // if (this.quantityScoreForm.maxAllocatedQuantity && this.quantityScoreForm.minAllocatedQuantity) {
      //   if (this.quantityScoreForm.maxAllocatedQuantity < this.quantityScoreForm.minAllocatedQuantity) {
      //     this.$message({
      //       message: '输入范围错误，请检查输入！',
      //       type: 'warning'
      //     })
      //     return false
      //   }
      // }

      // if (this.quantityScoreForm.minScore && this.quantityScoreForm.maxScore) {
      //   if (this.quantityScoreForm.minScore > this.quantityScoreForm.maxScore) {
      //     this.$message({
      //       message: '输入范围错误，请检查输入！',
      //       type: 'warning'
      //     })
      //     return false
      //   }
      // }
      if (this.quantityScoreForm.minScore && this.quantityScoreForm.maxScore) {
        if (Number(this.quantityScoreForm.minScore) > Number(this.quantityScoreForm.maxScore)) {
          this.$message({
            message: '输入范围错误，请检查输入！',
            type: 'warning'
          })
          return false
        }
      }
      if (this.quantityScoreForm.maxAllocatedQuantity && this.quantityScoreForm.minAllocatedQuantity) {
        if (Number(this.quantityScoreForm.maxAllocatedQuantity) < Number(this.quantityScoreForm.minAllocatedQuantity)) {
          this.$message({
            message: '输入范围错误，请检查输入！',
            type: 'warning'
          })
          return false
        }
      }

      this.pageMsg.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.quantityScoreForm))
      this.onQuery(this.searchForm)
    }
  }
}
</script>

<style lang='scss' >
.booking-quantity-score {
  .el-input{
  width: 280px;
  height: 30px;
}

.booking_input, .score_input{
  width: 290px;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #E6E6E6;
  opacity: 1;
  display: inline-flex;

  input{
    width: 136px;
    height: 26px;
    border: none;
  }
  .text{
    width: 14px;
    height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 24px;
    color: #303030;
    opacity: 1;
  }
}

.el-range-editor--medium.el-input__inner{
   width: 280px;
   height: 30px;
 }

.table-card{
  margin-top: 16px;
  margin-bottom: 20px;
  .form2{
    // background-color:pink;
    .export_excel{
      width: 61px;
      height: 19px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 19px;
      color: #333333;
      opacity: 1;
      border: none;
    }
  }
}

.el-button{
  border-radius: 5px;
}

  .el-table--border th{
    background: #F6F7FB;
    opacity: 1;
  }

  .el-pagination__editor.el-input{
    width: 50px;
  }

  .el-range-editor .el-range-input{
    width: 100px;
  }
}
</style>

<style>
.booking-quantity-score .content .table-card .el-icon-star-on {
  font-size: 24px;
}
</style>
