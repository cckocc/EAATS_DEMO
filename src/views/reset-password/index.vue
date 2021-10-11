<template>
  <div>
    <div class="main">
      <div class="header">
        <div>
          <div class="header-title">{{ $t('forget.modifyPassword') }}</div>
          <div class="header-panel">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-position="left"
              :label-width="formLabelWidth"
            >
              <el-form-item prop="tip" label-width="0">
                <div class="tip">{{ $t('forget.accountInfo') }}<span>{{ userInfo.loginName }}</span></div>
              </el-form-item>
              <el-form-item prop="pass">
                <template slot="label">
                  <el-tooltip placement="bottom-start">
                    <div slot="content">
                      <p>{{ $t('common.validate.password') }}</p>
                    </div>
                    <span>{{ $t('forget.newPassword') }}<i class="el-icon-question" /></span>
                  </el-tooltip>
                </template>
                <el-input v-model="ruleForm.pass" type="password" />
              </el-form-item>
              <el-form-item prop="checkPass" :label="$t('forget.newPasswordConfirm')">
                <el-input v-model="ruleForm.checkPass" type="password" />
              </el-form-item>
            </el-form>
            <el-button class="submit-button" type="primary" @click="submitForm('ruleForm')">{{ $t('common.button.confirm') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPublicKey, retrievePasswordForPerson, editFirstLoginPassword } from '@/api/common'
import JSEncrypt from 'jsencrypt'
import { validPassword } from '@/utils/validate'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.placeholder.password')))
      } else {
        if (!validPassword(value)) {
          callback(new Error(this.$t('common.validate.password')))
        }
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.passwordTwice')))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t('common.validate.passwordDifferent')))
      } else {
        callback()
      }
    }
    return {
      loginPwd: '',
      confirmPwd: '',
      publickKey: '',
      smsCode: '',
      dialogVisible: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userInfo() {
      if (typeof this.$route.query.userInfo === 'string') {
        this.$router.push({ name: 'login' })
        return this.$store.getters.userInfo || this.$route.query.userInfo
      } else if (typeof this.$route.query.userInfo === 'undefined') {
        return this.$store.getters.userInfo
      } else {
        return this.$route.query.userInfo
      }
    },
    changePwdFlag() {
      return this.$store.getters.userInfo.changePwdFlag
    },
    formLabelWidth() {
      return this.$store.getters.language === 'en' ? '260px' : '110px'
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
          console.log('submit!')
          try {
            // const r = await encrypt(this.ruleForm.pass)
            // this.loginPwd = r.data
            // const res = await encrypt(this.ruleForm.pass)
            // this.confirmPwd = res.data
            const encryptStr = new JSEncrypt()
            encryptStr.setPublicKey(this.publickKey)
            this.loginPwd = encryptStr.encrypt(this.ruleForm.pass.toString())
            this.confirmPwd = encryptStr.encrypt(this.ruleForm.checkPass.toString())
            // 密码加密
            const params = {
              loginName: this.userInfo.loginName,
              token: this.userInfo.token,
              userId: this.userInfo.userId,
              loginPwd: this.loginPwd,
              confirmPwd: this.confirmPwd
            }
            if (this.changePwdFlag) {
              await editFirstLoginPassword({ password: this.loginPwd })
              await this.$store.dispatch('user/logout')
              this.$message({
                message: this.$t('forget.message.modifySuccess'),
                type: 'success'
              })
              this.$router.push('/login')
            } else {
              // await retrievePasswordForPerson(params)
              retrievePasswordForPerson(params).then(res => {
                console.log(res)
                if (res.code !== 'ACK') {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                } else {
                  this.$message({
                    message: this.$t('forget.message.modifySuccess'),
                    type: 'success'
                  })
                  this.$router.push('/login')
                }
              })
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changePath() {
      // this.dialogVisible = false
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
    $mainWidth: 1220px;
    .main {
      display: flex;
      background-color: #E7EDF5;
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
        display:flex;
        justify-content: center;
        .header-title{
          font-size:26px;
          font-family:Microsoft YaHei;
          font-weight:bold;
          margin-bottom:20px;
        }
        .header-panel{
          ::v-deep .el-form-item__content{
            display:flex;
          }
          ::v-deep .el-form-item__label {
            margin:5px 0;
            font-size:18px;
            font-family:Microsoft YaHei;
            font-weight:400;
          }
          ::v-deep .el-input__inner{
            height:40px;
          }
          /* border: 1px solid rgba(223, 223, 223, 1);
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06); */
          width:800px;
          padding: 20px 40px;
          display:flex;
          flex-direction: column;
          /* background-color: #EAEDF2; */
          background:rgba(250,251,253,1);
          border:1px solid rgba(239,242,245,1);
          opacity:1;
          .panel-code{
            display:flex;
            flex-direction: row;
            .code-button{
              height:30px;
              padding: 0 15px;
            }
          }
          .btn{
            display: flex;
            justify-content: center;
          }
          .submit-button,.cancel-button{
            height:49px;
            font-size:20px;
            font-family:Microsoft YaHei;
            font-weight:400;
          }
          .tip{
            font-family:Microsoft YaHei;
            font-size:18px;
            >span{
              margin-left: 22px;
              font-family:Microsoft YaHei;
              font-size:18px;
              font-weight:bold;
              color:rgba(58,126,209,1);
            }
          }
        }
      }

      .dialog {
        ::v-deep .el-dialog__footer {
          background-color: #FFFFFF;
        }
      }

      .body {
        width: 622px;

        >div {
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
            background-color: #FAFBFD;
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

