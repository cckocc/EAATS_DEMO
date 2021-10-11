<template>
  <div class="banner-body">
    <Banner />
    <div class="login">
      <el-divider>
        <span class="login-title">{{ $t('login.title') }}</span>
      </el-divider>
      <div class="login-body">
        <el-form
          ref="loginForm"
          class="login-body-form"
          :class="{'login-en': language === 'en'}"
          label-position="left"
          :model="loginForm"
          :rules="loginRules"
          hide-required-asterisk
        >
          <el-form-item :label="$t('common.username')" prop="username">
            <el-input
              v-model="loginForm.username"
              v-limitBytes="20"
              :placeholder="$t('common.placeholder.username')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('common.password')" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('common.placeholder.password')"
              auto-complete="on"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('login.verifyType')">
            <el-radio-group v-model="loginForm.verifyType">
              <el-radio label="00">{{ $t('common.mobilePhone') }} </el-radio>
              <el-radio label="10">{{ $t('common.email') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="loginForm.verifyType === '00'">
            <el-form-item
              key="phoneNo"
              prop="phoneNo"
              :label="$t('common.mobilePhone')"
            >
              <el-input
                v-model="loginForm.phoneNo"
                class="common-phone"
                :placeholder="$t('common.placeholder.mobilePhone')"
                clearable
              >
                <el-select
                  slot="prepend"
                  v-model="loginForm.phoneNoAreaCode"
                  :placeholder="$t('common.placeholder.chose')"
                >
                  <el-option
                    v-for="(item, index) in options"
                    :key="index"
                    :label="'+'+item.prefix"
                    :value="item.prefix"
                  />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item
              key="phoneCode"
              prop="phoneCode"
              :label="$t('login.verifyCode')"
            >
              <el-input
                v-model="loginForm.phoneCode"
                maxlength="6"
                :placeholder="$t('login.placeholder.phoneCode')"
              >
                <el-button
                  slot="append"
                  v-preventReClick
                  type="primary"
                  :disabled="phoneFlag"
                  @click="getSmsCodeLogin('phone')"
                >{{ phoneText }}</el-button>
              </el-input>
            </el-form-item>
          </template>
          <template v-if="loginForm.verifyType === '10'">
            <el-form-item
              key="email"
              prop="email"
              :label="$t('common.email')"
            >
              <el-input
                v-model="loginForm.email"
                v-limitBytes="500"
                :placeholder="$t('common.placeholder.email')"
                clearable
              />
            </el-form-item>
            <el-form-item
              key="emailCode"
              prop="emailCode"
              :label="$t('login.verifyCode')"
            >
              <el-input
                v-model="loginForm.emailCode"
                maxlength="6"
                :placeholder="$t('login.placeholder.emailCode')"
              >
                <el-button
                  slot="append"
                  v-preventReClick
                  type="primary"
                  :disabled="mailFlag"
                  @click="getSmsCodeLogin('email')"
                >{{ mailText }}</el-button>
              </el-input>
            </el-form-item>
          </template>
          <el-button
            v-preventReClick
            :loading="loading"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >{{ $t('login.login') }}
          </el-button>
        </el-form>
      </div>
      <div class="login-link">
        <el-button
          type="text"
          @click="forget"
        >{{ $t('login.forgetPassword') }}</el-button>
        <div class="register">
          <span>{{ $t('login.noAccountYet') }}</span>
          <el-button
            type="text"
            @click="register"
          >{{ $t('login.clickRegister') }}</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      ref="loginTip"
      :title="$t('login.loginTip')"
      :visible.sync="protocolDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      width="1200px"
      @close="handleProtocol(false)"
    >
      <div class="content">
        <h1 class="text-center">{{ protocolDialogObj.title }}</h1>
        <div v-html="protocolDialogObj.html" />
      </div>
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="handleProtocol(true)"
        >{{ $t('common.button.confirm2') }}</el-button>
        <el-button
          class="button-default"
          @click="handleProtocol(false)"
        >{{ $t('common.button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Banner from '@/layout/components/banner'
import { getSmsCodeLogin, getEmailCode, getPublicKey, isRead } from '@/api/common'
import { validEmail, validNum } from '@/utils/validate'
import { prefixDefault } from '@/utils/prefix'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')
import { getUserProtocol } from '@/api/gripManageApi'

import JSEncrypt from 'jsencrypt'
export default {
  name: 'Login',
  components: {
    Banner
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.mobilePhone')))
      } else if (!validNum(value)) {
        callback(new Error(this.$t('common.validate.mobilePhone')))
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
    return {
      loading: false,
      smsCode: '',
      emailCodeData: '',
      publickKey: '',
      loginForm: {
        username: '',
        password: '',
        phoneNo: '',
        phoneCode: '',
        phoneNoAreaCode: '86',
        email: '',
        emailCode: '',
        verifyType: '10', // 00-手机号 10 邮箱
        loginType: '00',
        isvLogin: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: this.$t('login.validate.username') }
        ],
        password: [
          { required: true, trigger: 'blur', message: this.$t('login.validate.password') }
        ],
        phoneNo: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        phoneCode: [
          { required: true, trigger: 'blur', message: this.$t('common.validate.code') }
        ],
        emailCode: [
          { required: true, trigger: 'blur', message: this.$t('common.validate.code') }
        ]
      },
      phoneText: this.$t('common.phoneText'),
      mailText: this.$t('common.phoneText'),
      phoneFlag: false,
      mailFlag: false,
      options: prefixDefault,
      IsSelectPhoneValid: false, // 是否选择手机号校验
      protocolDialogObj: {
        visible: false,
        title: '',
        userId: null,
        html: '',
        resolve: {},
        reject: {}
      }
    }
  },
  computed: {
    ...mapState(['publicKey']),
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    this.getPublicKeyMethod()
    this.getUserProtocol()

    // // 登录按钮enter键盘事件
    var vm = this
    document.onkeydown = function(e) {
      var key = window.event.keyCode
      if (key === 13) {
        vm.handleLogin()
      }
    }
  },
  methods: {
    ...mapActions(['setPublicKey']),
    getUserProtocol() {
      getUserProtocol().then(res => {
        this.protocolDialogObj.title = res.data.noticeTitle
        this.protocolDialogObj.html = res.data.body
      })
    },
    handleProtocol(status) {
      this.protocolDialogObj.visible = false
      this.protocolDialogObj.resolve(status)
      if (status) {
        this.$store.dispatch('user/setTokenAgain', this.$store.state.user.tempToken).then(() => {
          const params = {
            userId: this.protocolDialogObj.userId
          }
          isRead(params).then(res => {
          })
        })
      }
    },
    showProtocol(r) {
      if (r.isRead === '0') {
        this.protocolDialogObj.visible = true
        this.protocolDialogObj.userId = r.id
        this.$nextTick(() => {
          this.$refs.loginTip.$el.querySelector('.el-dialog__body').style.height = this.$root.$el.clientHeight - 200 + 'px'
        })
        return new Promise((resolve, reject) => {
          this.protocolDialogObj.resolve = resolve
          this.protocolDialogObj.reject = reject
        })
      } else {
        return true
      }
    },
    getPublicKeyMethod() {
      getPublicKey().then(res => {
        this.publickKey = res.data
        this.setPublicKey(this.publickKey)
      })
    },
    register() {
      this.$router.push({
        path: '/register'
      })
    },
    forget() {
      this.$router.push({
        path: '/forget'
      })
    },
    async getSmsCodeLogin(type) {
      if (type === 'phone') {
        if (this.phoneFlag) return
        try {
          const { phoneNo, username, phoneNoAreaCode } = this.loginForm
          if (phoneNo && username) {
            const params = { loginName: username, phoneNo, phoneNoAreaCode }
            const r = await getSmsCodeLogin(params)
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
              this.smsCode = r.data
              // this.loginForm.phoneCode = '123456'
              this.$message({
                message: phoneNoAreaCode === '86' ? this.$t('common.message.sendSuccess') : this.$t('common.message.sendForeignSuccess'),
                type: 'success'
              })
              this.countDown('phone')
            }
          } else {
            this.$message({
              message: this.$t('common.message.usernameAndMobilePhone'),
              type: 'error'
            })
          }
        } catch (e) {
          e.error
        }
      } else if (type === 'email') {
        if (this.mailFlag) return
        const { email, username } = this.loginForm
        if (email && username) {
          const params = { loginName: username, email }
          const r = await getEmailCode(params)
          if (r.code === 'ACK') {
            this.emailCodeData = r.data
            this.$message({
              message: this.$t('common.message.sendSuccess'),
              type: 'success'
            })
            this.countDown('mail')
          } else {
            this.$message({
              message: r.message,
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: this.$t('common.message.usernameAndMail'),
            type: 'error'
          })
        }
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const {
            username,
            password,
            phoneCode,
            phoneNo,
            phoneNoAreaCode,
            email,
            verifyType,
            emailCode
          } = this.loginForm
          const encryptStr = new JSEncrypt()
          this.getPublicKeyMethod()
          encryptStr.setPublicKey(this.publickKey)
          const params = {
            username,
            password: encryptStr.encrypt(password.toString()),
            phoneNo,
            phoneNoAreaCode,
            email,
            verifyType,
            phoneCode: this.smsCode + phoneCode,
            emailCode: this.emailCodeData + emailCode,
            loginType: this.loginForm.loginType,
            isvLogin: this.loginForm.isvLogin
          }
          this.$store
            .dispatch('user/login', params)
            .then(async r => {
              this.loading = false
              const hasReadProtocol = await this.showProtocol(r)
              if (!hasReadProtocol) return
              if (r.code === 'FORCE_LOGIN') {
                this.$confirm(
                  this.$t('login.message.otherDeviceToLogin'),
                  this.$t('common.message.tips'),
                  {
                    confirmButtonText: this.$t('common.button.forceLogin'),
                    cancelButtonText: this.$t('common.button.cancel'),
                    type: 'warning',
                    center: true
                  }
                )
                  .then(() => {
                    this.loginForm.loginType = '10'
                    this.handleLogin()
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: this.$t('login.message.cancelLogin')
                    })
                  })
              } else if (r.code === 'ISV_LOGIN') {
                this.$confirm('是否以ISV身份登录进行服务申请？', this.$t('common.message.tips'), {
                  confirmButtonText: this.$t('login.message.yes'),
                  cancelButtonText: this.$t('login.message.no'),
                  type: 'warning',
                  center: true,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  showClose: false
                }).then(() => {
                  this.loginForm.isvLogin = '10'
                  this.handleLogin()
                }).catch(() => {
                  this.loginForm.isvLogin = '00'
                  this.handleLogin()
                })
              } else {
                const { notice, changePwdFlag, instiStatus } = r
                if (changePwdFlag) {
                  this.$message({
                    message: this.$t('login.message.changePassword'),
                    type: 'warning'
                  })
                  this.$router.push('/reset-password')
                } else {
                  if (notice && notice != null) {
                    this.$message({
                      message: notice,
                      type: 'warning',
                      duration: 5000
                    })
                    const { code } = instiStatus
                    if (code === '90') {
                      setTimeout(() => {
                        this.$router.push('/organ-basicinfo/organ-basicinfo')
                      }, 5000)
                    }
                  }
                  this.$router.push('/home')
                }
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    countDown(type) {
      if (type === 'phone') {
        let num = 60
        this.phoneFlag = true
        const interval = setInterval(() => {
          if (num > 0) {
            num--
            this.phoneText = `${num}s`
          } else {
            this.phoneText = this.$t('common.phoneText')
            clearInterval(interval)
            this.phoneFlag = false
          }
        }, 1000)
      } else if (type === 'mail') {
        let num = 60
        this.mailFlag = true
        const interval = setInterval(() => {
          if (num > 0) {
            num--
            this.mailText = `${num}s`
          } else {
            this.mailText = this.$t('common.phoneText')
            clearInterval(interval)
            this.mailFlag = false
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-body {
  min-height: 726px;
  position: relative;
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 6px #717171;
  padding: 45px 37px 33px 40px;
  &-title {
    font-size: 30px;
    font-weight: bold;
    color: #3a7ed1;
    white-space: nowrap;
  }
  &-body {
    &-form {
      ::v-deep .el-form-item {
        display: flex;
        justify-content: space-between;
        .el-form-item__label {
          text-align: justify;
          text-align-last: justify;
          font-size: 18px;
          color: #514e4e;
          font-weight: 400;
          white-space: nowrap;
          line-height: 40px;
          flex: 1 1 auto;
        }
        &.is-required {
          .el-form-item__label {
            &:after {
              display: none;
            }
          }
        }
        .el-form-item__content {
          width: 300px;
          .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
  &-link {
    display: flex;
    justify-content: space-between;
    color: #4b4d4e;
    font-size: 14px;
  }
  &-en {
    ::v-deep .el-form-item {
      .el-form-item__label {
        text-align: initial;
        text-align-last: initial;
      }
      .el-form-item__content {
        width: 440px;
      }
    }
  }
}
.content{
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
}
</style>
