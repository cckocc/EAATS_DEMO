<template>
  <div class="personnelConfig">
    <div class="content">
      <button class="btn_return" @click="back()">
        <img src="~@/assets/style/back_icon.svg" style="vertical-align: middle;width:16px;height:16px" alt="">
        <span
          style="
          margin-left:5px;
          width:40px;
          height: 19px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 19px;
          color: #333333;
          opacity: 1;"
        >
          返回
        </span>
      </button>

      <div class="accepter">
        <img class="user_img" src="~@/assets/style/small_icons/ysrygl_user_img.svg" alt="">
        <span class="name">{{ personForm.cassAccepter.name }}</span>
        <div class="prefer">
          <span>擅长：</span>
          <span v-show="!editFlag" class="input">
            <span v-show="personForm.cassAccepter.expert">
              {{ personForm.cassAccepter.expert }}
            </span>
            <span v-show="!personForm.cassAccepter.expert">
              填写你擅长验收的接口
            </span>
          </span>
          <el-input v-show="editFlag" v-model="personForm.cassAccepter.expert" size="mini" placeholder="填写你擅长验收的接口" type="text" style="height:20px;" />
        </div>
        <button v-if="!editFlag" class="edit" @click="editInterface">
          <img src="~@/assets/style/edit_config.svg" style="vertical-align:middle;" alt="">
          <span class="text">
            编辑
          </span>
        </button>
        <button v-if="editFlag" class="editSave" @click="saveInterface">
          <img src="~@/assets/style/save_config.svg" style="vertical-align:middle;" alt="">
          <span class="text">
            保存
          </span>
        </button>
        <button v-if="editFlag" class="edit" @click="cancelInterface">
          <span class="text">
            取消
          </span>
        </button>
      </div>

      <div class="form_message">
        <el-form
          ref="personForm"
          :model="personForm"
          style="margin:16px 0 16px 0;"
          :disabled="!editFlag"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="日期选择">
                <el-date-picker
                  v-model="personForm.chooseDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="--起始日期--"
                  end-placeholder="--结束日期--"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label=""
                style="margin-left:10px"
              >
                <el-checkbox v-model="personForm.workDay">去除非工作日</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="mechanism">
          <div class="normal">
            <div class="mechanism_name">
              普通机构
            </div>
            <div class="acceptQuantity">
              <el-row>
                <el-col :span="6">
                  验收数量：
                </el-col>
                <el-col :span="12">
                  <el-input v-if="editFlag" v-model.number="personForm.commonQuantity" placeholder="请输入数量">
                    <template slot="append">
                      <el-row>
                        <el-button icon="el-icon-arrow-up" size="mini" @click="normalUp" />
                      </el-row>
                      <el-row>
                        <el-button icon="el-icon-arrow-down" size="mini" @click="normalDown" />
                      </el-row>
                    </template>
                  </el-input>
                  <span v-else>{{ personForm.commonQuantity }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="VIP">
            <div class="mechanism_name">
              VIP机构
            </div>
            <div class="acceptQuantity">
              <el-col :span="6">
                验收数量：
              </el-col>
              <el-col :span="12">
                <el-input v-if="editFlag" v-model.number="personForm.vipQuantity" placeholder="请输入数量" style="height:34px;">
                  <template slot="append">
                    <el-row>
                      <el-button icon="el-icon-arrow-up" type="text" @click="vipUp" />
                    </el-row>
                    <el-row>
                      <el-button icon="el-icon-arrow-down" type="text" @click="vipDown" />
                    </el-row>
                  </template>
                </el-input>
                <span v-else>{{ personForm.vipQuantity }}</span>
              </el-col>
            </div>
          </div>
        </div>

        <div class="support_accept">
          <div style="font-weight:bold;margin-top:24px; margin-bottom:14px;">勾选支持的接口</div>
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            tooltip-effect="dark"
            :row-style="rowClass"
            style="width: 100%;marigin-bottom:200px"
            @selection-change="handleSelectionChange"
          >
            <!--v-if="editFlag"  -->
            <el-table-column
              type="selection"
              :selectable="checkboxDisable"
              width="55"
            />
            <el-table-column
              prop="formName"
              label="验收单名称"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.formName !== '' && scope.row.formName !== null">{{ scope.row.formName }}</span>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="formShort"
              label="接口简称"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.fromShort !== '' && scope.row.fromShort !== null">{{ scope.row.formShort }}</span>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="supportFlag"
              label="支持情况"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.supportFlag === '1'">支持</span>
                <span v-else>不支持</span>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccepterFormList, editPersonForm, reqGetAccepterMessage } from '@/api/acceptance/personConfig'

