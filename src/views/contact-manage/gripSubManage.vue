<template>
  <!-- 场务订阅管理 -->
  <div class="gripSubManage">
    <el-card class="top_card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="邮箱">
          <el-input v-model="formInline.emails" style="width:500px" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" style="margin-left:30px" @click="handleFilter()">查询</el-button>
          <el-button size="mini" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin:15px 0px;">
      <div style="display:flex;flex-direction: row-reverse;margin-right:20px">
        <el-dropdown trigger="click" :hide-on-click="false">
          <el-button type="text">
            <svg-icon class="button-icon" icon-class="config" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="columnCheckedList" @change="onChangeColumnChecked">
              <el-dropdown-item v-for="item in uploadTypeList" :key="item.subscriptionId">
                <el-checkbox :label="item.subscriptionId">{{ item.subscriptionName }}</el-checkbox>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 动态表格 -->
      <dynamicTable
        :table-data="tableData"
        :table-label="tableLabel"
        @selectSwitch="selectSwitch"
      />

      <el-pagination
        style="float:right;margin:20px 0px"
        :current-page="pageQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getQuerySubscription, editSubscription, queryConfigShow, editConfigShow } from '@/api/email/email_manage'
import dynamicTable from '@/components/publicTable/dynamicTable2.vue'

