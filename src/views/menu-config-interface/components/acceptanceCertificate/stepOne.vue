<template>
  <div>
    <el-form ref="nameFormRef" :model="receiptForm" :rules="rules" label-width="150px" class="receipt-add-step">
      <el-form-item label="验收申请单名称" prop="name">
        <el-input v-model="receiptForm.name" placeholder="请输入验收申请单名称" :disabled="type==='view'" maxlength="50" />
      </el-form-item>
      <el-form-item label="验收申请单英文名称" prop="fullEnName">
        <el-input v-model="receiptForm.fullEnName" placeholder="请输入验收申请单英文名称" :disabled="type==='view'" maxlength="200" />
      </el-form-item>
      <el-form-item label="接口简称" prop="formAbbr">
        <el-input v-model="receiptForm.formAbbr" placeholder="请输入接口简称" :disabled="type==='view'" maxlength="20" />
      </el-form-item>
      <el-form-item label="接口英文简称" prop="enFormAbbr">
        <el-input v-model="receiptForm.enFormAbbr" placeholder="请输入接口英文简称" :disabled="type==='view'" maxlength="200" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <span slot="footer">
        <el-button v-preventReClick type="primary" class="button-primary" @click="nextStep()">下一步</el-button>
        <el-button class="button-default" @click="calcel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    receiptBasicData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入验收申请单名称', trigger: 'blur' }
        ],
        fullEnName: [
          { required: true, message: '请输入验收申请单英文名称', trigger: 'blur' }
        ],
        formAbbr: [
          { required: true, message: '请输入接口简称', trigger: 'blur' }
        ],
        enFormAbbr: [
          { required: true, message: '请输入接口英文简称', trigger: 'blur' }
        ]
      },
      receiptForm: {
        id: '',
        name: '',
        fullEnName: '',
        formAbbr: '',
        enFormAbbr: '',
        formVersion: '',
        formType: ''
      }
    }
  },
  mounted() {
    if (this.receiptBasicData.id !== '0') {
      this.loadReceiptDetail()
    }
  },
  methods: {
    async loadReceiptDetail() {
      const result = await menuConfigApi.getAcceptanceVersionDetail({ formId: this.receiptBasicData.id, formVersion: this.receiptBasicData.formVersion })
      if (result.code === 'ACK') {
        this.receiptForm = result.data
        // 因为后端没有传
        this.receiptForm.formType = this.receiptBasicData.formType
      }
    },
    nextStep() {
      if (this.type !== 'view') {
        this.$refs.nameFormRef.validate(async valid => {
          if (valid) {
            if (this.type === 'add') {
              this.receiptForm.formType = this.receiptBasicData.formType
              this.receiptForm.formVersion = this.receiptBasicData.formVersion
            }
            const result = await menuConfigApi.addModifyAcceptanceVersion(this.receiptForm)
            if (result.code === 'ACK') {
              this.$emit('nextStep', result.data)
            }
          }
        })
      } else {
        this.$emit('nextStep')
      }
    },
    calcel() {
      this.$emit('cancel')
    }
  }
}

</script>

<style lang="scss" scoped>
.dialog-footer {
    background-color: #fff;
    text-align: center;
  }
.receipt-add-step{
  width:520px;
  margin:20px auto;
  ::v-deep.el-input {
    width: 350px;
  }

}
</style>
