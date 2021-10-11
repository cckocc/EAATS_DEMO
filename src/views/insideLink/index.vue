|<template>
  <div class="main-body">
    <div class="main-body-content binding">
      <template v-if="isShowStep">
        <Steps :steps-list="stepsList" :active-index="activeIndex" />
        <div class="binding-wrap">
          <div v-if="activeIndex === 1">
            <el-form
              ref="stepOneForm"
              :model="stepOneObj.form"
              :rules="stepOneObj.rules"
              label-width="100px"
              label-position="left"
            >
              <el-form-item label="机构" prop="orgId">
                <el-select
                  v-model="stepOneObj.form.orgId"
                  style="width: 100%;"
                  placeholder="请选择"
                  @change="onChangeOrg"
                >
                  <el-option
                    v-for="item in stepOneObj.orgOptions"
                    :key="item.id"
                    :label="item.instnCnFullNm"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="stepOneObj.form.instnCd" label="18位码">
                <el-input
                  v-model="stepOneObj.form.instnCd"
                  disabled
                />
              </el-form-item>
              <el-form-item v-if="stepOneObj.form.sixCode" label="6位码">
                <el-input
                  v-model="stepOneObj.form.sixCode"
                  disabled
                />
              </el-form-item>
            </el-form>
            <div class="text-center">
              <el-button type="primary" @click="next()">下一步</el-button>
            </div>
          </div>
          <div v-if="activeIndex === 2">
            <el-form
              ref="stepTwoForm"
              :model="stepTwoObj.form"
              :rules="stepTwoObj.rules"
              label-width="100px"
              label-position="left"
            >
              <el-form-item label="用户" prop="cassUserId">
                <el-select
                  v-model="stepTwoObj.form.cassUserId"
                  style="width: 100%;"
                  placeholder="请选择"
                  @change="onChangeUser"
                >
                  <el-option
                    v-for="item in stepTwoObj.userOptions"
                    :key="item.cassUserId"
                    :label="item.loginName"
                    :value="item.cassUserId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="验证方式" prop="verifyType">
                <el-radio-group v-model="stepTwoObj.form.verifyType">
                  <el-radio label="00">手机验证 </el-radio>
                  <el-radio label="10">邮箱验证</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="stepTwoObj.form.email && stepTwoObj.form.verifyType === '00'">
                <el-form-item label="手机号码">
                  <el-input
                    v-model="stepTwoObj.form.phoneNo"
                    disabled
                  />
                </el-form-item>
                <el-form-item
                  key="phoneCode"
                  label="短信验证码"
                  prop="phoneCode"
                >
                  <el-input
                    v-model="stepTwoObj.form.phoneCode"
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
              </template>
              <template v-if="stepTwoObj.form.email && stepTwoObj.form.verifyType === '10'">
                <el-form-item label="电子邮箱">
                  <el-input
                    v-model="stepTwoObj.form.email"
                    disabled
                  />
                </el-form-item>
                <el-form-item
                  key="mailCode"
                  label="邮箱验证码"
                  prop="mailCode"
                >
                  <el-input
                    v-model="stepTwoObj.form.mailCode"
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
              </template>
              <el-form-item v-if="stepTwoObj.form.instnIdentityList" label="用户身份">
                <el-input
                  v-model="stepTwoObj.form.instnIdentityList"
                  disabled
                />
              </el-form-item>
              <!-- <el-form-item label="密码" prop="loginPwd">
                <el-input
                  v-model="stepTwoObj.form.loginPwd"
                  v-limitBytes="300"
                  placeholder="请输入"
                  show-password
                  clearable
                />
              </el-form-item> -->
            </el-form>
            <div class="text-center">
              <el-button type="primary" @click="bindUser()">绑定</el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Steps from '@/components/Steps'
