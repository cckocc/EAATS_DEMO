<template>
  <div
    v-loading="loading"
    class="body"
  >
    <div>
      <el-form
        ref="ruleForm"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item
          :label="$t('common.mobilePhone')"
          prop="phoneNo"
        >
          <div class="prepend">
            <el-select
              v-model="ruleForm.phoneNoAreaCode"
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
            <span class="solid" />
            <el-input
              v-model="ruleForm.phoneNo"
              autocomplete="off"
              maxlength="30"
            />
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('userCenter.SMSVerifyCode')"
          prop="phoneCode"
        >
          <el-input
            v-model="ruleForm.phoneCode"
            autocomplete="off"
            :placeholder="$t('userCenter.placeholder.sixCode')"
          >
            <el-button
              slot="append"
              v-preventReClick
              :disabled="flag"
              type="primary"
              class="captcha"
              @click="sendCode('ruleForm')"
            >{{ text }}</el-button>
          </el-input>
        </el-form-item>
        <div class="btn">
          <el-button
            v-preventReClick
            type="primary"
            @click="submitForm('ruleForm')"
          >{{ $t('common.button.submit') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validate30Num, validPhoneCode } from '@/utils/validate'
import { bindingPhone } from '@/api/personalCenter'
import { getSmsCode } from '@/api/common'
import { prefixDefault } from '@/utils/prefix'
export default {
  name: 'Phone',
  props: {
    userInfo: {
      type: Object,
      default: () => []
    },
    port: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.mobilePhone')))
      } else if (validate30Num(value)) {
        callback()
      } else {
        callback(new Error(this.$t('register.validate.mobilePhone')))
      }
    }
    const validatePhoneCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.code')))
      } else if (this.tempPhoneNoAreaCode !== this.ruleForm.phoneNoAreaCode) {
        callback(new Error(this.$t('common.validate.wrongCode')))
      } else if (!validPhoneCode(value)) {
        callback(new Error(this.$t('common.validate.sixCode')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      tempPhoneNoAreaCode: '86',
      ruleForm: {
        phoneNo: '',
        phoneNoAreaCode: '86',
        phoneCode: ''
      },
      rules: {
        phoneNo: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, validator: validatePhoneCode, trigger: ['blur', 'change'] }
        ]
      },
      options: prefixDefault,
      text: this.$t('common.phoneText'),
      flag: false
    }
  },
  methods: {
    onChangeAreaCode() {
      this.$refs.ruleForm.validateField('phoneCode')
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const { id } = this.userInfo
            const { phoneNo, phoneCode, phoneNoAreaCode } = this.ruleForm

            const params = { id, phoneNO: phoneNo, phoneCode, phoneNoAreaCode }
            const res = await bindingPhone(params, this.port)
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.$emit('getUserInfo')
          } catch (e) {
            console.log(e)
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sendCode(formName) {
      if (this.flag) return
      this.$refs[formName].validateField('phoneNo', async err => {
        if (err) {
          this.$message({
            message: err,
            type: 'warning'
          })
        } else {
          try {
            const { loginName } = this.userInfo
            const { phoneNo, phoneNoAreaCode } = this.ruleForm
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
              this.countDown()
            }
          } catch (e) {
            console.log(e)
          }
        }
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
.body {
  border-top: 1px solid #eceff3;
  display: flex;
  justify-content: center;
  > div {
    padding: 40px 0 30px 0;
    .el-form {
      width: 447px;
      ::v-deep.el-form-item__label{
          float: unset;
        }
      ::v-deep.el-input {
        display: flex;
        justify-content: space-between;

        .el-input-group__append {
          width: 100px;
          height: 30px;
          border-radius: 0;
          background: rgba(236, 244, 254, 1);
          border: 1px solid rgba(206, 225, 248, 1);
          text-align: center;
          padding: 0;

          .el-button {
            padding: 0;
            margin: 0;
            height: 30px;
            line-height: 30px;
            font-size: 13px;
          }
        }

        &.el-input-group--append {
          input {
            width: 330px;
          }
        }
      }
      ::v-deep.el-form-item__content {
        .prepend {
          display: flex;
          flex-direction: row;
          align-items: center;
          .el-select {
            input {
              width: 78px;
              height: 30px;
              font-size: 13px;
              color: #303030;
              border: 1px solid rgba(230, 230, 230, 1);
              background-color: #ffffff;

              &::placeholder {
                font-size: 13px;
              }
            }
          }
          .solid {
            width: 10px;
            height: 0;
            border-top: 1px solid #303030;
            opacity: 1;
            margin: 0 10px;
          }
        }
      }

      .btn {
        display: flex;
        justify-content: center;
      }
      .captcha{
        width:100px;
      }
    }
  }
}
</style>
