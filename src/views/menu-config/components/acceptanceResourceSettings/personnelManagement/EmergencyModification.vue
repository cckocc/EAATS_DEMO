<template>
  <!-- 验收人员应急修改 -->
  <div class="EmergencymMdification">
    <div class="content">
      <el-card class="box-card">
        <!-- 表单 -->
        <el-form ref="form" :inline="true" :model="form">
          <el-row>
            <!-- :picker-options="pickerOptions" -->
            <el-col :span="9">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="form.date"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator=" — "
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="验收单名称" label-width="90px">
                <el-select v-model="form.formName" filterable clearable placeholder="请选择验收单">
                  <el-option v-for="(item,index) in formIdList" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="验收人员">
                <el-input v-model="form.accepter" />
              </el-form-item>
            </el-col>
            <el-col :span="3" />
          </el-row>

          <el-row>
            <el-col :span="9">
              <el-form-item label="申请机构">
                <el-input v-model="form.aplyInstnNm" class="aplyInstnNm" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-form-item label="申请人" label-width="90px">
                  <el-input v-model="form.userName" />
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-form-item label="服务单号">
                  <el-input v-model="form.applyNo" />
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="mini" style="width:54px;margin-left:10px;" @click="handleFilter()">查询</el-button>
              <el-button size="mini" @click="onReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:16px;">
      <!-- 验收表格（可编辑） border -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign:'center',background:'#F5F7FA',color:'#000'}"
        style="width: 100%;margin-top:20px"
      >
        <el-table-column
          prop="startDate"
          label="验收开始日期"
          style="width:16.7%"
        />
        <el-table-column
          prop="formName"
          label="验收单名称"
          style="width:16.7%"
        />
        <el-table-column
          prop="applyNo"
          label="服务单号"
          style="width:16.7%"
        >
          <template slot-scope="scope">
            <el-link :underline="false" @click="jumpToCheckPage(scope.row)">{{ scope.row.applyNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="aplyInstnNm"
          style="width:16.7%"
          label="申请机构"
        />
        <el-table-column
          prop="userName"
          label="申请人"
          style="width:16.7%"
        />
        <el-table-column
          prop="accepter"
          label="验收人员"
          style="width:16.7%"
        >
          <template slot-scope="scope">
            <div>
              <!-- <i>编辑图标</i> -->
              <el-button v-if="scope.row.accepter" type="text" @click="openModifyDialog(scope.row.accepterId,scope.row.id,scope.row.formId)">{{ scope.row.accepter }}
                <img src="~@/assets/style/edit_icon_config.svg" style="vertical-align: middle;color:#0050B3;margin-left:3px" alt="">
              </el-button>
              <el-button v-else type="text" @click="openModifyDialog(scope.row.accepterId,scope.row.id,scope.row.formId)">候补
                <img src="~@/assets/style/edit_icon_config.svg" style="vertical-align: middle;color:#0050B3;margin-left:3px" alt="">
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog
      title="填写替换人员"
      :modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="autographForm" :model="autographForm" :rules="rules">
        <el-form-item label="验收人员" prop="accepterId">
          <el-select v-model="autographForm.accepterId" placeholder="请选择验收人员" class="inner_select">
            <el-option v-for="item in acceptanceAutographList" :key="item.userId" :label="item.name" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-button size="mini" type="primary" style="margin-left:10px;" @click="modifyAutograph('autographForm')">修改</el-button>
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getEmergencyList, getModifyPersonList, editEmergency, getFormIdList } from '@/api/acceptance/personConfig'
export default {
  name: 'EmergencymMdification',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 3600 * 1000)
        }
      },
      tableData: [],
      formIdList: [],
      tableLoading: false,
      total: 0,
      form: {
        startDate: '',
        endDate: '',
        date: [],
        formId: '',
        accepter: '',
        aplyInstnNm: '',
        userName: '',
        applyNo: ''
      },
      searchForm: {
        startDate: '',
        endDate: '',
        date: [],
        formId: '',
        accepter: '',
        aplyInstnNm: '',
        userName: '',
        applyNo: ''
      },
      pageQuery: {
        page: 1,
        pageSize: 10
      },
      dialogVisible: false,
      autographForm: {
        accepterId: '',
        accepterName: '',
        dataId: '',
        explain: ''
      },
      acceptanceAutographList: [],

      rules: {
        accepterId: [
          { required: true, message: '请选择验收人员', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.routerLinkCreated()
  },
  methods: {
    // 服务单号点击跳转到流程查看页面
    jumpToCheckPage(scope) {
      // console.log('scope', scope.row.applyNo)
      this.$router.push('/field-management/process-view')
    },
    routerLinkCreated() {
      var startTime = this.getCurrentTime()
      var endTime = this.addDay(6, startTime)
      console.log(startTime, endTime)
      this.form.date = [startTime, endTime]
      this.initFormIdList()
      this.handleFilter(this.searchForm)
    },
    getCurrentTime() {
      const newArr = new Date().toLocaleDateString().split('/').map(item => {
        if (item.length === 1) {
          item = '0' + item
        }
        return item
      }).join('-')
      return newArr
    },
    getNextWeek() {
      const currentTime = new Date().getTime() - 3600 * 24 * 1000
      const date = new Date(currentTime).toLocaleDateString().split('/').join('-')
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

    // 增加日期
    addDay(day, startTime) {
      var dateStart = new Date(startTime)
      dateStart.setDate(dateStart.getDate() + day)
      var resultTime = dateStart.getFullYear() + '-' + this.addZero(dateStart.getMonth() + 1) + '-' + this.addZero(dateStart.getDate())
      return resultTime
    },
    addZero(day) {
      if (Number(day) < 10) {
        return '0' + day
      } else {
        return '' + day
      }
    },
    // 初始化表单搜索验收单id的下拉框
    async initFormIdList() {
      try {
        const res = await getFormIdList()
        // console.log('formIdList=======>', res.data)
        this.formIdList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 打开应急修改人模态框
    async openModifyDialog(accepterId, dataId, formId) {
      // 加载修改人下拉框列表
      var map = { id: dataId, formId: formId }
      const res = await getModifyPersonList(map)
      console.log('加载可修改人员列表===========>', res)
      this.acceptanceAutographList = res.data
      this.autographForm.accepterId = accepterId
      this.autographForm.dataId = dataId
      this.dialogVisible = true
    },
    // 修改应急人信息
    modifyAutograph(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.$confirm('被替换人当日名额是否需要增加？', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.autographForm.explain = 1
            editEmergency(this.autographForm).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.dialogVisible = false
              this.handleFilter()
            })
          }).catch(action => {
            console.log(action)
            if (action === 'cancel') {
              this.autographForm.explain = ''
              editEmergency(this.autographForm).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.dialogVisible = false
                this.handleFilter()
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async GetEmergencyList(searchForm) {
      this.tableLoading = true
      const res = await getEmergencyList({ ...this.pageQuery, ...searchForm })
      console.log('应急修改列表', res)
      this.tableData = res.data.list
      this.total = res.data.totalRecord
      this.tableLoading = false
    },
    // 表单重置
    onReset() {
      this.form.date = []
      this.form.formName = ''
      this.form.accepter = ''
      this.form.aplyInstnNm = ''
      this.form.userName = ''
      this.form.applyNo = ''
      console.log('重置', this.form)
      this.handleFilter()
    },
    // 页面搜索
    handleFilter() {
      console.log('应急修改-表单查询内容：', this.form)
      this.pageQuery.page = 1
      if (this.form.date && this.form.date.length > 0) {
        this.form.startDate = this.form.date[0]
        this.form.endDate = this.form.date[1]
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.GetEmergencyList(this.searchForm)
    },
    // 页码改变
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.GetEmergencyList(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.GetEmergencyList(this.searchForm)
      }
    },
    // 获取当前页面值
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.GetEmergencyList(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.GetEmergencyList(this.searchForm)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.exportTable{
  margin-top: 24px;
  border: 1px solid #DFDFDF;

  .export{
    display: block;
    margin-left: 44px;
    height: 62px;
    line-height: 62px;
  .text{
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
.el-form ::v-deep .el-input .el-input__inner{
  width: 158px;
}

.el-form ::v-deep .aplyInstnNm.el-input .el-input__inner{
  width: 350px;
}

.el-form ::v-deep .el-message-box__headerbtn .el-message-box__close{
  display: none;
}

.el-form ::v-deep .el-input .el-input__inner.inner_select{
  width: 235px;
}

</style>
