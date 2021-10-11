<template>
  <!-- 新建自动邮件通知 -->
  <div class="page_manage">
    <el-card class="box-card">
      <div class="card_header">
        <el-form ref="ruleForm" style="width:100%" :inline="true" :model="formInline" :rules="formInlineRules">
          <el-row>
            <el-col :span="12">
              <el-form-item style="width:100%" label="邮件模板名称" prop="emailName">
                <el-input v-model="formInline.emailName" :disabled="isDisabled" placeholder="请输入邮件模板名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="width:100%" label="发送目标" prop="sendGoal">
                <el-select v-model="formInline.sendGoal" :disabled="isDisabled" class="input_width" placeholder="--请选择--">
                  <el-option
                    v-for="(item,index) in targetList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="testClick">测试</el-button>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
      <div class="card_content">
        <div class="content_title">
          触发节点
        </div>
        <el-radio-group
          v-model="selectNode"
          :disabled="isDisabled"
          @change="testSelect"
        >
          <div v-loading="nodeStatus" class="card_info">
            <ManageComponent
              v-for="(item,index) in cardList"
              :key="item.title"

              :style="{ marginRight:(index+1)%4 !== 0 ? '23px' : '',
                        marginBottom: '24px' }"
              :card-item="item"
            />
          </div>
        </el-radio-group>
      </div>
    </el-card>
  </div>
</template>