export default {
  name: 'PersonnelConfig',
  props: {
    personInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      selectdata: [],
      selectRow: [],
      personForm: {
        // 验收单列表
        accepterFromCons: [],
        // 验收人基本信息
        cassAccepter: {
          allocatedQuantity: 0,
          createOpId: '',
          createTs: '',
          delFlagType: '',
          expert: '',
          lastMntOpId: null,
          lastMntTs: '',
          score: null,
          versionCt: 0,
          id: '',
          name: '',
          userId: '',
          // 是否请假
          isLeave: ''
        },
        commonQuantity: 0,
        vipQuantity: 0,
        expert: '',
        endDate: '',
        startDate: '',
        chooseDate: null,
        checked: true,
        workDay: true
      },

      editFlag: false,
      tableData: [
      ],
      id: '',
      multipleSelection: [],
      oldPersonInfo: {}
    }
  },
  watch: {
    selectdata(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.tableData.indexOf(item))
        })
      }
    }
  },
  // mounted() {
  //   this.initPage()
  // },
  created() {
    // if (this.personForm.cassAccepter) {
    //   this.routerLinkCreated()
    // }
    // this.initPage()
  },
  methods: {
    // 表格复选框禁用
    checkboxDisable() {
      return this.editFlag
    },
    async initPage() {
      try {
        const res = await reqGetAccepterMessage(this.personForm.cassAccepter.id)
        this.personForm.cassAccepter.expert = res.data.expert
        console.log('222', res)
      } catch (e) {
        console.log(e)
      }
    },
    // 跳转到配置页面的方法
    routerLinkCreated(str) {
      console.log('父组件的传值', str)
      this.personForm.cassAccepter = JSON.parse(JSON.stringify(str))
      this.oldPersonInfo = JSON.parse(JSON.stringify(str))
      console.log('子组件接收的值调子组件', this.personForm.cassAccepter)
      console.log('============>', JSON.stringify(str))
      this.GetAccepterFormList()
    },
    // 返回人员管理界面
    back() {
      this.$emit('linkSitting')
    },
    // 加载是否支持验收列表
    GetAccepterFormList() {
      this.loading = true
      getAccepterFormList(this.personForm.cassAccepter.userId).then(res => {
        if (res.data.length > 0) {
          this.tableData = res.data.concat([])
          console.log('人员配置支持验收列表', this.tableData)
          var checkedList = []
          this.tableData.forEach(item => {
            if (item.supportFlag === '1') {
              checkedList.push(item)
            }
          })
          // console.log('默认选中', checkedList)
          this.$nextTick(() => {
            this.toggleSelection(checkedList)
          })
          this.personForm.accepterFromCons = res.data.concat([])
        } else {
          // this.$message({
          //   type: 'error'
          //   // message: res.msg
          // })
        }
        this.loading = false
      })
    },
    // 切换列表选中状态
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 普通机构数量加减
    normalUp() {
      this.personForm.commonQuantity = this.personForm.commonQuantity + 1
    },
    normalDown() {
      if (this.personForm.commonQuantity > 0) {
        this.personForm.commonQuantity = this.personForm.commonQuantity - 1
      } else {
        this.personForm.commonQuantity = 0
      }
    },
    // vip机构数量加减
    vipUp() {
      this.personForm.vipQuantity = this.personForm.vipQuantity + 1
    },
    vipDown() {
      if (this.personForm.vipQuantity > 0) {
        this.personForm.vipQuantity = this.personForm.vipQuantity - 1
      } else {
        this.personForm.vipQuantity = 0
      }
    },
    editInterface() {
      this.editFlag = true
    },
    saveInterface() {
      var regu = /^[1-9]\d*|0$/
      if (!regu.test(this.personForm.commonQuantity)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的普通名额数量'
        })
        return false
      }
      if (!regu.test(this.personForm.vipQuantity)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的vip名额数量'
        })
        return false
      }
      if (this.personForm.cassAccepter.expert.length > 200) {
        this.$message({
          type: 'warning',
          message: '擅长描述最多不得超过200个字符'
        })
        return false
      }
      if (this.personForm.chooseDate) {
        this.personForm.startDate = this.personForm.chooseDate[0]
        this.personForm.endDate = this.personForm.chooseDate[1]
      } else {
        if (this.personForm.commonQuantity > 0 || this.personForm.vipQuantity > 0) {
          this.$message({
            type: 'warning',
            message: '请选择验收日期范围'
          })
          return false
        }
      }
      // 若普通名额和vip名额数量均为0，则提示是否请假
      if (this.personForm.chooseDate && this.personForm.commonQuantity === 0 && this.personForm.vipQuantity === 0) {
        this.$confirm('当前选择日期范围内，验收普通名额和vip名额均为0，是否设为请假?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          closeOnPressEscape: false,
          distinguishCancelAndClose: true
        }).then(() => {
          this.personForm.isLeave = '1'
          // console.log('保存编辑验收人', JSON.stringify(this.personForm))
          editPersonForm(this.personForm).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            // this.initPage()
            this.editFlag = false
          })
        }).catch(action => {
          console.log(action)
          if (action === 'cancel') {
            this.personForm.isLeave = ''
            // console.log('保存编辑验收人', JSON.stringify(this.personForm))
            editPersonForm(this.personForm).then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              // this.initPage()
              this.editFlag = false
            })
          }
        })
      } else {
        this.personForm.isLeave = ''
        // console.log('保存编辑验收人', JSON.stringify(this.personForm))
        editPersonForm(this.personForm).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          // this.initPage()
          this.editFlag = false
        })
      }
    },
    cancelInterface() {
      this.$confirm('确认清除当前编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editFlag = false
        this.personForm.cassAccepter = JSON.parse(JSON.stringify(this.oldPersonInfo))
        this.personForm.chooseDate = null
        this.personForm.workDay = false
        this.personForm.commonQuantity = 0
        this.personForm.vipQuantity = 0
        this.initPage()
        this.GetAccepterFormList()
      })
      // 取消编辑
    },
    handleSelectionChange(val) {
      this.selectdata = val
      this.multipleSelection = val
      this.personForm.accepterFromCons.forEach(item => {
        item.supportFlag = '0'
        val.forEach(value => {
          if (item.formId === value.formId) {
            item.supportFlag = '1'
          }
        })
      })
    },
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return { 'background-color': '#f0f9eb' }
      }
    }
  }

}
</script>
<style lang='scss' scoped>