export default {
  name: 'GripSubscriptionManagement',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      detailList: [],
      columnCheckedList: [],
      uploadTypeList: [],
      tableLabel: [
        { label: '邮箱', width: '400', prop: 'emails', fixed: true }
      ],

      formInline: {
        emails: '',
        // 点击菜单类型：10-机构订阅 20-场务订阅
        menuType: '20'
      },

      searchForm: {
        emails: '',
        // 点击菜单类型：10-机构订阅 20-场务订阅
        menuType: '20'
      },

      total: 0,
      pageQuery: {
        // emails: '',
        pageSize: 10,
        page: 1
      },

      // 邮箱订阅管理表格数据
      emailSubscriptionData: []
    }
  },

  created() {
    this.initPage()
    this.handleFilter()
  },

  methods: {
    initPage() {
      // 查询-当前用户,订阅节点的展示状态
      queryConfigShow().then(res => {
        const { code, data } = res
        if (code === 'ACK') {
          if (data && Array.isArray(data.showDtoList) && data.showDtoList.length > 0) {
            this.uploadTypeList = data.showDtoList
            var oneList = []
            var detailList = []
            data.showDtoList.forEach(ele => {
              if (ele.showFlag === '0') {
                oneList.push(ele.subscriptionId)
                detailList.push(ele)
              }
            })
            this.columnCheckedList = oneList
            this.detailList = detailList
          }
        }
      }).catch()
    },

    // 设置icon按钮
    handleSetting() {
      console.log('设置')
    },

    onChangeColumnChecked(val) {
      var detailList = []
      if (this.uploadTypeList.length > 0 && this.columnCheckedList.length === 0) {
        detailList = this.uploadTypeList.map(item => {
          item.showFlag = 1
          return item
        })
      }
      if (this.uploadTypeList.length > 0 && this.columnCheckedList.length > 0) {
        var oneList = []
        oneList = this.uploadTypeList.filter(item => {
          if (this.columnCheckedList.some(ele => item.subscriptionId === ele)) {
            item.showFlag = 0
            return item
          }
        })

        var twoList = []
        twoList = this.uploadTypeList.filter(item => {
          if (!this.columnCheckedList.some(ele => item.subscriptionId === ele)) {
            item.showFlag = 1
            return item
          }
        })
        detailList = oneList.concat(twoList)
      }
      this.detailList = detailList
      editConfigShow(detailList).then(res => {
        if (res.code === 'ACK') {
          this.$message({
            type: 'success',
            message: res.message
          })
        }
        this.handleFilter()
      }).catch()
    },

    async detailTable(arr) {
      console.log(arr)
      const tableHead = []; let tableList = []; const headNameList = []
      arr.forEach(item => {
        tableList = Object.keys(item)
        if (Array.isArray(tableList) && tableList.length > 0) {
          tableList.forEach(ele => {
            if (ele !== 'configInfoList' && (ele === 'emails' || ele === 'userName')) headNameList.unshift(ele)
          })
        }
        if (Array.isArray(item.configInfoList) && item.configInfoList.length > 0) {
          tableHead.push(item)
          item.configInfoList.forEach(ele => {
            headNameList.push(ele.subscriptionName)
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
        if (item === 'emails') {
          tableParamObj.label = '邮箱'
          tableParamObj.prop = item
          tableParamObj.fixed = true
          tableParamObj.width = '300'
        } else if (item === 'userName') {
          console.log('userName', item)
          tableParamObj.label = '姓名'
          tableParamObj.prop = item
          tableParamObj.fixed = true
          tableParamObj.width = '200'
        } else {
          tableParamObj.label = item
          tableParamObj.prop = item
        }
        // var pushFlag = this.detailList.find(ele => Number(ele.showFlag) === 0 && ele.subscriptionName === item)
        // if (pushFlag || item === 'userName' || item === 'emails') {
        //   tableParamList.push(tableParamObj)
        // }
        tableParamList.push(tableParamObj)
      })
      console.log('json', this.detailList)
      for (let i = tableParamList.length - 1; i > 0; i--) {
        for (let j = 0; j < this.uploadTypeList.length; j++) {
          if (tableParamList[i].prop === this.uploadTypeList[j].subscriptionName) {
            if (Number(this.uploadTypeList[j].showFlag) === 1) {
              tableParamList.splice(i, 1)
              break
            }
          }
        }
      }
      console.log('表头数据信息===========>', tableParamList)
      this.tableLabel = tableParamList
      this.$nextTick(() => {
        console.log('123', this.detailList)
        console.log('123', this.tableLabel)
        // 判断是否需要刷新隐藏框
        var flag = true
        this.tableLabel.forEach(ele => {
          var name = ele.label
          if (ele.prop !== 'userName' && ele.prop !== 'emails') {
            var searchFlag = false
            this.detailList.forEach(item => {
              if (item.subscriptionName === name) {
                searchFlag = true
              }
            })
            if (!searchFlag) {
              flag = false
            }
          }
        })
        if (!flag) {
          this.initPage()
        }
        // 表头处理好再处理表格数据
        const tableFromList1 = []
        let tableFormObj = {}
        arr.forEach(item => {
          // console.log('信息', item)
          tableFormObj = {}
          tableFormObj.emails = item.emails
          tableFormObj.userName = item.userName
          tableFormObj.contactsId = item.contactsId
          // tableFormObj.formAbbr = item.formAbbr
          if (Array.isArray(item.configInfoList) && item.configInfoList.length > 0) {
            item.configInfoList.forEach(ele => {
              // console.log()
              // tableFormObj.userName = ele.userName
              // tableFormObj.contactsId = ele.contactsId
              // tableFormObj.subscriptionId = ele
              if (ele.subscriptionFlag === '1') {
                // tableFormObj[ele.subscriptionName] = `<img src="~@/assets/style/support_icon.svg"></img>`
                tableFormObj[ele.subscriptionName] = '1'
              } else if (ele.subscriptionFlag === '0') {
                tableFormObj[ele.subscriptionName] = '0'
              }
            })
            tableFromList1.push(tableFormObj)
          }
        })
        console.log('表格数据', tableFromList1)
        // 表格数据
        this.tableData = tableFromList1
      })
      // console.log(tableFromList1)
    },

    selectSwitch(str, args) {
      editSubscription({
        contactsId: str.contactsId,
        emails: str.emails,
        menuType: 20,
        subscriptionFlag: str[args.prop],
        subscriptionName: args.prop,
        userName: str.userName }).then(res => {
        console.log('res============>', res)
        this.$message.success('更新成功')
      }).catch(e => {
        console.log('1212121', e)
        this.handleFilter()
        // this.$forceUpdate()
      })
      console.log('str===========>', str, args)
    },

    // 查询
    handleFilter() {
      console.log('查询按钮')
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
      this.initPage()
    },
    async onQuery() {
      // const res = await getQuerySubscription({ emails: this.formInline.emails, menuType: this.formInline.menuType, ...this.pageQuery })
      const res = await getQuerySubscription({ ...this.searchForm, ...this.pageQuery })
      console.log('场务订阅管理===>', res)
      this.total = res.data.totalRecord
      this.detailTable(res.data.list)
      this.emailSubscriptionData = res.data.list
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      console.log('改变每页条数')
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },

    handleCurrentChange(val) {
      // console.log('改变当前页码', val)
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    // 重置
    onReset() {
      console.log('重置')
      this.formInline.emails = ''
      this.handleFilter()
    },

    // 表格开关
    openSwitch(scope) {
      console.log('表格开关scope========>', scope.row)
    }
  }
}
</script>

<style lang='scss' scoped>
.el-card.top_card ::v-deep .el-card__body{
  padding: 20px 20px 0px 20px;
}

.el-card ::v-deep .el-card__body{
  padding: 0;
}
</style>

