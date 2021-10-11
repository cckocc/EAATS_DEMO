<template>
  <div>
    <div class="form-body">
      <el-form
        ref="stepTwoForm"
        :model="stepTwoObj"
        :disabled="isView"
        inline
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(form, formIndex) in stepTwoObj.formList"
            :key="form.formId"
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
            <section v-for="(question, questionIndex) in form.questionList" :key="question.key">
              <h3>
                {{ `${questionIndex + 1}、${question.question}` }}
                <el-tooltip v-if="question.prompt">
                  <div slot="content" style="white-space: pre-wrap;" v-text="question.prompt" />
                  <i class="el-icon-question" />
                </el-tooltip>
                <span v-if="isShowRequire(question)" style="color: #ff4949;">*</span>
              </h3>
              <el-form-item
                v-for="(option, optionIndex) in question.options"
                :key="option.elementKey"
                :label="option.elementText"
                :rules="option.disabled ? defaultRule() : option.rules"
                :prop="`formList.${formIndex}.questionList.${questionIndex}.options.${optionIndex}.value`"
              >
                <template v-if="option.elementType === 'radio'">
                  <el-radio-group
                    v-model="option.value"
                    :disabled="option.disabled"
                    @change="val => onChangeRadio(val, option, question, form, stepTwoObj.formList)"
                  >
                    <el-radio
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.childElementText }}</el-radio>
                  </el-radio-group>
                </template>
                <template v-if="option.elementType === 'input' || option.elementType === 'remark_input'">
                  <el-input
                    v-model="option.value"
                    :disabled="option.disabled"
                    maxlength="2000"
                    clearable
                  >
                    <el-button v-if="!option.disabled && option.rulesObj.dialogConfig && (option.rulesObj.dialogConfig.alwaysShow || option.rulesObj.dialogConfig.show)" slot="append" icon="el-icon-edit" @click="showDialog(option.rulesObj.dialogConfig, option, question, form)" />
                  </el-input>
                </template>
                <template v-if="option.elementType === 'checkbox'">
                  <el-checkbox-group
                    v-model="option.value"
                    :disabled="option.disabled"
                    @change="val => onChangeCheckbox(val, option, question, form, stepTwoObj.formList)"
                  >
                    <el-checkbox
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.childElementText }}</el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-if="option.elementType === 'drop_down_box'">
                  <el-select
                    v-model="option.value"
                    :disabled="option.disabled"
                    :placeholder="$t('common.placeholder.chose')"
                    clearable
                    @change="val => onChangeSelect(val, option, question, form, stepTwoObj.formList)"
                  >
                    <el-option
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementText"
                      :value="child.childElementValue"
                    />
                  </el-select>
                  <el-button v-if="option.fileFlag" type="text" :disabled="!option.value" @click="download(option)">{{ option.fileBtnName ? option.fileBtnName : this.$t('acceptanceTest.button.fileBtnName') }}</el-button>
                </template>
              </el-form-item>
            </section>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        @click="prevStep"
      >{{ $t('common.button.lastPage') }}</el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep('10')"
      >{{ $t('common.button.nextPage') }}</el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="nextStep('20')"
      >{{ $t('acceptanceTest.button.saveApplicationForm') }}</el-button>
      <el-button
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
    <!-- 弹窗选择货币对 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="currencyDialogObj.title"
      :visible.sync="currencyDialogObj.visible"
      :modal-append-to-body="false"
      width="800px"
      append-to-body
      @close="currencyDialogObj.visible = false"
    >
      <el-form
        ref="currencyDialogForm"
        label-position="top"
        :model="currencyDialogObj"
        :rules="currencyDialogObj.rules"
      >
        <el-form-item :label="$t('acceptanceTest.currencyPair')" prop="currency">
          <el-checkbox-group v-model="currencyDialogObj.currency">
            <el-checkbox
              v-for="child in currencyDialogObj.currencyList"
              :key="child"
              :label="child"
              style="width: 88px;"
            >{{ child }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="submitCurrency"
          >{{ $t('common.button.confirm2') }}</el-button>
          <el-button
            class="button-default"
            @click="currencyDialogObj.visible = false"
          >{{ $t('common.button.cancel') }}</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 弹窗输入多个input -->
    <el-dialog
      :close-on-click-modal="false"
      :title="inputDialogObj.title"
      :visible.sync="inputDialogObj.visible"
      :modal-append-to-body="false"
      width="800px"
      append-to-body
      @close="inputDialogObj.visible = false"
    >
      <el-form
        ref="inputDialogForm"
        :model="inputDialogObj"
        :rules="inputDialogObj.rules"
      >
        <el-row v-for="(item, index) in inputDialogObj.list" :key="index">
          <el-col :span="18">
            <el-form-item
              :prop="`list.${index}.value`"
              :rules="inputDialogObj.rule"
            >
              <el-input
                v-model="item.value"
                maxlength="2000"
                clearable
              >
                <span v-if="inputDialogObj.dialogConfig.unit" slot="append">{{ inputDialogObj.dialogConfig.unit }}</span>
              </el-input>
            </el-form-item></el-col>
          <el-col :span="6">
            <el-button type="text" @click="deleteInput(index)"><i class="el-icon-remove-outline" /></el-button>
          </el-col>
        </el-row>
        <el-button type="text" @click="addInput"><i class="el-icon-circle-plus-outline" /></el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="submitInput"
          >{{ $t('common.button.confirm2') }}</el-button>
          <el-button
            class="button-default"
            @click="inputDialogObj.visible = false"
          >{{ $t('common.button.cancel') }}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import acceptanceTestApi from '@/api/interface-service/acceptanceTestApi'
import { downloadAuthen } from '@/api/file'
import { downloadFile } from '@/utils/index'
import validate from '@/utils/validate'
export default {
  props: {
    operationType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      activeNames: [0],
      currencyDialogObj: {
        visible: false,
        title: '',
        defaultTitle: this.$t('acceptanceTest.currencyDialogDefaultTitle'),
        form: {},
        option: {},
        question: {},
        currency: [],
        rules: {
          currency: [
            {
              required: true, message: this.$t('common.message.required'), trigger: 'change'
            }
          ]
        },
        currencyList: []
      },
      inputDialogObj: {
        visible: false,
        title: '',
        defaultTitle: this.$t('acceptanceTest.inputDialogDefaultTitle'),
        form: {},
        question: {},
        option: {},
        list: [],
        rules: {},
        rule: null,
        dialogConfig: {}
      },
      stepTwoObj: {
        formList: []
      }
    }
  },
  computed: {
    commonObj: {
      // getter
      get: function() {
        return this.$store.state.service.acceptanceTestObj.commonObj
      },
      // setter
      set: function(newValue) {

      }
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  watch: {
    '$store.state.service.acceptanceTestObj.stepTwoObj.formList': {
      handler(newVal, oldVal) {
        // 格式化json
        let formList = JSON.parse(JSON.stringify(newVal), (key, value) => {
          if (key === 'validator' && typeof value === 'string') {
            // 此处为了兼容上线时新老json，实际后面只需要else部分
            if (value.indexOf('=>') > -1) {
              return Function('return ' + value).bind(validate)()
            } else {
              return new Function('return ' + value)().bind(validate)
            }
          }
          return value
        })
        // 普通规则的赋值
        formList = formList.map(form => {
          form.questionList.map(question => {
            question.options.map(option => {
              option.rules = this.ruleRelation(option)
              option.disabled = this.disabledRelation(option)
              return option
            })
            return question
          })
          return form
        })
        // 值校验规则的赋值
        formList = formList.map(form => {
          form.questionList.map(question => {
            question.options.map(option => {
              option.rules = this.generateRule(option.rules, formList, form, question, option)
              return option
            })
            return question
          })
          return form
        })
        // 清空置灰的选项
        if (!this.isView) {
          formList = formList.map(form => {
            form.questionList.map(question => {
              question.options.map(option => {
                option.value = option.disabled ? null : option.value
                if (option.elementType === 'checkbox') {
                  option.value = option.value ? option.value : []
                }
                return option
              })
              return question
            })
            return form
          })
        }
        console.log(formList)
        this.stepTwoObj = { formList: formList }
        this.$nextTick(() => {
          this.$refs.stepTwoForm.clearValidate()
        })
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    console.log(this, window)
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.stepTwoForm.clearValidate()
    })
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    /**
     * @method: 上一步
     */
    prevStep() {
      this.$emit('changeSteps', 1)
    },
    /**
     * @method: 下一步/保存
     * @param {operateType} '10'-下一步, '20'-保存
     */
    nextStep(operateType) {
      if (this.isView) {
        this.$emit('changeSteps', 3)
      } else {
        if (operateType === '20') {
          this.$refs.stepTwoForm.clearValidate()
          this.submitOperate(operateType)
        } else {
          this.$refs.stepTwoForm.validate((valid, prop) => {
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
      }
    },
    submitOperate(operateType) {
      const waitFormList = []
      this.stepTwoObj.formList.forEach((form, formIndex) => {
        const questionList = []
        form.questionList.forEach(question => {
          question.options.forEach(option => {
            if (!option.disabled && ((Array.isArray(option.value) && option.value.length !== 0) || (!Array.isArray(option.value) && option.value))) {
              if (option.elementType === 'input' || option.elementType === 'remark_input') {
                questionList.push({
                  childElementId: '',
                  childElementKey: '',
                  elementId: option.elementId,
                  elementKey: option.elementKey,
                  type: option.elementType,
                  optionValue: option.elementValue,
                  questionId: question.id,
                  questionKey: question.key,
                  value: option.value
                })
              } else {
                option.childCheckList.forEach(child => {
                  if (option.value.includes(child.childElementValue)) {
                    questionList.push({
                      childElementId: child.childElementId,
                      childElementKey: child.childElementKey,
                      elementId: option.elementId,
                      elementKey: option.elementKey,
                      type: option.elementType,
                      optionValue: child.childElementValue,
                      questionId: question.id,
                      questionKey: question.key,
                      value: option.value
                    })
                  }
                })
              }
            }
          })
        })
        waitFormList.push({
          applyOrdNo: form.applyOrdNo,
          enName: form.enName,
          formId: form.formId,
          name: form.name,
          questionList: questionList
        })
      })
      const params = {
        applyOrdNo: this.commonObj.applyOrdNo,
        operateType: operateType,
        questionList: waitFormList
      }
      acceptanceTestApi.saveSelfCheck(params).then(res => {
        this.$store.dispatch('service/setAcceptanceTestData', {
          stepThreeObj: {
            formList: res.data
          }
        })
        if (operateType === '10') {
          this.$emit('changeSteps', 3)
        } else {
          this.$message({
            message: this.$t('acceptanceTest.message.saveSuccess'),
            type: 'success'
          })
        }
      })
    },
    clearForm(form, formIndex) {
      console.log(form, formIndex)
      const formFieldArr = []
      form.questionList = form.questionList.map((question, questionIndex) => {
        question.options.map((option, optionIndex) => {
          option.value = null
          if (option.elementType === 'checkbox') {
            option.value = []
          }
          formFieldArr.push(`formList.${formIndex}.questionList.${questionIndex}.options.${optionIndex}.value`)
          return option
        })
        return question
      })
      let currentFormArr = this.stepTwoObj.formList.filter((e, i) => i === formIndex)
      currentFormArr = currentFormArr.map(form => {
        form.questionList.map(question => {
          question.options.map(option => {
            option.rules = this.generateRule(option.rules, currentFormArr, form, question, option)
            return option
          })
          return question
        })
        return form
      })
      this.stepTwoObj.formList[formIndex] = currentFormArr[0]
      this.$nextTick(() => {
        this.$refs.stepTwoForm.clearValidate(formFieldArr)
      })
    },
    onChangeRadio(val, option, question, form, formList) {
      // console.log(val, option, question, form)
      // 选项对备注的规则影响
      if (option.rulesObj.ruleOption) {
        const inputOption = question.options.find(e => e.elementType === 'input' || e.elementType === 'remark_input')
        if (option.rulesObj.ruleOption[val]) {
          inputOption.rules = this.defaultRule(option.rulesObj.ruleOption[val])
        } else {
          inputOption.rules = this.defaultRule()
        }
        // 切换选项时重新校验备注
        this.$nextTick(() => {
          const formIndex = formList.findIndex(it => it.formId === form.formId)
          const questionIndex = form.questionList.findIndex(qt => qt.key === question.key)
          const optionIndex = question.options.findIndex(ot => ot.elementType === 'input' || ot.elementType === 'remark_input')
          this.$refs.stepTwoForm.validateField(`formList.${formIndex}.questionList.${questionIndex}.options.${optionIndex}.value`)
        })
      }
      this.currentRealtion(val, option, question, form, formList)
      // 弹窗
      this.generateDialogRule(val, option, question, form)
    },
    onChangeCheckbox(val, option, question, form, formList) {
      console.log(val, option, question, form)
      this.currentRealtion(val, option, question, form, formList)
      // 弹窗
      this.generateDialogRule(val, option, question, form)
    },
    onChangeSelect(val, option, question, form, formList) {
      console.log(val, option, question, form)
      this.currentRealtion(val, option, question, form, formList)
      // 弹窗
      this.generateDialogRule(val, option, question, form)
    },
    // 值的多级联动
    currentRealtion(val, option, question, form, formList) {
      if (option.rulesObj.hasCurrentRelation) {
        const validateList = []
        const relationObj = option.rulesObj.hasCurrentRelation
        relationObj.forEach(e => {
          const isCheck = val && val.includes(e.value)
          const checkKey = isCheck ? 'check' : 'uncheck'
          form.questionList.map(qt => {
            qt.options.map(ot => {
              e[checkKey].forEach(item => {
                if (item.key === ot.elementKey) {
                  if (item.moreRelationKey) {
                    const moreQuestion = form.questionList.find(moreqt => moreqt.options.find(moreot => moreot.elementKey === item.moreRelationKey))
                    const moreOption = moreQuestion.options.find(moreot => moreot.elementKey === item.moreRelationKey)
                    const moreVal = moreOption.value
                    this.currentRealtion(moreVal, moreOption, moreQuestion, form, formList)
                  } else {
                    if (item.lastRelationKey) {
                      const lastRelationItem = formList.find(lrIt => lrIt.questionList.find(lrqt => lrqt.options.find(lrot => lrot.elementKey === item.lastRelationKey)))
                      const lastRelationQuestion = lastRelationItem.questionList.find(lrqt => lrqt.options.find(lrot => lrot.elementKey === item.lastRelationKey))
                      const lastRelationOption = lastRelationQuestion.options.find(lrot => lrot.elementKey === item.lastRelationKey)
                      const lastRelationVal = lastRelationOption.value
                      if (item.lastRelationKey && lastRelationVal.includes(item.lastRelationValue)) {
                        ot.rules = item.rule
                        ot.disabled = item.disabled
                        if (item.disabled) {
                          validateList.push({
                            form: form,
                            question: qt,
                            option: ot
                          })
                        }
                      }
                    } else {
                      ot.rules = item.rule
                      ot.disabled = item.disabled
                      if (item.disabled) {
                        validateList.push({
                          form: form,
                          question: qt,
                          option: ot
                        })
                      }
                    }
                  }
                }
              })
              return ot
            })
            return qt
          })
        })
        this.$nextTick(() => {
          validateList.forEach(e => {
            const formIndex = formList.findIndex(it => it.formId === e.form.formId)
            const questionIndex = e.form.questionList.findIndex(qt => qt.key === e.question.key)
            const optionIndex = e.question.options.findIndex(ot => ot.elementKey === e.option.elementKey)
            this.$refs.stepTwoForm.validateField(`formList.${formIndex}.questionList.${questionIndex}.options.${optionIndex}.value`)
          })
        })
      }
      // console.log(this.stepTwoObj)
    },
    download(option) {
      console.log(option)
      const selectFileOption = option.childCheckList.find(e => e.childElementValue === option.value)
      const fileObj = {
        fileId: selectFileOption.linkFileId,
        fileName: selectFileOption.linkFileName,
        type: 'application/octet-stream'
      }
      this.downloadFile(fileObj)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.fileName, fileObj.type)
        this.$message({
          type: 'success',
          message: this.$t('acceptanceTest.message.downloadSuccess')
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: this.$t('acceptanceTest.message.downloadFail')
        })
      })
    },
    generateRule(rule, formList, form, question, option) {
      // console.log(rule, question, option)
      // 值的校验规则
      if (option.rulesObj.valueType && rule) {
        // 两个值不能相同
        if (option.rulesObj.valueType === 'different') {
          const valueItemIndex = formList.findIndex(item => item.formId === form.formId)
          const valueQuestion = form.questionList.find(qt => qt.options.find(ot => ot.elementKey === option.rulesObj.valueKey))
          const valueQuestionIndex = form.questionList.findIndex(qt => qt.options.find(ot => ot.elementKey === option.rulesObj.valueKey))
          console.log(valueQuestion)
          const valueOptionIndex = valueQuestion.options.findIndex(ot => ot.elementKey === option.rulesObj.valueKey)
          const validateValue = (rule, value, callback) => {
            if (option.rulesObj.valueTarget) {
              if (value === valueQuestion.options.find(ot => ot.elementKey === option.rulesObj.valueKey).value) {
                callback(new Error(`${this.$t('acceptanceTest.message.duplicateRule1')}${valueQuestionIndex + 1}${this.$t('acceptanceTest.message.duplicateRule2')}`))
              } else {
                callback()
              }
            } else {
              this.$refs.stepTwoForm.validateField(`formList.${valueItemIndex}.questionList.${valueQuestionIndex}.options.${valueOptionIndex}.value`)
              callback()
            }
          }
          const differentRule = {
            validator: validateValue,
            trigger: 'blur'
          }
          rule.push(differentRule)
        }
        // 两个值不能同时为否
        if (option.rulesObj.valueType === 'both') {
          const valueItemIndex = formList.findIndex(item => item.formId === form.formId)
          const valueQuestion = form.questionList.find(qt => qt.options.find(ot => ot.elementKey === option.rulesObj.valueKey))
          const valueQuestionIndex = form.questionList.findIndex(qt => qt.options.find(ot => ot.elementKey === option.rulesObj.valueKey))
          console.log(valueQuestion)
          const valueOptionIndex = valueQuestion.options.findIndex(ot => ot.elementKey === option.rulesObj.valueKey)
          const validateValue = (rule, value, callback) => {
            if (option.rulesObj.valueTarget) {
              if (value === option.rulesObj.valueValue && valueQuestion.options.find(ot => ot.elementKey === option.rulesObj.valueKey).value === option.rulesObj.valueValue) {
                callback(new Error(`${this.$t('acceptanceTest.message.sameTimeBeNoRule1')}${valueQuestionIndex + 1}${this.$t('acceptanceTest.message.sameTimeBeNoRule2')}`))
              } else {
                callback()
              }
            } else {
              this.$refs.stepTwoForm.validateField(`formList.${valueItemIndex}.questionList.${valueQuestionIndex}.options.${valueOptionIndex}.value`)
              callback()
            }
          }
          const differentRule = {
            validator: validateValue,
            trigger: 'change'
          }
          rule.push(differentRule)
          console.log(rule)
        }
      }
      // 编辑回显选项对备注的规则影响
      if (option.rulesObj.ruleOption) {
        const input = question.options.find(e => e.elementType === 'input' || e.elementType === 'remark_input')
        if (option.rulesObj.ruleOption[option.value]) {
          input.rules = this.defaultRule(option.rulesObj.ruleOption[option.value])
        } else {
          input.rules = this.defaultRule()
        }
      }
      // 回显多级联动
      if (option.rulesObj.hasCurrentRelation) {
        this.currentRealtion(option.value, option, question, form, formList)
      }
      // 回显弹窗按钮
      if (option.rulesObj.dialogRelationKeys) {
        const dialogRelationKeys = option.rulesObj.dialogRelationKeys
        dialogRelationKeys.forEach(dialogRelationKey => {
          const inputQuestion = form.questionList.find(question => question.options.find(option => option.elementKey === dialogRelationKey))
          const inputOption = inputQuestion.options.find(option => option.elementKey === dialogRelationKey)
          const dialogConfig = inputOption.rulesObj.dialogConfig
          // currency: 选择货币对、input: 添加输入框
          if (dialogConfig.type === 'currency' || dialogConfig.type === 'input') {
            const match = dialogConfig.childValues.every(e => {
              if (e.type === 'every') {
                const matchChild = this.commonObj.checkedFormKeys.some(key => e.value.includes(key))
                return e.valueHas ? matchChild : !matchChild
              } else if (e.type === 'only') {
                const matchChild = this.commonObj.checkedFormKeys.every(key => e.value.includes(key))
                return e.valueHas ? matchChild : !matchChild
              } else if (e.type === 'option') {
                const matchQuestion = form.questionList.find(question => question.options.find(option => option.elementKey === e.key))
                const matchOption = matchQuestion.options.find(option => option.elementKey === e.key)
                const matchChild = e.value.some(value => matchOption.value && matchOption.value.includes(value))
                return e.valueHas ? matchChild : !matchChild
              } else {
                return false
              }
            })
            inputOption.rulesObj.dialogConfig.show = match
            inputOption.rules = dialogConfig[`${match}Rule`]
          }
        })
      }
      return rule
    },
    disabledRelation(option) {
      if (option.rulesObj.testRelation) {
        const relationObj = option.rulesObj.testRelation
        if (relationObj.type === 'every') {
          const match = this.commonObj.checkedFormKeys.some(e => relationObj.keys.includes(e))
          const matchObj = relationObj[match]
          return matchObj.disabled
        }
        if (relationObj.type === 'only') {
          const match = this.commonObj.checkedFormKeys.every(e => relationObj.keys.includes(e))
          const matchObj = relationObj[match]
          return matchObj.disabled
        }
        return false
      } else {
        return false
      }
    },
    ruleRelation(option) {
      if (option.rulesObj.testRelation) {
        const relationObj = option.rulesObj.testRelation
        if (relationObj.type === 'every') {
          const match = this.commonObj.checkedFormKeys.length > 0 && this.commonObj.checkedFormKeys.some(e => relationObj.keys.includes(e))
          const matchObj = relationObj[match]
          return this.defaultRule(matchObj.rule)
        }
        if (relationObj.type === 'only') {
          const match = this.commonObj.checkedFormKeys.length > 0 && this.commonObj.checkedFormKeys.every(e => relationObj.keys.includes(e))
          const matchObj = relationObj[match]
          return this.defaultRule(matchObj.rule)
        }
      }
      return this.defaultRule(option.rulesObj.rule)
    },
    defaultRule(rule) {
      return rule || [{ required: false, message: this.$t('common.message.required') }]
    },
    // 生成弹窗规则
    generateDialogRule(val, option, question, form) {
      if (option.rulesObj.dialogRelationKeys) {
        const dialogRelationKeys = option.rulesObj.dialogRelationKeys
        dialogRelationKeys.forEach(dialogRelationKey => {
          const inputQuestion = form.questionList.find(question => question.options.find(option => option.elementKey === dialogRelationKey))
          const inputOption = inputQuestion.options.find(option => option.elementKey === dialogRelationKey)
          const dialogConfig = inputOption.rulesObj.dialogConfig
          // currency: 选择货币对、input: 添加输入框
          if (dialogConfig.type === 'currency' || dialogConfig.type === 'input') {
            const match = dialogConfig.childValues.every(e => {
              if (e.type === 'every') {
                const matchChild = this.commonObj.checkedFormKeys.some(key => e.value.includes(key))
                return e.valueHas ? matchChild : !matchChild
              } else if (e.type === 'only') {
                const matchChild = this.commonObj.checkedFormKeys.every(key => e.value.includes(key))
                return e.valueHas ? matchChild : !matchChild
              } else if (e.type === 'option') {
                const matchQuestion = form.questionList.find(question => question.options.find(option => option.elementKey === e.key))
                const matchOption = matchQuestion.options.find(option => option.elementKey === e.key)
                const matchChild = e.value.some(value => matchOption.value && matchOption.value.includes(value))
                return e.valueHas ? matchChild : !matchChild
              } else {
                return false
              }
            })
            inputOption.rulesObj.dialogConfig.show = match
            inputOption.rules = dialogConfig[`${match}Rule`]
            if (match && dialogConfig.operateShow) {
              this.showDialog(inputOption.rulesObj.dialogConfig, inputOption, inputQuestion, form)
            }
            // 切换选项时重新校验备注
            this.$nextTick(() => {
              const formIndex = this.stepTwoObj.formList.findIndex(it => it.formId === form.formId)
              const questionIndex = form.questionList.findIndex(qt => qt.key === inputQuestion.key)
              const optionIndex = inputQuestion.options.findIndex(ot => ot.elementType === 'input' || ot.elementType === 'remark_input')
              this.$refs.stepTwoForm.validateField(`formList.${formIndex}.questionList.${questionIndex}.options.${optionIndex}.value`)
            })
          }
        })
      }
    },
    showDialog(dialogConfig, option, question, form) {
      console.log(dialogConfig, option, question, form)
      if (dialogConfig.type === 'currency') {
        this.currencyDialogObj.visible = true
        this.currencyDialogObj.title = dialogConfig.title ? dialogConfig.title : this.currencyDialogObj.defaultTitle
        this.currencyDialogObj.option = option
        this.currencyDialogObj.question = question
        this.currencyDialogObj.form = form
        const inputValue = option.value
        this.currencyDialogObj.currency = inputValue ? inputValue.split(',') : []
        this.currencyDialogObj.currencyList = dialogConfig.enum ? dialogConfig.enum : []
        this.$nextTick(() => {
          this.$refs.currencyDialogForm.clearValidate()
        })
      }
      if (dialogConfig.type === 'input') {
        this.inputDialogObj.visible = true
        this.inputDialogObj.title = dialogConfig.title ? dialogConfig.title : this.inputDialogObj.defaultTitle
        this.inputDialogObj.option = option
        this.inputDialogObj.question = question
        this.inputDialogObj.form = form
        this.inputDialogObj.dialogConfig = dialogConfig
        this.inputDialogObj.rule = dialogConfig.rule ? dialogConfig.rule : null
        const inputValue = option.value
        this.inputDialogObj.list = (inputValue ? inputValue.split(',') : []).map(e => {
          const obj = {}
          if (dialogConfig.unit && dialogConfig.valueUnit) {
            obj.value = e.replace(dialogConfig.unit, '')
          } else {
            obj.value = e
          }
          return obj
        })
        // 默认添加一个输入框
        if (this.inputDialogObj.list.length === 0) {
          this.inputDialogObj.list.push({
            value: ''
          })
        }
        this.$nextTick(() => {
          this.$refs.inputDialogForm.clearValidate()
        })
      }
    },
    submitCurrency() {
      this.$refs.currencyDialogForm.validate(valid => {
        if (valid) {
          console.log(this.currencyDialogObj.form)
          this.stepTwoObj.formList.map(form => {
            if (form.formId === this.currencyDialogObj.form.formId) {
              form.questionList.map(question => {
                if (question.key === this.currencyDialogObj.question.key) {
                  question.options.map(option => {
                    if (option.elementType === 'input' || option.elementType === 'remark_input') {
                      option.value = this.currencyDialogObj.currency.join(',')
                    }
                    return option
                  })
                }
                return question
              })
            }
            return form
          })
          this.currencyDialogObj.visible = false
          this.currencyDialogObj.currency = []
          console.log(this.stepTwoObj.formList)
        }
      })
    },
    submitInput() {
      this.$refs.inputDialogForm.validate(valid => {
        if (valid) {
          console.log(this.inputDialogObj.list)
          this.stepTwoObj.formList.map(form => {
            if (form.formId === this.inputDialogObj.form.formId) {
              form.questionList.map(question => {
                if (question.key === this.inputDialogObj.question.key) {
                  question.options.map(option => {
                    if (option.elementType === 'input' || option.elementType === 'remark_input') {
                      option.value = this.inputDialogObj.list.map(e => {
                        let str = e.value
                        if (this.inputDialogObj.dialogConfig.unit && this.inputDialogObj.dialogConfig.valueUnit) {
                          str += this.inputDialogObj.dialogConfig.unit
                        }
                        return str
                      }).join(',')
                    }
                    return option
                  })
                }
                return question
              })
            }
            return form
          })
          this.inputDialogObj.visible = false
          this.inputDialogObj.list = []
        }
      })
    },
    addInput() {
      this.inputDialogObj.list.push({
        value: ''
      })
    },
    deleteInput(index) {
      this.inputDialogObj.list = this.inputDialogObj.list.filter((e, i) => i !== index)
    },
    isShowRequire(question) {
      return question.options.some(option => {
        return option.disabled ? false : (option.rules ? option.rules.some(rule => rule.required) : false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .form-body {
//   background: #fff;
//   padding: 0 20px;
// }
</style>
