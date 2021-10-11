<template>
  <div v-loading="loading" class="body">
    <div>
      <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules">

        <el-form-item :label="$t('userCenter.fullName')" prop="sname">
          <el-input v-model="ruleForm.sname" v-limitBytes="90" autocomplete="off" placeholder="" />
        </el-form-item>
        <el-form-item v-if="userInfo.userInnerType.code === '00'" :label="$t('userCenter.landline')" required>
          <el-col :span="7">
            <el-form-item prop="telNoAreaCode" class="inner-panel">
              <el-input v-model="ruleForm.telNoAreaCode" :placeholder="$t('userCenter.areaCode')" class="tel-code" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-form-item prop="telNo" :rules="rules.telNoOrg" class="inner-panel">
              <el-input v-model="ruleForm.telNo" :placeholder="$t('userCenter.enterNumber')" clearable class="tel" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="userInfo.userInnerType.code === '05'" :label="$t('userCenter.landline')" required>
          <el-col :span="7">
            <el-form-item class="inner-panel">
              <el-input v-model="ruleForm.telNoAreaCode" v-limitBytes="50" :placeholder="$t('userCenter.areaCode')" class="tel-code" />
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="1">
            <el-form-item prop="telNo" :rules="rules.telNoGrip" class="inner-panel">
              <el-input v-model="ruleForm.telNo" v-limitBytes="200" :placeholder="$t('userCenter.enterNumber')" clearable class="tel" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('common.button.submit') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validSname, validTelephoneArea, validSingleTel } from '@/utils/validate'
import { isNull, isEmpty } from '@/utils/index.js'
import { updateName } from '@/api/personalCenter'

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
    // const validateTelephone = (rule, value, callback) => {
    //   if (this.ruleForm.telNoAreaCode === '') {
    //     callback(new Error('请输入区号'))
    //   } else if (value === '') {
    //     callback(new Error('请输入座机号'))
    //   } else if (!validTelephone(this.ruleForm.telNoAreaCode + '-' + value)) {
    //     callback(new Error('座机号码格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateSname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('userCenter.message.nameRequired')))
      } else if (!validSname(value)) {
        callback(new Error(this.$t('userCenter.message.formatValidate')))
      } else {
        callback()
      }
    }
    const validateTelNo = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validSingleTel(value)) {
          callback(new Error(this.$t('common.validate.telephone')))
        }
        callback()
      }
    }
    const validateTelNoAreaCode = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error(this.$t('userCenter.message.enterAreaCode')))
      } else if (!validTelephoneArea(value)) {
        callback(new Error(this.$t('userCenter.message.areaCodeFormatError')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        sname: '',
        telNo: '',
        telNoAreaCode: ''
      },
      rules: {
        sname: [
          // { required: true, trigger: 'blur', message: '姓名不能为空' }
          { required: true, validator: validateSname, trigger: 'blur' }
        ],
        telNoGrip: [
          { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
        ],
        telNoOrg: [
          { required: true, validator: validateTelNo, trigger: 'blur' },
          { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
        ],
        telNoAreaCode: [{ required: true, validator: validateTelNoAreaCode, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.setInfo()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            this.loading = true
            const { id } = this.userInfo
            const { sname, telNo, telNoAreaCode } = this.ruleForm
            const params = { sname, telNo, telNoAreaCode }
            const res = await updateName(params, this.port)
            this.$message({
              message: res.message,
              type: 'success'
            })
            // this.$refs[formName].resetFields()
            this.$emit('getUserInfo')
          } catch (e) {
            console.error(e)
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setInfo() {
      const { telNo, telNoAreaCode, sName } = this.userInfo
      if (telNo && telNo != null) {
        this.ruleForm.telNo = this.userInfo.telNo
      }
      if (telNoAreaCode && telNoAreaCode != null) {
        this.ruleForm.telNoAreaCode = telNoAreaCode
      }
      if (sName && sName != null) {
        this.ruleForm.sname = sName
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .body {
    border-top: 1px solid #ECEFF3;
    display: flex;
    justify-content: center;

    > div {
      padding: 40px 0 30px 0;

      .el-form {
        width: 447px;
        // ::v-deep.el-form-item__label{
        //   float: unset;
        // }
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
              color: #2C76D1;
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
            .area-code{
              input{
                width: 78px;
              }
              width: 78px;
              height: 30px;
              font-size: 13px;
              color: #303030;
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