import { loginDo, bindDo, orgBindDo } from '@/api/insideLink'
import { getSmsCode, getEmailCode, getPublicKey } from '@/api/common'
import store from '@/store'
import { setToken } from '@/utils/auth'
import { validPhoneCode } from '@/utils/validate'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')
import JSEncrypt from 'jsencrypt'
export default {
  components: {
    Steps
  },
  data() {
    const validatePhoneCode = (rule, value, callback) => {
      if (!validPhoneCode(value)) {
        callback(new Error('验证码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      param: this.$route.query.param || '',
      autologinFlag: false,
      stepsList: ['机构绑定', '用户绑定'],
      activeIndex: 1,
      isShowStep: true,
      publickKey: '',
      stepOneObj: {
        orgOptions: [],
        form: {
          orgId: null,
          instnCd: '',
          sixCode: ''
        },
        rules: {
          orgId: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        }
      },
      stepTwoObj: {
        userOptions: [],
        form: {
          cassUserId: null,
          loginName: '',
          loginPwd: '',
          instnIdentityList: '',
          verifyType: '10',
          email: '',
          mailCode: '',
          phoneNo: '',
          phoneCode: ''
        },
        rules: {
          cassUserId: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          loginPwd: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          verifyType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          phoneCode: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validatePhoneCode, trigger: 'blur' }
          ],
          mailCode: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validatePhoneCode, trigger: 'blur' }
          ]
        }
      },
      emailCode: '',
      emailText: '发送验证码',
      text: '发送验证码',
      emailFlag: false,
      flag: false
    }
  },
  created() {
    this.getPublicKeyMethod()
    this.autoLogin()
  },
  methods: {
    ...mapActions(['setPublicKey']),
    async sendEmailCode() {
      if (this.emailFlag) return
      try {
        const { email, loginName } = this.stepTwoObj.form
        if (email && loginName) {
          const params = { email, loginName }
          const r = await getEmailCode(params)
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
              message: '发送成功',
              type: 'success'
            })
            this.countDown(this.emailText, this.emailFlag, 'email')
          }
        } else {
          this.$message({
            message: '请输入用户名和邮箱',
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
        const { phoneNo, loginName } = this.stepTwoObj.form
        if (phoneNo && loginName) {
          const params = { loginName, phoneNo, phoneNoAreaCode: '86', flag: false }
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
              message: '发送成功',
              type: 'success'
            })
            this.countDown(this.text, this.flag, 'phone')
          }
        } else {
          this.$message({
            message: '请输入用户名和手机号码',
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
            this.emailText = '发送验证码'
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
            this.text = '发送验证码'
            clearInterval(interval)
            this.flag = false
          }
        }, 1000)
      }
    },
    next() {
      this.$refs.stepOneForm.validate(valid => {
        if (valid) {
          const params = {
            id: this.stepOneObj.form.orgId,
            param: encodeURIComponent(this.param) // 参数转换
          }
          orgBindDo(params).then(res => {
            console.log(res.data)
            const { autologinFlag, cassUserInfoList } = res.data
            this.autologinFlag = autologinFlag
            if (autologinFlag) {
              this.handlerToken(res.data)
              this.setDomStyle()
            } else {
              this.activeIndex = 2
              this.stepTwoObj.form.cassUserId = null
              this.stepTwoObj.userOptions = cassUserInfoList
              if (cassUserInfoList.length === 1) {
                this.stepTwoObj.form.cassUserId = cassUserInfoList[0].cassUserId
                this.onChangeUser(cassUserInfoList[0].cassUserId)
              }
            }
            this.$message({
              message: '机构绑定成功',
              type: 'success'
            })
          })
        }
      })
    },
    bindUser() {
      this.$refs.stepTwoForm.validate(valid => {
        if (valid) {
          const encryptStr = new JSEncrypt()
          encryptStr.setPublicKey(this.publickKey)
          const params = {
            cassUserId: this.stepTwoObj.form.cassUserId,
            loginName: this.stepTwoObj.form.loginName,
            verifyType: this.stepTwoObj.form.verifyType,
            // loginPwd: encryptStr.encrypt(this.stepTwoObj.form.loginPwd),
            param: encodeURIComponent(this.param) // 参数转换
          }
          if (this.stepTwoObj.form.verifyType === '00') {
            params.authCode = this.stepTwoObj.form.phoneCode
            params.verifyTypeData = this.stepTwoObj.form.phoneNo
          } else {
            params.authCode = this.emailCode + this.stepTwoObj.form.mailCode
            params.verifyTypeData = this.stepTwoObj.form.email
          }
          bindDo(params).then(res => {
            if (res.code === 'ACK') {
              console.log(res.data)
              this.autologinFlag = res.data.autologinFlag
              if (res.data.autologinFlag) {
                this.handlerToken(res.data)
                this.setDomStyle()
              }
              this.$message({
                message: '用户绑定成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    onChangeUser(val) {
      const findUser = this.stepTwoObj.userOptions.find(e => e.cassUserId === val)
      this.stepTwoObj.form.loginName = findUser.loginName
      this.stepTwoObj.form.phoneNo = findUser.phoneNo
      this.stepTwoObj.form.email = findUser.email
      this.stepTwoObj.form.instnIdentityList = (findUser.instnIdentityList || []).map(e => e.text).toString()
    },
    onChangeOrg(val) {
      const findOrg = this.stepOneObj.orgOptions.find(e => e.id === val)
      this.stepOneObj.form.instnCd = findOrg.instnCd
      this.stepOneObj.form.sixCode = findOrg.sixCode
    },
    getPublicKeyMethod() {
      getPublicKey().then(res => {
        this.publickKey = res.data
        this.setPublicKey(this.publickKey)
      })
    },
    // 自动登录
    autoLogin() {
      if (this.param) {
        loginDo({ param: encodeURIComponent(this.param) }).then(res => {
          const data = res.data
          const { autologinFlag, instRespDtoList, cassUserInfoList, hint } = data
          if (hint) {
            this.$confirm(hint, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (autologinFlag) {
                this.handlerToken(data)
                this.setDomStyle()
              } else {
                if (instRespDtoList) {
                  this.activeIndex = 1
                  this.stepOneObj.form.orgId = null
                  this.stepOneObj.orgOptions = instRespDtoList
                  if (cassUserInfoList.length === 1) {
                    this.stepOneObj.form.orgId = cassUserInfoList[0].id
                    this.onChangeOrg(cassUserInfoList[0].id)
                  }
                } else if (!instRespDtoList && cassUserInfoList) {
                  this.activeIndex = 2
                  this.stepTwoObj.form.cassUserId = null
                  this.stepTwoObj.userOptions = cassUserInfoList
                  if (cassUserInfoList.length === 1) {
                    this.stepTwoObj.form.cassUserId = cassUserInfoList[0].cassUserId
                    this.onChangeUser(cassUserInfoList[0].cassUserId)
                  }
                } else {
                  this.isShowStep = false
                }
              }
            }).catch(() => {
              this.$router.push({
                name: 'home'
              })
            })
          } else {
            if (autologinFlag) {
              this.handlerToken(data)
              this.setDomStyle()
            } else {
              if (instRespDtoList) {
                this.activeIndex = 1
                this.stepOneObj.form.orgId = null
                this.stepOneObj.orgOptions = instRespDtoList
                if (instRespDtoList.length === 1) {
                  this.stepOneObj.form.orgId = instRespDtoList[0].id
                  this.onChangeOrg(instRespDtoList[0].id)
                }
              } else if (!instRespDtoList && cassUserInfoList) {
                this.activeIndex = 2
                this.stepTwoObj.form.cassUserId = null
                this.stepTwoObj.userOptions = cassUserInfoList
                if (cassUserInfoList.length === 1) {
                  this.stepTwoObj.form.cassUserId = cassUserInfoList[0].cassUserId
                  this.onChangeUser(cassUserInfoList[0].cassUserId)
                }
              } else {
                this.isShowStep = false
              }
            }
          }
        })
        // this.$store.dispatch('user/loginDo', encodeURIComponent(this.param)).then(data => {
        //   const { autologinFlag, instRespDtoList, cassUserInfoList, hint } = data
        //   if (hint) {
        //     this.$confirm(hint, '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       if (autologinFlag) {
        //         this.handlerToken(data)
        //         this.setDomStyle()
        //       } else {
        //         if (instRespDtoList) {
        //           this.activeIndex = 1
        //           this.stepOneObj.form.orgId = null
        //           this.stepOneObj.orgOptions = instRespDtoList
        //         } else if (!instRespDtoList && cassUserInfoList) {
        //           this.activeIndex = 2
        //           this.stepTwoObj.form.cassUserId = null
        //           this.stepTwoObj.userOptions = cassUserInfoList
        //         } else {
        //           this.isShowStep = false
        //         }
        //       }
        //     }).catch(() => {
        //       this.$router.push({
        //         name: 'home'
        //       })
        //     })
        //   } else {
        //     if (autologinFlag) {
        //       this.handlerToken(data)
        //       this.setDomStyle()
        //     } else {
        //       if (instRespDtoList) {
        //         this.activeIndex = 1
        //         this.stepOneObj.form.orgId = null
        //         this.stepOneObj.orgOptions = instRespDtoList
        //       } else if (!instRespDtoList && cassUserInfoList) {
        //         this.activeIndex = 2
        //         this.stepTwoObj.form.cassUserId = null
        //         this.stepTwoObj.userOptions = cassUserInfoList
        //       } else {
        //         this.isShowStep = false
        //       }
        //     }
        //   }
        // })
      }
    },
    // authloginFlag为true时，更新token
    handlerToken(data) {
      const token = data.token
      store.dispatch('user/resetToken')
      this.$store.commit('user/SET_TOKEN', token)
      setToken(token)
      setTimeout(() => {
        this.$router.push({ name: 'inside-success', params: { isHref: true }})
      }, 500)
    },
    // 导航栏显示和隐藏
    setDomStyle() {
      const domNav = document.getElementsByClassName('nav')[0]
      const domUser = document.getElementsByClassName('user')[0]
      if (this.autologinFlag) {
        domNav.classList.contains('hideNav')
          ? domNav.classList.remove('hideNav')
          : null
        domUser.classList.contains('hideUser')
          ? domUser.classList.remove('hideUser')
          : null
      } else {
        !domNav.classList.contains('hideNav')
          ? domNav.classList.add('hideNav')
          : null
        !domUser.classList.contains('hideUser')
          ? domUser.classList.add('hideUser')
          : null
      }
    }
  }
}
</script>

<style lang="scss">
.hideNav,
.hideUser {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.binding {
  position: relative;
  z-index: 2;
  &-wrap {
    margin: 20px 200px;
  }
}
</style>
