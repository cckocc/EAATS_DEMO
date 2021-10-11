<template>
  <div>
    <div class="form-body">
      <el-form
        ref="stepThreeForm"
        label-position="top"
        :model="stepThreeObj"
        :disabled="isView"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(form, formIndex) in stepThreeObj.formList"
            :key="form.formId"
            :title="form.name"
            :name="formIndex"
          >
            <template slot="title">
              <div class="collapse-header">
                <span>{{ form.name }}</span>
                <el-button
                  v-if="!isView"
                  size="mini"
                  @click.stop="clearForm(form, formIndex)"
                >
                  <svg-icon icon-class="empty" />{{ $t('common.button.oneClickClear') }}
                </el-button>
              </div>
            </template>
            <section style="padding: 0 10px;">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item
                    :label="$t('acceptanceTest.institutionFullName')"
                    :prop="`formList.${formIndex}.instnName`"
                    :rules="rules.instnName"
                  >
                    <el-input
                      v-model="form.instnName"
                      :placeholder="$t('common.placeholder.required')"
                      maxlength="200"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    :label="$t('acceptanceTest.certificationTestingType')"
                    :prop="`formList.${formIndex}.acceptanceType`"
                    :rules="rules.acceptanceType"
                  >
                    <el-input
                      v-model="form.acceptanceType"
                      :placeholder="$t('common.placeholder.required')"
                      disabled
                    />
                    <!-- <el-select
                      v-model="form.acceptanceType"
                      placeholder="请选择"
                      style="width: 100%;"
                      clearable
                      @change="val => changeAcceptanceType(val, form, formIndex)"
                    >
                      <el-option
                        v-for="acceptanceType in acceptanceTypeFilterList"
                        :key="acceptanceType"
                        :label="acceptanceType"
                        :value="acceptanceType"
                      />
                    </el-select> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item
                    :label="$t('acceptanceTest.nameOfIndependentSoftwareVendors')"
                    :prop="`formList.${formIndex}.devInstitutionName`"
                    :rules="rules.devInstitutionName"
                  >
                    <el-autocomplete
                      v-model.trim="form.devInstitutionName"
                      :maxlength="300"
                      style="width: 100%;"
                      clearable
                      :fetch-suggestions="(queryString, cb) => querySearchAsync(queryString, cb, form)"
                      @select="item => handleSelect(item, form)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    :label="$t('acceptanceTest.productVersion')"
                    :prop="`formList.${formIndex}.productVersion`"
                    :rules="rules.productVersion"
                  >
                    <el-input
                      v-model="form.productVersion"
                      :placeholder="$t('common.placeholder.required')"
                      maxlength="100"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="7">
                  <el-form-item
                    :label="$t('acceptanceTest.contractNameOfTest')"
                    :prop="`formList.${formIndex}.testName`"
                    :rules="rules.testName"
                  >
                    <el-input
                      v-model="form.testName"
                      :placeholder="$t('common.placeholder.required')"
                      maxlength="100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                    :label="$t('acceptanceTest.telephone')"
                    :prop="`formList.${formIndex}.testTel`"
                    :rules="rules.testTel"
                  >
                    <el-input
                      v-model="form.testTel"
                      :placeholder="$t('common.placeholder.required')"
                      maxlength="200"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    :label="$t('acceptanceTest.mail')"
                    :prop="`formList.${formIndex}.testEmail`"
                    :rules="rules.testEmail"
                  >
                    <el-input
                      v-model="form.testEmail"
                      v-limitBytes="500"
                      :placeholder="$t('common.placeholder.required')"
                    />
                    <span class="input-tip">{{ $t('acceptanceTest.mailNote') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item
                    :label="$t('acceptanceTest.productionInterfaceAccount')"
                    :prop="`formList.${formIndex}.prodInterfaceAccountList.length`"
                  >
                    <span slot="label">
                      {{ $t('acceptanceTest.productionInterfaceAccount') }}
                      <!-- <svg-icon v-if="!isView" class="account-add" icon-class="add" @click="showAccountInput(form, formIndex, 'prodInterfaceAccount')" /> -->
                    </span>
                    <el-tag
                      v-for="(tag, tagIndex) in form.prodInterfaceAccountList"
                      :key="tagIndex"
                      @close="handleCloseAccount(tag, tagIndex, form, 'prodInterfaceAccount')"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input v-model="form.prodInterfaceAccountList.length" style="display: none;" />
                    <el-form-item style="display: inline-block;">
                      <el-input
                        v-show="form.prodInterfaceAccountVisible && !isView"
                        ref="prodInterfaceAccount"
                        v-model="form.prodInterfaceAccountInput"
                        :placeholder="$t('common.placeholder.required')"
                        maxlength="200"
                        style="width: 200px;"
                        :disabled="form.acceptanceType === $t('acceptanceTest.newMember')"
                        @keyup.enter.native="confirmAccount(form, 'prodInterfaceAccount')"
                        @blur="confirmAccount(form, 'prodInterfaceAccount')"
                      />
                    </el-form-item>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item :label="$t('acceptanceTest.acceptanceDate')" :prop="'formList.' + formIndex + '.testDate'" :rules="rules.testDate" class="test-date-item">
                    <el-date-picker
                      v-model="form.testDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :placeholder="$t('common.placeholder.selectDate')"
                      style="width: 100%;"
                      disabled
                    />
                    <template v-if="isGripUser || (!isGripUser && !isView)">
                      <el-form v-if="form.isWaiting && operationType === 'audit'" style="display: inline;">
                        <el-button type="primary" size="mini" style="margin-left: 5px;" @click="commandTest(form,form.testDateCalendarId)">{{ $t('acceptanceTest.button.selectTestDate') }}</el-button>
                      </el-form>
                      <el-button v-else type="primary" size="mini" style="margin-left: 5px;" @click="commandTest(form,form.testDateCalendarId)">{{ $t('acceptanceTest.button.selectTestDate') }}</el-button>
                    </template>
                  </el-form-item>
                  <el-form>
                    <el-dialog
                      v-if="form.dialogVisible"
                      :title="$t('acceptanceTest.acceptanceTimeSelection')"
                      :visible.sync="form.dialogVisible"
                      append-to-body
                      :modal-append-to-body="false"
                      :close-on-click-modal="false"
                      :modal="false"
                      class="abow_dialog"
                      :show-close="false"
                      width="50%"
                    >
                      <!-- <el-button-group>
                      <el-button size="mini" icon="el-icon-arrow-left" @click="preMonth" />
                      <el-button size="mini" @click="today">今天</el-button>
                      <el-button size="mini" icon="el-icon-arrow-right" @click="nextMonth" />
                    </el-button-group> -->
                      <!-- v-model="form.testDateCalendarId" -->
                      <el-calendar ref="calendarId" v-loading="calendarLoad">
                        <template
                          slot="dateCell"
                          slot-scope="{date, data}"
                        >
                          <!--自定义内容-->
                          <div :class="[data.isSelected ? 'isSelectDiv' : '']" @click="dataIsSelected(data, form)">
                            <!-- 判断日期情况 -->
                            <div v-for="(itemCalendar,indexCalendar) in calendarData" :key="indexCalendar">
                              <!-- <div :class="itemCalendar.isAlternate === '1' || itemCalendar.isAlternate === '3' || itemCalendar.isAlternate === '4' || itemCalendar.isAlternate === '' ? 'alternateTemDiv' : 'noAlternateTemDiv'"> -->
                              <!-- 若后台返回日期包含日历中的日期 -->
                              <div v-if="(itemCalendar.moreParamDate).indexOf(data.day) != -1">
                                <!-- {{ form.testDateCalendarId }} -->
                                <div v-if="itemCalendar.monthFlag === '1' && itemCalendar.isAlternate !== '2'" style="padding: 8px 8px; box-sizing: border-box;height:96px" :style="itemCalendar.isAlternate === '1' || itemCalendar.isAlternate === '3'|| itemCalendar.isAlternate === '4' ? (data.isSelected ? 'background: #F2F4F8;height: 98px;border: 1px solid #2C6EC0;border-radius:4px' :'background: #F2F4F8;height: 98px;') : (data.isSelected ? 'border: 1px solid #2C6EC0;border-radius:4px' : '')">
                                  <el-row :class="itemCalendar.isAlternate === '' ? 'alternateDiv':'noAlternateDiv'">
                                    <span v-if="itemCalendar.isAlternate === '1' || itemCalendar.isAlternate === '3'|| itemCalendar.isAlternate === '4'" class="is-alternate">{{ $t('acceptanceTest.full') }}</span>
                                    <span v-else class="no-alternate">{{ $t('acceptanceTest.book') }}</span>
                                  </el-row>
                                  <el-row>
                                    <div :class="data.isSelected ? 'dateMiddleSpanChecked' : 'dateMiddleSpan'">
                                      {{ data.day.split('-')[2] }}
                                    </div>
                                  </el-row>
                                  <el-row class="dateDownSpan">
                                    <span v-if="itemCalendar.isAlternate === '1' || itemCalendar.isAlternate === '3'|| itemCalendar.isAlternate === '4'"> <img src="~@/assets/style/testTimeChoose/calendar_icon_flashlight.svg" alt="">{{ $t('acceptanceTest.alternate') }}</span>
                                    <span v-else> <img src="~@/assets/style/testTimeChoose/calendar_icon_calendar.svg" alt="">{{ $t('acceptanceTest.reserve') }}</span>
                                  </el-row>
                                </div>
                                <div v-else class="noThisMonthDate">
                                  <div class="noThisMonthDateSpan">
                                    <span>{{ data.day.split('-')[2] }}</span>
                                  </div>
                                </div>
                              </div>
                            <!-- </div> -->
                            </div>
                          </div>
                        </template>
                      </el-calendar>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelCalendar(form)">{{ $t('common.button.cancel') }}</el-button>
                        <el-button
                          type="primary"
                          @click="enterDateClick(form)"
                        >{{ $t('common.button.confirm2') }}</el-button>
                      </span>
                    </el-dialog>
                  </el-form>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    :label="$t('acceptanceTest.accpetor')"
                    :prop="`formList.${formIndex}.accepterName`"
                    :rules="rules.accepterName"
                  >
                    <el-input v-model="form.accepterName" :placeholder="$t('acceptanceTest.selectAcceptor')" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-form-item
                    :label="$t('acceptanceTest.testingInterfaceAccount')"
                    :prop="`formList.${formIndex}.uatInterfaceAccountList.length`"
                    :rules="rules.interfaceAccount"
                  >
                    <span slot="label" class="account-add-wrap">
                      {{ $t('acceptanceTest.testingInterfaceAccount') }}
                      <svg-icon v-if="!isView" class="account-add" icon-class="add" @click="showAccountInput(form, formIndex, 'uatInterfaceAccount')" />
                    </span>
                    <el-tag
                      v-for="(tag, tagIndex) in form.uatInterfaceAccountList"
                      :key="tagIndex"
                      :closable="!isView"
                      @close="tag => handleCloseAccount(tag, tagIndex, form, 'uatInterfaceAccount')"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input v-model="form.uatInterfaceAccountList.length" style="display: none;" />
                    <el-form-item style="display: inline-block;">
                      <el-input
                        v-show="form.uatInterfaceAccountVisible && !isView"
                        ref="uatInterfaceAccount"
                        v-model="form.uatInterfaceAccountInput"
                        :placeholder="$t('common.placeholder.required')"
                        maxlength="200"
                        style="width: 200px;"
                        @keyup.enter.native="confirmAccount(form, 'uatInterfaceAccount')"
                        @blur="confirmAccount(form, 'uatInterfaceAccount')"
                      />
                    </el-form-item>
                  </el-form-item>
                </el-col>
              </el-row>
            </section>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="prevStep"
      >{{ $t('common.button.lastPage') }}</el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="nextStep('10')"
      >{{ $t('common.button.submit') }}</el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="nextStep('20')"
      >{{ $t('acceptanceTest.button.saveApplicationForm') }}</el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
    <!-- 选择验收人弹出层 -->
    <el-dialog
      :title="$t('acceptanceTest.testerSelection')"
      :visible.sync="dialogVisibleAccepter"
      :close-on-click-modal="false"
      :modal-append-to-body="true"
      append-to-body
      class="abow_dialog_test"
      :modal="true"
      width="60%"
    >
      <component :is="isComponent" ref="AcceptanceTimeChoose" @backTo="backTo" @backToCalendarData="backToCalendarData" />
    </el-dialog>

  </div>
</template>
<script>
import { validateCharacter, validEmail, validTel } from '@/utils/validate'
import {
  parseTime,
  isNull
} from '@/utils/index'
import acceptanceTestApi from '@/api/interface-service/acceptanceTestApi'
import { getDevInstiUserList } from '@/api/myServiceApi'
import { getWorkDay } from '@/api/common'
import { getMonthList } from '@/api/acceptance/resourceController'
export default {
  components: {
    AcceptanceTimeChoose: () => import('@/views/interface-service/acceptance-test/components/AcceptanceTimeChoose.vue')
  },
  props: {
    parentType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    },
    institutionType: {
      type: String,
      default: ''
    },
    urlParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const that = this
    const validateUatInterfaceAccount = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (validateCharacter(value)) {
          callback(this.$t('acceptanceTest.message.notSupportChineseAndFullWidthChar'))
        } else {
          callback()
        }
      }
    }
    const validateOtherAddUatInterfaceAccount = (rule, value, callback) => {
      if (isNull(rule.field)) {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (validateCharacter(rule.field)) {
          callback(new Error(this.$t('acceptanceTest.message.notSupportChineseAndFullWidthChar')))
        } else {
          callback()
        }
      }
    }
    const validateTelNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (validTel(value)) {
          callback()
        } else {
          callback(new Error(this.$t('common.validate.telephone')))
        }
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validEmail(value)) {
          callback(new Error(this.$t('common.validate.email')))
        }
        callback()
      }
    }
    const validateArray = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        callback()
      }
    }
    return {
      centerDialogVisible: false,
      // 等待日历加载标志
      selectTime: '',
      calendarLoad: false,
      accepterForm: {
        cassAccepterQuotaAllocationId: '',
        name: '',
        selectedDate: '',
        formInfo: {}
      },
      selectMonth: {
        queryDate: '',
        formName: '',
        formId: '',
        // 机构场务页面合并场务端需要的字段
        submitUserId: ''
      },
      calendarData: [],
      accepter: '',
      dialogVisible: false,
      dialogVisibleAccepter: false,
      selectPersonVisible: false,
      openTitle: '默认标题',
      isComponent: 'AcceptanceTimeChoose',
      pasteDisabled: true,
      copyObj: null,
      setInterval: null,
      endTimeCanShow: new Date(), // new Date('2022-10-23'),
      numberData: [], // 库存及时间配置
      dayStock: [], // 库存及时间配置
      activeNames: [0], // 默认打开第一个折叠面板
      startTime: 'startTime',
      endTime: 'endTime',
      currentType: null, // 值为startTime 或 endTime
      currentUpdateFormId: null, // 当前表单Id
      IsRenderDate: true,
      devInstiUserList: [],
      rules: {
        accepterName: [
          { required: true, message: this.$t('common.message.required'), trigger: 'change' }
        ],
        testDate: [
          { required: true, message: this.$t('common.message.required'), trigger: 'change' }
        ],
        instnName: [{ required: true, message: this.$t('common.message.required'), trigger: 'blur' }],
        prodInterfaceAccount: [
          { required: false, message: this.$t('common.message.required'), trigger: 'blur' }
        ],
        // uatInterfaceAccount: [{ required: true, message: '不能为空', validator: validateUatInterfaceAccount, trigger: 'blur' }],
        uatInterfaceAccount: [
          {
            required: true,
            validator: validateUatInterfaceAccount,
            trigger: 'blur'
          }
        ],
        otherAddUatInterfaceAccount: [
          {
            required: true,
            validator: validateOtherAddUatInterfaceAccount,
            trigger: 'blur'
          }
        ],
        startTestTime: [
          // { required: true, message: '不能为空', trigger: 'blur' }
        ],
        endTestTime: [
          { required: true, message: this.$t('common.message.required'), trigger: 'change' }
        ],
        acceptanceType: [
          { required: true, message: this.$t('common.message.required'), trigger: 'change' }
        ],
        devInstitutionName: [
          { required: true, message: this.$t('common.message.required'), trigger: ['blur', 'change'] }
        ],
        productVersion: [
          { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
        ],
        testName: [{ required: true, message: this.$t('common.message.required'), trigger: 'blur' }],
        testTel: [
          { required: true, message: this.$t('common.message.required'), trigger: 'blur' },
          { validator: validateTelNo, trigger: 'blur' }
        ],
        testEmail: [
          { required: true, message: this.$t('common.message.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        interfaceAccount: [
          { required: true, validator: validateArray, trigger: 'change' }
        ]
      },
      workDay: null,
      startPickerOptions: {
        cellClassName: date => {
          const that = this
          let result = ''
          const index = that.numberData.findIndex(
            e => e.confDate === that.formatDateForDash(date)
          )
          if (index !== -1) {
            result =
              ` ${that.startTime} time time` + that.numberData[index].confDate
          }
          return result
        },
        disabledDate: time => {
          const currentDay = parseTime(time, '{yyyy}-{mm}-{dd}')
          const currentDayObj = that.dayStock.find(e => e.confDate === currentDay)
          return time.getTime() < (new Date(that.workDay).getTime() - 86400000) || (currentDayObj ? currentDayObj.workDay === '0' : false)
        }
      },
      endPickerOptions: {
        cellClassName: date => {
          const that = this
          let result = ''
          const index = that.numberData.findIndex(
            e => e.confDate === that.formatDateForDash(date)
          )
          if (index !== -1) {
            result =
              ` ${that.endTime} time time` + that.numberData[index].confDate
          }
          return result
        },
        disabledDate: time => {
          const that = this
          const index = that.stepThreeObj.formList.findIndex(
            e => e.formId === that.currentUpdateFormId
          )
          let range = !time.getTime()
          if (index !== -1) {
            const dateList = that.stepThreeObj.formList[index][
              'selectStartTimeObj'
            ]
              ? that.stepThreeObj.formList[index]['selectStartTimeObj'][
                'endTimeList'
              ]
              : null
            if (dateList) {
              const startDate = new Date(`${dateList[0]} 00:00:00`)
              const endDate = new Date(
                `${dateList[dateList.length - 1]} 00:00:00`
              )
              const startTime = startDate.getTime() // 得到时间戳
              const endTime = endDate.getTime() // 得到时间戳
              range = time.getTime() < startTime || time.getTime() > endTime
              if (range) {
                return true
              }
            }
          }
          const currentDay = parseTime(time, '{yyyy}-{mm}-{dd}')
          const currentDayObj = that.dayStock.find(e => e.confDate === currentDay)
          return currentDayObj ? currentDayObj.workDay === '0' : false
        }
      },
      stepThreeObj: {
        formList: []
      }
    }
  },
  computed: {
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    },
    isGripUser() {
      return this.$store.getters.userInfo.userInnerType.name === 'GRIP'
    }
  },
  watch: {
    '$store.state.service.acceptanceTestObj.stepThreeObj.formList': {
      handler(newVal, oldVal) {
        const arr = [
          {
            type: '10',
            label: this.$t('acceptanceTest.newMember')
          },
          {
            type: '20',
            label: this.$t('acceptanceTest.permissionChange')
          },
          {
            type: '30',
            label: this.$t('acceptanceTest.versionUpgrade')
          }
        ]
        // 格式化json
        let formList = JSON.parse(JSON.stringify(newVal))
        console.log('只发生了改变', formList)
        formList = formList.map(form => {
          form.prodInterfaceAccountInput = ''
          form.prodInterfaceAccountVisible = false
          form.prodInterfaceAccountList = form.prodInterfaceAccount ? form.prodInterfaceAccount.split(',') : []
          form.uatInterfaceAccountInput = ''
          form.uatInterfaceAccountVisible = false
          form.uatInterfaceAccountList = form.uatInterfaceAccount ? form.uatInterfaceAccount.split(',') : []
          form.acceptanceType = arr.find(e => e.type === this.parentType).label
          form.isWaiting = form.cassAccepterQuotaAllocationId === 'beAnAlternate'
          return form
        })
        this.stepThreeObj = { formList: formList }
        this.$nextTick(() => {
          this.$refs.stepThreeForm.clearValidate()
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // console.log('传参', this.urlParam)
    this.clearValidate()
    // 获取当前登录人，判断是否为场务用户
    var userinfo = this.$store.getters.userInfo
    if (userinfo.userInnerType.code === '00') {
      this.selectMonth.submitUserId = ''
    } else {
      this.selectMonth.submitUserId = this.urlParam.applyUserId
    }
  },
  async created() {
    console.log('验收测试第三步')
    this.getDevInstiUserList()
    await this.clearValidate()
    await this.getWorkDay()
    await this.getDayStock()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    /**
     * @method: 上一步
     */
    prevStep() {
      this.$emit('changeSteps', 2)
    },
    /**
     * @method: 下一步/保存
     * @param {String} operateType 20-保存、10-下一步
     */
    nextStep(operateType) {
      if (operateType === '20') {
        this.$refs.stepThreeForm.clearValidate()
        this.submitOperate(operateType)
      } else {
        this.$refs.stepThreeForm.validate((valid, prop) => {
          if (valid) {
            this.submitOperate(operateType)
          } else {
            const errArr = []
            for (var key in prop) {
              console.log(key)
              const index = key.split('.')[1]
              errArr.push(Number(index))
            }
            const activeNames = this.activeNames
            activeNames.push(...errArr)
            this.activeNames = [...new Set(activeNames)]
          }
        })
      }
    },
    submitOperate(operateType) {
      const params = JSON.parse(JSON.stringify(this.stepThreeObj.formList))
      if (params.length !== 0) {
        params.map(e => {
          e.operateType = operateType
          e.prodInterfaceAccount = e.prodInterfaceAccountList.join(',')
          e.uatInterfaceAccount = e.uatInterfaceAccountList.join(',')
          delete e.prodInterfaceAccountInput
          delete e.prodInterfaceAccountVisible
          delete e.prodInterfaceAccountList
          delete e.uatInterfaceAccountInput
          delete e.uatInterfaceAccountVisible
          delete e.uatInterfaceAccountList
          delete e.testDateCalendarId
          return e
        })
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      acceptanceTestApi.saveBaseInfo(params).then(res => {
        if (operateType === '10') {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.$router.push({
            name: 'MyService',
            params: {
              institutionType: this.institutionType,
              isCurrentByMe: true
            }
          })
        } else {
          this.$message({
            message: this.$t('acceptanceTest.message.saveSuccess'),
            type: 'success'
          })
        }
      }).finally(() => {
        loading.close()
      })
    },
    handleCloseAccount(tag, tagIndex, form, key) {
      form[`${key}List`].splice(tagIndex, 1)
    },
    showAccountInput(form, formIndex, key) {
      form[`${key}Visible`] = true
      form[`${key}Input`] = ''
      this.$nextTick(() => {
        this.$refs[key][formIndex].$refs.input.focus()
      })
    },
    confirmAccount(form, key) {
      if (form[`${key}Input`]) {
        form[`${key}List`].push(form[`${key}Input`])
      }
      form[`${key}Visible`] = false
      form[`${key}Input`] = ''
    },
    clearForm(form, formIndex) {
      console.log(form, formIndex)
      const defaultForm = {
        devInstitutionId: null,
        devInstitutionName: null,
        productVersion: null,
        testName: null,
        testTel: null,
        testEmail: null,
        testDate: null,
        accepterName: null,
        prodInterfaceAccountInput: '',
        prodInterfaceAccountVisible: null,
        uatInterfaceAccountInput: '',
        uatInterfaceAccountVisible: null,
        uatInterfaceAccountList: []
      }
      Object.assign(form, defaultForm)
      this.$nextTick(() => {
        for (const key in defaultForm) {
          this.$refs.stepThreeForm.clearValidate(`formList.${formIndex}.${key}`)
        }
        this.$refs.stepThreeForm.clearValidate([
          `formList.${formIndex}.prodInterfaceAccountList.length`,
          `formList.${formIndex}.uatInterfaceAccountList.length`
        ])
      })
    },
    // 提供子组件调用返回方法
    async backToCalendarData(msg, item) {
      // console.log(msg)
      this.dialogVisible = true
      var dateNew = new Date()
      var year = dateNew.getFullYear()
      var month =
      dateNew.getMonth() + 1 < 10
        ? '0' + (dateNew.getMonth() + 1)
        : dateNew.getMonth() + 1
      this.selectMonth.queryDate = year + '-' + month
      const waitForm = this.stepThreeObj.formList.find(form => form.formId === item.formId)
      console.log(waitForm)
      // 获取验收日历
      const res = await getMonthList(this.selectMonth)
      console.log('获取验收日历', res)
      this.calendarData = res.data
      this.delSurpNum(this.calendarData, item)
      waitForm.dialogVisible = true
      this.$forceUpdate()
      this.dialogVisibleAccepter = false
      if (msg !== '') {
        this.$message({
          type: 'warning',
          message: msg
        })
      }
    },
    // 清空日历方法
    emptyCalendar(formId) {
      const waitForm = this.stepThreeObj.formList.find(form => form.formId === formId)
      console.log('清空日历', waitForm.testDateCalendarId)
      if (waitForm) {
        console.log('waitForm============>', waitForm)
        // debugger
        waitForm.testDateCalendarId = new Date()
      }
    },
    // cancelCalendar 取消日期
    cancelCalendar(item) {
      this.dialogVisible = false
      item.dialogVisible = false
      this.$forceUpdate()
    },
    // 确认日期选择方法
    enterDateClick(form) {
      const waitForm = this.stepThreeObj.formList.find(form => form.formId === this.accepterForm.formInfo.formId)
      const currentDay = parseTime(new Date(), '{yyyy}-{mm}-{dd}')
      const isCurrentDay = new Date(this.selectTime).getTime() <= new Date(currentDay).getTime() // 判断当前时间选择不能为今天及今天之前
      if (!this.selectTime) {
        this.$message({
          type: 'warning',
          message: this.$t('acceptanceTest.message.dateValidate1')
        })
        return false
        // console.log(new Date().toLocaleDateString())
      } else if (isCurrentDay) {
        this.$message({
          type: 'warning',
          message: this.$t('acceptanceTest.message.dateValidate2')
        })
        return false
      }
      //  this.calendarData.forEach(item=>{})
      const formName = this.accepterForm.formInfo.name + ''
      const day = this.accepterForm.selectedDate + ''
      var list = this.calendarData.concat([])
      // 候补标志
      var beAnAlternate = false
      let beIsSelect = false // 用来判断当前时间是否是可选择状态
      list.forEach(item => {
        if (item.moreParamDate === day) {
          // 若为候补
          if (item.isAlternate === '1' || item.isAlternate === '3' || item.isAlternate === '4') {
            beAnAlternate = true
          }
          if (item.isAlternate === '2') {
            beIsSelect = true
          }
        }
      })
      console.log('确认日期选择方法', this.accepterForm)
      console.log('是否候补', beAnAlternate)
      if (beIsSelect) {
        this.$message({
          type: 'warning',
          message: this.$t('acceptanceTest.message.dateValidate3')
        })
        return false
      }
      if (!beAnAlternate) {
        // 若不为候补日期
        var now = new Date()
        var dayTime = new Date(day)
        if (dayTime.getTime() <= now.getTime()) {
          this.$message({
            type: 'warning',
            message: this.$t('acceptanceTest.message.dateValidate4')
          })
          return false
        }
        this.dialogVisible = false
        waitForm.dialogVisible = false
        this.$forceUpdate()
        this.dialogVisibleAccepter = true
        this.$nextTick(() => {
          this.isComponent = 'AcceptanceTimeChoose'
          this.$refs.AcceptanceTimeChoose.routerLinkCreated(day, this.accepterForm.formInfo.enName, this.isGripUser ? waitForm.instnName : null, this.stepThreeObj.formList, waitForm, this.urlParam.applyUserId)
        })
      } else {
        // 若为候补日期则直接返回上一界面，将验收人填写为候补
        if (!this.isGripUser) {
          this.$alert(this.$t('acceptanceTest.alternateTip'), this.$t('acceptanceTest.alternateTipTitle'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('acceptanceTest.button.known'),
            showClose: false,
            // center: true,
            showCancelButton: false,
            customClass: 'org-tip-wrap',
            confirmButtonClass: 'confirm_accpet'
          })
        }
        this.stepThreeObj.formList.map(form => {
          if (form.formId === this.accepterForm.formInfo.formId) {
            form.cassAccepterQuotaAllocationId = 'beAnAlternate'
            form.accepterName = this.$t('acceptanceTest.alternate')
            form.testDate = this.accepterForm.selectedDate
          }
        })
        this.dialogVisible = false
        waitForm.dialogVisible = false
        this.$forceUpdate()
      }
    },
    // 上个月
    async preMonth() {
      // var yyyyMM = this.selectMonth.queryDate.split('-')
      // var year = Number(yyyyMM[0])
      // var month = Number(yyyyMM[1])
      // var perMonth = month - 1
      // if (perMonth < 1) {
      //   year = year - 1
      //   perMonth = 12
      // }
      // var map = {
      //   queryDate: year + '-' + this.addZero(perMonth),
      //   formName:this.accepterForm.formInfo.name,
      //   formName:this.accepterForm.formInfo.enName,
      //   formId:''
      // }
      // const res = await getMonthList(map)
      // this.calendarData = res.data
      let data,item
           data = {
        queryDate: year + '-' + this.addZero(perMonth),
        formName:this.accepterForm.formInfo.name,
        formName:this.accepterForm.formInfo.enName,
        formId:''
      }
      this.dataIsSelected(data, this.form)
    },
    addZero(day) {
      if (Number(day) < 10) {
        return '0' + day
      } else {
        return '' + day
      }
    },
    // 下个月
    async nextMonth() {
      var yyyyMM = this.selectMonth.queryDate.split('-')
      var year = Number(yyyyMM[0])
      var month = Number(yyyyMM[1])
      var perMonth = month + 1
      if (perMonth > 12) {
        year = year + 1
        perMonth = 1
      }
      var map = {
        queryDate: year + '-' + this.addZero(perMonth)
      }
      const res = await getMonthList(map)
      this.calendarData = res.data
    },
    // 今天
    today() {

    },
    // 选中时间调用方法
    async dataIsSelected(data, item) {
      console.log('选中时间调用', data, item)
      // data.isSelected = true
      this.selectTime = data.day
      console.log('选中的日期', this.selectTime)
      // 比较选中日期是否为当前月，若不是则重新加载列表
      var selectedDay = new Date(data.day)
      // console.log('选中的日期', selectedDay)

      // const waitForm = this.stepThreeObj.formList.find(form => form.formId === item.formId)
      // console.log('清空日历', waitForm.testDateCalendarId)
      // if (waitForm) {
      //   console.log('waitForm============>', waitForm)
      //   // debugger
      //   waitForm.testDateCalendarId = selectedDay
      // }
      // const waitForm = this.stepThreeObj.formList.find(form => form.formId === item.formId)
      // console.log("选中时间调用waitForm========", waitForm.testDateCalendarId);
      // waitForm.testDateCalendarId = new Date(data.day)
      var year = selectedDay.getFullYear()
      var month =
        selectedDay.getMonth() + 1 < 10
          ? '0' + (selectedDay.getMonth() + 1)
          : selectedDay.getMonth() + 1
      var date = year + '-' + month
      if (date !== this.selectMonth.queryDate) {
        this.calendarLoad = true
        this.selectMonth.queryDate = date
        this.selectMonth.formName = this.accepterForm.formInfo.name
        this.selectMonth.formId = this.accepterForm.formInfo.enName
        const res = await getMonthList(this.selectMonth)
        this.calendarData = res.data
        this.delSurpNum(this.calendarData, item)
      }
      // 给获取到的日期赋值确定展示的样式
      // this.calendarData.forEach(item => {
      //   var oDate2 = new Date(item.moreParamDate)
      //   if (selectedDay === oDate2) {
      //     item.isSelected = true
      //   } else {
      //     item.isSelected = false
      //   }
      // })
      this.$forceUpdate()
      this.$nextTick(() => {
        console.log('当前表单名为', this.accepterForm.formInfo.name)
        this.accepterForm.selectedDate = data.day
      })
    },
    // 点击选择验收时间,传入当前表单信息
    async commandTest(item, list) {
      this.calendarLoad = true
      // item.testDate = null
      // item.testDateCalendarId = null
      console.log('可能是这1122个', item)
      console.log('测试时间选择LIst', list)
      console.log('测试时间选择', item.testDate)
      console.log('测试时间选择model', item.testDateCalendarId)
      // debugger
      await this.emptyCalendar(item.formId)
      this.$nextTick(async() => {
        this.dialogVisible = true
        item.dialogVisible = true
        this.$forceUpdate()
        this.accepterForm.formInfo = item
        this.selectMonth.formName = item.name
        this.selectMonth.formId = item.enName
        // if (item.testDate === '' || item.testDate === null || item.testDate === undefined) {
        var dateNew = new Date()
        if (item.testDateCalendarId) {
          dateNew = item.testDateCalendarId
        }
        var year = dateNew.getFullYear()
        var month = dateNew.getMonth() + 1 < 10
          ? '0' + (dateNew.getMonth() + 1)
          : dateNew.getMonth() + 1
        this.selectMonth.queryDate = year + '-' + month
        // }
        console.log('测试时间选择，搜索条件', this.selectMonth.queryDate)
        // 获取验收日历
        const res = await getMonthList(this.selectMonth)
        console.log('获取验收日历', res)
        this.calendarData = res.data
        this.delSurpNum(this.calendarData, item)
      })
    },
    // 前端扣除验收人判断逻辑
    // 前端处理扣减名额信息
    delSurpNum(calendarData, row) {
      console.log('前端处理扣减名额信息', this.stepThreeObj.formList)
      var list = this.stepThreeObj.formList.concat([])
      list.forEach(item => {
        var testdate = item.testDate
        // 若有验收人id,无论候补还是正常选择都代表有人
        if (item.cassAccepterQuotaAllocationId && item.cassAccepterQuotaAllocationId !== row.cassAccepterQuotaAllocationId && item.cassAccepterQuotaAllocationId !== 'beAnAlternate') {
          // 获取该验收时间
          calendarData.forEach(dateInfo => {
            if (dateInfo.moreParamDate === testdate) {
              if (dateInfo.surpNum > 1) {
                dateInfo.surpNum = dateInfo.surpNum - 1
              } else {
                if (dateInfo.isAlternate !== '2') {
                  dateInfo.isAlternate = '3'
                }
              }
            }
          })
        }
      })
      calendarData.forEach(dateInfo => {
        var now = new Date()
        var oDate2 = new Date(dateInfo.moreParamDate)
        // 若验收单占用名额为0 时，无论剩余名额是否为0，只要有人支持就显示预约,
        if (dateInfo.occupyQuantity === 0) {
          if (dateInfo.noAccepter === 0) {
            dateInfo.isAlternate = '0'
          } else if (dateInfo.quotaNum > 0 && (dateInfo.noAccepter === 1 && oDate2 > now)) {
            dateInfo.isAlternate = '3'
          }
        } else {
          if (dateInfo.quotaNum > 0 && dateInfo.isAlternate !== '2' && ((dateInfo.surpNum === 0 && dateInfo.noAccepter === 0) || (dateInfo.noAccepter === 1 && oDate2 > now))) {
            // 当天有名额但是不支持该接口的信息 则显示候补
            dateInfo.isAlternate = '3'
          }
        }
        if (oDate2 <= now) {
          dateInfo.isAlternate = '2'
        }
      })
      this.calendarLoad = false
      this.$forceUpdate()
    },
    getWorkDay() {
      const params = {
        offset: 1
      }
      getWorkDay(params).then(res => {
        if (res.code === 'ACK') {
          this.workDay = res.data
        }
      })
    },
    getDayStock() {
      acceptanceTestApi.getTimeAndStock().then(res => {
        if (res.code === 'ACK') {
          this.dayStock = res.data
        }
      })
    },
    copyContact(index) {
      this.copyObj = this.stepThreeObj.formList[index]
      this.pasteDisabled = false
    },
    pasteContact(index) {
      const copyItemObj = {
        instnName: this.copyObj.instnName,
        prodInterfaceAccount: this.copyObj.prodInterfaceAccount,
        uatInterfaceAccount: this.copyObj.uatInterfaceAccount,
        interfaceAccountList: JSON.parse(
          JSON.stringify(this.copyObj.interfaceAccountList)
        ),
        // startTestTime: this.copyObj.startTestTime,
        // endTestTime: this.copyObj.endTestTime,
        testName: this.copyObj.testName,
        testTel: this.copyObj.testTel,
        testEmail: this.copyObj.testEmail,
        acceptanceType: this.copyObj.acceptanceType,
        devInstitutionId: this.copyObj.devInstitutionId,
        devInstitutionName: this.copyObj.devInstitutionName,
        productVersion: this.copyObj.productVersion
      }
      Object.assign(this.stepThreeObj.formList[index], copyItemObj)
      this.$message({
        type: 'warning',
        message: this.$t('acceptanceTest.message.dateMustChangedManually')
      })
    },
    /**
     * @method: 改变验收类型事件
     */
    changeAcceptanceType(val, form, formIndex) {
      console.log(val, formIndex, formIndex)
      if (val === this.$t('acceptanceTest.newMember')) {
        form.prodInterfaceAccountInput = ''
        form.prodInterfaceAccountVisible = false
        form.prodInterfaceAccountList = []
        // form.uatInterfaceAccountInput = ''
        // form.uatInterfaceAccountVisible = false
        // form.uatInterfaceAccountList = []
        this.$refs.stepThreeForm.clearValidate([
          `formList.${formIndex}.prodInterfaceAccountList.length`
          // `formList.${formIndex}.uatInterfaceAccountList.length`
        ])
      }
    },
    /**
     * @method: 清空表单校验
     */
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.stepThreeForm.resetFields()
      })
    },
    backTo(object) {
      this.dialogVisibleAccepter = false
      this.dialogVisible = false
      const waitForm = this.stepThreeObj.formList.find(form => form.formId === this.accepterForm.formInfo.formId)
      waitForm.dialogVisible = false
      waitForm.testDateCalendarId = new Date()
      waitForm.cassAccepterQuotaAllocationId = object.cassAccepterQuotaAllocationId
      waitForm.accepterName = object.name
      waitForm.testDate = object.testDate
      console.log(this.stepThreeObj.formList)
      this.$forceUpdate()
      if (this.isGripUser) {
        this.updateDate(object)
      }
    },
    updateDate(args) {
      const param = {
        accepterName: this.accepterForm.formInfo.accepterName,
        applyOrdNo: this.accepterForm.formInfo.applyOrdNo,
        cassAccepterQuotaAllocationId: this.accepterForm.formInfo.cassAccepterQuotaAllocationId,
        formId: this.accepterForm.formInfo.enName,
        formName: this.accepterForm.formInfo.name,
        testApplyNo: this.accepterForm.formInfo.formId,
        testDate: args.testDate
      }
      acceptanceTestApi.candidateUpdate(param).then(res => {
        this.$parent.getDetail(this.accepterForm.formInfo.applyOrdNo)
        this.$message({
          type: 'success',
          message: this.$t('common.message.updateSuccess')
        })
      })
    },
    formatDateForDash(date) {
      if (date === '' || date === null || date === undefined) return ''
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? `0${m}` : m
      let d = date.getDate()
      d = d < 10 ? `0${d}` : d
      return `${y}-${m}-${d}`
    },
    getDevInstiUserList() {
      const params = {
        fullName: ''
      }
      getDevInstiUserList(params).then(res => {
        this.devInstiUserList = res.data.map(e => {
          e.value = e.devInstitutionName
          return e
        })
      })
    },
    querySearchAsync(queryString, cb, form) {
      const results = queryString ? this.devInstiUserList.filter(e => e.devInstitutionName.includes(queryString)) : this.devInstiUserList
      if (results.length === 0) {
        form.devInstitutionId = null
      }
      cb(results)
    },
    handleSelect(item, form) {
      console.log(item)
      form.devInstitutionId = item.devInstitutionId
    }
  }
}
</script>

<style lang="scss" scoped>
.test-date-item {
  ::v-deep .el-form-item__content {
    display: flex;
  }
}
::v-deep .el-tag {
  margin: 0 10px 10px 0;
  & + .el-tag {
    margin: 0 10px 10px 0;;
  }
}
.account-add {
  &-wrap {
    position: relative;
  }
  color: #009DD9;
  position: absolute;
  top: 0;
  right: -40px;
}
.input-tip {
  color: #FF6161;
  font-size: 12px;
  &:before {
    content: '';
    width: 12px;
    height: 12px;
    background: #FF6161;
    border-radius: 50%;
  }
}
::v-deep .el-calendar-table .el-calendar-day {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0px;
    height: 98px;
}
.isSelectDiv {
  height: 98px;
  background: #EFF5FF;
  // border: 1px solid #2C6EC0;
  opacity: 1;
  border-radius: 4px;
}
.noAlternateTemDiv {
  height: 98px;
  background: #FFFFFF;
  opacity: 1;
  border-radius: 4px;
}
.alternateTemDiv {
  height: 98px;
  background: #F2F4F8;
  opacity: 1;
  border-radius: 4px;
}
.alternateDiv {
  width: 20px;
  // margin: 10px 0px 0px 10px;
  box-sizing: border-box;
  background: #E4E6EA;
  opacity: 1;
  border-radius: 2px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
}
.noAlternateDiv {
  box-sizing: border-box;
  background:  #D5E4FD;
  border-radius: 2px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
  display: inline-block;
  padding: 0 5px;
}
.is-alternate {
  font-size: 12px;
  font-family: Microsoft YaHei;
  line-height: 16px;
  color: #333333;
}
.no-alternate {
  width: 12px;
  height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 16px;
  color: #0050B3;
  opacity: 1;
}
.dateMiddleSpanChecked {
  text-align: center;
  height: 37px;
  font-size: 28px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 37px;
  color: #0050B3;
  // color: red;

  -webkit-text-stroke: 1 #0050B3;
  opacity: 0.9;
}
.dateMiddleSpan {
  text-align: center;
  height: 37px;
  font-size: 28px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 37px;
  color: #333333;
  -webkit-text-stroke: 1 #333333;
  opacity: 0.9;
}
.dateDownSpan {
  height: 28px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #0050B3;
  display: flex;
  justify-content: center;
  align-items: center;
  &>span {
    display: flex;
    justify-content: center;
    align-items: center;
    &>img {
      margin-right: 5px;
    }
  }
}
.noThisMonthDate {
  // margin: 0px auto;
  height: 98px;
  text-align: center;
  background: #FFFFFF;
  opacity: 1;
  border-radius: 4px;
  .noThisMonthDateSpan {
    height: 98px;
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 98px;
    color: #B7B7B7;
    -webkit-text-stroke: 1 #B7B7B7;
    opacity: 0.9;
  }
}
.el-dialog ::v-deep .el-dialog__body{
  margin-top: 20px;
  margin-left: 20px;
  background-color: red;
}
.abow_dialog ::v-deep .el-calendar__button-group {
  display: none;
}

</style>
<style lang="scss">
.el-message-box.org-tip-wrap {
  .el-message-box__btns {
    text-align: center;
  }
}
</style>
