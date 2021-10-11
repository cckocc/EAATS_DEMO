<template>
  <!-- 机构端验收排布表设置 -->
  <div class="acceptanceSchedule">
    <div class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="as_settings">设置</span>
        </div>

        <el-form ref="form" :model="form" :rules="rules">
          <el-row>
            <el-col :span="16">
              <el-form-item label="生成验收排布表时间" prop="period">
                <el-select
                  v-model="form.period"
                  placeholder="--请选择--"
                  size="mini"
                  style="width: 130px"
                  :disabled="!editFlag"
                  @change="changeDate"
                >
                  <el-option
                    v-for="item in dateSelect"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-show="
                    form.period === '3' ||
                    form.period === '4' ||
                    form.period === '5'
                  "
                  v-model="form.dateyear"
                  size="mini"
                  :placeholder="selectTitle"
                  style="width: 130px; margin-left: 5px"
                  :disabled="!editFlag"
                  @change="changeTime1"
                >
                  <el-option
                    v-for="item in dateDetail"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select
                  v-show="form.period === '5'"
                  v-model="form.week"
                  placeholder="--请选择日--"
                  size="mini"
                  style="width: 130px; margin-left: 5px"
                  :disabled="!editFlag"
                  @change="changeTime"
                >
                  <el-option
                    v-for="item in dateDay"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-time-picker
                  v-model="form.time"
                  :disabled="!editFlag"
                  start-placeholder="开始时间"
                  value-format="H:m"
                  format="HH:mm"
                  style="width: 150px; margin-left: 5px"
                  placeholder="选择时间范围"
                />
                <template>
                  <el-tooltip placement="right-end" effect="light">
                    <div slot="content">
                      <p>
                        若当前执行月无此日期则跳过当前月执行。<br />例：2月无31日，则2月不执行此任务。
                      </p>
                    </div>
                    <span
                      ><i class="el-icon-question" style="margin-left: 10px"
                    /></span>
                  </el-tooltip>
                </template>
                <!-- <template slot="label">
                  <el-tooltip placement="bottom-start">
                    <div slot="content">
                      <p>1.请根据实际业务勾选机构身份，可选类别包括：①本币/外汇/系统接入开发机构：可勾选一个或多个；②信息商：如果勾选信息商，则其他三个不能勾选；</p>
                      <p>2.当选中上述两种类别中任意一类，另一类置灰不可选，如需选择另一类别，请先取消勾选当前选中项后操作；</p>
                    </div>
                    <span><i class="el-icon-question" /></span>
                  </el-tooltip>
                </template> -->
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="验收资源生成时间范围"
                prop="generationInterval"
              >
                <el-select
                  v-model="form.generationInterval"
                  placeholder="--请选择--"
                  size="mini"
                  :disabled="!editFlag"
                >
                  <el-option
                    v-for="(item, index) of 31"
                    :key="index"
                    :label="item + ' 天'"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="display: flex; justify-content: center">
            <el-button
              v-if="!editFlag"
              size="mini"
              type="primary"
              @click="editSetting"
              >编辑</el-button
            >
            <el-button
              v-if="editFlag"
              size="mini"
              type="primary"
              @click="saveSettings('form')"
              >保存</el-button
            >
            <el-button size="mini" @click="emergencyRelease"
              >应急发布</el-button
            >
          </el-row>
        </el-form>
      </el-card>

      <el-card class="exportTable">
        <div
          style="
            width: 120px;
            display: flex;
            margin-bottom: 22px;
            cursor: pointer;
          "
          @click="exportExcelTable"
        >
          <img
            src="~@/assets/style/doc_icon.svg"
            style="width: 16px; height: 16px; margin-right: 8px"
            alt=""
          />
          <span style="height: 16px"> 导出Excel</span>
        </div>

        <el-table :data="tableData" :span-method="objectSpanMethod" border>
          <el-table-column prop="testDate" label="日期时间" />
          <el-table-column prop="instnCnFullNm" label="机构名称" />
          <el-table-column prop="formAbbr" label="接口简称">
            <template slot-scope="scope">
              <span v-if="scope.row.formAbbr">{{ scope.row.formAbbr }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="验收人员" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  initAcceptanceResource,
  reqGenerationTime,
  reqEmergencySend,
  reqSaveResourceSettings,
} from '@/api/acceptance/resourceController.js'
import { getToken } from '@/utils/auth'
import axios from 'axios'
export default {
  name: 'AcceptanceSchedule',
  data() {
    var validatePeriod = (rule, value, callback) => {
      console.log(value)
      if (value) {
        if (value === '1' || value === '2') {
          // 每天验证后面时间选择是否为空
          console.log(this.form.time)
          if (
            this.form.time === undefined ||
            this.form.time === null ||
            this.form.time.length === 0
          ) {
            callback(new Error('请选择完整时间'))
          } else {
            callback()
          }
        } else if (value === '3' || value === '4') {
          // 每周
          if (this.form.dateyear === '') {
            callback(new Error('请选择完整时间'))
          } else {
            callback()
          }
        } else if (value === '5') {
          if (this.form.dateyear === '' || this.form.week === '') {
            callback(new Error('请选择完整时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback(new Error('请选择生成时间'))
      }
    }
    return {
      form: {
        time: [],
        period: '',
        dateyear: '',
        hour: '',
        minute: '',
        lastMntOpid: 'admin2',
        month: '',
        week: '',
        generationInterval: 7,
      },
      cronId: '',

      selectTitle: '--请选择--',
      dateSelect: [
        {
          label: '每天',
          id: '1',
        },
        {
          label: '工作日',
          id: '2',
        },
        {
          label: '每周',
          id: '3',
        },
        {
          label: '每月',
          id: '4',
        },
        {
          label: '每年',
          id: '5',
        },
      ],
      dateDetail: [],
      dateDay: [],
      tableData: [],
      editFlag: false,
      rules: {
        period: [{ validator: validatePeriod, trigger: 'blur' }],
        // period: [{ required: true, message: '不能为空', trigger: 'change' }],
        generationInterval: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    'form.generationInterval': {
      handler: function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.getList(newValue)
        }
      },
    },
  },

  // created() {
  //   this.routerLinkCreated()
  // },

  methods: {
    routerLinkCreated() {
      this.form.generationInterval = 7
      this.reqInitMessage()
      this.chooseYear()
      // this.editSetting()
      this.editFlag = false
    },

    // 导出excel
    exportExcelTable() {
      axios({
        method: 'post',
        headers: {
          'X-Auth-Token': getToken(),
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        url:
          `/cass/mgt/acceptance/resource/download?day=` +
          this.form.generationInterval,
        responseType: 'blob',
      })
        .then((res) => {
          var name = ''
          // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
          })
          if (this.form.generationInterval !== '') {
            name = '机构端验收排布表设置' + '.xlsx' // 下载后文件名
          } else {
            name = '机构端验收排布表设置' + '.csv' // 下载后文件名
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
    },

    // 查询时间
    changeTime(tags) {
      console.log('tags========>', tags)
    },

    changeTime1(tags) {
      console.log('tags========111>', tags)
    },

    // 页面初始化
    async reqInitMessage() {
      const { data } = await initAcceptanceResource()
      console.log('初始化===>', data)
      // this.tableData = data
      this.form.generationInterval = data[0].generationInterval
      this.getList(this.form.generationInterval)
      this.cronId = data[0].id
      const { period, week, month } = data[0]
      //    dateSelect: [{
      //   label: '每天',
      //   id: '1'
      // },
      // {
      //   label: '工作日',
      //   id: '2'
      // },
      // {
      //   label: '每周',
      //   id: '3'
      // },
      // {
      //   label: '每月',
      //   id: '4'
      // },
      // {
      //   label: '每年',
      //   id: '5'
      // }],
      this.form.period = period
      switch (period) {
        case '1':
          // this.changeDate(period);
          break
        case '2':
          // this.changeDate(period);
          break
        case '3':
          this.changeDate(period)
          this.form.period = period
          this.form.dateyear = Number(week)
          break
        case '4':
          this.changeDate(period)
          this.form.period = period
          this.form.dateyear = Number(week)
          break
        case '5':
          this.changeDate(period)
          this.form.period = period
          this.form.dateyear = month
          this.form.week = Number(week)
          break
        default:
          console.log('未找到对应数据')
      }
      // if (period === 1) {}
      // console.log(this.cronId)
      // if(data[0].period){
      //   this.changeDate(data[0].period);
      //   setTimeout(()=>{
      //     this.form = { ...data[0] }
      //   })
      // }
      // this.form.month = data[0].month
      // this.form.week = data[0].week

      // if (this.form.period === '3') {
      //   this.form.dateyear = data[0].week
      // } else if (this.form.period === '4') {
      //   this.form.dateyear = data[0].week
      // } else if (this.form.period === '5') {
      //   this.form.dateyear = data[0].month
      // }
      this.form.time = data[0].hour + ':' + data[0].minute
    },

    async getList(newValue) {
      try {
        // const d = new Date().toLocaleString
        // console.log('此刻时间', d)
        const res = await reqGenerationTime(newValue)
        console.log('监听日期变化', res)
        if (res.code === 'ACK') {
          this.tableData = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log('row========>', row, column, rowIndex, columnIndex)
      if (columnIndex === 0) {
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
      }
    },

    // 验收排布表时间切换
    changeDate(value) {
      console.log('value==>', value)
      this.time = []
      this.form.dateyear = ''
      this.dateDetail = []
      let obj = {}
      if (value === '1') {
        // for (let i = 1; i < 25; i++) {
        //   obj = {}
        //   obj.value = i
        //   obj.label = i + '时'
        //   this.dateDetail.push(obj)
        // }
      } else if (value === '2') {
        // for (let i = 1; i < 32; i++) {
        //   obj = {}
        //   obj.value = i
        //   obj.label = i + '天'
        //   this.dateDetail.push(obj)
        // }
      } else if (value === '3') {
        this.selectTitle = '--请选择周--'
        for (let i = 1; i < 8; i++) {
          obj = {}
          obj.value = i
          if (i === 2) {
            obj.label = '周一'
          } else if (i === 3) {
            obj.label = '周二'
          } else if (i === 4) {
            obj.label = '周三'
          } else if (i === 5) {
            obj.label = '周四'
          } else if (i === 6) {
            obj.label = '周五'
          } else if (i === 7) {
            obj.label = '周六'
          } else if (i === 1) {
            obj.label = '周日'
          }

          this.dateDetail.push(obj)
        }
      } else if (value === '4') {
        this.selectTitle = '--请选择日--'
        for (let i = 1; i < 32; i++) {
          obj = {}
          obj.value = i
          obj.label = i + '日'
          this.dateDetail.push(obj)
        }
      } else if (value === '5') {
        this.selectTitle = '--请选择月--'
        for (let i = 1; i < 13; i++) {
          obj = {}
          obj.value = i
          obj.label = i + '月'
          this.dateDetail.push(obj)
        }
      }
    },
    // 选择年
    chooseYear() {
      this.dateDay = []
      let obj = {}
      for (let i = 1; i <= 31; i++) {
        obj = {}
        obj.value = i
        obj.label = i + '日'
        this.dateDay.push(obj)
      }
    },

    // 编辑
    editSetting() {
      this.editFlag = true
    },

    // 保存
    async saveSettings(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (
            this.form.time !== null &&
            this.form.time !== [] &&
            this.form.time !== undefined
          ) {
            var timeList = this.form.time.split(':')
            this.form.hour = timeList[0]
            this.form.minute = timeList[1]
          }
          if (this.form.period === '3') {
            this.form.week = this.form.dateyear
          } else if (this.form.period === '4') {
            console.log('参数', 1)
            this.form.month = this.form.period
            this.form.week = this.form.dateyear
          } else if (this.form.period === '5') {
            this.form.month = this.form.dateyear
          }
          const param1 = JSON.parse(JSON.stringify(this.form))
          console.log('参数', param1)
          try {
            const res = await reqSaveResourceSettings({
              ...param1,
              id: this.cronId,
              generationInterval: this.form.generationInterval,
            })

            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: '保存成功',
              })
              this.editFlag = false
              this.reqInitMessage()
            } else {
              this.$message({
                type: 'error',
                message: res.msg || '保存失败',
              })
            }
            console.log('保存设置', res)
          } catch (error) {
            console.log(error)
          }
        }
      })
    },

    // 应急发布按钮
    async emergencyRelease() {
      this.$confirm('应急发布会覆盖当前已发布的通知，确定应急发布吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          const res = await reqEmergencySend(this.form.generationInterval)
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: '应急发布成功',
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg || '应急发布失败',
            })
          }
          console.log('应急发布', res)
        } catch (error) {
          console.log(error)
        }
      })
    },
  },
}
</script>

<style lang='scss'>
.acceptanceSchedule {
  .box-card {
    width: 100%;
    height: auto;

    .clearfix {
      .as_settings {
        display: inline-block;
        width: 54px;
        height: 16px;
        text-align: center;
        border-left: 3px solid #2c76d1;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 16px;
        color: #303030;
        opacity: 1;
      }
    }
  }

  .exportTable {
    margin-top: 24px;
    border: 1px solid #dfdfdf;
    margin-bottom: 20px;

    // .export{
    //   display: block;
    //   height: 62px;
    //   line-height: 62px;
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
    // }
  }

  .el-form ::v-deep .el-button {
    width: 100px;
    height: 30px;
    border-radius: 5px;
  }
  .el-table--border th {
    background: #f6f7fb;
    opacity: 1;
  }
}
.acceptanceSchedule .box-card {
  padding: 0 20px;
}
.el-card__header {
  padding: 18px 0;
}
</style>