<script>
import cardList from './test'
import { getEmailTemplateInfo, getEmailInfo, addOrEditAutoEmailManage } from '@/api/email/email_manage.js'
export default {
  components: {
    ManageComponent: () => import('../components/manageComponents/index')
  },
  props: {
    componentsInfo: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  data() {
    // var validateTemplate = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入邮件模板名称'))
    //   } else {
    //     callback()
    //   }
    // }
    var validatesendGoal = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择发送目标'))
      } else {
        callback()
      }
    }
    return {
      cardList: cardList.cardList,
      isDisabled: false,
      nodeStatus: false,
      selectNode: '',
      emailId: '',
      lookInfo: {},
      formInline: {
        emailName: '',
        sendGoal: '05'
      },
      formInlineRules: {
        emailName: [
          { required: true, message: '请输入邮件模板名称', trigger: 'blur' },
          { max: 100, message: '输入长度小于100字符', triiger: ['blur', 'change'] }
        ],
        sendGoal: [{ validator: validatesendGoal, trigger: 'change' }]
      },
      // 发送目标下拉列表
      targetList: [
        {
          value: '05',
          label: '场务人员'
        },
        {
          value: '00',
          label: '机构人员'
        }
      ]
    }
  },
  watch: {
    componentsInfo: {
      handler: function(newVal, oldVal) {
      },
      deep: true, // 数据层级较深建议深度监听数据变化
      immediate: true
    }
  },
  activated() {
    console.log('======================>')
    this.initData()
    this.showData()
    // 获取节点列表参数
  },
  methods: {
    testSelect(val) {
      console.log(val, this.selectNode)
    },
    testClick() {
      console.log('选中的Id')
    },
    testAutoEmail() {
      let testObj = {}
      const twoObj = {}
      this.cardList.forEach((item, index) => {
        item.userManageMent.forEach(ele => {
          if (ele.id === this.selectNode) {
            testObj = ele
            testObj.nodeId = ele.id
            twoObj.mould = this.cardList[index].title
            twoObj.operation = ele.title
            twoObj.target = this.formInline.sendGoal
          }
        })
      })
      // console.log('===============>', testObj)
      // this.lookNext.data && this.lookNext.data.emailId ? this.lookNext.data.emailId : '',lookInfo
      addOrEditAutoEmailManage({
        ...this.formInline,
        createOpid: this.$store.getters.userInfo.id,
        triggerNode: testObj,
        emailId: this.lookInfo.data && this.lookInfo.data.emailId ? this.lookInfo.data.emailId : ''
      }).then(res => {
        if (res.code === 'ACK') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$emit('loadingStatus', { type: 'auto', id: 1, loadStatus: false })
          this.$emit('newAddEmail', {
            id: 6,
            from: this.lookInfo.from,
            type: 'auto',
            data: {
              emailId: res.data,
              emailType: '2',
              currentNode: twoObj
            },
            templeteType: '2'
          })
        }
      }).catch(err => {
        this.$emit('loadingStatus', { type: 'auto', id: 1, loadStatus: false })
        console.log('err=====>', err)
      })
    },
    handNext() {
      let testObj = {}
      const twoObj = {}
      this.cardList.forEach((item, index) => {
        item.userManageMent.forEach(ele => {
          if (ele.id === this.selectNode) {
            testObj = ele
            testObj.nodeId = ele.id
            twoObj.mould = this.cardList[index].title
            twoObj.operation = ele.title
            twoObj.target = this.formInline.sendGoal
          }
        })
      })
      this.$emit('newAddEmail', {
        id: 6,
        title: '查看下一步',
        from: this.lookInfo.from,
        type: 'auto',
        data: {
          emailId: this.lookInfo.data.emailId,
          emailType: '2',
          currentNode: twoObj
        }
      })
    },
    getEmailInfoTemplate(str) {
      getEmailInfo(str.data).then(res => {
        const { code, data } = res
        if (code === 'ACK') {
          this.formInline.emailName = data.emailName
          this.formInline.sendGoal = data.sendGoal
          if (data.triggerNode && data.triggerNode.nodeId) this.selectNode = data.triggerNode.nodeId.toString()
          this.emailId = data.emailId
        }
      })
    },
    async initData() {
      this.nodeStatus = true
      try {
        const { code, data } = await getEmailTemplateInfo({})
        if (code === 'ACK') {
          this.nodeStatus = false
          data.forEach(item => {
            item.select = []
          })
          this.cardList = data
        }
      } catch (error) {
        this.nodeStatus = false
        console.log('error=======>', error)
      }
    },
    showData() {
      const { data } = this.componentsInfo
      this.lookInfo = data
      if (data.from === 'view') {
        this.isDisabled = true
        this.getEmailInfoTemplate(data)
      } else if (data.from === 'editor') {
        this.isDisabled = false
        this.getEmailInfoTemplate(data)
      } else if (data.from === 'add') {
        if (data.data && data.data.emailId) this.getEmailInfoTemplate(data)
        console.log('showData', data)
      }
    },
    async save() {
      await this.saveForm()
    },
    saveForm() {
      if (!this.selectNode) {
        this.$message({
          message: '至少选取一个节点',
          type: 'warning' })
        return false
      }
      // }
      // const 接口调用 = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('loadingStatus', { type: 'auto', id: 1, loadStatus: true })
          this.testAutoEmail()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .page_manage ::v-deep .el-card__body{
    padding: 40px 60px;
    box-sizing: border-box;
  }

  .page_manage ::v-deep .el-select{
    width: 100%;
  }

  .page_manage ::v-deep .el-form-item__content{
    width: calc(100% - 120px);
  }

  .page_manage ::v-deep .el-form-item {
    margin-bottom: 0px;
  }

  .box-card {
    width: 100%;
    .card_header{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        .label_width{
            width: 220px;
        }
        .label_width_new{
          width: 160px;
        }
        .input_width{
            // width: 85%;
        }
        .maginRight{
          margin-right: 10px;
        }
        .maginLeft{
         margin-left: 10px;
        }
    }
    .card_content{
        width: 100%;
        .content_title{
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 25px 0px;
            border-left: 4px solid #2494FE;
            padding: 2px 0px 2px 8px;
        }
        .card_info{
            // display: flex;
            // flex-direction: row;
            // flex-wrap: wrap;
        }
    }
  }
</style>
