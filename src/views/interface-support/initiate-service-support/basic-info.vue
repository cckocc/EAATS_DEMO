<template>
  <div class="basic-panel">
    <el-form
      ref="infoForm"
      class="top-form"
      :model="infoForm"
      :rules="rules"
      label-width="80px"
      label-position="left"
      inline
    >
      <div class="info">
        <span class="title">机构信息</span>
        <hr class="hr">
        <el-row>
          <el-col :span="7">
            <el-form-item label="机构名称" prop="cnFullName">
              <el-input v-model="infoForm.cnFullName" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="统一社会信用代码" prop="instnCd" label-width="130px">
              <el-input v-model="infoForm.instnCd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通讯地址" prop="address">
              <el-input v-model="infoForm.address" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="contact">
        <span class="title">联系人</span>
        <hr class="hr">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="sName">
              <el-input v-model="infoForm.sName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机" class="tel-panel" required>
              <el-form-item class="inner-panel" prop="phoneNoAreaCode">
                <el-select v-model="infoForm.phoneNoAreaCode" placeholder="+86">
                  <el-option
                    v-for="(item,index) in phoneCode"
                    :key="index"
                    :label="'+'+item.prefix"
                    :value="item.prefix"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="inner-panel" prop="phoneNo">
                <el-input v-model="infoForm.phoneNo" placeholder="" clearable />
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="infoForm.email" v-limitBytes="500" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn-row">
          <el-form-item>
            <el-button type="primary" @click="submit">保存并下一步</el-button>
            <el-button @click="cancel('infoForm')">取消</el-button>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validEmail, validPhone, validSocialCode } from '@/utils/validate'
import { isNull } from '@/utils/index.js'
import { prefixDefault } from '@/utils/prefix'
export default {
  name: 'BasicInfo',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error('请输入手机号'))
      } else if (!validPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    const validateSocial = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'))
      } else if (!validSocialCode(value)) {
        callback(new Error('统一社会信用代码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      phoneCode: prefixDefault,
      infoForm: {
        cnFullName: '',
        instnCd: '',
        address: '',
        sName: '',
        phoneNoAreaCode: '86',
        phoneNo: '',
        email: ''
      },
      rules: {
        cnFullName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        instnCd: [
          { required: true, validator: validateSocial, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '通讯地址不能为空', trigger: 'blur' }
        ],
        sName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phoneNo: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    submit() {
      this.$refs['infoForm'].validate(valid => {
        if (valid) {
          this.$emit('setFormData', this.infoForm)
          this.$emit('changeActiveIndex', 2)
        }
      })
    },
    cancel(formName) {
      this.resetForm(formName)
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-panel {
  font-family:Microsoft YaHei;
  padding: 30px;
  display: flex;
  flex-direction: column;
  .title {
    font-weight: 700;
    border-left: 3px solid #2c76d1;
    padding-left: 6px;
    font-size: 18px;
  }
  .hr {
    height:1px;
    border: none;
    border-top:1px solid rgba(209,213,222,1);
    margin-top: 20px;
  }
  .el-form {
    .el-row {
      margin-top: 20px;
    }
    ::v-deep.el-form-item__label {
      font-size:14px;
      font-weight:400;
    }
    ::v-deep.el-input__inner {
      width: 233px;
    }
    .btn-row {
      display: flex;
      margin-top: 30px;
      justify-content: center;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .info {
    .el-col-9 {
      padding-left: 20px;
    }
  }
  .contact {
    margin-top: 30px;
    .tel-panel {
      ::v-deep .el-form-item__content {
        width: 280px;
      }
      .inner-panel {
        ::v-deep.el-input__inner {
          width: 100%!important;
        }
        &:nth-child(1) {
          ::v-deep.el-form-item__content {
            width: 90px;
          }
          width: 30%;
        }
        &:nth-child(2) {
          ::v-deep.el-form-item__content {
            width: 170px;
          }
          margin-right: 0;
          width: 62%;
        }
      }
    }
  }
}
</style>
