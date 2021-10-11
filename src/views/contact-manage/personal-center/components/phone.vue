<template>
  <div
    v-loading="loading"
    class="body"
  >
    <div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="97px"
        label-position="left"
      >
        <el-form-item
          label="手机号码"
          prop="phoneNo"
        >
          <div class="prepend">
            <el-select
              v-model="ruleForm.phoneNoAreaCode"
              placeholder="请选择"
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
          label="短信验证码"
          prop="phoneCode"
        >
          <el-input
            v-model="ruleForm.phoneCode"
            autocomplete="off"
            placeholder="请输入6位验证码"
          >
            <el-button
              slot="append"
              :disabled="flag"
              type="primary"
              v-preventReClick
              @click="sendCode('ruleForm')"
            >{{ text }}</el-button>
          </el-input>
        </el-form-item>
        <div class="btn">
          <el-button
            type="primary"
            v-preventReClick
            @click="submitForm('ruleForm')"
          >提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
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
        callback(new Error('请输入手机号'))
      } else if (!validPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
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
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      },
      options: prefixDefault,
      text: '发送验证码',
      flag: false
    }
  },
  methods: {
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
                message: '发送成功',
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
          this.text = '发送验证码'
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
      ::v-deep.el-input {
        display: flex;
        justify-content: space-between;

        .el-input-group__append {
          width: 79px;
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
            color: #2c76d1;
            font-size: 13px;
          }
        }

        &.el-input-group--append {
          input {
            width: 263px;
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
    }
  }
}
</style>
