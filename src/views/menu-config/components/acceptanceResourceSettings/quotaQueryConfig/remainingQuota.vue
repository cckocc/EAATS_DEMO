<template>
  <!-- 场务端剩余名额统计查询 -->
  <div class="content">
    <el-card class="box-card">
      <el-form ref="form" :model="form" label-width="110px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="验收人名">
              <el-select
                v-model="form.accepterId"
                filterable
                clearable
                placeholder="--请选择--"
              >
                <el-option
                  v-for="(item, index) in accepterList"
                  :key="index"
                  :label="item.name"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="form.dateRange"
                :clearable="true"
                type="daterange"
                range-separator="至"
                start-placeholder="--开始日期--"
                end-placeholder="--结束日期--"
                style="width: 350px; height: 30px"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="支持接口类型">
              <el-select
                v-model="form.formAbbr"
                filterable
                clearable
                placeholder="--请选择--"
              >
                <el-option
                  v-for="(item, index) in interfaceList"
                  :key="index"
                  :label="item.formAbbr"
                  :value="item.formAbbr"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item>
              <el-button
                type="primary"
                style="margin-left: 40px"
                @click="handleFilter"
              >查询</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="exportTable">
      <div
        style="width: 130px; display: flex; margin: 20px; cursor: pointer"
        @click="exportRemainMessage"
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
        >
        <span style="height: 16px"> 导出Excel</span>
      </div>
      <el-table
        :data="acceptanceLevelList"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F7FA', color: '#000' }"
      >
        <el-table-column prop="confDate" label="日期" width="196px" />
        <el-table-column prop="name" label="验收人" width="162px" />
        <el-table-column
          prop="quantity"
          label="验收等级对应配置名额（普通用户+VIP）"
          width="410px"
        />
        <el-table-column
          prop="surplus"
          label="验收等级对应目前剩余名额（普通用户+VIP）"
          width="406px"
        />
      </el-table>

      <el-pagination
        style="display: flex; justify-content: flex-end; margin-top: 17px"
        :current-page="pageMsg.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageMsg.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { reqAllAccepters, reqAllInterfaces, ReqQueryConditions } from '@/api/acceptance/resourceController.js'
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'RemainingQuota',
  data() {
    return {
      form: {
        accepterId: '',
        dateRange: [],
        formAbbr: ''
      },
      searchForm: {
        accepterId: '',
        dateRange: [],
        formAbbr: ''
      },
      // 所有验收人列表
      accepterList: [],

      // 所有支持接口类型列表
      interfaceList: [],

      // 表格初始化数据
      acceptanceLevelList: [],
      total: 0,
      pageMsg: {
        page: 1,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created() {
    this.routerLinkCreated()
  },
  methods: {
    routerLinkCreated() {
      this.getAllAccepterList()
      this.getAllSupportInterfaceList()
      this.form.accepterId = ''
      this.form.formId = ''
      this.handleFilter()
      this.form.dateRange = [this.getCurrentTime(), this.getNextMonth()]
      this.searchForm = JSON.parse(JSON.stringify(this.form))
    },
    getCurrentTime() {
      const newArr = new Date()
        .toLocaleDateString()
        .split('/')
        .map((item) => {
          if (item.length === 1) {
            item = '0' + item
          }
          return item
        })
        .join('-')
      return newArr
    },
    getNextMonth() {
      const currentTime = new Date().getTime() - 3600 * 24 * 1000
      const date = new Date(currentTime)
        .toLocaleDateString()
        .split('/')
        .join('-')
      const arr = date.split('-')
      const year = arr[0] // 获取当前日期的年份
      const month = arr[1] // 获取当前日期的月份
      const day = arr[2] // 获取当前日期的日
      // let days = new Date(year, month, 0)
      // days = days.getDate() // 获取当前日期中的月的天数
      let year2 = year
      let month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      day2 = day2.length === 1 ? '0' + day2 : day2

      const t2 = year2 + '-' + month2 + '-' + day2
      return t2
    },

    handleFilter() {
      this.pageMsg.page = 1
      if (this.form.dateRange === null || this.form.dateRange.length === 0) {
        this.form.dateRange = ['', '']
      }
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.onQueryConditions(this.searchForm)
    },
    // 获取验收人员列表
    async getAllAccepterList() {
      const res = await reqAllAccepters()
      console.log('剩余人员页面获取所有验收人', res.data)
      // let newArr = res.data.forEach(item => {
      //   if (item && item.formAbbr) {
      //    newArr.push
      //   }
      // })
      // console.log('=====>', newArr)
      this.accepterList = res.data

      // this.refs.PersonnelManagement.GetPersonList()
    },

    // 获取所有支持接口类型
    async getAllSupportInterfaceList() {
      try {
        const res = await reqAllInterfaces()
        console.log('获取所有支持接口类型=====>', res)
        if (res.code === 'ACK') {
          this.interfaceList = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 场务端剩余名额统计查询-条件筛选查询
    async onQueryConditions(searchForm) {
      try {
        // 传参
        const res = await ReqQueryConditions({
          ...searchForm,
          ...this.pageMsg,
          startTime: searchForm.dateRange[0],
          endTime: searchForm.dateRange[1]
        })
        console.log('剩余名额统计查询-条件筛选查询', res)
        if (res.code === 'ACK') {
          this.acceptanceLevelList = res.data.list
          this.total = res.data.totalRecord
          //   this.$message({
          //     type: 'success',
          //     message: '查询成功'
          //   })
          // } else {
          //   this.$message({
          //     type: 'error',
          //     message: res.message || '查询失败'
          //   })
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 场务端剩余名额统计查询-导出(导出条件筛选后的数据)
    async exportRemainMessage() {
      axios({
        headers: {
          'X-Auth-Token': getToken()
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: `/cass/mgt/remaining/download`,
        responseType: 'blob',
        data: {
          ...this.form,
          ...this.pageMsg,
          startTime: this.form.dateRange[0],
          endTime: this.form.dateRange[1]
        }
      })
        .then((res) => {
          var name = ''
          // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          })
          if (this.form !== '') {
            name = '剩余名额统计表' + '.xlsx' // 下载后文件名
          } else {
            name = '剩余名额统计表' + '.csv' // 下载后文件名
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
            downloadElement.onclick = function() {
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
    },

    handleSizeChange(val) {
      this.pageMsg.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQueryConditions(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQueryConditions(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageMsg.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQueryConditions(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQueryConditions(this.searchForm)
      }
    },

    onReset() {
      console.log('重置')
      Object.keys(this.form).forEach((item) => {
        console.log(item)
        this.form[item] = ''
      })
      this.handleFilter()
    }
  }
}
</script>

<style lang='scss'>
.content {
  .exportTable {
    margin-top: 24px;
    border: 1px solid #dfdfdf;
    margin-bottom: 20px;

    .export {
      display: block;
      height: 62px;
      line-height: 62px;
      .text {
        width: 61px;
        height: 19px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 19px;
        color: #333333;
        opacity: 1;
      }
    }
  }

  .el-button {
    border-radius: 5px;
  }
  .el-table--border th {
    background: #f6f7fb;
    opacity: 1;
  }
}
</style>
