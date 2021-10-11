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
          :label="$t('common.email')"
          prop="email"
        >
          <el-input
            v-model="ruleForm.email"
            v-limitBytes="500"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          :label="$t('userCenter.emailCode')"
          prop="emailCode"
        >
          <el-input
            v-model="ruleForm.emailCode"
            autocomplete="off"
            :placeholder="$t('userCenter.placeholder.sixCode')"
          >
            <el-button
              slot="append"
              v-preventReClick
              type="primary"
              :disabled="flag"
              style="width:100px"
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
import { validEmail } from '@/utils/validate'
import { bindingEmail } from '@/api/personalCenter'
import { getEmailCode } from '@/api/common'
export default {
  name: 'Phone',
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    },
    port: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('userCenter.message.emailRequired')))
      } else if (!validEmail(value)) {
        callback(new Error(this.$t('userCenter.message.mailFormatError')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      cipEmailCode: '',
      flag: false,
      ruleForm: {
        email: '',
        emailCode: ''
      },
      text: this.$t('common.phoneText'),
      rules: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        emailCode: [
          { required: true, trigger: 'blur', message: this.$t('common.validate.code') }
        ]
      }
    }
  },
  methods: {
    sendCode(formName) {
      if (this.flag) return
      this.$refs[formName].validateField('email', async err => {
        if (err) {
          this.$message({
            message: err,
            type: 'warning'
          })
        } else {
          try {
            const { loginName } = this.userInfo
            const { email } = this.ruleForm
            const params = { loginName, email }
            const r = await getEmailCode(params)
            this.ruleForm.emailCode = ''
            this.cipEmailCode = r.data
            if (r.code === 'VALIDATION') {
              const isObject =
                Object.prototype.toString.call(r.data) === '[object Object]'
              let message = ''
              if (isObject) {
                console.log('111')
                Object.keys(r.data).forEach(key => {
                  message += r.data[key] + '</br>'
                })
              } else {
                message = r.data
                this.cipEmailCode = r.data
              }
              this.$message({
                message: r.data,
                dangerouslyUseHTMLString: true,
                type: 'error'
              })
            } else {
              this.$message({
                message: this.$t('common.message.sendSuccess'),
                type: 'success'
              })
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const { id } = this.userInfo
            const { email, emailCode } = this.ruleForm
            const cipEmailCode = this.cipEmailCode
            // const r = await getEmailCode()
            // const { message } = r
            const params = { cipEmailCode, id, email, emailCode: emailCode }
            const res = await bindingEmail(params, this.port)
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

      .btn {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
