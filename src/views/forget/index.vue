<template>
  <div>
    <div class="main">
      <div class="header">
        <div>
          <div class="header-title">{{ $t('forget.retrievePassword') }}</div>
          <div class="header-panel">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
            >
              <el-form-item prop="tip">
                <div v-if="language === 'zh'" class="tip">
                  请填写您需要找回密码的账户<span>手机号码或电子邮箱</span>
                </div>
                <div v-if="language === 'en'" class="tip">
                  Please fill in the<span> mobile  phone number or email address</span> of the account you need to retrieve the password for
                </div>
              </el-form-item>
              <el-form-item label="" prop="loginName">
                <el-input v-model.trim="ruleForm.loginName" :placeholder="$t('common.placeholder.username')" clearable />
              </el-form-item>
              <div class="mb10">
                <el-radio-group
                  v-model="ruleForm.verifyType"
                  @change="selectValideClick"
                >
                  <el-radio label="00">{{ $t('common.mobilePhone') }}</el-radio>
                  <el-radio label="10">{{ $t('common.email') }}</el-radio>
                </el-radio-group>
              </div>
              <el-form-item
                v-show="IsSelectPhoneValid"
                prop="phone"
              >
                <div class="phoneNo">
                  <el-select
                    v-model="ruleForm.phoneNoAreaCode"
                    :placeholder="$t('common.placeholder.chose')"
                  >
                    <el-option
                      v-for="(item,index) in options"
                      :key="index"
                      :label="'+'+item.prefix"
                      :value="item.prefix"
                    />
                  </el-select>
                  <el-input
                    v-model="ruleForm.phone"
                    :placeholder="$t('common.placeholder.mobilePhone')"
                    maxlength="30"
                  />
                </div>
              </el-form-item>
              <el-form-item
                v-show="!IsSelectPhoneValid"
                prop="email"
              >
                <div class="emailNo">
                  <el-input
                    v-model="ruleForm.email"
                    v-limitBytes="500"
                    :placeholder="$t('common.placeholder.email')"
                  />
                </div>
              </el-form-item>
              <el-form-item
                v-show="IsSelectPhoneValid"
                prop="code"
              >
                <div class="panel-code">
                  <el-input
                    v-model="ruleForm.code"
                    :placeholder="$t('forget.placeholder.sixCode')"
                  />
                  <el-button
                    v-preventReClick
                    class="code-button"
                    type="primary"
                    :disabled="flag"
                    @click="fetchSmsCode('ruleForm','phone')"
                  >{{ text }}</el-button>
                </div>
              </el-form-item>
              <el-form-item
                v-show="!IsSelectPhoneValid"
                prop="emailCode"
              >
                <div class="panel-code">
                  <el-input
                    v-model="ruleForm.emailCode"
                    :placeholder="$t('forget.placeholder.sixCode')"
                  />
                  <el-button
                    class="code-button"
                    type="primary"
                    :disabled="flag"
                    @click="fetchSmsCode('ruleForm','email')"
                  >{{ text }}</el-button>
                </div>
              </el-form-item>
            </el-form>
            <el-button
              class="submit-button"
              type="primary"
              @click="submitForm('ruleForm')"
            >{{ $t('common.button.confirm') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { retrievePassword, getSmsCode, getForgetEmailCode } from '@/api/common'
import {
  validPhoneCode,
  validNum,
  validEmail
} from '@/utils/validate'
import { isNull } from '@/utils/index.js'
import { prefixDefault } from '@/utils/prefix'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!this.IsSelectPhoneValid) {
        callback()
      } else {
        if (isNull(value)) {
          callback(new Error(this.$t('forget.message.telephoneRequired')))
        } else if (!validNum(value)) {
          callback(new Error(this.$t('forget.message.telFormatError')))
        } else {
          callback()
        }
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (this.IsSelectPhoneValid) {
        callback()
      } else {
        if (isNull(value)) {
          callback(new Error(this.$t('forget.message.emailRequired')))
        } else if (!validEmail(value)) {
          callback(new Error(this.$t('forget.message.mailFormatError')))
        } else {
          callback()
        }
      }
    }
    const validatePhoneCode = (rule, value, callback) => {
      if (!this.IsSelectPhoneValid) {
        callback()
      } else {
        if (isNull(value)) {
          callback(new Error(this.$t('common.validate.verifyCodeRequired')))
        } else if (!validPhoneCode(value)) {
          callback(new Error(this.$t('common.validate.sixCode')))
        } else {
          callback()
        }
      }
    }
    const validateEmailCode = (rule, value, callback) => {
      if (this.IsSelectPhoneValid) {
        callback()
      } else {
        if (isNull(value)) {
          callback(new Error(this.$t('common.validate.verifyCodeRequired')))
        } else if (!validPhoneCode(value)) {
          callback(new Error(this.$t('common.validate.sixCode')))
        } else {
          callback()
        }
      }
    }
    return {
      IsSelectPhoneValid: true, // 是否选择手机号校验
      text: this.$t('common.phoneText'),
      flag: false,
      smsCode: '',
      emailCodeData: '',
      ruleForm: {
        phone: '',
        phoneNoAreaCode: '86',
        code: '',
        email: '',
        emailCode: '',
        verifyType: '00'
      },
      rules: {
        loginName: [{ required: true, message: this.$t('common.message.required'), trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        code: [
          { required: true, validator: validatePhoneCode, trigger: 'blur' }
        ],
        emailCode: [
          { required: true, validator: validateEmailCode, trigger: 'blur' }
        ]
      },
      options: prefixDefault
    }
  },
  computed: {
    fullSmsCode() {
      // return this.smsCode + this.ruleForm.code
      return this.smsCode
    },
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    // 选择校验方式
    selectValideClick(value) {
      if (value === '00') {
        this.IsSelectPhoneValid = true
      } else if (value === '10') {
        this.IsSelectPhoneValid = false
      }
    },
    fetchSmsCode(formName, type) {
      if (this.flag) return
      if (type === 'phone') {
        this.$refs[formName].validateField('phone', async err => {
          if (err) {
            this.$message({
              message: err,
              type: 'error'
            })
          } else {
            const params = {
              flag: true,
              loginName: this.ruleForm.loginName,
              phoneNo: this.ruleForm.phone,
              phoneNoAreaCode: this.ruleForm.phoneNoAreaCode
            }
            getSmsCode(params).then(r => {
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
                // this.$refs[formName].resetFields()
                this.countDown()
              }
            })
          }
        })
      } else if (type === 'email') {
        this.$refs[formName].validateField('email', async err => {
          if (err) {
            this.$message({
              message: err,
              type: 'error'
            })
          } else {
            const params = {
              loginName: this.ruleForm.loginName,
              email: this.ruleForm.email
            }
            // getEmailCode(params).then(res => {
            getForgetEmailCode(params).then(res => {
              if (res.code === 'ACK') {
                this.emailCodeData = res.data
                this.$message({
                  message: this.$t('common.message.sendSuccess'),
                  type: 'success'
                })
                // this.$refs[formName].resetFields()
                this.countDown()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
            })
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            loginName: this.ruleForm.loginName,
            phoneNo: this.ruleForm.phone,
            phoneCode: this.ruleForm.code,
            phoneNoAreaCode: this.ruleForm.phoneNoAreaCode,
            email: this.ruleForm.email,
            verifyType: this.ruleForm.verifyType,
            emailCode: this.emailCodeData + this.ruleForm.emailCode
          }
          retrievePassword(params).then(r => {
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
              this.$router.push({
                name: 'reset-password',
                query: {
                  userInfo: r.data
                }
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changePath() {
      this.$router.push({
        path: '/login'
      })
    },
    countDown() {
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
</script>

<style lang="scss" scoped>
$mainWidth: 1220px;
.main {
  display: flex;
  background-color: #e7edf5;
  flex-direction: column;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;

  .header {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-bottom: none;
    padding: 67px 0 67px 0;
    display: flex;
    justify-content: center;
    .header-title {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .header-panel {
      display: flex;
      flex-direction: column;
      /* border: 1px solid rgba(223, 223, 223, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06); */
      width: 550px;
      padding: 20px 40px;
      /* background-color: #EAEDF2; */
      background: rgba(250, 251, 253, 1);
      border: 1px solid rgba(239, 242, 245, 1);
      opacity: 1;
      ::v-deep.selectValideWay {
        cursor: pointer;
        margin-top: -10px;
        position: relative;
        padding: 2px;
        color: #2c76d1;
        /deep/ .el-radio-group {
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          font-size: 0;
          margin-bottom: 10px;
          /deep/.el-radio__label {
            font-size: 18px;
          }
        }
      }
      ::v-deep.phoneNo {
        display: flex;
        flex-direction: row;
        .el-select {
          width: 120px;
          input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        > .el-input {
          input {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      ::v-deep.emailNo {
        display: flex;
        flex-direction: row;
        .el-select {
          width: 120px;
          input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        > .el-input {
          input {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      ::v-deep .el-input__inner {
        height: 40px;
      }
      .panel-code {
        display: flex;
        flex-direction: row;
        .code-button {
          flex: 0 0 30%;
          height: 40px;
        }
      }
      .submit-button {
        height: 49px;
        font-size: 20px;
        font-weight: 400;
      }
      .tip {
        font-size: 18px;
        > span {
          font-size: 18px;
          font-weight: bold;
          color: rgba(58, 126, 209, 1);
        }
      }
    }
  }

  .dialog {
    ::v-deep .el-dialog__footer {
      background-color: #ffffff;
    }
  }

  .body {
    width: 622px;

    > div {
      .title {
        font-size: 18px;
        font-weight: bold;
        height: 24px;
        line-height: 24px;
        color: rgba(0, 0, 0, 1);
        margin: 34px 0 19px 0;
        position: relative;
        text-indent: 24px;

        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 18px;
          background: rgba(44, 118, 209, 1);
          opacity: 1;
          position: absolute;
          top: 50%;
          margin-top: -9px;
          left: 10px;
        }
      }

      .content {
        background-color: #fafbfd;
        border: 1px solid rgba(239, 242, 245, 1);
        padding: 27px 134px 10px 36px;
        margin: 0 0 30px 0;
      }

      ::v-deep.el-form-item {
        .el-form-item__label {
          padding: 0;
          font-size: 15px;
          font-weight: 400;
          color: #303030;
          line-height: 30px;
        }

        .el-form-item__content {
          line-height: 30px;
        }
      }
    }
  }
}
</style>
