<template>
  <div>
    <div class="form-body-content">
      <el-form
        ref="stepThreeForm"
        :model="stepThreeObj.form"
        :rules="rules"
        :disabled="isView"
        label-position="top"
      >
        <template v-if="institutionType === '00'">
          <div class="form-title">
            <span>{{ $t('serviceOpening.businessConditions') }}</span>
          </div>
          <template v-if="fxspNodeFlag">
            <el-form-item :label="$t('serviceOpening.isConnectWithFXTradingSystem')">
              <el-radio-group v-model="stepThreeObj.form.contactForeignExchangeSystemFlag">
                <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
                <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="!fxspNodeTradAfterFlag" :label="$t('serviceOpening.isFXorMarketMakers')">
              <el-radio-group v-model="stepThreeObj.form.foreignCurrencyMarketFlag">
                <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
                <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="!fxspNodeTradAfterFlag" :label="$t('serviceOpening.lastYearFxTransactionVolume')" prop="lyForeignSales">
              <el-input v-model.trim="stepThreeObj.form.lyForeignSales" maxlength="300" clearable />
            </el-form-item>
          </template>
          <template v-if="cmssNodeFlag">
            <el-form-item :label="$t('serviceOpening.isConnectWithRMBTradingSystem')">
              <el-radio-group v-model="stepThreeObj.form.contactCurrencySystemFlag">
                <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
                <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="!cmssNodeTradAfterFlag" :label="$t('serviceOpening.isBondMarketOrMarketMaker')">
              <el-radio-group v-model="stepThreeObj.form.bondCurrencyMarketFlag">
                <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
                <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="!cmssNodeTradAfterFlag" :label="$t('serviceOpening.lastYearRMBTransactionVolume')" prop="ltLocalSales">
              <el-input v-model.trim="stepThreeObj.form.ltLocalSales" maxlength="300" clearable />
            </el-form-item>
          </template>
          <el-form-item :label="$t('serviceOpening.isCompleteInfomationUsageSpe')">
            <el-radio-group v-model="stepThreeObj.form.infoStandardFlag">
              <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
              <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('serviceOpening.isCompleteRiskManagerRules')">
            <el-radio-group v-model="stepThreeObj.form.hasRiskMechanism">
              <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
              <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('serviceOpening.isAbideByTradingRulesAndCorrTradingCodeOfConduct')">
            <el-radio-group v-model="stepThreeObj.form.tradeStandardFlag">
              <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
              <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <div class="form-title">
          <span>{{ $t('serviceOpening.technicalConditions') }}</span>
        </div>
        <el-form-item :label="$t('serviceOpening.whetherApplyingChineseRules')">
          <el-radio-group v-model="stepThreeObj.form.qualificationFlag">
            <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
            <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="institutionType === '00'" :label="$t('serviceOpening.whetherApplyingBankRules')">
          <el-radio-group v-model="stepThreeObj.form.requirementsFlag">
            <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
            <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('serviceOpening.isLeasedLine')">
          <template slot="label">
            <el-tooltip placement="bottom-start">
              <div slot="content">{{ $t('serviceOpening.noteUseLeasedLineConnectTradingCenter') }}</div>
              <span>{{ $t('serviceOpening.isLeasedLine') }}<i class="el-icon-question" /></span>
            </el-tooltip>
          </template>
          <el-radio-group v-model="stepThreeObj.form.hasHotLine">
            <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
            <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('serviceOpening.isBackupLeasedLine')">
          <template slot="label">
            <el-tooltip placement="bottom-start">
              <div slot="content">{{ $t('serviceOpening.noteUseBackupLeaseLineConnectTradingCenter') }}</div>
              <span>{{ $t('serviceOpening.isBackupLeasedLine') }}<i class="el-icon-question" /></span>
            </el-tooltip>
          </template>
          <el-radio-group v-model="stepThreeObj.form.hasBackupHotLine">
            <el-radio label="1">{{ $t('serviceOpening.yes') }}</el-radio>
            <el-radio label="0">{{ $t('serviceOpening.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item key="devInstitutionName" :label="$t('serviceOpening.technologyDevOrgName')" prop="devInstitutionName">
          <el-autocomplete
            v-model.trim="stepThreeObj.form.devInstitutionName"
            :maxlength="300"
            style="width: 100%;"
            clearable
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
          />
        </el-form-item>
        <div v-if="institutionType === '00'" class="form-tip">
          <p>{{ $t('serviceOpening.note.institutionType00Line1') }}</p>
          <p>{{ $t('serviceOpening.note.institutionType00Line2') }}</p>
          <p>{{ $t('serviceOpening.note.institutionType00Line3') }}</p>
          <p>{{ $t('serviceOpening.note.institutionType00Line4') }}</p>
          <p>{{ $t('serviceOpening.note.institutionType00Line5') }}</p>
        </div>
        <div v-if="institutionType === '10'" class="form-tip">
          <p>{{ $t('serviceOpening.note.institutionType10Line1') }}</p>
          <p>{{ $t('serviceOpening.note.institutionType10Line2') }}</p>
        </div>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        @click="prevStep"
      >{{ $t('common.button.lastPage') }}</el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="submit"
      >{{ $t('common.button.submit') }}</el-button>
      <el-button @click="cancel">{{ $t('common.button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import { saveSelfConditionAssess } from '@/api/interface-service/serviceOpeningApi'
import { getDevInstiUserList } from '@/api/myServiceApi'
export default {
  props: {
    institutionType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    const validateEmpty = [
      { required: true, message: this.$t('common.validate.required'), trigger: 'blur' }
    ]
    return {
      devInstiUserList: [],
      rules: {
        lyForeignSales: validateEmpty,
        ltLocalSales: validateEmpty,
        devInstitutionName: { required: true, message: this.$t('common.validate.required'), trigger: 'change' }
      }
    }
  },
  computed: {
    stepThreeObj: {
      // getter
      get: function() {
        return this.$store.state.service.serviceOpeningObj.stepThreeObj
      },
      // setter
      set: function(newValue) {
        // this.form = newValue
      }
    },
    fxspNodeFlag() {
      return this.stepThreeObj.fxspNodeFlag
    },
    fxspNodeTradAfterFlag() {
      return this.stepThreeObj.fxspNodeTradAfterFlag
    },
    cmssNodeFlag() {
      return this.stepThreeObj.cmssNodeFlag
    },
    cmssNodeTradAfterFlag() {
      return this.stepThreeObj.cmssNodeTradAfterFlag
    },
    applyOrdNo() {
      return this.$store.state.service.serviceOpeningObj.commonObj.applyOrdNo
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('服务开通第三步')
    this.getDevInstiUserList()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    prevStep() {
      this.$emit('changeSteps', 2)
    },
    submit() {
      this.$refs.stepThreeForm.validate((valid) => {
        if (valid) {
          const params = {
            applyOrdNo: this.applyOrdNo,
            infoStandardFlag: this.stepThreeObj.form.infoStandardFlag,
            hasRiskMechanism: this.stepThreeObj.form.hasRiskMechanism,
            tradeStandardFlag: this.stepThreeObj.form.tradeStandardFlag,
            qualificationFlag: this.stepThreeObj.form.qualificationFlag,
            requirementsFlag: this.stepThreeObj.form.requirementsFlag,
            hasHotLine: this.stepThreeObj.form.hasHotLine,
            hasBackupHotLine: this.stepThreeObj.form.hasBackupHotLine,
            devInstitutionId: this.stepThreeObj.form.devInstitutionId,
            devInstitutionName: this.stepThreeObj.form.devInstitutionName,
            hotlineInfo: '',
            contactForeignExchangeSystemFlag: this.stepThreeObj.form.contactForeignExchangeSystemFlag,
            foreignCurrencyMarketFlag: this.stepThreeObj.form.foreignCurrencyMarketFlag,
            lyForeignSales: this.stepThreeObj.form.lyForeignSales,
            contactCurrencySystemFlag: this.stepThreeObj.form.contactCurrencySystemFlag,
            bondCurrencyMarketFlag: this.stepThreeObj.form.bondCurrencyMarketFlag,
            ltLocalSales: this.stepThreeObj.form.ltLocalSales
          }
          if (this.operationType === 'edit') {
            params.id = this.stepThreeObj.form.id
          }
          console.log(params)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          saveSelfConditionAssess(params).then(res => {
            if (res.code !== 'ACK') {
              this.$message({
                type: 'error',
                message: res.message
              })
              return
            }
            const str = this.operationType === 'add' ? this.$t('serviceOpening.serviceOpeningAddSucceuss') : this.$t('serviceOpening.serviceOpeningUpdateSucceuss')
            this.$alert(str, this.$t('common.message.submitSuccess'), {
              confirmButtonText: this.$t('common.button.confirm2'),
              type: 'success',
              center: true,
              showClose: false,
              callback: action => {
                this.$router.push({
                  name: 'MyService',
                  params: {
                    institutionType: this.institutionType,
                    isCurrentByMe: true
                  }
                })
              }
            })
          }).finally(() => {
            loading.close()
          })
        }
      })
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
    querySearchAsync(queryString, cb) {
      const results = queryString ? this.devInstiUserList.filter(e => e.devInstitutionName.includes(queryString)) : this.devInstiUserList
      if (results.length === 0) {
        this.stepThreeObj.form.devInstitutionId = null
      }
      cb(results)
    },
    handleSelect(item) {
      console.log(item)
      this.stepThreeObj.form.devInstitutionId = item.devInstitutionId
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

