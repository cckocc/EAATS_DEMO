<template>
  <div class="acceptance-time-choose">
    <div class="content">
      <!-- <el-form>
        <el-form-item label="验收人">
          <el-select v-model="accepterForm.cassAccepterQuotaAllocationId" placeholder="请选择验收人" @change="backToParent(accepterForm.cassAccepterQuotaAllocationId)">
            <el-option v-for="item in accepterList" :key="item.cassAccepterQuotaAllocationId" :label="item.name" :value="item.cassAccepterQuotaAllocationId" />
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-row>
        <el-form :inline="true">
          <el-form-item :label="$t('acceptanceTest.accpetor')">
            <el-input v-model="queryAccepterForm.accepterName" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getAccepter()">{{ $t('common.button.inquiry') }}</el-button>
            <el-button size="mini" @click="onReset()"><span style="color:#3B3B3B">{{ $t('common.button.reset') }}</span></el-button>
            <el-button size="mini" @click="backToCalendarData()"><span style="color:#3B3B3B">{{ $t('acceptanceTest.backCalendar') }}</span></el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <span style="height:24px;line-height:24px;font-weight:bold;font-size:16px;">
          <img src="~@/assets/style/testTime/csryxz_check.svg" style="width:24px;height:24px;margin-right:5px;vertical-align: bottom;" alt="">
          {{ queryAccepterForm.date }}
        </span>
      </el-row>
      <div v-loading="accepterLoad">
        <el-row v-if="accepterList.length > 0">
          <el-card v-for="item in accepterList" :key="item.cassAccepterQuotaAllocationId" style="margin-top: 24px;" class="contentBox">
            <el-row style="display: flex;flex-direction: row" :gutter="20">
              <el-col :span="8" style="display: flex;flex-direction: column;width: 45%">
                <span class="name">{{ item.name }}</span>
                <div class="prefer">
                  <span>{{ $t('acceptanceTest.adept') }}：</span>
                  <span v-if="item.expert" :title="item.expert">
                    {{ item.expert.length >24 ? item.expert.substring(0,23) + '...' : item.expert }}
                  </span>
                  <span v-else>{{ $t('acceptanceTest.noInformation') }}</span>
                </div>
              </el-col>
              <el-col v-if="scoreFlag" :span="7">
                <div style="margin-top:20px">
                  <el-rate
                    v-model="item.scorePage"
                    disabled
                    text-color="#ff9900"
                    void-color="#99A8B7"
                    disabled-void-color="#99A8B7"
                    :max="5"
                    score-template="{value}"
                  />
                </div>
              </el-col>
              <el-col
                v-if="scoreFlag"
                :span="3"
                style="display: flex;flex-direction: column;justify-content: space-between;"
              >
                <el-row>
                  <span style="color:#8C8C8C">{{ $t('acceptanceTest.evaluationScore') }}</span>
                </el-row>
                <el-row
                  style="display: flex;
                justify-self: flex-end;
                margin-top: 7px;"
                >
                  <span v-if="!isNull(item.score)" style="color:#FFA940;font-size: 20px;">
                    {{ item.score + $t('acceptanceTest.score') }}
                  </span>
                  <span v-else>{{ $t('acceptanceTest.noInformation') }}</span>
                </el-row>
              </el-col>
              <el-col v-if="bookingFlag&&scoreFlag" :span="1">
                <el-divider direction="vertical" />
              </el-col>
              <el-col v-if="bookingFlag" :span="3" style="display: flex;flex-direction: column;justify-content: space-between;">
                <el-row>
                  <span style="color:#8C8C8C">{{ $t('acceptanceTest.reservationAmount') }}</span>
                </el-row>
                <el-row>
                  <span v-if="item.allocatedQuantity" style="color:#333333;font-size:18px;text-align:center">
                    {{ item.allocatedQuantity }}
                  </span>
                  <span v-else>{{ $t('acceptanceTest.noInformation') }}</span>
                </el-row>
              </el-col>
              <el-col :span="3" :offset="getDistance()">
                <el-button type="primary" size="mini" style="width:77px;height:30px;background-color:#2C76D1;color:#fff;margin-right:20px;margin-top:15px" @click="backToParent(item.cassAccepterQuotaAllocationId)">{{ $t('acceptanceTest.reserve') }}</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row v-else>
          {{ $t('common.noInformationData') }}
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { reqAccepter } from '@/api/interface-service/acceptanceTestApi'
import { reqQuantitySwitch, getScoreSwitch } from '@/api/acceptance/resourceController'
import { queryAcceptanceList } from '@/api/acceptance/functionModel'
import { isNull } from '@/utils/validate'
export default {
  name: 'AcceptanceTimeChoose',
  data() {
    return {
      accepterLoad: false,
      queryAccepterForm: {
        date: '',
        instnName: '',
        enName: '',
        accepterName: '',
        submitUserId: ''
      },
      accepterForm: {
        cassAccepterQuotaAllocationId: ''
      },
      accepterList: [],
      allAccepter: [],
      scoreFlag: false,
      bookingFlag: false,
      smallList: [],
      // 当前操作的元素
      form: {},
      smallNameList: [],
      numlist: [],
      page: {
        page: 1,
        pageSize: 10
      }
    }
  },
  // created() {
  //   this.getAccepter()
  //   this.getQuantityInitValue()
  //   this.getSwitchScoreInitValue()
  // },
  methods: {
    isNull,
    getDistance() {
      var count = 0
      if (!this.bookingFlag) {
        count += 3
      }
      if (!this.scoreFlag) {
        count += 8
      }
      if (!this.bookingFlag && !this.scoreFlag) {
        count += 1
      }
      return count
    },

    routerLinkCreated(date, enName, instnName, object, form, submitUserId) {
      // object为判断是否已被选择的验收人
      this.smallList = object.concat([])
      // 赋值当前操作的单元格
      this.form = form
      // 机构名称在审核选择验收人时候传入
      if (instnName) {
        this.queryAccepterForm.instnName = instnName
      }
      if (submitUserId !== '' && submitUserId !== null && submitUserId !== undefined) {
        this.queryAccepterForm.submitUserId = submitUserId
      }
      this.accepterLoad = true
      console.log(date, enName)
      this.queryAccepterForm.accepterName = ''
      this.accepterList = []
      this.queryAccepterForm.date = date
      this.queryAccepterForm.enName = enName
      this.getAccepter()
      this.getQuantityInitValue()
      this.getSwitchScoreInitValue()
    },
    //   查询预约量开关当前值【0-不展示，1-展示】
    async getQuantityInitValue() {
      const res = await reqQuantitySwitch()
      if (res.data === '0') {
        this.bookingFlag = false
      } else {
        this.bookingFlag = true
      }
      console.log('预约量开关初始值', res.data)
    },
    // 查询评分开关当前值【0-不展示，1-展示】
    async getSwitchScoreInitValue() {
      const res = await getScoreSwitch()
      if (res.data === '0') {
        this.scoreFlag = false
      } else {
        this.scoreFlag = true
      }
      console.log('预约量开关初始值', res.data)
    },
    // 返回日历页面
    backToCalendarData() {
      this.$emit('backToCalendarData', '', this.form)
    },
    // 确认选择人员信息
    backToParent(cassAccepterQuotaAllocationId) {
      const list = this.accepterList.filter(item => item.cassAccepterQuotaAllocationId === cassAccepterQuotaAllocationId)
      this.$emit('backTo', { ...list[0], testDate: this.queryAccepterForm.date })
    },
    // 查询所有接口占用名额数量
    async initSelectNum() {
      const { data } = await queryAcceptanceList(this.page)
      // console.log(data)
      this.numlist = data
      this.numlist.forEach(item => {
        this.smallList.forEach(small => {
          if (small.name === item.formName) {
            small.occupyQuantity = item.occupyQuantity
          }
        })
      })
      console.log(this.numlist)
    },
    // 页面搜索验收人 及查询列表接口
    async getAccepter() {
      try {
        await this.initSelectNum()
        // console.log('前一个单子占用数量', this.smallList)
        this.accepterList = []
        const res = await reqAccepter(this.queryAccepterForm)
        console.log('弹出层放回', res)
        console.log('当前操作元素', this.form)
        var list = res.data
        this.accepterLoad = false
        var tableList = []
        // 处理获取到到联系人
        if (list.length > 0) {
          list.forEach(element => {
            var surpNum = element.surpNum
            console.log('联系人', element.accepterName)
            var numFlag = false
            this.smallList.forEach(item => {
              if (item.testDate === this.queryAccepterForm.date && element.cassAccepterQuotaAllocationId === item.cassAccepterQuotaAllocationId && item.occupyQuantity > 0) {
                if (surpNum > 1) {
                  element.surpNum = surpNum - 1
                } else {
                  element.surpNum = 0
                }
              }

              // if (element.occupyQuantity === 0) {
              //   numFlag = true
              // } else {
              // }
            })
            if (this.form.cassAccepterQuotaAllocationId !== null || this.form.cassAccepterQuotaAllocationId !== '' || this.form.cassAccepterQuotaAllocationId !== undefined) {
              console.log(element.accepterName)
              console.log(this.form.accepterName)
              console.log(element.cassAccepterQuotaAllocationId)
              console.log(this.form.cassAccepterQuotaAllocationId)
              if (element.cassAccepterQuotaAllocationId === this.form.cassAccepterQuotaAllocationId) {
                element.surpNum = surpNum + 1
              }
            }
            if (element.surpNum > 0 || element.occupyQuantity === 0) {
              numFlag = true
            }
            if (numFlag) {
              tableList.push(element)
            }
          })
        }
        this.accepterList = tableList.concat([])
      } catch (error) {
        console.log(error)
      }
    },

    // 重置按钮
    onReset() {
      this.queryAccepterForm.accepterName = ''
      // this.getAccepter()
    }
  }
}
</script>

<style lang='scss' scoped>
.contentBox:hover{
  border: 1px solid rgb(145, 208, 255);
  box-shadow: 0 0 10px rgb(145, 208, 255);
}
 .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .name{
    font-weight: bold;
    font-size: 18px;
    // margin-bottom: 20px;
  }
  .prefer{
    margin-top: 20px;
    color: #8C8C8C;
  }

  .el-divider--vertical{
    height: 4em;
  }
  .content{
    padding: 21px 24px;
  }
</style>

<style>
.acceptance-time-choose .content .el-icon-star-on {
  font-size: 24px;
}
</style>
