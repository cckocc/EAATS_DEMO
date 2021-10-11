<template>
  <div
    v-loading="loading"
    class="step-two"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      class="step-two-main"
      :label-width="$t('register.labelWidth')"
      label-position="left"
    >
      <el-form-item
        :label="$t('register.organizationName')"
        prop="instnId"
      >
        <template slot="label">
          <el-tooltip placement="bottom-start">
            <div slot="content">
              <p>{{ $t('register.orgTip') }}</p>
            </div>
            <span>{{ $t('register.organizationName') }}<i class="el-icon-question" /></span>
          </el-tooltip>
        </template>
        <el-select
          v-model="formData.instnId"
          filterable
          :placeholder="$t('register.placeholder.keyWords')"
          style="width: 100%;"
          @change="onChangeOrg"
        >
          <el-option
            v-for="item in orgOptions"
            :key="item.id"
            :label="item.instnCnFullNm"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('common.username')"
        prop="loginName"
      >
        <el-input
          v-model="formData.loginName"
          v-limitBytes="20"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        :label="$t('register.name')"
        prop="sName"
      >
        <el-input
          v-model="formData.sName"
          v-limitBytes="90"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        prop="loginPwd"
      >
        <template slot="label">
          <el-tooltip placement="bottom-start">
            <div slot="content">
              <p>{{ $t('common.validate.password') }}</p>
            </div>
            <span>{{ $t('common.password') }}<i class="el-icon-question" /></span>
          </el-tooltip>
        </template>
        <el-input
          v-model="formData.loginPwd"
          type="password"
        />
      </el-form-item>
      <el-form-item
        :label="$t('register.passwordConfirm')"
        prop="confirmPwd"
      >
        <el-input
          v-model="formData.confirmPwd"
          type="password"
          placeholder=""
        />
      </el-form-item>
      <el-form-item :label="$t('register.telphone')" required>
        <el-row>
          <el-col :span="6">
            <el-form-item prop="telNoAreaCode">
              <el-input
                v-model="formData.telNoAreaCode"
                :placeholder="$t('register.placeholder.areaCode')"
                maxlength="4"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="telNo" class="ml10">
              <el-input
                v-model="formData.telNo"
                :placeholder="$t('register.placeholder.telNo')"
                clearable
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        style="margin-top: -26px;"
        :label="$t('common.email')"
        prop="email"
      >
        <el-input
          v-model="formData.email"
          v-limitBytes="500"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        :label="$t('register.emailCode')"
        prop="mailCode"
      >
        <el-input
          v-model="formData.mailCode"
          maxlength="6"
        >
          <el-button
            slot="append"
            v-preventReClick
            type="primary"
            :disabled="emailFlag"
            @click="sendEmailCode"
          >{{ emailText }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('common.mobilePhone')"
        prop="phoneNo"
      >
        <el-input
          v-model="formData.phoneNo"
          class="common-phone"
          maxlength="30"
        >
          <el-select
            slot="prepend"
            v-model="formData.phoneNoAreaCode"
            :placeholder="$t('common.placeholder.chose')"
            filterable
            @change="onChangeAreaCode"
          >
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="'+'+item.prefix"
              :value="item.prefix"
            />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('register.phoneCode')"
        prop="phoneCode"
      >
        <el-input
          v-model="formData.phoneCode"
          maxlength="6"
        >
          <el-button
            slot="append"
            v-preventReClick
            type="primary"
            :disabled="flag"
            @click="smsCode"
          >{{ text }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('register.department')"
      >
        <el-input
          v-model="formData.instnDepartment"
          v-limitBytes="300"
          placeholder=""
        />
      </el-form-item>
      <el-form-item
        v-if="!isNull(formData.instnId)"
        :label="$t('register.userType')"
        prop="roleType"
      >
        <el-select
          v-model="formData.roleType"
          :placeholder="$t('common.placeholder.chose')"
          style="width: 100%;"
          @change="onChangeRoleType"
        >
          <el-option
            v-for="item in needRoleTypeOptions"
            :key="item.name"
            :label="item.text"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="!isNull(formData.instnId) && !isNull(formData.roleType)"
        :label="$t('register.userRole')"
        prop="instnIdentity"
      >
        <el-checkbox-group
          v-model="formData.instnIdentity"
          @change="orgTypeChange"
        >
          <el-checkbox
            v-for="item in needOrgTypeOptions"
            :key="item.code"
            :label="item.code"
            :disabled="item.disabled"
          >{{ item.text }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :label="$t('register.fileUpload')"
        prop="fileIdList"
      >
        <el-button
          style="position: absolute;"
          :style="{left: $t('register.left')}"
          type="primary"
          size="small"
          @click="onPreviewLocal"
        >{{ $t('register.download') }}</el-button>
        <UploadFiles
          v-model="formData.fileIdList"
          :tips="tips"
          :accept="accept"
          :size="10"
        />
      </el-form-item>
      <el-form-item class="text-center">
        <el-button
          type="default"
          class="prev"
          @click="prev"
        >{{ $t('common.button.lastStep') }}</el-button>
        <el-button
          v-preventReClick
          type="primary"
          class="submit"
          @click="registerSubmit('form')"
        >{{ $t('common.button.submit') }}</el-button>
        <el-button
          type="default"
          class="reset"
          @click="reset('form')"
        >{{ $t('common.button.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import orgTypeMixin from '@/mixins/orgTypeMixin'
import registerApi from '@/api/register'
import { getSmsCode, getEmailCode, getPublicKey } from '@/api/common'
import {
  isNull,
  validPassword,
  validEmail,
  validate30Num,
  validPhoneCode,
  validUsername,
  validSname,
  validTelephoneArea,
  validSingleTel
} from '@/utils/validate'
import { downloadFile } from '@/utils/index.js'
import UploadFiles from '@/components/UploadFiles'
import JSEncrypt from 'jsencrypt'
import { prefixDefault } from '@/utils/prefix'
import axios from 'axios'

export default {
  components: {
    UploadFiles
  },
  mixins: [orgTypeMixin],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error(this.$t('common.validate.userName')))
      } else {
        callback()
      }
    }
    const validateSname = (rule, value, callback) => {
      if (!validSname(value)) {
        callback(new Error(this.$t('common.validate.sName')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.password')))
      } else {
        if (!validPassword(value)) {
          callback(new Error(this.$t('common.validate.password')))
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.passwordTwice')))
      } else if (value !== this.formData.loginPwd) {
        callback(new Error(this.$t('common.validate.passwordDifferent')))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.email')))
      } else if (!validEmail(value)) {
        callback(new Error(this.$t('common.validate.email')))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.mobilePhone')))
      } else if (validate30Num(value)) {
        callback()
      } else {
        callback(new Error(this.$t('register.validate.mobilePhone')))
      }
    }
    const validateMailCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.code')))
      } else if (!validPhoneCode(value)) {
        callback(new Error(this.$t('common.validate.sixCode')))
      } else {
        callback()
      }
    }
    const validatePhoneCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.code')))
      } else if (this.tempPhoneNoAreaCode !== this.formData.phoneNoAreaCode) {
        callback(new Error(this.$t('common.validate.wrongCode')))
      } else if (!validPhoneCode(value)) {
        callback(new Error(this.$t('common.validate.sixCode')))
      } else {
        callback()
      }
    }
    const validateFile = (rule, value, callback) => {
      if (this.formData.fileIdList.length === 0) {
        callback(new Error(this.$t('register.validate.file')))
      } else {
        callback()
      }
    }
    const validateTelNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validSingleTel(value)) {
          callback(new Error(this.$t('common.validate.telephone')))
        }
        callback()
      }
    }
    const validateTelNoAreaCode = (rule, value, callback) => {
      if (!validTelephoneArea(value)) {
        callback(new Error(this.$t('common.validate.telephoneArea')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      publickKey: '',
      emailCode: '',
      accept: '.jpg,.jpeg,.png,.pdf',
      tips: this.$t('register.tips'),
      tempPhoneNoAreaCode: '86',
      formData: {
        loginName: '',
        sName: '',
        instnDepartment: '',
        loginPwd: '',
        confirmPwd: '',
        telNoAreaCode: '',
        telNo: '',
        email: '',
        mailCode: '',
        emailCode: '',
        phoneNo: '',
        phoneCode: '',
        phoneNoAreaCode: '86',
        instnId: '',
        roleType: '',
        instnIdentity: [],
        fileIdList: []
      },
      rules: {
        loginName: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        sName: [
          { required: true, trigger: 'blur', message: this.$t('common.validate.required') },
          { required: true, validator: validateSname, trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        telNo: [
          { required: true, validator: validateTelNo, trigger: 'blur' },
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' }
        ],
        telNoAreaCode: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { required: true, validator: validateTelNoAreaCode, trigger: 'blur' }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mailCode: [
          { required: true, validator: validateMailCode, trigger: 'blur' }
        ],
        phoneNo: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, validator: validatePhoneCode, trigger: ['blur', 'change'] }
        ],
        instnId: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'change' }
        ],
        roleType: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'change' }
        ],
        instnIdentity: [
          {
            type: 'array',
            required: true,
            message: this.$t('common.placeholder.chose'),
            trigger: 'change'
          }
        ],
        fileIdList: [
          { required: true, validator: validateFile, trigger: 'change' }
        ]
      },
      options: prefixDefault,
      emailText: this.$t('common.phoneText'),
      text: this.$t('common.phoneText'),
      emailFlag: false,
      flag: false
    }
  },
  created() {
    getPublicKey().then(res => {
      this.publickKey = res.data
    })
  },
  methods: {
    isNull,
    prev() {
      this.$emit('changeSteps', 1)
    },
    onPreviewLocal() {
      const fileName = this.$t('register.docName')
      axios.get(fileName, {
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        downloadFile(res.data, fileName)
      })
    },
    onChangeAreaCode() {
      this.$refs.form.validateField('phoneCode')
    },
    // 机构变动时联动的角色和身份处理
    handleRoleTypeAndOrgType() {
      this.formData.roleType = ''
      this.formData.instnIdentity = []
    },
    // 用户角色变动时联动的身份处理
    handleOrgType() {
      const instnIdentityArr = []
      this.needOrgTypeOptions.forEach(e => {
        instnIdentityArr.push(e.code)
      })
      this.formData.instnIdentity = this.formData.instnIdentity.filter(e => instnIdentityArr.includes(e))
      this.orgTypeChange(this.formData.instnIdentity)
    },
    registerSubmit(formName) {
      console.log(this.formData.fileIdList)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const formData = JSON.parse(JSON.stringify(this.formData))
            formData.instnIdentity = formData.instnIdentity.toString()
            formData.emailCode = this.emailCode + formData.mailCode
            const params = Object.assign({}, formData)
            const encryptStr = new JSEncrypt()
            encryptStr.setPublicKey(this.publickKey)
            const data = encryptStr.encrypt(params.loginPwd.toString())
            params.loginPwd = data
            params.confirmPwd = data
            const r = await registerApi.register(params)
            if (r.code === 'VALIDATION') {
              let message = ''
              Object.keys(r.data).forEach(key => {
                message += r.data[key] + '</br>'
              })
              this.$message({
                message: message,
                dangerouslyUseHTMLString: true,
                type: 'error'
              })
            } else {
              this.$router.push('/login')
              this.$message({
                message: this.$t('register.message.registerSuccess'),
                type: 'success'
              })
            }
            this.loading = false
          } catch (e) {
            console.log(e)
            this.loading = false
          }
        }
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
      this.orgTypeChange()
    },
    async sendEmailCode() {
      if (this.emailFlag) return
      try {
        const { email, loginName } = this.formData
        if (email && loginName) {
          const params = { email, loginName }
          const r = await getEmailCode(params)
          // this.formData.mailCode = r.data
          this.emailCode = r.data
          if (r.code === 'VALIDATION') {
            const isObject =
              Object.prototype.toString.call(r.data) === '[object Object]'
            let message = ''
            if (isObject) {
              Object.keys(r.data).forEach(key => {
                message += r.data[key] + '</br>'
              })
            } else {
              message = r.data
            }
            this.$message({
              message: message,
              dangerouslyUseHTMLString: true,
              type: 'error'
            })
          } else {
            this.$message({
              message: this.$t('common.message.sendSuccess'),
              type: 'success'
            })
            this.countDown(this.emailText, this.emailFlag, 'email')
          }
        } else {
          this.$message({
            message: this.$t('common.message.usernameAndMail'),
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    async smsCode() {
      if (this.flag) return
      try {
        const { phoneNo, loginName, phoneNoAreaCode } = this.formData
        if (phoneNo && loginName) {
          const params = { loginName, phoneNo, phoneNoAreaCode }
          const r = await getSmsCode(params)
          if (r.code === 'VALIDATION') {
            const isObject =
              Object.prototype.toString.call(r.data) === '[object Object]'
            let message = ''
            if (isObject) {
              Object.keys(r.data).forEach(key => {
                message += r.data[key] + '</br>'
              })
            } else {
              message = r.data
            }
            this.$message({
              message: message,
              dangerouslyUseHTMLString: true,
              type: 'error'
            })
          } else {
            this.$message({
              message: phoneNoAreaCode === '86' ? this.$t('common.message.sendSuccess') : this.$t('common.message.sendForeignSuccess'),
              type: 'success'
            })
            this.tempPhoneNoAreaCode = phoneNoAreaCode
            this.countDown(this.text, this.flag, 'phone')
          }
        } else {
          this.$message({
            message: this.$t('common.message.usernameAndMobilePhone'),
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    countDown(val1, val2, count) {
      if (count === 'email') {
        let num = 60
        this.emailFlag = true
        const interval = setInterval(() => {
          if (num > 0) {
            num--
            this.emailText = `${num}s`
          } else {
            this.emailText = this.$t('common.phoneText')
            clearInterval(interval)
            this.emailFlag = false
          }
        }, 1000)
      } else {
        let num = 60
        this.flag = true
        const interval = setInterval(() => {
          if (num > 0) {
            num--
            this.text = `${num}s`
          } else {
            this.text = this.$t('common.phoneText')
            clearInterval(interval)
            this.flag = false
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-two {
  display: flex;
  justify-content: center;
  align-items: center;
  .step-two-main {
    width: 600px;
    padding-top: 20px;
  }
}
</style>