.btn_return{
  border: none;
  height: 29px;
  background: #EDF4FF;
  opacity: 1;
  display: flex;

  .text{
    height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 19px;
    color: #333333;
    opacity: 1;
    margin-left: 9px;
  }

}
.accepter ::v-deep .el-button--default{
  background: transparent;
  color: white;
}
.accepter{
    width: 1218px;
    height: 130px;
    background: url('~@/assets/style/personnelConfig/rygpz_user_bg.svg');
    position: relative;

    .user_img{
      position: absolute;
      top: 36px;
      left: 57px;
      display: inline-block;
      width: 50px;
      height: 50px;
      background: #45A2FF;
      border-radius: 50%;
      opacity: 1;
    }
    .name{
      display: inline-block;
      // width: 72px;
      height: 24px;
      font-size: 24px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 41px;
      color: #FFFFFF;
      opacity: 1;
      margin-left: 126px;
      margin-top: 25px;
    }
    .prefer{
      margin-top: 12px;
      margin-left: 128px;

      span {
        width: 31px;
        height: 19px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 19px;
        color: #FFFFFF;
        opacity: 1;
      }

      .input{
        width: 142px;
        height: 19px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 19px;
        color: #FFFFFF;
        border: none;
        opacity: 1;
      }
      .el-input{
        width: 754px;
        height: 19px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 19px;
        color: #FFFFFF;
        opacity: 1;
        border: none;
        background-color: transparent;
      }
    }
    .editSave {
      height: 30px;
      border: 1px solid #8BA8FF;
      opacity: 1;
      position: absolute;
      top: 25px;
      right: 141px;
      background-color: transparent;
      .text{
        width: 30px;
        height: 15px;
        font-size: 15px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 26px;
        color: #fff;
        opacity: 1;
      }
    }

    .edit{
      height: 30px;
      border: 1px solid #8BA8FF;
      opacity: 1;
      position: absolute;
      top: 25px;
      right: 54px;
      background-color: transparent;
      .text{
        width: 30px;
        height: 15px;
        font-size: 15px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 26px;
        color: #fff;
        opacity: 1;
      }
    }
}

.el-button.el-button--default.el-button--mini{
  border: none;
}

::v-deep .el-input .el-input__inner{
  height: 40px;
}

.form_message{
  padding: 0 20px;

  .el-form{
    height: 35px;
  }

  .mechanism{
    width: 100%;
    display: flex;
    text-align: center;
    .normal, .VIP{
      width: 578px;
      height: 105px;
      opacity: 1;
    }
    .normal{
      border: 1px solid #DBE2EF;
      .mechanism_name{
        height: 47px;
        color: #0553B4;
        background: #F1F6FF;
        border-bottom: 1px solid #DBE2EF;
        line-height: 47px;
      }
    }
    .VIP{
      border: 1px solid #F5E7D1;
      margin-left: 24px;
      .mechanism_name{
        color: #E08D00;
        height: 47px;
        line-height: 47px;
        background: #FFF5E6;
        border-bottom: 1px solid #F5E7D1;
        // border: 1px solid #F5E7D1;
      }
    }
    .acceptQuantity{
        height: 57px;
        line-height: 57px;
      }
  }
}
</style>
