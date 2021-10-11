<template>
  <!-- 验收能力查询 -->
  <div class="capablity-query">
    <div class="content">
      <el-card class="box-card">
        <div class="banner">
          <span style="margin: 30px; font-size:16px">
            验收单名称
          </span>
          <el-select v-model="form.formName" filterable clearable placeholder="请选择" style="width:310px;">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button type="primary" size="mini" style="width:54px;margin-left:10px;" @click="handleFilter()">查询</el-button>
          <el-button size="mini" style="width:54px;margin-left:10px;" @click="onReset()">重置</el-button>
        </div>
      </el-card>
      <el-card class="box-card" style="margin:16px 0px;">
        <div class="btn" style="float:left; margin:20px auto 20px">
          <div style="width:130px;display:flex;justify-content: center;cursor: pointer;" @click="getOutputExcel">
            <img src="~@/assets/style/doc_icon.svg" style="width:16px;height:16px;margin-right:8px;margin-left:20px" alt="">
            <span style="height:16px"> 导出Excel</span>
          </div>
        </div>

        <!-- 验收申请单 -->
        <div class="table">
          <dynamicTable
            :table-data="tableData"
            :table-label="tableLabel"
          />
        </div>
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
      </el-card>
    </div>
  </div>
</template>

<script>
import { acceptanceCapability, getFormList, reqGetInitFormName } from '@/api/acceptance/capability'
import dynamicTable from '@/components/publicTable/dynamicTable.vue'
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'CapablityQuery',
  components: {
    dynamicTable
  },
  data() {
    return {
      total: 0,
      form: {
        formName: ''
      },
      pageQuery: {
        formName: '',
        page: 1,
        pageSize: 10
      },
      options: [],
      value1: '',
      accepters: [],
      formList: { pageSize: 10, page: 1 },
      tableLabel: [
        { label: '验收单名称', width: '400', prop: 'formName', fixed: true },
        { label: '接口简称', width: '162', prop: 'formAbbr', isOpera: true, fixed: true }
      ],
      tableData: []
    }
  },
  created() {
    this.routerLinkCreated()
  },
  methods: {
    routerLinkCreated() {
      this.selectFormName = ''
      this.initFormName()
      this.initFormList()
      this.handleFilter()
    },
    async initFormName() {
      try {
        const { data } = await reqGetInitFormName()
        // console.log('初始化验收单名称', data)
        this.options = data.concat([])
      } catch (error) {
        console.log(error)
      }
    },

    // 查询
    async getAcceptanceCapability(form) {
      const { data } = await acceptanceCapability({ ...this.pageQuery, ...form })
      console.log('验收能力查询表数据', data)
      // this.options = data.list.concat([])
      this.total = data.totalRecord
      // console.log('數據', data)
      this.detailTable(data.list)
    },

    async detailTable(arr) {
      // 去重处理表头数据
      const tableHead = []; let tableList = []; const headNameList = []
      arr.forEach(item => {
        tableList = Object.keys(item)
        if (Array.isArray(tableList) && tableList.length > 0) {
          tableList.forEach(ele => {
            if (ele !== 'accepters') headNameList.unshift(ele)
          })
        }
        if (Array.isArray(item.accepters) && item.accepters.length > 0) {
          tableHead.push(item)
          item.accepters.forEach(ele => {
            headNameList.push(ele.accepterName)
          })
        }
      })
      // 准备prop的值
      const newObj = new Set(headNameList)
      console.log(newObj)
      const newArr = [...newObj]
      console.log(newArr)

      // ----------------

      // 准备表头参数
      const tableParamList = []; let tableParamObj = {}
      newArr.forEach(item => {
        tableParamObj = {}
        if (item === 'formName') {
          tableParamObj.label = '验收单名称'
          tableParamObj.prop = item
          if (Array.isArray(item.accepters) && item.accepters.length > 0) {
            tableParamObj.width = '400'
            tableParamObj.fixed = true
          }
        } else if (item === 'formAbbr') {
          tableParamObj.label = '接口简称'
          tableParamObj.prop = item
          if (Array.isArray(item.accepters) && item.accepters.length > 0) {
            tableParamObj.width = '162'
            tableParamObj.fixed = true
          }
        } else {
          tableParamObj.label = item
          tableParamObj.prop = item
        }
        tableParamList.push(tableParamObj)
      })
      console.log('打印表头数据', tableParamList)
      this.tableLabel = tableParamList
      console.log('---------------------------')

      // 表头处理好再处理表格数据
      const tableFromList1 = []
      let tableFormObj = {}
      console.log(' 表格数据', arr)
      arr.forEach(item => {
        tableFormObj = {}
        tableFormObj.formName = item.formName
        tableFormObj.formAbbr = item.formAbbr
        if (Array.isArray(item.accepters) && item.accepters.length > 0) {
          item.accepters.forEach(ele => {
            // console.log()
            if (ele.supportFlag === '支持') {
              // tableFormObj[ele.accepterName] = `<img src="~@/assets/style/support_icon.svg"></img>`
              tableFormObj[ele.accepterName] = '1'
            } else {
              tableFormObj[ele.accepterName] = '-'
            }
          })
        }
        tableFromList1.push(tableFormObj)
      })
      // 表格数据
      this.tableData = tableFromList1
      console.log(' 表格数据', tableFromList1)
    },

    async initFormList() {
      try {
        const res = await getFormList({ ...this.formList, formName: this.pageQuery.formName })
        if (res) {
          // console.log('res=====>', res)
        }
      } catch (error) {
        // console.log('error===>', error)
      }
    },

    // 导出excel
    async getOutputExcel() {
      axios({
        headers: {
          'X-Auth-Token': getToken()
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        url: `/cass/mgt/accepter/capacity/download/export`,
        responseType: 'blob',
        data: {
          // ...this.pageQuery
          formName: this.form.formName
          // page: this.pageQuery.page,
          // pageSize: this.pageQuery.pageSize
        }
      }).then((res) => {
        console.log('导出成功', res)
        var name = ''
        const blob = new Blob([res.data])
        if (this.form.formName !== '') {
          name = '验收能力查询统计' + this.form.formName + '.xlsx' // 下载后文件名
        } else {
          name = '验收能力查询统计' + '.xlsx' // 下载后文件名
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
    onReset() {
      this.form.formName = ''
      this.handleFilter()
    },
    // 页面搜索
    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.getAcceptanceCapability(this.searchForm)
    },
    // 页码改变
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.getAcceptanceCapability(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.getAcceptanceCapability(this.searchForm)
      }
    },
    // 获取当前页面值
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.getAcceptanceCapability(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.getAcceptanceCapability(this.searchForm)
      }
    }
  }
}
</script>

<style>

</style>
