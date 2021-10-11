<template>
  <div>
    <div class="form-body">
      <el-form
        ref="stepTwoForm"
        :model="stepTwoObj"
        :rules="rules"
        :disabled="isView"
        label-position="top"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(item, index) in stepTwoObj.basicInfoList"
            :key="item.dimensionId"
            :name="index"
          >
            <template slot="title">
              <div class="collapse-header">
                <span>{{ item.dimensionName }}</span>
                <el-button
                  v-if="!isView"
                  size="mini"
                  @click.stop="clearForm(item, index)"
                ><svg-icon icon-class="empty" />{{ $t('common.button.oneClickClear') }}</el-button>
              </div>
            </template>
            <div class="form-title">
              <span>{{ $t('permissionChange.institutionInfo') }}</span>
            </div>
            <el-form-item :label="$t('permissionChange.institutionFullName')">
              <el-input v-model="item.instnName" disabled />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('permissionChange.apiAccount')">
                  <el-input v-model="item.apiAccount" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.postcode')"
                  :prop="`basicInfoList.${index}.postCode`"
                  :rules="rules.postCode"
                >
                  <el-input v-model="item.postCode" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              :label="$t('permissionChange.institutionAddress')"
              :prop="`basicInfoList.${index}.address`"
              :rules="rules.address"
            >
              <el-input v-model="item.address" maxlength="60" clearable />
            </el-form-item>
            <div class="form-title">
              <span>{{ $t('permissionChange.contract') }}</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.name')"
                  :prop="`basicInfoList.${index}.name`"
                  :rules="rules.name"
                >
                  <el-input v-model="item.name" maxlength="100" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.department')"
                  :prop="`basicInfoList.${index}.depart`"
                  :rules="rules.depart"
                >
                  <el-input v-model="item.depart" maxlength="100" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.position')"
                  :prop="`basicInfoList.${index}.position`"
                  :rules="rules.position"
                >
                  <el-input v-model="item.position" maxlength="100" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.telephone')"
                  :prop="`basicInfoList.${index}.telNo`"
                  :rules="rules.telNo"
                >
                  <el-input v-model="item.telNo" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.mobilePhone')"
                  :prop="`basicInfoList.${index}.phoneNo`"
                  :rules="rules.phoneNo"
                >
                  <el-input v-model="item.phoneNo" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('permissionChange.fax')"
                  :prop="`basicInfoList.${index}.faxNo`"
                  :rules="rules.faxNo"
                >
                  <el-input v-model="item.faxNo" maxlength="30" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              :label="$t('permissionChange.email')"
              :prop="`basicInfoList.${index}.email`"
              :rules="rules.email"
            >
              <el-input
                v-model="item.email"
                v-limitBytes="500"
                clearable
              />
            </el-form-item>
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
        @click="submit"
      >{{ $t('common.button.submit') }}</el-button>
      <el-button
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import interfaceTerminationApi from '@/api/interface-service/interfaceTerminationApi'
import { validEmail, validTel, validPhone, validPostCode } from '@/utils/validate'
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
    const validatePostCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validPostCode(value)) {
          callback(new Error(this.$t('common.validate.postcode')))
        }
        callback()
      }
    }
    const validateTelNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validTel(value)) {
          callback(new Error(this.$t('common.validate.telephone')))
        }
        callback()
      }
    }
    const validatePhoneNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validPhone(value)) {
          callback(new Error(this.$t('common.validate.mobilePhone')))
        }
        callback()
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
    return {
      activeNames: [0],
      rules: {
        address: validateEmpty,
        postCode: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validatePostCode, trigger: 'blur' }
        ],
        userName: validateEmpty,
        name: validateEmpty,
        depart: validateEmpty,
        position: validateEmpty,
        telNo: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validateTelNo, trigger: 'blur' }
        ],
        phoneNo: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validatePhoneNo, trigger: 'blur' }
        ],
        faxNo: validateEmpty,
        email: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.permissionChangeObj.commonObj.applyOrdNo
    },
    stepTwoObj: {
      // getter
      get: function() {
        return this.$store.state.service.permissionChangeObj.stepTwoObj
      },
      // setter
      set: function(newValue) {

      }
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('权限变更第二步')
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    prevStep() {
      this.$emit('changeSteps', 1)
    },
    submit() {
      this.$refs.stepTwoForm.validate((valid, prop) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          interfaceTerminationApi.submitPermChange(this.stepTwoObj.basicInfoList).then(res => {
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
          }).finally(() => {
            loading.close()
          })
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
    },
    clearForm(item, index) {
      console.log(item, index)
      const defaultForm = {
        postCode: null,
        address: null,
        name: null,
        depart: null,
        position: null,
        telNo: null,
        phoneNo: null,
        faxNo: null,
        email: null
      }
      Object.assign(item, defaultForm)
      this.$nextTick(() => {
        for (const key in defaultForm) {
          this.$refs.stepTwoForm.clearValidate(`basicInfoList.${index}.${key}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
