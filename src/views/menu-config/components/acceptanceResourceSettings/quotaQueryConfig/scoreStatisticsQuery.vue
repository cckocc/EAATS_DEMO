<template>
  <!-- 评分统计查询 -->
  <div class="score_statistics_query">
    <el-card class="msg_card">
      <el-form ref="form" :model="form" label-position="right" label-width="80px">

        <div class="outerBox">
          <div class="innerBox">
            <el-form-item label="接口简称">
              <el-input v-model="form.formAbbr" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item label="验收人" placeholder="搜索验收人">
              <el-input v-model="form.accepter" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item label="服务编号">
              <el-input v-model="form.applyNo" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item label="反馈日期">
              <div style="display: inline-table;width:300px">
                <el-date-picker
                  v-model="form.date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  text-format="yyyy-MM-dd"
                  type="datetimerange"
                  style="width:100%;height:30px"
                  range-separator="至"
                  start-placeholder="--起始日期--"
                  end-placeholder="--结束日期--"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </div>
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item label="申请人">
              <el-input v-model="form.applyName" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item v-if="isShow" label="问题类型">
              <el-select v-model="form.configType" placeholder="--请选择问题类型--">
                <el-option
                  v-for="item in questionTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item v-if="isShow" label="备注内容">
              <el-input v-model="form.issueRemark" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item v-if="isShow" label="申请机构">
              <el-input v-model="form.instn" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item v-if="isShow" label="结果">
              <!-- <el-select v-model="form.issueOptions" placeholder="--请选择结果--">
                <el-option
                  v-for="(item,index) in resultList"
                  :key="index"
                  :label="item.label"
                  :value="item"
                />
              </el-select> -->
              <el-input v-model="form.issueOptions" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item v-if="isShow" label="问题内容">
              <el-input v-model="form.issueTitle" />
            </el-form-item>
          </div>
          <div class="innerBox">
            <el-form-item label=" ">

              <el-button size="mini" type="primary" @click="handleFilter()">查询</el-button>
              <el-button size="mini" @click="onReset">重置</el-button>

              <el-button size="mini" style="border:none" @click="isShow = !isShow"> <a style="color:blue;text-decoration:none">{{ !isShow ? '展开' : '收起' }}<i :class="[ !isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up','el-icon--right']" /></a></el-button>

            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>

    <el-card class="msg_table">
      <div class="exportTable">
        <div style="width:130px;display:flex;margin:20px;cursor: pointer;" @click="exportExcelTable">
          <img src="~@/assets/style/doc_icon.svg" style="width:16px;height:16px;margin-right:8px;margin-left:20px" alt="">
          <span style="height:16px"> 导出Excel</span>
        </div>
        <el-table
          v-loading="loading"
          :data="statisticsTable"
          :header-cell-style="{background:'#F5F7FA',color:'#000'}"
        >
          <el-table-column
            prop="testApplyNo"
            label="服务编号"
            fixed
            width="220px"
          />
          <el-table-column
            prop="formAbbr"
            label="接口简称"
            fixed
            width="150px"
          />
          <el-table-column
            prop="instn"
            label="申请机构"
            fixed
            width="250px"
          />
          <el-table-column
            prop="applyName"
            label="申请人"
            width="84px"
          />
          <el-table-column
            prop="accepter"
            label="验收人"
            width="84px"
          />
          <el-table-column
            prop="date"
            label="反馈时间"
            width="162px"
          />
          <el-table-column
            prop="configType"
            label="问题类型"
            width="102px"
          />
          <el-table-column
            prop="issueTitle"
            label="问题"
            width="300px"
          />
          <el-table-column
            prop="issueOptions"
            label="结果"
            width="187px"
          />
          <el-table-column
            prop="issueRemark"
            label="备注"
            width="173px"
            align="center"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.issueRemark" :underline="false" type="primary" style="color:#0050B3; " @click="handleClick(scope.row)">
                {{ scope.row.issueRemark.length >20 ? scope.row.issueRemark.substring(1,19) + '...' : scope.row.issueRemark }}
              </el-link>
              <el-link v-else :underline="false" type="primary" style="color:#0050B3; " @click="handleClick(scope.row)">
                {{ '-' }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="备注"
          :modal="false"
          :visible.sync="dialogVisible"
          width="766px"
          height="221px"
        >
          <span>{{ issueRemark }}</span>
        </el-dialog>

        <el-pagination
          style="display:flex;justify-content:flex-end;margin-top:17px"
          :current-page="pageQuery.page"
          :page-sizes="[ 10,20,30,40]"
          :page-size="pageQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </el-card>

  </div>
</template>

<script>
import { getScoreAndBookingList, reqResultSelect } from '@/api/acceptance/resourceController.js'
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'ScoreStatisticsQuery',
  data() {
    return {
      loading: false,
      form: {
        startDate: '',
        endDate: '',
        formAbbr: '',
        accepter: '',
        applyName: '',
        applyNo: '',
        date: [],
        applicant: '',
        issueRemark: '',
        questionType: '',
        instn: '',
        issueOptions: '',
        issueTitle: '',
        configType: ''
      },
      searchForm: {
        startDate: '',
        endDate: '',
        formAbbr: '',
        accepter: '',
        applyName: '',
        applyNo: '',
        date: [],
        applicant: '',
        issueRemark: '',
        questionType: '',
        instn: '',
        issueOptions: '',
        issueTitle: '',
        configType: ''
      },
      issueRemark: '',
      form_note: {
        issueRemark: ''
      },

      isShow: false,
      dialogVisible: false,
      // isActive: false,

      total: 0,
      pageQuery: {
        page: 1,
        pageSize: 10
      },

      // 选择框问题类型
      questionTypeList: [{ value: '10', label: '评分问题' }, { value: '20', label: '反馈问题' }],

      // 选择框结果列表
      resultList: [],

      // 下面表格详情
      statisticsTable: []
    }
  },
  methods: {
    routerLinkCreated() {
      this.handleFilter()
      this.getResultList()
    },

    // 页面初始化获取结果选项列表
    async getResultList() {
      try {
        const res = await reqResultSelect()
        this.resultList = res.data
        console.log('结果选项列表', res)
      } catch (error) {
        console.log('error', error)
      }
    },

    // 查询
    async onQuery(searchForm) {
      this.loading = true
      try {
        const res = await getScoreAndBookingList({ ...searchForm, ...this.pageQuery })
        if (res.code === 'ACK') {
          this.statisticsTable = res.data.list
          this.total = res.data.totalRecord
        }
        this.loading = false
        console.log('评分统计查询', res)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    // 重置按钮
    onReset() {
      Object.keys(this.form).forEach(item => {
        if (typeof this.form[item] === 'string') this.form[item] = ''
        if (typeof this.form[item] === 'object' && Array.isArray(this.form[item])) this.form[item] = []
        if (Object.prototype.toString.call(this.form[item]) === '[object object]' && Array.isArray(this.form[item])) this.form[item] = {}
        if (item === 'page') this.form[item] = 1
        if (item === 'pageSize') this.form[item] = 10
      })
      console.log('重置信息', this.form)
      this.handleFilter()
    },

    // 导出excel
    async exportExcelTable() {
      axios({
        headers: {
          'X-Auth-Token': getToken()
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: `/cass/mgt/accepter/grade/statistics/download/export`,
        responseType: 'blob',
        data: {
          // 导出参数
          ...this.form, ...this.pageQuery, startDate: this.form.date[0], endDate: this.form.date[1]
        }
      }).then((res) => {
        var name = ''
        // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        if (this.form !== '') {
          name = '评分统计查询表' + '.xlsx' // 下载后文件名
        } else {
          name = '评分统计查询表' + '.csv' // 下载后文件名
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
      }).catch(error => {
        console.log(error)
      })
    },

    handleClick(row) {
      this.issueRemark = row.issueRemark
      // console.log('===========>显示备注', row)
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      // xxx
      // console.log('改变当前页面条数', val)
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    // 页面搜索
    handleFilter() {
      this.pageQuery.page = 1
      this.form.startDate = this.form.date[0]
      this.form.endDate = this.form.date[1]
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.onQuery(this.searchForm)
    }
  }
}
</script>

<style lang='scss' >
.outerBox{
  display: flex;
  justify-content:space-between;
  flex-wrap:wrap;
}
.score_statistics_query{

  .msg_table{
    margin-top: 20px;
  }

  .el-table--border th{
    background: #F6F7FB;
    opacity: 1;
  }

  .el-input{
    width: 372px;
  }

 .el-button{
    border-radius: 5px;
    margin-left: 10px;
  }

  .resizeNone{
    .el-textarea__inner{ //el_input中的隐藏属性
      resize: none;  //主要是这个样式
      width: 698px;
      height: 120px;
      background: #FBFBFC;
      border: 1px solid #E6E6E6;
      opacity: 1;
    }
  }

  .el-pagination__editor.el-input{
    width: 50px;
  }
}

.el-range-editor .el-range-input{
  width: 140px;
}
</style>
