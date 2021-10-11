<template>
  <div v-loading="loading" class="body">
    <div>
      <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules">
        <el-form-item :label="$t('userCenter.originalPassword')" prop="originalPassword">
          <el-input v-model="ruleForm.originalPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPassword">
          <template slot="label">
            <el-tooltip placement="bottom-start">
              <div slot="content">
                <p>{{ $t('userCenter.placeholder.newPassword') }}</p>
              </div>
              <span>{{ $t('userCenter.newPassword') }}<i class="el-icon-question" /></span>
            </el-tooltip>
          </template>
          <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('userCenter.confirmNewPassword')" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('common.button.submit') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validPassword } from '@/utils/validate'
import { updatePwd } from '@/api/personalCenter'
import { encrypt, getPublicKey } from '@/api/common'
import JSEncrypt from 'jsencrypt'
export default {
  props: {
    userInfo: {
      type: Object,
      default: {}
    },
    port: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('userCenter.message.passwordRequired')))
      } else {
        if (!validPassword(value)) {
          callback(new Error(this.$t('userCenter.message.newPasswordFormat')))
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('userCenter.message.enterPasswordAgain')))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error(this.$t('userCenter.message.passwordInconsistent')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      publickKey: '',
      ruleForm: {
        originalPassword: '',
        newPassword: '',
        checkPass: ''
      },
      rules: {
        originalPassword: [
          { required: true, message: this.$t('userCenter.message.orginalPasswordRequired'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('userCenter.message.newPasswordRequired'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getPublicKey().then(res => {
      this.publickKey = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            this.loading = true
            let { newPassword, originalPassword } = this.ruleForm
            const { id } = this.userInfo
            // const r = await encrypt(originalPassword)
            // originalPassword = r.data
            // const rs = await encrypt(newPassword)
            // newPassword = rs.data
            const encryptStr = new JSEncrypt()
            encryptStr.setPublicKey(this.publickKey)
            originalPassword = encryptStr.encrypt(originalPassword.toString())
            newPassword = encryptStr.encrypt(newPassword.toString())
            const params = {
              newPassword,
              originalPassword,
              id
            }
            const res = await updatePwd(params, this.port)
            this.$message({
              message: this.$t('userCenter.message.passwordUpdateSuccess'),
              type: 'success'
            })
            this.$refs[formName].resetFields()
          } catch (e) {

          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .body{
    border-top:1px solid #ECEFF3;
    display: flex;
    justify-content: center;
    >div{
      padding: 40px 0 30px 0;
      .el-form{
        width: 447px;
        .btn{
          display: flex;
          justify-content: center;
        }
      }
    }

  }
</style>
